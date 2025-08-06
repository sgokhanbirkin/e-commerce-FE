import type {
  Product,
  ProductFilters,
  SortOptions,
  Variant,
  Address,
  Review,
} from './types';

// Product filtering utilities
export const filterProducts = (
  products: Product[],
  filters: ProductFilters
): Product[] => {
  return products.filter(product => {
    // Category filter
    if (filters.category && product.category !== filters.category) {
      return false;
    }

    // Price range filter
    if (filters.minPrice && product.price < filters.minPrice) {
      return false;
    }

    if (filters.maxPrice && product.price > filters.maxPrice) {
      return false;
    }

    // Rating filter
    if (filters.rating && product.rating.rate < filters.rating) {
      return false;
    }

    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      const matchesTitle = product.title.toLowerCase().includes(searchTerm);
      const matchesDescription = product.description
        .toLowerCase()
        .includes(searchTerm);
      const matchesCategory = product.category
        .toLowerCase()
        .includes(searchTerm);

      if (!matchesTitle && !matchesDescription && !matchesCategory) {
        return false;
      }
    }

    return true;
  });
};

// Product sorting utilities
export const sortProducts = (
  products: Product[],
  sortOptions: SortOptions
): Product[] => {
  const { field, direction } = sortOptions;

  return [...products].sort((a, b) => {
    let aValue: any;
    let bValue: any;

    switch (field) {
      case 'price':
        aValue = a.price;
        bValue = b.price;
        break;
      case 'title':
        aValue = a.title.toLowerCase();
        bValue = b.title.toLowerCase();
        break;
      case 'rating':
        aValue = a.rating.rate;
        bValue = b.rating.rate;
        break;
      case 'createdAt':
        aValue = new Date(a.createdAt || '').getTime();
        bValue = new Date(b.createdAt || '').getTime();
        break;
      default:
        return 0;
    }

    if (direction === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });
};

// Product search utilities
export const searchProducts = (
  products: Product[],
  searchTerm: string
): Product[] => {
  if (!searchTerm.trim()) {
    return products;
  }

  const term = searchTerm.toLowerCase();

  return products.filter(product => {
    return (
      product.title.toLowerCase().includes(term) ||
      product.description.toLowerCase().includes(term) ||
      product.category.toLowerCase().includes(term)
    );
  });
};

// Product categorization utilities
export const getProductCategories = (products: Product[]): string[] => {
  const categories = new Set(products.map(product => product.category));
  return Array.from(categories).sort();
};

export const getProductsByCategory = (
  products: Product[],
  category: string
): Product[] => {
  return products.filter(product => product.category === category);
};

export const getCategoryStats = (products: Product[]) => {
  const stats = products.reduce(
    (acc, product) => {
      const category = product.category;
      if (!acc[category]) {
        acc[category] = {
          count: 0,
          totalPrice: 0,
          avgRating: 0,
          totalRating: 0,
        };
      }

      acc[category].count++;
      acc[category].totalPrice += product.price;
      acc[category].totalRating += product.rating.rate;
      acc[category].avgRating = acc[category].totalRating / acc[category].count;

      return acc;
    },
    {} as Record<
      string,
      {
        count: number;
        totalPrice: number;
        avgRating: number;
        totalRating: number;
      }
    >
  );

  return Object.entries(stats).map(([category, data]) => ({
    category,
    ...data,
    avgPrice: data.totalPrice / data.count,
  }));
};

// Product validation utilities
export const validateProduct = (product: Product): boolean => {
  return (
    Boolean(product.id) &&
    Boolean(product.title) &&
    product.price >= 0 &&
    Boolean(product.description) &&
    Boolean(product.category) &&
    Boolean(product.image) &&
    Boolean(product.rating) &&
    product.rating.rate >= 0 &&
    product.rating.rate <= 5 &&
    product.rating.count >= 0
  );
};

// Product formatting utilities
export const formatProductPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
};

export const formatProductRating = (rating: number): string => {
  return rating.toFixed(1);
};

export const getProductRatingColor = (rating: number): string => {
  if (rating >= 4.5) return '#52c41a'; // Green
  if (rating >= 4.0) return '#1890ff'; // Blue
  if (rating >= 3.5) return '#faad14'; // Yellow
  if (rating >= 3.0) return '#fa8c16'; // Orange
  return '#f5222d'; // Red
};

// Product pagination utilities
export const paginateProducts = (
  products: Product[],
  page: number,
  limit: number
) => {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  return {
    data: products.slice(startIndex, endIndex),
    total: products.length,
    page,
    limit,
    totalPages: Math.ceil(products.length / limit),
    hasNextPage: endIndex < products.length,
    hasPrevPage: page > 1,
  };
};

// Variant utilities
export const getVariantOptions = (variants: Variant[]) => {
  const options: Record<string, string[]> = {};

  variants.forEach(variant => {
    if (!options[variant.name]) {
      options[variant.name] = [];
    }
    if (!options[variant.name].includes(variant.value)) {
      options[variant.name].push(variant.value);
    }
  });

  return options;
};

export const getVariantByOptions = (
  variants: Variant[],
  selectedOptions: Record<string, string>
): Variant | null => {
  return (
    variants.find(variant =>
      Object.entries(selectedOptions).every(
        ([name, value]) => variant.name === name && variant.value === value
      )
    ) || null
  );
};

export const getVariantPrice = (
  variant: Variant,
  basePrice: number
): number => {
  return variant.price || basePrice;
};

export const getVariantStock = (variant: Variant): number => {
  return variant.stock || 0;
};

// Order utilities
export const calculateOrderTotal = (items: CartItem[]): number => {
  return items.reduce((total, item) => {
    const itemPrice = item.variant?.price || item.product.price;
    return total + itemPrice * item.quantity;
  }, 0);
};

export const formatOrderStatus = (status: string): string => {
  return status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ');
};

export const getOrderStatusColor = (status: string): string => {
  switch (status) {
    case 'pending':
      return '#faad14';
    case 'processing':
      return '#1890ff';
    case 'shipped':
      return '#52c41a';
    case 'delivered':
      return '#52c41a';
    case 'cancelled':
      return '#f5222d';
    default:
      return '#8c8c8c';
  }
};

// Address utilities
export const formatAddress = (address: Address): string => {
  return `${address.street}, ${address.city}, ${address.state} ${address.zipCode}, ${address.country}`;
};

export const validateAddress = (address: Omit<Address, 'id'>): boolean => {
  return !!(
    address.street &&
    address.city &&
    address.state &&
    address.zipCode &&
    address.country
  );
};

// Review utilities
export const calculateAverageRating = (reviews: Review[]): number => {
  if (reviews.length === 0) return 0;
  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  return Math.round((totalRating / reviews.length) * 10) / 10;
};

export const formatRating = (rating: number): string => {
  return rating.toFixed(1);
};

export const getRatingColor = (rating: number): string => {
  if (rating >= 4.5) return '#52c41a'; // Green for high ratings
  if (rating >= 3.5) return '#faad14'; // Yellow for medium ratings
  return '#f5222d'; // Red for low ratings
};

export const validateReview = (review: {
  rating: number;
  comment: string;
}): boolean => {
  return (
    review.rating >= 1 && review.rating <= 5 && review.comment.trim().length > 0
  );
};
