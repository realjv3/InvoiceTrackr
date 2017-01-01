<?php

use App\Customer;
use App\User;
use Illuminate\Database\Seeder;

class FirstInvoiceRecord extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('invoices')->insert(['id' => 0, 'invdt' => date("Y-m-d"), 'user_id' => User::first()->id, 'custid' => Customer::first()->id]);
    }
}
