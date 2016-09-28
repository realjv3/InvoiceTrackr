<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateProfilesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('profiles', function(Blueprint $table) {
            $table->integer('user_id')->primary()->unsigned();
            $table->string('company', 200)->nullable();
            $table->string('first', 50)->nullable();
            $table->string('last', 50)->nullable();
            $table->string('email');
            $table->string('addr1', 255)->nullable();
            $table->string('addr2', 255)->nullable();
            $table->string('city', 100)->nullable();
            $table->string('state')->nullable();
            $table->char('zip', 10)->nullable();
            $table->char('cell', 30)->nullable();
            $table->char('office', 30)->nullable();
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('profiles', function(Blueprint $table) {
            $table->dropForeign('profiles_user_id_foreign');
            $table->dropIfExists('profiles');
        });
    }
}
