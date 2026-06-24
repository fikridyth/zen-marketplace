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

export interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string | null;
  products_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface ProductImage {
  id: number;
  product_id: number;
  image_url: string;
  is_primary: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface Product {
  id: number;
  user_id: number;
  category_id: number | null;
  name: string;
  slug: string;
  description: string | null;
  price: string | number;
  discount: number;
  stock: number;
  image_url: string | null;
  created_at: string;
  updated_at: string;
  user?: Pick<User, "id" | "name">;
  category?: Pick<Category, "id" | "name" | "slug" | "icon"> | null;
  images?: ProductImage[];
  primary_image?: ProductImage | null;
  reviews_count?: number;
  reviews_avg_rating?: string | number | null;
}

export interface Review {
  id: number;
  user_id: number;
  product_id: number;
  rating: number;
  comment: string | null;
  created_at: string;
  updated_at: string;
  user?: Pick<User, "id" | "name">;
  product?: Product;
}

export interface Wishlist {
  id: number;
  user_id: number;
  product_id: number;
  created_at: string;
  updated_at: string;
  product?: Product;
}

export interface HeroBanner {
  id: number;
  image_url: string;
  link: string | null;
  title: string | null;
  is_active: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
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
