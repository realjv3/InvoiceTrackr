<?php

namespace App\Http\Controllers;

use App\Billable;
use App\CustTrx;
use App\Customer;
use Illuminate\Http\Request;
use App\Util\UtilFacade;

class CustTrxController extends Controller
{
    /**
     * @param Request $request http request
     * @return Request
     */
    public function save(Request $request) {
        $this->validate($request, array(
            'trxdt' => 'required|date',
            'customer' => 'required|string|max:255',
            'qty' => array('required', 'regex:/(\d+|\d{2}:\d{2}:\d{2})/'),
            'billable' => 'required|string|max:255',
            'descr' => 'string|max:255',
            'amt' => 'required|regex:/\$ [\d]+.[\d]{2}/',
        ));

        // Sanitize
        $trx = array();
        unset($_POST['qty']);
        for($i = 0; $i < count($_POST); $i++) {
            $trx[key($_POST)] = filter_var(current($_POST), FILTER_SANITIZE_FULL_SPECIAL_CHARS, FILTER_FLAG_NO_ENCODE_QUOTES);
            next($_POST);
        }

        // Save transaction to database
        $customer = Customer::where('company', $trx['customer'])->firstOrFail();
        $billable = Billable::where('descr', $trx['billable'])->firstOrFail();
        $trx['custid'] = $customer->id;
        $trx['item'] = $billable->id;
        unset($trx['customer']);
        unset($trx['billable']);
        $trx['amt'] = substr($trx['amt'], 2);
        if(isset($trx['id']) && $trx['id'] != '') {
            $transaction = CustTrx::find($trx['id']);
            $transaction->update($trx);
        }
        else
            CustTrx::create($trx);

        // sharing Object cur_user, including user's customers and their billables & trx
        $cur_user = UtilFacade::get_user_data_for_view();
        return response()->json(['cur_user'=> $cur_user, 201]);
    }

    /**
     * @param int $trx_id
     * @return Request
     */
    public function delete($trx_id) {
        CustTrx::destroy($trx_id);
        //sharing Object cur_user, including user's customers and their billables & trx
        $cur_user = UtilFacade::get_user_data_for_view();
        return response()->json(['cur_user' => $cur_user, 201]);
    }
}
