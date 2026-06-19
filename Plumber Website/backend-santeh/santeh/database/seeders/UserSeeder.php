<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $users = [
            [
                'name' => 'Айбек Сантехник',
                'email' => 'employee1@santehstroy.kz',
                'password' => 'Employee123',
                'role' => 'employee',
                'status' => 'online',
            ],
            [
                'name' => 'Нурлан Мастер',
                'email' => 'employee2@santehstroy.kz',
                'password' => 'Employee123',
                'role' => 'employee',
                'status' => 'offline',
            ],
            [
                'name' => 'Алина Клиент',
                'email' => 'client1@santehstroy.kz',
                'password' => 'Client123',
                'role' => 'client',
                'status' => null,
            ],
            [
                'name' => 'Руслан Заказчик',
                'email' => 'client2@santehstroy.kz',
                'password' => 'Client123',
                'role' => 'client',
                'status' => null,
            ],
        ];

        foreach ($users as $user) {
            User::updateOrCreate(
                ['email' => $user['email']],
                [
                    'name' => $user['name'],
                    'password' => Hash::make($user['password']),
                    'role' => $user['role'],
                    'status' => $user['status'],
                    'email_verified_at' => now(),
                ]
            );
        }
    }
}
