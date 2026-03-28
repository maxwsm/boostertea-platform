import Link from 'next/link';
import type { BlogPostMeta } from '../../lib/blog/types';
import { CATEGORY_MAP, formatDate } from '../../lib/blog/getBlogPosts';

interface BlogCardProps {
  post: BlogPostMeta;
}

export function BlogCard({ post }: BlogCardProps) {
  const category = CATEGORY_MAP[post.category];
  
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col h-full bg-[#1A1410] rounded-xl overflow-hidden border border-[#3A2E22] hover:border-[#C4956A]/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#C4956A]/5"
    >
      {/* Cover Image */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-[#2D1810] to-[#1A1410]">
        {/* Placeholder for image - in production use actual image */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-6xl opacity-30">{category?.emoji || '🍵'}</div>
        </div>
        
        {/* Category Badge */}
        <div 
          className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium text-white backdrop-blur-sm"
          style={{ backgroundColor: `${category?.color}99` || '#C4956A99' }}
        >
          {category?.name || post.category}
        </div>
        
        {/* Featured Badge */}
        {post.featured && (
          <div className="absolute top-3 right-3 bg-[#C4956A] text-[#0F0B08] px-3 py-1 rounded-full text-xs font-bold">
            ★ Популярне
          </div>
        )}
        
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F0B08]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        {/* Meta */}
        <div className="flex items-center gap-3 text-sm text-[#A89880] mb-3">
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {formatDate(post.date)}
          </span>
          <span className="text-[#3A2E22]">•</span>
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {post.readingTime} хв
          </span>
        </div>
        
        {/* Title */}
        <h3 className="text-[#E8DDD0] font-semibold text-lg mb-2 group-hover:text-[#C4956A] transition-colors line-clamp-2 leading-snug">
          {post.title}
        </h3>
        
        {/* Excerpt */}
        <p className="text-[#A89880] text-sm leading-relaxed mb-4 flex-1 line-clamp-3">
          {post.seoDescription}
        </p>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mt-auto">
          {post.tags.slice(0, 3).map(tag => (
            <span 
              key={tag}
              className="px-2 py-0.5 bg-[#C4956A]/10 text-[#C4956A] text-xs rounded-full"
            >
              #{tag}
            </span>
          ))}
          {post.tags.length > 3 && (
            <span className="px-2 py-0.5 text-[#A89880] text-xs">
              +{post.tags.length - 3}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
