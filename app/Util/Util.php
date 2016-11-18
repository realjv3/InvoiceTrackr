<?php

namespace App\Util;
use Illuminate\Support\Facades\Auth;

class Util
{
    public function get_user_data_for_view() {

        if(Auth::check()) {
            $user = Auth::user()
            ->with('profile', 'customer.cust_profile', 'customer.billable', 'customer.custtrx')
            ->get()
            ->filter(function($item) {
                return $item->email === Auth::user()->email;
            })
            ->first() //so User instance is returned instead of collection
            ->toArray();
            array_splice($user, 2, 4); //don't need the password and timestamp fields
            return json_encode($user);
        } else
            return false;
    }
}