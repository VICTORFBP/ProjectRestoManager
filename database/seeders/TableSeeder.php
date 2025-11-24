<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Table; // 👈 importa el modelo correcto

class TableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tables = [
            ['name' => 'Mesa 1', 'seats' => 4, 'status' => 'disponible'],
            ['name' => 'Mesa 2', 'seats' => 2, 'status' => 'ocupada'],
            ['name' => 'Mesa 3', 'seats' => 6, 'status' => 'reservada'],
            ['name' => 'Mesa 4', 'seats' => 4, 'status' => 'disponible'],
        ];

        foreach ($tables as $table) {
            Table::create($table);
        }
    }
}
