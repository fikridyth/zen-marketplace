# Marketplace Project Walkthrough

The headless e-commerce project with strict Role-Based Access Control (RBAC) is complete. We've successfully built a robust **Laravel 11 API Backend** and a beautiful **Next.js 16 Frontend**.

> [!NOTE]
> The project uses a decoupled architecture where Next.js communicates with Laravel via API, relying on stateful Sanctum authentication.

## 🏗️ Architecture & Stack

- **Backend (`/backend`)**: Laravel 11 (API Only), MySQL, Laravel Sanctum (Token Auth).
- **Frontend (`/frontend`)**: Next.js 16 (App Router), TypeScript, Tailwind CSS v4, Shadcn UI, Zustand (State Management), Axios.
- **Roles**: `buyer` (can purchase), `seller` (can manage products).

---

## ✨ Features Built

### 1. Authentication & RBAC 
- **Sanctum Token Auth**: Users receive a Bearer token upon login/registration.
- **Zustand State**: Global client-side store `useAuthStore` manages user session and persists the token in local storage.
- **Edge Route Protection**: A custom Next.js Edge proxy (`src/proxy.ts`) protects routes (`/admin`, `/cart`) based on cookies.
- **Role Middleware**: Laravel custom `RoleMiddleware` ensures sellers cannot access buyer routes and vice-versa at the API level.

### 2. Modern UI & UX
- **Glassmorphism Design**: Premium dark mode styling using Tailwind utility classes, gradients, and subtle blurs.
- **Shadcn Components**: Reusable components like Cards, Inputs, Tables, Badges, and Dropdowns.
- **Toast Notifications**: `Sonner` is used for non-blocking, stylish success/error notifications.

### 3. Core Pages
- **Landing Page (`/`)**: Displays all products fetched dynamically. Includes a "Hero" section.
- **Login / Register**: Forms with robust validation, role selection (Buyer vs. Seller), and conditional redirects.
- **Seller Dashboard (`/admin/dashboard`)**: A protected layout with a sidebar. Shows product statistics and a data table for managing inventory.
- **Product Management**: Forms to Add (`/admin/products/new`) and Edit (`/admin/products/[id]/edit`) products.

---

## 🚀 How to Run Locally

To test the application, you need to run both the backend and frontend simultaneously.

> [!TIP]
> Open two separate terminal windows for these steps.

### Terminal 1: Laravel Backend
```bash
cd backend
php artisan serve
# Runs on http://localhost:8000
```

### Terminal 2: Next.js Frontend
```bash
cd frontend
npm run dev
# Runs on http://localhost:3000
```

## 🧪 Verification & Testing

1. **Register a Seller**: Go to `http://localhost:3000/register`, choose "Sell Products", and create an account. You will be redirected to the Seller Dashboard.
2. **Add a Product**: In the dashboard, click "Add Product" and create a test item.
3. **Register a Buyer**: Log out, go back to register, and create a "Buy Products" account.
4. **Browse & Buy**: On the landing page, you'll see the seller's product. Click "Add to Cart" to verify the buyer workflow.

> [!SUCCESS]
> **Project Delivered!** All requirements from the initial plan have been met.
