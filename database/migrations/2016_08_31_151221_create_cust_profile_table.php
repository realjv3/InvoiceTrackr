<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCustProfileTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('cust_profiles', function (Blueprint $table) {
            $table->integer('cust_id')->primary()->unsigned();
            $table->foreign('cust_id')->references('id')->on('customers')->onDelete('cascade');
            $table->string('addr1', 255)->nullable();
            $table->string('addr2', 255)->nullable();
            $table->string('city', 100)->nullable();
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
        Schema::table('cust_profiles', function (Blueprint $table) {
            $table->dropForeign('cust_profile_cust_id_foreign');
            $table->dropIfExists('cust_profile');
        });
    }
}
