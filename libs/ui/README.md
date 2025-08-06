# UI Library

Shared UI component library based on atomic design principles using Ant Design.

## Architecture

### Atomic Design Structure

- **Atoms**: Basic building blocks (Button, Card, Typography)
- **Molecules**: Simple combinations of atoms (ProductCard, CartItem)
- **Organisms**: Complex UI sections (ProductGrid, CartList)
- **Templates**: Page layouts (future)
- **Pages**: Complete pages (future)

## Theme System

### Color Palette

```typescript
import { colors } from '@ui/theme-config';

// Primary colors
colors.primary[600]; // Main brand color

// Semantic colors
colors.success[600]; // Success states
colors.warning[600]; // Warning states
colors.error[600]; // Error states

// Neutral colors
colors.neutral[100]; // Light backgrounds
colors.neutral[900]; // Dark text
```

### Typography Scale

```typescript
import { typography } from '@ui/theme-config';

// Font sizes
typography.fontSize.xs; // 12px
typography.fontSize.sm; // 14px
typography.fontSize.base; // 16px
typography.fontSize.lg; // 18px
typography.fontSize.xl; // 20px
typography.fontSize['2xl']; // 24px
```

### Spacing Scale

```typescript
import { spacing } from '@ui/theme-config';

spacing.xs; // 4px
spacing.sm; // 8px
spacing.md; // 16px
spacing.lg; // 24px
spacing.xl; // 32px
spacing['2xl']; // 48px
```

## Components

### Atoms

#### Button

```typescript
import { Button, PrimaryButton, SecondaryButton } from '@ui/atoms/button';

<Button variant="primary" size="md">
  Click me
</Button>

<PrimaryButton loading>
  Loading...
</PrimaryButton>
```

**Variants**: `primary`, `secondary`, `outline`, `ghost`, `danger`
**Sizes**: `xs`, `sm`, `md`, `lg`, `xl`

#### Card

```typescript
import { Card, ElevatedCard, OutlinedCard } from '@ui/atoms/card';

<Card variant="elevated" hoverable>
  Card content
</Card>
```

**Variants**: `default`, `elevated`, `outlined`, `ghost`
**Sizes**: `sm`, `md`, `lg`

#### Typography

```typescript
import { Title, Text, Paragraph, Link } from '@ui/atoms/typography';

<Title level={1}>Main Heading</Title>
<Text type="secondary">Secondary text</Text>
<Paragraph ellipsis={{ rows: 2 }}>
  Long paragraph text...
</Paragraph>
<Link href="/products">Products</Link>
```

### Molecules

#### ProductCard

```typescript
import { ProductCard } from '@ui/molecules/product-card';

<ProductCard
  product={product}
  onAddToCart={handleAddToCart}
  onViewDetails={handleViewDetails}
  onToggleWishlist={handleToggleWishlist}
/>
```

**Features**:

- Product image with hover actions
- Rating display
- Price formatting
- Add to cart functionality
- Wishlist toggle
- View details

#### CartItem

```typescript
import { CartItem } from '@ui/molecules/cart-item';

<CartItem
  item={cartItem}
  onUpdateQuantity={handleUpdateQuantity}
  onRemove={handleRemove}
/>
```

**Features**:

- Product image and details
- Quantity controls
- Price calculations
- Remove functionality

### Organisms

#### ProductGrid

```typescript
import { ProductGrid, CompactProductGrid } from '@ui/organisms/product-grid';

<ProductGrid
  products={products}
  columns={4}
  onAddToCart={handleAddToCart}
  showPagination={true}
  currentPage={1}
  totalPages={10}
  onPageChange={handlePageChange}
/>
```

**Features**:

- Responsive grid layout
- Loading states
- Empty states
- Pagination
- Event handlers for cart actions

#### CartList

```typescript
import { CartList } from '@ui/organisms/cart-list';

<CartList
  items={cartItems}
  onUpdateQuantity={handleUpdateQuantity}
  onRemove={handleRemove}
  onClearCart={handleClearCart}
  onCheckout={handleCheckout}
/>
```

**Features**:

- Cart item list
- Total calculations
- Clear cart functionality
- Checkout actions
- Empty cart state

## Theme Provider

### Basic Usage

```typescript
import { ThemeProvider } from '@ui/theme-provider';

function App() {
  return (
    <ThemeProvider>
      <YourApp />
    </ThemeProvider>
  );
}
```

### Custom Theme

```typescript
import { ThemeProvider, antdTheme } from '@ui/theme-provider';

const customTheme = {
  ...antdTheme,
  token: {
    ...antdTheme.token,
    colorPrimary: '#your-color',
  },
};

<ThemeProvider theme={customTheme}>
  <YourApp />
</ThemeProvider>
```

## Styling

### CSS Classes

All components use BEM-style class names:

- `.kayra-button`
- `.kayra-button--primary`
- `.kayra-button--md`
- `.kayra-product-card`
- `.kayra-product-card__image`
- `.kayra-product-card__actions`

### Custom Styling

```typescript
<ProductCard
  className="custom-product-card"
  style={{ border: '2px solid red' }}
/>
```

## Responsive Design

### Grid System

Components use Ant Design's responsive grid:

- `xs`: < 576px
- `sm`: ≥ 576px
- `md`: ≥ 768px
- `lg`: ≥ 992px
- `xl`: ≥ 1200px
- `xxl`: ≥ 1600px

### ProductGrid Responsive

```typescript
// Automatically adjusts columns based on screen size
<ProductGrid columns={4} />
// xs: 1 column
// sm: 2 columns
// md: 3 columns
// lg+: 4 columns
```

## Accessibility

### ARIA Labels

All interactive components include proper ARIA labels:

- Button actions
- Form inputs
- Navigation elements
- Loading states

### Keyboard Navigation

- Tab navigation support
- Enter/Space key activation
- Escape key for modals

## Performance

### Optimization Features

- Lazy loading for images
- Memoized components
- Efficient re-renders
- Bundle splitting

### Best Practices

```typescript
// Use React.memo for expensive components
const MemoizedProductCard = React.memo(ProductCard);

// Avoid inline styles for performance
const styles = {
  container: { padding: '16px' },
};

<div style={styles.container}>
  <ProductCard />
</div>
```

## Development

### Storybook

```bash
pnpm storybook
```

### Type Checking

```bash
pnpm type-check
```

### Linting

```bash
pnpm lint
pnpm lint:fix
```

## Usage Examples

### E-commerce Product Page

```typescript
import { ProductGrid, ThemeProvider } from '@ui';

function ProductPage() {
  return (
    <ThemeProvider>
      <ProductGrid
        products={products}
        onAddToCart={addToCart}
        columns={4}
        showPagination
      />
    </ThemeProvider>
  );
}
```

### Shopping Cart

```typescript
import { CartList, ThemeProvider } from '@ui';

function CartPage() {
  return (
    <ThemeProvider>
      <CartList
        items={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemove={removeItem}
        onCheckout={checkout}
      />
    </ThemeProvider>
  );
}
```

## Dependencies

- `antd`: ^5.15.0 - UI component library
- `@ant-design/icons`: ^5.3.0 - Icon library
- `react`: ^19.1.0 - React library
- `react-dom`: ^19.1.0 - React DOM

## Peer Dependencies

- `react`: ^19.1.0
- `react-dom`: ^19.1.0

## Architecture Benefits

- **Consistency**: Unified design system
- **Reusability**: Shared components across apps
- **Maintainability**: Centralized UI logic
- **Performance**: Optimized bundle size
- **Accessibility**: Built-in ARIA support
- **Responsive**: Mobile-first design
- **Type Safety**: Full TypeScript support
