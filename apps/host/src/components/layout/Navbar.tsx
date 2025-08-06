'use client';

import React from 'react';
import Link from 'next/link';
import { Menu, Layout, Spin, Badge, Space, Button, Drawer } from 'antd';
import { ShoppingCartOutlined, MenuOutlined } from '@ant-design/icons';
import { useSearchParams } from 'next/navigation';
import {
  useGetCategoriesFromApiQuery,
  useGetCartItemsQuery,
} from '@data-access/api';
import { useCartDrawer } from '../features/cart/CartDrawerContext';
import UserMenu from './UserMenu';

const { Header } = Layout;

export const Navbar: React.FC = () => {
  const { data: categories, isLoading } = useGetCategoriesFromApiQuery();
  const { data: cartItems } = useGetCartItemsQuery();
  const searchParams = useSearchParams();
  const { openCart } = useCartDrawer();
  const [mounted, setMounted] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  // SSR hydration için mounted state
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Aktif kategori seçimi için URL'den categoryId'yi alıyoruz
  const activeKey = mounted ? searchParams.get('categoryId') : null;

  // Toplam sepet adedi hesaplama
  const cartCount = mounted
    ? cartItems?.reduce((total, item) => total + (item.quantity || 1), 0) || 0
    : 0;

  return (
    <Header
      style={{ display: 'flex', alignItems: 'center', padding: '0 16px' }}
    >
      {/* Logo */}
      <div className='logo' style={{ flexShrink: 0 }}>
        <Link
          href='/'
          style={{
            color: 'white',
            fontWeight: 'bold',
          }}
        >
          Kayra Export
        </Link>
      </div>

      {/* Desktop Menu */}
      <div
        style={{
          marginLeft: 32,
          flex: 1,
        }}
        className='desktop-menu'
      >
        {isLoading ? (
          <Spin style={{ color: 'white' }} />
        ) : (
          <Menu
            theme='dark'
            mode='horizontal'
            selectedKeys={activeKey ? [activeKey] : []}
            style={{ borderBottom: 'none' }}
            items={
              categories && categories.length > 0
                ? categories.map(cat => ({
                    key: cat.id,
                    label: (
                      <Link href={`/categories/${cat.id}`}>{cat.name}</Link>
                    ),
                  }))
                : [
                    {
                      key: 'no-categories',
                      label: (
                        <span style={{ color: '#999' }}>
                          No categories available
                        </span>
                      ),
                    },
                  ]
            }
          />
        )}
      </div>

      {/* Mobile Menu Button */}
      <Button
        type='text'
        icon={<MenuOutlined />}
        onClick={() => setMobileMenuOpen(true)}
        style={{
          color: 'white',
        }}
        className='mobile-menu-button'
      />

      {/* Right Side Actions */}
      <Space style={{ marginLeft: 'auto' }} size='small'>
        <Badge count={cartCount} size='small'>
          <button
            onClick={openCart}
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              fontSize: '20px',
              cursor: 'pointer',
              padding: '4px 8px',
            }}
          >
            <ShoppingCartOutlined style={{ fontSize: '20px' }} />
          </button>
        </Badge>
        <UserMenu />
      </Space>

      {/* Mobile Menu Drawer */}
      <Drawer
        title='Menu'
        placement='right'
        onClose={() => setMobileMenuOpen(false)}
        open={mobileMenuOpen}
        width={280}
      >
        {isLoading ? (
          <Spin />
        ) : (
          <Menu
            mode='vertical'
            selectedKeys={activeKey ? [activeKey] : []}
            items={
              categories && categories.length > 0
                ? categories.map(cat => ({
                    key: cat.id,
                    label: (
                      <Link
                        href={`/categories/${cat.id}`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {cat.name}
                      </Link>
                    ),
                  }))
                : [
                    {
                      key: 'no-categories',
                      label: (
                        <span style={{ color: '#999' }}>
                          No categories available
                        </span>
                      ),
                    },
                  ]
            }
          />
        )}
      </Drawer>
    </Header>
  );
};
