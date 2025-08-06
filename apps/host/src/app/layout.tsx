import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Providers } from './providers';
import { CartDrawerProvider } from '../components/features/cart/CartDrawerContext';
import { CartDrawer } from '../components/features/cart/CartDrawer';
import { Navbar } from '../components/layout/Navbar';
import { GuestTokenClientProvider } from '../components/shared/GuestTokenClientProvider';

import { App } from 'antd';
import { Suspense } from 'react';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Kayra Export E-commerce',
  description: 'E-commerce platform with micro-frontend architecture',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <App>
            <CartDrawerProvider>
              <GuestTokenClientProvider>
                <Suspense fallback={<div>Loading...</div>}>
                  <Navbar />
                </Suspense>
                {children}
                <CartDrawer />
              </GuestTokenClientProvider>
            </CartDrawerProvider>
          </App>
        </Providers>
      </body>
    </html>
  );
}
