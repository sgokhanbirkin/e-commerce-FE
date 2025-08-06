import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    esmExternals: 'loose',
  },
  webpack: (config, { isServer }) => {
    // App Directory ile uyumlu basit bir konfigürasyon
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };

    return config;
  },
};

export default nextConfig;
