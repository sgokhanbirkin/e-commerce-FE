'use client';

import React from 'react';
import { Card, Button, Row, Col, Typography, Spin, Alert, message } from 'antd';
import { ShoppingCartOutlined, StarOutlined } from '@ant-design/icons';
import { useAddToCartMutation } from '@data-access/api';
import type { Product } from '@data-access/types';

const { Title, Text } = Typography;

interface ProductsListProps {
    products?: Product[];
    isLoading?: boolean;
    error?: any;
}

export const ProductsList: React.FC<ProductsListProps> = ({
    products = [],
    isLoading = false,
    error = null
}) => {
    const [addToCart, { isLoading: addToCartLoading }] = useAddToCartMutation();

    const handleAddToCart = async (product: Product) => {
        try {
            await addToCart({
                productId: product.id,
                quantity: 1
            }).unwrap();

            message.success(`${product.title} added to cart!`);
        } catch (error) {
            message.error('Failed to add product to cart');
            console.error('Add to cart error:', error);
        }
    };

    if (isLoading) {
        return (
            <div style={{ textAlign: 'center', padding: '40px' }}>
                <Spin size="large" />
                <div style={{ marginTop: '16px' }}>
                    <Text type="secondary">Loading products...</Text>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <Alert
                message="Error Loading Products"
                description={error.toString()}
                type="error"
                showIcon
                style={{ marginBottom: '16px' }}
            />
        );
    }

    if (!products || products.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '40px' }}>
                <Text type="secondary">No products available</Text>
            </div>
        );
    }

    return (
        <div>
            <Title level={4} style={{ marginBottom: '24px' }}>
                Products ({products.length})
            </Title>

            <Row gutter={[16, 16]}>
                {products.map((product) => (
                    <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
                        <Card
                            hoverable
                            cover={
                                <div style={{
                                    height: '200px',
                                    background: '#f5f5f5',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    overflow: 'hidden'
                                }}>
                                    <img
                                        alt={product.title}
                                        src={product.imageUrl || product.image}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover'
                                        }}
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.style.display = 'none';
                                            target.parentElement!.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #999;">No Image</div>';
                                        }}
                                    />
                                </div>
                            }
                            actions={[
                                <Button
                                    key="add-to-cart"
                                    type="primary"
                                    icon={<ShoppingCartOutlined />}
                                    loading={addToCartLoading}
                                    onClick={() => handleAddToCart(product)}
                                    style={{ width: '100%' }}
                                >
                                    Add to Cart
                                </Button>
                            ]}
                        >
                            <Card.Meta
                                title={
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'flex-start'
                                    }}>
                                        <Text strong style={{ fontSize: '14px', lineHeight: '1.4' }}>
                                            {product.title}
                                        </Text>
                                        <Text type="secondary" style={{ fontSize: '12px' }}>
                                            ${product.price}
                                        </Text>
                                    </div>
                                }
                                description={
                                    <div>
                                        <div style={{ marginBottom: '8px' }}>
                                            <Text type="secondary" style={{ fontSize: '12px' }}>
                                                {product.description.length > 100
                                                    ? `${product.description.substring(0, 100)}...`
                                                    : product.description
                                                }
                                            </Text>
                                        </div>
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center'
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <StarOutlined style={{ color: '#faad14', marginRight: '4px' }} />
                                                <Text type="secondary" style={{ fontSize: '12px' }}>
                                                    {product.rating.rate} ({product.rating.count})
                                                </Text>
                                            </div>
                                            <Text type="secondary" style={{ fontSize: '12px' }}>
                                                {product.category}
                                            </Text>
                                        </div>
                                    </div>
                                }
                            />
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
}; 