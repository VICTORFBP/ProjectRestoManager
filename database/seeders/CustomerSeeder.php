<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Customer;

class CustomerSeeder extends Seeder
{
    public function run(): void
    {
        Customer::insert([
            [
                'first_name'     => 'Carlos',
                'last_name'      => 'Ramírez',
                'email'          => 'carlos.ramirez@example.com',
                'phone'          => '3104567890',
                'loyalty_points' => 120,
            ],
            [
                'first_name'     => 'Laura',
                'last_name'      => 'García',
                'email'          => 'laura.garcia@example.com',
                'phone'          => '3119876543',
                'loyalty_points' => 250,
            ],
            [
                'first_name'     => 'Andrés',
                'last_name'      => 'Moreno',
                'email'          => 'andres.moreno@example.com',
                'phone'          => '3001122334',
                'loyalty_points' => 75,
            ],
        ]);
    }
}
