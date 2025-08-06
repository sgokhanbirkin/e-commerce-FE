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
  category: string;
  imageUrl: string;
  rating?: {
    rate: number;
    count: number;
  };
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

// API Response types
export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

// Error types
export interface ApiError {
  status: number;
  data: string;
  message?: string;
}

// Filter and search types
export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  search?: string;
}

export interface SortOptions {
  field: 'price' | 'title' | 'rating' | 'createdAt';
  direction: 'asc' | 'desc';
}

// User types (for future use)
export interface User extends BaseEntity {
  email: string;
  name: string;
  avatar?: string;
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
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

// Review types
export interface Review extends BaseEntity {
  productId: string;
  userId: string;
  rating: number;
  comment: string;
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

export interface AsyncState<T> {
  data: T | null;
  loading: LoadingState;
  error: string | null;
}

// Redux store types
export interface RootState {
  api: any; // RTK Query state
  cart?: CartState;
  user?: UserState;
}

export interface CartState {
  items: CartItem[];
  loading: LoadingState;
  error: string | null;
}

export interface UserState {
  user: User | null;
  loading: LoadingState;
  error: string | null;
}
