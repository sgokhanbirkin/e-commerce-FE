import React from 'react';
import { Rate, Tag, Space } from 'antd';
import { ShoppingCartOutlined, HeartOutlined, EyeOutlined } from '@ant-design/icons';
import { Card } from '../../atoms/card';
import { Button } from '../../atoms/button';
import { Typography } from '../../atoms/typography';
import type { Product } from '@data-access/types';

const { Title, Text, Paragraph } = Typography;

export interface ProductCardProps {
    product: Product;
    onAddToCart?: (product: Product) => void;
    onViewDetails?: (product: Product) => void;
    onToggleWishlist?: (product: Product) => void;
    loading?: boolean;
    className?: string;
    style?: React.CSSProperties;
}

export const ProductCard: React.FC<ProductCardProps> = ({
    product,
    onAddToCart,
    onViewDetails,
    onToggleWishlist,
    loading = false,
    className = '',
    style,
}) => {
    const handleAddToCart = () => {
        onAddToCart?.(product);
    };

    const handleViewDetails = () => {
        onViewDetails?.(product);
    };

    const handleToggleWishlist = () => {
        onToggleWishlist?.(product);
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(price);
    };

    const getRatingColor = (rating: number) => {
        if (rating >= 4.5) return '#52c41a';
        if (rating >= 4.0) return '#1890ff';
        if (rating >= 3.5) return '#faad14';
        if (rating >= 3.0) return '#fa8c16';
        return '#f5222d';
    };

    return (
        <Card
            hoverable
            className={`kayra-product-card ${className}`.trim()}
            style={style}
            cover={
                <div className="kayra-product-card__image-container">
                    <img
                        alt={product.title}
                        src={product.image}
                        className="kayra-product-card__image"
                        style={{
                            width: '100%',
                            height: '200px',
                            objectFit: 'contain',
                            padding: '16px',
                        }}
                    />
                    <div className="kayra-product-card__actions">
                        <Button
                            type="text"
                            icon={<HeartOutlined />}
                            onClick={handleToggleWishlist}
                            className="kayra-product-card__action-btn"
                        />
                        <Button
                            type="text"
                            icon={<EyeOutlined />}
                            onClick={handleViewDetails}
                            className="kayra-product-card__action-btn"
                        />
                    </div>
                </div>
            }
            actions={[
                <Button
                    key="add-to-cart"
                    type="primary"
                    icon={<ShoppingCartOutlined />}
                    onClick={handleAddToCart}
                    loading={loading}
                    block
                >
                    Add to Cart
                </Button>,
            ]}
        >
            <div className="kayra-product-card__content">
                <Tag color="blue" className="kayra-product-card__category">
                    {product.category}
                </Tag>

                <Title level={5} className="kayra-product-card__title">
                    {product.title}
                </Title>

                <Paragraph
                    ellipsis={{ rows: 2, expandable: false }}
                    className="kayra-product-card__description"
                >
                    {product.description}
                </Paragraph>

                <div className="kayra-product-card__rating">
                    <Rate
                        disabled
                        defaultValue={product.rating.rate}
                        style={{ fontSize: '14px' }}
                    />
                    <Text type="secondary" className="kayra-product-card__rating-count">
                        ({product.rating.count})
                    </Text>
                </div>

                <div className="kayra-product-card__price">
                    <Text strong className="kayra-product-card__price-amount">
                        {formatPrice(product.price)}
                    </Text>
                </div>
            </div>
        </Card>
    );
};

// Export product card variants
export const CompactProductCard: React.FC<ProductCardProps> = (props) => (
    <ProductCard
        {...props}
        className={`${props.className || ''} kayra-product-card--compact`.trim()}
    />
);

export const FeaturedProductCard: React.FC<ProductCardProps> = (props) => (
    <ProductCard
        {...props}
        className={`${props.className || ''} kayra-product-card--featured`.trim()}
    />
); 