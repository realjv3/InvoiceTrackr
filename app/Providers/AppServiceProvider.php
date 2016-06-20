<?php

namespace App\Providers;

use Illuminate\Contracts\View\View;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Auth;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        //sharing user stuff with a bunch of views
        view()->composer(['content', 'slogan', 'profile'], function(View $view) {

            //sharing boolean logged_in
            $logged_in = Auth::check();
            $view->with('logged_in', (($logged_in) ? $logged_in : 0));

            //sharing Object cur_user
            if($logged_in) {
                $user = Auth::user()->with('profile')->get();
                $cur_user = ($logged_in) ? $user->toJson() : 0;
                $view->with('cur_user', $cur_user);
            } else {
                $view->with('cur_user', 0);
            }
        });
    }

    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }
}
