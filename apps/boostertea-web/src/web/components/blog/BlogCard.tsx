'use client';
import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Link from 'next/link';
import type { BlogPostMeta } from '../../lib/blog/types';
import { CATEGORY_MAP, formatDate } from '../../lib/blog/getBlogPosts';

interface BlogCardProps {
  post: BlogPostMeta;
}

export function BlogCard({ post }: BlogCardProps) {
  const category = CATEGORY_MAP[post.category];
  const ref = useRef<HTMLAnchorElement>(null);

  // Motion physics
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };
  
  return (
    <Link href={`/blog/${post.slug}`} passHref legacyBehavior>
      <motion.a
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="group relative flex flex-col h-full bg-[#0D0F14] rounded-2xl overflow-hidden border border-white/5 hover:border-[#C4956A]/40 transition-colors cursor-pointer"
      >
        <div 
          className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" 
          style={{ transform: "translateZ(30px)" }}
        />

        {/* Cover Image */}
        <div className="relative h-56 overflow-hidden bg-gradient-to-br from-[#1A1410] to-[#0D0F14]">
          <motion.div 
            className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-110"
            style={{ transform: "translateZ(20px)" }}
          >
            <img 
               src={`/blog/covers/${post.coverImage}`} 
               alt={post.title} 
               className="w-full h-full object-cover opacity-80" 
            />
          </motion.div>
          
          {/* Category Badge */}
          <div 
            className="absolute top-4 left-4 px-4 py-1.5 rounded-full text-xs font-bold text-white uppercase tracking-widest backdrop-blur-md shadow-2xl"
            style={{ backgroundColor: `${category?.color}80` || 'rgba(196, 149, 106, 0.5)', transform: "translateZ(50px)" }}
          >
            {category?.name || post.category}
          </div>
          
          {/* Featured Badge */}
          {post.featured && (
            <div 
              className="absolute top-4 right-4 bg-[#C4956A] text-[#0F0B08] px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-xl"
              style={{ transform: "translateZ(50px)" }}
            >
              ★ Популярне
            </div>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D0F14] via-[#0D0F14]/20 to-transparent" />
        </div>
        
        {/* Content */}
        <div className="p-6 flex flex-col flex-1 relative z-10" style={{ transform: "translateZ(40px)" }}>
          {/* Meta */}
          <div className="flex items-center gap-3 text-xs font-mono uppercase tracking-widest text-[#A89880] mb-4">
            <span className="flex items-center gap-1.5 text-white/40">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {formatDate(post.date)}
            </span>
            <span className="text-white/20">•</span>
            <span className="flex items-center gap-1.5 text-[#C4956A]">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {post.readingTime} хв
            </span>
          </div>
          
          {/* Title */}
          <h3 className="text-white font-black text-2xl mb-3 group-hover:text-[#C4956A] transition-colors leading-[1.1] tracking-tight" style={{ fontFamily: '"Syne", sans-serif' }}>
            {post.title}
          </h3>
          
          {/* Excerpt */}
          <p className="text-[#A89880] text-sm leading-relaxed mb-6 flex-1 opacity-80 group-hover:opacity-100 transition-opacity">
            {post.seoDescription}
          </p>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-auto">
            {post.tags.slice(0, 3).map(tag => (
              <span 
                key={tag}
                className="px-3 py-1 bg-white/5 border border-white/10 text-[#C4956A] text-xs font-mono uppercase tracking-wider rounded backdrop-blur transition-colors group-hover:bg-[#C4956A]/10 group-hover:border-[#C4956A]/30"
              >
                #{tag}
              </span>
            ))}
            {post.tags.length > 3 && (
              <span className="px-3 py-1 text-white/30 text-xs font-mono">
                +{post.tags.length - 3}
              </span>
            )}
          </div>
        </div>
      </motion.a>
    </Link>
  );
}
