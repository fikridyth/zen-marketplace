# Headless E-Commerce Marketplace with RBAC

Build a full-stack headless e-commerce platform with a **Laravel 11 API backend** and a **Next.js 16 frontend**, featuring strict Role-Based Access Control (RBAC) for `buyer` and `seller` roles.

## User Review Required

> [!IMPORTANT]
> **Step-by-step execution:** You requested confirmation after each step. I will execute steps sequentially and pause for your approval before moving to the next one.

> [!IMPORTANT]
> **MySQL Configuration:** I will configure the `.env` for MySQL. Please confirm your local MySQL credentials (host, port, database name, username, password) or I will use these defaults:
> - Host: `127.0.0.1`, Port: `3306`
> - Database: `marketplace`
> - Username: `root`, Password: (empty)

> [!WARNING]
> **Tailwind CSS version:** You requested Tailwind CSS. The latest `create-next-app` + Shadcn UI uses **Tailwind CSS v4** with the `@tailwindcss/postcss` plugin (no `tailwind.config.ts`). I will proceed with this unless you prefer v3.

## Open Questions

> [!IMPORTANT]
> **Order model scope:** The `orders` table is listed in the schema but no order-related API endpoints are specified. Should I:
> - (A) Only create the migration/model for now (no endpoints), or
> - (B) Also create basic order endpoints (POST `/api/orders`, GET `/api/orders`)?

> [!NOTE]
> **Image uploads:** The `products` table has `image_url`. Should product images be:
> - (A) Simple URL strings (e.g., pasted external links), or
> - (B) File uploads stored locally/on S3 with a dedicated upload endpoint?

---

## Proposed Changes

The project will live at `c:\Users\MII\Documents\Project\marketplace` with two top-level directories:

```
marketplace/
├── backend/          ← Laravel 11 API
└── frontend/         ← Next.js 16 App
```

---

### Step 1: Laravel Init, Database, Migrations & Models

Initialize the Laravel project, configure MySQL, and create all migrations and models.

#### [NEW] `backend/` (Laravel project via Composer)

**Commands:**
```bash
composer create-project laravel/laravel backend
cd backend
php artisan install:api   # scaffolds routes/api.php + Sanctum
```

**`.env` changes:**
- Set `DB_CONNECTION=mysql`, `DB_DATABASE=marketplace`, credentials

#### [NEW] Migration: `create_users_table` (modify default)

Add `role` enum column (`buyer`, `seller`, default `buyer`) to the existing users migration.

```php
$table->enum('role', ['buyer', 'seller'])->default('buyer');
```

#### [NEW] Migration: `create_products_table`

```php
Schema::create('products', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained()->onDelete('cascade');
    $table->string('name');
    $table->string('slug')->unique();
    $table->text('description')->nullable();
    $table->decimal('price', 10, 2);
    $table->integer('stock')->default(0);
    $table->string('image_url')->nullable();
    $table->timestamps();
});
```

#### [NEW] Migration: `create_carts_table`

```php
Schema::create('carts', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained()->onDelete('cascade');
    $table->foreignId('product_id')->constrained()->onDelete('cascade');
    $table->integer('quantity')->default(1);
    $table->timestamps();
});
```

#### [NEW] Migration: `create_orders_table`

```php
Schema::create('orders', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained()->onDelete('cascade');
    $table->decimal('total_price', 10, 2);
    $table->string('status')->default('pending');
    $table->timestamps();
});
```

#### [MODIFY] `app/Models/User.php`

- Add `HasApiTokens` trait
- Add `role` to `$fillable`
- Add `$casts` for role

#### [NEW] `app/Models/Product.php`

- Fillable: `user_id`, `name`, `slug`, `description`, `price`, `stock`, `image_url`
- Relationships: `belongsTo(User::class)`
- Boot method: auto-generate slug from name

#### [NEW] `app/Models/Cart.php`

- Fillable: `user_id`, `product_id`, `quantity`
- Relationships: `belongsTo(User::class)`, `belongsTo(Product::class)`

#### [NEW] `app/Models/Order.php`

- Fillable: `user_id`, `total_price`, `status`
- Relationships: `belongsTo(User::class)`

---

### Step 2: Auth Controller & Sanctum Tokens

#### [NEW] `app/Http/Controllers/Api/AuthController.php`

