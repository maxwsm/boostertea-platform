import { BlogPostClient } from './client'
import { readdir, readFile } from 'fs/promises'
import { join } from 'path'
import { notFound } from 'next/navigation'
import { getPostBySlug } from '../../../src/web/lib/blog/getBlogPosts'
import { MDXRenderer } from '../../../src/web/components/scrollytelling/MDXRenderer'

// Generate static params for all blog articles
export async function generateStaticParams() {
  const cwd = process.cwd()
  const isRoot = !cwd.includes('/apps/')
  const isBoosterteaPath = cwd.endsWith('boostertea-web')
  
  let articlesDir;
  if (isBoosterteaPath) {
    articlesDir = join(cwd, 'content/blog/articles')
  } else if (isRoot) {
    articlesDir = join(cwd, 'apps/boostertea-web/content/blog/articles')
  } else {
    articlesDir = join(cwd, '../../apps/boostertea-web/content/blog/articles')
  }
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

  const cwd = process.cwd()
  const isRoot = !cwd.includes('/apps/')
  const isBoosterteaPath = cwd.endsWith('boostertea-web')
  
  let articlesDir;
  if (isBoosterteaPath) {
    articlesDir = join(cwd, 'content/blog/articles')
  } else if (isRoot) {
    articlesDir = join(cwd, 'apps/boostertea-web/content/blog/articles')
  } else {
    articlesDir = join(cwd, '../../apps/boostertea-web/content/blog/articles')
  }
  
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
