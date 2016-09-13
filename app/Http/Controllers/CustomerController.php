<?php

namespace App\Http\Controllers;
use App\Customer;
use App\Cust_profile;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

class CustomerController extends Controller
{
    /**
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function save(Request $request) {
        $this->validate($request, array(
            'company' => 'required|max:255',
            'first' => 'required|max:255',
            'last' => 'required|max:255',
            'email' => 'required|max:255|email',
            'addr1' => 'max:255',
            'addr2' => 'max:255',
            'city' => 'alpha_dash|max:255',
            'state' => 'alpha',
            'zip' => 'max:11',
            'cell' => 'max:14',
            'office' => 'max:14'
            )
        );

        //Sanitize
        $customer = array();
        $cust_profile = array();

        for($i = 0; $i < count($_POST); $i++) {
            if($i < 5) {
                $customer[key($_POST)] = filter_var(current($_POST), FILTER_SANITIZE_FULL_SPECIAL_CHARS, FILTER_FLAG_NO_ENCODE_QUOTES);
                next($_POST);
            }
            else {
                $cust_profile[key($_POST)] = filter_var(current($_POST), FILTER_SANITIZE_FULL_SPECIAL_CHARS, FILTER_FLAG_NO_ENCODE_QUOTES);
                next($_POST);
            }
        }

        // Save customer to database
        $user = Auth::user();
        $id = array_shift($customer);
        $cust = $user->customer()->updateOrCreate(array('id' => $id), $customer);
        $cust->cust_profile()->updateOrCreate(array('cust_id' => $id), $cust_profile);

        //sharing Object cur_user, including user's customers and their billables
        $user = $user
            ->with('profile', 'customer.cust_profile')
            ->get()
            ->filter(function($item) {
                return $item->email === Auth::user()->email;
            })
            ->first(); //so User instance is returned instead of collection
        $cur_user = $user->toJson();

        $message = ($_GET['edit'] == true) ? 'The customer was updated.' : 'The customer was added.';
        return response()->json(['message' => $message, 'cur_user'=> $cur_user, 201]);
    }

    /**
     * Deletes a customer record and all of their billables and transactions
     * @return \Illuminate\Http\JsonResponse
     */
    public function delete() {
        Customer::destroy($_POST['cust_id']);
        return response()->json(['message' => 'The customer was deleted.', 'cust_id' => $_POST['cust_id'], 201]);
    }

    public function read(Request $request) {
        $customer = Customer::find($_GET['cust_id']);
        return response()->json(['customer' => $customer, 200]);
    }
}