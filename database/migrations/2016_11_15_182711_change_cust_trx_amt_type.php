<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ChangeCustTrxAmtType extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('cust_trx', function (Blueprint $table) {
            $table->decimal('amt', 10, 2)->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('cust_trx', function (Blueprint $table) {
            $table->decimal('amt', 5, 2)->change();
        });
    }
}
