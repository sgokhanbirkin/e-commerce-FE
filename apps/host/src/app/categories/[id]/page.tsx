'use client';

import React from 'react';
import { Layout, Typography, Card, Space, Spin, Row, Col } from 'antd';
import { useParams } from 'next/navigation';
import { useGetProductsByCategoryQuery, useGetCategoriesFromApiQuery } from '@data-access/api';
import { ProductCard } from '../../../components/ProductCard';

const { Content, Footer } = Layout;
const { Title, Text } = Typography;

const CategoryPage: React.FC = () => {
  const params = useParams();
  const categoryId = Number(params.id);

  const { data: products, isLoading, error } = useGetProductsByCategoryQuery(categoryId.toString(), {
    skip: isNaN(categoryId),
  });

  const { data: categories } = useGetCategoriesFromApiQuery();
  const currentCategory = categories?.find(cat => cat.id === categoryId);

  if (isLoading || !products) {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Content style={{ padding: '24px' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
            <Spin size="large" />
            <div style={{ marginTop: '16px' }}>
              <Text type="secondary">Loading category products...</Text>
            </div>
          </div>
        </Content>
      </Layout>
    );
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Content style={{ padding: '24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Card>
              <Title level={4}>
                {currentCategory ? `${currentCategory.name} Products` : `Category ${categoryId} Products`}
              </Title>
              <Text type="secondary">
                {currentCategory
                  ? `Products in ${currentCategory.name} category`
                  : `Products in category ID: ${categoryId}`
                }
              </Text>
              {error && (
                <div style={{ marginTop: '16px' }}>
                  <Text type="danger">
                    Error loading products: {error.toString()}
                  </Text>
                </div>
              )}
              <div style={{ marginTop: '16px' }}>
                <Row gutter={[16, 16]}>
                  {products.map((product) => (
                    <Col key={product.id} xs={24} sm={12} md={8} lg={6}>
                      <ProductCard product={product} />
                    </Col>
                  ))}
                </Row>
              </div>
            </Card>
          </Space>
        </div>
      </Content>

      <Footer style={{ textAlign: 'center', background: '#f5f5f5' }}>
        <Text type="secondary">
          Kayra Export E-commerce ©{new Date().getFullYear()} - Micro-frontend Architecture
        </Text>
      </Footer>
    </Layout>
  );
};

export default CategoryPage; 