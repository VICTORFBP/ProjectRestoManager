<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\OrderController;

Route::get('/roles', [RoleController::class, 'index']);
Route::get('/users', [UserController::class, 'index']);
Route::get('/customers', [CustomerController::class, 'index']);
Route::get('/orders', [OrderController::class, 'index']);