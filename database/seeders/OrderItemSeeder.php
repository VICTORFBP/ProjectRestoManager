<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\OrderItem;

class OrderItemSeeder extends Seeder
{
    public function run(): void
    {
        OrderItem::insert([
            [
                'order_id'    => 1, // Pedido de Carlos Ramírez
                'menu_item_id'=> 1, // Ej: Pizza Margarita
                'quantity'    => 2,
                'unit_price'  => 15.00,
                'subtotal'    => 30.00,
                'special_instructions' => 'Sin cebolla',
                'status'      => 'servido',
            ],
            [
                'order_id'    => 1,
                'menu_item_id'=> 2, // Ej: Jugo de Naranja
                'quantity'    => 1,
                'unit_price'  => 5.50,
                'subtotal'    => 5.50,
                'special_instructions' => null,
                'status'      => 'servido',
            ],
            [
                'order_id'    => 2, // Pedido de Laura García
                'menu_item_id'=> 3, // Ej: Hamburguesa
                'quantity'    => 2,
                'unit_price'  => 20.00,
                'subtotal'    => 40.00,
                'special_instructions' => 'Con extra queso',
                'status'      => 'pendiente',
            ],
            [
                'order_id'    => 2,
                'menu_item_id'=> 4, // Ej: Coca-Cola
                'quantity'    => 2,
                'unit_price'  => 4.00,
                'subtotal'    => 8.00,
                'special_instructions' => null,
                'status'      => 'pendiente',
            ],
        ]);
    }
}
