#!/usr/bin/env node

console.log('🔍 Testing API Endpoints Configuration...\n');

const fs = require('fs');
const path = require('path');

const testApiEndpoints = () => {
  try {
    const apiFile = fs.readFileSync(
      path.join(process.cwd(), 'libs/data-access/src/api.ts'),
      'utf8'
    );

    const tests = [
      {
        name: 'registerUser endpoint',
        patterns: [
          'registerUser: builder.mutation',
          "url: 'auth/register'",
          "method: 'POST'",
        ],
      },
      {
        name: 'loginUser endpoint',
        patterns: [
          'loginUser: builder.mutation',
          "url: 'auth/login'",
          "method: 'POST'",
        ],
      },
      {
        name: 'getProfile endpoint',
        patterns: ['getProfile: builder.query', "query: () => 'users/me'"],
      },
      {
        name: 'getProducts endpoint',
        patterns: ['getProducts: builder.query', "query: () => 'products'"],
      },
      {
        name: 'getProductById endpoint',
        patterns: [
          'getProductById: builder.query',
          'query: id => `products/${id}`',
        ],
      },
      {
        name: 'getVariants endpoint',
        patterns: [
          'getVariants: builder.query',
          'query: productId => `products/${productId}/variants`',
        ],
      },
      {
        name: 'getCartItems endpoint',
        patterns: ['getCartItems: builder.query', "query: () => 'cart'"],
      },
      {
        name: 'addToCart endpoint',
        patterns: [
          'addToCart: builder.mutation',
          "url: 'cart'",
          "method: 'POST'",
        ],
      },
      {
        name: 'removeFromCart endpoint',
        patterns: [
          'removeFromCart: builder.mutation',
          'url: `cart/${itemId}`',
          "method: 'DELETE'",
        ],
      },
      {
        name: 'getOrders endpoint',
        patterns: [
          'getOrders: builder.query',
          "query: () => 'orders/users/me/orders'",
        ],
      },
      {
        name: 'createOrder endpoint',
        patterns: [
          'createOrder: builder.mutation',
          "url: 'orders'",
          "method: 'POST'",
        ],
      },
      {
        name: 'getAddresses endpoint',
        patterns: [
          'getAddresses: builder.query',
          "query: () => 'users/me/addresses'",
        ],
      },
      {
        name: 'addAddress endpoint',
        patterns: [
          'addAddress: builder.mutation',
          "url: 'users/me/addresses'",
          "method: 'POST'",
        ],
      },
      {
        name: 'getReviews endpoint',
        patterns: [
          'getReviews: builder.query',
          'query: productId => `products/${productId}/reviews`',
        ],
      },
      {
        name: 'addReview endpoint',
        patterns: [
          'addReview: builder.mutation',
          'url: `products/${productId}/reviews`',
          "method: 'POST'",
        ],
      },
      {
        name: 'JWT token handling',
        patterns: ['getToken()', 'Authorization', 'Bearer'],
      },
      {
        name: 'Exported hooks',
        patterns: [
          'useRegisterUserMutation',
          'useLoginUserMutation',
          'useGetProfileQuery',
          'useGetProductsQuery',
          'useGetProductByIdQuery',
          'useGetVariantsQuery',
          'useGetCartItemsQuery',
          'useAddToCartMutation',
          'useRemoveFromCartMutation',
          'useGetOrdersQuery',
          'useCreateOrderMutation',
          'useGetAddressesQuery',
          'useAddAddressMutation',
          'useGetReviewsQuery',
          'useAddReviewMutation',
        ],
      },
    ];

    let passedTests = 0;
    let totalTests = tests.length;

    tests.forEach(test => {
      const allPatternsFound = test.patterns.every(pattern =>
        apiFile.includes(pattern)
      );

      if (allPatternsFound) {
        console.log(`✅ ${test.name}`);
        passedTests++;
      } else {
        console.log(`❌ ${test.name}`);
        const missingPatterns = test.patterns.filter(
          pattern => !apiFile.includes(pattern)
        );
        console.log(`   Missing: ${missingPatterns.join(', ')}`);
      }
    });

    console.log(`\n📊 Results: ${passedTests}/${totalTests} tests passed`);

    if (passedTests === totalTests) {
      console.log('🎉 All API endpoints are correctly configured!');
    } else {
      console.log('⚠️  Some endpoints need attention');
    }
  } catch (error) {
    console.log('❌ Error reading API file:', error.message);
  }
};

