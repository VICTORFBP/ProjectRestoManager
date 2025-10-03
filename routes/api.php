<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\MenuItemController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\TableController;
use App\Http\Controllers\UserController;

Route::middleware('api')->group(function () {
    // CRUD Pedidos
    Route::apiResource('orders', OrderController::class);

    // CRUD Clientes
    Route::apiResource('customers', CustomerController::class);

    // CRUD Categorías (ej. comida, bebida, etc.)
    Route::apiResource('categories', CategoryController::class);

    // CRUD Items del menú
    Route::apiResource('menu-items', MenuItemController::class);

    // CRUD Mesas del restaurante
    Route::apiResource('tables', TableController::class);

    // CRUD Usuarios (meseros, cocineros, admin, clientes registrados)
    Route::apiResource('users', UserController::class);
});
