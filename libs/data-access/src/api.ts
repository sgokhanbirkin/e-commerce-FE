// RTK Query API configuration
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  Product,
  CartItem,
  Variant,
  Order,
  Address,
  Review,
  Category,
} from './types';
import { getToken, storeToken, storeUser, clearAuth } from './auth-utils';

// Base API configuration
export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api',
    prepareHeaders: headers => {
      headers.set('Content-Type', 'application/json');

      // Add JWT token from localStorage if available
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }

      return headers;
    },
  }),
  tagTypes: [
    'Product',
    'Cart',
    'Category',
    'Auth',
    'Variant',
    'Order',
    'Address',
    'Review',
  ],
  endpoints: build => ({
    // Product endpoints
    getProducts: build.query<Product[], void>({
      query: () => 'products?limit=50',
      providesTags: ['Product'],
    }),

    getProductById: build.query<Product, string>({
      query: (id: string) => `products/${id}`,
      providesTags: (result, error, id) => [{ type: 'Product', id }],
    }),

    getVariants: build.query<Variant[], string>({
      query: (productId: string) => `products/${productId}/variants`,
      providesTags: (result, error, productId) => [
        { type: 'Variant', id: productId },
      ],
    }),

    getProductsByCategory: build.query<Product[], string>({
      query: (categoryId: string) =>
        `categories/${categoryId}/products?limit=50`,
      transformResponse: (response: { data: Product[]; message: string }) =>
        response.data,
      providesTags: ['Product'],
    }),

    getCategories: build.query<string[], void>({
      query: () => 'products/categories',
      providesTags: ['Category'],
    }),

    getCategoriesFromApi: build.query<Category[], void>({
      query: () => 'categories',
      transformResponse: (response: { data: Category[]; message: string }) =>
        response.data,
      providesTags: ['Category'],
    }),

    // Cart endpoints (API based)
    getCartItems: build.query<CartItem[], void>({
      query: () => 'cart',
      providesTags: ['Cart'],
    }),

    addToCart: build.mutation<
      CartItem[],
      { productId: string; quantity?: number; variantId?: string }
    >({
      query: ({ productId, quantity = 1, variantId }) => ({
        url: 'cart',
        method: 'POST',
        body: { productId, quantity, variantId },
      }),
      invalidatesTags: ['Cart'],
    }),

    removeFromCart: build.mutation<void, string>({
      query: (itemId: string) => ({
        url: `cart/${itemId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Cart'],
    }),

    updateCartItem: build.mutation<
      CartItem[],
      { itemId: string; quantity: number }
    >({
      query: ({ itemId, quantity }) => ({
        url: `cart/${itemId}`,
        method: 'PUT',
        body: { quantity },
      }),
      invalidatesTags: ['Cart'],
    }),

    clearCart: build.mutation<void, void>({
      query: () => ({
        url: 'cart',
        method: 'DELETE',
      }),
      invalidatesTags: ['Cart'],
    }),

    // Authentication endpoints
    registerUser: build.mutation<
      { token: string; user: any },
      { email: string; password: string; name: string }
    >({
      query: userData => ({
        url: 'auth/register',
        method: 'POST',
        body: userData,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // Store token and user data on successful registration
          storeToken(data.token);
          storeUser(data.user);
        } catch (error) {
          console.error('Registration failed:', error);
        }
      },
      invalidatesTags: ['Auth'],
    }),

    loginUser: build.mutation<
      { token: string; user: any },
      { email: string; password: string }
    >({
      query: credentials => ({
        url: 'auth/login',
        method: 'POST',
        body: credentials,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // Store token and user data on successful login
          storeToken(data.token);
          storeUser(data.user);
        } catch (error) {
          console.error('Login failed:', error);
        }
      },
      invalidatesTags: ['Auth'],
    }),

    logout: build.mutation<void, void>({
      queryFn: () => {
        try {
          clearAuth();
          return { data: undefined };
        } catch (error) {
          console.error('Logout failed:', error);
          return { error: { status: 'CUSTOM_ERROR', error: 'Logout failed' } };
        }
      },
      invalidatesTags: ['Auth'],
    }),

    getProfile: build.query<any, void>({
      query: () => 'users/me',
      providesTags: ['Auth'],
    }),

    refreshToken: build.mutation<{ token: string }, void>({
      query: () => ({
        url: 'auth/refresh',
        method: 'POST',
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // Store new token
          storeToken(data.token);
        } catch (error) {
          console.error('Token refresh failed:', error);
        }
      },
      invalidatesTags: ['Auth'],
    }),

    // Orders endpoints
    getOrders: build.query<Order[], void>({
      query: () => 'orders/users/me/orders',
      providesTags: ['Order'],
    }),

    createOrder: build.mutation<
      Order,
      { items: CartItem[]; shippingAddress: Address; paymentMethod: string }
    >({
      query: orderData => ({
        url: 'orders',
        method: 'POST',
        body: orderData,
      }),
      invalidatesTags: ['Order', 'Cart'],
    }),

    // Addresses endpoints
    getAddresses: build.query<Address[], void>({
      query: () => 'users/me/addresses',
      providesTags: ['Address'],
    }),

    addAddress: build.mutation<Address, Omit<Address, 'id'>>({
      query: addressData => ({
        url: 'users/me/addresses',
        method: 'POST',
        body: addressData,
      }),
      invalidatesTags: ['Address'],
    }),

    // Reviews endpoints
    getReviews: build.query<Review[], string>({
      query: (productId: string) => `products/${productId}/reviews`,
      providesTags: (result, error, productId) => [
        { type: 'Review', id: productId },
      ],
    }),

    addReview: build.mutation<
      Review,
      { productId: string; rating: number; comment: string }
    >({
      query: ({ productId, ...reviewData }) => ({
        url: `products/${productId}/reviews`,
        method: 'POST',
        body: reviewData,
      }),
      invalidatesTags: (result, error, { productId }) => [
        { type: 'Review', id: productId },
        { type: 'Product', id: productId },
      ],
    }),
  }),
});

// Export hooks
export const {
  // Product hooks
  useGetProductsQuery,
  useGetProductByIdQuery,
  useGetVariantsQuery,
  useGetProductsByCategoryQuery,
  useGetCategoriesQuery,
  useGetCategoriesFromApiQuery,

  // Cart hooks
  useGetCartItemsQuery,
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useRemoveFromCartMutation,
  useClearCartMutation,

  // Authentication hooks
  useRegisterUserMutation,
  useLoginUserMutation,
  useLogoutMutation,
  useGetProfileQuery,
  useRefreshTokenMutation,

  // Orders hooks
  useGetOrdersQuery,
  useCreateOrderMutation,

  // Addresses hooks
  useGetAddressesQuery,
  useAddAddressMutation,

  // Reviews hooks
  useGetReviewsQuery,
  useAddReviewMutation,
} = api;
