import type { NextConfig } from 'next';
import {
  htmlSecurityHeaders,
  STATIC_CACHE_CONTROL,
} from './src/lib/securityHeaders';

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: '/_next/static/:path*',
        headers: [{ key: 'Cache-Control', value: STATIC_CACHE_CONTROL }],
      },
      {
        source: '/:path*',
        headers: htmlSecurityHeaders(),
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/security.txt',
        destination: '/.well-known/security.txt',
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
        port: '',
        pathname: '/vi/**',
      },
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
        port: '',
        pathname: '/vi/**',
      },
    ],
  },
};

export default nextConfig;
