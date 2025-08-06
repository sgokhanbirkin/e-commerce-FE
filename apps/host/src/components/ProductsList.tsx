'use client';

import React from 'react';
import { Card, Button, Row, Col, Typography, Spin, Alert, message } from 'antd';
import { ShoppingCartOutlined, StarOutlined } from '@ant-design/icons';
import { useAddToCartMutation, useGetVariantsQuery } from '@data-access/api';
import { useCartDrawer } from './CartDrawerContext';
import type { Product } from '@data-access/types';
import Link from 'next/link';

const { Title, Text } = Typography;

const getCategoryName = (product: Product) => {
  // Backend'den gelen örnek: "category": { "id": 11, "name": "Electronics", "parentId": null }
  if (product.category && typeof product.category === 'object') {
    const categoryObj = product.category as any;
    if (categoryObj.name) {
      return categoryObj.name;
    }
  }
  // String olarak gelirse
  if (typeof product.category === 'string') {
    return product.category;
  }
  return 'Uncategorized';
};

interface ProductsListProps {
  products?: Product[];
  isLoading?: boolean;
  error?: any;
}

export const ProductsList: React.FC<ProductsListProps> = ({
  products = [],
  isLoading = false,
  error = null,
}) => {
  const [addToCart, { isLoading: addToCartLoading }] = useAddToCartMutation();
  const { openCart } = useCartDrawer();

  if (isLoading) {
    return null;
  }

  if (error) {
    return (
      <Alert
        message='Error Loading Products'
        description={typeof error === 'string' ? error : JSON.stringify(error)}
        type='error'
        showIcon
        style={{ marginBottom: '16px' }}
      />
    );
  }

  if (!products || products.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <Text type='secondary'>No products available</Text>
      </div>
    );
  }

  return (
    <div>
      <Title level={4} style={{ marginBottom: '24px' }}>
        Products ({products.length})
      </Title>

      <Row gutter={[16, 16]}>
        {products.map(product => (
          <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
            <Link
              href={`/products/${product.id}`}
              style={{ textDecoration: 'none' }}
            >
              <Card
                hoverable
                className='product-card'
                style={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
                styles={{
                  body: { flex: 1, display: 'flex', flexDirection: 'column' },
                }}
                cover={
                  <div
                    style={{
                      height: '200px',
                      background: '#f5f5f5',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden',
                    }}
                  >
                    <img
                      alt={product.title}
                      src={product.imageUrl}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                      onError={e => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.parentElement!.innerHTML =
                          '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #999;">No Image</div>';
                      }}
                    />
                  </div>
                }
              >
                <Card.Meta
                  title={
                    <div
                      style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        lineHeight: '1.2em',
                        height: '2.4em',
                        fontSize: '16px',
                      }}
                    >
                      {product.title}
                    </div>
                  }
                  description={
                    <div
                      style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      <div
                        style={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          lineHeight: '1.4em',
                          height: '4.2em',
                          marginBottom: '12px',
                          color: '#666',
                          fontSize: '14px',
                        }}
                      >
                        {product.description}
                      </div>
                      <div style={{ marginTop: 'auto' }}>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: '8px',
                          }}
                        >
                          <Text
                            strong
                            style={{ fontSize: '16px', color: '#1890ff' }}
                          >
                            ${(product.price || 0).toFixed(2)}
                          </Text>
                          <div
                            style={{ display: 'flex', alignItems: 'center' }}
                          >
                            <Text type='secondary' style={{ fontSize: '12px' }}>
                              {product.averageRating?.toFixed(1) ||
                                product.rating?.rate ||
                                0}{' '}
                              (
                              {product.reviewCount ||
                                product.rating?.count ||
                                0}
                              )
                            </Text>
                          </div>
                        </div>
                        <div
                          style={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            fontSize: '12px',
                            color: '#999',
                          }}
                        >
                          {getCategoryName(product)}
                        </div>
                      </div>
                    </div>
                  }
                />
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
    </div>
  );
};
