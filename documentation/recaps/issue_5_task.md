# Issue 5 — Task Tracker

## 1. Backend Layer (Database & API)
- [x] Create `add_discount_to_products_table` migration
- [x] Update `Product` model fillables for `discount`
- [x] Create `create_wishlists_table` migration and `Wishlist` model
- [x] Create `WishlistController` (index, store, destroy)
- [x] Create `create_reviews_table` migration and `Review` model
- [x] Create `ReviewController` (index, store)
- [x] Update `User` and `Product` models with relations (`wishlists`, `reviews`)
- [x] Update `ProductController` queries (`index`, `show`) to include `avg_rating` and `reviews_count`
- [x] Update `ProductController` to handle `discount`
- [x] Create `Issue5Seeder` for dummy data
- [x] Run migrations and seeder

## 2. Frontend State & Types
- [x] Update `types/index.ts` (`discount`, `avg_rating`, `reviews_count`, `Wishlist`, `Review`)
- [x] Create `useWishlistStore` in Zustand

## 3. Frontend UI
- [x] `navbar.tsx`: Add wishlist icon & counter, reposition mobile cart icon
- [x] `product-card.tsx`: Align badges, truncate category text, display rating/reviews, show discount price
- [x] `products/[slug]/page.tsx`: Fix mobile flex layout for Add to Cart
- [x] `products/[slug]/page.tsx`: Add Wishlist toggle button
- [x] `products/[slug]/page.tsx`: Display pricing UI (discount, old price)
- [x] `products/[slug]/page.tsx`: Add Ratings & Reviews section
- [x] `page.tsx` (Home): Update Flash Sale query (top 4 discounts)
- [x] `profile/page.tsx`: Create Profile page with Wishlist and Reviews tabs

## 4. Final
- [ ] Mark Issue 5 items as `[x]` in `issue.md`
- [ ] Save task and summary to `documentation/recaps/`
