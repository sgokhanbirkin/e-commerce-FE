'use client';

import React, { useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import { ConfigProvider } from 'antd';
import { store } from '@data-access/store';
import { AuthProvider } from '../hooks/useAuth';

// React 19 uyumluluğu için özel hook
const useAntdCompat = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
};

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const isClient = useAntdCompat();

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
        // React 19 uyumluluğu için ek ayarlar
        wave={{ disabled: true }}
        // React 19 uyumluluğu için
        autoInsertSpaceInButton={false}
        // React 19 uyumluluğu için
        virtual={false}
        // React 19 uyumluluğu için
        getPopupContainer={triggerNode =>
          triggerNode?.parentElement || document.body
        }
      >
        <AuthProvider>{children}</AuthProvider>
      </ConfigProvider>
    </Provider>
  );
}
