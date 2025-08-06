import { Layout, Typography, Card, Space } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';

const { Content } = Layout;
const { Title, Text } = Typography;

function App() {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Content style={{ padding: '24px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <Title
            level={2}
            style={{ marginBottom: '24px', textAlign: 'center' }}
          >
            Basket Micro-Frontend
          </Title>

          <Card>
            <Space direction='vertical' style={{ width: '100%' }}>
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <ShoppingCartOutlined
                  style={{
                    fontSize: '48px',
                    color: '#d9d9d9',
                    marginBottom: '16px',
                  }}
                />
                <Title level={4} type='secondary'>
                  Basket Component Ready
                </Title>
                <Text type='secondary'>
                  This basket component is now working and can be loaded by the
                  host app.
                </Text>
              </div>

              <div style={{ textAlign: 'center' }}>
                <Text type='secondary'>Port: 3003 | Status: Running</Text>
              </div>
            </Space>
          </Card>
        </div>
      </Content>
    </Layout>
  );
}

export default App;
