export type Role = "buyer" | "seller" | "admin";

export interface User {
  id: number;
  email: string;
  name: string;
  role: Role;
  shopName?: string;
  isActive?: boolean;
  verificationStatus?: string;
  shopLocation?: string | null;
  shopHours?: string | null;
}

export interface Product {
  id: number;
  user_id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  size: string | null;
  condition: string;
  brand: string | null;
  image_url: string | null;
  images?: string[];
  sale_price?: number | null;
  measurements?: Record<string, string> | null;
  is_sold: boolean;
  quantity?: number;
  recent_views?: number;
  rating_avg?: number;
  shop_location?: string | null;
  shop_hours?: string | null;
  verification_status?: string;
  created_at: string;
  shop_name?: string;
  moderation_status?: string;
  moderation_reasons?: string[];
  moderated_at?: string | null;
  moderated_by?: number | null;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number | null;
  product_name: string;
  price: number;
  quantity: number;
  size: string | null;
}

export interface Order {
  id: number;
  user_id: number | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_address: string;
  customer_city: string | null;
  customer_postal: string | null;
  notes: string | null;
  total: number;
  status: string;
  created_at: string;
  items: OrderItem[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}
