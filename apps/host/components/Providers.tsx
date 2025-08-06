'use client';

import { ConfigProvider } from 'antd';
import { Provider } from 'react-redux';
import { store } from '@/lib/store';
import { theme } from '@/lib/theme';

interface ProvidersProps {
    children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
    return (
        <Provider store={store}>
            <ConfigProvider theme={theme}>
                {children}
            </ConfigProvider>
        </Provider>
    );
} 