<?php

namespace App\Http\Controllers;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Auth;
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
        $customer = Customer::where('company', $trx['customer'])->with(['Billable' => function($query) use ($trx) {
            $query->where('descr', '=', $trx['billable']);
        }])->firstOrFail()->toArray();
        $trx['custid'] = $customer['id'];
        $trx['item'] = $customer['billable'][0]['id'];
        unset($trx['customer']);
        unset($trx['billable']);
        $trx['descr'] = html_entity_decode($trx['descr']);
        $trx['amt'] = substr($trx['amt'], 2);
        if(isset($trx['id']) && $trx['id'] != '') {
            $transaction = CustTrx::find($trx['id']);
            $transaction->update($trx);
        } else {
            CustTrx::create($trx);
        }

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

    /**
     * Returns all user's transactions or only the passed custid's transactions
     * @param int $custid default null
     * @param boolean $paginate default true
     * @return json string $trx
     */
    public function read($custid = null, $paginate = true) {
        if(isset($_REQUEST['sort']) && !empty($_REQUEST['sort'])) {
            $sortby =  filter_var($_REQUEST['sort'], FILTER_SANITIZE_STRING);
            $desc = (isset($_REQUEST['desc'])) ? 'Desc' : '';
        } else {
            $sortby = 'trxdt';
            $desc = 'Desc';
        }

        if(isset($custid)) {    //grab customer's trxs
            $user = Auth::user()
                ->with('customer.custtrx')
                ->get();
            foreach($user[0]->customer as $cust)
                if($cust->id == $custid)
                    $trxs = $cust->custtrx->transform(
                        function ($trx) {
                            switch ($trx->status) {
                                case 0:
                                    $trx->status = 'Open';
                                    return $trx;
                                case 1:
                                    $trx->status = 'Invoiced';
                                    return $trx;
                                case 2:
                                    $trx->status = 'Paid';
                                    return $trx;
                            }
                        }
                    );
            if(isset($trxs))
                $trxs = call_user_func(array($trxs, 'sortBy'.$desc), $sortby);  //sort
            else
                return response('No transactions for this customer', 404);
        } else {    //grab all customers' trxs
            $user = Auth::user()
                ->with('customer.custtrx')
                ->get();
            $trxs = new Collection();
            foreach($user[0]->customer as $cust) {
                $custtrx = $cust->custtrx->transform(
                    function ($trx) {
                        switch ($trx->status) {
                            case 0:
                                $trx->status = 'Open';
                                return $trx;
                            case 1:
                                $trx->status = 'Invoiced';
                                return $trx;
                            case 2:
                                $trx->status = 'Paid';
                                return $trx;
                        }
                    }
                );
                //sort
                $custtrx = call_user_func(array($trxs, 'sortBy'.$desc), $sortby);
                $trxs->push($custtrx);
            }
            if($trxs->isEmpty())
                return response('There are no transactions', 404);
        }

        if ($paginate === true) {
            $total = count($trxs->flatten());
            $currentPage = (isset($_REQUEST['page']) && preg_match('/\d+/', $_REQUEST['page'])) ? $_REQUEST['page'] : 1;
            $perPage = 10;
            $max = ceil($total / $perPage);
            if($currentPage > $max)
                $currentPage = $max;
            $offset = ($currentPage * $perPage) - $perPage;
            $trxs = new LengthAwarePaginator(array_slice($trxs->toArray(), $offset, $perPage), $total, $perPage, $currentPage);
        }

        return $trxs;
    }
}
