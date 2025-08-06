# Data Access Library

Shared RTK Query configuration, types, and utilities for the e-commerce micro-frontend architecture.

## Features

- **RTK Query API**: Comprehensive fakestoreapi integration
- **Shared Types**: TypeScript definitions for all entities
- **Cart Utilities**: Local storage based cart management
- **Product Utilities**: Filtering, sorting, and search functions
- **Authentication**: JWT token management and auth utilities
- **Redux Store**: Shared store configuration
- **Module Federation**: Federation utilities and types

## API Endpoints

### Products

```typescript
// Get all products
useGetProductsQuery();

// Get product by ID
useGetProductByIdQuery(id);

// Get product variants
useGetVariantsQuery(productId);

// Get products by category
useGetProductsByCategoryQuery(category);

// Get all categories
useGetCategoriesQuery();
```

### Cart (API based)

```typescript
// Get cart items
useGetCartItemsQuery();

// Add to cart
useAddToCartMutation();

// Update cart item quantity
useUpdateCartItemMutation();

// Remove from cart
useRemoveFromCartMutation();

// Clear cart
useClearCartMutation();
```

### Authentication

```typescript
// Register user
useRegisterUserMutation();

// Login user
useLoginUserMutation();

// Logout
useLogoutMutation();

// Get profile
useGetProfileQuery();

// Refresh token
useRefreshTokenMutation();
```

### Orders

```typescript
// Get user orders
useGetOrdersQuery();

// Create order
useCreateOrderMutation();
```

### Addresses

```typescript
// Get user addresses
useGetAddressesQuery();

// Add address
useAddAddressMutation();
```

### Reviews

```typescript
// Get product reviews
useGetReviewsQuery(productId);

// Add review
useAddReviewMutation();
```

## Types

### Core Types

```typescript
interface Product {
  id: string;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: { rate: number; count: number };
}

interface CartItem {
  productId: string;
  quantity: number;
  product: Product;
}

interface Cart {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}
```

## Utilities

### Cart Utilities

```typescript
import {
  calculateCartTotal,
  calculateCartItemCount,
  addToCart,
  removeFromCart,
  updateCartItemQuantity,
  formatPrice,
  saveCartToStorage,
  loadCartFromStorage,
} from '@data-access/cart-utils';
```

### Product Utilities

```typescript
import {
  filterProducts,
  sortProducts,
  searchProducts,
  getProductCategories,
  formatProductPrice,
  formatProductRating,
  paginateProducts,
} from '@data-access/product-utils';
```

### Authentication Utilities

```typescript
import {
  storeToken,
  getToken,
  removeToken,
  isAuthenticated,
  storeUser,
  getUser,
  clearAuth,
  decodeToken,
  isTokenExpired,
} from '@data-access/auth-utils';

// Custom hooks
import {
  useAuth,
  useProtectedRoute,
  useAuthGuard,
} from '@data-access/auth-hooks';
```

## Store Configuration

```typescript
import { createStore, store } from '@data-access/store';

// Use default store
const appStore = store;

// Or create custom store
const customStore = createStore(preloadedState);
```

## Usage in Applications

### Host App

```typescript
import { api, useGetProductsQuery } from '@data-access/api';
import { store } from '@data-access/store';

// Configure store
const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(api.middleware),
});
```

### Products Remote

```typescript
import { useGetProductsQuery, useGetProductByIdQuery, useGetVariantsQuery } from '@data-access/api';
import { filterProducts, sortProducts, getVariantOptions } from '@data-access/product-utils';

function ProductsList() {
  const { data: products } = useGetProductsQuery();
  const filteredProducts = filterProducts(products, {
    category: 'electronics',
  });
  // ...
}

function ProductDetail({ productId }: { productId: string }) {
  const { data: product } = useGetProductByIdQuery(productId);
  const { data: variants } = useGetVariantsQuery(productId);

  const variantOptions = getVariantOptions(variants || []);

  return (
    <div>
      <h1>{product?.title}</h1>
      <p>{product?.description}</p>
      <p>Price: ${product?.price}</p>

      {variants && variants.length > 0 && (
        <div>
          <h3>Variants</h3>
          {Object.entries(variantOptions).map(([name, values]) => (
            <div key={name}>
              <label>{name}:</label>
              <select>
                {values.map(value => (
                  <option key={value} value={value}>{value}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

### Basket Remote

```typescript
import { useGetCartItemsQuery, useAddToCartMutation } from '@data-access/api';
import { calculateCartTotal, formatPrice } from '@data-access/cart-utils';

function Basket() {
  const { data: cartItems } = useGetCartItemsQuery();
  const [addToCart] = useAddToCartMutation();
  const total = calculateCartTotal(cartItems);
  // ...
}

