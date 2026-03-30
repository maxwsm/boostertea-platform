import { useState, useEffect, useCallback } from 'react';
import { pushGTMEvent } from '../../lib/blog/types';

interface ReadingProgressProps {
  articleSlug: string;
}

export function ReadingProgress({ articleSlug }: ReadingProgressProps) {
  const [progress, setProgress] = useState(0);
  const [scrollDepth, setScrollDepth] = useState({
    25: false,
    50: false,
    75: false,
    100: false
  });

  const handleScroll = useCallback(() => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    
    setProgress(Math.min(scrollPercent, 100));

    // Track scroll depth events
    const depths = [25, 50, 75, 100] as const;
    depths.forEach(depth => {
      if (scrollPercent >= depth && !scrollDepth[depth]) {
        setScrollDepth(prev => ({ ...prev, [depth]: true }));
        pushGTMEvent({
          event: `blog_scroll_${depth}` as 'blog_scroll_25' | 'blog_scroll_50' | 'blog_scroll_75' | 'blog_scroll_100',
          article_slug: articleSlug
        });
      }
    });
  }, [articleSlug, scrollDepth]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] h-1 bg-transparent">
      <div 
        className="h-full bg-gradient-to-r from-[#C4956A] to-[#D4A57A] transition-all duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
