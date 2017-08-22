<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CustTrxAddForeignKeys extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('cust_trx', function (Blueprint $table) {
            $table->foreign('status')->references('id')->on('trx_status');
            $table->foreign('inv')->references('id')->on('invoices');
            $table->foreign('custid')->references('id')->on('customers')->onDelete('cascade');
            $table->foreign('item')->references('id')->on('billables')->onDelete('cascade');
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
            $table->dropForeign('cust_trx_custid_foreign');
            $table->dropForeign('cust_trx_status_foreign');
            $table->dropForeign('cust_trx_inv_foreign');
            $table->dropForeign('cust_trx_item_foreign');
        });
    }
}
