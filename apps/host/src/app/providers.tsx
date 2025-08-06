'use client';

import React, { useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import { ConfigProvider } from 'antd';
import { store } from '@data-access/store';
import { AuthProvider } from '../context';
import { setupAntdCompat, suppressAntdWarnings } from '../utils/antd-compat';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const [cartOpen, setCartOpen] = useState(false);

  // React 19 uyumluluğu için setup
  useEffect(() => {
    suppressAntdWarnings();
  }, []);

  return (
    <Provider store={store}>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#1890ff',
          },
        }}
        // React 19 uyumluluğu için
        legacyLocale={false}
        // React 19 uyumluluğu için ek ayarlar
        componentSize="middle"
        space={{ size: 'middle' }}
        // Wave effect'i devre dışı bırak (React 19 uyumluluk sorunu için)
        wave={{ disabled: true }}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </ConfigProvider>
    </Provider>
  );
}
