<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Order_product;
use App\Models\User;

class Order extends Model
{
    use HasFactory;

	protected $fillable = [
        'user_id',
        'fullPrice',
        'methodDelivery',
        'username',
        'phone',
        'adress',
    ];

	public function user()
    {
        return $this->belongsTo(User::class);
    }

	public function orderProducts()
    {
        return $this->hasMany(Order_product::class);
    }

}
