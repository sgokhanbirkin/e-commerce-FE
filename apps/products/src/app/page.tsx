'use client';

import { Layout, Typography } from 'antd';
import { ProductsList } from '../../components/ProductsList';
import { useGetProductsQuery } from '@data-access/api';

const { Content } = Layout;
const { Title } = Typography;

export default function Home() {
  const { data: products, isLoading, error } = useGetProductsQuery();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Content style={{ padding: '24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Title
            level={2}
            style={{ marginBottom: '24px', textAlign: 'center' }}
          >
            Products Micro-Frontend
          </Title>
          <ProductsList
            products={products || []}
            isLoading={isLoading}
            error={error}
          />
        </div>
      </Content>
    </Layout>
  );
}
