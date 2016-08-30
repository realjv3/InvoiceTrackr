<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCustTrxTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('cust_trx', function (Blueprint $table) {
            Schema::create('cust_trx', function (Blueprint $table) {
                $table->increments('id');
                $table->date('trxdt');
                $table->integer('custid')->unsigned();
                $table->integer('item')->unsigned();
                $table->text('descr')->nullable();
                $table->decimal('amt', 5 , 2);

                $table->foreign('custid')->references('id')->on('customers');
                $table->foreign('item')->references('id')->on('billables');
            });
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('cust_trx');
    }
}
