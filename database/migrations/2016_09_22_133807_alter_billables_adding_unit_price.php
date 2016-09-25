<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AlterBillablesAddingUnitPrice extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('billables', function (Blueprint $table) {
            $table->string('unit', 5)->after('descr');
            $table->decimal('price', 10, 2)->after('unit');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('billables', function (Blueprint $table) {
            $table->dropColumn(['unit', 'price']);
        });
    }
}
