'use client';

import React from 'react';
import { List, Card, Typography, Spin, Alert, Space, Tag } from 'antd';
import { ShoppingCartOutlined, StarFilled } from '@ant-design/icons';
import { useGetProductsQuery } from '@data-access/api';
import type { Product } from '@data-access/types';

const { Title, Text } = Typography;
const { Meta } = Card;

export function ProductsList() {
  const { data: products, isLoading, error } = useGetProductsQuery();

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size='large' />
        <div style={{ marginTop: '16px' }}>
          <Text type='secondary'>Loading products...</Text>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message='Error'
        description='Failed to load products. Please try again later.'
        type='error'
        showIcon
      />
    );
  }

  return (
    <div>
      <Title level={3}>Products</Title>
      <List
        grid={{
          gutter: 16,
          xs: 1,
          sm: 2,
          md: 3,
          lg: 4,
          xl: 4,
          xxl: 6,
        }}
        dataSource={products}
        renderItem={(product: Product) => (
          <List.Item>
            <Card
              hoverable
              cover={
                <div
                  style={{
                    height: '200px',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <img
                    alt={product.title}
                    src={product.imageUrl}
                    style={{
                      maxWidth: '100%',
                      maxHeight: '100%',
                      objectFit: 'contain',
                      padding: '16px',
                    }}
                  />
                </div>
              }
              actions={[
                <ShoppingCartOutlined
                  key='add-to-cart'
                  style={{ color: '#1890ff' }}
                />,
              ]}
            >
              <Meta
                title={
                  <div style={{ height: '40px', overflow: 'hidden' }}>
                    <Text ellipsis={{ tooltip: product.title }}>
                      {product.title}
                    </Text>
                  </div>
                }
                description={
                  <Space
                    direction='vertical'
                    size='small'
                    style={{ width: '100%' }}
                  >
                    <div style={{ height: '60px', overflow: 'hidden' }}>
                      <Text
                        type='secondary'
                        ellipsis={{ tooltip: product.description }}
                      >
                        {product.description}
                      </Text>
                    </div>
                    <Space>
                      <Tag color='blue'>
                        {typeof product.category === 'string'
                          ? product.category
                          : product.category?.name || 'Uncategorized'}
                      </Tag>
                      <Space>
                        <StarFilled style={{ color: '#faad14' }} />
                        <Text strong>{product.rating?.rate || 0}</Text>
                        <Text type='secondary'>
                          ({product.rating?.count || 0})
                        </Text>
                      </Space>
                    </Space>
                    <Title level={4} style={{ margin: 0, color: '#1890ff' }}>
                      ${product.price}
                    </Title>
                  </Space>
                }
              />
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
}
