import { useState, useEffect, useRef } from 'react';
import { CoreButton } from '@wsm/ui';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Toast from '../components/Toast';
import TelegramButton from '../components/TelegramButton';
import ProductCard from '../components/ProductCard';
import { products } from '../lib/store';
import { ScrollReveal, SteamParticles } from '../components/animations';
import { useTranslation } from '../lib/i18n';
import { SEO, useSEOConfig } from '../components/SEO';
import { MagneticButton } from '../components/scrollytelling/MagneticButton';
import { ScrollVideoScrubber } from '../components/scrollytelling/ScrollVideoScrubber';

const Home = () => {
  const seoConfig = useSEOConfig('home');
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] page-transition">
      <SEO 
        title={seoConfig.title}
        description={seoConfig.description}
        breadcrumbs={[
          { name: t('nav.home'), url: '/' }
        ]}
      />
      <Header />
      <main>
        <HeroSection />
        <ProductsPreview />
        <HowItWorks />
        <UsageScenarios />
        <Testimonials />
        <TrustAndQuality />
      </main>
      <Footer />
      <TelegramButton />
      <Toast />
    </div>
  );
};

const HeroSection = () => {
  const [parallaxY, setParallaxY] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const { t } = useTranslation();

  // Static badge for MVP
  // Timer state for visual completion effects (0 for demo of completion ping)
  const circumference = 2 * Math.PI * 45;
  const progress = 0; // Full circle
  const [seconds, setSeconds] = useState(15);

  useEffect(() => {
    if (seconds <= 0) return;
    const t = setInterval(() => setSeconds(s => s - 1), 1000);
    return () => clearInterval(t);
  }, [seconds]);

  // Parallax effect
  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        if (rect.bottom > 0) {
          setParallaxY(window.scrollY * 0.3);
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section ref={sectionRef} className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Video Background Placeholder with parallax */}
      <div 
        className="absolute inset-0"
        style={{ 
          background: 'var(--gradient-hero)',
          transform: `translateY(${parallaxY * 0.2}px)` 
        }}
      >
        <div className="absolute inset-0 tea-pattern opacity-50" />
        <div 
          className="absolute inset-0" 
          style={{ background: 'radial-gradient(ellipse at center, transparent 0%, var(--bg-primary) 70%)' }}
        />
      </div>

      {/* Animated particles with parallax */}
      <div 
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{ transform: `translateY(${parallaxY * 0.1}px)` }}
      >
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
              width: `${2 + Math.random() * 4}px`,
              height: `${2 + Math.random() * 4}px`,
              background: i % 3 === 0 
                ? 'radial-gradient(circle, rgba(159, 211, 86, 0.4) 0%, transparent 70%)'
                : i % 3 === 1
                ? 'radial-gradient(circle, rgba(201, 165, 92, 0.3) 0%, transparent 70%)'
                : 'radial-gradient(circle, rgba(139, 115, 85, 0.3) 0%, transparent 70%)'
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="text-center lg:text-left">
            <div className="inline-block px-4 py-2 bg-[var(--accent-subtle)] rounded-full mb-6 animate-fade-in-up">
              <span className="text-[var(--accent)] text-sm font-medium">
                {t('hero.badge')}
              </span>
            </div>
            
            <h1 
              className="text-5xl sm:text-6xl lg:text-7xl text-[var(--text-primary)] leading-[1.1] mb-6 animate-fade-in-up animation-delay-100"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {t('hero.title')}{' '}
              <span className="gradient-text">"Енергія за 15 секунд"</span>
            </h1>
            
            <p className="text-xl text-[var(--text-secondary)] mb-8 max-w-xl mx-auto lg:mx-0 animate-fade-in-up animation-delay-200">
              {t('hero.description')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in-up animation-delay-300">
              <MagneticButton pullStrength={40}>
                <Link 
                  href="/products"
                  className="group relative px-8 py-4 bg-[var(--accent)] text-[var(--bg-primary)] font-semibold rounded-xl hover:bg-[var(--accent-hover)] transition-all hover:shadow-lg hover:shadow-[var(--accent)]/30 active:scale-95 overflow-hidden block w-full text-center"
                >
                  <span className="relative z-10">{t('hero.cta')}</span>
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-500 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                </Link>
              </MagneticButton>
              <MagneticButton pullStrength={20}>
                <Link 
                  href="/b2b"
                  className="px-8 py-4 bg-transparent text-[var(--text-primary)] font-semibold rounded-xl border border-[var(--border-hover)] hover:bg-[var(--theme-toggle-bg)] transition-all block w-full text-center"
                >
                  {t('hero.ctaB2B')}
                </Link>
              </MagneticButton>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-12 pt-12 border-t border-[var(--border)] animate-fade-in-up animation-delay-400">
              <div>
                <p className="text-3xl sm:text-4xl font-bold text-[var(--accent)]" style={{ fontFamily: 'var(--font-heading)' }}>15s</p>
                <p className="text-[var(--text-muted)] text-sm mt-1">{t('hero.stats.time')}</p>
              </div>
              <div>
                <p className="text-3xl sm:text-4xl font-bold text-[var(--accent)]" style={{ fontFamily: 'var(--font-heading)' }}>100%</p>
                <p className="text-[var(--text-muted)] text-sm mt-1">{t('hero.stats.natural')}</p>
              </div>
              <div>
                <p className="text-3xl sm:text-4xl font-bold text-[var(--accent)]" style={{ fontFamily: 'var(--font-heading)' }}>34</p>
                <p className="text-[var(--text-muted)] text-sm mt-1">{t('hero.stats.portions')}</p>
              </div>
            </div>
          </div>

          {/* Right - BIG Timer & Product */}
          <div 
            className="relative flex items-center justify-center animate-fade-in-up animation-delay-200"
            style={{ transform: `translateY(${-parallaxY * 0.1}px)` }}
          >
            {/* Large animated background removed for clarity */}

            {/* Timer Ring (Organic & Minimalist Redesign) */}
            <div className="absolute w-72 h-72 sm:w-80 sm:h-80 z-20 pointer-events-none">
              <svg className="w-full h-full -rotate-90 filter drop-shadow-[0_0_20px_rgba(159,211,86,0.3)]">
                <defs>
                  <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#9FD356" />
                    <stop offset="50%" stopColor="#C9A55C" />
                    <stop offset="100%" stopColor="#9FD356" />
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                {/* Single minimalist track */}
                <circle
                  cx="50%"
                  cy="50%"
                  r="48%"
                  stroke="rgba(159, 211, 86, 0.05)"
                  strokeWidth="2"
                  fill="none"
                />
                {/* Organic pulsing glow ring */}
                <circle
                  cx="50%"
                  cy="50%"
                  r="48%"
                  stroke="url(#timerGradient)"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference - progress}
                  className="transition-all duration-1000 ease-linear"
                  filter="url(#glow)"
                />
              </svg>
            </div>

            {/* Timer display badge */}
            <div className="absolute top-4 sm:top-8 left-1/2 -translate-x-1/2 bg-[var(--bg-secondary)]/90 backdrop-blur-md px-6 py-3 rounded-full border border-[var(--border-accent)] glow-effect z-30">
              <span className="text-[var(--accent)] text-2xl font-bold tabular-nums" style={{ fontFamily: 'var(--font-heading)' }}>
                00:{seconds.toString().padStart(2, '0')}
              </span>
            </div>

            {/* Product image with steam */}
            <div className="relative w-56 h-56 sm:w-72 sm:h-72 animate-float">
              {/* Steam particles rising from the bottle */}
              <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-40 h-40 pointer-events-none">
                <SteamParticles count={8} />
              </div>
              
              <img 
                src="./puerh-tea-concentrate-premium.png"
                alt="BoosterTea PU-ERH"
                className="w-full h-full object-contain drop-shadow-2xl relative z-10"
                style={{
                  filter: 'drop-shadow(0 20px 40px rgba(0, 0, 0, 0.4))'
                }}
              />
              
              {/* Reflection glow beneath */}
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-gradient-to-t from-transparent via-[var(--accent)]/10 to-transparent rounded-full blur-xl" />
            </div>

            {/* Floating badges with enhanced styling */}
            <div className="absolute -left-4 top-1/3 bg-[var(--bg-secondary)]/90 backdrop-blur-md border border-[var(--border)] rounded-xl px-4 py-2 animate-fade-in-up animation-delay-400 hover:border-[var(--border-accent)] transition-colors">
              <p className="text-[var(--accent)] text-sm font-medium">{t('hero.organic')}</p>
            </div>
            <div className="absolute -right-4 bottom-1/3 bg-[var(--bg-secondary)]/90 backdrop-blur-md border border-[var(--border)] rounded-xl px-4 py-2 animate-fade-in-up animation-delay-500 hover:border-[var(--tea-gold)]/30 transition-colors">
              <p className="text-[var(--tea-gold)] text-sm font-medium">{t('hero.energy')}</p>
            </div>

            {/* Completion burst when timer hits 0 */}
            {seconds === 0 && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-full h-full rounded-full bg-[var(--accent)]/20 animate-ping" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-[var(--text-muted)] flex justify-center pt-2">
          <div className="w-1 h-2 bg-[var(--text-muted)] rounded-full animate-pulse" />
        </div>
        <p className="text-[var(--text-subtle)] text-xs mt-2 text-center">{t('hero.scroll')}</p>
      </div>
    </section>
  );
};

