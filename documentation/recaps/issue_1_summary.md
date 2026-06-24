# Issue 1 Recap

This document serves as a historical recap of the work completed for **Issue 1**. It combines the original implementation plan, the task tracking checklist, and the final walkthrough.

---

## 1. Implementation Plan

### Frontend: UI Additions & State Management

**[NEW] `frontend/src/app/not-found.tsx`**
- Build a modern, stylized 404 "Not Found" page matching the dark theme (Zinc-950, indigo accents).
- Include a button to redirect users back to the home page safely.

**[NEW] `frontend/src/app/cart/page.tsx`**
- Build the cart UI specifically for the buyer role.
- Integrate with the cart-store to fetch cart items, calculate the total price, and provide buttons for updating quantities or removing items.
- Include a simple "Checkout" placeholder section to summarize the cost.

**[NEW] `frontend/src/app/products/[slug]/page.tsx`**
- Build the dynamic Product Detail page.
- Fetch the product using the `slug` parameter via the `/api/products/{slug}` endpoint.
- Display the product's image, title, price, description, and available stock.
- Include an "Add to Cart" button (visible if the user is a buyer).

**[NEW] `frontend/src/stores/cart-store.ts`**
- Implement a global Zustand store for the Cart (similar to `auth-store.ts`).
- It will hold the `cartItems` and an `itemCount` state.
- Include actions: `fetchCart()`, `addToCart()`, `updateQuantity()`, `removeItem()`.

### Frontend: Bug Fixes & Improvements

**[MODIFY] `frontend/src/components/navbar.tsx`**
- **Avatar Bug Fix**: The application crashes when clicking the avatar because the new `@base-ui/react` `Menu.GroupLabel` requires a parent `Menu.Group` context. We will wrap the `DropdownMenuLabel` inside a `<DropdownMenuGroup>` to fix this error.
- **Cart Bubble Notification**: Retrieve the `itemCount` from the new `cart-store`. If `itemCount > 0`, display a red notification bubble overlapping the cart icon on the Navbar to show the number of products in the cart. We'll also import the `DropdownMenuGroup` to fix the avatar crash.

---

## 2. Task Checklist

- [x] Create `frontend/src/app/not-found.tsx` for 404 page
- [x] Create `frontend/src/stores/cart-store.ts`
- [x] Modify `frontend/src/components/navbar.tsx` to fix the avatar crash and add the cart bubble
- [x] Create `frontend/src/app/cart/page.tsx` for the buyer's cart
- [x] Create `frontend/src/app/products/[slug]/page.tsx` for the product detail UI
- [x] Check off items in `documentation/issue/issue.md`

---

## 3. Walkthrough & Summary

### 404 "Not Found" Page UI
- Created `frontend/src/app/not-found.tsx`.
- Designed a sleek, modern 404 page that matches the existing dark theme and typography.
- Included a button to safely route the user back home.

### Shopping Cart Page UI
- Created `frontend/src/app/cart/page.tsx` accessible to buyers.
- Integrated it with the new `useCartStore` to display added products.
- Included an "Order Summary" section and functionality to increment, decrement, and remove items directly from the cart.
- Created an "Empty Cart" placeholder when the cart has no items.

### Avatar Bug Fix
- Modified `frontend/src/components/navbar.tsx`.
- The application was crashing when clicking the avatar because the `@base-ui/react` library requires `DropdownMenuLabel` to be wrapped inside a `DropdownMenuGroup`. I added the wrapper, which successfully resolves the error.

### Cart Notification Bubble
- Created a global Zustand store (`frontend/src/stores/cart-store.ts`) to manage cart data.
- Added a red notification bubble to the Cart button in the `Navbar`.
- The bubble dynamically displays the number of unique items currently in the cart.

### Product Detail Page UI
- Created `frontend/src/app/products/[slug]/page.tsx`.
- Fetches detailed product information directly from your `/api/products/{slug}` backend.
- Displays a prominent layout with an image, price, description, and "In Stock" indicators.
- Added a quantity selector and "Add to Cart" button for buyers. Non-buyers will see a prompt to log in or sign up instead.

### Validation Results
- Logging in as a buyer and clicking the avatar correctly opens the user context menu without throwing an error.
- Clicking on a product opens the product detail page and populates the details successfully.
- Adding a product increments the cart notification bubble on the top right.
- The cart page accurately summarizes the product, the subtotal, and permits quantity modifications.
