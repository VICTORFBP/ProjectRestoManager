<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::insert([
            [
                'username'   => 'admin1',
                'email'      => 'admin1@example.com',
                'password'   => Hash::make('password123'),
                'first_name' => 'Victor',
                'last_name'  => 'Admin',
                'role_id'    => 1, // Administrador
                'is_active'  => true,
            ],
            [
                'username'   => 'mesero1',
                'email'      => 'mesero1@example.com',
                'password'   => Hash::make('password123'),
                'first_name' => 'Juan',
                'last_name'  => 'Pérez',
                'role_id'    => 2, // Mesero
                'is_active'  => true,
            ],
            [
                'username'   => 'cocinero1',
                'email'      => 'cocinero1@example.com',
                'password'   => Hash::make('password123'),
                'first_name' => 'Ana',
                'last_name'  => 'Gómez',
                'role_id'    => 3, // Cocinero
                'is_active'  => true,
            ],
        ]);
    }
}
