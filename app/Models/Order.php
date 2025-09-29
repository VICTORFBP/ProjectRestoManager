<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'customer_id',
        'user_id',
        'order_date',
        'status',
        'total',
    ];

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class, 'customer_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function items()
    {
    return $this->hasMany(OrderItem::class);
    }

    public function getTotalAttribute($value)
    {
        // Si hay valor en BD lo usa, si no lo calcula dinámicamente
        return $value > 0 ? $value : $this->items->sum('subtotal');
    }

}
