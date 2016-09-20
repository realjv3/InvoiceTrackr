<?php
/**
 * Author: John
 * Date: 9/19/2016
 * Time: 5:02 PM
 */

namespace App\Http\Controllers;


class BillablesController extends Controller
{
    /**
     * @returns json customer's billables
     */
    public function get() {
        return response($_REQUEST['id']);
    }
}