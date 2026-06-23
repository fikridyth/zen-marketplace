# Marketplace API & Routes Documentation

This document provides a comprehensive overview of the active backend API endpoints and frontend routes for the Marketplace application.

> [!NOTE]
> All backend routes are automatically prefixed with `/api`. Authenticated endpoints require a Sanctum Bearer Token sent in the `Authorization` header.

## 🔗 Backend API Endpoints (Laravel)

### 🔓 Public Routes
These routes do not require any authentication.

| Method | Endpoint | Description | Payload / Params |
|--------|----------|-------------|------------------|
| **POST** | `/api/register` | Register a new user | `name`, `email`, `password`, `password_confirmation`, `role` ("buyer" or "seller") |
| **POST** | `/api/login` | Login to receive a token | `email`, `password` |
| **GET** | `/api/products` | Fetch all products (paginated) | None |
| **GET** | `/api/products/{slug}` | Fetch a single product by slug | `slug` (URL param) |

---

### 🔒 Authenticated Routes (Any Role)
These routes require a valid Bearer token.

| Method | Endpoint | Description | Payload / Params |
|--------|----------|-------------|------------------|
| **GET** | `/api/user` | Fetch the currently authenticated user's profile | None |
| **POST** | `/api/logout` | Revoke the current access token | None |

---

### 🛒 Buyer-Only Routes
These routes require authentication **AND** the `role` must be `buyer`.

| Method | Endpoint | Description | Payload / Params |
|--------|----------|-------------|------------------|
| **GET** | `/api/cart` | Get the current buyer's cart items | None |
| **POST** | `/api/cart` | Add a product to the cart | `product_id`, `quantity` |
| **PUT** | `/api/cart/{id}` | Update quantity of a cart item | `quantity` |
| **DELETE**| `/api/cart/{id}` | Remove an item from the cart | `id` (Cart Item ID) |

---

### 🏪 Seller-Only Admin Routes
These routes require authentication **AND** the `role` must be `seller`.

| Method | Endpoint | Description | Payload / Params |
|--------|----------|-------------|------------------|
| **GET** | `/api/admin/products` | Get products owned by the authenticated seller | None |
| **POST** | `/api/admin/products` | Create a new product | `name`, `description`, `price`, `stock`, `image_url` |
| **PUT** | `/api/admin/products/{id}`| Update an existing product | `name`, `description`, `price`, `stock`, `image_url` |
| **DELETE**| `/api/admin/products/{id}`| Delete a product | `id` (Product ID) |


---
---


## 🌐 Frontend Routes (Next.js)

The frontend uses Next.js App Router. Access to certain routes is protected via Edge Middleware (`src/proxy.ts`).

### 🔓 Public / Guest Routes
| Route | Access Level | Description |
|-------|--------------|-------------|
| `/` | **Public** | The main landing page displaying the product grid. |
| `/login` | **Guest Only** | Login form. Authenticated users are redirected away. |
| `/register`| **Guest Only** | Registration form. Authenticated users are redirected away. |

---

### 🛒 Buyer Routes
| Route | Access Level | Description |
|-------|--------------|-------------|
| `/cart` | **Buyer Only** | The shopping cart view. If accessed by a guest, they are redirected to `/login`. If accessed by a seller, they are redirected to `/`. |

---

### 🏪 Seller Routes (Admin Portal)
| Route | Access Level | Description |
|-------|--------------|-------------|
| `/admin/dashboard` | **Seller Only** | Dashboard overview and product inventory table. |
| `/admin/products/new` | **Seller Only** | Form to create and publish a new product. |
| `/admin/products/[id]/edit` | **Seller Only** | Form to edit an existing product. |
| `/admin/orders` | **Seller Only** | Placeholder route for managing incoming orders. |

> [!TIP]
> The Next.js Edge proxy intercepts protected routes immediately before rendering, ensuring secure navigation based on the client's `auth_data` cookie.
