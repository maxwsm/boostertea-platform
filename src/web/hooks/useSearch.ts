import { useState, useCallback, useRef, useEffect } from "react";

export interface SearchItem {
  id: number | string;
  type: "product" | "blog";
  title: string;
  description: string;
  url: string;
  image?: string;
  price?: number;
}

interface ApiProduct {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  imageUrl: string;
  categorySlug: string;
  isActive: boolean;
}

interface ApiSearchResult {
  products: ApiProduct[];
  total: number;
  query: string;
  limit: number;
  offset: number;
  hasMore: boolean;
}

interface Suggestion {
  name: string;
  slug: string;
}

interface UseSearchOptions {
  debounceMs?: number;
  limit?: number;
  category?: string;
  sort?: "relevance" | "price_asc" | "price_desc" | "name" | "newest";
}

const cache = new Map<string, { data: ApiSearchResult; timestamp: number }>();
const CACHE_TTL = 60_000;
const RECENT_SEARCHES_KEY = "boostertea_recent_searches";
const MAX_RECENT = 10;

function loadRecentSearches(): string[] {
  try {
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch { return []; }
}

function saveRecentSearches(searches: string[]) {
  try { localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(searches)); } catch {}
}

function mapProduct(p: ApiProduct): SearchItem {
  return {
    id: p.id,
    type: "product",
    title: p.name,
    description: p.description || "",
    url: `/product/${p.slug}`,
    image: p.imageUrl,
    price: p.price,
  };
}

export function useSearch(options: UseSearchOptions = {}) {
  const { debounceMs = 300, limit = 20, category, sort = "relevance" } = options;

  const [query, setQueryState] = useState("");
  const [results, setResults] = useState<SearchItem[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(0);
  const [recentSearches, setRecentSearches] = useState<string[]>(loadRecentSearches);

  const offsetRef = useRef(0);
  const debounceTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const abortController = useRef<AbortController>(undefined);

  const addRecentSearch = useCallback((q: string) => {
    if (!q.trim()) return;
    setRecentSearches((prev) => {
      const filtered = prev.filter((s) => s !== q);
      const next = [q, ...filtered].slice(0, MAX_RECENT);
      saveRecentSearches(next);
      return next;
    });
  }, []);

  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
    saveRecentSearches([]);
  }, []);

  const buildUrl = useCallback(
    (q: string, offset = 0) => {
      const params = new URLSearchParams({ q, limit: String(limit), offset: String(offset), sort });
      if (category) params.set("category", category);
      return `/api/search?${params}`;
    },
    [limit, category, sort]
  );

  const performSearch = useCallback(
    async (q: string, offset = 0) => {
      if (!q || q.length < 2) {
        setResults([]);
        setHasMore(false);
        setTotal(0);
        setError(null);
        return;
      }

      const url = buildUrl(q, offset);
      const cached = cache.get(url);
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        const items = (cached.data.products || []).map(mapProduct);
        setResults(offset > 0 ? (prev) => [...prev, ...items] : items);
        setHasMore(cached.data.hasMore);
        setTotal(cached.data.total);
        setIsLoading(false);
        return;
      }

      abortController.current?.abort();
      abortController.current = new AbortController();
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(url, { signal: abortController.current.signal });
        if (!response.ok) throw new Error(`Search failed: ${response.status}`);
        const data: ApiSearchResult = await response.json();

        cache.set(url, { data, timestamp: Date.now() });
        if (cache.size > 50) {
          const oldest = [...cache.entries()].sort((a, b) => a[1].timestamp - b[1].timestamp).slice(0, 10);
          oldest.forEach(([key]) => cache.delete(key));
        }

        const items = (data.products || []).map(mapProduct);
        if (offset > 0) {
          setResults((prev) => [...prev, ...items]);
        } else {
          setResults(items);
        }
        offsetRef.current = (data.offset ?? offset) + (data.limit ?? limit);
        setHasMore(data.hasMore ?? false);
        setTotal(data.total ?? 0);
      } catch (err: any) {
        if (err.name === "AbortError") return;
        setError(err.message);
        setResults([]);
        setHasMore(false);
        setTotal(0);
      } finally {
        setIsLoading(false);
      }
    },
    [buildUrl, limit]
  );

  const fetchSuggestions = useCallback(async (q: string) => {
    if (!q || q.length < 1) { setSuggestions([]); return; }
    try {
      const response = await fetch(`/api/search/suggestions?q=${encodeURIComponent(q)}`);
      if (response.ok) {
        const data = await response.json();
        setSuggestions(data.suggestions || []);
      }
    } catch {}
  }, []);

  const search = useCallback(
    (q: string) => {
      setQueryState(q);
      offsetRef.current = 0;
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(() => {
        performSearch(q);
        fetchSuggestions(q);
      }, debounceMs);
    },
    [performSearch, fetchSuggestions, debounceMs]
  );

  const loadMore = useCallback(() => {
    if (!hasMore || isLoading) return;
    performSearch(query, offsetRef.current);
  }, [hasMore, isLoading, query, performSearch]);

  useEffect(() => {
    return () => {
      debounceTimer.current && clearTimeout(debounceTimer.current);
      abortController.current?.abort();
    };
  }, []);

  return {
    query,
    setQuery: search,
    search,
    results,
    suggestions,
    isLoading,
    error,
    loadMore,
    hasMore,
    total,
    recentSearches,
    addRecentSearch,
    clearRecentSearches,
  };
}
