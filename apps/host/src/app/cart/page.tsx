'use client';

import React from 'react';
import { Layout, Typography, Card, Space } from 'antd';
import { Basket } from '../../components/features/cart/Basket';

const { Content, Footer } = Layout;
const { Title, Text } = Typography;

export default function CartPage() {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Content style={{ padding: '24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Space direction='vertical' size='large' style={{ width: '100%' }}>
            <Card>
              <Title level={4}>Shopping Cart</Title>
              <Text type='secondary'>
                Your shopping cart with all selected items.
              </Text>
              <div style={{ marginTop: '16px' }}>
                <Basket />
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
