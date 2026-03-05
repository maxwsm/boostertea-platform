import { Link } from 'wouter';
import { useTranslation } from '../lib/i18n';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { t } = useTranslation();

  return (
    <footer className="bg-[var(--bg-tertiary)] border-t border-[var(--border)]" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-6" aria-label="BoosterTea - На головну">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--accent-hover)] flex items-center justify-center">
                <span className="text-[var(--bg-primary)] font-bold text-lg" style={{ fontFamily: 'var(--font-heading)' }}>B</span>
              </div>
              <span className="text-[var(--text-primary)] text-xl font-semibold tracking-tight">
                Booster<span className="text-[var(--accent)]">Tea</span>
              </span>
            </Link>
            <p className="text-[var(--text-muted)] text-sm leading-relaxed mb-6">
              {t('footer.description')}
            </p>
            <div className="flex gap-3">
              <a 
                href="https://instagram.com/booster_tea_ua" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[var(--theme-toggle-bg)] hover:bg-[var(--accent-muted)] flex items-center justify-center transition-colors group"
              >
                <svg className="w-5 h-5 text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a 
                href="https://tiktok.com/@booster_tea" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[var(--theme-toggle-bg)] hover:bg-[var(--accent-muted)] flex items-center justify-center transition-colors group"
              >
                <svg className="w-5 h-5 text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
                </svg>
              </a>
              <a 
                href="https://t.me/booster_tea_ua" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[var(--theme-toggle-bg)] hover:bg-[var(--accent-muted)] flex items-center justify-center transition-colors group"
              >
                <svg className="w-5 h-5 text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Navigation Column */}
          <nav aria-label="Додаткова навігація">
            <h4 className="text-[var(--text-primary)] font-semibold mb-6 text-lg" style={{ fontFamily: 'var(--font-heading)' }}>{t('footer.navigation')}</h4>
            <ul className="space-y-3">
              <li><Link href="/" className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors text-sm">{t('nav.home')}</Link></li>
              <li><Link href="/products" className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors text-sm">{t('nav.catalog')}</Link></li>
              <li><Link href="/accessories" className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors text-sm">{t('nav.accessories')}</Link></li>
              <li><Link href="/b2b" className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors text-sm">{t('nav.forBusiness')}</Link></li>
              <li><Link href="/adaptation" className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors text-sm">{t('nav.adaptation')}</Link></li>
              <li><Link href="/certificates" className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors text-sm">{t('certificates.breadcrumb')}</Link></li>
              <li><Link href="/blog" className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors text-sm">{t('nav.blog')}</Link></li>
              <li><Link href="/contacts" className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors text-sm">{t('nav.contacts')}</Link></li>
            </ul>
          </nav>

          {/* Products Column */}
          <div>
            <h4 className="text-[var(--text-primary)] font-semibold mb-6 text-lg" style={{ fontFamily: 'var(--font-heading)' }}>{t('footer.products')}</h4>
            <ul className="space-y-3">
              <li><Link href="/products/pu-erh" className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors text-sm">PU-ERH</Link></li>
              <li><Link href="/products/da-hong-pao" className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors text-sm">DA HONG PAO</Link></li>
              <li><Link href="/products/gaba" className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors text-sm">GABA</Link></li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="text-[var(--text-primary)] font-semibold mb-6 text-lg" style={{ fontFamily: 'var(--font-heading)' }}>{t('footer.contacts')}</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-[var(--accent)] mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href="tel:+380963109622" className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors text-sm">
                  +380 96 310 96 22
                </a>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-[var(--accent)] mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:office@boostertea.com.ua" className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors text-sm break-all">
                  office@boostertea.com.ua
                </a>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-[var(--accent)] mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-[var(--text-muted)] text-sm">
                  Lviv, Bohdana Khmelnytskoho 66a
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Payment Methods & Certifications */}
        <div className="mt-12 pt-8 border-t border-[var(--border)]">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            {/* Payment Methods */}
            <div className="flex items-center gap-6">
              <span className="text-[var(--text-subtle)] text-sm">{t('footer.weAccept')}:</span>
              <div className="flex items-center gap-3">
                {/* Visa */}
                <div className="px-3 py-1.5 bg-[var(--bg-secondary)] rounded-md border border-[var(--border)]">
                  <svg className="h-5 w-auto" viewBox="0 0 1000 324" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M651.19 0.54L630.22 179.36L612.69 227.1H535.63L454.11 0.54H474.28L549.72 193.64L564.45 0.54H651.19Z" fill="#1434CB"/>
                    <path d="M380.37 0.54L363.49 227.1H286.44L303.32 0.54H380.37Z" fill="#1434CB"/>
                    <path d="M221.5 0.54L145.26 156.8L137.29 0.54H60.24L0 227.1H77.05L116.66 98.79L130.6 227.1H185.97L282.42 0.54H221.5Z" fill="#1434CB"/>
                    <path d="M872.15 0.54L792.46 227.1H715.41L795.1 0.54H872.15ZM1000 0.54L934.23 227.1H857.18L922.95 0.54H1000Z" fill="#1434CB"/>
                  </svg>
                </div>
                {/* Mastercard */}
                <div className="px-3 py-1.5 bg-[var(--bg-secondary)] rounded-md border border-[var(--border)]">
                  <svg className="h-5 w-auto" viewBox="0 0 152 108" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="46" cy="54" r="46" fill="#EB001B"/>
                    <circle cx="106" cy="54" r="46" fill="#F79E1B"/>
                    <path d="M76 18.21C85.17 26.18 91 38.33 91 51.99C91 65.65 85.17 77.8 76 85.77C66.83 77.8 61 65.65 61 51.99C61 38.33 66.83 26.18 76 18.21Z" fill="#FF5F00"/>
                  </svg>
                </div>
                {/* Apple Pay */}
                <div className="px-3 py-1.5 bg-[var(--bg-secondary)] rounded-md border border-[var(--border)]">
                  <svg className="h-5 w-auto" viewBox="0 0 165 40" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path className="text-[var(--text-muted)]" d="M29.4,12.42a5.62,5.62,0,0,0,1.31-4,6,6,0,0,0-3.93,2,5.32,5.32,0,0,0-1.36,3.84,4.84,4.84,0,0,0,4-.84Z"/>
                    <path className="text-[var(--text-muted)]" d="M30.68,14.7c-2.19-.13-4.05,1.23-5.1,1.23s-2.66-1.16-4.37-1.14a6.45,6.45,0,0,0-5.49,3.3c-2.35,4-.6,10,1.68,13.26,1.12,1.61,2.45,3.4,4.19,3.34s2.31-1.08,4.32-1.08,2.59,1.08,4.37,1c1.81,0,2.95-1.62,4.07-3.24a14.17,14.17,0,0,0,1.84-3.76,5.71,5.71,0,0,1-3.46-5.2,5.82,5.82,0,0,1,2.79-4.88,6,6,0,0,0-4.73-2.55Z"/>
                    <path className="text-[var(--text-muted)]" d="M53.09,6.69a7.88,7.88,0,0,1,8.19,8.42c0,5.43-3.73,8.52-8.35,8.52H47.3v8.83H43.49V6.69Zm-5.79,13.6h4.32c3.66,0,5.74-2,5.74-5.2s-2.08-5.18-5.72-5.18H47.3Z"/>
                    <path className="text-[var(--text-muted)]" d="M75.28,29.33a6.52,6.52,0,0,1-6.85,3.45,6.93,6.93,0,0,1-7.11-7.24c0-4.53,3-7.34,6.86-7.34,4.15,0,6.79,3,6.79,7.13v1.31h-10v.21A3.53,3.53,0,0,0,68.63,30,3.24,3.24,0,0,0,72,27.92Zm-10.36-4.82H71.5a3.22,3.22,0,0,0-3.32-3.48A3.4,3.4,0,0,0,64.92,24.51Z"/>
                    <path className="text-[var(--text-muted)]" d="M79.14,35.71c.46,2.13,2.59,3.62,5.46,3.62,3.62,0,5.88-1.91,5.88-5.53V31.26h-.08a5.4,5.4,0,0,1-4.89,2.64c-4,0-6.68-3-6.68-7.56s2.73-7.79,6.79-7.79a5.25,5.25,0,0,1,4.93,2.85h.1V18.84h3.55V33.77c0,4.47-3.52,7.34-9.33,7.34-5.35,0-8.86-2.67-9.32-6.54ZM90.5,26.32a3.84,3.84,0,1,0-7.68,0,3.85,3.85,0,1,0,7.68,0Z"/>
                  </svg>
                </div>
                {/* Google Pay */}
                <div className="px-3 py-1.5 bg-[var(--bg-secondary)] rounded-md border border-[var(--border)]">
                  <svg className="h-5 w-auto" viewBox="0 0 165 40" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path className="text-[#4285F4]" d="M77.8,20.2v7.7h-2.5V8.1h6.5c1.6,0,3,0.6,4.1,1.7c1.1,1.1,1.7,2.4,1.7,4c0,1.6-0.6,2.9-1.7,4c-1.1,1.1-2.5,1.7-4.1,1.7h-4V20.2z M77.8,10.5v7.2h4c1,0,1.9-0.4,2.6-1.1c0.7-0.7,1.1-1.6,1.1-2.5c0-0.9-0.4-1.8-1.1-2.5c-0.7-0.7-1.6-1.1-2.6-1.1H77.8z"/>
                    <path className="text-[#EA4335]" d="M97.8,14.7c1.8,0,3.3,0.5,4.4,1.5c1.1,1,1.6,2.4,1.6,4.2v8.5h-2.4v-1.9h-0.1c-1,1.5-2.4,2.3-4.2,2.3c-1.5,0-2.8-0.4-3.8-1.3c-1-0.9-1.5-2-1.5-3.4c0-1.4,0.5-2.6,1.6-3.4c1.1-0.8,2.5-1.3,4.3-1.3c1.5,0,2.8,0.3,3.7,0.8v-0.6c0-0.9-0.4-1.7-1.1-2.3c-0.7-0.6-1.5-0.9-2.5-0.9c-1.4,0-2.6,0.6-3.4,1.8l-2.2-1.4C93.6,15.6,95.4,14.7,97.8,14.7z M93.9,24.5c0,0.7,0.3,1.2,0.9,1.7c0.6,0.4,1.2,0.7,2,0.7c1.1,0,2-0.4,2.9-1.2c0.8-0.8,1.3-1.7,1.3-2.8c-0.8-0.6-1.9-0.9-3.3-0.9c-1,0-1.9,0.2-2.5,0.7C94.2,23.2,93.9,23.8,93.9,24.5z"/>
                    <path className="text-[#FBBC04]" d="M117.8,15l-8.4,19.2h-2.6l3.1-6.7l-5.5-12.5h2.7l4,9.4h0.1l3.9-9.4H117.8z"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* Certifications */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-2 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border)]">
                <svg className="w-5 h-5 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span className="text-[var(--text-muted)] text-xs font-medium">HACCP</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border)]">
                <svg className="w-5 h-5 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-[var(--text-muted)] text-xs font-medium">ISO 22000</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border)]">
                <svg className="w-5 h-5 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
                <span className="text-[var(--text-muted)] text-xs font-medium">{t('footer.certified')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-8 border-t border-[var(--border)] flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-[var(--text-subtle)] text-sm">
            {t('footer.copyright', { year: currentYear.toString() })}
          </p>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
            <Link href="/privacy" className="text-[var(--text-subtle)] hover:text-[var(--text-muted)] text-sm transition-colors">
              {t('footer.privacy')}
            </Link>
            <Link href="/terms" className="text-[var(--text-subtle)] hover:text-[var(--text-muted)] text-sm transition-colors">
              {t('footer.terms')}
            </Link>
            <Link href="/return-policy" className="text-[var(--text-subtle)] hover:text-[var(--text-muted)] text-sm transition-colors">
              {t('footer.returnPolicy')}
            </Link>
            <button 
              onClick={() => (window as any).openCookieSettings?.()}
              className="text-[var(--text-subtle)] hover:text-[var(--text-muted)] text-sm transition-colors cursor-pointer"
            >
              Налаштування cookie
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
