<?php
/**
 * Author: John
 * Date: 9/19/2016
 * Time: 5:02 PM
 */

namespace App\Http\Controllers;


use App\Billable;
use App\Customer;
use App\Util\UtilFacade;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class BillablesController extends Controller
{
    /**
     * @param Request $request http request
     * @returns json customer's billables
     */
    public function save(Request $request) {
        $this->validate($request, array(
                'descr' => 'required|string|max:255',
                'type' => array('required', 'alpha', 'regex:/Service|Product/'),
                'unit' => 'required|string|max:15',
                'price' => 'required|numeric|min:0',
            )
        );

        // Sanitize
        $billable = array();
        for($i = 0; $i < count($_POST); $i++) {
            $billable[key($_POST)] = filter_var(current($_POST), FILTER_SANITIZE_FULL_SPECIAL_CHARS, FILTER_FLAG_NO_ENCODE_QUOTES);
            next($_POST);
        }

        // Save billable to database
        $customer = Customer::find($billable['custid']);
        $customer->billable()->updateOrCreate(array('id' => $billable['id']), $billable);

        // sharing Object cur_user, including user's customers and their billables
        $cur_user = UtilFacade::get_user_data_for_view();
        $message = ($_GET['edit'] == 'true') ? 'The billable item was updated.' : 'The billable item was added.';
        return response()->json(['message' => $message, 'cur_user'=> $cur_user, 201]);
    }

    /**
     * Deletes a billable record and all of their transactions
     * @return \Illuminate\Http\JsonResponse
     */
    public function delete() {
        Billable::destroy($_POST['id']);
        //sharing Object cur_user, including user's customers and their billables
        $cur_user = UtilFacade::get_user_data_for_view();
        return response()->json(['message' => 'The billable was deleted.', 'cur_user' => $cur_user, 201]);
    }

}