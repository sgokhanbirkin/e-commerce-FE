'use client';

import React from 'react';
import {
  Card,
  Row,
  Col,
  Avatar,
  Button,
  Divider,
  Typography,
  Space,
  Tag,
} from 'antd';
import {
  UserOutlined,
  EnvironmentOutlined,
  ShoppingOutlined,
  EditOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { useAuth } from '../../hooks/useAuth';
import { useRouter } from 'next/navigation';

const { Title, Text } = Typography;

const ProfilePage: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // Loading durumunda hiçbir şey gösterme
  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    router.push('/login');
    return null;
  }

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <Title level={2} style={{ marginBottom: '32px' }}>
        Profil Bilgileri
      </Title>

      <Row gutter={[24, 24]}>
        {/* Ana Profil Kartı */}
        <Col xs={24} lg={16}>
          <Card>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '24px',
              }}
            >
              <Avatar
                size={80}
                icon={<UserOutlined />}
                style={{ marginRight: '16px' }}
              />
              <div>
                <Title level={3} style={{ margin: 0 }}>
                  {user?.name || 'Kullanıcı'}
                </Title>
                <Text type='secondary'>{user?.email}</Text>
              </div>
              <Button
                type='primary'
                icon={<EditOutlined />}
                style={{ marginLeft: 'auto' }}
                onClick={() => router.push('/profile/edit')}
              >
                Düzenle
              </Button>
            </div>

            <Divider />

            {/* Hızlı İstatistikler */}
            <Row gutter={[16, 16]}>
              <Col xs={12} sm={8}>
                <div style={{ textAlign: 'center' }}>
                  <Title level={4} style={{ margin: 0, color: '#1890ff' }}>
                    0
                  </Title>
                  <Text type='secondary'>Toplam Sipariş</Text>
                </div>
              </Col>
              <Col xs={12} sm={8}>
                <div style={{ textAlign: 'center' }}>
                  <Title level={4} style={{ margin: 0, color: '#52c41a' }}>
                    0
                  </Title>
                  <Text type='secondary'>Aktif Adres</Text>
                </div>
              </Col>
              <Col xs={12} sm={8}>
                <div style={{ textAlign: 'center' }}>
                  <Title level={4} style={{ margin: 0, color: '#faad14' }}>
                    0
                  </Title>
                  <Text type='secondary'>Favori Ürün</Text>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Hızlı Erişim Kartı */}
        <Col xs={24} lg={8}>
          <Card title='Hızlı Erişim'>
            <Space direction='vertical' style={{ width: '100%' }}>
              <Button
                type='default'
                icon={<EnvironmentOutlined />}
                block
                onClick={() => router.push('/profile/addresses')}
              >
                Adreslerim
              </Button>
              <Button
                type='default'
                icon={<ShoppingOutlined />}
                block
                onClick={() => router.push('/orders')}
              >
                Sipariş Geçmişi
              </Button>
              <Button
                type='default'
                icon={<SettingOutlined />}
                block
                onClick={() => router.push('/profile/settings')}
              >
                Hesap Ayarları
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Son Siparişler */}
      <Row style={{ marginTop: '24px' }}>
        <Col span={24}>
          <Card title='Son Siparişler'>
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <Text type='secondary'>Henüz sipariş bulunmuyor</Text>
              <br />
              <Button
                type='primary'
                onClick={() => router.push('/')}
                style={{ marginTop: '16px' }}
              >
                Alışverişe Başla
              </Button>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ProfilePage;
