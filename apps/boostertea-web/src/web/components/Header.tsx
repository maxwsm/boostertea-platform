import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search } from 'lucide-react';
import { useStore } from '../lib/store';
import { useAuth } from '../lib/auth';
import { useTranslation } from '../lib/i18n';
import { useTheme } from '../lib/theme';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeToggle, { ThemeToggleSimple } from './ThemeToggle';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { getCartItemCount, setSearchOpen, setCartDrawerOpen } = useStore();
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = usePathname() || '/';
  const cartCount = getCartItemCount();
  const { t } = useTranslation();
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const navLinks = [
    { href: '/', label: t('nav.home') },
    { href: '/products', label: t('nav.products') },
    { href: '/accessories', label: 'Аксесуари та Сухий Чай' },
    { href: '/influencer', label: 'Академія & Кастинг' },
    { href: '/b2b', label: t('nav.b2b') },
    { href: '/blog', label: t('nav.blog') },
    { href: '/contacts', label: t('nav.contacts') },
  ];

  return (
    <>
      {/* Skip to content link for accessibility */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[60] focus:bg-[var(--bg-primary)] focus:text-[var(--text-primary)] focus:p-3 focus:rounded-lg focus:ring-2 focus:ring-[var(--accent)]"
      >
        Перейти до контенту
      </a>
      
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-[var(--header-bg)] backdrop-blur-md shadow-lg shadow-black/10' 
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <div className="flex flex-1">
              <Link href="/" className="flex items-center gap-2 group">

              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--accent-hover)] flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-[var(--bg-primary)] font-bold text-lg" style={{ fontFamily: 'var(--font-heading)' }}>B</span>
              </div>
              <span className="text-[var(--text-primary)] text-xl font-semibold tracking-tight hidden sm:block">
                Booster<span className="text-[var(--accent)]">Tea</span>
              </span>
              </Link>
            </div>

            {/* Desktop Navigation - Centered Floating Glassmorphism Pill */}
            <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-1 px-3 py-2 rounded-[2rem] bg-gradient-to-r from-white/5 via-white/20 to-white/5 dark:from-black/5 dark:via-white/10 dark:to-black/5 border border-black/5 dark:border-white/10 backdrop-blur-3xl shadow-[0_8px_32px_rgba(0,0,0,0.05)] shadow-black/10 transition-all duration-300" aria-label="Головна навігація">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 overflow-hidden group ${
                    location === link.href 
                      ? 'text-[var(--accent)]' 
                      : 'text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white'
                  }`}
                >
                  {/* Subtle hover background that adapts cleanly */}
                  <div className={`absolute inset-0 rounded-full transition-opacity duration-300 ${
                    location === link.href ? 'bg-black/5 dark:bg-white/10 opacity-100' : 'bg-black/5 dark:bg-white/10 opacity-0 group-hover:opacity-100'
                  }`} />
                  <span className="relative z-10">{link.label}</span>
                </Link>
              ))}
            </nav>

            {/* Right side actions */}
            <div className="flex flex-1 items-center justify-end gap-2">
              {/* Search Button */}
              <button
                onClick={() => setSearchOpen(true)}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-white/10 transition-all shadow-[0_4px_24px_rgba(0,0,0,0.1)]"
                aria-label="Відкрити пошук"
              >
                <Search className="w-5 h-5 text-[var(--text-secondary)] group-hover:text-[var(--accent)] transition-colors" />
              </button>

              {/* Theme Toggle */}
              <div className="hidden sm:block">
                <ThemeToggle />
              </div>

              {/* Language Switcher */}
              <div className="hidden sm:block">
                <LanguageSwitcher />
              </div>

              {/* Account / Login */}
              {!isLoading && (
                isAuthenticated && user ? (
                  <Link 
                    href="/account" 
                    className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-full bg-[var(--theme-toggle-bg)] hover:bg-[var(--theme-toggle-hover)] transition-colors"
                  >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--accent-hover)] flex items-center justify-center">
                      <span className="text-[var(--bg-primary)] text-xs font-bold">
                        {user.name.charAt(0)}
                      </span>
                    </div>
                    <span className="text-[var(--text-primary)] text-sm font-medium max-w-[100px] truncate hidden lg:block">
                      {user.name.split(' ')[0]}
                    </span>
                  </Link>
                ) : (
                  <Link 
                    href="/login" 
                    className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--theme-toggle-bg)] hover:bg-[var(--theme-toggle-hover)] transition-colors"
                  >
                    <svg className="w-5 h-5 text-[var(--text-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="text-[var(--text-primary)] text-sm font-medium">{t('nav.login')}</span>
                  </Link>
                )
              )}

              {/* Cart Button */}
              <button 
                onClick={(e) => { e.preventDefault(); setCartDrawerOpen(true); }}
                className="relative flex items-center justify-center w-10 h-10 rounded-full bg-white/10 border border-white/20 backdrop-blur-xl hover:bg-white/20 transition-all shadow-[0_4px_24px_rgba(0,0,0,0.15)]"
                aria-label="Open Cart"
              >
                <svg className="w-5 h-5 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-[var(--accent)] text-[var(--bg-primary)] text-xs font-bold rounded-full flex items-center justify-center animate-scale-in">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden flex items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-white/10 transition-all shadow-[0_4px_24px_rgba(0,0,0,0.1)]"
              >
                <svg className="w-6 h-6 text-[var(--text-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 z-40 md:hidden transition-opacity duration-300 ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
        <nav 
          className={`absolute top-16 left-0 right-0 bottom-0 bg-[var(--card-bg)] overflow-y-auto mobile-menu-content transform transition-all duration-300 ${
            isMobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
          }`}
        >
          <div className="flex flex-col gap-2 p-4 pb-24 safe-area-bottom">
            {/* Theme Toggle for Mobile */}
            <div className="mb-2 pb-4 border-b border-[var(--border)]">
              <ThemeToggleSimple />
            </div>

            {/* Language Switcher for Mobile */}
            <div className="mb-4 pb-4 border-b border-[var(--border)]">
              <LanguageSwitcher />
            </div>

            {navLinks.map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                className={`py-4 px-4 rounded-xl text-lg font-medium transition-all hover:bg-[var(--dropdown-hover-bg)] mobile-nav-link ${
                  location === link.href 
                    ? 'text-[var(--accent)] bg-[var(--accent-muted)]' 
                    : 'text-[var(--text-primary)]'
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {link.label}
              </Link>
            ))}
            <hr className="border-[var(--border)] my-2" />
            
            {isAuthenticated && user ? (
              <Link
                href="/account"
                className="py-4 px-4 rounded-xl text-lg font-medium text-[var(--text-primary)] transition-all hover:bg-[var(--dropdown-hover-bg)] flex items-center gap-3 mobile-nav-link"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--accent-hover)] flex items-center justify-center">
                  <span className="text-[var(--bg-primary)] text-sm font-bold">
                    {user.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <span className="block">{user.name.split(' ')[0]}</span>
                  <span className="text-xs text-[var(--accent)]">{user.bonusPoints} {t('account.bonus')}</span>
                </div>
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="py-4 px-4 rounded-xl text-lg font-medium text-[var(--text-primary)] transition-all hover:bg-[var(--dropdown-hover-bg)] flex items-center gap-3 mobile-nav-link"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  {t('nav.login')}
                </Link>
                <Link
                  href="/register"
                  className="py-4 px-4 rounded-xl text-lg font-medium bg-[var(--accent-muted)] text-[var(--accent)] transition-all hover:bg-[var(--accent-subtle)] flex items-center gap-3 mobile-nav-link"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  {t('nav.register')}
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </>
  );
};

export default Header;
