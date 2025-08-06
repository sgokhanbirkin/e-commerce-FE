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
    item => item.productId === product.id.toString() && item.variantId === variantId
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
