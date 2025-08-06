'use client';

import React, { useState, createContext, useContext } from 'react';
import { Navbar } from './Navbar';
import { CartDrawer } from './CartDrawer';

interface CartContextType {
  setCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartOpen, setCartOpen] = useState(false);

  const handleCartClick = () => {
    setCartOpen(true);
  };

  const handleCartClose = () => {
    setCartOpen(false);
  };

  return (
    <CartContext.Provider value={{ setCartOpen }}>
      <Navbar onCartClick={handleCartClick} />
      {children}
      <CartDrawer open={cartOpen} onClose={handleCartClose} />
    </CartContext.Provider>
  );
}
