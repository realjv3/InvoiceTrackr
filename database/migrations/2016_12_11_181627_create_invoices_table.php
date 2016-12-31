<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateInvoicesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('invoices', function (Blueprint $table) {
            $table->increments('id');
            $table->date('invdt');
            $table->integer('user_id')->unsigned();
            $table->integer('custid')->unsigned();
            $table->decimal('amt', 5 , 2);

            $table->foreign('user_id')->references('id')->on('users');
//TODO            $table->foreign('custid')->references('id')->on('customers');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('invoices', function (Blueprint $table) {
            $table->dropForeign('invoices_user_id_foreign');
            $table->dropForeign('invoices_custid_foreign');
            $table->dropIfExists('invoices');
        });
    }
}
