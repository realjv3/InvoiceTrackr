<?php
/**
 * Author: John
 * Date: 4/24/2017
 * Time: 7:18 PM
 */

namespace App\Http\Controllers;

use App\Invoice;

class ReportsController extends Controller
{
    public function invoice($inv_id) {
        if (!is_int((int) $inv_id))
            return response("$inv_id is an invalid invoice id", 400);
        return Invoice::with('cust_trx')->where('id', $inv_id)->get();
    }
}