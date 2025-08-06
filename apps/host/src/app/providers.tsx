'use client';

import React, { useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import { ConfigProvider } from 'antd';
import { store } from '@data-access/store';
import { AuthProvider } from '../hooks/useAuth';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <Provider store={store}>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#1890ff',
          },
        }}
        componentSize='middle'
        space={{ size: 'middle' }}
      >
        <AuthProvider>{children}</AuthProvider>
      </ConfigProvider>
    </Provider>
  );
}
