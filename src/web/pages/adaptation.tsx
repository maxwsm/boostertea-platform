import { useState } from 'react';
import { Link } from 'wouter';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Toast from '../components/Toast';
import TelegramButton from '../components/TelegramButton';
import { ScrollReveal } from '../components/animations';
import { SEO, useSEOConfig } from '../components/SEO';
import { useTranslation } from '../lib/i18n';

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
    <section className="pt-32 pb-20 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[var(--accent)]/10 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#8B7355]/10 rounded-full blur-[120px] animate-pulse animation-delay-500" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#C9A55C]/5 rounded-full blur-[150px]" />
      </div>
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `linear-gradient(rgba(159, 211, 86, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(159, 211, 86, 0.5) 1px, transparent 1px)`,
        backgroundSize: '60px 60px'
      }} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
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
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--accent)]/10 rounded-full mb-8 animate-fade-in-up animation-delay-100">
            <div className="w-2 h-2 bg-[var(--accent)] rounded-full animate-pulse" />
            <span className="text-[var(--accent)] text-sm font-medium">
              Покроковий гайд
            </span>
          </div>
          
          <h1 
            className="text-5xl sm:text-6xl lg:text-7xl text-[var(--text-primary)] leading-tight mb-6 animate-fade-in-up animation-delay-200"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Повний гайд з{' '}
            <span className="relative">
              <span className="gradient-text">адаптації</span>
              <svg className="absolute -bottom-2 left-0 w-full h-3 text-[var(--accent)]/30" viewBox="0 0 200 12" fill="none">
                <path d="M2 8c50-8 150-8 196 0" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
              </svg>
            </span>
            {' '}BoosterTea у ваш бізнес
          </h1>
          
          <p className="text-xl text-[var(--text-primary)]/var(--text-secondary) mb-10 leading-relaxed max-w-2xl mx-auto animate-fade-in-up animation-delay-300">
            Дізнайтеся, як легко та швидко впровадити преміальний чай у ваш заклад. 
            Від замовлення до першого проданого напою — всього 6 простих кроків.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animation-delay-400">
            <a 
              href="#steps"
              className="group relative px-8 py-4 bg-[var(--accent)] text-[#0D0D0D] font-semibold rounded-xl hover:bg-[var(--accent-hover)] transition-all inline-flex items-center justify-center gap-2 overflow-hidden"
            >
              <span className="relative z-10">Почати навчання</span>
              <svg className="w-5 h-5 relative z-10 group-hover:translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-500 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            </a>
            <a 
              href="#resources"
              className="px-8 py-4 bg-transparent text-[var(--text-primary)] font-semibold rounded-xl border border-[#F5F0E8]/30 hover:bg-[#F5F0E8]/10 transition-all inline-flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Завантажити матеріали
            </a>
          </div>
          
          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-6 mt-16 animate-fade-in-up animation-delay-500">
            {[
              { value: '5', label: 'хвилин на навчання' },
              { value: '6', label: 'простих кроків' },
              { value: '24/7', label: 'підтримка' }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-[var(--accent)] mb-1" style={{ fontFamily: 'var(--font-heading)' }}>
                  {stat.value}
                </div>
                <div className="text-sm text-[var(--text-primary)]/var(--text-muted)">{stat.label}</div>
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
          { label: 'Telegram підтримка', value: '@booster_tea_b2b' },
          { label: 'Гаряча лінія', value: '+380 96 310 96 22' },
          { label: 'Email', value: 'office@boostertea.com.ua' }
        ],
        tip: '💡 Порада: Підпишіться на наш канал — там ми ділимося секретами успішних продажів'
      }
    }
  ];

  return (
    <section id="steps" className="py-24 bg-[var(--bg-tertiary)] relative">
      {/* Decorative line connecting steps */}
      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#9FD356]/20 to-transparent hidden lg:block" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 
              className="text-4xl sm:text-5xl text-[var(--text-primary)] mb-4"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              <span className="gradient-text">6 кроків</span> до успіху
            </h2>
            <p className="text-[var(--text-primary)]/var(--text-muted) text-lg max-w-2xl mx-auto">
              Простий та зрозумілий процес впровадження BoosterTea у ваш бізнес
            </p>
          </div>
        </ScrollReveal>

        {/* Step Navigation */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {steps.map((step, index) => (
            <button
              key={index}
              onClick={() => setActiveStep(index)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                activeStep === index
                  ? 'bg-[var(--accent)] text-[#0D0D0D]'
                  : 'bg-[var(--bg-secondary)] text-[var(--text-primary)]/var(--text-muted) hover:bg-[var(--bg-secondary)]/80 hover:text-[var(--text-primary)]'
              }`}
            >
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                activeStep === index ? 'bg-[var(--bg-primary)]/20' : 'bg-[#F5F0E8]/10'
              }`}>
                {step.number}
              </span>
              <span className="hidden sm:inline text-sm font-medium">{step.title}</span>
            </button>
          ))}
        </div>

        {/* Active Step Content */}
        <ScrollReveal key={activeStep}>
          <div className="max-w-4xl mx-auto">
            <div className="bg-[var(--bg-secondary)] rounded-3xl p-8 md:p-12 border border-[var(--card-border)] hover:border-[#9FD356]/20 transition-colors">
              <div className="flex flex-col md:flex-row gap-8">
                {/* Step Header */}
                <div className="md:w-1/3">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-colors ${
                    activeStep === steps.length - 1 
                      ? 'bg-gradient-to-br from-[#9FD356] to-[#C9A55C]' 
                      : 'bg-[var(--accent)]/20'
                  }`}>
                    <div className={activeStep === steps.length - 1 ? 'text-[#0D0D0D]' : 'text-[var(--accent)]'}>
                      {steps[activeStep].icon}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-[var(--accent)] text-sm font-bold">Крок {steps[activeStep].number}</span>
                    <div className="flex-1 h-px bg-[var(--accent)]/30" />
                  </div>
                  
                  <h3 
                    className="text-2xl text-[var(--text-primary)] mb-2"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {steps[activeStep].title}
                  </h3>
                  <p className="text-[var(--text-primary)]/var(--text-muted) text-sm">{steps[activeStep].subtitle}</p>
                </div>

                {/* Step Content */}
                <div className="md:w-2/3 space-y-6">
                  <p className="text-[var(--text-primary)]/80 text-lg leading-relaxed">
                    {steps[activeStep].content.description}
                  </p>

                  <div className="grid gap-4">
                    {steps[activeStep].content.details.map((detail, i) => (
                      <div 
                        key={i}
                        className="flex justify-between items-center py-3 px-4 bg-[var(--bg-primary)] rounded-xl"
                      >
                        <span className="text-[var(--text-primary)]/var(--text-muted) text-sm">{detail.label}</span>
                        <span className="text-[var(--text-primary)] font-medium text-sm">{detail.value}</span>
                      </div>
                    ))}
                  </div>

                  {/* Video placeholder */}
                  {steps[activeStep].content.hasVideo && (
                    <div className="relative aspect-video bg-[var(--bg-primary)] rounded-xl overflow-hidden group cursor-pointer">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#9FD356]/20 to-[#8B7355]/20" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-20 h-20 rounded-full bg-[var(--accent)] flex items-center justify-center group-hover:scale-110 transition-transform">
                          <svg className="w-8 h-8 text-[#0D0D0D] ml-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                        </div>
                      </div>
                      <div className="absolute bottom-4 left-4">
                        <span className="text-[var(--text-primary)]/80 text-sm">Відеоінструкція з приготування</span>
                      </div>
                    </div>
                  )}

                  {/* Tip box */}
                  <div className="bg-[var(--accent)]/10 rounded-xl p-4 border border-[#9FD356]/20">
                    <p className="text-[var(--text-primary)]/80 text-sm">
                      {steps[activeStep].content.tip}
                    </p>
                  </div>
                </div>
              </div>

              {/* Navigation buttons */}
              <div className="flex justify-between items-center mt-8 pt-8 border-t border-[var(--border)]">
                <button
                  onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
                  disabled={activeStep === 0}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    activeStep === 0
                      ? 'text-[var(--text-primary)]/30 cursor-not-allowed'
                      : 'text-[var(--text-primary)]/var(--text-secondary) hover:text-[var(--text-primary)] hover:bg-[#F5F0E8]/5'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Попередній крок
                </button>
                
                {activeStep < steps.length - 1 ? (
                  <button
                    onClick={() => setActiveStep(activeStep + 1)}
                    className="flex items-center gap-2 px-6 py-3 bg-[var(--accent)] text-[#0D0D0D] font-semibold rounded-lg hover:bg-[var(--accent-hover)] transition-all"
                  >
                    Наступний крок
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                ) : (
                  <a
                    href="https://t.me/booster_tea_b2b"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-6 py-3 bg-[var(--accent)] text-[#0D0D0D] font-semibold rounded-lg hover:bg-[var(--accent-hover)] transition-all"
                  >
                    Почати співпрацю
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                    </svg>
                  </a>
                )}
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Progress indicator */}
        <div className="flex justify-center gap-2 mt-8">
          {steps.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveStep(index)}
              className={`h-2 rounded-full transition-all ${
                index === activeStep
                  ? 'w-8 bg-[var(--accent)]'
                  : index < activeStep
                  ? 'w-2 bg-[var(--accent)]/var(--text-muted)'
                  : 'w-2 bg-[#F5F0E8]/20'
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
    <section className="py-24 bg-[var(--bg-primary)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 
              className="text-4xl sm:text-5xl text-[var(--text-primary)] mb-4"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Часті <span className="gradient-text">питання</span>
            </h2>
            <p className="text-[var(--text-primary)]/var(--text-muted) text-lg max-w-2xl mx-auto">
              Відповіді на найпопулярніші запитання від наших партнерів
            </p>
          </div>
        </ScrollReveal>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <ScrollReveal key={index} delay={index * 50}>
              <div 
                className={`bg-[var(--bg-secondary)] rounded-2xl border transition-all duration-300 overflow-hidden ${
                  openIndex === index 
                    ? 'border-[var(--border-accent)]' 
                    : 'border-[var(--card-border)] hover:border-[var(--border)]'
                }`}
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left"
                >
                  <span className="text-[var(--text-primary)] font-medium pr-4">{faq.question}</span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all ${
                    openIndex === index 
                      ? 'bg-[var(--accent)] rotate-180' 
                      : 'bg-[#F5F0E8]/10'
                  }`}>
                    <svg 
                      className={`w-4 h-4 transition-colors ${
                        openIndex === index ? 'text-[#0D0D0D]' : 'text-[var(--text-primary)]/var(--text-muted)'
                      }`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>
                
                <div className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96' : 'max-h-0'
                }`}>
                  <div className="px-6 pb-5">
                    <p className="text-[var(--text-primary)]/var(--text-secondary) leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Additional questions CTA */}
        <div className="mt-12 text-center">
          <p className="text-[var(--text-primary)]/var(--text-muted) mb-4">Не знайшли відповідь на своє питання?</p>
          <a 
            href="https://t.me/booster_tea_b2b"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[var(--accent)] hover:text-[#7FB030] transition-colors"
          >
            <span>Напишіть нам у Telegram</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

const DownloadableResources = () => {
  const resources = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      title: 'Шаблони меню',
      description: 'Готові дизайни для інтеграції чаю в меню вашого закладу',
      format: 'PDF, AI',
      size: '2.4 MB'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ),
      title: 'Відеоінструкція',
      description: '5-хвилинне відео з приготування всіх видів чаю',
      format: 'MP4',
      size: '45 MB'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      title: 'POS матеріали',
      description: 'Тейблтенти, постери, стікери для оформлення закладу',
      format: 'PDF, PNG',
      size: '8.1 MB'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
        </svg>
      ),
      title: 'Контент для соцмереж',
      description: 'Шаблони сторіс, постів та Reels для Instagram',
      format: 'PSD, Canva',
      size: '12.5 MB'
    }
  ];

  return (
    <section id="resources" className="py-24 bg-[var(--bg-tertiary)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 
              className="text-4xl sm:text-5xl text-[var(--text-primary)] mb-4"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              <span className="gradient-text">Матеріали</span> для завантаження
            </h2>
            <p className="text-[var(--text-primary)]/var(--text-muted) text-lg max-w-2xl mx-auto">
              Безкоштовні ресурси для успішного запуску чаю у вашому закладі
            </p>
          </div>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {resources.map((resource, index) => (
            <ScrollReveal key={index} delay={index * 100}>
              <div className="bg-[var(--bg-secondary)] rounded-2xl p-6 border border-[var(--card-border)] hover:border-[var(--border-accent)] transition-all duration-300 group h-full flex flex-col">
                <div className="w-14 h-14 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center mb-6 text-[var(--accent)] group-hover:bg-[var(--accent)]/20 transition-colors">
                  {resource.icon}
                </div>
                
                <h3 
                  className="text-lg text-[var(--text-primary)] mb-2"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {resource.title}
                </h3>
                
                <p className="text-[var(--text-primary)]/var(--text-muted) text-sm mb-6 flex-grow">
                  {resource.description}
                </p>
                
                <div className="flex items-center justify-between text-xs text-[var(--text-primary)]/var(--text-subtle) mb-4">
                  <span>{resource.format}</span>
                  <span>{resource.size}</span>
                </div>
                
                <button className="w-full py-3 bg-[#F5F0E8]/5 hover:bg-[var(--accent)]/20 text-[var(--text-primary)] hover:text-[var(--accent)] rounded-xl transition-all flex items-center justify-center gap-2 group/btn">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span className="text-sm font-medium">Завантажити</span>
                </button>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* All resources pack */}
        <ScrollReveal delay={400}>
          <div className="mt-12 bg-gradient-to-br from-[#1A1A1A] to-[#141414] rounded-3xl p-8 border border-[#9FD356]/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent)]/10 rounded-full blur-3xl" />
            
            <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 
                  className="text-2xl text-[var(--text-primary)] mb-2"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  Повний пакет матеріалів
                </h3>
                <p className="text-[var(--text-primary)]/var(--text-muted)">
                  Завантажте всі ресурси одним архівом (68 MB)
                </p>
              </div>
              
              <button className="px-8 py-4 bg-[var(--accent)] text-[#0D0D0D] font-semibold rounded-xl hover:bg-[var(--accent-hover)] transition-all flex items-center gap-3 shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
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
    <section className="py-24 bg-[var(--bg-primary)] relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#9FD356]/5 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 
              className="text-4xl sm:text-5xl text-[var(--text-primary)] mb-4"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Метрики <span className="gradient-text">успіху</span>
            </h2>
            <p className="text-[var(--text-primary)]/var(--text-muted) text-lg max-w-2xl mx-auto">
              Реальні результати наших партнерів
            </p>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-8">
          {metrics.map((metric, index) => (
            <ScrollReveal key={index} delay={index * 150}>
              <div className="bg-[var(--bg-secondary)] rounded-2xl p-8 border border-[var(--card-border)] hover:border-[#9FD356]/20 transition-all group text-center">
                <div 
                  className="text-5xl sm:text-6xl font-bold mb-4 transition-transform group-hover:scale-105"
                  style={{ fontFamily: 'var(--font-heading)', color: metric.color }}
                >
                  {metric.value}
                </div>
                <h3 className="text-xl text-[var(--text-primary)] mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
                  {metric.label}
                </h3>
                <p className="text-[var(--text-primary)]/var(--text-muted) text-sm leading-relaxed">
                  {metric.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Testimonial */}
        <ScrollReveal delay={500}>
          <div className="mt-16 bg-gradient-to-br from-[#1A1A1A] to-[#141414] rounded-3xl p-8 md:p-12 border border-[var(--card-border)] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-32 h-32 text-[var(--accent)]/10">
              <svg fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
              </svg>
            </div>
            
            <div className="relative max-w-3xl mx-auto text-center">
              <p className="text-xl text-[var(--text-primary)]/80 leading-relaxed mb-8 italic">
                "Ми впровадили BoosterTea в нашій кав'ярні за один день. Вже через тиждень чай став другим за популярністю напоєм після кави. Клієнти в захваті від якості, а ми — від маржинальності!"
              </p>
              
              <div className="flex items-center justify-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#9FD356] to-[#7FB030] flex items-center justify-center text-[#0D0D0D] font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
                  О
                </div>
                <div className="text-left">
                  <p className="text-[var(--text-primary)] font-medium">Олена Коваленко</p>
                  <p className="text-[var(--text-primary)]/var(--text-muted) text-sm">Власниця кав'ярні "Затишок", Київ</p>
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
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({ name: '', business: '', phone: '', email: '', message: '' });
    }, 1500);
  };

  return (
    <section className="py-24 bg-[var(--bg-tertiary)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left column - Info */}
          <ScrollReveal direction="left">
            <div>
              <h2 
                className="text-4xl sm:text-5xl text-[var(--text-primary)] mb-6"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Готові <span className="gradient-text">почати</span>?
              </h2>
              <p className="text-[var(--text-primary)]/var(--text-secondary) text-lg mb-10 leading-relaxed">
                Залиште заявку, і наш менеджер зв'яжеться з вами протягом години, 
                щоб обговорити деталі співпраці та відповісти на всі питання.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center shrink-0">
                    <svg className="w-6 h-6 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[var(--text-primary)] font-medium mb-1">Телефон</p>
                    <a href="tel:+380963109622" className="text-[var(--text-primary)]/var(--text-muted) hover:text-[var(--accent)] transition-colors">
                      +380 96 310 96 22
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center shrink-0">
                    <svg className="w-6 h-6 text-[var(--accent)]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-[var(--text-primary)] font-medium mb-1">Telegram</p>
                    <a href="https://t.me/booster_tea_b2b" target="_blank" rel="noopener noreferrer" className="text-[var(--text-primary)]/var(--text-muted) hover:text-[var(--accent)] transition-colors">
                      @booster_tea_b2b
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center shrink-0">
                    <svg className="w-6 h-6 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[var(--text-primary)] font-medium mb-1">Email</p>
                    <a href="mailto:office@boostertea.com.ua" className="text-[var(--text-primary)]/var(--text-muted) hover:text-[var(--accent)] transition-colors">
                      office@boostertea.com.ua
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Right column - Form */}
          <ScrollReveal direction="right">
            <div className="bg-[var(--bg-secondary)] rounded-3xl p-8 border border-[var(--card-border)]">
              {isSubmitted ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 rounded-full bg-[var(--accent)]/20 flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 
                    className="text-2xl text-[var(--text-primary)] mb-3"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    Дякуємо за заявку!
                  </h3>
                  <p className="text-[var(--text-primary)]/var(--text-muted) mb-6">
                    Наш менеджер зв'яжеться з вами протягом години.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="text-[var(--accent)] hover:text-[#7FB030] transition-colors"
                  >
                    Надіслати ще одну заявку
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-[var(--text-primary)]/80 text-sm mb-2">Ваше ім'я *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-primary)]/30 focus:border-[#9FD356] transition-colors"
                      placeholder="Як до вас звертатися?"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-[var(--text-primary)]/80 text-sm mb-2">Назва бізнесу *</label>
                    <input
                      type="text"
                      required
                      value={formData.business}
                      onChange={(e) => setFormData({ ...formData, business: e.target.value })}
                      className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-primary)]/30 focus:border-[#9FD356] transition-colors"
                      placeholder="Кав'ярня, ресторан, готель..."
                    />
                  </div>
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[var(--text-primary)]/80 text-sm mb-2">Телефон *</label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-primary)]/30 focus:border-[#9FD356] transition-colors"
                        placeholder="+380"
                      />
                    </div>
                    <div>
                      <label className="block text-[var(--text-primary)]/80 text-sm mb-2">Email</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-primary)]/30 focus:border-[#9FD356] transition-colors"
                        placeholder="email@company.com"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-[var(--text-primary)]/80 text-sm mb-2">Повідомлення</label>
                    <textarea
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-primary)]/30 focus:border-[#9FD356] transition-colors resize-none"
                      placeholder="Розкажіть про ваш бізнес та питання..."
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-[var(--accent)] text-[#0D0D0D] font-semibold rounded-xl hover:bg-[var(--accent-hover)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-[#0D0D0D]/30 border-t-[#0D0D0D] rounded-full animate-spin" />
                        Надсилаємо...
                      </>
                    ) : (
                      <>
                        Надіслати заявку
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </>
                    )}
                  </button>
                  
                  <p className="text-[var(--text-primary)]/var(--text-subtle) text-xs text-center">
                    Натискаючи кнопку, ви погоджуєтесь з{' '}
                    <Link href="/privacy" className="text-[var(--accent)] hover:underline">
                      політикою конфіденційності
                    </Link>
                  </p>
                </form>
              )}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default Adaptation;
