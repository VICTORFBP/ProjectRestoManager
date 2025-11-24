<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\MenuItemController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\TableController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\RoleController;

// ============================================
// RUTAS PÚBLICAS (sin autenticación)
// ============================================
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Obtener menú (público para clientes)
Route::get('menu-items', [MenuItemController::class, 'index']);
Route::get('menu-items/{id}', [MenuItemController::class, 'show']);
Route::get('categories', [CategoryController::class, 'index']);

// ============================================
// RUTAS PROTEGIDAS (requieren autenticación)
// ============================================
Route::middleware('auth:sanctum')->group(function () {
    
    // Auth
    Route::post('logout', [AuthController::class, 'logout']);
    Route::get('me', [AuthController::class, 'me']);

    // ============================================
    // RUTAS PARA ADMINISTRADORES
    // ============================================
    Route::middleware('role:Administrador')->group(function () {
        // Usuarios (solo admin)
        Route::apiResource('users', UserController::class);
        
        // Roles
        Route::get('roles', [RoleController::class, 'index']);
        
        // Menú (crear/editar/eliminar)
        Route::post('menu-items', [MenuItemController::class, 'store']);
        Route::put('menu-items/{id}', [MenuItemController::class, 'update']);
        Route::delete('menu-items/{id}', [MenuItemController::class, 'destroy']);
        
        // Categorías
        Route::post('categories', [CategoryController::class, 'store']);
        Route::put('categories/{id}', [CategoryController::class, 'update']);
        Route::delete('categories/{id}', [CategoryController::class, 'destroy']);
        
        // Clientes
        Route::apiResource('customers', CustomerController::class);
        
        // Mesas
        Route::apiResource('tables', TableController::class);
    });

    // ============================================
    // RUTAS PARA MESEROS Y ADMIN
    // ============================================
    Route::middleware('role:Administrador,Mesero')->group(function () {
        // Órdenes (crear, ver, editar) - ESPECIFICAR EXPLÍCITAMENTE
        Route::get('orders', [OrderController::class, 'index']);
        Route::get('orders/{id}', [OrderController::class, 'show']);
        Route::post('orders', [OrderController::class, 'store']); // ← ¡ESTA FALTA!
        Route::put('orders/{id}', [OrderController::class, 'update']);
        Route::patch('orders/{id}', [OrderController::class, 'update']);
        
        // Ver mesas (solo lectura para meseros)
        Route::get('tables', [TableController::class, 'index']);
        Route::get('tables/{id}', [TableController::class, 'show']);
    });

    // ============================================
    // RUTAS PARA CLIENTES
    // ============================================
    Route::middleware('role:Cliente')->group(function () {
        // Ver sus propios pedidos
        Route::get('my-orders', [OrderController::class, 'myOrders']);
    });

    // ============================================
    // ELIMINAR ÓRDENES (SOLO ADMIN)
    // ============================================
    Route::middleware('role:Administrador')->delete('orders/{id}', [OrderController::class, 'destroy']);
});