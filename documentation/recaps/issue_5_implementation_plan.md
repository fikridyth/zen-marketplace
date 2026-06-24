# Issue 5 — Implementation Plan

This plan details the steps to implement all 8 tasks outlined in Issue 5, spanning the backend database, API endpoints, and frontend components.

---

## 1. Backend Changes (Database, Models, Controllers)

- **Discounts**:
  - Create a migration to add an integer `discount` column (0-100) to the `products` table.
  - Update `Product` model fillables.
- **Wishlist**:
  - Create `create_wishlists_table` migration (`user_id`, `product_id`).
  - Create `Wishlist` model.
  - Create `WishlistController` to handle fetching, adding, and removing wishlist items.
- **Ratings & Reviews**:
  - Create `create_reviews_table` migration (`user_id`, `product_id`, `rating`, `comment`).
  - Create `Review` model.
  - Create `ReviewController` to handle adding and listing reviews.
- **Model Relationships & Attributes**:
  - Add `wishlists()` and `reviews()` relationships to `User` and `Product` models.
  - Update `ProductController` queries (`index`, `show`) to eager load or append `avg_rating` and `reviews_count`.
- **Seeding**:
  - Create a new seeder (or update existing) to assign multiple images to 10 products, apply random discounts to products (to populate the flash sale), and generate sample ratings/reviews.

## 2. Frontend State & Types

- Update `types/index.ts` to include `discount`, `avg_rating`, and `reviews_count` on the `Product` interface.
- Add `Wishlist` and `Review` interfaces.
- Create `useWishlistStore` to fetch the user's wishlist and maintain the global count for the navbar badge.

## 3. Frontend UI — Components & Layouts

- **Navbar (`navbar.tsx`)**:
  - Move the mobile cart icon from inside the mobile drawer menu to the top navigation bar, between the theme toggle and the hamburger menu icon.
  - Add a new "Wishlist" heart icon to both desktop and mobile headers, complete with a dynamic bubble count.
- **Product Card (`product-card.tsx`)**:
  - Fix the Stock badge and Category badge so they align properly horizontally on mobile screens without crashing/overlapping. Adjust font sizes and truncate long category texts with `...`.
  - Display the `avg_rating` (★) and `reviews_count`.
  - If a discount is applied, show the discount badge, the original price with a strikethrough, and the new calculated price.
- **Product Detail (`products/[slug]/page.tsx`)**:
  - UI Fix: Update the layout of the "Quantity" input and "Add to Cart" button so they are displayed side-by-side (flex row) on mobile screens instead of stacking.
  - Add a Wishlist toggle button.
  - Display discount percentage, original price, and final price.
  - Add a new "Ratings & Reviews" section showing average rating and listing user reviews.
- **Home Page (`page.tsx`)**:
  - Update the "Flash Sale" query to fetch exactly 4 products ordered by their discount percentage (highest discount first).
- **Profile Page (`profile/page.tsx`)**:
  - Create a new Profile page (or dashboard section for buyers) that displays the user's "My Wishlist" and "My Reviews".

## Execution Strategy

1. **Backend Layer**: Run migrations, update models, create controllers, and run the seeder.
2. **Frontend State & Navigation**: Build the wishlist store and implement the navbar changes (wishlist count + mobile cart reposition).
3. **Frontend Components**: Update the product card and product detail pages to handle discounts, reviews, and the mobile flex layout for the cart button.
4. **New Pages & Polish**: Create the profile page for wishlists/reviews and refine the flash sale section on the home page.
