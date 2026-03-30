import { useState, useEffect, useRef } from 'react';
import type { BlogPostMeta } from '../../lib/blog/types';
import { searchPosts, formatDate } from '../../lib/blog/getBlogPosts';
import Link from 'next/link';

interface BlogSearchProps {
  onSearch?: (query: string, results: BlogPostMeta[]) => void;
}

export function BlogSearch({ onSearch }: BlogSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<BlogPostMeta[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.length >= 2) {
      const searchResults = searchPosts(query);
      setResults(searchResults);
      setIsOpen(true);
      onSearch?.(query, searchResults);
    } else {
      setResults([]);
      setIsOpen(false);
      onSearch?.('', []);
    }
  }, [query, onSearch]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <svg 
          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A89880]" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          placeholder="Пошук статей..."
          className="w-full bg-[#1A1410] border border-[#3A2E22] rounded-xl py-3 pl-12 pr-16 text-[#E8DDD0] placeholder-[#A89880]/50 focus:outline-none focus:border-[#C4956A]/50 focus:ring-1 focus:ring-[#C4956A]/30 transition-all"
        />
        
        <kbd className="absolute right-4 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1 px-2 py-1 bg-[#3A2E22] text-[#A89880] text-xs rounded">
          <span>Ctrl</span>
          <span>K</span>
        </kbd>
      </div>
      
      {/* Search Results Dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#1A1410] border border-[#3A2E22] rounded-xl overflow-hidden shadow-xl shadow-black/20 z-50 max-h-96 overflow-y-auto">
          <div className="p-3 text-xs text-[#A89880] border-b border-[#3A2E22]">
            Знайдено {results.length} {results.length === 1 ? 'результат' : results.length < 5 ? 'результати' : 'результатів'}
          </div>
          
          {results.map(post => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              onClick={() => {
                setIsOpen(false);
                setQuery('');
              }}
              className="flex items-start gap-4 p-4 hover:bg-[#C4956A]/5 transition-colors border-b border-[#3A2E22]/50 last:border-0"
            >
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#2D1810] to-[#1A1410] flex items-center justify-center text-2xl flex-shrink-0">
                {post.category === 'recipe' ? '🧋' : 
                 post.category === 'culture' ? '🏛️' :
                 post.category === 'science' ? '🔬' :
                 post.category === 'production' ? '🌿' : '💡'}
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="text-[#E8DDD0] font-medium text-sm line-clamp-1 mb-1">
                  {post.title}
                </h4>
                <p className="text-[#A89880] text-xs line-clamp-1 mb-1.5">
                  {post.seoDescription}
                </p>
                <div className="flex items-center gap-2 text-xs text-[#A89880]/60">
                  <span>{formatDate(post.date)}</span>
                  <span>•</span>
                  <span>{post.readingTime} хв</span>
                </div>
              </div>
              
              <svg className="w-5 h-5 text-[#C4956A] flex-shrink-0 self-center" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>
      )}
      
      {/* No results */}
      {isOpen && query.length >= 2 && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#1A1410] border border-[#3A2E22] rounded-xl p-6 text-center z-50">
          <svg className="w-12 h-12 text-[#3A2E22] mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-[#A89880]">Нічого не знайдено</p>
          <p className="text-[#A89880]/60 text-sm mt-1">Спробуйте інші ключові слова</p>
        </div>
      )}
    </div>
  );
}
