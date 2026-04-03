import { useState } from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Toast from '../components/Toast';
import TelegramButton from '../components/TelegramButton';
import { ScrollReveal } from '../components/animations';
import { SEO, useSEOConfig } from '../components/SEO';
import { useTranslation } from '../lib/i18n';
import { pushGTMEvent } from '../lib/blog/types';

const Adaptation = () => {
  const seoConfig = useSEOConfig('adaptation');
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] page-transition">
      <SEO 
        title={seoConfig.title}
        description={seoConfig.description}
        breadcrumbs={[
          { name: t('nav.home'), url: '/' },
          { name: 'B2B', url: '/b2b' },
          { name: t('nav.adaptation'), url: '/adaptation' }
        ]}
      />
      <Header />
      <main>
        <HeroSection />
        <ImplementationSteps />
        <FAQSection />
        <DownloadableResources />
        <SuccessMetrics />
        <ContactForm />
      </main>
      <Footer />
      <TelegramButton />
      <Toast />
    </div>
  );
};

const HeroSection = () => {
  return (
    <section className="pt-32 pb-20 relative overflow-hidden bg-[#050505]">
      {/* Animated background elements */}
      <div className="absolute inset-0 noise-overlay opacity-40 mix-blend-overlay pointer-events-none" />
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#C4956A]/10 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#9FD356]/5 rounded-full blur-[150px]" />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Breadcrumb */}
          <nav className="flex items-center justify-center gap-2 mb-8 animate-fade-in-up">
            <Link href="/b2b" className="text-[var(--text-primary)]/var(--text-muted) hover:text-[var(--accent)] transition-colors text-sm">
              Для бізнесу
            </Link>
            <svg className="w-4 h-4 text-[var(--text-primary)]/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-[var(--accent)] text-sm">Адаптація</span>
          </nav>
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-black/50 border border-white/5 rounded-full mb-8 animate-fade-in-up animation-delay-100 shadow-[0_0_15px_rgba(196,149,106,0.1)]">
            <div className="w-2 h-2 bg-[#C4956A] rounded-full animate-pulse shadow-[0_0_10px_rgba(196,149,106,0.8)]" />
            <span className="text-[#C4956A] text-xs font-mono uppercase tracking-[0.2em] font-bold">
              Integration Protocol
            </span>
          </div>
          
          <h1 className="archival-heading text-5xl sm:text-6xl lg:text-7xl text-white mb-6 uppercase tracking-tight leading-none animate-fade-in-up animation-delay-200">
            ПРОТОКОЛ <span className="text-[#C4956A]">АДАПТАЦІЇ</span>
            <br /> <span className="text-4xl text-[#A89880]">BOOSTER.TEA</span>
          </h1>
          
          <p className="text-[#A89880] mb-10 leading-relaxed max-w-2xl mx-auto animate-fade-in-up animation-delay-300">
            Система інтеграції преміального чайного екстракту у ваш заклад. Від ініціації замовлення до першого проливу — 6 біологічних циклів.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animation-delay-400">
            <a 
              href="#steps"
              className="group relative px-8 py-5 bg-[#C4956A] text-black font-black uppercase tracking-[0.2em] rounded-xl hover:bg-[#D4A57A] transition-all inline-flex items-center justify-center gap-3 overflow-hidden shadow-[0_0_25px_rgba(196,149,106,0.3)]"
            >
              <span className="relative z-10 text-xs">Ініціювати протокол</span>
              <svg className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7-7m7-7H3" />
              </svg>
            </a>
            <a 
              href="#resources"
              className="px-8 py-5 bg-transparent text-[#E8DDD0] font-bold uppercase tracking-widest text-xs rounded-xl border border-white/10 hover:bg-white/5 transition-all inline-flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Завантажити базу
            </a>
          </div>
          
          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-6 mt-16 animate-fade-in-up animation-delay-500 max-w-2xl mx-auto bento-card p-6 rounded-3xl relative overflow-hidden bg-black/40 border border-white/5">
            <div className="absolute inset-0 noise-overlay opacity-30" />
            {[
              { value: '5', label: 'Хвилин інсталяції' },
              { value: '6', label: 'Етапів протоколу' },
              { value: '24/7', label: 'Телеметрія сапорту' }
            ].map((stat, index) => (
              <div key={index} className="text-center relative z-10">
                <div className="data-heavy text-4xl sm:text-5xl text-white mb-2" style={{ textShadow: '0 0 15px rgba(255,255,255,0.2)' }}>
                  {stat.value}
                </div>
                <div className="text-[10px] font-mono uppercase tracking-widest text-[#A89880]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const ImplementationSteps = () => {
  const [activeStep, setActiveStep] = useState(0);
  
  const steps = [
    {
      number: 1,
      title: 'Замовлення',
      subtitle: 'Оберіть продукцію',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      content: {
        description: 'Оберіть чайні концентрати, які найкраще підійдуть вашому закладу. Ми рекомендуємо почати з набору-дегустації.',
        details: [
          { label: 'Мінімальне замовлення', value: '6 пляшок по 1л або 12 пляшок по 0.25л' },
          { label: 'Асортимент', value: 'Пуер, Да Хун Пао, ГАБА' },
          { label: 'Знижка на перше замовлення', value: '10% для нових партнерів' }
        ],
        tip: '💡 Порада: Замовте по 2 пляшки кожного виду для тестування попиту'
      }
    },
    {
      number: 2,
      title: 'Отримання',
      subtitle: 'Доставка та зберігання',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      content: {
        description: 'Отримайте замовлення протягом 1-3 днів. Концентрат зберігається до 6 місяців у холодильнику.',
        details: [
          { label: 'Доставка', value: 'Нова Пошта / кур\'єр по Львову' },
          { label: 'Термін зберігання', value: 'До 6 місяців в холодильнику' },
          { label: 'Після відкриття', value: '30 днів при температурі +2...+6°C' }
        ],
        tip: '💡 Порада: Зберігайте відкриті пляшки в холодильнику, закриті — можна при кімнатній температурі'
      }
    },
    {
      number: 3,
      title: 'Навчання персоналу',
      subtitle: '5 хвилин до майстерності',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      content: {
        description: 'Навчіть персонал за 5 хвилин. Достатньо показати відео та провести одну практику.',
        details: [
          { label: 'Тривалість навчання', value: '5-10 хвилин' },
          { label: 'Матеріали', value: 'Відеоінструкція + картка приготування' },
          { label: 'Підтримка', value: 'Консультація менеджера 24/7' }
        ],
        tip: '💡 Порада: Роздрукуйте картку приготування та повісьте біля робочого місця',
        hasVideo: true
      }
    },
    {
      number: 4,
      title: 'Інтеграція в меню',
      subtitle: 'Ціноутворення та подача',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      ),
      content: {
        description: 'Додайте чай до меню з рекомендованою націнкою. Ми надамо шаблони для дизайну.',
        details: [
          { label: 'Рекомендована ціна', value: '55-85 грн за порцію' },
          { label: 'Собівартість порції', value: '~25 грн (1L = 40 порцій)' },
          { label: 'Маржа', value: '60-80%' }
        ],
        tip: '💡 Порада: Виділіть чай в окрему секцію меню "Преміальний чай" для кращого сприйняття'
      }
    },
    {
      number: 5,
      title: 'Маркетингова підтримка',
      subtitle: 'POS та соціальні мережі',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
        </svg>
      ),
      content: {
        description: 'Отримайте готові маркетингові матеріали для просування в соцмережах та офлайн.',
        details: [
          { label: 'POS матеріали', value: 'Тейблтенти, постери, стікери' },
          { label: 'Соцмережі', value: 'Шаблони сторіс та постів' },
          { label: 'Контент', value: 'Фото та відео продукції' }
        ],
        tip: '💡 Порада: Розмістіть тейблтент біля каси — це збільшує продажі на 30%'
      }
    },
    {
      number: 6,
      title: 'Зворотний зв\'язок',
      subtitle: 'Підтримка та розвиток',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      content: {
        description: 'Залишайтеся на зв\'язку для отримання нових пропозицій та вирішення питань.',
        details: [
          { label: 'Telegram підтримка', value: '@boostertea_b2b_bot' },
          { label: 'Гаряча лінія', value: '+380 96 310 96 22' },
          { label: 'Email', value: 'office@boostertea.com.ua' }
        ],
        tip: '💡 Порада: Підпишіться на наш канал — там ми ділимося секретами успішних продажів'
      }
    }
  ];

  const handleStepChange = (index: number) => {
    setActiveStep(index);
    pushGTMEvent({
      event: 'b2b_mechanic_interaction',
      mechanic_type: 'protocol_slider',
      mechanic_value: `step_${index + 1}`
    });
    // Check if Protocol is complete
    if (index === steps.length - 1) {
       pushGTMEvent({
          event: 'b2b_protocol_completed',
          mechanic_type: 'protocol_completed',
          mechanic_value: '1'
       });
    }
  };

  return (
    <section id="steps" className="py-24 bg-[#0a0a0c] relative overflow-hidden">
      <div className="absolute inset-0 noise-overlay opacity-30 pointer-events-none" />
      {/* Decorative center line */}
      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#C4956A]/20 to-transparent hidden lg:block" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="archival-heading text-4xl sm:text-6xl text-white mb-4 uppercase tracking-tighter">
              ПРОТОКОЛ <span className="text-[#C4956A]">ВПРОВАДЖЕННЯ</span>
            </h2>
            <p className="text-[#A89880] text-lg max-w-2xl mx-auto uppercase tracking-widest font-mono text-[10px]">
              6 послідовних стадій розгортання BoosterTea у вашому бізнесі
            </p>
          </div>
        </ScrollReveal>

        {/* Step Navigation Protocol */}
        <div className="mb-12 max-w-4xl mx-auto">
          <input 
             type="range" 
             min="0" 
             max={steps.length - 1} 
             value={activeStep}
             onChange={(e) => handleStepChange(parseInt(e.target.value))}
             className="w-full h-2 bg-black rounded-lg appearance-none cursor-pointer border border-[#C4956A]/30 mb-8"
             style={{
               background: `linear-gradient(to right, #C4956A ${(activeStep / (steps.length - 1)) * 100}%, rgba(196,149,106,0.1) ${(activeStep / (steps.length - 1)) * 100}%)`
             }}
          />
          <div className="flex justify-between relative px-2">
            {steps.map((step, index) => (
              <button
                key={index}
                onClick={() => handleStepChange(index)}
                className={`flex flex-col items-center gap-2 relative z-10 transition-all ${
                  activeStep === index
                    ? 'scale-110 opacity-100'
                    : 'opacity-40 hover:opacity-100'
                }`}
              >
                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border ${
                  activeStep >= index 
                     ? 'bg-[#C4956A] text-black border-[#C4956A] shadow-[0_0_15px_rgba(196,149,106,0.5)]' 
                     : 'bg-black text-[#A89880] border-white/10'
                }`}>
                  {step.number}
                </span>
                <span className="hidden md:block text-[10px] font-mono uppercase tracking-widest text-center max-w-[80px] break-words text-[#A89880]">
                   {step.title}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Active Step Content */}
        <ScrollReveal key={activeStep}>
          <div className="max-w-4xl mx-auto">
            <div className="bento-card p-8 md:p-12 relative overflow-hidden border border-white/5 bg-black/40 shadow-2xl">
              <div className="absolute inset-0 noise-overlay opacity-20 pointer-events-none" />
              <div className="relative z-10 flex flex-col md:flex-row gap-8">
                {/* Step Header */}
                <div className="md:w-1/3">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-colors shadow-inner ${
                    activeStep === steps.length - 1 
                      ? 'bg-[#C4956A] border border-[#ff003c]/20' 
                      : 'bg-white/5 border border-white/10'
                  }`}>
                    <div className={activeStep === steps.length - 1 ? 'text-black' : 'text-[#C4956A]'}>
                      {steps[activeStep].icon}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 mb-2 opacity-60">
                    <span className="text-[#C4956A] text-[10px] uppercase tracking-widest font-mono">Цикл {steps[activeStep].number}</span>
                    <div className="flex-1 h-px bg-[#C4956A]/30" />
                  </div>
                  
                  <h3 className="archival-heading text-3xl text-white mb-2 leading-none uppercase">
                    {steps[activeStep].title}
                  </h3>
                  <p className="text-[#A89880] text-xs font-mono uppercase tracking-widest">{steps[activeStep].subtitle}</p>
                </div>

                {/* Step Content */}
                <div className="md:w-2/3 space-y-6">
                  <p className="text-[#E8DDD0] text-base leading-relaxed p-4 bg-white/5 border-l-2 border-[#C4956A]">
                    {steps[activeStep].content.description}
                  </p>

                  <div className="grid gap-3">
                    {steps[activeStep].content.details.map((detail, i) => (
                      <div 
                        key={i}
                        className="flex justify-between items-center py-4 px-5 bg-black/50 border border-white/5 rounded-xl shadow-[inset_0_0_15px_rgba(0,0,0,0.8)]"
                      >
                        <span className="text-[#A89880] text-xs font-mono uppercase tracking-widest">{detail.label}</span>
                        <span className="text-[#E8DDD0] font-bold text-sm tracking-tight">{detail.value}</span>
                      </div>
                    ))}
                  </div>

                  {/* Video placeholder */}
                  {steps[activeStep].content.hasVideo && (
                    <div className="relative aspect-video bg-black/80 border border-white/10 rounded-2xl overflow-hidden group cursor-pointer">
                      <div className="absolute inset-0 noise-overlay opacity-30" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-20 h-20 rounded-full border border-[#C4956A] flex items-center justify-center group-hover:bg-[#C4956A]/20 transition-colors">
                          <svg className="w-8 h-8 text-[#C4956A] ml-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                        </div>
                      </div>
                      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center bg-black/60 backdrop-blur px-4 py-2 rounded-lg border border-white/5">
                        <span className="text-white text-xs font-mono uppercase tracking-widest">Відео-інструкція протоколу</span>
                        <span className="text-[#C4956A] text-[10px] uppercase animate-pulse">LIVE</span>
                      </div>
                    </div>
                  )}

                  {/* Tip box */}
                  <div className="bg-[#C4956A]/10 rounded-xl p-4 border border-[#C4956A]/20">
                    <p className="text-[#E8DDD0] text-sm">
                      {steps[activeStep].content.tip}
                    </p>
                  </div>
                </div>
              </div>

              {/* Navigation buttons */}
              <div className="relative z-10 flex justify-between items-center mt-12 pt-8 border-t border-white/10">
                <button
                  onClick={() => handleStepChange(Math.max(0, activeStep - 1))}
                  disabled={activeStep === 0}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg uppercase tracking-widest text-xs font-bold transition-all ${
                    activeStep === 0
                      ? 'text-white/20 cursor-not-allowed'
                      : 'text-[#E8DDD0] hover:text-[#C4956A] hover:bg-white/5 border border-white/5'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  РЕВЕРС
                </button>
                
                {activeStep < steps.length - 1 ? (
                  <button
                    onClick={() => handleStepChange(activeStep + 1)}
                    className="flex items-center gap-2 px-6 py-3 bg-[#C4956A] text-black font-black uppercase tracking-[0.2em] text-xs rounded-lg hover:bg-[#D4A57A] transition-all shadow-[0_0_15px_rgba(196,149,106,0.3)]"
                  >
                    НАСТУПНИЙ ЦИКЛ
                    <svg className="w-4 h-4 border border-black/20 rounded-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                ) : (
                  <a
                    href="https://t.me/boostertea_b2b_bot"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-6 py-3 bg-[#ff003c] text-white font-black uppercase tracking-[0.2em] text-xs rounded-lg hover:bg-[#d40030] transition-all shadow-[0_0_25px_rgba(255,0,60,0.5)]"
                  >
                    АВТОРИЗАЦІЯ
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                    </svg>
                  </a>
                )}
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Progress indicator */}
        <div className="flex justify-center gap-3 mt-8 relative z-10">
          {steps.map((_, index) => (
            <button
              key={index}
              onClick={() => handleStepChange(index)}
              className={`h-1.5 rounded-none transition-all duration-300 ${
                index === activeStep
                  ? 'w-12 bg-[#C4956A] shadow-[0_0_10px_rgba(196,149,106,0.5)]'
                  : index < activeStep
                  ? 'w-4 bg-white/20'
                  : 'w-4 bg-white/5'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const handleFAQToggle = (index: number) => {
    const isOpening = openIndex !== index;
    setOpenIndex(isOpening ? index : null);
    if (isOpening) {
      pushGTMEvent({
        event: 'b2b_faq_read',
        question_index: index + 1
      });
    }
  };

  const faqs = [
    {
      question: 'Яке мінімальне замовлення для бізнесу?',
      answer: 'Мінімальне замовлення — 6 пляшок по 1 літру або 12 пляшок по 0.25 літра. Ви можете комбінувати різні смаки в одному замовленні. Для нових партнерів діє знижка 10% на перше замовлення.'
    },
    {
      question: 'Скільки часу потрібно на навчання персоналу?',
      answer: 'Навчання займає всього 5-10 хвилин. Ми надаємо відеоінструкцію та друковану картку приготування. Після одного практичного заняття ваш персонал буде готувати чай як справжній майстер.'
    },
    {
      question: 'Чи потрібне спеціальне обладнання?',
      answer: 'Ні, вам потрібні лише звичайні чашки та гаряча вода. Ніякого спеціального обладнання, машин чи аксесуарів. Це значно знижує початкові інвестиції та спрощує процес.'
    },
    {
      question: 'Як довго зберігається концентрат?',
      answer: 'Закритий концентрат зберігається до 6 місяців при кімнатній температурі. Після відкриття — 30 днів у холодильнику при +2...+6°C. Це означає мінімум відходів та максимум економії.'
    },
    {
      question: 'Яку маржу можна отримати?',
      answer: 'При рекомендованій роздрібній ціні 65-85 грн за порцію та собівартості ~25 грн, ваша маржа складе 60-80%. Це значно вище, ніж у більшості напоїв у HoReCa.'
    },
    {
      question: 'Чи надаєте ви маркетингові матеріали?',
      answer: 'Так, ми безкоштовно надаємо: тейблтенти, постери, стікери, шаблони для соцмереж, професійні фото та відео продукції. Все для успішного просування чаю у вашому закладі.'
    },
    {
      question: 'Як швидко доставляється замовлення?',
      answer: 'Доставка по Україні через Нову Пошту займає 1-2 дні. По Львову можлива кур\'єрська доставка в день замовлення. Замовлення понад 3000 грн — безкоштовна доставка.'
    },
    {
      question: 'Чи є програма лояльності для партнерів?',
      answer: 'Так! Постійні партнери отримують: накопичувальні знижки до 15%, пріоритетну доставку, ексклюзивний доступ до новинок, персонального менеджера та участь у спільних маркетингових активностях.'
    }
  ];

  return (
    <section className="py-24 bg-[#050505] relative border-t border-white/5">
      <div className="absolute inset-0 noise-overlay opacity-20 pointer-events-none" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="archival-heading text-4xl sm:text-5xl text-white mb-4 uppercase tracking-tighter">
              БАЗА <span className="text-[#C4956A]">ЗНАНЬ</span>
            </h2>
            <p className="text-[#A89880] text-xs font-mono uppercase tracking-widest max-w-2xl mx-auto">
              Відповіді на найчастіші системні запити
            </p>
          </div>
        </ScrollReveal>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <ScrollReveal key={index} delay={index * 50}>
              <div 
                className={`bento-card border transition-all duration-300 overflow-hidden relative ${
                  openIndex === index 
                    ? 'border-[#C4956A]/50 bg-black/80 shadow-[0_0_20px_rgba(196,149,106,0.1)]' 
                    : 'border-white/5 bg-black/40 hover:border-white/10 hover:bg-black/60'
                }`}
              >
                <div className="absolute inset-0 noise-overlay opacity-30 mix-blend-overlay pointer-events-none" />
                <button
                  onClick={() => handleFAQToggle(index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left relative z-10"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-[#C4956A] font-mono text-[10px] uppercase tracking-widest">[{String(index + 1).padStart(2, '0')}]</span>
                    <span className={`font-bold tracking-tight transition-colors ${openIndex === index ? 'text-white' : 'text-[#E8DDD0]'}`}>{faq.question}</span>
                  </div>
                  <div className={`w-8 h-8 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                    openIndex === index 
                      ? 'bg-[#C4956A] border-[#C4956A] rotate-180 shadow-[0_0_15px_rgba(196,149,106,0.5)]' 
                      : 'bg-black border-white/10'
                  }`}>
                    <svg 
                      className={`w-4 h-4 transition-colors ${
                        openIndex === index ? 'text-black' : 'text-[#A89880]'
                      }`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>
                
                <div className={`overflow-hidden transition-all duration-300 relative z-10 ${
                  openIndex === index ? 'max-h-96' : 'max-h-0'
                }`}>
                  <div className="px-6 pb-6 pt-2 ml-10 border-t border-white/5">
                    <p className="text-[#A89880] text-sm leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Additional questions CTA */}
        <div className="mt-16 pt-8 border-t border-white/5 text-center relative z-10 bento-card p-8 rounded-2xl bg-black/40 overflow-hidden">
          <div className="absolute inset-0 noise-overlay opacity-20 pointer-events-none" />
          <p className="text-[#A89880] text-xs font-mono uppercase tracking-widest mb-4">Не знайшли відповідний протокол?</p>
          <a 
            href="https://t.me/boostertea_b2b_bot"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-6 py-3 border border-[#C4956A]/30 text-[#C4956A] hover:bg-[#C4956A] hover:text-black hover:border-[#C4956A] transition-all font-bold text-xs uppercase tracking-widest rounded-lg shadow-[0_0_15px_rgba(196,149,106,0.1)]"
          >
            <span>Написати сапорту</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7-7m7-7H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

const DownloadableResources = () => {
  const handleDownload = (resourceId: string, format: string) => {
    pushGTMEvent({
      event: 'b2b_resource_download',
      resource_id: resourceId,
      format: format
    });
    // In a real app, you would actually trigger the download here
  };

  const resources = [
    {
      id: 'menu_templates',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      title: 'Шаблони меню',
      description: 'Готові UI/UX дизайни для інтеграції в меню вашого бару',
      format: 'PDF, AI',
      size: '2.4 MB'
    },
    {
      id: 'video_instructions',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ),
      title: 'Докс: Відеоінструкції',
      description: 'Відео-протокол екстракції та приготування',
      format: 'MP4',
      size: '45 MB'
    },
    {
      id: 'pos_materials',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      title: 'POS матеріали',
      description: 'Матричні тейблтенти, постери, стікери',
      format: 'PDF, PNG',
      size: '8.1 MB'
    },
    {
      id: 'social_content',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
        </svg>
      ),
      title: 'Social Медіа',
      description: 'Рендери для Stories, макети для Reels',
      format: 'PSD, Figma',
      size: '12.5 MB'
    }
  ];

  return (
    <section id="resources" className="py-24 bg-[#0a0a0c] relative">
      <div className="absolute inset-0 noise-overlay opacity-30 pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="archival-heading text-4xl sm:text-6xl text-white mb-4 uppercase tracking-tighter">
              СИСТЕМНІ <span className="text-[#C4956A]">РЕСУРСИ</span>
            </h2>
            <p className="text-[#A89880] text-xs font-mono uppercase tracking-widest max-w-2xl mx-auto">
              База даних для завантаження в екосистему вашого бару
            </p>
          </div>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {resources.map((resource, index) => (
            <ScrollReveal key={resource.id} delay={index * 100}>
              <div className="bento-card bg-black/50 rounded-2xl p-6 border border-white/5 hover:border-[#C4956A]/30 transition-all duration-300 group h-full flex flex-col relative overflow-hidden">
                <div className="absolute inset-0 noise-overlay opacity-20 pointer-events-none" />
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-xl border border-white/10 bg-black flex items-center justify-center mb-6 text-[#A89880] group-hover:text-[#C4956A] group-hover:border-[#C4956A]/50 transition-colors shadow-inner">
                    {resource.icon}
                  </div>
                  
                  <h3 className="archival-heading text-2xl text-white mb-2 uppercase leading-none">
                    {resource.title}
                  </h3>
                  
                  <p className="text-[#E8DDD0] text-sm mb-6 flex-grow leading-relaxed">
                    {resource.description}
                  </p>
                  
                  <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-[#A89880] mb-4 border-t border-white/5 pt-4">
                    <span>{resource.format}</span>
                    <span className="text-[#C4956A]">{resource.size}</span>
                  </div>
                  
                  <button 
                    onClick={() => handleDownload(resource.id, resource.format)}
                    className="w-full py-3 bg-black border border-white/10 hover:border-[#C4956A] hover:bg-[#C4956A]/10 text-white rounded-lg transition-all flex items-center justify-center gap-2 group/btn shadow-[0_0_10px_rgba(0,0,0,0.5)]"
                  >
                    <svg className="w-4 h-4 text-[#C4956A] group-hover/btn:translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    <span className="text-xs uppercase font-bold tracking-widest">Викачати</span>
                  </button>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* All resources pack */}
        <ScrollReveal delay={400}>
          <div className="mt-12 bento-card bg-black/60 rounded-3xl p-8 border border-[#C4956A]/20 relative overflow-hidden shadow-[0_0_30px_rgba(196,149,106,0.1)]">
            <div className="absolute inset-0 noise-overlay opacity-30 pointer-events-none" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#C4956A]/10 rounded-full blur-[80px]" />
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="archival-heading text-3xl text-white mb-2 uppercase tracking-tight">
                  Повний <span className="text-[#C4956A]">Пакет</span> Матеріалів
                </h3>
                <p className="text-[#A89880] font-mono text-xs uppercase tracking-widest">
                  Синхронізація всіх ресурсів єдиним архівом (68 MB)
                </p>
              </div>
              
              <button 
                onClick={() => handleDownload('full_pack', 'ZIP')}
                className="px-8 py-4 bg-[#C4956A] text-black font-black uppercase tracking-[0.2em] text-xs rounded-xl hover:bg-[#D4A57A] transition-all flex items-center gap-3 shrink-0 shadow-[0_0_20px_rgba(196,149,106,0.4)]"
              >
                <svg className="w-5 h-5 border border-black/20 rounded-full p-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Завантажити все
              </button>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

const SuccessMetrics = () => {
  const metrics = [
    {
      value: '+45%',
      label: 'Середнє збільшення прибутку',
      description: 'Наші партнери відзначають зростання загального прибутку після впровадження BoosterTea',
      color: '#9FD356'
    },
    {
      value: '92%',
      label: 'Задоволеність клієнтів',
      description: 'Відвідувачі закладів високо оцінюють якість та смак нашого чаю',
      color: '#C9A55C'
    },
    {
      value: '< 2 тижні',
      label: 'Окупність інвестицій',
      description: 'В середньому партнери повертають початкові вкладення за 10-14 днів',
      color: '#8B7355'
    }
  ];

  return (
    <section className="py-24 bg-[#0a0a0c] relative border-t border-white/5 overflow-hidden">
      <div className="absolute inset-0 noise-overlay opacity-30 mix-blend-overlay pointer-events-none" />
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-[#9FD356]/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="archival-heading text-4xl sm:text-6xl text-white mb-4 uppercase tracking-tighter">
              СИСТЕМНА <span className="text-[#9FD356]">АНАЛІТИКА</span>
            </h2>
            <p className="text-[#A89880] font-mono text-[10px] uppercase tracking-widest max-w-2xl mx-auto">
              Метрики ефективності інтеграції BoosterTea у партнерські заклади
            </p>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-6">
          {metrics.map((metric, index) => (
            <ScrollReveal key={index} delay={index * 150}>
              <div className="bento-card bg-black/60 rounded-2xl p-8 border border-white/5 hover:border-white/10 transition-all group text-center relative overflow-hidden">
                <div className="absolute inset-0 noise-overlay opacity-20 pointer-events-none" />
                <div className="relative z-10">
                  <div 
                    className="data-heavy text-6xl sm:text-7xl mb-4 transition-transform group-hover:scale-105"
                    style={{ color: metric.color, textShadow: `0 0 20px ${metric.color}40` }}
                  >
                    {metric.value}
                  </div>
                  <h3 className="archival-heading text-xl text-white mb-4 uppercase tracking-tight">
                    {metric.label}
                  </h3>
                  <p className="text-[#A89880] text-sm leading-relaxed">
                    {metric.description}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Testimonial */}
        <ScrollReveal delay={500}>
          <div className="mt-6 bento-card bg-[#C4956A] rounded-3xl p-8 md:p-12 border border-[#C4956A]/30 relative overflow-hidden text-black shadow-[0_0_30px_rgba(196,149,106,0.2)]">
            <div className="absolute inset-0 noise-overlay opacity-30 mix-blend-overlay pointer-events-none" />
            <div className="absolute top-0 left-0 w-64 h-64 bg-black/5 rounded-full blur-2xl" />
            
            <div className="relative z-10 max-w-4xl mx-auto text-center">
              <div className="mb-8 opacity-40 mix-blend-multiply flex justify-center">
                <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                </svg>
              </div>
              <p className="archival-heading text-2xl md:text-3xl leading-tight mb-10 tracking-tight">
                "ПРОТЯГОМ ОДНОГО ДНЯ МИ ІНТЕГРУВАЛИ BOOSTERTEA. ЧЕРЕЗ ТИЖДЕНЬ ВІН СТАВ ДРУГИМ НАЙБІЛЬШ ПРИБУТКОВИМ НАПОЄМ В ЕКОСИСТЕМІ КАВ'ЯРНІ."
              </p>
              
              <div className="flex items-center justify-center gap-4 border-t border-black/10 pt-6">
                <div className="text-right">
                  <p className="font-black tracking-widest text-sm uppercase">Олена Коваленко</p>
                  <p className="font-mono text-[10px] uppercase opacity-70">Оператор вузла "Затишок", Київ</p>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    business: '',
    phone: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Fire B2B Telemetry Event for Lead Generation
    pushGTMEvent({
      event: 'b2b_lead_submission',
      business_type: formData.business
    });

    // Simulate API request
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({ name: '', business: '', phone: '', email: '', message: '' });
    }, 1200);
  };

  return (
    <section className="py-24 bg-[#050505] relative border-t border-white/5">
      <div className="absolute inset-0 noise-overlay opacity-30 pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left column - Info */}
          <ScrollReveal direction="left">
            <div>
              <h2 className="archival-heading text-4xl sm:text-6xl text-white mb-6 uppercase tracking-tighter leading-none">
                ЗАПУСТИТИ <span className="text-[#C4956A]">ПРОТОКОЛ</span>
              </h2>
              <p className="text-[#A89880] text-sm mb-10 leading-relaxed font-mono uppercase tracking-widest max-w-md">
                Передайте координати вашого вузла, і наш оператор зв'яжеться з вами для ініціалізації поставок.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4 group">
                  <div className="w-12 h-12 rounded-xl border border-white/5 bg-black flex items-center justify-center shrink-0 group-hover:border-[#C4956A]/50 transition-colors shadow-inner">
                    <svg className="w-5 h-5 text-[#A89880] group-hover:text-[#C4956A] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[#A89880] font-mono text-[10px] uppercase tracking-widest mb-1">Голосовий канал зв'язку</p>
                    <a href="tel:+380963109622" className="text-white font-bold tracking-widest hover:text-[#C4956A] transition-colors">
                      +380 96 310 96 22
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 group">
                  <div className="w-12 h-12 rounded-xl border border-white/5 bg-black flex items-center justify-center shrink-0 group-hover:border-[#C4956A]/50 transition-colors shadow-inner">
                    <svg className="w-5 h-5 text-[#A89880] group-hover:text-[#C4956A] transition-colors" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-[#A89880] font-mono text-[10px] uppercase tracking-widest mb-1">Захищений Телеграм Протокол</p>
                    <a href="https://t.me/boostertea_b2b_bot" target="_blank" rel="noopener noreferrer" className="text-white font-bold tracking-widest hover:text-[#C4956A] transition-colors">
                      @boostertea_b2b_bot
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 group">
                  <div className="w-12 h-12 rounded-xl border border-white/5 bg-black flex items-center justify-center shrink-0 group-hover:border-[#C4956A]/50 transition-colors shadow-inner">
                    <svg className="w-5 h-5 text-[#A89880] group-hover:text-[#C4956A] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[#A89880] font-mono text-[10px] uppercase tracking-widest mb-1">Електронна пошта</p>
                    <a href="mailto:office@boostertea.com.ua" className="text-white font-bold tracking-widest hover:text-[#C4956A] transition-colors">
                      office@boostertea.com.ua
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Right column - Form */}
          <ScrollReveal direction="right">
            <div className="bento-card bg-black/60 rounded-2xl p-8 border border-white/5 relative overflow-hidden">
              <div className="absolute inset-0 noise-overlay opacity-30 mix-blend-overlay pointer-events-none" />
              
              <div className="relative z-10">
                {isSubmitted ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 rounded-full border border-[#C4956A] bg-black flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(196,149,106,0.3)]">
                      <svg className="w-10 h-10 text-[#C4956A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="archival-heading text-2xl text-white mb-3 uppercase">
                      ДАНІ <span className="text-[#C4956A]">ЗАФІКСОВАНО</span>
                    </h3>
                    <p className="text-[#A89880] text-sm mb-8 font-mono uppercase tracking-widest">
                      Оператор зв'яжеться з вами найближчим часом.
                    </p>
                    <button
                      onClick={() => setIsSubmitted(false)}
                      className="text-[#C4956A] hover:text-white transition-colors text-xs font-bold uppercase tracking-widest border-b border-[#C4956A]/30 pb-0.5"
                    >
                      Відправити ще один запит
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label className="block text-[#A89880] text-[10px] font-mono uppercase tracking-widest mb-2">Ваше ім'я *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 bg-black border border-white/10 rounded-lg text-white font-mono text-sm placeholder:text-white/20 focus:border-[#C4956A] focus:ring-1 focus:ring-[#C4956A] transition-all"
                        placeholder="ID ОПЕРАТОРА"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-[#A89880] text-[10px] font-mono uppercase tracking-widest mb-2">Назва бізнесу *</label>
                      <input
                        type="text"
                        required
                        value={formData.business}
                        onChange={(e) => setFormData({ ...formData, business: e.target.value })}
                        className="w-full px-4 py-3 bg-black border border-white/10 rounded-lg text-white font-mono text-sm placeholder:text-white/20 focus:border-[#C4956A] focus:ring-1 focus:ring-[#C4956A] transition-all"
                        placeholder="КАВ'ЯРНЯ / РЕСТОРАН"
                      />
                    </div>
                    
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-[#A89880] text-[10px] font-mono uppercase tracking-widest mb-2">Телефон *</label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full px-4 py-3 bg-black border border-white/10 rounded-lg text-white font-mono text-sm placeholder:text-white/20 focus:border-[#C4956A] focus:ring-1 focus:ring-[#C4956A] transition-all"
                          placeholder="+380"
                        />
                      </div>
                      <div>
                        <label className="block text-[#A89880] text-[10px] font-mono uppercase tracking-widest mb-2">Email</label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-4 py-3 bg-black border border-white/10 rounded-lg text-white font-mono text-sm placeholder:text-white/20 focus:border-[#C4956A] focus:ring-1 focus:ring-[#C4956A] transition-all"
                          placeholder="EMAIL@NODE.COM"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-[#A89880] text-[10px] font-mono uppercase tracking-widest mb-2">Коментар</label>
                      <textarea
                        rows={3}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full px-4 py-3 bg-black border border-white/10 rounded-lg text-white font-mono text-sm placeholder:text-white/20 focus:border-[#C4956A] focus:ring-1 focus:ring-[#C4956A] transition-all resize-none"
                        placeholder="ДЕТАЛІ ЗАПИТУ..."
                      />
                    </div>
                    
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 mt-2 border border-[#C4956A]/50 bg-[#C4956A]/10 text-[#C4956A] uppercase font-black tracking-[0.2em] text-xs rounded-lg hover:bg-[#C4956A] hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-[0_0_15px_rgba(196,149,106,0.1)]"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          ОБРОБКА...
                        </>
                      ) : (
                        <>
                          ВІДПРАВИТИ ЗАПИТ
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7-7m7-7H3" />
                          </svg>
                        </>
                      )}
                    </button>
                    
                    <p className="text-[#A89880]/50 text-[10px] text-center font-mono uppercase tracking-widest pt-2">
                      Надсилаючи, ви погоджуєтесь з{' '}
                      <Link href="/privacy" className="text-[#C4956A] hover:text-white transition-colors">
                        політикою безпеки
                      </Link>
                    </p>
                  </form>
                )}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default Adaptation;

