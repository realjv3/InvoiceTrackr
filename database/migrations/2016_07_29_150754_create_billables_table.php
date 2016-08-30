<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateBillablesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('billables', function(Blueprint $table) {
            $table->increments('id');
            $table->integer('custid')->unsigned();
            $table->string('type', 50);
            $table->string('descr')->nullable();
            $table->timestamps();

            $table->foreign('custid')->references('id')->on('customers')->onDelete('cascade');
            $table->foreign('type')->references('type')->on('billable_types');
            });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('billables', function(Blueprint $table) {
            $table->dropForeign('billables_custid_foreign');
            $table->dropForeign('billables_type_foreign');
            $table->drop('billables');
        });
    }
}
