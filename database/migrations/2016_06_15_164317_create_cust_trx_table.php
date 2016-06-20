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
        Schema::create('cust_trx', function (Blueprint $table) {
            $table->integer('custid')->unsigned();
            $table->string('type', 50);
            $table->decimal('amt', 10, 2);
            $table->timestamps();
        });

        Schema::table('cust_trx', function(Blueprint $table) {
            $table->foreign('custid')->references('id')->on('customers')->onDelete('cascade');
            $table->foreign('type')->references('type')->on('trx_types');
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
