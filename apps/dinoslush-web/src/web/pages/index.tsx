import { useState, useEffect, useRef } from 'react';
import { CoreButton } from '@wsm/ui';
import { Link } from 'wouter';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Toast from '../components/Toast';
import TelegramButton from '../components/TelegramButton';
import ProductCard from '../components/ProductCard';
import { products } from '../lib/store';
import { ScrollReveal } from '../components/animations';
import { useTranslation } from '../lib/i18n';
import { SEO, useSEOConfig } from '../components/SEO';
import { ActivityLeaderboard } from '../components/ActivityLeaderboard';
import { motion, AnimatePresence } from 'framer-motion';
import { RoiCalculator } from '../components/RoiCalculator';

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
        <LiveActivity />
      <main>
        <HeroSection />
        <ProductsPreview />
        <RoiCalculator />
        <UsageScenarios />
        <Testimonials />
        <section className="py-24 bg-[var(--bg-primary)] border-t border-[var(--border)] relative overflow-hidden">
          {/* subtle background effect matching the page design */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--accent)]/5 to-[var(--bg-tertiary)]" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <ActivityLeaderboard />
          </div>
        </section>
        <TrustAndQuality />
        <InstagramFeed />
      </main>
      <Footer />
      <TelegramButton />
      <Toast />
    </div>
  );
};

const Bubble = ({ customDelay, size }: { customDelay: number, size: number }) => {
  const [popped, setPopped] = useState(false);

  if (popped) return null;

  return (
    <motion.div
      initial={{ y: '100vh', opacity: 0, x: Math.random() * 200 - 100 }}
      animate={{ 
        y: '-100vh', 
        opacity: [0, 1, 1, 0],
        x: Math.random() * 200 - 100 + (Math.random() > 0.5 ? 200 : -200)
      }}
      transition={{ 
        duration: 8 + Math.random() * 5, 
        delay: customDelay,
        repeat: Infinity,
        ease: "linear"
      }}
      onMouseEnter={() => setPopped(true)}
      className="absolute cursor-pointer rounded-full border-4 shadow-[4px_4px_0_var(--accent)]"
      style={{
        width: size,
        height: size,
        left: `${Math.random() * 100}%`,
        background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8) 0%, rgba(0,255,170,0.5) 40%, transparent 100%)',
        borderColor: 'var(--border)'
      }}
    >
      <div className="absolute top-[15%] left-[15%] w-[25%] h-[25%] bg-white rounded-full opacity-60 pointer-events-none" />
    </motion.div>
  );
};

const HeroSection = () => {
  const [parallaxY, setParallaxY] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const { t } = useTranslation();

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
        className="absolute inset-0 z-0 bg-gradient-to-b from-[#150050] to-[#0B0033]"
        style={{ transform: `translateY(${parallaxY * 0.2}px)` }}
      >
        <div className="absolute inset-0 tea-pattern opacity-60 mix-blend-color-dodge" />
        
        {/* Animated Bubbles Canvas */}
        <div className="absolute inset-0 overflow-hidden pointer-events-auto">
          {[...Array(20)].map((_, i) => (
            <Bubble key={i} customDelay={i * 0.5} size={40 + Math.random() * 80} />
          ))}
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="text-center lg:text-left">
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="inline-block px-6 py-2 bg-[var(--accent)] border-2 border-[var(--border)] rounded-full mb-6 relative shadow-[4px_4px_0_var(--secondary)]"
            >
              <span className="text-[var(--bg-primary)] text-sm font-bold uppercase tracking-wider">
                🌟 Занурся у Смак
              </span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="text-6xl sm:text-7xl lg:text-8xl text-white font-black leading-[1.1] mb-6 uppercase tracking-tight"
              style={{ textShadow: '4px 4px 0 var(--accent), 8px 8px 0 var(--secondary)' }}
            >
              Колір<br/>
              <span className="text-[var(--tea-gold)]" style={{ textShadow: '4px 4px 0 var(--border), 8px 8px 0 var(--accent)' }}>Дитинства</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="text-2xl text-[var(--secondary)] font-bold mb-8 max-w-xl mx-auto lg:mx-0 bg-[var(--bg-primary)]/50 p-4 border-l-4 border-[var(--accent)] backdrop-blur-sm"
            >
              Максимальний драйв та соковиті бульбашки для твого бізнесу та настрою.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start mt-10"
            >
              <Link 
                href="/products"
                className="btn-primary text-lg"
              >
                Вибух Смаку!
              </Link>
              <Link 
                href="/b2b"
                className="btn-secondary text-lg"
              >
                B2B Калькулятор
              </Link>
            </motion.div>
          </div>

          {/* Right - Product / Slush Machine Prop */}
          <motion.div 
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 100, delay: 0.3 }}
            className="relative flex items-center justify-center min-h-[500px]"
            style={{ transform: `translateY(${-parallaxY * 0.15}px)` }}
          >
            {/* Pop-art radial sunburst background behind product */}
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              className="absolute w-[800px] h-[800px] -z-10 opacity-30 mix-blend-screen pointer-events-none"
              style={{
                background: 'conic-gradient(var(--accent) 0deg 15deg, transparent 15deg 30deg, var(--secondary) 30deg 45deg, transparent 45deg 60deg, var(--tea-gold) 60deg 75deg, transparent 75deg 90deg, var(--accent) 90deg 105deg, transparent 105deg 120deg, var(--secondary) 120deg 135deg, transparent 135deg 150deg, var(--tea-gold) 150deg 165deg, transparent 165deg 180deg, var(--accent) 180deg 195deg, transparent 195deg 210deg, var(--secondary) 210deg 225deg, transparent 225deg 240deg, var(--tea-gold) 240deg 255deg, transparent 255deg 270deg, var(--accent) 270deg 285deg, transparent 285deg 300deg, var(--secondary) 300deg 315deg, transparent 315deg 330deg, var(--tea-gold) 330deg 345deg, transparent 345deg 360deg)'
              }}
            />

            {/* Product image with floating animation */}
            <motion.div 
              animate={{ y: [0, -20, 0], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative w-64 h-64 sm:w-96 sm:h-96 z-10"
            >
              <div 
                className="absolute inset-0 bg-[var(--bg-primary)] border-4 border-[var(--border)] rounded-full shadow-[10px_10px_0_var(--accent)] overflow-hidden flex items-center justify-center p-8"
              >
                 <img 
                  src="./puerh-tea-concentrate-premium.png"
                  alt="DinoSlush Cup"
                  className="w-full h-full object-contain relative z-10"
                  style={{ filter: 'drop-shadow(5px 5px 0px var(--secondary))' }}
                />
              </div>

              {/* Pop-art badges overlaying the image */}
              <motion.div 
                whileHover={{ scale: 1.2, rotate: 10 }}
                className="absolute -top-10 -right-10 bg-[var(--tea-gold)] border-4 border-white text-[var(--bg-primary)] px-6 py-4 rounded-full font-black text-xl shadow-[6px_6px_0_var(--accent)] rotate-12 z-20"
              >
                POP!
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.2, rotate: -10 }}
                className="absolute -bottom-5 -left-5 bg-[var(--secondary)] border-4 border-white text-[var(--bg-primary)] px-6 py-4 rounded-full font-black text-xl shadow-[6px_6px_0_var(--tea-gold)] -rotate-12 z-20"
              >
                ZERO SUGAR
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
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
