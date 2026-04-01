import Link from 'next/link';
import { useTranslation } from '../lib/i18n';
import { useStore } from '../lib/store';
import { MapPin, Phone, Mail, Award, ShieldCheck, CheckCircle2 } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { t } = useTranslation();
  const { setCookieSettingsOpen } = useStore();

  return (
    <footer className="relative overflow-hidden bg-[var(--bg-tertiary)] border-t border-[var(--border)] pt-20 pb-8" role="contentinfo">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent opacity-20"></div>
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-[var(--accent)] opacity-5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[var(--secondary)] opacity-5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          {/* Brand Column */}
          <div className="lg:col-span-4">
            <Link href="/" className="flex items-center gap-3 mb-6 hover:opacity-90 transition-opacity" aria-label="BoosterTea - На головну">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--accent)] to-[var(--accent-hover)] flex items-center justify-center shadow-lg shadow-[var(--accent-muted)] card-3d-tilt">
                <span className="text-[var(--bg-primary)] font-bold text-2xl" style={{ fontFamily: 'var(--font-heading)' }}>B</span>
              </div>
              <span className="text-white text-2xl font-black tracking-tighter" style={{ fontFamily: '"Syne", sans-serif', textShadow: '0 0 20px rgba(159, 211, 86, 0.4)' }}>
                Booster<span className="text-[#9FD356]">Tea</span>
              </span>
            </Link>
            <p className="text-[var(--text-muted)] text-sm leading-relaxed mb-8 max-w-sm">
              {t('footer.description')}
            </p>
            <div className="flex gap-4">
              <a 
                href="https://instagram.com/booster_tea_ua" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl glass hover:bg-[var(--accent)] hover:-translate-y-1 hover:shadow-lg hover:shadow-[var(--accent-muted)] flex items-center justify-center transition-all duration-300 group"
              >
                <svg className="w-5 h-5 text-[var(--text-secondary)] group-hover:text-[var(--bg-primary)] transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a 
                href="https://tiktok.com/@booster_tea" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl glass hover:bg-[var(--accent)] hover:-translate-y-1 hover:shadow-lg hover:shadow-[var(--accent-muted)] flex items-center justify-center transition-all duration-300 group"
              >
                <svg className="w-5 h-5 text-[var(--text-secondary)] group-hover:text-[var(--bg-primary)] transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
                </svg>
              </a>
              <a 
                href="https://t.me/boostertea_bot" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl glass hover:bg-[#2AABEE] hover:-translate-y-1 hover:shadow-lg hover:shadow-[#2AABEE]/30 flex items-center justify-center transition-all duration-300 group"
              >
                <svg className="w-5 h-5 text-[var(--text-secondary)] group-hover:text-[var(--bg-primary)] transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Navigation Column */}
          <nav className="lg:col-span-2" aria-label="Додаткова навігація">
            <h4 className="text-[#E8DDD0] font-black mb-6 text-sm tracking-widest uppercase" style={{ fontFamily: '"Syne", sans-serif', textShadow: '0 0 10px rgba(232, 221, 208, 0.2)' }}>{t('footer.navigation')}</h4>
            <ul className="space-y-3">
              <li><Link href="/" className="text-[var(--text-muted)] hover:text-[var(--accent)] hover:translate-x-1 inline-block transition-all text-sm font-medium">{t('nav.home')}</Link></li>
              <li><Link href="/products" className="text-[var(--text-muted)] hover:text-[var(--accent)] hover:translate-x-1 inline-block transition-all text-sm font-medium">{t('nav.catalog')}</Link></li>
              <li><Link href="/accessories" className="text-[var(--text-muted)] hover:text-[var(--accent)] hover:translate-x-1 inline-block transition-all text-sm font-medium">{t('nav.accessories')}</Link></li>
              <li><Link href="/b2b" className="text-[var(--text-muted)] hover:text-[var(--accent)] hover:translate-x-1 inline-block transition-all text-sm font-medium">{t('nav.forBusiness')}</Link></li>
              <li><Link href="/adaptation" className="text-[var(--text-muted)] hover:text-[var(--accent)] hover:translate-x-1 inline-block transition-all text-sm font-medium">{t('nav.adaptation')}</Link></li>
              <li><Link href="/blog" className="text-[var(--text-muted)] hover:text-[var(--accent)] hover:translate-x-1 inline-block transition-all text-sm font-medium">{t('nav.blog')}</Link></li>
            </ul>
          </nav>

          {/* Products Column */}
          <div className="lg:col-span-3">
            <h4 className="text-[#E8DDD0] font-black mb-6 text-sm tracking-widest uppercase" style={{ fontFamily: '"Syne", sans-serif', textShadow: '0 0 10px rgba(232, 221, 208, 0.2)' }}>{t('footer.products')}</h4>
            <ul className="space-y-3">
              <li><Link href="/products/pu-erh" className="text-[var(--text-muted)] hover:text-[var(--accent)] hover:translate-x-1 inline-block transition-all text-sm font-medium">✨ Premium PU-ERH</Link></li>
              <li><Link href="/products/da-hong-pao" className="text-[var(--text-muted)] hover:text-[var(--accent)] hover:translate-x-1 inline-block transition-all text-sm font-medium">✨ Authentic DA HONG PAO</Link></li>
              <li><Link href="/products/gaba" className="text-[var(--text-muted)] hover:text-[var(--accent)] hover:translate-x-1 inline-block transition-all text-sm font-medium">✨ Functional GABA</Link></li>
            </ul>
          </div>

          {/* Contact Column */}
          <div className="lg:col-span-3">
            <h4 className="text-[#E8DDD0] font-black mb-6 text-sm tracking-widest uppercase" style={{ fontFamily: '"Syne", sans-serif', textShadow: '0 0 10px rgba(232, 221, 208, 0.2)' }}>{t('footer.contacts')}</h4>
            <ul className="space-y-4">
              <li>
                <a href="tel:+380963109622" className="group flex items-center gap-3 p-3 rounded-xl border border-transparent hover:border-[var(--border)] hover:bg-[var(--bg-secondary)] transition-all">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[var(--bg-secondary)] group-hover:bg-[var(--accent)] group-hover:text-[var(--bg-primary)] flex items-center justify-center transition-colors">
                    <Phone className="w-5 h-5 text-[var(--accent)] group-hover:text-[var(--bg-primary)]" />
                  </div>
                  <div>
                    <div className="text-xs text-[var(--text-subtle)] font-medium mb-0.5">Підтримка клієнтів</div>
                    <div className="text-sm font-semibold text-[var(--text-secondary)] group-hover:text-[var(--accent)] transition-colors">+380 96 310 96 22</div>
                  </div>
                </a>
              </li>
              <li>
                <a href="mailto:office@boostertea.com.ua" className="group flex items-center gap-3 p-3 rounded-xl border border-transparent hover:border-[var(--border)] hover:bg-[var(--bg-secondary)] transition-all">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[var(--bg-secondary)] group-hover:bg-[var(--accent)] flex items-center justify-center transition-colors">
                    <Mail className="w-5 h-5 text-[var(--accent)] group-hover:text-[var(--bg-primary)]" />
                  </div>
                  <div>
                    <div className="text-xs text-[var(--text-subtle)] font-medium mb-0.5">Email</div>
                    <div className="text-sm font-semibold text-[var(--text-secondary)] group-hover:text-[var(--accent)] transition-colors break-all">office@boostertea.com.ua</div>
                  </div>
                </a>
              </li>
              <li>
                <div className="flex items-center gap-3 p-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-[var(--accent)]" />
                  </div>
                  <div>
                    <div className="text-xs text-[var(--text-subtle)] font-medium mb-0.5">Головний офіс</div>
                    <div className="text-sm font-semibold text-[var(--text-secondary)]">Lviv, Bohdana Khmelnytskoho 66a</div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Payment Methods & Certifications */}
        <div className="py-8 border-t border-[var(--border)]/60">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
            {/* Payment Methods */}
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
              <span className="text-[var(--text-subtle)] text-xs font-bold tracking-widest uppercase">{t('footer.weAccept')}</span>
              <div className="flex items-center gap-3">
                {/* Premium Payment Badges */}
                <div className="h-8 flex gap-2 items-center opacity-80 hover:opacity-100 transition-all duration-300">
                  {/* Dark Theme Assets (White text) */}
                  <img src="/payments/footer_visa_dark_bg.svg" alt="Visa" className="h-full w-auto hidden dark:block" />
                  <img src="/payments/footer_mc_dark_bg.svg" alt="Mastercard" className="h-full w-auto hidden dark:block" />
                  <img src="/payments/footer_apple_pay_dark_bg.svg" alt="Apple Pay" className="h-full w-auto hidden dark:block" />
                  <img src="/payments/footer_google_pay_dark_bg.svg" alt="Google Pay" className="h-full w-auto hidden dark:block" />
                  <img src="/payments/footer_plata_dark_bg.svg" alt="Mono" className="h-full w-auto hidden dark:block" />
                  
                  {/* Light Theme Assets (Dark text) */}
                  <img src="/payments/footer_visa_light_bg.svg" alt="Visa" className="h-full w-auto block dark:hidden" />
                  <img src="/payments/footer_mc_light_bg.svg" alt="Mastercard" className="h-full w-auto block dark:hidden" />
                  <img src="/payments/footer_apple_pay_light_bg.svg" alt="Apple Pay" className="h-full w-auto block dark:hidden" />
                  <img src="/payments/footer_google_pay_light_bg.svg" alt="Google Pay" className="h-full w-auto block dark:hidden" />
                  <img src="/payments/footer_plata_light_bg.svg" alt="Mono" className="h-full w-auto block dark:hidden" />
                </div>
              </div>
            </div>

            {/* Certifications */}
            <div className="flex flex-wrap justify-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2 bg-[var(--bg-secondary)] rounded-full border border-[var(--border)] shadow-sm hover:border-[var(--accent-muted)] hover:shadow-md transition-all cursor-default">
                <CheckCircle2 className="w-4 h-4 text-[var(--accent)]" />
                <span className="text-[var(--text-secondary)] text-xs font-semibold tracking-wide">HACCP Certified</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-[var(--bg-secondary)] rounded-full border border-[var(--border)] shadow-sm hover:border-[var(--accent-muted)] hover:shadow-md transition-all cursor-default">
                <Award className="w-4 h-4 text-[var(--accent)]" />
                <span className="text-[var(--text-secondary)] text-xs font-semibold tracking-wide">ISO 22000</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-[var(--bg-secondary)] rounded-full border border-[var(--border)] shadow-sm hover:border-[var(--accent-muted)] hover:shadow-md transition-all cursor-default">
                <ShieldCheck className="w-4 h-4 text-[var(--accent)]" />
                <span className="text-[var(--text-secondary)] text-xs font-semibold tracking-wide">{t('footer.certified')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-[var(--border)]/30 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col gap-1 items-center md:items-start">
            <p className="text-[var(--text-subtle)] text-xs font-medium">
              {t('footer.copyright', { year: currentYear.toString() })}
            </p>
            <a 
              href="https://13wsm13.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[var(--text-subtle)] hover:text-[var(--accent)] text-[10px] uppercase tracking-[0.2em] font-semibold transition-all duration-300 opacity-50 hover:opacity-100"
            >
              Developed by 13WSM13
            </a>
          </div>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2">
            <Link href="/privacy" className="text-[var(--text-subtle)] hover:text-[var(--text-primary)] text-xs font-medium transition-colors">
              {t('footer.privacy')}
            </Link>
            <Link href="/terms" className="text-[var(--text-subtle)] hover:text-[var(--text-primary)] text-xs font-medium transition-colors">
              {t('footer.terms')}
            </Link>
            <Link href="/return-policy" className="text-[var(--text-subtle)] hover:text-[var(--text-primary)] text-xs font-medium transition-colors">
              {t('footer.returnPolicy')}
            </Link>
            <button 
              onClick={() => setCookieSettingsOpen(true)}
              className="text-[var(--text-subtle)] hover:text-[var(--text-primary)] text-xs font-medium transition-colors cursor-pointer"
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
