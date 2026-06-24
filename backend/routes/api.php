<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\HeroBannerController;
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

Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{slug}', [CategoryController::class, 'show']);

Route::get('/hero-banners', [HeroBannerController::class, 'index']);

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

        // Wishlist & Reviews (Buyer)
        Route::get('/wishlists', [\App\Http\Controllers\WishlistController::class, 'index']);
        Route::post('/wishlists', [\App\Http\Controllers\WishlistController::class, 'store']);
        Route::delete('/wishlists/{productId}', [\App\Http\Controllers\WishlistController::class, 'destroy']);
        
        Route::post('/products/{slug}/reviews', [\App\Http\Controllers\ReviewController::class, 'store']);
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

Route::get('/products/{slug}/reviews', [\App\Http\Controllers\ReviewController::class, 'index']);
