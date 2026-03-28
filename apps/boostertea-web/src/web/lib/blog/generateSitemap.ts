// Sitemap generation for blog posts
import { blogPostsMeta } from './getBlogPosts';

interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

export function generateBlogSitemap(): SitemapUrl[] {
  const baseUrl = 'https://boostertea.com.ua';
  
  const urls: SitemapUrl[] = [
    {
      loc: `${baseUrl}/blog`,
      changefreq: 'weekly',
      priority: 0.8
    }
  ];
  
  // Add each blog post
  blogPostsMeta.forEach(post => {
    urls.push({
      loc: `${baseUrl}/blog/${post.slug}`,
      lastmod: post.date,
      changefreq: 'monthly',
      priority: 0.7
    });
  });
  
  return urls;
}

export function generateSitemapXML(): string {
  const urls = generateBlogSitemap();
  
  const urlEntries = urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ''}
    ${url.changefreq ? `<changefreq>${url.changefreq}</changefreq>` : ''}
    ${url.priority !== undefined ? `<priority>${url.priority}</priority>` : ''}
  </url>`).join('\n');
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;
}

// Generate RSS feed
export function generateRSSFeed(): string {
  const baseUrl = 'https://boostertea.com.ua';
  const now = new Date().toUTCString();
  
  const items = blogPostsMeta
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 20)
    .map(post => `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${baseUrl}/blog/${post.slug}</link>
      <guid>${baseUrl}/blog/${post.slug}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <description>${escapeXml(post.seoDescription)}</description>
      <category>${post.category}</category>
    </item>`).join('\n');
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>BoosterTea Blog</title>
    <link>${baseUrl}/blog</link>
    <description>Рецепти, наука чаю та китайська чайна культура</description>
    <language>uk</language>
    <lastBuildDate>${now}</lastBuildDate>
    <atom:link href="${baseUrl}/blog/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
