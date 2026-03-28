import Link from 'next/link';
import type { BlogPostMeta } from '../../lib/blog/types';
import { CATEGORY_MAP, formatDate } from '../../lib/blog/getBlogPosts';
import { pushGTMEvent } from '../../lib/blog/types';

interface RelatedArticlesProps {
  currentSlug: string;
  posts: BlogPostMeta[];
}

export function RelatedArticles({ currentSlug, posts }: RelatedArticlesProps) {
  if (posts.length === 0) return null;

  const handleClick = (toSlug: string) => {
    pushGTMEvent({
      event: 'blog_related_click',
      from_slug: currentSlug,
      to_slug: toSlug
    });
  };

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 
          className="text-2xl sm:text-3xl text-[#E8DDD0] mb-8 text-center"
          style={{ fontFamily: '"Playfair Display", serif' }}
        >
          Читай також
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map(post => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              onClick={() => handleClick(post.slug)}
              className="group bg-[#1A1410] rounded-xl p-6 border border-[#3A2E22] hover:border-[#C4956A]/40 transition-all hover:-translate-y-1"
            >
              {/* Category & Time */}
              <div className="flex items-center justify-between mb-3">
                <span 
                  className="px-2.5 py-1 rounded-full text-xs font-medium text-white"
                  style={{ backgroundColor: `${CATEGORY_MAP[post.category]?.color}99` || '#C4956A99' }}
                >
                  {CATEGORY_MAP[post.category]?.emoji} {CATEGORY_MAP[post.category]?.name}
                </span>
                <span className="text-[#A89880] text-xs">{post.readingTime} хв</span>
              </div>
              
              {/* Title */}
              <h3 className="text-[#E8DDD0] font-semibold text-lg mb-2 group-hover:text-[#C4956A] transition-colors line-clamp-2 leading-snug">
                {post.title}
              </h3>
              
              {/* Excerpt */}
              <p className="text-[#A89880] text-sm line-clamp-2 mb-4">
                {post.seoDescription}
              </p>
              
              {/* Date & Read more */}
              <div className="flex items-center justify-between pt-4 border-t border-[#3A2E22]">
                <span className="text-[#A89880]/60 text-xs">
                  {formatDate(post.date)}
                </span>
                <span className="text-[#C4956A] text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                  Читати
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