function AddToCartButton({ product, variantId }: { product: Product; variantId?: string }) {
  const [addToCart, { isLoading }] = useAddToCartMutation();

  const handleAddToCart = async () => {
    try {
      await addToCart({
        productId: product.id,
        quantity: 1,
        variantId
      }).unwrap();
      // Show success message
    } catch (error) {
      // Handle error
    }
  };

  return (
    <button onClick={handleAddToCart} disabled={isLoading}>
      {isLoading ? 'Adding...' : 'Add to Cart'}
    </button>
  );
}

function CartItemComponent({ item }: { item: CartItem }) {
  const [updateCartItem] = useUpdateCartItemMutation();
  const [removeFromCart] = useRemoveFromCartMutation();

  const handleQuantityChange = async (quantity: number) => {
    try {
      await updateCartItem({ itemId: item.id, quantity }).unwrap();
    } catch (error) {
      // Handle error
    }
  };

  const handleRemove = async () => {
    try {
      await removeFromCart(item.id).unwrap();
    } catch (error) {
      // Handle error
    }
  };

  return (
    <div>
      <h3>{item.product.title}</h3>
      <p>Quantity: {item.quantity}</p>
      <p>Price: ${item.product.price}</p>
      {item.variant && <p>Variant: {item.variant.name} - {item.variant.value}</p>}
      <button onClick={() => handleQuantityChange(item.quantity + 1)}>+</button>
      <button onClick={() => handleQuantityChange(item.quantity - 1)}>-</button>
      <button onClick={handleRemove}>Remove</button>
    </div>
  );
}

function OrdersList() {
  const { data: orders, isLoading, error } = useGetOrdersQuery();

  if (isLoading) return <div>Loading orders...</div>;
  if (error) return <div>Error loading orders</div>;

  return (
    <div>
      <h2>My Orders</h2>
      {orders?.map(order => (
        <div key={order.id}>
          <h3>Order #{order.id}</h3>
          <p>Status: {order.status}</p>
          <p>Total: ${order.totalPrice}</p>
          <p>Date: {new Date(order.createdAt!).toLocaleDateString()}</p>
        </div>
      ))}
    </div>
  );
}

function CheckoutForm({ cartItems }: { cartItems: CartItem[] }) {
  const [createOrder, { isLoading }] = useCreateOrderMutation();
  const { data: addresses } = useGetAddressesQuery();

  const handleCheckout = async (shippingAddress: Address, paymentMethod: string) => {
    try {
      await createOrder({
        items: cartItems,
        shippingAddress,
        paymentMethod,
      }).unwrap();
      // Redirect to order confirmation
    } catch (error) {
      // Handle error
    }
  };

  return (
    <form>
      {/* Address selection */}
      {addresses && (
        <select>
          {addresses.map(address => (
            <option key={address.id} value={address.id}>
              {address.street}, {address.city}
            </option>
          ))}
        </select>
      )}

      {/* Payment method selection */}
      <select>
        <option value="credit_card">Credit Card</option>
        <option value="paypal">PayPal</option>
      </select>

      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Processing...' : 'Place Order'}
      </button>
    </form>
  );
}

function AddressForm() {
  const [addAddress, { isLoading }] = useAddAddressMutation();

  const handleAddAddress = async (addressData: Omit<Address, 'id'>) => {
    try {
      await addAddress(addressData).unwrap();
      // Show success message
    } catch (error) {
      // Handle error
    }
  };

    return (
    <form>
      <input type="text" placeholder="Street" />
      <input type="text" placeholder="City" />
      <input type="text" placeholder="State" />
      <input type="text" placeholder="ZIP Code" />
      <input type="text" placeholder="Country" />

      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Adding...' : 'Add Address'}
      </button>
    </form>
  );
}

function ProductReviews({ productId }: { productId: string }) {
  const { data: reviews, isLoading, error } = useGetReviewsQuery(productId);

  if (isLoading) return <div>Loading reviews...</div>;
  if (error) return <div>Error loading reviews</div>;

  return (
    <div>
      <h3>Customer Reviews</h3>
      {reviews?.map(review => (
        <div key={review.id}>
          <div>
            {[...Array(5)].map((_, i) => (
              <span key={i} style={{ color: i < review.rating ? '#faad14' : '#d9d9d9' }}>
                ★
              </span>
            ))}
          </div>
          <p>{review.comment}</p>
          <small>By {review.userName || 'Anonymous'}</small>
          <small>{new Date(review.createdAt!).toLocaleDateString()}</small>
        </div>
      ))}
    </div>
  );
}

