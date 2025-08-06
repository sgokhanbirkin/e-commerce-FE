import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'basket_remote',
      filename: 'remoteEntry.js',
      exposes: {
        './Basket': './src/components/Basket.tsx',
        './BasketApp': './src/App.tsx',
      },
      shared: ['react', 'react-dom', 'antd', '@reduxjs/toolkit', 'react-redux'],
      remotes: {
        host: 'host@http://localhost:3000/_next/static/chunks/remoteEntry.js',
        products_remote:
          'products_remote@http://localhost:3001/_next/static/chunks/remoteEntry.js',
      },
    }),
  ],
  build: {
    target: 'esnext',
    modulePreload: false,
    minify: false,
    cssCodeSplit: false,
  },
});
