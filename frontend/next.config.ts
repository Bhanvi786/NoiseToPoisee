import type { NextConfig } from "next";

const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline';
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: res.cloudinary.com localhost:* http://localhost:* 127.0.0.1:* http://127.0.0.1:* https://artograph-backend.onrender.com;
    font-src 'self' data:;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    ${process.env.NODE_ENV === 'production' ? 'upgrade-insecure-requests;' : ''}
    connect-src 'self' localhost:* http://localhost:* ws://localhost:* wss://localhost:* 127.0.0.1:* http://127.0.0.1:* ws://127.0.0.1:* wss://127.0.0.1:* https://artograph-backend.onrender.com;
`;

const nextConfig: NextConfig = {
  allowedDevOrigins: ['127.0.0.1', '192.168.1.6', 'localhost'],
  async headers() {
    const headersList = [
      {
        key: 'Content-Security-Policy',
        value: cspHeader.replace(/\n/g, ''),
      },
      {
        key: 'X-Content-Type-Options',
        value: 'nosniff',
      },
      {
        key: 'X-Frame-Options',
        value: 'DENY',
      },
      {
        key: 'Referrer-Policy',
        value: 'strict-origin-when-cross-origin',
      }
    ];

    if (process.env.NODE_ENV === 'production') {
      headersList.push({
        key: 'Strict-Transport-Security',
        value: 'max-age=63072000; includeSubDomains; preload',
      });
    }

    return [
      {
        source: '/(.*)',
        headers: headersList,
      },
    ];
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5001',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '5001',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'artograph-backend.onrender.com',
        pathname: '/**',
      }
    ],
  },
};

export default nextConfig;
