<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'JennaKim123@gmail.com'],
            [
                'name' => 'Ким Евгений',
                'password' => Hash::make('JennaKim123456789'),
                'role' => 'admin',
                'status' => null,
                'email_verified_at' => now(),
            ]
        );
    }
}