const ScrollytellingShowcase = () => {
  const { t } = useTranslation();
  return (
    <section className="py-24 bg-black relative">
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg-primary)] to-transparent opacity-80 z-0 h-32" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center mb-8">
        <h2 
          className="text-4xl sm:text-5xl text-white mb-4"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Магія <span className="text-[#9FD356]">Екстракції</span>
        </h2>
        <p className="text-white/60 text-lg max-w-2xl mx-auto">
          Скрольте вниз, щоб керувати часом і побачити, як народжується концентрат в 8K деталізації.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 z-20 relative">
        <ScrollVideoScrubber 
          src="/videos/8k-extraction.webm"
          durationSeconds={12}
          playbackRate={1.5}
          className="w-full aspect-video rounded-3xl overflow-hidden border border-white/10"
        />
      </div>
    </section>
  );
};

const ProductsPreview = () => {
  const { t } = useTranslation();
  return (
    <section className="py-24 bg-[var(--bg-primary)] relative">
      <div className="absolute inset-0" style={{ background: 'var(--gradient-section)' }} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 
              className="text-4xl sm:text-5xl text-[var(--text-primary)] mb-4"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {t('products.collectionTitle')} <span className="gradient-text">{t('products.collectionAccent')}</span>
            </h2>
            <p className="text-[var(--text-muted)] text-lg max-w-2xl mx-auto">
              {t('products.collectionSubtitle')}
            </p>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <ScrollReveal key={product.id} delay={index * 100}>
              <ProductCard product={product} index={index} />
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={400}>
          <div className="text-center mt-12">
            <Link 
              href="/products"
              className="group inline-flex items-center gap-2 text-[var(--accent)] hover:text-[var(--accent-hover)] font-medium transition-colors"
            >
              {t('products.viewAll')}
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

const HowItWorks = () => {
  const { t } = useTranslation();
  const steps = [
    {
      number: '01',
      titleKey: 'howItWorks.steps.step1.title',
      descriptionKey: 'howItWorks.steps.step1.description',
      icon: '🧪'
    },
    {
      number: '02',
      titleKey: 'howItWorks.steps.step2.title',
      descriptionKey: 'howItWorks.steps.step2.description',
      icon: '💧'
    },
    {
      number: '03',
      titleKey: 'howItWorks.steps.step3.title',
      descriptionKey: 'howItWorks.steps.step3.description',
      icon: '🥄'
    },
    {
      number: '04',
      titleKey: 'howItWorks.steps.step4.title',
      descriptionKey: 'howItWorks.steps.step4.description',
      icon: '☕'
    }
  ];

  return (
    <section className="py-24 bg-[var(--bg-tertiary)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 
              className="text-4xl sm:text-5xl text-[var(--text-primary)] mb-4"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {t('howItWorks.title')} <span className="gradient-text">{t('howItWorks.titleAccent')}</span>
            </h2>
            <p className="text-[var(--text-primary)]/var(--text-muted) text-lg max-w-2xl mx-auto">
              {t('howItWorks.subtitle')}
            </p>
          </div>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <ScrollReveal key={index} delay={index * 150}>
              <div className="relative group">
                {/* Connection line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-[60%] w-full h-px bg-gradient-to-r from-[#9FD356]/var(--text-muted) to-transparent" />
                )}
                
                <div className="relative bg-[var(--bg-secondary)] rounded-2xl p-8 border border-[var(--card-border)] hover:border-[var(--border-accent)] transition-all duration-300 hover:translate-y-[-8px] hover:shadow-xl hover:shadow-black/30">
                  {/* Number */}
                  <div className="absolute -top-4 -right-4 w-12 h-12 bg-[var(--accent)] rounded-full flex items-center justify-center text-[#0D0D0D] font-bold text-lg group-hover:scale-110 transition-transform">
                    {step.number}
                  </div>
                  
                  {/* Icon */}
                  <div className="text-5xl mb-6 group-hover:scale-110 transition-transform">{step.icon}</div>
                  
                  <h3 
                    className="text-2xl text-[var(--text-primary)] mb-3"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {t(step.titleKey)}
                  </h3>
                  
                  <p className="text-[var(--text-primary)]/var(--text-muted) text-sm leading-relaxed">
                    {t(step.descriptionKey)}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

const UsageScenarios = () => {
  const { t } = useTranslation();
  const scenarios = [
    {
      titleKey: 'scenarios.morning.title',
      descriptionKey: 'scenarios.morning.description',
      icon: '☀️',
      tea: 'PU-ERH',
      color: '#9FD356'
    },
    {
      titleKey: 'scenarios.evening.title',
      descriptionKey: 'scenarios.evening.description',
      icon: '🌙',
      tea: 'GABA',
      color: '#8B7355'
    },
    {
      titleKey: 'scenarios.student.title',
      descriptionKey: 'scenarios.student.description',
      icon: '📚',
      tea: 'DA HONG PAO',
      color: '#C9A55C'
    },
    {
      titleKey: 'scenarios.driver.title',
      descriptionKey: 'scenarios.driver.description',
      icon: '🚗',
      tea: 'PU-ERH',
      color: '#9FD356'
    }
  ];

  return (
    <section className="py-24 bg-[var(--bg-primary)] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--accent)]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#8B7355]/5 rounded-full blur-3xl" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <h2 
            className="text-4xl sm:text-5xl text-[var(--text-primary)] mb-4"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {t('scenarios.title')} <span className="gradient-text">{t('scenarios.titleAccent')}</span>
          </h2>
          <p className="text-[var(--text-primary)]/var(--text-muted) text-lg max-w-2xl mx-auto">
            {t('scenarios.subtitle')}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {scenarios.map((scenario, index) => (
            <div 
              key={index}
              className="group relative bg-gradient-to-br from-[#1A1A1A] to-[#141414] rounded-2xl p-8 border border-[var(--card-border)] hover:border-[#F5F0E8]/20 transition-all duration-300 overflow-hidden"
            >
              {/* Glow effect */}
              <div 
                className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-500"
                style={{ backgroundColor: scenario.color }}
              />
              
              <div className="relative flex items-start gap-6">
                <div className="text-5xl shrink-0">{scenario.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 
                      className="text-2xl text-[var(--text-primary)]"
                      style={{ fontFamily: 'var(--font-heading)' }}
                    >
                      {t(scenario.titleKey)}
                    </h3>
                    <span 
                      className="px-2 py-1 text-xs font-medium rounded"
                      style={{ 
                        backgroundColor: `${scenario.color}20`,
                        color: scenario.color 
                      }}
                    >
                      {scenario.tea}
                    </span>
                  </div>
                  <p className="text-[var(--text-primary)]/var(--text-muted)">
                    {t(scenario.descriptionKey)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Testimonials = () => {
  const { t } = useTranslation();
  const testimonials = [
    {
      nameKey: 'testimonials.reviews.review1.name',
      roleKey: 'testimonials.reviews.review1.role',
      textKey: 'testimonials.reviews.review1.text',
      avatar: '👩‍💼'
    },
    {
      nameKey: 'testimonials.reviews.review2.name',
      roleKey: 'testimonials.reviews.review2.role',
      textKey: 'testimonials.reviews.review2.text',
      avatar: '👨‍🎨'
    },
    {
      nameKey: 'testimonials.reviews.review3.name',
      roleKey: 'testimonials.reviews.review3.role',
      textKey: 'testimonials.reviews.review3.text',
      avatar: '👩‍🎓'
    }
  ];

  return (
    <section className="py-24 bg-[var(--bg-tertiary)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 
            className="text-4xl sm:text-5xl text-[var(--text-primary)] mb-4"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {t('testimonials.title')} <span className="gradient-text">{t('testimonials.titleAccent')}</span>
          </h2>
          <p className="text-[var(--text-primary)]/var(--text-muted) text-lg max-w-2xl mx-auto">
            {t('testimonials.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-[var(--bg-secondary)] rounded-2xl p-8 border border-[var(--card-border)] hover:border-[#9FD356]/20 transition-all duration-300"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-[#C9A55C]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              
              <p className="text-[var(--text-primary)]/80 text-lg mb-6 leading-relaxed">
                "{t(testimonial.textKey)}"
              </p>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#F5F0E8]/10 flex items-center justify-center text-2xl">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="text-[var(--text-primary)] font-medium">{t(testimonial.nameKey)}</p>
                  <p className="text-[var(--text-primary)]/var(--text-muted) text-sm">{t(testimonial.roleKey)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const TrustAndQuality = () => {
  const { t } = useTranslation();
  
  const certifications = [
    {
      id: 'haccp',
      titleKey: 'trust.haccp.title',
      badge: 'HACCP',
      icon: (
        <svg className="w-8 h-8 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      color: '#9FD356'
    },
    {
      id: 'iso',
      titleKey: 'trust.iso.title',
      badge: 'ISO 22000',
      icon: (
        <svg className="w-8 h-8 text-[#C9A55C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      ),
      color: '#C9A55C'
    },
    {
      id: 'lab',
      titleKey: 'trust.lab.title',
      badge: t('trust.lab.badge'),
      icon: (
        <svg className="w-8 h-8 text-[#8B7355]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      ),
      color: '#8B7355'
    },
    {
      id: 'natural',
      titleKey: 'trust.natural.title',
      badge: '100%',
      icon: (
        <svg className="w-8 h-8 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: '#9FD356'
    },
    {
      id: 'ukraine',
      titleKey: 'trust.ukraine.title',
      badge: '🇺🇦',
      icon: (
        <span className="text-3xl">🇺🇦</span>
      ),
      color: '#0057B8'
    }
  ];

  return (
    <section className="py-24 bg-[var(--bg-primary)] relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--accent)]/5 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <ScrollReveal>
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--accent-subtle)] rounded-full mb-6">
              <svg className="w-5 h-5 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className="text-[var(--accent)] text-sm font-medium">{t('trust.badge')}</span>
            </div>
            
            <h2 
              className="text-4xl sm:text-5xl text-[var(--text-primary)] mb-4"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {t('trust.title')} <span className="gradient-text">{t('trust.titleAccent')}</span>
            </h2>
            <p className="text-[var(--text-muted)] text-lg max-w-2xl mx-auto">
              {t('trust.subtitle')}
            </p>
          </div>
        </ScrollReveal>

        {/* Certification badges */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 mb-12">
          {certifications.map((cert, index) => (
            <ScrollReveal key={cert.id} delay={index * 100}>
              <div className="bg-[var(--bg-secondary)] rounded-2xl p-6 border border-[var(--card-border)] hover:border-[var(--border-accent)] transition-all duration-300 text-center group">
                <div className="w-16 h-16 mx-auto mb-4 bg-[var(--bg-tertiary)] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  {cert.icon}
                </div>
                <div 
                  className="inline-block px-3 py-1 text-xs font-bold rounded-full mb-2"
                  style={{ backgroundColor: `${cert.color}20`, color: cert.color }}
                >
                  {cert.badge}
                </div>
                <p className="text-[var(--text-primary)] text-sm font-medium">
                  {t(cert.titleKey)}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Call to action */}
        <ScrollReveal delay={500}>
          <div className="text-center">
            <Link 
              href="/certificates"
              className="inline-flex items-center gap-2 text-[var(--accent)] hover:text-[var(--accent-hover)] font-medium transition-colors group"
            >
              {t('trust.viewCertificates')}
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

const InstagramFeed = () => {
  const { t } = useTranslation();
  const posts = [
    { id: 1, gradient: 'from-[#8B7355] to-[#3D2E1F]' },
    { id: 2, gradient: 'from-[#9FD356] to-[#7FB030]' },
    { id: 3, gradient: 'from-[#C9A55C] to-[#8B7355]' },
    { id: 4, gradient: 'from-[#1A1A1A] to-[#0D0D0D]' },
    { id: 5, gradient: 'from-[#9FD356] to-[#C9A55C]' },
    { id: 6, gradient: 'from-[#3D2E1F] to-[#8B7355]' },
  ];

  return (
    <section className="py-24 bg-[var(--bg-primary)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 
            className="text-4xl sm:text-5xl text-[var(--text-primary)] mb-4"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {t('instagram.title')} <span className="gradient-text">{t('instagram.titleAccent')}</span>
          </h2>
          <a 
            href="https://instagram.com/booster_tea_ua"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
          >
            @booster_tea_ua
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {posts.map((post) => (
            <a
              key={post.id}
              href="https://instagram.com/booster_tea_ua"
              target="_blank"
              rel="noopener noreferrer"
              className={`aspect-square rounded-xl bg-gradient-to-br ${post.gradient} group relative overflow-hidden`}
            >
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Home;

const LiveActivity = () => {
  const [active, setActive] = useState(false);
  const [data, setData] = useState({ name: 'Максим', city: 'Львів' });
  const names = ['Ігор', 'Анна', 'Дмитро', 'Олена', 'Сергій'];
  const cities = ['Київ', 'Одеса', 'Харків', 'Дніпро', 'Львів'];

  useEffect(() => {
    const timer = setInterval(() => {
      setData({
        name: names[Math.floor(Math.random() * names.length)],
        city: cities[Math.floor(Math.random() * cities.length)]
      });
      setActive(true);
      setTimeout(() => setActive(false), 5000);
    }, 20000);
    return () => clearInterval(timer);
  }, []);

  if (!active) return null;
  return (
    <div className="fixed bottom-24 left-4 z-50 bg-[var(--bg-secondary)] border border-[var(--accent)]/30 p-3 rounded-xl shadow-2xl animate-fadeIn flex items-center gap-3">
      <div className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
      <p className="text-xs text-[var(--text-primary)]">
        <span className="font-bold">{data.name}</span> з м. {data.city} <br/>щойно замовив <span className="text-[var(--accent)] font-bold">BoosterTea 1L</span>
      </p>
    </div>
  );
};
