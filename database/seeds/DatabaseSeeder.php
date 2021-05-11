<?php

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
         $this->call(BillableTypesSeeder::class);
         $this->call(TrxStatusSeeder::class);
         $this->call(FirstInvoiceRecord::class);
    }
}
