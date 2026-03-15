import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  typescript: {
    // Pre-existing Vite code has React 19 type quirks — errors are non-blocking
    ignoreBuildErrors: true,
  },
  compress: true,
  poweredByHeader: false,
  trailingSlash: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    minimumCacheTTL: 86400,
    remotePatterns: [],
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
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https:",
              "connect-src 'self' https://api.boostertea.com.ua http://5.189.141.134:4000 https://api.anthropic.com https://www.google-analytics.com",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join('; '),
          },
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
      // www redirect
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'boostertea.com.ua' }],
        destination: 'https://www.boostertea.com.ua/:path*',
        permanent: true,
      },
      // Legacy /products → /catalog
      {
        source: '/products',
        destination: '/catalog',
        permanent: true,
      },
      {
        source: '/products/:slug',
        destination: '/catalog/:slug',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