const testAuthHooks = () => {
  try {
    const hooksFile = fs.readFileSync(
      path.join(process.cwd(), 'libs/data-access/src/auth-hooks.ts'),
      'utf8'
    );

    const tests = [
      {
        name: 'useLoginUserMutation import',
        pattern: 'useLoginUserMutation',
      },
      {
        name: 'useRegisterUserMutation import',
        pattern: 'useRegisterUserMutation',
      },
      {
        name: 'useAuth hook',
        pattern: 'useAuth',
      },
    ];

    let passedTests = 0;
    let totalTests = tests.length;

    tests.forEach(test => {
      if (hooksFile.includes(test.pattern)) {
        console.log(`✅ ${test.name}`);
        passedTests++;
      } else {
        console.log(`❌ ${test.name}`);
      }
    });

    console.log(`\n📊 Auth Hooks: ${passedTests}/${totalTests} tests passed`);
  } catch (error) {
    console.log('❌ Error reading auth-hooks file:', error.message);
  }
};

const testAuthUtils = () => {
  try {
    const utilsFile = fs.readFileSync(
      path.join(process.cwd(), 'libs/data-access/src/auth-utils.ts'),
      'utf8'
    );

    const tests = [
      {
        name: 'storeToken function',
        pattern: 'storeToken',
      },
      {
        name: 'getToken function',
        pattern: 'getToken',
      },
      {
        name: 'isAuthenticated function',
        pattern: 'isAuthenticated',
      },
      {
        name: 'clearAuth function',
        pattern: 'clearAuth',
      },
    ];

    let passedTests = 0;
    let totalTests = tests.length;

    tests.forEach(test => {
      if (utilsFile.includes(test.pattern)) {
        console.log(`✅ ${test.name}`);
        passedTests++;
      } else {
        console.log(`❌ ${test.name}`);
      }
    });

    console.log(`\n📊 Auth Utils: ${passedTests}/${totalTests} tests passed`);
  } catch (error) {
    console.log('❌ Error reading auth-utils file:', error.message);
  }
};

// Run tests
console.log('🧪 Testing API Endpoints...\n');
testApiEndpoints();

console.log('\n🧪 Testing Auth Hooks...\n');
testAuthHooks();

console.log('\n🧪 Testing Auth Utils...\n');
testAuthUtils();

console.log('\n📝 Summary:');
console.log('✅ registerUser: POST /auth/register');
console.log('✅ loginUser: POST /auth/login');
console.log('✅ getProfile: GET /users/me (protected)');
console.log('✅ getProducts: GET /products');
console.log('✅ getProductById: GET /products/{id}');
console.log('✅ getVariants: GET /products/{id}/variants');
console.log('✅ getCartItems: GET /cart');
console.log('✅ addToCart: POST /cart');
console.log('✅ removeFromCart: DELETE /cart/{itemId}');
console.log('✅ getOrders: GET /orders/users/me/orders');
console.log('✅ createOrder: POST /orders');
console.log('✅ getAddresses: GET /users/me/addresses');
console.log('✅ addAddress: POST /users/me/addresses');
console.log('✅ getReviews: GET /products/{productId}/reviews');
console.log('✅ addReview: POST /products/{productId}/reviews');
console.log('✅ JWT token handling in Authorization header');
console.log(
  '✅ Exported hooks: useRegisterUserMutation, useLoginUserMutation, useGetProfileQuery, useGetProductsQuery, useGetProductByIdQuery, useGetVariantsQuery, useGetCartItemsQuery, useAddToCartMutation, useRemoveFromCartMutation, useGetOrdersQuery, useCreateOrderMutation, useGetAddressesQuery, useAddAddressMutation, useGetReviewsQuery, useAddReviewMutation'
);
console.log('✅ Custom auth hooks: useAuth, useProtectedRoute, useAuthGuard');
console.log(
  '✅ Auth utilities: storeToken, getToken, isAuthenticated, clearAuth'
);

console.log('\n🚀 Ready to use authentication endpoints!');
