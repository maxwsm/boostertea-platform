import type { MetadataRoute } from 'next'

const BASE = 'https://www.boostertea.com.ua'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE}/catalog`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE}/faq`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/b2b`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/blog`, lastModified: now, changeFrequency: 'daily', priority: 0.7 },
    { url: `${BASE}/adaptation`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/accessories`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/contacts`, lastModified: now, changeFrequency: 'yearly', priority: 0.5 },
    { url: `${BASE}/certificates`, lastModified: now, changeFrequency: 'yearly', priority: 0.5 },
    { url: `${BASE}/mlm`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE}/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE}/return-policy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ]

  const productSlugs = ['pu-erh', 'da-hong-pao', 'gaba', 'set-all-three']
  const productPages: MetadataRoute.Sitemap = productSlugs.map((slug) => ({
    url: `${BASE}/catalog/${slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }))

  return [...staticPages, ...productPages]
}
