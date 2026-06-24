# Issue 4 — Implementation Plan

This document outlines the full plan for tackling all 6 items in **Issue 4**, covering category management, search, responsive fixes, hero banners, mobile navbar, and multi-image products.

---

## Overview of Issue 4 Tasks

| # | Task | Scope |
|---|------|-------|
| 1 | **Category System** — Create `categories` table, add `category_id` to products, seed categories, expose API endpoints, add category navigation in navbar & product page with tabs like Tokopedia | Backend + Frontend |
| 2 | **Search Bar** — Make search work globally (home + product page), responsive on mobile | Frontend + Backend (existing `?search=` param) |
| 3 | **Product Page Responsive** — Fix flash sale and latest arrival sections on mobile | Frontend |
| 4 | **Hero Banner Slider** — New `hero_banners` table, auto-sliding carousel (5s), manual prev/next, clickable links, responsive/mobile-friendly | Backend + Frontend |
| 5 | **Mobile Navbar Fix** — Fix menu icon/search bar, close menu on item click, active color | Frontend |
| 6 | **Multiple Product Images** — New `product_images` table, show main image on home/product page, gallery with thumbnails on detail page, prev/next slider | Backend + Frontend |

---

## Proposed Changes

### 1. Category System

#### Backend

##### [NEW] Migration: `create_categories_table`
- `id`, `name`, `slug` (unique), `icon` (nullable, for emoji/icon), `timestamps`

##### [NEW] Migration: `add_category_id_to_products_table`
- Add `category_id` (nullable, foreign key → `categories.id`, SET NULL on delete) to `products`

##### [NEW] `app/Models/Category.php`
- Fillable: `name`, `slug`, `icon`
- Relations: `hasMany(Product::class)`
- Auto-generate slug from name on creation

##### [MODIFY] `app/Models/Product.php`
- Add `category_id` to fillable
- Add `belongsTo(Category::class)` relation

##### [NEW] `app/Http/Controllers/Api/CategoryController.php`
- `index()` → list all categories (public)
- `show(slug)` → single category with paginated products

##### [MODIFY] `routes/api.php`
- Add public `GET /categories` and `GET /categories/{slug}` routes

##### [MODIFY] `ProductController.php`
- Accept optional `?category=slug` filter param in `index()`
- Validate `category_id` in `store()` and `update()`

##### [MODIFY] `DatabaseSeeder.php` or [NEW] `CategorySeeder.php`
- Seed 6–8 categories (Electronics, Fashion, Home & Living, Sports, Books, Beauty, Food, Toys)
- Update existing products with random category assignments

#### Frontend

##### [MODIFY] `types/index.ts`
- Add `Category` interface: `{ id, name, slug, icon }`
- Add `category_id` and `category?: Category` to `Product` interface

##### [MODIFY] `navbar.tsx`
- Add category dropdown/mega menu in desktop nav
- Add category list in mobile nav menu

##### [MODIFY] `products/page.tsx`
- Add horizontal scrollable category tabs at top (like Tokopedia)
- Filter products by selected category via API `?category=slug`
- Highlight active category tab

##### [MODIFY] `page.tsx` (home)
- Optionally add category quick links section below hero

---

### 2. Search Bar (Global)

##### [MODIFY] `navbar.tsx`
- Add a search input with search icon in desktop nav (between logo and nav items)
- On submit/enter → navigate to `/products?search=query`
- Style responsively: full-width on mobile (inside mobile menu or collapsible)

##### [MODIFY] `products/page.tsx`
- Read `?search=` from URL params
- Pass to API call `GET /products?search=...`
- Show "Showing results for ..." when search is active
- Combine with category filter: `?search=...&category=...`

##### Backend
- Already supports `?search=` in `ProductController@index` — no changes needed
- Add `?category=slug` support (covered in Task 1)

---

### 3. Product Page Responsive Fixes

##### [MODIFY] `page.tsx` (home)
- Fix Flash Sale grid to use `grid-cols-2` on small screens instead of `grid-cols-1`
- Fix Latest Arrivals grid similarly
- Ensure consistent card sizes and spacing on mobile

##### [MODIFY] `products/page.tsx`
- Same grid responsive fixes for the all-products grid

##### [MODIFY] `product-card.tsx`
- Ensure card images, text, and buttons scale properly on very small screens

