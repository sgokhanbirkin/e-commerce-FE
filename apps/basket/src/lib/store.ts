import { configureStore, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { CartItem, Product } from '@data-access/types';

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Product>) => {
      const product = action.payload;
      const existingItem = state.items.find(
        item => item.productId === product.id.toString()
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({
          id: product.id.toString(),
          productId: product.id.toString(),
          quantity: 1,
          product,
        });
      }
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      const productId = action.payload;
      state.items = state.items.filter(item => item.productId !== productId);
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ productId: string; quantity: number }>
    ) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find(item => item.productId === productId);

      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter(
            item => item.productId !== productId
          );
        } else {
          item.quantity = quantity;
        }
      }
    },
    clearCart: state => {
      state.items = [];
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } =
  cartSlice.actions;

export const store = configureStore({
  reducer: {
    cart: cartSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
