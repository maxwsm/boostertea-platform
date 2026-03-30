import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { SEO } from '../components/SEO';
import Header from '../components/Header';
import Footer from '../components/Footer';
import TelegramButton from '../components/TelegramButton';
import { Breadcrumbs } from '../components/Breadcrumbs';
import {
  ReadingProgress,
  TableOfContents,
  ShareButtons,
  RelatedArticles,
  renderArticleContent,
  EnergyImpactCalculator
} from '../components/blog';
import { AmbientSoundscape } from '../components/scrollytelling/AmbientSoundscape';
import { 
  getPostBySlug, 
  getRelatedPosts, 
  formatDate,
  CATEGORY_MAP 
} from '../lib/blog/getBlogPosts';
import { pushGTMEvent, type BlogPostMeta, type TocItem } from '../lib/blog/types';

interface BlogPostProps {
  slug: string;
  meta: BlogPostMeta;
  toc: TocItem[];
  children?: React.ReactNode;
}

export default function BlogPost({ slug, meta, toc, children }: BlogPostProps) {

  const { scrollY } = useScroll();
  const yHeader = useTransform(scrollY, [0, 500], [0, 150]);
  const opacityHeader = useTransform(scrollY, [0, 300], [1, 0]);

  // Track time on page
  useEffect(() => {
    if (!slug) return;
    
    const intervals = [30, 60, 120, 180, 300]; // seconds
    const timers: NodeJS.Timeout[] = [];
    
    intervals.forEach(seconds => {
      timers.push(setTimeout(() => {
        pushGTMEvent({
          event: 'blog_time_on_page',
          article_slug: slug,
          seconds
        });
      }, seconds * 1000));
    });

    return () => timers.forEach(clearTimeout);
  }, [slug]);

  // Track view once based on props
  useEffect(() => {
    pushGTMEvent({
      event: 'blog_view',
      article_slug: slug,
      category: meta.category,
      tags: meta.tags
    });
  }, [slug, meta]);

  // Related posts
  const relatedPosts = useMemo(() => {
    if (!slug) return [];
    return getRelatedPosts(slug, 3);
  }, [slug]);

  // Generate JSON-LD structured data
  const jsonLdData = useMemo(() => {
    const schemas: Record<string, unknown>[] = [];
    
    // Article schema
    if (meta.schema.includes('Article')) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: meta.title,
        description: meta.seoDescription,
        image: `https://boostertea.com.ua/blog/covers/${meta.coverImage}`,
        datePublished: meta.date,
        dateModified: meta.date,
        author: {
          '@type': 'Organization',
          name: 'BoosterTea',
          url: 'https://boostertea.com.ua'
        },
        publisher: {
          '@type': 'Organization',
          name: 'BoosterTea',
          logo: {
            '@type': 'ImageObject',
            url: 'https://boostertea.com.ua/logo.png'
          }
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': `https://boostertea.com.ua/blog/${meta.slug}`
        },
        articleSection: CATEGORY_MAP[meta.category]?.name || meta.category,
        keywords: meta.tags.join(', ')
      });
    }
    
    // Recipe schema
    if (meta.schema.includes('Recipe')) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'Recipe',
        name: meta.title,
        description: meta.seoDescription,
        image: `https://boostertea.com.ua/blog/covers/${meta.coverImage}`,
        author: {
          '@type': 'Organization',
          name: 'BoosterTea'
        }
      });
    }
    
    // BreadcrumbList schema
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Головна', item: 'https://boostertea.com.ua' },
        { '@type': 'ListItem', position: 2, name: 'Блог', item: 'https://boostertea.com.ua/blog' },
        { '@type': 'ListItem', position: 3, name: meta.title, item: `https://boostertea.com.ua/blog/${meta.slug}` }
      ]
    });
    
    // FAQ schema
    if (meta.faq && meta.faq.length > 0 && meta.schema.includes('FAQPage')) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: meta.faq.map(item => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.a
          }
        }))
      });
    }
    
    return schemas;
  }, [meta, slug]);

  const category = CATEGORY_MAP[meta.category];
  const shareUrl = `https://boostertea.com.ua/blog/${meta.slug}`;

  return (
    <div className="min-h-screen bg-[#0F0B08]">
      <SEO
        title={meta.seoTitle}
        description={meta.seoDescription}
        type="article"
        image={`https://boostertea.com.ua/blog/og/${meta.ogImage}`}
        article={{
          publishedTime: meta.date,
          modifiedTime: meta.date,
          author: meta.author
        }}
        breadcrumbs={[
          { name: 'Головна', url: 'https://boostertea.com.ua/' },
          { name: 'Блог', url: 'https://boostertea.com.ua/blog' },
          { name: meta.title, url: shareUrl },
        ]}
      />
      
      {/* JSON-LD Structured Data */}
      {jsonLdData.map((data, idx) => (
        <script
          key={idx}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
      ))}

      <ReadingProgress articleSlug={meta.slug} />
      <Header />

      {/* Article Header */}
      <header className="pt-28 pb-12 relative overflow-hidden">
        <motion.div style={{ y: yHeader, opacity: opacityHeader }} className="absolute inset-0 bg-gradient-to-b from-[#2D1810] via-[#1A1410] to-[#0F0B08] z-0" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <Breadcrumbs
              items={[
                { label: 'Головна', href: '/' },
                { label: 'Блог', href: '/blog' },
                { label: category?.name || 'Стаття', href: `/blog?category=${meta.category}` },
                { label: meta.title }
              ]}
            />
          </motion.div>

          {/* Category Badge */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium text-white mb-6"
            style={{ backgroundColor: `${category?.color}CC` || '#C4956ACC' }}
          >
            <span>{category?.emoji}</span>
            <span>{category?.name}</span>
          </motion.div>

          {/* Title */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-3xl sm:text-4xl lg:text-5xl text-[#E8DDD0] mb-6 leading-tight"
            style={{ fontFamily: '"Playfair Display", serif' }}
          >
            {meta.title}
          </motion.h1>

          {/* Meta */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap items-center gap-4 text-sm text-[#A89880]"
          >
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {meta.author}
            </span>
            <span className="text-[#3A2E22]">•</span>
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {formatDate(meta.date)}
            </span>
            <span className="text-[#3A2E22]">•</span>
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {meta.readingTime} хв читання
            </span>
          </motion.div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[280px_1fr_200px] gap-8">
          {/* Left Sidebar - TOC (sticky on desktop) */}
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <TableOfContents items={toc} />
            </div>
          </aside>

          {/* Main Article */}
          <article className="min-w-0">
            {/* Mobile TOC */}
            <div className="lg:hidden mb-8">
              <TableOfContents items={toc} />
            </div>

            {/* Cover Image Placeholder */}
            <div className="aspect-video bg-gradient-to-br from-[#2D1810] to-[#1A1410] rounded-2xl mb-8 flex items-center justify-center border border-[#3A2E22]">
              <div className="text-center">
                <span className="text-8xl">{category?.emoji}</span>
                <p className="text-[#A89880] mt-4 text-sm">{meta.coverAlt}</p>
              </div>
            </div>

            {/* Server-Side Compiled MDX Content */}
            {children}

            {/* Dynamic Effect Calculator */}
            <EnergyImpactCalculator />

            {/* Tags */}
            <div className="mt-12 pt-8 border-t border-[#3A2E22]">
              <div className="flex flex-wrap gap-2">
                {meta.tags.map(tag => (
                  <Link
                    key={tag}
                    href={`/blog?tag=${tag}`}
                    className="px-3 py-1.5 bg-[#C4956A]/10 text-[#C4956A] text-sm rounded-full hover:bg-[#C4956A]/20 transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>

            {/* Share */}
            <div className="mt-8">
              <ShareButtons 
                articleSlug={meta.slug}
                title={meta.title}
                url={shareUrl}
              />
            </div>

            {/* FAQ Section */}
            {meta.faq && meta.faq.length > 0 && (
              <div className="mt-12 p-6 bg-[#1A1410] rounded-2xl border border-[#3A2E22]">
                <h3 className="text-xl text-[#E8DDD0] font-semibold mb-6 flex items-center gap-2">
                  <svg className="w-5 h-5 text-[#C4956A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Часті питання
                </h3>
                <div className="space-y-4">
                  {meta.faq.map((item, idx) => (
                    <details key={idx} className="group">
                      <summary className="flex items-center justify-between cursor-pointer py-3 text-[#E8DDD0] font-medium hover:text-[#C4956A] transition-colors">
                        {item.q}
                        <svg className="w-5 h-5 text-[#C4956A] group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </summary>
                      <p className="text-[#A89880] pb-4 pl-4 border-l-2 border-[#C4956A]/30">
                        {item.a}
                      </p>
                    </details>
                  ))}
                </div>
              </div>
            )}
          </article>

          {/* Right Sidebar - Share (sticky on desktop) */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-6">
              <ShareButtons 
                articleSlug={meta.slug}
                title={meta.title}
                url={shareUrl}
              />
              
              {/* Quick CTA */}
              <div className="p-4 bg-gradient-to-br from-[#C4956A]/10 to-[#2D1810] rounded-xl border border-[#C4956A]/20">
                <p className="text-sm text-[#E8DDD0] mb-3">Спробуйте наші концентрати</p>
                <Link
                  href="/products"
                  className="block w-full text-center px-4 py-2 bg-[#C4956A] text-[#0F0B08] rounded-lg text-sm font-medium hover:bg-[#D4A57A] transition-colors"
                >
                  Замовити
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Related Articles */}
      <RelatedArticles currentSlug={meta.slug} posts={relatedPosts} />

      {/* Newsletter CTA */}
      <section className="py-16 bg-[#1A1410]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 
            className="text-2xl text-[#E8DDD0] mb-4"
            style={{ fontFamily: '"Playfair Display", serif' }}
          >
            Підпишіться на наш Telegram
          </h2>
          <p className="text-[#A89880] mb-6">
            Отримуйте нові рецепти, поради та спеціальні пропозиції першими
          </p>
          <a
            href="https://t.me/boostertea_bot"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3 bg-[#0088cc] text-white font-semibold rounded-xl hover:bg-[#0099dd] transition-all"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-3.043-1.197-4.99-4.337-5.143-4.539-.153-.202-1.226-1.632-1.226-3.114 0-1.483.772-2.206 1.045-2.51.274-.303.603-.378.803-.378.2 0 .4.002.574.012.183.01.427-.07.669.513.242.582.825 2.011.899 2.158.074.147.122.319.024.515-.098.196-.147.318-.293.487-.147.169-.306.354-.437.476-.147.137-.301.286-.133.566.168.279.747 1.23 1.604 1.99 1.102.975 2.032 1.278 2.319 1.418.287.14.454.117.622-.07.169-.188.712-.826.9-1.107.187-.281.375-.235.627-.141.253.094 1.617.763 1.893.901.275.138.458.208.526.325.068.117.05.677-.224 1.452z"/>
            </svg>
            Підписатися
          </a>
        </div>
      </section>

      <Footer />
      <TelegramButton />
      <AmbientSoundscape />
      <AmbientSoundscape />

      {/* Blog Content Styles */}
      <style>{`
        .blog-content h2 {
          font-size: 1.75rem;
          color: #E8DDD0;
          margin: 2.5rem 0 1rem;
          font-weight: 600;
          scroll-margin-top: 100px;
          font-family: 'Playfair Display', serif;
        }
        .blog-content h3 {
          font-size: 1.35rem;
          color: #E8DDD0;
          margin: 2rem 0 0.75rem;
          font-weight: 600;
          scroll-margin-top: 100px;
        }
        .blog-content p {
          color: #A89880;
          line-height: 1.8;
          margin: 0 0 1.25rem;
          font-size: 1.05rem;
        }
        .blog-content ul, .blog-content ol {
          color: #A89880;
          line-height: 1.8;
          margin: 0 0 1.25rem;
          padding-left: 1.5rem;
        }
        .blog-content ul {
          list-style-type: disc;
        }
        .blog-content ol {
          list-style-type: decimal;
        }
        .blog-content li {
          margin-bottom: 0.5rem;
        }
        .blog-content a {
          color: #C4956A;
          text-decoration: underline;
          text-decoration-color: #C4956A50;
          transition: all 0.2s;
        }
        .blog-content a:hover {
          text-decoration-color: #C4956A;
        }
        .blog-content strong {
          color: #C4956A;
          font-weight: 600;
        }
        .blog-content blockquote {
          border-left: 4px solid #C4956A;
          padding-left: 1.5rem;
          margin: 1.5rem 0;
          font-style: italic;
          color: #E8DDD0;
        }
        .blog-content hr {
          border: none;
          border-top: 1px solid #3A2E22;
          margin: 2rem 0;
        }
        .blog-content img {
          max-width: 100%;
          border-radius: 0.75rem;
          margin: 1.5rem 0;
        }
        @media (max-width: 768px) {
          .blog-content h2 {
            font-size: 1.5rem;
          }
          .blog-content h3 {
            font-size: 1.2rem;
          }
          .blog-content p {
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
}

