<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ContactRecs extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('contact_recs', function(Blueprint $table) {
            $table->integer('custid')->unsigned();
            $table->string('addr1', 255)->nullable();
            $table->string('addr2', 255)->nullable();
            $table->string('state')->nullable();
            $table->char('zip', 10)->nullable();
            $table->char('cell', 30)->nullable();
            $table->char('office', 30)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('contact_recs');
    }
}
