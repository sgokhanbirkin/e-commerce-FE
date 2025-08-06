'use client';

import React from 'react';
import Link from 'next/link';
import { Menu, Layout, Spin } from 'antd';
import { useSearchParams } from 'next/navigation';
import { useGetCategoriesFromApiQuery } from '@data-access/api';

const { Header } = Layout;

export const Navbar: React.FC = () => {
  const { data: categories, isLoading } = useGetCategoriesFromApiQuery();
  const searchParams = useSearchParams();

  // Aktif kategori seçimi için URL'den categoryId'yi alıyoruz
  const activeKey = searchParams.get('categoryId');

  return (
    <Header style={{ display: 'flex', alignItems: 'center' }}>
      <div className="logo">
        <Link href="/" style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>
          Kayra Export E-commerce
        </Link>
      </div>

      <div style={{ marginLeft: 32, flex: 1 }}>
        {isLoading ? (
          <Spin style={{ color: 'white' }} />
        ) : (
          <Menu
            theme="dark"
            mode="horizontal"
            selectedKeys={activeKey ? [activeKey] : []}
          >
            {categories && categories.length > 0 ? (
              categories.map((cat) => (
                <Menu.Item key={cat.id}>
                  <Link href={`/categories/${cat.id}`}>
                    {cat.name}
                  </Link>
                </Menu.Item>
              ))
            ) : (
              <Menu.Item key="no-categories">
                <span style={{ color: '#999' }}>No categories available</span>
              </Menu.Item>
            )}
          </Menu>
        )}
      </div>

      <div>
        <Link href="/cart" style={{ color: 'white' }}>
          🛒
        </Link>
      </div>
    </Header>
  );
}; 