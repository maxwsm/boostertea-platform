import { BlogPostClient } from './client'
import { readdir, readFile } from 'fs/promises'
import { join } from 'path'
import { notFound } from 'next/navigation'
import { getPostBySlug } from '../../../src/web/lib/blog/getBlogPosts'
import { MDXRenderer } from '../../../src/web/components/scrollytelling/MDXRenderer'
import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params;
  const meta = getPostBySlug(slug);
  
  if (!meta) return {};

  const SITE_URL = 'https://www.boostertea.com.ua';
  const imageUrl = `${SITE_URL}/blog/${meta.coverImage}`;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: meta.seoTitle || meta.title,
    description: meta.seoDescription,
    image: imageUrl,
    author: {
      '@type': 'Organization',
      name: meta.author || 'BoosterTea'
    },
    publisher: {
      '@type': 'Organization',
      name: 'BoosterTea',
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/favicon-128.webp`
      }
    },
    datePublished: meta.date,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/blog/${slug}`
    }
  };

  return {
    title: meta.seoTitle || `${meta.title} | BoosterTea`,
    description: meta.seoDescription,
    keywords: meta.tags,
    openGraph: {
      title: meta.seoTitle || meta.title,
      description: meta.seoDescription,
      url: `${SITE_URL}/blog/${slug}`,
      type: 'article',
      publishedTime: meta.date,
      authors: [meta.author || 'BoosterTea'],
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: meta.coverAlt || meta.title,
        }
      ],
    },
    other: {
      'application/ld+json': JSON.stringify(schema),
    }
  };
}

// Generate static params for all blog articles
export async function generateStaticParams() {
  const isRoot = !process.cwd().endsWith('boostertea-web')
  const articlesDir = join(process.cwd(), isRoot ? 'apps/boostertea-web/content/blog/articles' : 'content/blog/articles')
  const files = await readdir(articlesDir)
  
  return files
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => {
      // Strip '001-' prefix to get the pure slug
      const match = file.match(/^\d+-(.+)\.mdx$/)
      return {
        slug: match ? match[1] : file.replace('.mdx', ''),
      }
    })
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const meta = getPostBySlug(resolvedParams.slug)
  if (!meta) {
    return notFound()
  }

  const isRoot = !process.cwd().endsWith('boostertea-web')
  const articlesDir = join(process.cwd(), isRoot ? 'apps/boostertea-web/content/blog/articles' : 'content/blog/articles')
  
  // Reconstruct filename like '001-slug.mdx'
  const paddedId = String(meta.id).padStart(3, '0')
  const fileName = `${paddedId}-${resolvedParams.slug}.mdx`
  const filePath = join(articlesDir, fileName)
  const source = await readFile(filePath, 'utf8')

  // Extract TOC on the server
  const contentMatch = source.match(/---[\s\S]*?---\s*([\s\S]*)/);
  const content = contentMatch ? contentMatch[1].trim() : source;
  const toc: { id: string, text: string, level: number }[] = [];
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  let match;
  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    let text = match[2].replace(/\*\*/g, '').trim();
    // Remove markdown links for ID generation
    text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
    const id = text.toLowerCase().replace(/[^\w]+/g, '-').replace(/(^-|-$)/g, '');
    toc.push({ id, text, level });
  }

  return (
    <BlogPostClient slug={resolvedParams.slug} meta={meta} toc={toc}>
      <MDXRenderer source={source} />
    </BlogPostClient>
  )
}
