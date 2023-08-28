<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration

{
	public $timestamps = false;
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('order_products', function (Blueprint $table) {
            $table->id();
			$table->unsignedBigInteger('product_id');
			$table->unsignedBigInteger('order_id');
			$table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
			$table->foreign('order_id')->references('id')->on('orders')->onDelete('cascade');
			$table->string('value');
            // $table->timestamps(false);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_products');
    }
};
