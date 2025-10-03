<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Order;
use App\Models\MenuItem;
use App\Models\OrderItem;

class OrderItemSeeder extends Seeder
{
    public function run(): void
    {
        $pizza = MenuItem::where('name', 'Pizza Margarita')->first();
        $jugo  = MenuItem::where('name', 'Jugo de Naranja')->first();
        $hamb  = MenuItem::where('name', 'Hamburguesa')->first();
        $coca  = MenuItem::where('name', 'Coca-Cola')->first();

        // Pedido 1
        OrderItem::create([
            'order_id' => 1,
            'menu_item_id' => $pizza->id,
            'quantity' => 2,
            'unit_price' => 15.00,
            'subtotal' => 30.00,
            'special_instructions' => 'Sin cebolla',
            'status' => 'servido',
        ]);

        OrderItem::create([
            'order_id' => 1,
            'menu_item_id' => $jugo->id,
            'quantity' => 1,
            'unit_price' => 5.50,
            'subtotal' => 5.50,
            'special_instructions' => null,
            'status' => 'servido',
        ]);

        // Pedido 2
        OrderItem::create([
            'order_id' => 2,
            'menu_item_id' => $hamb->id,
            'quantity' => 2,
            'unit_price' => 20.00,
            'subtotal' => 40.00,
            'special_instructions' => 'Con extra queso',
            'status' => 'pendiente',
        ]);

        OrderItem::create([
            'order_id' => 2,
            'menu_item_id' => $coca->id,
            'quantity' => 2,
            'unit_price' => 4.00,
            'subtotal' => 8.00,
            'special_instructions' => null,
            'status' => 'pendiente',
        ]);
    }
}
