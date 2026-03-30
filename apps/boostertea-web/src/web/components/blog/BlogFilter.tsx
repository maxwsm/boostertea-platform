import { useState, useRef, useEffect } from 'react';
import { CATEGORY_MAP, getCategoryCounts } from '../../lib/blog/getBlogPosts';

interface BlogFilterProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const categories = [
  { slug: '', name: 'Усі', emoji: '🍵' },
  { slug: 'recipe', name: 'Рецепти', emoji: '🧋' },
  { slug: 'culture', name: 'Культура', emoji: '🏛️' },
  { slug: 'science', name: 'Наука чаю', emoji: '🔬' },
  { slug: 'production', name: 'Виробництво', emoji: '🌿' },
  { slug: 'tips', name: 'Лайфхаки', emoji: '💡' },
];

export function BlogFilter({ activeCategory, onCategoryChange }: BlogFilterProps) {
  const [showLeftShadow, setShowLeftShadow] = useState(false);
  const [showRightShadow, setShowRightShadow] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const categoryCounts = getCategoryCounts();

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setShowLeftShadow(scrollLeft > 10);
    setShowRightShadow(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    handleScroll();
  }, []);

  return (
    <div className="relative">
      {/* Left shadow */}
      {showLeftShadow && (
        <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-[#0F0B08] to-transparent z-10 pointer-events-none" />
      )}
      
      {/* Right shadow */}
      {showRightShadow && (
        <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[#0F0B08] to-transparent z-10 pointer-events-none" />
      )}
      
      {/* Scrollable container */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {categories.map(cat => {
          const isActive = activeCategory === cat.slug;
          const count = cat.slug ? categoryCounts[cat.slug] || 0 : 
            Object.values(categoryCounts).reduce((a, b) => a + b, 0);
          
          return (
            <button
              key={cat.slug}
              onClick={() => onCategoryChange(cat.slug)}
              className={`
                flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap
                transition-all duration-200 border
                ${isActive 
                  ? 'bg-[#C4956A] text-[#0F0B08] border-[#C4956A]' 
                  : 'bg-[#1A1410] text-[#A89880] border-[#3A2E22] hover:border-[#C4956A]/50 hover:text-[#E8DDD0]'
                }
              `}
            >
              <span>{cat.emoji}</span>
              <span>{cat.name}</span>
              <span className={`text-xs ${isActive ? 'text-[#0F0B08]/70' : 'text-[#A89880]/60'}`}>
                ({count})
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
