# Marketplace Build — Task Tracker

## Step 1: Laravel Init, Database, Migrations & Models
- [x] Initialize Laravel project in `backend/`
- [x] Run `php artisan install:api` (Sanctum + api.php)
- [x] Configure `.env` for MySQL
- [x] Modify users migration (add `role` enum)
- [x] Create products migration
- [x] Create carts migration
- [x] Create orders migration
- [x] Create/modify User model
- [x] Create Product model
- [x] Create Cart model
- [x] Create Order model
- [x] Run `php artisan migrate` and verify

## Step 2: Auth Controller & Sanctum Tokens
- [x] Create AuthController (register, login, logout, user)
- [x] Define auth routes in api.php
- [x] Test auth endpoints

## Step 3: Role Middleware + Product & Cart APIs
- [x] Create RoleMiddleware
- [x] Register middleware alias
- [x] Create ProductController
- [x] Create CartController
- [x] Define all API routes
- [x] Configure CORS

## Step 4: Next.js Init, Tailwind, Axios
- [x] Initialize Next.js project in `frontend/`
- [x] Setup Shadcn UI
- [x] Create Axios interceptor

## Step 5: Global Auth Store (Zustand)
- [x] Create auth store with Zustand
- [x] Create auth provider

## Step 6: Login Page + Role Redirect
- [x] Build Login page
- [x] Build Register page
- [x] Create Next.js middleware for protected routes

## Step 7: Landing Page & Product Card
- [x] Build Landing page with hero + product grid
- [x] Build ProductCard component
- [x] Implement "Add to Cart" logic (auth & role check)
- [x] Create Navbar for site-wide navigation

## Step 8: Admin Dashboard & Product Management
- [x] Build admin layout with sidebar
- [x] Build admin dashboard displaying seller's products
- [x] Create Product Form (Add/Edit)
- [x] Integrate with API for CRUD operations CRUD page
