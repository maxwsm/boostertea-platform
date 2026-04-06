/**
 * Shim: next/navigation → wouter equivalents
 * Allows legacy Next.js navigation hooks to work in Vite SPA
 */
import { useLocation } from 'wouter';

export function usePathname(): string {
  const [location] = useLocation();
  return location;
}

export function useRouter() {
  const [, navigate] = useLocation();
  return {
    push: (path: string) => navigate(path),
    replace: (path: string) => navigate(path, { replace: true }),
    back: () => window.history.back(),
    forward: () => window.history.forward(),
    refresh: () => window.location.reload(),
    prefetch: () => {},
  };
}

export function useSearchParams() {
  if (typeof window === 'undefined') return new URLSearchParams();
  return new URLSearchParams(window.location.search);
}

export function useParams() {
  return {};
}
