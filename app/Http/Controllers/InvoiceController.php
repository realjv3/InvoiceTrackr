<?php
/**
 * Author: John
 * Date: 12/5/2016
 * Time: 3:40 PM
 */
namespace App\Http\Controllers;
use App\CustTrx;
use App\Invoice;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Auth;
use Illuminate\Pagination\LengthAwarePaginator;
use App\Util\UtilFacade;

class InvoiceController extends Controller
{
    public function create() {
        //get the transactions being invoiced
        $trx_ids = explode(',', $_GET['trx_keys']);
        array_shift($trx_ids);
        if(count($trx_ids) < 1) return response('No transactions to invoice.', 422);
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

        //update trx statuses
        foreach($trx_ids as $trx_id) {
            $trx_id = substr($trx_id, 7);
            $trx = CustTrx::find($trx_id);
            $trx->status = 1;
            $trx->inv = $invoice->id;
            $trx->save();
        }

        //make a pdf
        $pdf = App::make('dompdf.wrapper');
        $pdf->loadHTML($_GET['content']);
        return $pdf->stream();
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