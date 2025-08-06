'use client';

import React from 'react';
import { Dropdown, Avatar, Button, Space, Typography } from 'antd';
import {
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  ShoppingOutlined,
  EnvironmentOutlined,
} from '@ant-design/icons';
import { useAuth } from '../../hooks/useAuth';
import { useRouter } from 'next/navigation';

const { Text } = Typography;

const UserMenu: React.FC = () => {
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  const router = useRouter();

  // Debug logging
  // console.log('UserMenu Debug:', {
  //     user,
  //     isAuthenticated,
  //     isLoading,
  // });

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const menuItems = [
    {
      key: 'profile',
      label: 'Profilim',
      icon: <UserOutlined />,
      onClick: () => router.push('/profile'),
    },
    {
      key: 'orders',
      label: 'Siparişlerim',
      icon: <ShoppingOutlined />,
      onClick: () => router.push('/orders'),
    },
    {
      key: 'addresses',
      label: 'Adreslerim',
      icon: <EnvironmentOutlined />,
      onClick: () => router.push('/profile/addresses'),
    },
    {
      key: 'settings',
      label: 'Ayarlar',
      icon: <SettingOutlined />,
      onClick: () => router.push('/profile/settings'),
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      label: 'Çıkış Yap',
      icon: <LogoutOutlined />,
      onClick: handleLogout,
      danger: true,
    },
  ];

  // Sadece çok kısa süreli loading göster
  if (isLoading && !isAuthenticated) {
    return <></>;
  }

  if (!isAuthenticated) {
    return (
      <Space>
        <Button
          style={{
            backgroundColor: 'white',
            color: 'black',
            border: '1px solid #d9d9d9',
          }}
          onClick={() => router.push('/login')}
        >
          Giriş Yap
        </Button>
        <Button type='primary' onClick={() => router.push('/register')}>
          Kayıt Ol
        </Button>
      </Space>
    );
  }

  return (
    <Dropdown
      menu={{ items: menuItems }}
      placement='bottomRight'
      trigger={['click']}
    >
      <Button type='text' style={{ height: 'auto', padding: '4px 8px' }}>
        <Space>
          <Avatar
            size='small'
            icon={<UserOutlined />}
            style={{ backgroundColor: '#1890ff' }}
          />
          <div
            style={{ textAlign: 'left', display: 'none' }}
            className='hidden md:block'
          >
            <Text strong style={{ fontSize: '12px', lineHeight: 1 }}>
              {user?.name || 'Kullanıcı'}
            </Text>
            <br />
            <Text type='secondary' style={{ fontSize: '10px', lineHeight: 1 }}>
              {user?.email}
            </Text>
          </div>
        </Space>
      </Button>
    </Dropdown>
  );
};

export default UserMenu;
