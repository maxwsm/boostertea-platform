import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Toast from '../components/Toast';
import TelegramButton from '../components/TelegramButton';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { ScrollReveal, AnimatedCounter } from '../components/animations';
import { SEO, useSEOConfig, generateFAQSchema } from '../components/SEO';
import { useTranslation } from '../lib/i18n';

const B2B = () => {
  const seoConfig = useSEOConfig('b2b');
  const { t } = useTranslation();
  
  // B2B FAQ data for schema - these get translated
  const b2bFaqs = [
    {
      question: t('b2b.faq.q1'),
      answer: t('b2b.faq.a1')
    },
    {
      question: t('b2b.faq.q2'),
      answer: t('b2b.faq.a2')
    },
    {
      question: t('b2b.faq.q3'),
      answer: t('b2b.faq.a3')
    },
    {
      question: t('b2b.faq.q4'),
      answer: t('b2b.faq.a4')
    },
    {
      question: t('b2b.faq.q5'),
      answer: t('b2b.faq.a5')
    }
  ];
  
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] page-transition">
      <SEO 
        title={seoConfig.title}
        description={seoConfig.description}
        breadcrumbs={[
          { name: t('nav.home'), url: '/' },
          { name: t('nav.b2b'), url: '/b2b' }
        ]}
        faq={b2bFaqs}
      />
      <Header />
      <main>
        {/* Breadcrumbs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-4">
          <Breadcrumbs 
            items={[
              { label: t('nav.home'), href: '/' },
              { label: t('nav.b2b') }
            ]} 
          />
        </div>
        <HeroSection />
        <Benefits />
        <ProfitCalculator />
        <WholesalePricing />
        <PartnerMap />
        <CaseStudies />
        <CTASection />
      </main>
      <Footer />
      <TelegramButton />
      <Toast />
    </div>
  );
};

const HeroSection = () => {
  const { t } = useTranslation();
  
  return (
    <section className="pt-32 pb-20 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-[#9FD356]/10 via-transparent to-[#8B7355]/10" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-3xl">
          <div className="inline-block px-4 py-2 bg-[var(--accent)]/10 rounded-full mb-6 animate-fade-in-up">
            <span className="text-[var(--accent)] text-sm font-medium">
              {t('b2b.badge')}
            </span>
          </div>
          
          <h1 
            className="text-5xl sm:text-6xl lg:text-7xl text-[var(--text-primary)] leading-tight mb-6 animate-fade-in-up animation-delay-100"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {t('b2b.title')} <span className="gradient-text">{t('b2b.titleAccent')}</span>
          </h1>
          
          <p className="text-xl text-[var(--text-secondary)] mb-8 leading-relaxed animate-fade-in-up animation-delay-200">
            {t('b2b.description')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up animation-delay-300">
            <a 
              href="https://t.me/boostertea_b2b_bot"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative px-8 py-4 bg-[var(--accent)] text-[#0D0D0D] font-semibold rounded-xl hover:bg-[var(--accent-hover)] transition-all inline-flex items-center justify-center gap-2 overflow-hidden"
            >
              <svg className="w-5 h-5 relative z-10" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
              </svg>
              <span className="relative z-10">{t('b2b.cta')}</span>
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-500 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            </a>
            <a 
              href="#calculator"
              className="px-8 py-4 bg-transparent text-[var(--text-primary)] font-semibold rounded-xl border border-[#F5F0E8]/30 hover:bg-[#F5F0E8]/10 transition-all inline-flex items-center justify-center"
            >
              {t('b2b.ctaCalculator')}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

const Benefits = () => {
  const { t } = useTranslation();
  
  const benefits = [
    {
      icon: '⚡',
      titleKey: 'b2b.benefits.speed.title',
      descriptionKey: 'b2b.benefits.speed.description',
    },
    {
      icon: '📦',
      titleKey: 'b2b.benefits.simplicity.title',
      descriptionKey: 'b2b.benefits.simplicity.description',
    },
    {
      icon: '💰',
      titleKey: 'b2b.benefits.margin.title',
      descriptionKey: 'b2b.benefits.margin.description',
    },
    {
      icon: '♻️',
      titleKey: 'b2b.benefits.noWaste.title',
      descriptionKey: 'b2b.benefits.noWaste.description',
    },
    {
      icon: '🎯',
      titleKey: 'b2b.benefits.quality.title',
      descriptionKey: 'b2b.benefits.quality.description',
    },
    {
      icon: '📈',
      titleKey: 'b2b.benefits.support.title',
      descriptionKey: 'b2b.benefits.support.description',
    },
  ];

  return (
    <section className="py-24 bg-[var(--bg-tertiary)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 
            className="text-4xl sm:text-5xl text-[var(--text-primary)] mb-4"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {t('b2b.whyUs.title')} <span className="gradient-text">{t('b2b.whyUs.titleAccent')}</span>
          </h2>
          <p className="text-[var(--text-muted)] text-lg max-w-2xl mx-auto">
            {t('b2b.whyUs.subtitle')}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className="bg-[var(--bg-secondary)] rounded-2xl p-8 border border-[var(--card-border)] hover:border-[var(--border-accent)] transition-all duration-300 group"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                {benefit.icon}
              </div>
              <h3 
                className="text-xl text-[var(--text-primary)] mb-2"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {t(benefit.titleKey)}
              </h3>
              <p className="text-[var(--text-muted)] text-sm leading-relaxed">
                {t(benefit.descriptionKey)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ProfitCalculator = () => {
  const { t, language } = useTranslation();
  const [cupsPerDay, setCupsPerDay] = useState(30);
  const [sellingPrice, setSellingPrice] = useState(65);
  const [drinkType, setDrinkType] = useState<'hot' | 'cold' | 'mixed'>('mixed');
  const [pumps, setPumps] = useState<1 | 2>(1); // The Taidrink Syndicate Doctrine
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Seasonality coefficients by month (0-11)
  // Summer (May-Aug): higher cold drinks demand
  // Winter (Nov-Feb): higher hot drinks demand
  const seasonalityCoefficients = {
    hot: [1.3, 1.25, 1.1, 0.9, 0.7, 0.6, 0.55, 0.6, 0.75, 1.0, 1.2, 1.35],
    cold: [0.5, 0.55, 0.7, 0.9, 1.15, 1.35, 1.4, 1.35, 1.1, 0.8, 0.55, 0.45],
    mixed: [0.9, 0.9, 0.9, 0.9, 0.95, 1.0, 1.0, 1.0, 0.95, 0.9, 0.85, 0.85]
  };

  const monthNames = language === 'uk' 
    ? ['Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень', 'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень']
    : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const drinkTypeLabels = {
    hot: language === 'uk' ? 'Гарячі напої' : 'Hot drinks',
    cold: language === 'uk' ? 'Холодні напої' : 'Cold drinks',
    mixed: language === 'uk' ? 'Мікс (50/50)' : 'Mixed (50/50)'
  };

  const drinkTypeExamples = {
    hot: language === 'uk' ? 'Класичний чай, латте' : 'Classic tea, latte',
    cold: language === 'uk' ? 'Айс-ті, чай з вишневим соком' : 'Ice tea, tea with cherry juice',
    mixed: language === 'uk' ? 'Обидва варіанти' : 'Both options'
  };
  
  // Cost per cup: Wholesale 1L price is 250 UAH (1500 UAH per box of 6)
  const bottleWholesalePrice = 250;
  const portionsPerBottle = pumps === 1 ? 33 : 17; // 30ml vs 60ml
  const costPerCup = Math.round(bottleWholesalePrice / portionsPerBottle); 
  
  // Marketing Magic: 2 pumps is so good it drives up daily LTV by 45% naturally
  const loyaltyMultiplier = pumps === 2 ? 1.45 : 1.0;
  
  const seasonalCoef = seasonalityCoefficients[drinkType][currentMonth];
  const adjustedCupsPerDay = Math.round(cupsPerDay * seasonalCoef * loyaltyMultiplier);
  
  const profitPerCup = sellingPrice - costPerCup;
  const dailyProfit = profitPerCup * adjustedCupsPerDay;
  const monthlyProfit = dailyProfit * 30;
  const yearlyProfit = Array.from({ length: 12 }, (_, i) => {
    const monthCoef = seasonalityCoefficients[drinkType][i];
    return profitPerCup * Math.round(cupsPerDay * monthCoef * loyaltyMultiplier) * 30;
  }).reduce((a, b) => a + b, 0);
  const marginPercent = Math.round((profitPerCup / sellingPrice) * 100);

  // B2B marketing bonus: 20 cups per 1L
  const estimatedMonthlyBottles = Math.ceil((adjustedCupsPerDay * 30) / portionsPerBottle);
  const freeMarketingCups = estimatedMonthlyBottles * 20;

  return (
    <section ref={sectionRef} id="calculator" className="py-24 bg-[var(--bg-primary)] relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#9FD356]/5 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 
              className="text-4xl sm:text-5xl text-[var(--text-primary)] mb-4"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {t('b2b.calculator.title')} <span className="gradient-text">{t('b2b.calculator.titleAccent')}</span>
            </h2>
            <p className="text-[var(--text-muted)] text-lg max-w-2xl mx-auto">
              {t('b2b.calculator.subtitle')}
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <div className="max-w-5xl mx-auto">
            <div className="bg-[var(--bg-secondary)] rounded-3xl p-8 md:p-12 border border-[var(--border)] hover:border-[#9FD356]/20 transition-colors">
              <div className="grid md:grid-cols-2 gap-12">
                {/* Inputs */}
                <div className="space-y-8">
                  {/* Drink Type Selector */}
                  <div>
                    <label className="block text-[var(--text-primary)] text-lg mb-4">
                      {language === 'uk' ? 'Тип напоїв' : 'Drink type'}
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['hot', 'cold', 'mixed'] as const).map((type) => (
                        <button
                          key={type}
                          onClick={() => setDrinkType(type)}
                          className={`p-3 rounded-xl border-2 transition-all text-center ${
                            drinkType === type
                              ? 'border-[#6B8E4E] bg-[var(--accent)]/10'
                              : 'border-[var(--border)] hover:border-[#F5F0E8]/30'
                          }`}
                        >
                          <span className="text-2xl block mb-1">
                            {type === 'hot' ? '🔥' : type === 'cold' ? '🧊' : '☯️'}
                          </span>
                          <span className={`text-xs font-medium ${
                            drinkType === type ? 'text-[var(--accent)]' : 'text-[var(--text-primary)]'
                          }`}>
                            {drinkTypeLabels[type]}
                          </span>
                        </button>
                      ))}
                    </div>
                    <p className="text-[var(--text-primary)]/50 text-xs mt-2">
                      {drinkTypeExamples[drinkType]}
                    </p>
                  </div>

                  {/* Month/Season Selector */}
                  <div>
                    <label className="block text-[var(--text-primary)] text-lg mb-4">
                      {language === 'uk' ? 'Місяць розрахунку' : 'Calculation month'}: 
                      <span className="text-[var(--accent)] font-bold ml-2">{monthNames[currentMonth]}</span>
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="11"
                      value={currentMonth}
                      onChange={(e) => setCurrentMonth(Number(e.target.value))}
                      className="w-full h-2 bg-[#F5F0E8]/10 rounded-lg appearance-none cursor-pointer accent-[#9FD356]"
                    />
                    <div className="flex justify-between text-[var(--text-subtle)] text-xs mt-2">
                      <span>{language === 'uk' ? 'Січ' : 'Jan'}</span>
                      <span>{language === 'uk' ? 'Чер' : 'Jun'}</span>
                      <span>{language === 'uk' ? 'Гру' : 'Dec'}</span>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded ${
                        seasonalCoef >= 1 ? 'bg-[#6B8E4E]/20 text-[#6B8E4E]' : 'bg-[#E07B2D]/20 text-[#E07B2D]'
                      }`}>
                        {language === 'uk' ? 'Сезонність' : 'Seasonality'}: {seasonalCoef >= 1 ? '+' : ''}{Math.round((seasonalCoef - 1) * 100)}%
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[var(--text-primary)] text-lg mb-4">
                      {t('b2b.calculator.cupsPerDay')}: <span className="text-[var(--accent)] font-bold">{cupsPerDay}</span>
                      {(seasonalCoef !== 1 || loyaltyMultiplier !== 1) && (
                        <span className="text-[var(--text-muted)] text-sm ml-2">
                          → {adjustedCupsPerDay} {language === 'uk' ? '(фактично продані)' : '(actual sold)'}
                        </span>
                      )}
                    </label>
                    <input
                      type="range"
                      min="5"
                      max="200"
                      value={cupsPerDay}
                      onChange={(e) => setCupsPerDay(Number(e.target.value))}
                      className="w-full h-2 bg-[#F5F0E8]/10 rounded-lg appearance-none cursor-pointer accent-[#9FD356]"
                    />
                    <div className="flex justify-between text-[var(--text-subtle)] text-sm mt-2">
                      <span>5</span>
                      <span>200</span>
                    </div>
                  </div>

                  {/* The 2-Pump Doctrine Toggle */}
                  <div className="bg-[#1A1A1A] rounded-xl p-5 border border-[var(--border)] relative overflow-hidden group hover:border-[var(--accent)]/50 transition-all cursor-pointer" onClick={() => setPumps(pumps === 1 ? 2 : 1)}>
                    {pumps === 2 && <div className="absolute top-0 right-0 w-16 h-16 bg-red-500/20 blur-[20px] rounded-full pointer-events-none" />}
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-white font-bold mb-1 flex items-center gap-2">
                           Формула "Зубної Пасти" <span className="bg-red-500 text-black px-2 py-0.5 rounded text-[10px] uppercase font-black uppercase tracking-wider">Secret</span>
                        </p>
                        <p className="text-[var(--text-muted)] text-xs mb-3">Вибір дозування напряму впливає на LTV ваших гостей. Подвійна порція зрізає маржу на одиницю, але приносить шалений смак та X1.45 більше щоденних продажів.</p>
                      </div>
                      <div className={`shrink-0 w-12 h-6 rounded-full p-1 transition-colors ${pumps === 2 ? 'bg-red-500' : 'bg-zinc-700'}`}>
                        <div className={`w-4 h-4 bg-white rounded-full transition-transform ${pumps === 2 ? 'translate-x-6' : 'translate-x-0'}`} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                       <div className={`p-3 rounded-lg text-center border transition-all ${pumps === 1 ? 'border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]' : 'border-zinc-800 text-zinc-500'}`}>
                          <span className="block text-sm font-bold">1 Помпа</span>
                          <span className="text-[10px]">30мл / Висока Маржа</span>
                       </div>
                       <div className={`p-3 rounded-lg text-center border transition-all ${pumps === 2 ? 'border-red-500 bg-red-500/10 text-red-500 shadow-[0_0_15px_rgba(220,38,38,0.2)]' : 'border-zinc-800 text-zinc-500'}`}>
                          <span className="block text-sm font-bold">2 Помпи</span>
                          <span className="text-[10px]">60мл / Макс. Смак & Рітеншн</span>
                       </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[var(--text-primary)] text-lg mb-4">
                      {t('b2b.calculator.sellingPrice')}: <span className="text-[var(--accent)] font-bold">{sellingPrice}₴</span>
                    </label>
                    <input
                      type="range"
                      min="40"
                      max="150"
                      value={sellingPrice}
                      onChange={(e) => setSellingPrice(Number(e.target.value))}
                      className="w-full h-2 bg-[#F5F0E8]/10 rounded-lg appearance-none cursor-pointer accent-[#9FD356]"
                    />
                    <div className="flex justify-between text-[var(--text-subtle)] text-sm mt-2">
                      <span>40₴</span>
                      <span>150₴</span>
                    </div>
                  </div>

                  <div className="bg-[var(--bg-primary)] rounded-xl p-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[var(--text-muted)]">{t('b2b.calculator.costPerCup')}:</span>
                      <span className="text-[var(--text-primary)]">{costPerCup}₴</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[var(--text-muted)]">{t('b2b.calculator.profitPerCup')}:</span>
                      <span className="text-[var(--accent)] font-semibold">{profitPerCup}₴</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[var(--text-muted)]">{t('b2b.calculator.results.margin')}:</span>
                      <span className="text-[#C9A55C] font-semibold">{marginPercent}%</span>
                    </div>
                  </div>
                </div>

                {/* Results with animated counters */}
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-[#9FD356]/20 to-[#9FD356]/5 rounded-2xl p-6 border border-[var(--border-accent)] hover:border-[#9FD356]/50 transition-colors group">
                    <p className="text-[var(--text-muted)] text-sm mb-2">
                      {t('b2b.calculator.dailyProfit')} 
                      <span className="text-xs ml-1">({monthNames[currentMonth]})</span>
                    </p>
                    <p className="text-[var(--accent)] text-4xl font-bold transition-all group-hover:scale-105" style={{ fontFamily: 'var(--font-heading)' }}>
                      {isVisible ? (
                        <AnimatedCounter value={dailyProfit} suffix="₴" duration={1000} />
                      ) : '0₴'}
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-[#C9A55C]/20 to-[#C9A55C]/5 rounded-2xl p-6 border border-[#C9A55C]/30 hover:border-[#C9A55C]/50 transition-colors group">
                    <p className="text-[var(--text-muted)] text-sm mb-2">{t('b2b.calculator.results.monthlyProfit')}</p>
                    <p className="text-[#C9A55C] text-4xl font-bold transition-all group-hover:scale-105" style={{ fontFamily: 'var(--font-heading)' }}>
                      {isVisible ? (
                        <AnimatedCounter value={monthlyProfit} suffix="₴" duration={1500} />
                      ) : '0₴'}
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-[#8B7355]/20 to-[#8B7355]/5 rounded-2xl p-6 border border-[#8B7355]/30 hover:border-[#8B7355]/50 transition-colors group">
                    <p className="text-[var(--text-muted)] text-sm mb-2">{t('b2b.calculator.yearlyProfit')}</p>
                    <p className="text-[var(--secondary)] text-4xl font-bold transition-all group-hover:scale-105" style={{ fontFamily: 'var(--font-heading)' }}>
                      {isVisible ? (
                        <AnimatedCounter value={yearlyProfit} suffix="₴" duration={2000} />
                      ) : '0₴'}
                    </p>
                    <p className="text-[var(--text-primary)]/50 text-xs mt-1">
                      {language === 'uk' ? 'з урахуванням сезонності' : 'with seasonality'}
                    </p>
                  </div>

                  {/* B2B Marketing Gift */}
                  <div className="bg-[#E07B2D]/10 rounded-xl p-4 border border-[#E07B2D]/30">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🎁</span>
                      <div>
                        <p className="text-[#E07B2D] font-bold text-sm">
                          {language === 'uk' ? 'B2B бонус на місяць' : 'B2B monthly bonus'}
                        </p>
                        <p className="text-[var(--text-primary)] text-sm">
                          <span className="font-bold text-[#E07B2D]">~{freeMarketingCups}</span>{' '}
                          {language === 'uk' ? 'безкоштовних стаканчиків' : 'free branded cups'}
                        </p>
                        <p className="text-[var(--text-primary)]/50 text-xs">
                          {language === 'uk' ? '20 стаканчиків на кожен 1L' : '20 cups per each 1L'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Seasonality chart */}
                  <div className="bg-[var(--bg-primary)] rounded-xl p-4">
                    <p className="text-[var(--text-subtle)] text-xs mb-3">
                      {language === 'uk' ? 'Прогноз попиту по місяцях' : 'Demand forecast by month'}
                    </p>
                    <div className="flex items-end justify-between h-24 gap-1">
                      {Array.from({ length: 12 }, (_, i) => {
                        const monthCoef = seasonalityCoefficients[drinkType][i];
                        const heightPercent = (monthCoef / 1.4) * 100;
                        const isCurrentMonth = i === currentMonth;
                        return (
                          <div 
                            key={i}
                            className={`flex-1 rounded-t transition-all duration-500 ${
                              isCurrentMonth 
                                ? 'bg-[#E07B2D]' 
                                : 'bg-gradient-to-t from-[#9FD356] to-[#C9A55C]'
                            }`}
                            style={{ 
                              height: isVisible ? `${Math.min(heightPercent, 100)}%` : '0%',
                              opacity: isVisible ? (isCurrentMonth ? 1 : 0.6) : 0,
                              transitionDelay: `${i * 50}ms`
                            }}
                            title={`${monthNames[i]}: ${monthCoef >= 1 ? '+' : ''}${Math.round((monthCoef - 1) * 100)}%`}
                          />
                        );
                      })}
                    </div>
                    <div className="flex justify-between text-[var(--text-primary)]/30 text-[10px] mt-2">
                      <span>{language === 'uk' ? 'Січ' : 'Jan'}</span>
                      <span>{language === 'uk' ? 'Чер' : 'Jun'}</span>
                      <span>{language === 'uk' ? 'Гру' : 'Dec'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

const PartnerMap = () => {
  const { t } = useTranslation();
  
  const regions = [
    { nameKey: 'b2b.partners.regions.kyiv', partners: 12 },
    { nameKey: 'b2b.partners.regions.lviv', partners: 8 },
    { nameKey: 'b2b.partners.regions.odesa', partners: 5 },
    { nameKey: 'b2b.partners.regions.kharkiv', partners: 4 },
    { nameKey: 'b2b.partners.regions.dnipro', partners: 3 },
  ];

  return (
    <section className="py-24 bg-[var(--bg-tertiary)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 
            className="text-4xl sm:text-5xl text-[var(--text-primary)] mb-4"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {t('b2b.partners.title')} <span className="gradient-text">{t('b2b.partners.titleAccent')}</span>
          </h2>
          <p className="text-[var(--text-muted)] text-lg max-w-2xl mx-auto">
            {t('b2b.partners.description')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Map placeholder */}
          <div className="relative aspect-square bg-[var(--bg-secondary)] rounded-3xl overflow-hidden border border-[var(--border)]">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-4 bg-[var(--accent)]/20 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                <p className="text-[var(--text-muted)] text-lg">{t('b2b.partners.mapTitle')}</p>
                <p className="text-[var(--accent)] font-semibold mt-2">{t('b2b.partners.totalPartners')}</p>
              </div>
            </div>
            
            {/* Decorative dots for cities */}
            <div className="absolute top-1/4 left-1/2 w-3 h-3 bg-[var(--accent)] rounded-full animate-pulse" />
            <div className="absolute top-1/3 left-1/4 w-2 h-2 bg-[var(--accent)] rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
            <div className="absolute top-1/2 right-1/3 w-2 h-2 bg-[var(--accent)] rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-[var(--accent)] rounded-full animate-pulse" style={{ animationDelay: '1.5s' }} />
            <div className="absolute bottom-1/4 right-1/4 w-2 h-2 bg-[var(--accent)] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
          </div>

          {/* Region list */}
          <div className="space-y-4">
            {regions.map((region, index) => (
              <div 
                key={index}
                className="flex items-center justify-between bg-[var(--bg-secondary)] rounded-xl p-6 border border-[var(--card-border)] hover:border-[var(--border-accent)] transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[var(--accent)]/20 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <span className="text-[var(--text-primary)] text-lg font-medium">{t(region.nameKey)}</span>
                </div>
                <span className="text-[var(--accent)] font-bold">{region.partners} {t('b2b.partners.partnersCount')}</span>
              </div>
            ))}
            
            <div className="text-center pt-4">
              <a 
                href="https://t.me/boostertea_b2b_bot"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--accent)] hover:underline inline-flex items-center gap-2"
              >
                {t('b2b.partners.becomePartner')}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Wholesale Pricing Section - Redirected to Telegram
const WholesalePricing = () => {
  const { language } = useTranslation();
  
  return (
    <section className="py-24 bg-[var(--bg-secondary)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl text-[var(--text-primary)] mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
              {language === 'uk' ? 'Оптові' : 'Wholesale'} <span className="gradient-text">{language === 'uk' ? 'прайси' : 'pricing'}</span>
            </h2>
            <p className="text-[var(--text-muted)] text-lg max-w-2xl mx-auto mb-8">
              {language === 'uk' 
                ? 'Спеціальні ціни для бізнес-партнерів доступні виключно через нашого менеджера в Telegram.'
                : 'Special prices for business partners are available exclusively through our Telegram manager.'}
            </p>
            <a 
              href="https://t.me/boostertea_b2b_bot"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 bg-[var(--accent)] text-[#0D0D0D] font-bold rounded-xl hover:bg-[var(--accent-hover)] transition-all mx-auto"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
              </svg>
              {language === 'uk' ? 'Отримати оптовий прайс у Telegram' : 'Get wholesale pricing in Telegram'}
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

const CaseStudies = () => {
  const { t } = useTranslation();
  
  const cases = [
    {
      nameKey: 'b2b.cases.case1.name',
      locationKey: 'b2b.cases.case1.location',
      resultKey: 'b2b.cases.case1.result',
      quoteKey: 'b2b.cases.case1.quote',
      metricKey: 'b2b.cases.case1.metric'
    },
    {
      nameKey: 'b2b.cases.case2.name',
      locationKey: 'b2b.cases.case2.location',
      resultKey: 'b2b.cases.case2.result',
      quoteKey: 'b2b.cases.case2.quote',
      metricKey: 'b2b.cases.case2.metric'
    },
    {
      nameKey: 'b2b.cases.case3.name',
      locationKey: 'b2b.cases.case3.location',
      resultKey: 'b2b.cases.case3.result',
      quoteKey: 'b2b.cases.case3.quote',
      metricKey: 'b2b.cases.case3.metric'
    },
  ];

  return (
    <section className="py-24 bg-[var(--bg-primary)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 
            className="text-4xl sm:text-5xl text-[var(--text-primary)] mb-4"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {t('b2b.cases.title')} <span className="gradient-text">{t('b2b.cases.titleAccent')}</span>
          </h2>
          <p className="text-[var(--text-muted)] text-lg max-w-2xl mx-auto">
            {t('b2b.cases.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {cases.map((caseStudy, index) => (
            <div 
              key={index}
              className="bg-[var(--bg-secondary)] rounded-2xl p-8 border border-[var(--card-border)] hover:border-[#9FD356]/20 transition-all"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-[var(--text-primary)] font-semibold">{t(caseStudy.nameKey)}</h3>
                  <p className="text-[var(--text-muted)] text-sm">{t(caseStudy.locationKey)}</p>
                </div>
                <span className="px-3 py-1 bg-[var(--accent)]/20 text-[var(--accent)] text-sm font-medium rounded-full">
                  {t(caseStudy.resultKey)}
                </span>
              </div>
              
              <p className="text-[var(--text-secondary)] mb-6 leading-relaxed">
                "{t(caseStudy.quoteKey)}"
              </p>
              
              <div className="pt-6 border-t border-[var(--border)]">
                <p className="text-[var(--text-muted)] text-sm">{t('b2b.cases.avgSales')}</p>
                <p className="text-[#C9A55C] text-xl font-bold">{t(caseStudy.metricKey)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CTASection = () => {
  const { t } = useTranslation();
  
  return (
    <section className="py-24 bg-[var(--bg-tertiary)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-[#1A1A1A] to-[#141414] rounded-3xl p-12 text-center border border-[#9FD356]/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent)]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#8B7355]/10 rounded-full blur-3xl" />
          
          <div className="relative">
            <h2 
              className="text-4xl sm:text-5xl text-[var(--text-primary)] mb-4"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {t('b2b.ctaSection.title').split(' ').slice(0, -1).join(' ')} <span className="gradient-text">{t('b2b.ctaSection.title').split(' ').slice(-1)}</span>
            </h2>
            <p className="text-[var(--text-secondary)] text-lg mb-8 max-w-xl mx-auto">
              {t('b2b.ctaSection.description')}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <a 
                href="https://t.me/boostertea_b2b_bot"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 bg-[var(--accent)] text-[#0D0D0D] font-bold text-lg rounded-xl hover:bg-[var(--accent-hover)] transition-all hover:shadow-lg hover:shadow-[#9FD356]/30"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
                {t('b2b.ctaSection.button')}
              </a>
              <Link
                href="/adaptation"
                className="inline-flex items-center gap-2 px-8 py-4 bg-transparent text-[var(--text-primary)] font-semibold text-lg rounded-xl border border-[#F5F0E8]/30 hover:bg-[#F5F0E8]/10 transition-all"
              >
                {t('b2b.ctaSection.learnMore')}
              </Link>
            </div>

            <p className="text-[var(--text-muted)] text-sm">
              {t('b2b.ctaSection.specialOffer')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default B2B;
