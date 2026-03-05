import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Toast from '../components/Toast';
import TelegramButton from '../components/TelegramButton';
import ProductCard from '../components/ProductCard';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { products } from '../lib/store';
import { useTranslation } from '../lib/i18n';
import { SEO, useSEOConfig } from '../components/SEO';

const Products = () => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [volumeFilter, setVolumeFilter] = useState<string>('all');
  const { t } = useTranslation();
  const seoConfig = useSEOConfig('products');

  const categories = [
    { id: 'all', label: t('products.filters.all') },
    { id: 'energy', label: t('products.filters.energy') },
    { id: 'classic', label: t('products.filters.classic') },
    { id: 'relaxation', label: t('products.filters.relaxation') },
  ];

  const volumes = [
    { id: 'all', label: t('products.volumes.all') },
    { id: '1L', label: t('products.volumes.1l') },
    { id: '0.25L', label: t('products.volumes.025l') },
  ];

  const filteredProducts = products.filter(product => {
    if (activeFilter !== 'all' && product.category !== activeFilter) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <SEO 
        title={seoConfig.title}
        description={seoConfig.description}
        breadcrumbs={[
          { name: t('nav.home'), url: '/' },
          { name: t('nav.products'), url: '/products' }
        ]}
      />
      <Header />
      
      <main className="pt-24 pb-16">
        {/* Breadcrumbs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <Breadcrumbs 
            items={[
              { label: t('nav.home'), href: '/' },
              { label: t('nav.products') }
            ]} 
          />
        </div>

        {/* Hero */}
        <section className="py-16 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-[#9FD356]/5 to-transparent" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center mb-12">
              <h1 
                className="text-5xl sm:text-6xl text-[var(--text-primary)] mb-4"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {t('products.title')} <span className="gradient-text">{t('products.titleAccent')}</span>
              </h1>
              <p className="text-[var(--text-primary)]/var(--text-muted) text-lg max-w-2xl mx-auto">
                {t('products.subtitle')}
              </p>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12">
              {/* Category filter */}
              <div className="flex flex-wrap justify-center gap-2">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveFilter(cat.id)}
                    className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                      activeFilter === cat.id
                        ? 'bg-[var(--accent)] text-[#0D0D0D]'
                        : 'bg-[#F5F0E8]/10 text-[var(--text-primary)]/var(--text-secondary) hover:bg-[#F5F0E8]/20'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Volume filter */}
              <div className="flex gap-2">
                {volumes.map(vol => (
                  <button
                    key={vol.id}
                    onClick={() => setVolumeFilter(vol.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      volumeFilter === vol.id
                        ? 'bg-[#8B7355] text-[var(--text-primary)]'
                        : 'bg-[#F5F0E8]/5 text-[var(--text-primary)]/var(--text-muted) hover:bg-[#F5F0E8]/10'
                    }`}
                  >
                    {vol.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="pb-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-16">
                <p className="text-[var(--text-primary)]/var(--text-muted) text-lg">
                  {t('products.noProducts')}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Info Section */}
        <section className="py-16 bg-[var(--bg-tertiary)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-8 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--card-border)]">
                <div className="w-16 h-16 mx-auto mb-4 bg-[var(--accent)]/20 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                </div>
                <h3 className="text-xl text-[var(--text-primary)] mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                  {t('products.info.minOrder')}
                </h3>
                <p className="text-[var(--text-primary)]/var(--text-muted) text-sm">
                  {t('products.info.minOrderDesc1L')}<br />
                  {t('products.info.minOrderDesc025L')}
                </p>
              </div>

              <div className="text-center p-8 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--card-border)]">
                <div className="w-16 h-16 mx-auto mb-4 bg-[var(--accent)]/20 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl text-[var(--text-primary)] mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                  {t('products.info.discount')}
                </h3>
                <p className="text-[var(--text-primary)]/var(--text-muted) text-sm">
                  {t('products.info.discountDesc')}<br />
                  {t('products.info.comingSoon')}
                </p>
              </div>

              <div className="text-center p-8 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--card-border)]">
                <div className="w-16 h-16 mx-auto mb-4 bg-[var(--accent)]/20 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <h3 className="text-xl text-[var(--text-primary)] mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                  {t('products.info.freeDelivery')}
                </h3>
                <p className="text-[var(--text-primary)]/var(--text-muted) text-sm">
                  {t('products.info.freeDeliveryDesc')}<br />
                  {t('products.info.allUkraine')}
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <TelegramButton />
      <Toast />
    </div>
  );
};

export default Products;
