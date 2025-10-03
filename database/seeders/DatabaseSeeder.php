<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            RoleSeeder::class,
            UserSeeder::class,
            CustomerSeeder::class,
            CategorySeeder::class,   // categorías de menú
            MenuItemSeeder::class,   // platos/bebidas
            OrderSeeder::class,      // pedidos
            OrderItemSeeder::class,  // items dentro de los pedidos|
            TableSeeder::class,     // mesas
        ]);
    }
}
