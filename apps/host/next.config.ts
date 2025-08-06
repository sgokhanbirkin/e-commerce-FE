import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  webpack: config => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };
    return config;
  },
  transpilePackages: ['antd', '@ant-design/icons'],
};

export default nextConfig;
