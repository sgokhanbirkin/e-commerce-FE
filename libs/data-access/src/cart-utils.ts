import type { CartItem, Product, Cart } from './types';

// Cart utility functions
export const calculateCartTotal = (items: CartItem[]): number => {
  return items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );
};

export const calculateCartItemCount = (items: CartItem[]): number => {
  return items.reduce((count, item) => count + item.quantity, 0);
};

export const addToCart = (
  cart: CartItem[],
  product: Product,
  quantity: number = 1,
  variantId?: string
): CartItem[] => {
  const existingItem = cart.find(
    item =>
      item.productId === product.id.toString() && item.variantId === variantId
  );

  if (existingItem) {
    return cart.map(item =>
      item.id === existingItem.id
        ? { ...item, quantity: item.quantity + quantity }
        : item
    );
  }

  return [
    ...cart,
    {
      id: `temp-${Date.now()}`, // Temporary ID until API response
      productId: product.id.toString(),
      quantity,
      product,
      variantId,
    },
  ];
};

export const removeFromCart = (
  cart: CartItem[],
  itemId: string
): CartItem[] => {
  return cart.filter(item => item.id !== itemId);
};

export const updateCartItemQuantity = (
  cart: CartItem[],
  itemId: string,
  quantity: number
): CartItem[] => {
  if (quantity <= 0) {
    return removeFromCart(cart, itemId);
  }

  return cart.map(item => (item.id === itemId ? { ...item, quantity } : item));
};

export const clearCart = (): CartItem[] => {
  return [];
};

export const getCartSummary = (items: CartItem[]): Cart => {
  const totalItems = calculateCartItemCount(items);
  const totalPrice = calculateCartTotal(items);

  return {
    items,
    totalItems,
    totalPrice,
  };
};

// Local storage utilities
export const saveCartToStorage = (cart: CartItem[]): void => {
  try {
    localStorage.setItem('cart', JSON.stringify(cart));
  } catch (error) {
    console.error('Failed to save cart to localStorage:', error);
  }
};

export const loadCartFromStorage = (): CartItem[] => {
  try {
    const cartData = localStorage.getItem('cart');
    return cartData ? JSON.parse(cartData) : [];
  } catch (error) {
    console.error('Failed to load cart from localStorage:', error);
    return [];
  }
};

export const clearCartFromStorage = (): void => {
  try {
    localStorage.removeItem('cart');
  } catch (error) {
    console.error('Failed to clear cart from localStorage:', error);
  }
};

// Cart validation
export const validateCartItem = (item: CartItem): boolean => {
  return (
    Boolean(item.productId) &&
    item.quantity > 0 &&
    Boolean(item.product) &&
    Boolean(item.product.id) &&
    item.product.price >= 0
  );
};

export const validateCart = (cart: CartItem[]): boolean => {
  return cart.every(validateCartItem);
};

// Cart formatting
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
};

export const formatCartItem = (item: CartItem) => {
  return {
    ...item,
    totalPrice: item.product.price * item.quantity,
    formattedPrice: formatPrice(item.product.price),
    formattedTotal: formatPrice(item.product.price * item.quantity),
  };
};

// Cart utility functions for localStorage management
import type { CartItem } from './types';

/**
 * Store cart items in localStorage
 */
export const storeCartItems = (items: CartItem[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('cart_items', JSON.stringify(items));
};

/**
 * Get cart items from localStorage
 */
export const getCartItems = (): CartItem[] => {
  if (typeof window === 'undefined') return [];

  try {
    const cartData = localStorage.getItem('cart_items');
    if (!cartData || cartData === 'undefined' || cartData === 'null') {
      return [];
    }
    return JSON.parse(cartData);
  } catch (error) {
    console.error('Error parsing cart items:', error);
    return [];
  }
};

/**
 * Clear cart items from localStorage
 */
export const clearCartItems = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('cart_items');
};

/**
 * Add item to cart in localStorage
 */
export const addToCart = (item: CartItem): void => {
  const currentItems = getCartItems();
  const existingItemIndex = currentItems.findIndex(
    cartItem => cartItem.id === item.id
  );

  if (existingItemIndex >= 0) {
    // Update quantity if item already exists
    currentItems[existingItemIndex].quantity += item.quantity;
  } else {
    // Add new item
    currentItems.push(item);
  }

  storeCartItems(currentItems);
};

/**
 * Remove item from cart in localStorage
 */
export const removeFromCart = (itemId: string): void => {
  const currentItems = getCartItems();
  const filteredItems = currentItems.filter(item => item.id !== itemId);
  storeCartItems(filteredItems);
};

/**
 * Update item quantity in cart in localStorage
 */
export const updateCartItemQuantity = (
  itemId: string,
  quantity: number
): void => {
  const currentItems = getCartItems();
  const updatedItems = currentItems.map(item =>
    item.id === itemId ? { ...item, quantity } : item
  );
  storeCartItems(updatedItems);
};

/**
 * Calculate total price of cart items
 */
export const calculateCartTotal = (items: CartItem[]): number => {
  return items.reduce((total, item) => {
    const itemPrice = item.variant?.price ?? item.product?.price ?? 0;
    return total + itemPrice * item.quantity;
  }, 0);
};

/**
 * Calculate total number of items in cart
 */
export const calculateCartItemCount = (items: CartItem[]): number => {
  return items.reduce((total, item) => total + item.quantity, 0);
};
