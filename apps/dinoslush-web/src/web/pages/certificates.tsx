import { Link } from 'wouter';
import Header from '../components/Header';
import Footer from '../components/Footer';
import TelegramButton from '../components/TelegramButton';
import { ScrollReveal } from '../components/animations';
import { useTranslation } from '../lib/i18n';
import { SEO, useSEOConfig } from '../components/SEO';

const Certificates = () => {
  const seoConfig = useSEOConfig('certificates');
  const { t } = useTranslation();

  const certifications = [
    {
      id: 'haccp',
      titleKey: 'certificates.items.haccp.title',
      descriptionKey: 'certificates.items.haccp.description',
      icon: (
        <svg className="w-16 h-16 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      badge: 'HACCP',
      color: '#9FD356'
    },
    {
      id: 'iso22000',
      titleKey: 'certificates.items.iso22000.title',
      descriptionKey: 'certificates.items.iso22000.description',
      icon: (
        <svg className="w-16 h-16 text-[#C9A55C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      ),
      badge: 'ISO 22000',
      color: '#C9A55C'
    },
    {
      id: 'lab-tested',
      titleKey: 'certificates.items.labTested.title',
      descriptionKey: 'certificates.items.labTested.description',
      icon: (
        <svg className="w-16 h-16 text-[#8B7355]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      ),
      badge: t('certificates.items.labTested.badge'),
      color: '#8B7355'
    },
    {
      id: 'natural',
      titleKey: 'certificates.items.natural.title',
      descriptionKey: 'certificates.items.natural.description',
      icon: (
        <svg className="w-16 h-16 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      badge: '100% Natural',
      color: '#9FD356'
    }
  ];

  const downloads = [
    {
      titleKey: 'certificates.downloads.haccp.title',
      descriptionKey: 'certificates.downloads.haccp.description',
      icon: '📜',
      filename: 'haccp-certificate.pdf'
    },
    {
      titleKey: 'certificates.downloads.iso.title',
      descriptionKey: 'certificates.downloads.iso.description',
      icon: '📋',
      filename: 'iso22000-certificate.pdf'
    },
    {
      titleKey: 'certificates.downloads.lab.title',
      descriptionKey: 'certificates.downloads.lab.description',
      icon: '🔬',
      filename: 'lab-results.pdf'
    },
    {
      titleKey: 'certificates.downloads.declaration.title',
      descriptionKey: 'certificates.downloads.declaration.description',
      icon: '📑',
      filename: 'conformity-declaration.pdf'
    }
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] page-transition">
      <SEO 
        title={seoConfig.title}
        description={seoConfig.description}
        breadcrumbs={[
          { name: t('nav.home'), url: '/' },
          { name: t('certificates.breadcrumb'), url: '/certificates' }
        ]}
      />
      <Header />
      
      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="py-16 relative overflow-hidden">
          <div className="absolute inset-0" style={{ background: 'var(--gradient-hero)' }} />
          <div className="absolute inset-0 tea-pattern opacity-30" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-[var(--text-muted)] mb-8">
              <Link href="/" className="hover:text-[var(--accent)] transition-colors">{t('nav.home')}</Link>
              <span>/</span>
              <span className="text-[var(--accent)]">{t('certificates.breadcrumb')}</span>
            </nav>

            <ScrollReveal>
              <div className="text-center max-w-3xl mx-auto">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--accent-subtle)] rounded-full mb-6">
                  <svg className="w-5 h-5 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span className="text-[var(--accent)] text-sm font-medium">{t('certificates.badge')}</span>
                </div>
                
                <h1 
                  className="text-4xl sm:text-5xl lg:text-6xl text-[var(--text-primary)] mb-6"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {t('certificates.title')} <span className="gradient-text">{t('certificates.titleAccent')}</span>
                </h1>
                
                <p className="text-xl text-[var(--text-secondary)] leading-relaxed">
                  {t('certificates.subtitle')}
                </p>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Certifications Grid */}
        <section className="py-16 bg-[var(--bg-tertiary)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <h2 
                className="text-3xl sm:text-4xl text-[var(--text-primary)] mb-12 text-center"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {t('certificates.ourCertifications')}
              </h2>
            </ScrollReveal>

            <div className="grid md:grid-cols-2 gap-8">
              {certifications.map((cert, index) => (
                <ScrollReveal key={cert.id} delay={index * 100}>
                  <div className="bg-[var(--bg-secondary)] rounded-2xl p-8 border border-[var(--card-border)] hover:border-[var(--border-accent)] transition-all duration-300 group">
                    <div className="flex items-start gap-6">
                      <div className="shrink-0 group-hover:scale-110 transition-transform duration-300">
                        {cert.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 
                            className="text-xl text-[var(--text-primary)]"
                            style={{ fontFamily: 'var(--font-heading)' }}
                          >
                            {t(cert.titleKey)}
                          </h3>
                          <span 
                            className="px-3 py-1 text-xs font-bold rounded-full"
                            style={{ backgroundColor: `${cert.color}20`, color: cert.color }}
                          >
                            {cert.badge}
                          </span>
                        </div>
                        <p className="text-[var(--text-muted)] leading-relaxed">
                          {t(cert.descriptionKey)}
                        </p>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Trust Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <div className="bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-tertiary)] rounded-3xl p-8 md:p-12 border border-[var(--card-border)]">
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-4 bg-[var(--accent-subtle)] rounded-2xl flex items-center justify-center">
                      <span className="text-4xl">🇺🇦</span>
                    </div>
                    <h3 className="text-xl text-[var(--text-primary)] mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                      {t('certificates.trust.madeInUkraine')}
                    </h3>
                    <p className="text-[var(--text-muted)] text-sm">
                      {t('certificates.trust.madeInUkraineDesc')}
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-4 bg-[var(--tea-gold)]/20 rounded-2xl flex items-center justify-center">
                      <svg className="w-10 h-10 text-[var(--tea-gold)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                      </svg>
                    </div>
                    <h3 className="text-xl text-[var(--text-primary)] mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                      {t('certificates.trust.labTested')}
                    </h3>
                    <p className="text-[var(--text-muted)] text-sm">
                      {t('certificates.trust.labTestedDesc')}
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-4 bg-[var(--accent-subtle)] rounded-2xl flex items-center justify-center">
                      <svg className="w-10 h-10 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl text-[var(--text-primary)] mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                      {t('certificates.trust.naturalIngredients')}
                    </h3>
                    <p className="text-[var(--text-muted)] text-sm">
                      {t('certificates.trust.naturalIngredientsDesc')}
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Download Section */}
        <section className="py-16 bg-[var(--bg-tertiary)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <div className="text-center mb-12">
                <h2 
                  className="text-3xl sm:text-4xl text-[var(--text-primary)] mb-4"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {t('certificates.download.title')}
                </h2>
                <p className="text-[var(--text-muted)]">
                  {t('certificates.download.subtitle')}
                </p>
              </div>
            </ScrollReveal>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {downloads.map((doc, index) => (
                <ScrollReveal key={index} delay={index * 100}>
                  <button 
                    className="w-full bg-[var(--bg-secondary)] rounded-xl p-6 border border-[var(--card-border)] hover:border-[var(--accent)] transition-all duration-300 group text-left"
                    onClick={() => alert(t('certificates.download.comingSoon'))}
                  >
                    <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                      {doc.icon}
                    </div>
                    <h4 className="text-[var(--text-primary)] font-medium mb-2">
                      {t(doc.titleKey)}
                    </h4>
                    <p className="text-[var(--text-muted)] text-sm mb-4">
                      {t(doc.descriptionKey)}
                    </p>
                    <div className="flex items-center gap-2 text-[var(--accent)] text-sm font-medium">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      {t('certificates.download.downloadPdf')}
                    </div>
                  </button>
                </ScrollReveal>
              ))}
            </div>

            <ScrollReveal delay={400}>
              <div className="mt-12 text-center">
                <p className="text-[var(--text-subtle)] text-sm">
                  {t('certificates.download.note')}
                </p>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <ScrollReveal>
              <h2 
                className="text-3xl sm:text-4xl text-[var(--text-primary)] mb-6"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {t('certificates.cta.title')}
              </h2>
              <p className="text-[var(--text-muted)] mb-8 max-w-2xl mx-auto">
                {t('certificates.cta.description')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/products"
                  className="px-8 py-4 bg-[var(--accent)] text-[var(--bg-primary)] font-semibold rounded-xl hover:bg-[var(--accent-hover)] transition-all"
                >
                  {t('certificates.cta.shopNow')}
                </Link>
                <Link 
                  href="/contacts"
                  className="px-8 py-4 border border-[var(--border-hover)] text-[var(--text-primary)] font-semibold rounded-xl hover:bg-[var(--theme-toggle-bg)] transition-all"
                >
                  {t('certificates.cta.contactUs')}
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </main>

      <Footer />
      <TelegramButton />
    </div>
  );
};

export default Certificates;
