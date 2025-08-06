'use client';

import React from 'react';
import Link from 'next/link';
import { Menu, Layout, Spin, Badge, Space } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { useSearchParams } from 'next/navigation';
import {
  useGetCategoriesFromApiQuery,
  useGetCartItemsQuery,
} from '@data-access/api';
import { useCartDrawer } from './CartDrawerContext';
import UserMenu from './UserMenu';

const { Header } = Layout;

export const Navbar: React.FC = () => {
  const { data: categories, isLoading } = useGetCategoriesFromApiQuery();
  const { data: cartItems } = useGetCartItemsQuery();
  const searchParams = useSearchParams();
  const { openCart } = useCartDrawer();

  // Aktif kategori seçimi için URL'den categoryId'yi alıyoruz
  const activeKey = searchParams.get('categoryId');

  // Toplam sepet adedi hesaplama
  const cartCount =
    cartItems?.reduce((total, item) => total + (item.quantity || 1), 0) || 0;

  return (
    <Header style={{ display: 'flex', alignItems: 'center' }}>
      <div className='logo'>
        <Link
          href='/'
          style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}
        >
          Kayra Export E-commerce
        </Link>
      </div>

      <div style={{ marginLeft: 32, flex: 1 }}>
        {isLoading ? (
          <Spin style={{ color: 'white' }} />
        ) : (
          <Menu
            theme='dark'
            mode='horizontal'
            selectedKeys={activeKey ? [activeKey] : []}
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

      <Space style={{ marginLeft: 'auto' }}>
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
    </Header>
  );
};
