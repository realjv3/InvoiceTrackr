<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddCustTrxStatusCol extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('cust_trx', function (Blueprint $table) {
            $table->unsignedInteger('status')->after('amt');
            $table->unsignedInteger('inv')->after('amt');
            $table->foreign('status')->references('id')->on('trx_status');
            $table->foreign('inv')->references('id')->on('invoices');
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
            $table->dropForeign('cust_trx_status_foreign');
            $table->dropForeign('cust_trx_inv_foreign');
            $table->dropColumn('status');
            $table->dropColumn('inv');
        });
    }
}
