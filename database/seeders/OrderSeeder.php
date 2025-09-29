<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Order;
use Carbon\Carbon;

class OrderSeeder extends Seeder
{
    public function run(): void
    {
    Order::insert([
        [
            'customer_id' => 1,
            'user_id'     => 2,
            'status'      => 'completado',
            'total'       => 0, // se calculará dinámicamente
            'created_at'  => now()->subDays(2),
        ],
        [
            'customer_id' => 2,
            'user_id'     => 2,
            'status'      => 'pendiente',
            'total'       => 0,
            'created_at'  => now()->subDay(),
        ],
        [
            'customer_id' => 3,
            'user_id'     => 3,
            'status'      => 'cancelado',
            'total'       => 0,
            'created_at'  => now(),
        ],
    ]);
    }
}
