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

    Route::get('/', function () {
        return
            (Auth::check()) ? view('content') : view('slogan');
    })->name('home');

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
    Route::get('profile', ['middleware' => 'auth', 'as' => 'profile', function($id = null) {
        return view('profile');
    }]);

    // Profile save
    Route::post('profile/save', 'ProfileController@save');
});
