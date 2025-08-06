// Module Federation shared types
export interface FederationModule {
  default: React.ComponentType<any>;
}

export interface RemoteModule {
  [key: string]: FederationModule;
}

// Remote component types
export interface ProductsListProps {
  onAddToCart?: (product: any) => void;
}

export interface BasketProps {
  items?: any[];
  onRemoveItem?: (productId: string) => void;
  onUpdateQuantity?: (productId: string, quantity: number) => void;
  onClearBasket?: () => void;
}

// Federation configuration
export const FEDERATION_CONFIG = {
  HOST_URL: 'http://localhost:3000',
  PRODUCTS_URL: 'http://localhost:3001',
  BASKET_URL: 'http://localhost:3002',
} as const;