| Method     | Endpoint          | Description                                                      |
|------------|-------------------|------------------------------------------------------------------|
| `register` | POST `/api/register` | Validate input, create user (default role: buyer), return token + user with role |
| `login`    | POST `/api/login`    | Validate credentials, return Sanctum token + user object (including `role`) |
| `logout`   | POST `/api/logout`   | Revoke current token                                            |
| `user`     | GET `/api/user`      | Return authenticated user profile                                |

**Login response shape:**
```json
{
  "user": { "id": 1, "name": "...", "email": "...", "role": "buyer" },
  "token": "1|abc123...",
  "token_type": "Bearer"
}
```

---

### Step 3: Role Middleware + Product & Cart APIs

#### [NEW] `app/Http/Middleware/RoleMiddleware.php`

Custom middleware that checks `$request->user()->role` against allowed roles. Returns `403` if unauthorized.

```php
public function handle($request, Closure $next, ...$roles)
{
    if (!in_array($request->user()->role, $roles)) {
        return response()->json(['message' => 'Forbidden'], 403);
    }
    return $next($request);
}
```

Register in `bootstrap/app.php` as alias `role`.

#### [NEW] `app/Http/Controllers/Api/ProductController.php`

| Method    | Endpoint                    | Auth     | Role   | Description             |
|-----------|-----------------------------|----------|--------|-------------------------|
| `index`   | GET `/api/products`         | Public   | —      | List all products       |
| `show`    | GET `/api/products/{slug}`  | Public   | —      | Show single product     |
| `store`   | POST `/api/admin/products`  | Sanctum  | seller | Create product          |
| `update`  | PUT `/api/admin/products/{id}` | Sanctum | seller | Update product (own only) |
| `destroy` | DELETE `/api/admin/products/{id}` | Sanctum | seller | Delete product (own only) |

#### [NEW] `app/Http/Controllers/Api/CartController.php`

| Method    | Endpoint              | Auth    | Role  | Description            |
|-----------|-----------------------|---------|-------|------------------------|
| `index`   | GET `/api/cart`       | Sanctum | buyer | List cart items         |
| `store`   | POST `/api/cart`      | Sanctum | buyer | Add item to cart        |
| `update`  | PUT `/api/cart/{id}`  | Sanctum | buyer | Update cart quantity    |
| `destroy` | DELETE `/api/cart/{id}` | Sanctum | buyer | Remove item from cart |

#### [MODIFY] `routes/api.php`

```php
// Public
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{slug}', [ProductController::class, 'show']);

// Auth
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    // Buyer routes
    Route::middleware('role:buyer')->group(function () {
        Route::apiResource('cart', CartController::class);
    });

    // Seller routes
    Route::middleware('role:seller')->prefix('admin')->group(function () {
        Route::apiResource('products', ProductController::class)->except(['index', 'show']);
    });
});
```

#### [MODIFY] `bootstrap/app.php`

Add CORS configuration for the Next.js frontend (`localhost:3000`).

---

### Step 4: Next.js Init, Tailwind, Axios Interceptors

#### [NEW] `frontend/` (Next.js project)

```bash
npx -y create-next-app@latest ./ --typescript --tailwind --eslint --app --turbopack --import-alias "@/*" --use-npm
```

#### [NEW] Shadcn UI Initialization

```bash
npx shadcn@latest init
npx shadcn@latest add button card input label dialog table badge dropdown-menu toast separator avatar sheet
```

#### [NEW] `frontend/src/lib/axios.ts`

- Create Axios instance with `baseURL: process.env.NEXT_PUBLIC_API_URL` (default `http://localhost:8000/api`)
- Add request interceptor: attach `Authorization: Bearer <token>` from localStorage/cookie
- Add response interceptor: handle 401 errors (clear token, redirect to login)

---

### Step 5: Global Auth Store (Zustand)

#### [NEW] `frontend/src/stores/auth-store.ts`

Using **Zustand** with persist middleware:

```typescript
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (data: RegisterData) => Promise<User>;
  logout: () => Promise<void>;
  fetchUser: () => Promise<void>;
}
```

- Persist token in `localStorage`
- `login()` calls API, stores token + user, returns user for redirect logic
- `logout()` calls API, clears state

