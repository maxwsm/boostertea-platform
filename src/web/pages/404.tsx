import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useTranslation } from '../lib/i18n';
import { SEO, useSEOConfig } from '../components/SEO';

const NotFound = () => {
  const [isSpilled, setIsSpilled] = useState(false);
  const { t } = useTranslation();
  const seoConfig = useSEOConfig('notFound');

  useEffect(() => {
    // Trigger spill animation after mount
    const timer = setTimeout(() => setIsSpilled(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center px-4 page-transition">
      <SEO 
        title={seoConfig.title}
        description={seoConfig.description}
        noIndex={true}
      />
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[var(--accent)]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-[#8B7355]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 text-center max-w-2xl mx-auto">
        {/* Spilled Tea Cup Animation */}
        <div className="relative w-64 h-64 mx-auto mb-8">
          {/* Tea cup */}
          <div 
            className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-transform duration-1000 ease-out ${isSpilled ? 'tea-cup-spill' : ''}`}
            style={{ transformOrigin: 'bottom right' }}
          >
            {/* Cup body */}
            <div className="relative w-32 h-28">
              {/* Cup */}
              <svg viewBox="0 0 120 100" className="w-full h-full">
                <defs>
                  <linearGradient id="cupGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#2A2A2A" />
                    <stop offset="100%" stopColor="#1A1A1A" />
                  </linearGradient>
                </defs>
                {/* Cup body */}
                <path 
                  d="M20 20 L25 90 C25 95 30 100 50 100 L70 100 C90 100 95 95 95 90 L100 20 Z" 
                  fill="url(#cupGradient)" 
                  stroke="#3A3A3A" 
                  strokeWidth="2"
                />
                {/* Cup handle */}
                <path 
                  d="M100 30 Q120 30 120 55 Q120 80 100 80" 
                  fill="none" 
                  stroke="#3A3A3A" 
                  strokeWidth="6"
                />
                {/* Tea inside */}
                <path 
                  d="M28 35 L32 85 C32 88 38 92 55 92 L65 92 C82 92 88 88 88 85 L92 35 Z" 
                  fill="#9FD356" 
                  opacity="0.8"
                />
                {/* Shine */}
                <path 
                  d="M35 40 L37 75" 
                  stroke="rgba(255,255,255,0.1)" 
                  strokeWidth="3" 
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>

          {/* Spilled tea liquid */}
          <div 
            className={`absolute left-1/2 top-1/2 -translate-x-1/4 translate-y-8 transition-all duration-1000 ${isSpilled ? 'opacity-100' : 'opacity-0'}`}
          >
            <svg viewBox="0 0 200 100" className="w-48 h-24">
              <defs>
                <linearGradient id="spillGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#9FD356" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#7FB030" stopOpacity="0.4" />
                </linearGradient>
              </defs>
              <ellipse 
                cx="100" 
                cy="50" 
                rx={isSpilled ? '90' : '10'} 
                ry={isSpilled ? '40' : '5'} 
                fill="url(#spillGradient)"
                className="transition-all duration-1000 ease-out"
                style={{ transitionDelay: '0.5s' }}
              />
              {/* Splash droplets */}
              {isSpilled && (
                <>
                  <circle cx="30" cy="30" r="5" fill="#9FD356" opacity="0.6" className="animate-pulse" />
                  <circle cx="170" cy="40" r="4" fill="#9FD356" opacity="0.5" className="animate-pulse" />
                  <circle cx="50" cy="70" r="3" fill="#9FD356" opacity="0.4" className="animate-pulse" />
                  <circle cx="150" cy="60" r="4" fill="#9FD356" opacity="0.5" className="animate-pulse" />
                </>
              )}
            </svg>
          </div>

          {/* Sad steam */}
          <div className={`absolute left-1/2 -top-8 -translate-x-1/2 flex gap-2 transition-opacity duration-500 ${isSpilled ? 'opacity-0' : 'opacity-100'}`}>
            {[...Array(3)].map((_, i) => (
              <div 
                key={i}
                className="w-2 h-8 bg-gradient-to-t from-[#F5F0E8]/20 to-transparent rounded-full tea-loader-steam"
                style={{ animationDelay: `${i * 0.3}s` }}
              />
            ))}
          </div>
        </div>

        {/* 404 Text */}
        <h1 
          className="text-8xl sm:text-9xl font-bold gradient-text mb-4 animate-fade-in-up"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {t('404.title')}
        </h1>

        <h2 
          className="text-3xl sm:text-4xl text-[var(--text-primary)] mb-4 animate-fade-in-up animation-delay-100"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {t('404.subtitle')}
        </h2>

        <p className="text-[var(--text-primary)]/var(--text-muted) text-lg mb-8 max-w-md mx-auto animate-fade-in-up animation-delay-200">
          {t('404.description')}
        </p>

        {/* Witty Ukrainian messages */}
        <div className="bg-[var(--bg-secondary)]/var(--text-muted) rounded-2xl p-6 mb-8 border border-[var(--border)] animate-fade-in-up animation-delay-300">
          <p className="text-[#C9A55C] italic">
            {t('404.quote')}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animation-delay-400">
          <Link 
            href="/"
            className="group relative px-8 py-4 bg-[var(--accent)] text-[#0D0D0D] font-semibold rounded-xl hover:bg-[var(--accent-hover)] transition-all overflow-hidden"
          >
            <span className="relative z-10">{t('404.home')}</span>
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-500 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          </Link>
          <Link 
            href="/products"
            className="px-8 py-4 bg-transparent text-[var(--text-primary)] font-semibold rounded-xl border border-[#F5F0E8]/30 hover:bg-[#F5F0E8]/10 transition-all"
          >
            {t('404.products')}
          </Link>
        </div>

        {/* Fun suggestion */}
        <p className="text-[var(--text-primary)]/var(--text-subtle) text-sm mt-12 animate-fade-in-up animation-delay-500">
          {t('404.tip')}
          <Link href="/products" className="text-[var(--accent)] hover:underline ml-1">
            {t('404.tipLink')}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default NotFound;
