<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\FavoriteController;
use App\Models\Order;
use App\Models\Product;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('/auth/register', [ UserController::class, 'store']);
Route::post('/auth/register/admin', [ UserController::class, 'admin']);
Route::post('/auth/login', [ UserController::class, 'login']);

Route::get('/products', [ProductController::class, 'show']);
Route::get('/products/category/{category}', [ProductController::class, 'show_category']);

Route::post('/orders', [ OrderController::class, 'store']);
// Route::get('/orders', [ OrderController::class, 'show']);


Route::get('/get-csrf-token', function () {
    return response()->json(['csrf_token' => csrf_token()]);
});

Route::group(['middleware' => ['auth:sanctum']], function () {
	Route::get('/auth/logout', [ UserController::class, 'logout']);
	Route::get('/auth/me', [ UserController::class, 'index']);
	Route::get('/orders/history', [ OrderController::class, 'user']);
	Route::post('/favorites', [ FavoriteController::class, 'toggle']);
	Route::get('/favorites', [ FavoriteController::class, 'user']);
	Route::get('/favorites/all', [ FavoriteController::class, 'allUser']);
});

Route::group(['middleware' => ['auth:sanctum', 'admin']], function () {
    Route::post('/category', [CategoryController::class, 'store']);
    Route::post('/products', [ProductController::class, 'store']);
    Route::post('/products/search', [ProductController::class, 'search']);
    Route::post('/uploads', [ProductController::class, 'uploads']);
    Route::delete('/products/{id}', [ProductController::class, 'destroy']);
    Route::patch('/products/{id}', [ProductController::class, 'update']);
});