---

### 4. Hero Banner Slider

#### Backend

##### [NEW] Migration: `create_hero_banners_table`
- `id`, `image_url` (required), `link` (nullable), `title` (nullable), `is_active` (boolean, default true), `sort_order` (integer, default 0), `timestamps`

##### [NEW] `app/Models/HeroBanner.php`
- Fillable: `image_url`, `link`, `title`, `is_active`, `sort_order`

##### [NEW] `app/Http/Controllers/Api/HeroBannerController.php`
- `index()` → public, return active banners ordered by `sort_order`

##### [MODIFY] `routes/api.php`
- Add public `GET /hero-banners`

##### [NEW] `HeroBannerSeeder.php` or update `DatabaseSeeder.php`
- Seed 3–4 sample banners with placeholder images

#### Frontend

##### [MODIFY] `types/index.ts`
- Add `HeroBanner` interface: `{ id, image_url, link, title, is_active, sort_order }`

##### [MODIFY] `page.tsx` (home)
- Replace current static hero with a dynamic image slider component
- Fetch banners from `GET /api/hero-banners`
- Auto-slide every 5 seconds
- Manual left/right navigation buttons
- Clicking an image redirects to its `link`
- Responsive: handle mobile sizing, touch-friendly

---

### 5. Mobile Navbar Fix

##### [MODIFY] `navbar.tsx`
- Close mobile menu after clicking any menu item (already partially done with `onClick={() => setMobileMenuOpen(false)}`, verify all paths)
- Fix active state color for current route (use `usePathname()` to highlight active nav item)
- Fix search bar layout in mobile menu
- Fix menu icon sizing and alignment
- Add smooth open/close animation

---

### 6. Multiple Product Images

#### Backend

##### [NEW] Migration: `create_product_images_table`
- `id`, `product_id` (foreign key → `products.id`, CASCADE delete), `image_url` (required), `is_primary` (boolean, default false), `sort_order` (integer, default 0), `timestamps`

##### [NEW] `app/Models/ProductImage.php`
- Fillable: `product_id`, `image_url`, `is_primary`, `sort_order`
- `belongsTo(Product::class)`

##### [MODIFY] `app/Models/Product.php`
- Add `hasMany(ProductImage::class)` relation
- Add `primaryImage()` helper or accessor

##### [MODIFY] `ProductController.php`
- `show()` → eager load `images` relation
- `index()` → eager load primary image (or first image)
- `store()` / `update()` → accept `images[]` array for image management

##### [MODIFY] `routes/api.php`
- No new routes needed — images are managed via product CRUD

#### Frontend

##### [MODIFY] `types/index.ts`
- Add `ProductImage` interface: `{ id, product_id, image_url, is_primary, sort_order }`
- Add `images?: ProductImage[]` to `Product` interface

##### [MODIFY] `product-card.tsx`
- Show primary image (or `image_url` as fallback) on product cards

##### [MODIFY] `products/[slug]/page.tsx` (Product Detail)
- Left side: main image display with prev/next slider buttons
- Below or right of main image: thumbnail strip
- Click thumbnail → change main image
- Smooth transition between images

##### [MODIFY] Admin product forms (`new/page.tsx`, `[id]/edit/page.tsx`)
- Add multi-image upload/URL inputs
- Mark one image as primary
- Reorder images

---

## Execution Order

The tasks have dependencies, so they should be implemented in this order:

1. **Task 1 — Categories** (backend first, then frontend)
2. **Task 6 — Multiple Images** (backend first, then frontend)
3. **Task 4 — Hero Banners** (backend first, then frontend)
4. **Task 2 — Search Bar** (frontend only, API already exists)
5. **Task 5 — Mobile Navbar Fix** (frontend only)
6. **Task 3 — Responsive Fixes** (frontend only, final polish)

---

## Verification Plan

### Automated
- `php artisan migrate` — verify migrations run without errors
- `php artisan db:seed` — verify seeders populate data correctly

### Manual
- Browse categories in navbar and product page, verify filtering
- Test search from home page and product page
- Verify hero slider auto-rotates and manual controls work
- Test mobile menu open/close behavior
- Check responsive layouts on various screen sizes
- Verify multi-image gallery on product detail page
- Verify product cards show primary/main image
