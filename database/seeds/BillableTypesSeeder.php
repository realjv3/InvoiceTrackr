<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BillableTypesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('billable_types')->insert(['type' => 'Product']);
        DB::table('billable_types')->insert(['type' => 'Service']);
    }
}
