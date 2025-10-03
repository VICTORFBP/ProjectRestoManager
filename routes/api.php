<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\MenuItemController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\TableController;
use App\Http\Controllers\UserController;

Route::apiResource('orders', OrderController::class);
Route::apiResource('customers', CustomerController::class);
Route::apiResource('categories', CategoryController::class);
Route::apiResource('menu-items', MenuItemController::class);
Route::apiResource('tables', TableController::class);
Route::apiResource('users', UserController::class);
