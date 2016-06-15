<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class Billables extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('billables', function(Blueprint $table) {
            $table->integer('custid')->unsigned();
            $table->string('type', 50);
            $table->string('descr');
            $table->timestamps();
        });

        Schema::table('billables', function(Blueprint $table) {
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
        Schema::drop('billables');
    }
}
