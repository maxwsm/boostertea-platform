import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Theme = 'dark' | 'light' | 'system';
export type ResolvedTheme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  // Always start with 'dark' for SSR (matches our CSS variables default)
  const [theme, setThemeState] = useState<Theme>('dark');
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>('dark');
  const [mounted, setMounted] = useState(false);

  // Load from localStorage only after mount (client-side only)
  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem('boostertea-theme') as Theme | null;
      if (saved && (saved === 'dark' || saved === 'light' || saved === 'system')) {
        setThemeState(saved);
        const resolved = saved === 'system' 
          ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
          : saved;
        setResolvedTheme(resolved);
      }
    } catch (e) {
      console.error('Failed to load theme:', e);
    }
  }, []);

  // Listen for system theme changes
  useEffect(() => {
    if (!mounted || theme !== 'system') return;
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setResolvedTheme(e.matches ? 'dark' : 'light');
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [mounted, theme]);

  // Apply theme class to document
  useEffect(() => {
    if (!mounted) return;
    
    const root = document.documentElement;
    root.classList.remove('dark', 'light');
    root.classList.add(resolvedTheme);
    root.setAttribute('data-theme', resolvedTheme);
    
    try {
      localStorage.setItem('boostertea-theme', theme);
    } catch (e) {
      console.error('Failed to save theme:', e);
    }
  }, [mounted, theme, resolvedTheme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    if (newTheme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      setResolvedTheme(systemTheme);
    } else {
      setResolvedTheme(newTheme);
    }
  };

  const toggleTheme = () => {
    if (theme === 'dark') setTheme('light');
    else if (theme === 'light') setTheme('dark');
    else setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
