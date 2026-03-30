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
          className="text-4xl text-white mb-12 text-center font-black uppercase tracking-tighter"
          style={{ fontFamily: '"Syne", sans-serif' }}
        >
          Читай також
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map(post => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              onClick={() => handleClick(post.slug)}
              className="group bg-white/[0.02] backdrop-blur-md rounded-2xl p-8 border border-white/10 hover:border-[#C4956A]/40 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:bg-white/5"
            >
              {/* Category & Time */}
              <div className="flex items-center justify-between mb-3">
                <span 
                  className="px-2.5 py-1 rounded-full text-xs font-medium text-white"
                  style={{ backgroundColor: `${CATEGORY_MAP[post.category]?.color}99` || '#C4956A99' }}
                >
                  {CATEGORY_MAP[post.category]?.emoji} {CATEGORY_MAP[post.category]?.name}
                </span>
                <span className="text-white/40 text-xs font-mono uppercase">{post.readingTime} хв</span>
              </div>
              
              {/* Title */}
              <h3 className="text-white font-bold text-xl mb-3 group-hover:text-[#C4956A] transition-colors line-clamp-2 leading-tight tracking-tight" style={{ fontFamily: '"Syne", sans-serif' }}>
                {post.title}
              </h3>
              
              {/* Excerpt */}
              <p className="text-white/60 text-sm line-clamp-2 mb-6 leading-relaxed">
                {post.seoDescription}
              </p>
              
              {/* Date & Read more */}
              <div className="flex items-center justify-between pt-6 border-t border-white/10">
                <span className="text-white/30 text-xs font-mono tracking-widest uppercase">
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
