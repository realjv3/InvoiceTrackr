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

class InvoiceController extends Controller
{
    public function create() {
        //get the transactions being invoiced
        $trx_ids = explode(',', $_GET['trx_keys']);
        array_shift($trx_ids);
        if(count($trx_ids) < 1) return; //TODO return proper error
        $custid = CustTrx::find(substr($trx_ids[0], 7))->custid;

        //save an invoice record to database
        $invoice = new Invoice;
        $invoice->invdt = date('Y-m-d');
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
}