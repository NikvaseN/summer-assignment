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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
			$table->string('name');
			$table->string('price');
			$table->unsignedBigInteger('category');
			$table->foreign('category')->references('id')->on('category')->onDelete('cascade')->name('products_category_foreign');
			$table->string('imageUrl')->nullable();
			$table->string('composition')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
