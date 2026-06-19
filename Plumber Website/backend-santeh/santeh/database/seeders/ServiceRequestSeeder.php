<?php

namespace Database\Seeders;

use App\Models\ServiceRequest;
use App\Models\User;
use Illuminate\Database\Seeder;

class ServiceRequestSeeder extends Seeder
{
    public function run(): void
    {
        $clientOne = User::where('email', 'client1@santehstroy.kz')->first();
        $clientTwo = User::where('email', 'client2@santehstroy.kz')->first();
        $employeeOne = User::where('email', 'employee1@santehstroy.kz')->first();
        $employeeTwo = User::where('email', 'employee2@santehstroy.kz')->first();

        if (! $clientOne || ! $clientTwo) {
            return;
        }

        $requests = [
            [
                'client_id' => $clientOne->id,
                'client_name' => $clientOne->name,
                'client_phone' => '+7 777 123 45 67',
                'service' => 'Устранение протечки',
                'description' => 'Течёт труба под раковиной на кухне.',
                'status' => 'pending',
                'assigned_to' => null,
            ],
            [
                'client_id' => $clientOne->id,
                'client_name' => $clientOne->name,
                'client_phone' => '+7 777 123 45 67',
                'service' => 'Установка смесителя',
                'description' => 'Нужно заменить старый смеситель в ванной.',
                'status' => 'in_progress',
                'assigned_to' => $employeeOne?->id,
            ],
            [
                'client_id' => $clientTwo->id,
                'client_name' => $clientTwo->name,
                'client_phone' => '+7 701 555 22 11',
                'service' => 'Прочистка канализации',
                'description' => 'Слабый слив воды и неприятный запах.',
                'status' => 'completed',
                'assigned_to' => $employeeTwo?->id,
            ],
            [
                'client_id' => $clientTwo->id,
                'client_name' => $clientTwo->name,
                'client_phone' => '+7 701 555 22 11',
                'service' => 'Замена унитаза',
                'description' => 'Нужна консультация и установка нового унитаза.',
                'status' => 'cancelled',
                'assigned_to' => $employeeOne?->id,
            ],
        ];

        foreach ($requests as $request) {
            ServiceRequest::updateOrCreate(
                [
                    'client_id' => $request['client_id'],
                    'service' => $request['service'],
                ],
                $request
            );
        }
    }
}
