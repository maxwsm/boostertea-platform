import Header from '../components/Header';
import Footer from '../components/Footer';
import Toast from '../components/Toast';
import TelegramButton from '../components/TelegramButton';
import { SEO } from '../components/SEO';
import { useTranslation } from '../lib/i18n';
import { ScrollReveal } from '../components/animations';

const Terms = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <SEO 
        title={`${t('legal.terms.title')} | DinoSlush`}
        description={t('legal.terms.description')}
        noIndex={false}
      />
      <Header />
      
      <main className="pt-24 pb-16">
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <h1 
                className="text-4xl sm:text-5xl text-[var(--text-primary)] mb-8"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {t('legal.terms.title')}
              </h1>
              
              <div className="prose prose-lg prose-invert max-w-none">
                <p className="text-[var(--text-muted)] mb-8">
                  {t('legal.lastUpdated')}: 01.02.2025
                </p>
                
                <div className="space-y-8 text-[var(--text-primary)]/80">
                  <section>
                    <h2 className="text-2xl text-[var(--text-primary)] mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
                      {t('legal.terms.section1.title')}
                    </h2>
                    <p>{t('legal.terms.section1.content')}</p>
                  </section>
                  
                  <section>
                    <h2 className="text-2xl text-[var(--text-primary)] mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
                      {t('legal.terms.section2.title')}
                    </h2>
                    <p>{t('legal.terms.section2.content')}</p>
                  </section>
                  
                  <section>
                    <h2 className="text-2xl text-[var(--text-primary)] mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
                      {t('legal.terms.section3.title')}
                    </h2>
                    <p>{t('legal.terms.section3.content')}</p>
                    <ul className="list-disc list-inside mt-4 space-y-2">
                      <li>{t('legal.terms.section3.item1')}</li>
                      <li>{t('legal.terms.section3.item2')}</li>
                      <li>{t('legal.terms.section3.item3')}</li>
                    </ul>
                  </section>
                  
                  <section>
                    <h2 className="text-2xl text-[var(--text-primary)] mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
                      {t('legal.terms.section4.title')}
                    </h2>
                    <p>{t('legal.terms.section4.content')}</p>
                  </section>
                  
                  <section>
                    <h2 className="text-2xl text-[var(--text-primary)] mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
                      {t('legal.terms.section5.title')}
                    </h2>
                    <p>{t('legal.terms.section5.content')}</p>
                  </section>
                  
                  <section className="bg-[var(--accent)]/10 rounded-2xl p-6 border border-[var(--border-accent)]">
                    <h2 className="text-xl text-[var(--accent)] mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                      🛡️ {t('legal.terms.haccp.title')}
                    </h2>
                    <p className="text-[var(--text-muted)]">{t('legal.terms.haccp.content')}</p>
                  </section>
                  
                  <section className="bg-[var(--bg-secondary)] rounded-2xl p-6 border border-[var(--card-border)]">
                    <h2 className="text-xl text-[var(--text-primary)] mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                      {t('legal.contact.title')}
                    </h2>
                    <p className="text-[var(--text-muted)]">{t('legal.contact.content')}</p>
                    <p className="mt-4">
                      <strong>Email:</strong> office@boostertea.com.ua<br/>
                      <strong>{t('contacts.phone')}:</strong> +380 96 310 96 22
                    </p>
                  </section>
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

export default Terms;
