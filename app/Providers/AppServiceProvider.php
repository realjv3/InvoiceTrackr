<?php

namespace App\Providers;

use Illuminate\Contracts\View\View;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Auth;
use App\Util\UtilFacade;
use App\Util\Util;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        //sharing logged in user's data with a bunch of views
        view()->composer([
            'pages.landing',
            'pages.trx',
            'pages.profile',
            'pages.invoices',
            'pages.reports'
        ], function(View $view) {
            //sharing boolean logged_in
            $logged_in = Auth::check();
            $view->with('logged_in', (($logged_in) ? $logged_in : 0));

            //sharing Object cur_user which includes user's customers and their billables
            $user = UtilFacade::get_user_data_for_view();
            $view->with('cur_user', (Auth::check()) ? $user : 0);
        });
    }

    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->bind('App\Util', function($app) {
            return new Util;
        });

        $this->app->bind('App\PdfMaker\PdfMaker', 'App\PdfMaker\InvoiceMaker');
    }
}
