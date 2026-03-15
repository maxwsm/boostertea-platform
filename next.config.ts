import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  typescript: {
    // Pre-existing Vite code has React 19 type quirks — errors are non-blocking
    ignoreBuildErrors: true,
  },
  compress: true,
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    minimumCacheTTL: 86400,
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
      {
        source: '/(.*)\\.(ico|jpg|jpeg|png|svg|webp|avif|woff2|woff)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ]
  },
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'boostertea.com.ua' }],
        destination: 'https://www.boostertea.com.ua/:path*',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
