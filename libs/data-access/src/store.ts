import { configureStore } from '@reduxjs/toolkit';
import { api } from './api';
import type { RootState } from './types';

// Create the store configuration
export const createStore = (preloadedState?: Partial<RootState>) => {
  return configureStore({
    reducer: {
      [api.reducerPath]: api.reducer,
    },
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware().concat(api.middleware),
    preloadedState,
    devTools: process.env.NODE_ENV !== 'production',
  });
};

// Export store types
export type AppStore = ReturnType<typeof createStore>;
export type AppDispatch = AppStore['dispatch'];

// Export a default store instance
export const store = createStore();

// Export store utilities
export const getState = () => store.getState();
export const dispatch = store.dispatch;
// TODO: Fix Redux store type issues - temporary workaround
// The store configuration has complex type issues with RTK Query
// This will be resolved when the applications are properly initialized
