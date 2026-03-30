import { useState, useEffect } from 'react';
import type { TocItem } from '../../lib/blog/types';

interface TableOfContentsProps {
  items: TocItem[];
}

export function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-100px 0px -80% 0px' }
    );

    items.forEach(item => {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [items]);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const top = element.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  if (items.length === 0) return null;

  return (
    <div className="bg-[#1A1410] rounded-xl border border-[#3A2E22] overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="w-full flex items-center justify-between p-4 hover:bg-[#221C14] transition-colors"
      >
        <h3 className="text-sm font-semibold text-[#C4956A] flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
          </svg>
          Зміст статті
        </h3>
        <svg 
          className={`w-4 h-4 text-[#A89880] transition-transform ${isCollapsed ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {/* Content */}
      {!isCollapsed && (
        <nav className="px-2 pb-4">
          <ul className="space-y-1">
            {items.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => scrollToHeading(item.id)}
                  className={`
                    w-full text-left text-sm py-2 px-3 rounded-lg transition-all
                    ${item.level === 3 ? 'pl-6' : 'pl-3'}
                    ${activeId === item.id 
                      ? 'text-[#C4956A] bg-[#C4956A]/10 font-medium' 
                      : 'text-[#A89880] hover:text-[#E8DDD0] hover:bg-[#221C14]'
                    }
                  `}
                >
                  <div className="flex items-center gap-2">
                    {activeId === item.id && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C4956A]" />
                    )}
                    <span className="line-clamp-2">{item.text}</span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}