function AddReviewForm({ productId }: { productId: string }) {
  const [addReview, { isLoading }] = useAddReviewMutation();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateReview({ rating, comment })) {
      alert('Please provide a valid rating (1-5) and comment');
      return;
    }

    try {
      await addReview({
        productId,
        rating,
        comment: comment.trim(),
      }).unwrap();

      // Reset form
      setRating(5);
      setComment('');

      // Show success message
    } catch (error) {
      // Handle error
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Rating:</label>
        {[...Array(5)].map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setRating(i + 1)}
            style={{ color: i < rating ? '#faad14' : '#d9d9d9' }}
          >
            ★
          </button>
        ))}
      </div>

      <div>
        <label>Comment:</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience with this product..."
          rows={4}
        />
      </div>

      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
}

function ProductDetailWithReviews({ productId }: { productId: string }) {
  const { data: product } = useGetProductByIdQuery(productId);
  const { data: reviews, isLoading: reviewsLoading } = useGetReviewsQuery(productId);

  const averageRating = reviews ? calculateAverageRating(reviews) : 0;
  const ratingColor = getRatingColor(averageRating);

  return (
    <div>
      {product && (
        <div>
          <h1>{product.title}</h1>
          <p>${product.price}</p>

          {/* Product Rating Summary */}
          <div>
            <span style={{ color: ratingColor, fontSize: '1.2em' }}>
              {formatRating(averageRating)} ★
            </span>
            <span>({reviews?.length || 0} reviews)</span>
          </div>

          <p>{product.description}</p>
        </div>
      )}

      {/* Reviews Section */}
      <div>
        <h3>Customer Reviews</h3>
        {reviewsLoading ? (
          <div>Loading reviews...</div>
        ) : (
          <>
            {reviews?.map(review => (
              <div key={review.id} style={{ border: '1px solid #d9d9d9', padding: '1rem', margin: '1rem 0' }}>
                <div>
                  {[...Array(5)].map((_, i) => (
                    <span key={i} style={{ color: i < review.rating ? '#faad14' : '#d9d9d9' }}>
                      ★
                    </span>
                  ))}
                  <span style={{ marginLeft: '0.5rem', fontWeight: 'bold' }}>
                    {review.rating}/5
                  </span>
                </div>
                <p style={{ margin: '0.5rem 0' }}>{review.comment}</p>
                <small style={{ color: '#8c8c8c' }}>
                  By {review.userName || 'Anonymous'} • {new Date(review.createdAt!).toLocaleDateString()}
                </small>
              </div>
            ))}

            {/* Add Review Form */}
            <AddReviewForm productId={productId} />
          </>
        )}
      </div>
    </div>
  );
}
```

### Authentication Example

```typescript
import { useAuth, useProtectedRoute } from '@data-access/auth-hooks';

function LoginForm() {
  const { login, loginLoading, loginError } = useAuth();

  const handleSubmit = async (email: string, password: string) => {
    try {
      await login(email, password);
      // Redirect to dashboard
    } catch (error) {
      // Handle error
    }
  };
}

function RegisterForm() {
  const { register, registerLoading, registerError } = useAuth();

  const handleSubmit = async (email: string, password: string, name: string) => {
    try {
      await register(email, password, name);
      // Redirect to dashboard
    } catch (error) {
      // Handle error
    }
  };
}

function ProtectedComponent() {
  const { isAuthenticated, isLoading, shouldRedirect } = useProtectedRoute();

  if (isLoading) return <div>Loading...</div>;
  if (shouldRedirect) return <Navigate to="/login" />;

  return <div>Protected content</div>;
}
```

## Module Federation

### Federation Types

```typescript
import {
  FederationModule,
  RemoteModule,
  ProductsListProps,
  BasketProps,
} from '@data-access/federation';
```

### Federation Loader

```typescript
import {
  loadRemoteComponent,
  isRemoteAvailable,
  preloadRemoteComponent,
} from '@data-access/federation-loader';

// Load remote component
const ProductsList = await loadRemoteComponent(
  'products_remote',
  './ProductsList'
);
```

## Development

### Type Checking

```bash
pnpm type-check
```

### Linting

```bash
pnpm lint
pnpm lint:fix
```

## Dependencies

- `@reduxjs/toolkit`: RTK Query and Redux Toolkit
- `react`: React types
- `react-dom`: React DOM types

## Peer Dependencies

- `react`: ^19.1.0
- `react-dom`: ^19.1.0

## Architecture Benefits

- **Shared Logic**: Common utilities across all apps
- **Type Safety**: Consistent TypeScript definitions
- **Caching**: RTK Query automatic caching
- **Local Storage**: Persistent cart state
- **Modular**: Easy to extend and maintain
