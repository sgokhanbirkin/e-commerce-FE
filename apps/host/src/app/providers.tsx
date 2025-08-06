'use client';

import React from 'react';
import { Provider } from 'react-redux';
import { ConfigProvider } from 'antd';
import { store } from '@data-access/store';

interface ProvidersProps {
    children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
    return (
        <Provider store={store}>
            <ConfigProvider
                theme={{
                    token: {
                        colorPrimary: '#1890ff',
                    },
                }}
            >
                {children}
            </ConfigProvider>
        </Provider>
    );
} 