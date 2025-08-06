'use client';

import React from 'react';
import { Layout, Typography, Card, Space, Row, Col } from 'antd';
import { ProductsList } from '../components/features/products/ProductsList';
import { Basket } from '../components/features/cart/Basket';
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
          <Row gutter={[24, 24]}>
            {/* Products Section */}
            <Col xs={24} lg={16}>
              <Card>
                <Title level={3} style={{ marginBottom: '8px' }}>
                  Ürünlerimiz
                </Title>
                <Text type='secondary'>En kaliteli ürünleri keşfedin</Text>
                {error && (
                  <div style={{ marginTop: '16px' }}>
                    <Text type='danger'>
                      Ürünler yüklenirken hata oluştu: {error.toString()}
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
            </Col>

            {/* Cart Section */}
            <Col xs={24} lg={8}>
              <Card>
                <Title level={3} style={{ marginBottom: '8px' }}>
                  Sepetim
                </Title>
                <Text type='secondary'>Alışveriş sepetiniz</Text>
                {cartError && (
                  <div style={{ marginTop: '16px' }}>
                    <Text type='danger'>
                      Sepet yüklenirken hata oluştu:{' '}
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
            </Col>
          </Row>
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
