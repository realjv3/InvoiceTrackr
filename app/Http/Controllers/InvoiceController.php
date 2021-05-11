<?php
/**
 * Author: John
 * Date: 12/5/2016
 * Time: 3:40 PM
 */
namespace App\Http\Controllers;

use App\CustTrx;
use App\Invoice;
use App\PdfMaker\PdfMaker;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Pagination\LengthAwarePaginator;
use App\Util\UtilFacade;
use Mpdf\Mpdf;
use Symfony\Component\HttpFoundation\Response;

class InvoiceController extends Controller
{
    /**
     * @var PdfMaker
     */
    private $pdfMaker;

    /**
     * InvoiceController constructor.
     * @param PdfMaker $pdfMaker
     */
    public function __construct(PdfMaker $pdfMaker) {
        $this->pdfMaker = $pdfMaker;
    }

    /**
     * @param Request $request
     * @return \Illuminate\Contracts\Routing\ResponseFactory|\Symfony\Component\HttpFoundation\Response
     */
    public function create(Request $request) {
        //get the transactions being invoiced
        $trx_ids = explode(',', $request->input('trx_keys'));
        array_shift($trx_ids);
        if (count($trx_ids) < 1) return response('No transactions to invoice.', 422);

        //save an invoice record to database
        $invoice = new Invoice;
        $invoice->invno = filter_var($_GET['invno'], FILTER_SANITIZE_FULL_SPECIAL_CHARS, FILTER_FLAG_NO_ENCODE_QUOTES);
        $invoice->invdt = date('Y-m-d');
        $invoice->duedt = ! empty($request->input('duedt')) ? date('Y-m-d', strtotime(substr($request->input('duedt'), 0, 16))) : null;
        $invoice->user_id = Auth::user()->id;
        $custid = CustTrx::find(substr($trx_ids[0], 7))->custid;
        $invoice->custid = $custid;
        $invoice->amt = $request->input('total');
        $invoice->save();

        $trxs = new Collection;
        for ($i = 0; $i < count($trx_ids); $i++) {
            $trx_id = substr($trx_ids[$i], 7);
            $trx = CustTrx::find($trx_id);
            $trxs->push($trx);
        }
        $trxs = $this->markTrxsAsInvoiced($trxs, $invoice->id);

        return response($this->makePdf($trxs, $invoice), 200, ['Content-Type' => 'application/pdf']);
    }

    /**
     * @param Collection $trxs
     * @param int $invId
     * @return Collection
     */
    private function markTrxsAsInvoiced(Collection $trxs, int $invId) : Collection {
        $trxs->each(function($trx) use ($invId) {
            $trx->status = 1;
            $trx->inv = $invId;
            $trx->save();
        });
        return $trxs;
    }

    /**
     * @param Collection $trxs
     * @param Invoice $invoice
     * @return mixed
     */
    private function makePdf(Collection $trxs, Invoice $invoice) {
        return $this->pdfMaker
            ->setPdfLib(new Mpdf([
                'margin_left' => 20,
                'margin_right' => 15,
                'margin_top' => 48,
                'margin_bottom' => 25,
                'margin_header' => 10,
                'margin_footer' => 10
            ]))
            ->setTrxs($trxs)
            ->setInvoice($invoice)
            ->create();
    }

    /**
     * Returns all customer's invoices or only the passed custid's invoices
     * @param int $custid default null
     * @return Response|LengthAwarePaginator
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
     * @return Response|LengthAwarePaginator
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
            $trx->inv = null;
            $trx->status = 0;
            $trx->save();
        }
        Invoice::destroy($inv_id);
        //sharing Object cur_user, including user's customers and their billables & trx
        $cur_user = UtilFacade::get_user_data_for_view();
        return response()->json(['cur_user' => $cur_user, 201]);
    }
}