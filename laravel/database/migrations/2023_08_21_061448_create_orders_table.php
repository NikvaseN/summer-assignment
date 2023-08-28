<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
			// $table->integer('number');
			$table->unsignedBigInteger('user_id')->nullable();
			$table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
			$table->integer('fullPrice');
			$table->string('methodDelivery');
			$table->string('username')->nullable();
			$table->string('phone')->nullable();
			$table->string('adress')->nullable();
            $table->timestamps();
        });
    }
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
