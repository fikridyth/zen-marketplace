# Issue 4 — Task Checklist

## Task 1: Category System
### Backend
- [x] Create migration `create_categories_table` (id, name, slug, icon, timestamps)
- [x] Create migration `add_category_id_to_products_table`
- [x] Create `Category` model with slug auto-generation and `hasMany(Product)`
- [x] Update `Product` model — add `category_id` to fillable, add `belongsTo(Category)`
- [x] Create `CategoryController` with `index()` and `show(slug)`
- [x] Register public category routes in `api.php`
- [x] Update `ProductController@index` to accept `?category=slug` filter
- [x] Update `ProductController@store` and `update` to validate `category_id`
- [x] Create `CategorySeeder` with 6–8 categories and assign to existing products
- [x] Run `php artisan migrate` and `php artisan db:seed`

### Frontend
- [x] Add `Category` interface and update `Product` interface in `types/index.ts`
- [x] Add category navigation in `navbar.tsx` (desktop dropdown + mobile list)
- [x] Add category tabs on `products/page.tsx` (like Tokopedia)
- [x] Add category quick links section on `page.tsx` (home)

---

## Task 2: Search Bar (Global)
- [x] Add search input in `navbar.tsx` desktop nav
- [x] Add search input in mobile menu
- [x] Navigate to `/products?search=query` on submit
- [x] Update `products/page.tsx` to read `?search=` URL param and pass to API
- [x] Show "Showing results for ..." label when search is active
- [x] Combine search + category filter params

---

## Task 3: Product Page Responsive Fixes
- [x] Fix Flash Sale grid on `page.tsx` (use `grid-cols-2` on small screens)
- [x] Fix Latest Arrivals grid on `page.tsx`
- [x] Fix all-products grid on `products/page.tsx`
- [x] Review `product-card.tsx` for small screen scaling

---

## Task 4: Hero Banner Slider
### Backend
- [x] Create migration `create_hero_banners_table` (id, image_url, link, title, is_active, sort_order, timestamps)
- [x] Create `HeroBanner` model
- [x] Create `HeroBannerController` with `index()`
- [x] Register `GET /hero-banners` public route
- [x] Create `HeroBannerSeeder` with 3–4 sample banners

### Frontend
- [x] Add `HeroBanner` interface in `types/index.ts`
- [x] Replace static hero section in `page.tsx` with dynamic slider
- [x] Implement auto-slide every 5 seconds
- [x] Add manual left/right navigation buttons
- [x] Make banner images clickable (redirect to `link`)
- [x] Handle responsive/mobile layout
- [x] Add dot indicators for current slide

---

## Task 5: Mobile Navbar Fix
- [x] Ensure all menu items close the mobile menu on click
- [x] Add active route highlighting (use `usePathname()`)
- [x] Fix menu icon sizing and alignment
- [x] Fix search bar display in mobile menu
- [x] Add smooth open/close animation

---

## Task 6: Multiple Product Images
### Backend
- [x] Create migration `create_product_images_table` (id, product_id, image_url, is_primary, sort_order, timestamps)
- [x] Create `ProductImage` model
- [x] Update `Product` model — add `hasMany(ProductImage)` and `primaryImage()` accessor
- [x] Update `ProductController@show` to eager load images
- [x] Update `ProductController@index` to eager load primary image
- [x] Update `ProductController@store` / `update` to handle images array

### Frontend
- [x] Add `ProductImage` interface and update `Product` type in `types/index.ts`
- [x] Update `product-card.tsx` to show primary image
- [x] Build image gallery on `products/[slug]/page.tsx` (main image + thumbnails + prev/next buttons)
- [x] Update admin product forms to manage multiple images

---

## Final
- [x] Mark all Issue 4 items as `[x]` in `issue.md`
- [x] Write `issue_4_summary.md` recap
