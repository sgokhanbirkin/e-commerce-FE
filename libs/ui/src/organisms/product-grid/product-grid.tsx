import React from 'react';
import { Row, Col, Empty, Spin, Pagination } from 'antd';
import { ProductCard } from '../../molecules/product-card';
import type { Product } from '@data-access/types';

export interface ProductGridProps {
    products: Product[];
    loading?: boolean;
    onAddToCart?: (product: Product) => void;
    onViewDetails?: (product: Product) => void;
    onToggleWishlist?: (product: Product) => void;
    columns?: 1 | 2 | 3 | 4 | 6;
    gutter?: number;
    className?: string;
    style?: React.CSSProperties;
    // Pagination props
    currentPage?: number;
    totalPages?: number;
    onPageChange?: (page: number) => void;
    showPagination?: boolean;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
    products,
    loading = false,
    onAddToCart,
    onViewDetails,
    onToggleWishlist,
    columns = 4,
    gutter = 16,
    className = '',
    style,
    currentPage = 1,
    totalPages = 1,
    onPageChange,
    showPagination = false,
}) => {
    const colSpan = 24 / columns;

    if (loading) {
        return (
            <div className={`kayra-product-grid kayra-product-grid--loading ${className}`.trim()} style={style}>
                <div style={{ textAlign: 'center', padding: '50px' }}>
                    <Spin size="large" />
                    <div style={{ marginTop: '16px' }}>Loading products...</div>
                </div>
            </div>
        );
    }

    if (!products || products.length === 0) {
        return (
            <div className={`kayra-product-grid kayra-product-grid--empty ${className}`.trim()} style={style}>
                <Empty
                    description="No products found"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
            </div>
        );
    }

    return (
        <div className={`kayra-product-grid ${className}`.trim()} style={style}>
            <Row gutter={gutter}>
                {products.map((product) => (
                    <Col
                        key={product.id}
                        xs={24}
                        sm={columns >= 2 ? 12 : 24}
                        md={columns >= 3 ? 8 : columns >= 2 ? 12 : 24}
                        lg={colSpan}
                        xl={colSpan}
                        xxl={colSpan}
                    >
                        <ProductCard
                            product={product}
                            onAddToCart={onAddToCart}
                            onViewDetails={onViewDetails}
                            onToggleWishlist={onToggleWishlist}
                            loading={loading}
                        />
                    </Col>
                ))}
            </Row>

            {showPagination && totalPages > 1 && (
                <div className="kayra-product-grid__pagination" style={{ marginTop: '24px', textAlign: 'center' }}>
                    <Pagination
                        current={currentPage}
                        total={totalPages}
                        onChange={onPageChange}
                        showSizeChanger={false}
                        showQuickJumper
                        showTotal={(total, range) =>
                            `${range[0]}-${range[1]} of ${total} items`
                        }
                    />
                </div>
            )}
        </div>
    );
};

// Export product grid variants
export const CompactProductGrid: React.FC<ProductGridProps> = (props) => (
    <ProductGrid
        {...props}
        columns={6}
        gutter={8}
        className={`${props.className || ''} kayra-product-grid--compact`.trim()}
    />
);

export const WideProductGrid: React.FC<ProductGridProps> = (props) => (
    <ProductGrid
        {...props}
        columns={3}
        gutter={24}
        className={`${props.className || ''} kayra-product-grid--wide`.trim()}
    />
);

export const ResponsiveProductGrid: React.FC<ProductGridProps> = (props) => (
    <ProductGrid
        {...props}
        columns={4}
        gutter={16}
        className={`${props.className || ''} kayra-product-grid--responsive`.trim()}
    />
); 