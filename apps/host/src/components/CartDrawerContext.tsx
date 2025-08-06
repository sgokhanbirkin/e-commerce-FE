'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface CartDrawerContextType {
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

const CartDrawerContext = createContext<CartDrawerContextType | undefined>(
  undefined
);

export const useCartDrawer = () => {
  const context = useContext(CartDrawerContext);
  if (!context) {
    throw new Error('useCartDrawer must be used within a CartDrawerProvider');
  }
  return context;
};

export function CartDrawerProvider({ children }: { children: ReactNode }) {
  const [isCartOpen, setIsCartOpen] = useState(false);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  return (
    <CartDrawerContext.Provider value={{ isCartOpen, openCart, closeCart }}>
      {children}
    </CartDrawerContext.Provider>
  );
}
