<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MenuItem extends Model
{
    use HasFactory;

    protected $table = 'menu_items';

    protected $fillable = [
        'name',
        'description',
        'price',
        'category_id',
        'image_url', // ✅ Agregado
    ];

    /**
     * Relación con categorías
     */
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Relación con order_items
     */
    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }
}