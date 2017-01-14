<?php

namespace App\Util;
use Illuminate\Support\Facades\Auth;

class Util
{
    public function get_user_data_for_view() {
        if(Auth::check()) {
            $user = Auth::user()
            ->with(
                'profile',
                'customer.cust_profile',
                'customer.billable',
                'customer.custtrx',
                'customer.invoice'
            )
            ->get()
            ->filter(function($item) {
                return $item->email === Auth::user()->email;
            })
            ->transform(function($item) {
                foreach($item->customer as $cust) {
                    foreach($cust->custtrx as $trx) {
                        switch($trx->status) {
                            case 0:
                                $trx->status = 'Open';
                                break;
                            case 1:
                                $trx->status = 'Invoiced';
                                break;
                            case 2:
                                $trx->status = 'Paid';
                                break;
                        }
                    }
                }
                return $item;
            })
            ->first() //so User instance is returned instead of collection
            ->toArray();
            array_splice($user, 2, 4); //don't need the password and timestamp fields
            return json_encode($user);
        } else
            return false;
    }
}