<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\EmployeeController;
use Illuminate\Support\Facades\Route;

Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);

    Route::middleware('role:admin')->prefix('admin')->group(function () {
        Route::get('/stats', [AdminController::class, 'stats']);
        Route::get('/users', [AdminController::class, 'users']);
        Route::put('/users/{id}/status', [AdminController::class, 'toggleStatus']);
        Route::delete('/users/{id}', [AdminController::class, 'deleteUser']);
        Route::get('/requests', [AdminController::class, 'requests']);
        Route::put('/requests/{id}', [AdminController::class, 'updateRequest']);
        Route::put('/requests/{id}/assign', [AdminController::class, 'assignRequest']);
    });

    Route::middleware('role:employee')->prefix('employee')->group(function () {
        Route::get('/requests', [EmployeeController::class, 'myRequests']);
        Route::put('/requests/{id}/status', [EmployeeController::class, 'updateStatus']);
        Route::put('/status', [EmployeeController::class, 'toggleStatus']);
    });

    Route::middleware('role:client')->prefix('client')->group(function () {
        Route::get('/requests', [ClientController::class, 'myRequests']);
        Route::post('/requests', [ClientController::class, 'createRequest']);
    });
});