#### [NEW] `frontend/src/providers/auth-provider.tsx`

Wrap the app to hydrate auth state on mount (fetch `/api/user` if token exists).

---

### Step 6: Login Page with Role-Based Redirect

#### [NEW] `frontend/src/app/login/page.tsx`

- Shadcn UI form with email/password inputs
- On submit: call `authStore.login()`
- **Redirect logic:**
  - If `user.role === 'buyer'` → redirect to `/`
  - If `user.role === 'seller'` → redirect to `/admin/dashboard`

#### [NEW] `frontend/src/app/register/page.tsx`

- Registration form with name, email, password, role selector (buyer/seller)
- On success: same redirect logic as login

#### [NEW] `frontend/src/middleware.ts`

Next.js middleware for route protection:
- `/admin/*` routes → require auth + seller role (redirect to `/login` or `/`)
- `/cart` route → require auth + buyer role
- Public routes (`/`, `/login`, `/register`) → accessible to all

---

### Step 7: Landing Page & Product Card

#### [NEW] `frontend/src/app/page.tsx` (Landing Page)

- Hero section with headline and CTA
- Product grid fetched from `GET /api/products`
- Responsive grid layout

#### [NEW] `frontend/src/components/product-card.tsx`

- Display product image, name, price, stock badge
- **"Add to Cart" button logic:**
  - If `!isAuthenticated` → redirect to `/login`
  - If authenticated + buyer → call `POST /api/cart`
  - If authenticated + seller → button hidden or disabled

#### [NEW] `frontend/src/app/products/[slug]/page.tsx`

- Product detail page (optional enhancement)

---

### Step 8: Admin Dashboard & Product Management

#### [NEW] `frontend/src/app/admin/layout.tsx`

- Sidebar navigation (Dashboard, Products, Logout)
- Protected layout: checks seller role

#### [NEW] `frontend/src/app/admin/dashboard/page.tsx`

- Overview cards (total products, etc.)
- Recent products table

#### [NEW] `frontend/src/app/admin/products/page.tsx`

- Full CRUD table using Shadcn UI `Table` + `Dialog`
- Create/Edit product form in modal
- Delete confirmation dialog
- Only shows products owned by the current seller

---

## Directory Structure Summary

```
marketplace/
├── backend/
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/Api/
│   │   │   │   ├── AuthController.php
│   │   │   │   ├── ProductController.php
│   │   │   │   └── CartController.php
│   │   │   └── Middleware/
│   │   │       └── RoleMiddleware.php
│   │   └── Models/
│   │       ├── User.php
│   │       ├── Product.php
│   │       ├── Cart.php
│   │       └── Order.php
│   ├── database/migrations/
│   ├── routes/api.php
│   └── .env
│
└── frontend/
    └── src/
        ├── app/
        │   ├── page.tsx              (Landing)
        │   ├── login/page.tsx
        │   ├── register/page.tsx
        │   ├── admin/
        │   │   ├── layout.tsx
        │   │   ├── dashboard/page.tsx
        │   │   └── products/page.tsx
        │   └── layout.tsx
        ├── components/
        │   ├── ui/                   (Shadcn)
        │   ├── product-card.tsx
        │   ├── navbar.tsx
        │   └── admin-sidebar.tsx
        ├── lib/
        │   └── axios.ts
        ├── stores/
        │   └── auth-store.ts
        ├── providers/
        │   └── auth-provider.tsx
        ├── middleware.ts
        └── types/
            └── index.ts
```

---

## Verification Plan

### Automated Tests
```bash
# Backend
cd backend
php artisan test                    # Run Laravel tests
php artisan migrate:fresh --seed   # Verify migrations
```

### Manual Verification
After each step, I will verify:

| Step | Verification |
|------|-------------|
| 1 | `php artisan migrate` runs without errors; all tables created |
| 2 | POST `/api/register` and `/api/login` return tokens with user role |
| 3 | Role middleware blocks unauthorized access; CRUD endpoints work |
| 4 | Next.js dev server starts; Axios interceptor attaches tokens |
| 5 | Auth store persists login state across page refreshes |
| 6 | Login redirects buyer→`/` and seller→`/admin/dashboard` |
| 7 | Guest clicking "Add to Cart" is redirected to login |
| 8 | Seller can CRUD products from admin dashboard |
