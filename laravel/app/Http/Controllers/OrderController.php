<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\Order_product;
use Illuminate\Support\Facades\Validator;

class OrderController extends Controller
{
	
	public function show(Request $request)
    {
		$orders =  Order::with('orderProducts.product')->get();
		$orders->each(function ($order) {
			$order->orderProducts->each(function ($orderProduct) {
				$orderProduct->makeHidden(['order_id']);
				$orderProduct->makeHidden(['product_id']);
				$orderProduct->makeHidden(['id']);
			});
		});

		return $orders;
	}

	public function user(Request $request)
    {
		$id =  auth()->user()->id;

		$orders =  Order::where('user_id', $id)->with('orderProducts.product')->get();

		$orders->each(function ($order) {
			$order->orderProducts->each(function ($orderProduct) {
				$orderProduct->makeHidden(['order_id']);
				$orderProduct->makeHidden(['product_id']);
				$orderProduct->makeHidden(['id']);
			});
		});

		return $orders;
	}

	public function store(Request $request)
    {
		// Получение списка товаров из запроса с фронтенда
		$productsData = $request->input('products');

		// Создание заказа
		
		$orderData = [
			'methodDelivery' => $request->methodDelivery,
			'fullPrice' => $request->fullPrice,
		];
		// 'username' => $request->username,
		// 	'phone' => $request->phone,
		// 	'adress' => $request->adress,

		if ($request->has('user')) {
			$orderData['user_id'] = $request->user;
		}

		if ($request->methodDelivery === 'delivery'){

			$validator = Validator::make($request->all(), [
				'username' => 'required|string|max:128',
				'phone' => 'required|min:11|max:11',
				'adress' => 'required|string|max:256',
				'products' => 'required',
			]);

			if ($validator->fails()) {
				$errors = $validator->errors();
		
				return response()->json(['errors' => $errors], 422);
			}

			$orderData['username'] = $request->username;
			$orderData['phone'] = $request->phone;
			$orderData['adress'] = $request->adress;

		}
		
		$order = Order::create($orderData);
		
		// return $order;

		// Сохранение товаров для заказа
		foreach ($productsData as $productData) {
			$product = Order_product::create([
				'product_id' => $productData['product'],
				'order_id' => $order->id,
				'value' => $productData['value'],
			]);

			// Связывание товара с заказом и сохранение
			// $order->products()->save($product);
		}

		// Ответ, например:
		return response()->json(['message' => 'Заказ создан успешно']);
	}
}
