'use client';

import React from 'react';
import { Layout, Typography, Card, Space } from 'antd';
import { ProductsList } from '../components/ProductsList';
import { Basket } from '../components/Basket';
import { useGetProductsQuery } from '@data-access/api';
import { useGetCartItemsQuery } from '@data-access/api';

const { Content, Footer } = Layout;
const { Title, Text } = Typography;

export default function Home() {
  // Fetch products and cart data
  const { data: products, isLoading, error } = useGetProductsQuery();
  const {
    data: cartItems,
    isLoading: cartLoading,
    error: cartError,
  } = useGetCartItemsQuery();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Content style={{ padding: '24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Space direction='vertical' size='large' style={{ width: '100%' }}>
            <Card>
              <Title level={4}>All Products</Title>
              <Text type='secondary'>Browse all available products.</Text>
              {error && (
                <div style={{ marginTop: '16px' }}>
                  <Text type='danger'>
                    Error loading products: {error.toString()}
                  </Text>
                </div>
              )}
              <div style={{ marginTop: '16px' }}>
                <ProductsList
                  products={products || []}
                  isLoading={isLoading}
                  error={error}
                />
              </div>
            </Card>

            <Card>
              <Title level={4}>Basket Component</Title>
              <Text type='secondary'>
                Shopping cart with remove and update functionality.
              </Text>
              {cartError && (
                <div style={{ marginTop: '16px' }}>
                  <Text type='danger'>
                    Error loading cart:{' '}
                    {typeof cartError === 'string'
                      ? cartError
                      : JSON.stringify(cartError)}
                  </Text>
                </div>
              )}
              <div style={{ marginTop: '16px' }}>
                <Basket
                  cartItems={cartItems || []}
                  isLoading={cartLoading}
                  error={cartError}
                />
              </div>
            </Card>
          </Space>
        </div>
      </Content>

      <Footer style={{ textAlign: 'center', background: '#f5f5f5' }}>
        <Text type='secondary'>
          Kayra Export E-commerce ©{new Date().getFullYear()} - Micro-frontend
          Architecture
        </Text>
      </Footer>
    </Layout>
  );
}
