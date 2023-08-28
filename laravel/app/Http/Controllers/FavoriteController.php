<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Favorite;
use App\Models\User;

class FavoriteController extends Controller
{
	public function toggle(Request $request)
    {
		$user = auth()->user();
        $productId = $request->input('product');
        
        $favorite = Favorite::where('user_id', $user->id)
            ->where('product_id', $productId)
            ->first();
        
        if ($favorite) {
            $favorite->delete();
            return response()->json(['message' => 'Избранное удалено']);
        } else {
            Favorite::create([
                'user_id' => $user->id,
                'product_id' => $productId,
            ]);
            return response()->json(['message' => 'Добавлено в избранное']);
        }
	}

	public function user(Request $request)
    {
		$user = auth()->user();
        
        $favorites = Favorite::where('user_id', $user->id)->get();

		return response($favorites, 200);
	}

	public function allUser(Request $request)
    {
		$user = auth()->user();
        
        $favorites = Favorite::where('user_id', $user->id)->with('product')->get();

		return response($favorites, 200);
	}

	
}
