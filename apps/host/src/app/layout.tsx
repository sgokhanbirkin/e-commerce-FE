import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Providers } from './providers';
import { CartDrawerProvider } from '../components/CartDrawerContext';
import { CartDrawer } from '../components/CartDrawer';
import { Navbar } from '../components/Navbar';
import { GuestTokenClientProvider } from '../components/GuestTokenClientProvider';
import RouteChangeLoader from '../components/RouteChangeLoader';
import { App } from 'antd';
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
                <RouteChangeLoader />
                <Navbar />
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
