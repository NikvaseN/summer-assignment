<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class ProductController extends Controller
{
	public function show(Request $request)
    {
		return Product::all();
    }

	public function show_category(Request $request)
    {
		return  DB::table('products')->where('category', $request->category)->get()->toArray();
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
			'name' => 'required|string|max:64',
			'price' => 'required|string|max:18',
			'category' => 'required|string|max:256',
			'imageUrl' => 'string|max:512',
			'composition' => 'string|max:512',
		]);

		if ($validator->fails()) {
			$errors = $validator->errors();
	
			return response()->json(['errors' => $errors], 422);
		}
		
        $category = new Product();
		$category->name = $request->name;
		$category->price = $request->price;
		$category->category = $request->category;
		$category->imageUrl = $request->imageUrl;
		$category->composition = $request->composition;
		$category->save();

		return response($category, 201);
    }

    public function search(Request $request)
    {
		$search = $request->input('name', '');
		$items = Product::where('name', 'like', '%' . $search . '%')
			->orWhere('composition', 'like', '%' . $search . '%')
			->get();

		return response()->json($items);
    }

    public function uploads(Request $request)
    {

		$validator = Validator::make($request->all(), [
			'image' => 'required|image:jpg,jpeg,png',
		]);

		if ($validator->fails()) {
			$errors = $validator->errors();
			return response()->json(['errors' => $errors], 422);
		}

		$filePath =  $request->file('image')->store('public/images');

		return str_replace('public', 'storage', $filePath);

    }

	public function update(Request $request, string $id)
    {
        try{
			$item = Product::findOrFail($id);
		}
		catch (\Exception $e) {
			return response([
				'msg' => 'Товар не найден'
			], 404);
		}

		$item->name = $request->name;
		$item->price = $request->price;
		$item->composition = $request->composition;
		$item->save();

		return response($item, 200);

    }

	public function destroy(string $id)
    {
		try{
			$item = Product::findOrFail($id);
		}
		catch (\Exception $e) {
			return response([
				'msg' => 'Товар не найден'
			], 404);
		}

		$item->delete();

		return [
			'message' => 'Товар успешно удален'
		];
    }
}
