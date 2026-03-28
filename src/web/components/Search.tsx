import { useState, useEffect, useRef, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Search as SearchIcon, X, Clock, ArrowRight, Loader2 } from 'lucide-react';
import { useSearch } from '../hooks/useSearch';
import type { SearchItem } from '../hooks/useSearch';

interface SearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Search({ isOpen, onClose }: SearchProps) {
  const router = useRouter();
  const { query, setQuery, results, isLoading, recentSearches, addRecentSearch, clearRecentSearches } = useSearch();
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const safeResults: SearchItem[] = results ?? [];

  useEffect(() => {
    if (isOpen && inputRef.current) inputRef.current.focus();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape': onClose(); break;
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) => Math.min(prev + 1, safeResults.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) => Math.max(prev - 1, -1));
          break;
        case 'Enter':
          if (selectedIndex >= 0 && safeResults[selectedIndex]) {
            handleResultClick(safeResults[selectedIndex].url, query);
          }
          break;
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, safeResults, selectedIndex, query, onClose]);

  useEffect(() => { setSelectedIndex(-1); }, [results]);

  useEffect(() => {
    if (isOpen) { document.body.style.overflow = 'hidden'; }
    else { document.body.style.overflow = ''; }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleResultClick = useCallback((url: string, searchQuery: string) => {
    addRecentSearch(searchQuery);
    router.push(url);
    onClose();
    setQuery('');
  }, [addRecentSearch, router, onClose, setQuery]);

  const handleRecentSearchClick = useCallback((s: string) => { setQuery(s); }, [setQuery]);

  const highlightMatch = (text: string, q: string) => {
    if (!q || !q.trim()) return text;
    try {
      const regex = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
      const parts = text.split(regex);
      return parts.map((part, i) =>
        regex.test(part) ? <strong key={i} className="text-[var(--color-primary)]">{part}</strong> : part
      );
    } catch { return text; }
  };

  const productResults = safeResults.filter((r) => r.type === 'product');
  const blogResults = safeResults.filter((r) => r.type === 'blog');
  const safeRecentSearches: string[] = recentSearches ?? [];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose}>
      <div className="bg-[var(--bg-primary)]/90 backdrop-blur-xl w-full max-w-3xl mx-auto mt-0 md:mt-20 md:rounded-3xl border border-[#F5F0E8]/10 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.4)] animate-in slide-in-from-bottom-4 md:slide-in-from-top-4 duration-300" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 p-5 border-b border-[var(--border-color)]/50">
          <SearchIcon className="w-5 h-5 text-[var(--text-secondary)] flex-shrink-0" />
          <input ref={inputRef} type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Пошук чаю, статей..." className="flex-1 bg-transparent text-[var(--text-primary)] placeholder-[var(--text-secondary)] text-lg outline-none" aria-label="Пошук" />
          {isLoading && <Loader2 className="w-5 h-5 text-[var(--color-primary)] animate-spin" />}
          {query && !isLoading && (
            <button onClick={() => setQuery('')} className="p-1 hover:bg-[var(--bg-secondary)] rounded-lg transition-colors" aria-label="Очистити пошук">
              <X className="w-5 h-5 text-[var(--text-secondary)]" />
            </button>
          )}
          <button onClick={onClose} className="md:hidden p-2 hover:bg-[var(--bg-secondary)] rounded-lg transition-colors" aria-label="Закрити пошук">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div ref={resultsRef} className="max-h-[60vh] md:max-h-[400px] overflow-y-auto">
          {!query && safeRecentSearches.length > 0 && (
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-[var(--text-secondary)]">Нещодавні пошуки</h3>
                <button onClick={clearRecentSearches} className="text-xs text-[var(--text-secondary)] hover:text-[var(--color-primary)] transition-colors">Очистити</button>
              </div>
              <div className="space-y-1">
                {safeRecentSearches.map((s, index) => (
                  <button key={index} onClick={() => handleRecentSearchClick(s)} className="flex items-center gap-3 w-full p-2 hover:bg-[var(--bg-secondary)] rounded-lg transition-colors text-left">
                    <Clock className="w-4 h-4 text-[var(--text-secondary)]" />
                    <span className="text-[var(--text-primary)]">{s}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {query && !isLoading && safeResults.length === 0 && (
            <div className="p-8 text-center">
              <p className="text-[var(--text-secondary)]">Нічого не знайдено</p>
              <p className="text-sm text-[var(--text-secondary)] mt-1">Спробуйте інший пошуковий запит</p>
            </div>
          )}

          {productResults.length > 0 && (
            <div className="p-4">
              <h3 className="text-sm font-medium text-[var(--text-secondary)] mb-3">Товари</h3>
              <div className="space-y-2">
                {productResults.map((result, index) => {
                  const isSelected = selectedIndex === index;
                  return (
                    <button key={result.id} onClick={() => handleResultClick(result.url, query)} className={`flex items-center gap-4 w-full p-3 rounded-2xl transition-all duration-300 text-left ${isSelected ? 'bg-[var(--color-primary)]/20 ring-1 ring-[var(--color-primary)]/50 shadow-lg translate-x-2' : 'hover:bg-[var(--bg-secondary)] hover:translate-x-1'}`}>
                      {result.image && <img src={result.image} alt={result.title} className="w-14 h-14 object-cover rounded-xl shadow-sm" />}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-[var(--text-primary)] truncate">{highlightMatch(result.title, query)}</h4>
                        <p className="text-sm text-[var(--text-secondary)] truncate">{highlightMatch(result.description, query)}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-[var(--text-secondary)] flex-shrink-0" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {blogResults.length > 0 && (
            <div className="p-4 border-t border-[var(--border-color)]">
              <h3 className="text-sm font-medium text-[var(--text-secondary)] mb-3">Блог</h3>
              <div className="space-y-2">
                {blogResults.map((result, index) => {
                  const globalIndex = productResults.length + index;
                  const isSelected = selectedIndex === globalIndex;
                  return (
                    <button key={result.id} onClick={() => handleResultClick(result.url, query)} className={`flex items-center gap-4 w-full p-3 rounded-2xl transition-all duration-300 text-left ${isSelected ? 'bg-[var(--color-primary)]/20 ring-1 ring-[var(--color-primary)]/50 shadow-lg translate-x-2' : 'hover:bg-[var(--bg-secondary)] hover:translate-x-1'}`}>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-[var(--text-primary)] truncate">{highlightMatch(result.title, query)}</h4>
                        <p className="text-sm text-[var(--text-secondary)] truncate">{highlightMatch(result.description, query)}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-[var(--text-secondary)] flex-shrink-0" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="hidden md:flex items-center gap-4 p-3 border-t border-[var(--border-color)] text-xs text-[var(--text-secondary)]">
          <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 bg-[var(--bg-secondary)] rounded text-[10px]">↑↓</kbd> навігація</span>
          <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 bg-[var(--bg-secondary)] rounded text-[10px]">Enter</kbd> вибрати</span>
          <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 bg-[var(--bg-secondary)] rounded text-[10px]">Esc</kbd> закрити</span>
        </div>
      </div>
    </div>
  );
}

export function SearchButton({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="p-2 hover:bg-[var(--bg-secondary)] rounded-lg transition-colors" aria-label="Відкрити пошук">
      <SearchIcon className="w-5 h-5 text-[var(--text-secondary)]" />
    </button>
  );
}

export default Search;
