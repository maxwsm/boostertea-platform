import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/account', '/checkout', '/order-success', '/api/'],
      },
    ],
    sitemap: 'https://www.boostertea.com.ua/sitemap.xml',
  }
}
