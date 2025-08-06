import React from 'react';
import { ConfigProvider, App as AntApp } from 'antd';
import { antdTheme } from './theme-config';

export interface ThemeProviderProps {
    children: React.ReactNode;
    theme?: typeof antdTheme;
    locale?: 'en' | 'tr' | 'ar';
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
    children,
    theme = antdTheme,
    locale = 'en',
}) => {
    return (
        <ConfigProvider theme={theme} locale={{ locale }}>
            <AntApp>
                {children}
            </AntApp>
        </ConfigProvider>
    );
};

// Export theme provider as default
export default ThemeProvider; 