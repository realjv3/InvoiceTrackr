<?php

namespace App\Http\Controllers;
use App\Customer;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

class CustomerController extends Controller
{
    /**
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function save(Request $request) {
        $this->validate($request, ['company' => 'required|max:255', 'first' => 'required|max:255', 'last' => 'required|max:255', 'email' => 'required|max:255|email']);

        //Sanitize
        foreach($_POST as $key => $value)
            $formdata[$key] = filter_var($value, FILTER_SANITIZE_FULL_SPECIAL_CHARS, FILTER_FLAG_NO_ENCODE_QUOTES);

        // Save customer to database
        $user = Auth::user();
        $customer = new Customer($formdata);
        $user->customer()->save($customer);

        return response()->json(['message' => 'The customer was added.', 'cust_id' => $customer->id, 201]);
    }

    /**
     * Deletes a customer record and all of their billables and transactions
     * @return \Illuminate\Http\JsonResponse
     */
    public function delete() {
        Customer::destroy($_POST['cust_id']);
        return response()->json(['message' => 'The customer was deleted.', 'cust_id' => $_POST['cust_id'], 201]);
    }

    public function edit(Request $request) {
        return response()->json(['message' => 'The customer was updated.', 'cust_id' => $_POST['cust_id'], 201]);
    }
}