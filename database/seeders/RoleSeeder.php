<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        Role::insert([
            ['name' => 'Administrador', 'description' => 'Acceso total al sistema'],
            ['name' => 'Mesero', 'description' => 'Gestiona pedidos y reservas'],
            ['name' => 'Cocinero', 'description' => 'Accede a la cocina y prepara pedidos'],
            ['name' => 'Cliente', 'description' => 'Usuario final con acceso limitado'],
        ]);
    }
}
