import { useMemo } from 'react';
import Link from 'next/link';
import type { BlogPostMeta } from '../../lib/blog/types';
import { CATEGORY_MAP, formatDate } from '../../lib/blog/getBlogPosts';

interface BlogHeroProps {
  featuredPosts: BlogPostMeta[];
}

export function BlogHero({ featuredPosts }: BlogHeroProps) {
  // Get the most recent featured post as main hero
  const mainPost = featuredPosts[0];
  const secondaryPosts = featuredPosts.slice(1, 4);
  
  if (!mainPost) return null;

  return (
    <section className="relative pt-24 pb-16 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#2D1810] via-[#1A1410] to-[#0F0B08]" />
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#C4956A]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-[#C4956A]/3 rounded-full blur-3xl" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 
            className="text-4xl sm:text-5xl lg:text-6xl text-[#E8DDD0] mb-4"
            style={{ fontFamily: '"Playfair Display", serif' }}
          >
            Чайний журнал{' '}
            <span className="text-[#C4956A]">BoosterTea</span>
          </h1>
          <p className="text-lg text-[#A89880] max-w-2xl mx-auto">
            Рецепти, наука чаю та китайська чайна культура
          </p>
        </div>
        
        {/* Hero Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Main Featured Post */}
          <Link 
            href={`/blog/${mainPost.slug}`}
            className="group relative rounded-2xl overflow-hidden aspect-[4/3] lg:aspect-auto lg:row-span-2"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#2D1810] to-[#1A1410]" />
            
            {/* Category badge */}
            <div 
              className="absolute top-4 left-4 z-10 px-4 py-1.5 rounded-full text-sm font-medium text-white"
              style={{ backgroundColor: `${CATEGORY_MAP[mainPost.category]?.color}CC` || '#C4956ACC' }}
            >
              {CATEGORY_MAP[mainPost.category]?.emoji} {CATEGORY_MAP[mainPost.category]?.name}
            </div>
            
            {/* Content overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F0B08] via-[#0F0B08]/50 to-transparent flex flex-col justify-end p-6">
              <div className="flex items-center gap-3 text-sm text-[#A89880] mb-3">
                <span>{formatDate(mainPost.date)}</span>
                <span className="text-[#3A2E22]">•</span>
                <span>{mainPost.readingTime} хв читання</span>
              </div>
              
              <h2 
                className="text-2xl sm:text-3xl text-[#E8DDD0] font-semibold mb-3 group-hover:text-[#C4956A] transition-colors"
                style={{ fontFamily: '"Playfair Display", serif' }}
              >
                {mainPost.title}
              </h2>
              
              <p className="text-[#A89880] line-clamp-2 mb-4">
                {mainPost.seoDescription}
              </p>
              
              <div className="flex items-center gap-2 text-[#C4956A] font-medium">
                Читати статтю
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          </Link>
          
          {/* Secondary Posts */}
          {secondaryPosts.map(post => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group relative rounded-2xl overflow-hidden bg-[#1A1410] border border-[#3A2E22] hover:border-[#C4956A]/40 transition-all p-5 flex flex-col"
            >
              <div className="flex items-start justify-between mb-3">
                <span 
                  className="px-3 py-1 rounded-full text-xs font-medium text-white"
                  style={{ backgroundColor: `${CATEGORY_MAP[post.category]?.color}99` || '#C4956A99' }}
                >
                  {CATEGORY_MAP[post.category]?.emoji} {CATEGORY_MAP[post.category]?.name}
                </span>
                <span className="text-[#A89880] text-xs">{post.readingTime} хв</span>
              </div>
              
              <h3 
                className="text-lg text-[#E8DDD0] font-semibold mb-2 group-hover:text-[#C4956A] transition-colors line-clamp-2 flex-1"
                style={{ fontFamily: '"Playfair Display", serif' }}
              >
                {post.title}
              </h3>
              
              <p className="text-[#A89880] text-sm line-clamp-2">
                {post.seoDescription}
              </p>
              
              <div className="flex items-center gap-2 text-[#C4956A] text-sm font-medium mt-4 group-hover:gap-3 transition-all">
                Читати
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
