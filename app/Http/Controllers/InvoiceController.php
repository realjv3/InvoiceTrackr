<?php
/**
 * Author: John
 * Date: 12/5/2016
 * Time: 3:40 PM
 */
namespace App\Http\Controllers;
use App\Billable;
use App\Cust_profile;
use App\Customer;
use App\CustTrx;
use App\Invoice;
use App\Profile;
use FPDF;
use Illuminate\Support\Facades\Auth;
use Illuminate\Pagination\LengthAwarePaginator;
use App\Util\UtilFacade;

class InvoiceController extends Controller
{
    public function create() {
        //get the transactions being invoiced
        $trx_ids = explode(',', $_GET['trx_keys']);
        array_shift($trx_ids);
        if (count($trx_ids) < 1) return response('No transactions to invoice.', 422);
        $custid = CustTrx::find(substr($trx_ids[0], 7))->custid;

        //save an invoice record to database
        $invoice = new Invoice;
        $invoice->invno = filter_var($_GET['invno'], FILTER_SANITIZE_FULL_SPECIAL_CHARS, FILTER_FLAG_NO_ENCODE_QUOTES);
        $invoice->invdt = date('Y-m-d');
        $invoice->duedt = date('Y-m-d', strtotime(substr($_GET['duedt'], 0, 16)));
        $invoice->user_id = Auth::user()->id;
        $invoice->custid = $custid;
        $invoice->amt = $_GET['total'];
        $invoice->save();

        //make a pdf
        $pdf = new FPDF('P', 'mm', 'Letter');
        $pdf->AddPage();
        /**
         * Invoice header
         */
        $pdf->SetFont('Arial', '', 10);
        $pdf->Cell(40, 4, 'Invoice number: ' . $invoice->invno, 0, 3);
        $pdf->Cell(70, 4, 'Invoice Date: ' . $invoice->invdt, 0, 3);
        $pdf->Cell(70, 4, 'Due Date: ' . $invoice->duedt, 0, 3);
        $pdf->Ln();

        $pdf->SetFont('Arial', '', 14);
        $profile = Profile::find(Auth::user()->id);
        $name = $profile->first . ' ' . $profile->last;
        $pdf->Cell(200, 8, $name, 0, 3);
        if ($profile->company != $name) {
            $pdf->Cell(200, 4, $profile->company, 0, 3);
        }

        $pdf->SetFont('Arial', '', 8);
        if (!empty($profile->addr1)) {
            $pdf->Cell(200, 4, $profile->addr1, 0, 3);
        }
        if (!empty($profile->addr2)) {
            $pdf->Cell(200, 4, $profile->addr2, 0, 3);
        }
        if (!empty($profile->city) && !empty($profile->state) && !empty($profile->zip)) {
            $pdf->Cell(200, 4, $profile->city . ', ' . $profile->state . ' ' . $profile->zip, 0, 3);
        }
        if (!empty($profile->office) && $profile->office != $profile->cell) {
            $pdf->Cell(200, 4, $profile->office, 0, 3);
        }
        if (!empty($profile->cell)) {
            $pdf->Cell(200, 4, $profile->cell, 0, 3);
        }
        $pdf->Cell(200, 4, Auth()->user()->email, 0, 3);

        $pdf->SetFont('Arial', '', 14);
        $pdf->Cell(200, 8, 'Bill to:', 0, 3);
        $pdf->SetFont('Arial', '', 10);
        $custProfile = Cust_profile::find($custid);
        $cust = Customer::find($custid);
        $pdf->Ln();
        if ( ! empty($cust->first) && ! empty($cust->last)) {
            $pdf->Cell(200, 4, $cust->first . ' ' . $cust->last, 0, 3);
        }
        if ( ! empty($cust->company)) {
            $pdf->Cell(200, 4, $cust->company, 0, 3);
        }
        $pdf->SetFont('Arial', '', 8);
        if ( ! empty($custProfile->addr1)) {
            $pdf->Cell(200, 4, $custProfile->addr1, 0, 3);
        }
        if ( ! empty($custProfile->addr2)) {
            $pdf->Cell(200, 4, $custProfile->addr2, 0, 3);
        }
        if ( ! empty($custProfile->city) && ! empty($custProfile->state) && ! empty($custProfile->zip)) {
            $pdf->Cell(200, 4, $custProfile->city . ', ' . $custProfile->state . ' ' . $custProfile->zip, 0, 3);
        }
        if ( ! empty($cust->email)) {
            $pdf->Cell(200, 4, $cust->email, 0, 3);
        }
        /**
         * Invoice line items
         */
        $pdf->SetFont('Arial', 'B', 10);
        $pdf->Cell(25, 10, 'Trx Date');
        $pdf->Cell(35, 10, 'Billable');
        $pdf->Cell(77, 10, 'Description');
        $pdf->Cell(35, 10, 'Quantity');
        $pdf->Cell(13, 10, 'Amount');
        $pdf->Ln();

        $pdf->SetFont('Arial', '', 10);
        for ($i = 0; $i < count($trx_ids); $i++) {
            if ($i > 0 && $i % 20 == 0) {
                $pdf->AddPage();
            }
            $trx_id = substr($trx_ids[$i], 7);
            $trx = CustTrx::find($trx_id);
            $trx->status = 1;
            $trx->inv = $invoice->id;
            $trx->save();
            $billable = Billable::find($trx->item);
            $pdf->Cell(25, 8, $trx->trxdt);
            $pdf->Cell(35, 8, substr($billable->descr, 0, 20));
            $pdf->Cell(77, 8, substr($trx->descr, 0, 46));
            $pdf->Cell(35, 8, $trx->amt / $billable->price . ' x $' . $billable->price . '/' . $billable->unit);
            $pdf->Cell(13, 8, $trx->amt);
            $pdf->Ln();
        }
        $pdf->SetFont('Arial', 'B', 12);
        $pdf->Ln();
        $pdf->Cell(80, 12, 'Total $' . $invoice->amt, 1);
        return response($pdf->Output(), 200, ['Content-Type' => 'application/pdf']);
    }

