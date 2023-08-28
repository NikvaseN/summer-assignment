<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Order_product;
use App\Models\Favorite;

class Product extends Model
{
    use HasFactory;

	protected $fillable = [
        'name',
        'price',
        'category',
        'imageUrl',
        'composition',
    ];

	public function orderProduct()
    {
        return $this->belongsTo(Order_product::class);
    }

	public function favorite()
	{
		return $this->belongsTo(Favorite::class);
	}
}
