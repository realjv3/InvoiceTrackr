<?php

use Illuminate\Database\Seeder;

class TrxStatusSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('trx_status')->insert(['id' => 0, 'status' => 'Open']);
        DB::table('trx_status')->insert(['id' => 1, 'status' => 'Billed']);
        DB::table('trx_status')->insert(['id' => 2, 'status' => 'Paid']);
    }
}
