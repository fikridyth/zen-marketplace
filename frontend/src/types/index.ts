// ─────────────────────────────────────────────
// Shared TypeScript types for the marketplace
// ─────────────────────────────────────────────

export interface User {
  id: number;
  name: string;
  email: string;
  role: "buyer" | "seller";
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: number;
  user_id: number;
  name: string;
  slug: string;
  description: string | null;
  price: string | number;
  stock: number;
  image_url: string | null;
  created_at: string;
  updated_at: string;
  user?: Pick<User, "id" | "name">;
}

export interface CartItem {
  id: number;
  user_id: number;
  product_id: number;
  quantity: number;
  created_at: string;
  updated_at: string;
  product: Pick<Product, "id" | "name" | "slug" | "price" | "stock" | "image_url">;
}

export interface CartResponse {
  cart_items: CartItem[];
  total: number;
  count: number;
}

export interface Order {
  id: number;
  user_id: number;
  total_price: string | number;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
  token_type: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number | null;
  to: number | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role?: "buyer" | "seller";
}
