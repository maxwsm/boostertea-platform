import Header from '../components/Header';
import Footer from '../components/Footer';
import Toast from '../components/Toast';
import TelegramButton from '../components/TelegramButton';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { SEO, useSEOConfig } from '../components/SEO';
import { useTranslation } from '../lib/i18n';
import { ScrollReveal } from '../components/animations';

const Contacts = () => {
  const seoConfig = useSEOConfig('contacts');
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <SEO 
        title={seoConfig.title}
        description={seoConfig.description}
        breadcrumbs={[
          { name: t('nav.home'), url: '/' },
          { name: t('nav.contacts'), url: '/contacts' }
        ]}
      />
      <Header />
      
      <main className="pt-24 pb-16">
        {/* Breadcrumbs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <Breadcrumbs 
            items={[
              { label: t('nav.home'), href: '/' },
              { label: t('nav.contacts') }
            ]} 
          />
        </div>

        {/* Hero */}
        <section className="py-16 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-[#9FD356]/5 to-transparent" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <ScrollReveal>
              <div className="text-center mb-16">
                <h1 
                  className="text-5xl sm:text-6xl text-[var(--text-primary)] mb-4"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {t('contacts.title')} <span className="gradient-text">{t('contacts.titleAccent')}</span>
                </h1>
                <p className="text-[var(--text-muted)] text-lg max-w-2xl mx-auto">
                  {t('contacts.subtitle')}
                </p>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Contact Methods */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Phone */}
              <ScrollReveal delay={0}>
                <a 
                  href="tel:+380963109622"
                  className="bg-[var(--bg-secondary)] rounded-2xl p-8 border border-[var(--card-border)] hover:border-[var(--border-accent)] transition-all group block h-full"
                >
                  <div className="w-14 h-14 bg-[var(--accent)]/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <svg className="w-7 h-7 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <h3 className="text-[var(--text-primary)] text-lg font-medium mb-2">{t('contacts.phone')}</h3>
                  <p className="text-[var(--accent)] font-semibold">+380 96 310 96 22</p>
                </a>
              </ScrollReveal>

              {/* Email */}
              <ScrollReveal delay={100}>
                <a 
                  href="mailto:office@boostertea.com.ua"
                  className="bg-[var(--bg-secondary)] rounded-2xl p-8 border border-[var(--card-border)] hover:border-[var(--border-accent)] transition-all group block h-full"
                >
                  <div className="w-14 h-14 bg-[#C9A55C]/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <svg className="w-7 h-7 text-[#C9A55C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-[var(--text-primary)] text-lg font-medium mb-2">{t('contacts.email')}</h3>
                  <p className="text-[#C9A55C] font-semibold break-all">office@boostertea.com.ua</p>
                </a>
              </ScrollReveal>

              {/* Telegram */}
              <ScrollReveal delay={200}>
                <a 
                  href="https://t.me/booster_tea_ua"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[var(--bg-secondary)] rounded-2xl p-8 border border-[var(--card-border)] hover:border-[var(--border-accent)] transition-all group block h-full"
                >
                  <div className="w-14 h-14 bg-[#0088cc]/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <svg className="w-7 h-7 text-[#0088cc]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                    </svg>
                  </div>
                  <h3 className="text-[var(--text-primary)] text-lg font-medium mb-2">{t('contacts.telegram')}</h3>
                  <p className="text-[#0088cc] font-semibold">@booster_tea_ua</p>
                </a>
              </ScrollReveal>

              {/* Address */}
              <ScrollReveal delay={300}>
                <div className="bg-[var(--bg-secondary)] rounded-2xl p-8 border border-[var(--card-border)] h-full">
                  <div className="w-14 h-14 bg-[#8B7355]/20 rounded-xl flex items-center justify-center mb-6">
                    <svg className="w-7 h-7 text-[var(--secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h3 className="text-[var(--text-primary)] text-lg font-medium mb-2">{t('contacts.address')}</h3>
                  <p className="text-[var(--secondary)] font-semibold">{t('contacts.map.address')}</p>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Contact Form & Social */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <ScrollReveal>
                <div className="bg-[var(--bg-secondary)] rounded-2xl p-8 border border-[var(--card-border)]">
                  <h2 
                    className="text-2xl text-[var(--text-primary)] mb-6"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {t('contacts.form.title')}
                  </h2>
                  
                  <form className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[var(--text-muted)] text-sm mb-2">{t('contacts.form.name')}</label>
                        <input 
                          type="text"
                          placeholder={t('contacts.form.namePlaceholder')}
                          className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] placeholder-[var(--text-subtle)] focus:border-[var(--accent)] focus:outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-[var(--text-muted)] text-sm mb-2">{t('contacts.form.email')}</label>
                        <input 
                          type="email"
                          placeholder={t('contacts.form.emailPlaceholder')}
                          className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] placeholder-[var(--text-subtle)] focus:border-[var(--accent)] focus:outline-none transition-colors"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-[var(--text-muted)] text-sm mb-2">{t('contacts.form.subject')}</label>
                      <select className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] focus:border-[var(--accent)] focus:outline-none transition-colors">
                        <option value="">{t('contacts.form.subjectPlaceholder')}</option>
                        <option value="order">{t('contacts.form.subjectOrder')}</option>
                        <option value="b2b">{t('contacts.form.subjectB2B')}</option>
                        <option value="product">{t('contacts.form.subjectProduct')}</option>
                        <option value="other">{t('contacts.form.subjectOther')}</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-[var(--text-muted)] text-sm mb-2">{t('contacts.form.message')}</label>
                      <textarea 
                        rows={5}
                        placeholder={t('contacts.form.messagePlaceholder')}
                        className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] placeholder-[var(--text-subtle)] resize-none focus:border-[var(--accent)] focus:outline-none transition-colors"
                      />
                    </div>
                    
                    <button 
                      type="submit"
                      className="w-full py-4 bg-[var(--accent)] text-[#0D0D0D] font-bold rounded-xl hover:bg-[var(--accent-hover)] transition-all"
                    >
                      {t('contacts.form.submit')}
                    </button>
                  </form>
                </div>
              </ScrollReveal>

              {/* Social & Info */}
              <div className="space-y-8">
                {/* Social links */}
                <ScrollReveal delay={100}>
                  <div className="bg-[var(--bg-secondary)] rounded-2xl p-8 border border-[var(--card-border)]">
                    <h2 
                      className="text-2xl text-[var(--text-primary)] mb-6"
                      style={{ fontFamily: 'var(--font-heading)' }}
                    >
                      {t('contacts.socialTitle')}
                    </h2>
                    
                    <div className="space-y-4">
                      <a 
                        href="https://instagram.com/booster_tea_ua"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-4 p-4 bg-[var(--bg-primary)] rounded-xl hover:bg-[var(--theme-toggle-hover)] transition-colors group"
                      >
                        <div className="w-12 h-12 bg-gradient-to-br from-[#f09433] via-[#e6683c] to-[#bc1888] rounded-xl flex items-center justify-center">
                          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                          </svg>
                        </div>
                        <div className="flex-1">
                          <p className="text-[var(--text-primary)] font-medium group-hover:text-[var(--accent)] transition-colors">Instagram</p>
                          <p className="text-[var(--text-muted)] text-sm">@booster_tea_ua</p>
                        </div>
                        <svg className="w-5 h-5 text-[var(--text-subtle)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </a>

                      <a 
                        href="https://tiktok.com/@booster_tea"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-4 p-4 bg-[var(--bg-primary)] rounded-xl hover:bg-[var(--theme-toggle-hover)] transition-colors group"
                      >
                        <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
                          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
                          </svg>
                        </div>
                        <div className="flex-1">
                          <p className="text-[var(--text-primary)] font-medium group-hover:text-[var(--accent)] transition-colors">TikTok</p>
                          <p className="text-[var(--text-muted)] text-sm">@booster_tea</p>
                        </div>
                        <svg className="w-5 h-5 text-[var(--text-subtle)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </a>

                      <a 
                        href="https://t.me/booster_tea_ua"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-4 p-4 bg-[var(--bg-primary)] rounded-xl hover:bg-[var(--theme-toggle-hover)] transition-colors group"
                      >
                        <div className="w-12 h-12 bg-[#0088cc] rounded-xl flex items-center justify-center">
                          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                          </svg>
                        </div>
                        <div className="flex-1">
                          <p className="text-[var(--text-primary)] font-medium group-hover:text-[var(--accent)] transition-colors">Telegram</p>
                          <p className="text-[var(--text-muted)] text-sm">@booster_tea_ua</p>
                        </div>
                        <svg className="w-5 h-5 text-[var(--text-subtle)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </ScrollReveal>

                {/* Working hours */}
                <ScrollReveal delay={200}>
                  <div className="bg-[var(--bg-secondary)] rounded-2xl p-8 border border-[var(--card-border)]">
                    <h2 
                      className="text-2xl text-[var(--text-primary)] mb-6"
                      style={{ fontFamily: 'var(--font-heading)' }}
                    >
                      {t('contacts.workingHours.title')}
                    </h2>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-[var(--text-muted)]">{t('contacts.workingHours.monFri')}</span>
                        <span className="text-[var(--accent)] font-medium">09:00 - 18:00</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--text-muted)]">{t('contacts.workingHours.saturday')}</span>
                        <span className="text-[var(--accent)] font-medium">10:00 - 15:00</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--text-muted)]">{t('contacts.workingHours.sunday')}</span>
                        <span className="text-[var(--text-subtle)]">{t('contacts.workingHours.closed')}</span>
                      </div>
                    </div>
                    
                    <p className="text-[var(--text-muted)] text-sm mt-6">
                      {t('contacts.workingHours.telegramSupport')}
                    </p>
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </div>
        </section>

        {/* Map */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <div className="bg-[var(--bg-secondary)] rounded-2xl overflow-hidden border border-[var(--card-border)]">
                <div className="aspect-video relative">
                  <iframe 
                    src="https://www.openstreetmap.org/export/embed.html?bbox=24.02238%2C49.84186%2C24.03538%2C49.84886&amp;layer=mapnik&amp;marker=49.84536%2C24.02888"
                    className="absolute inset-0 w-full h-full border-0"
                    style={{ filter: 'var(--map-filter, none)' }}
                    loading="lazy"
                    title={t('contacts.map.title')}
                  />
                </div>
                <div className="p-4 text-center border-t border-[var(--border)]">
                  <p className="text-[var(--text-primary)] font-medium">{t('contacts.map.address')}</p>
                  <a 
                    href="https://www.openstreetmap.org/?mlat=49.84536&mlon=24.02888#map=17/49.84536/24.02888"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--accent)] text-sm hover:underline mt-1 inline-block"
                  >
                    {t('contacts.map.title')} →
                  </a>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </main>

      <Footer />
      <TelegramButton />
      <Toast />
    </div>
  );
};

export default Contacts;
