// Base entity interface
export interface BaseEntity {
  id: number;
  createdAt?: string;
  updatedAt?: string;
}

// Product types
export interface Product extends BaseEntity {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string | Category;
  imageUrl: string;
  rating?: {
    rate: number;
    count: number;
  };
  reviews?: Review[];
  averageRating?: number;
  reviewCount?: number;
}

// Variant types
export interface Variant extends BaseEntity {
  productId: string;
  name: string;
  value: string;
  price?: number;
  stock?: number;
  sku?: string;
}

// Cart types
export interface CartItem {
  id: string; // Cart item ID from API
  productId: string;
  quantity: number;
  product: Product;
  variantId?: string;
  variant?: Variant;
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

// User types (for future use)
export interface User extends BaseEntity {
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  phone?: string;
}

// Order types (for future use)
export interface Order extends BaseEntity {
  userId: string;
  items: CartItem[];
  totalPrice: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: Address;
  paymentMethod: string;
}

export interface Address {
  id?: number;
  label?: string;
  line1: string;
  line2?: string;
  city: string;
  postal: string;
  country: string;
  phone?: string;
}

// Review types
export interface Review extends BaseEntity {
  productId: string;
  userId: string;
  rating: number;
  comment: string;
  user?: {
    name: string;
    email: string;
  };
  userName?: string;
  userAvatar?: string;
}

// Category types
export interface Category {
  id: number;
  name: string;
  description?: string;
  image?: string;
  productCount?: number;
}

// Utility types
export type LoadingState = 'idle' | 'loading' | 'succeeded' | 'failed';

// Redux store types
export interface RootState {
  api: any; // RTK Query state
}
