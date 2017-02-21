<?php

namespace App\Util;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\CustTrxController;

class Util
{
    public function get_user_data_for_view() {
        if(Auth::check()) {
            $user = Auth::user()
            ->with(
                'profile',
                'customer.cust_profile',
                'customer.billable',
                'customer.invoice'
            )
            ->get()
            ->filter(function($item) {
                return $item->email === Auth::user()->email;
            })
            ->first() //so User instance is returned instead of collection
            ->toArray();

            array_splice($user, 2, 4); //don't need the password and timestamp fields

            $custCntlr = new CustTrxController;
            for($i = 0; $i < count($user['customer']); $i++) {
                $custtrx = $custCntlr->read($user['customer'][$i]['id']);
                $user['customer'][$i]['custtrx'] = $custtrx;
            }
            return json_encode($user);
        } else
            return false;
    }
}