export interface User {
  id: number;
  email: string;
  name: string;
  role: "buyer" | "seller";
  shopName?: string;
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
  is_sold: boolean;
  created_at: string;
  shop_name?: string;
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
