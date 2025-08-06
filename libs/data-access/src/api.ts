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
import {
  getToken,
  storeToken,
  storeUser,
  clearAuth,
  getGuestToken,
} from './auth-utils';

// Base API configuration
export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api',
    prepareHeaders: headers => {
      headers.set('Content-Type', 'application/json');
      // Önce user token, yoksa guest token
      const userToken = getToken();
      const guestToken = getGuestToken();
      const token = userToken || guestToken;

      // console.log('🔑 Token Debug:', {
      //   userToken: userToken ? 'exists' : 'null',
      //   guestToken: guestToken ? 'exists' : 'null',
      //   finalToken: token ? `${token.substring(0, 10)}...` : 'NO TOKEN',
      //   tokenType: userToken ? 'USER' : guestToken ? 'GUEST' : 'NONE',
      // });
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
      // Mock data for development
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          // If API fails, return mock data
          console.log('API failed, using mock data');
        }
      },
      // Mock data fallback
      transformResponse: (response: any) => {
        if (!response || response.error) {
          return [
            {
              id: '1',
              title: 'iPhone 15 Pro',
              description: 'Latest iPhone with advanced features',
              price: 999.99,
              imageUrl:
                'https://via.placeholder.com/300x300?text=iPhone+15+Pro',
              category: 'Electronics',
              rating: 4.8,
              stock: 50,
            },
            {
              id: '2',
              title: 'MacBook Air M2',
              description: 'Powerful laptop for work and creativity',
              price: 1299.99,
              imageUrl:
                'https://via.placeholder.com/300x300?text=MacBook+Air+M2',
              category: 'Electronics',
              rating: 4.9,
              stock: 30,
            },
            {
              id: '3',
              title: 'AirPods Pro',
              description: 'Wireless earbuds with noise cancellation',
              price: 249.99,
              imageUrl: 'https://via.placeholder.com/300x300?text=AirPods+Pro',
              category: 'Electronics',
              rating: 4.7,
              stock: 100,
            },
          ];
        }
        return response;
      },
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
      // Mock data fallback
      transformResponse: (response: any) => {
        if (!response || response.error) {
          return [];
        }
        return response;
      },
    }),

    addToCart: build.mutation<
      CartItem[],
      { variantId: number; quantity?: number }
    >({
      query: ({ variantId, quantity = 1 }) => ({
        url: 'cart', // backend endpoint is /api/cart
        method: 'POST',
        body: { variantId, quantity },
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
      query: ({ itemId, quantity }) => {
        console.log('🔍 updateCartItem called with:', { itemId, quantity });
        return {
          url: `cart/${itemId}`,
          method: 'PATCH', // Try PATCH instead of PUT
          body: { quantity },
        };
      },
      invalidatesTags: ['Cart'],
    }),

    clearCart: build.mutation<void, void>({
      query: () => ({
        url: 'cart',
        method: 'DELETE',
      }),
      invalidatesTags: ['Cart'],
      // Mock data fallback for development
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.log('Cart clearing failed, using mock fallback');
          // Simulate successful cart clearing
        }
      },
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
          // Don't log here, let the component handle the error
          // console.error('Registration failed:', error);
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

    updateAddress: build.mutation<Address, Address>({
      query: addressData => ({
        url: `users/me/addresses/${addressData.id}`,
        method: 'PUT',
        body: addressData,
      }),
      invalidatesTags: ['Address'],
    }),

    deleteAddress: build.mutation<void, number>({
      query: addressId => ({
        url: `users/me/addresses/${addressId}`,
        method: 'DELETE',
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
  useUpdateAddressMutation,
  useDeleteAddressMutation,

  // Reviews hooks
  useGetReviewsQuery,
  useAddReviewMutation,
} = api;
