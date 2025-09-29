<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\MenuItem;

class MenuItemSeeder extends Seeder
{
    public function run(): void
    {
        MenuItem::insert([
            [
                'id'          => 1,
                'name'        => 'Pizza Margarita',
                'description' => 'Clásica pizza con queso y tomate',
                'price'       => 15.00,
                'category_id' => 1,
            ],
            [
                'id'          => 2,
                'name'        => 'Jugo de Naranja',
                'description' => 'Jugo natural recién exprimido',
                'price'       => 5.50,
                'category_id' => 2,
            ],
            [
                'id'          => 3,
                'name'        => 'Hamburguesa',
                'description' => 'Hamburguesa con carne y vegetales frescos',
                'price'       => 20.00,
                'category_id' => 1,
            ],
            [
                'id'          => 4,
                'name'        => 'Coca-Cola',
                'description' => 'Bebida gaseosa',
                'price'       => 4.00,
                'category_id' => 2,
            ],
        ]);
    }
}
