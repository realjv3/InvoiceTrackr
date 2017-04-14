<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

Route::group(['middleware' => ['web']], function () {

    // Page routes
    Route::get('/', function () {
        return
            (Auth::check()) ? view('pages.trx') : view('pages.landing');
    })->name('home');

    Route::get('/invoices', function () {
        return
            (Auth::check()) ? view('pages.invoices') : view('pages.landing');
    })->name('invoices');

    Route::get('/reports', function () {
        return
            (Auth::check()) ? view('pages.reports') : view('pages.landing');
    })->name('reports');

    // Authentication routes...
    Route::post('auth/login', [
        'uses' => 'Auth\AuthController@postLogin',
        'as' => 'login']
    );
    Route::get('auth/logout', [
        'uses' => 'Auth\AuthController@logout',
        'as' => 'logout']
    );

    // Registration routes...
    Route::post('auth/register', [
        'uses' => 'Auth\AuthController@postRegister',
        'as' => 'register']
    );

    // Profile page
    Route::get('profile', ['as' => 'profile', function($id = null) {
        return view('pages.profile');
    }]);

    // Profile save
    Route::post('profile/save', 'ProfileController@save');

    // Customer crud
    Route::post('save_customer', 'CustomerController@save');
    Route::delete('delete_customer/{cust_id}', 'CustomerController@delete');
    Route::get('read_customer', 'CustomerController@read');

    // Billable crud
    Route::post('save_billable', 'BillablesController@save');
    Route::delete('delete_billable/{billable_id}', 'BillablesController@delete');

    // Trx crud
    Route::post('save_trx', 'CustTrxController@save');
    Route::delete('del_trx/{trx_id}', 'CustTrxController@delete');
    Route::get('get_trx/{custid?}', 'CustTrxController@read');

    // Invoices
    Route::get('create_inv', 'InvoiceController@create');   //using GET instead of POST b/c dompdf
    Route::get('get_inv/{custid?}', 'InvoiceController@read');
    Route::get('get_billable_trx/{custid}', 'InvoiceController@get_billable_trx');
    Route::delete('del_inv/{inv_id}', 'InvoiceController@delete');

    // Util
    Route::get('cur_user', function() {
        return Response::json(\App\Util\UtilFacade::get_user_data_for_view());
    });
});