    /**
     * Returns all customer's invoices or only the passed custid's invoices
     * @param int $custid default null
     * @return json string $trx
     */
    public function read($custid = null) {
        if(isset($_REQUEST['sort']) && !empty($_REQUEST['sort'])) {
            $sortby =  filter_var($_REQUEST['sort'], FILTER_SANITIZE_STRING);
            $desc = (isset($_REQUEST['desc'])) ? 'Desc' : '';
        } else {
            $sortby = 'invdt';
            $desc = 'Desc';
        }

        if(isset($custid)) {    //grab customer's invoices
            $user = Auth::user()
                ->with('customer.invoice')
                ->get();
            foreach($user[0]->customer as $cust)
                if($cust->id == $custid)
                    $invoices = $cust->invoice;
            if(isset($invoices))
                $invoices = call_user_func(array($invoices, 'sortBy'.$desc), $sortby);  //sort
            else
                return response('No invoices for this customer', 404);
        } else {    //grab all customers' invoices
            $user = Auth::user()
                ->with('customer.invoices')
                ->get();
            $invoices = new Collection();
            foreach($user[0]->customer as $cust) {
                $invoices = $cust->invoice;
                //sort
                $invoices = call_user_func(array($invoices, 'sortBy'.$desc), $sortby);
                $invoices->push($invoices);
            }
            if($invoices->isEmpty())
                return response('There are no invoices.', 404);
        }

        //paginate
        $total = count($invoices->flatten());
        $currentPage = (isset($_REQUEST['page']) && preg_match('/\d+/', $_REQUEST['page'])) ? $_REQUEST['page'] : 1;
        $perPage = 5;
        $max = ceil($total / $perPage);
        if($currentPage > $max)
            $currentPage = $max;
        $offset = ($currentPage * $perPage) - $perPage;
        $invoices = new LengthAwarePaginator(array_slice($invoices->toArray(), $offset, $perPage), $total, $perPage, $currentPage);

        return $invoices;
    }

    /**
     * Returns the passed custid's open transactions
     * @param int $custid default null
     * @return json string $trx
     */
    public function get_billable_trx($custid = null) {
        if(!isset($custid))
            return response('No customer id specified.', 422);

        if(isset($_REQUEST['sort']) && !empty($_REQUEST['sort'])) {
            $sortby =  filter_var($_REQUEST['sort'], FILTER_SANITIZE_STRING);
            $desc = (isset($_REQUEST['desc'])) ? 'Desc' : '';
        } else {
            $sortby = 'trxdt';
            $desc = 'Desc';
        }

        $user = Auth::user()
            ->with('customer.custtrx')
            ->get();
        if(count($user)) {
            foreach($user[0]->customer as $cust)
                if($cust->id == $custid)
                    $trxs = $cust->custtrx
                    ->filter(function ($trx) { return $trx->status == 0;})
                    ->transform(
                        function ($trx) {
                            if ($trx->status == 0) {
                                $trx->status = 'Open';
                                return $trx;
                            }
                        }
                    );
            if(isset($trxs))
                $trxs = call_user_func(array($trxs, 'sortBy'.$desc), $sortby);  //sort
            else
                return response('No open transactions for this customer', 404);
        }

        //paginate
        $total = count($trxs->flatten());
        $currentPage = (isset($_REQUEST['page']) && preg_match('/\d+/', $_REQUEST['page'])) ? $_REQUEST['page'] : 1;
        $perPage = 10;
        $max = ceil($total / $perPage);
        if($currentPage > $max)
            $currentPage = $max;
        $offset = ($currentPage * $perPage) - $perPage;
        $trxs = new LengthAwarePaginator(array_slice($trxs->toArray(), $offset, $perPage), $total, $perPage, $currentPage);

        return $trxs;
    }

    /**
     * @param int $inv_id
     * @return Response
     */
    public function delete($inv_id) {
        if(!isset($inv_id)) return response('Invalid invoice id.', 422);

        $trxs = CustTrx::where('inv', $inv_id)->get();
        foreach ($trxs as $trx) {
            $trx->inv = 0;
            $trx->status = 0;
            $trx->save();
        }
        Invoice::destroy($inv_id);
        //sharing Object cur_user, including user's customers and their billables & trx
        $cur_user = UtilFacade::get_user_data_for_view();
        return response()->json(['cur_user' => $cur_user, 201]);
    }
}