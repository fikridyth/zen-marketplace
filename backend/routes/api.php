<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\ProductController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Public: products listing, register, login
| Buyer: cart management
| Seller: product CRUD (admin)
|
*/

// ──────────────────────────────────────────────
// Public routes
// ──────────────────────────────────────────────

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{slug}', [ProductController::class, 'show']);

// ──────────────────────────────────────────────
// Authenticated routes (any role)
// ──────────────────────────────────────────────

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    // ──────────────────────────────────────────
    // Buyer-only routes
    // ──────────────────────────────────────────
    Route::middleware('role:buyer')->group(function () {
        Route::get('/cart', [CartController::class, 'index']);
        Route::post('/cart', [CartController::class, 'store']);
        Route::put('/cart/{id}', [CartController::class, 'update']);
        Route::delete('/cart/{id}', [CartController::class, 'destroy']);
    });

    // ──────────────────────────────────────────
    // Seller-only routes (admin)
    // ──────────────────────────────────────────
    Route::middleware('role:seller')->prefix('admin')->group(function () {
        Route::get('/products', [ProductController::class, 'myProducts']);
        Route::post('/products', [ProductController::class, 'store']);
        Route::put('/products/{id}', [ProductController::class, 'update']);
        Route::delete('/products/{id}', [ProductController::class, 'destroy']);
    });
});
