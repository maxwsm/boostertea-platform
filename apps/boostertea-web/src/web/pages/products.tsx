import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Toast from '../components/Toast';
import TelegramButton from '../components/TelegramButton';
import ProductCard from '../components/ProductCard';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { products, accessoryProducts, useStore } from '../lib/store';
import { useTranslation } from '../lib/i18n';
import { SEO, useSEOConfig } from '../components/SEO';

const Products = () => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [volumeFilter, setVolumeFilter] = useState<string>('all');
  const { t } = useTranslation();
  const { addAccessoryToCart } = useStore();
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
                <ProductCard key={product.id} product={product} index={index} defaultVolume={volumeFilter} />
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

        
        {/* Accessories Section */}
        <section className="py-24 bg-[var(--bg-tertiary)] border-t border-[var(--border)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#8B7355]/20 text-[#8B7355] text-sm font-medium mb-4">
                🛍️ Аксесуари та Сухий чай
              </span>
              <h2 
                className="text-4xl sm:text-5xl text-[var(--text-primary)] mb-4"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Все для <span className="text-[#8B7355]">ідеального</span> чаювання
              </h2>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {accessoryProducts.map((product, index) => (
                    <div key={product.id} className="group bg-gradient-to-b from-[#1A1A1A] to-[#141414] rounded-2xl overflow-hidden border border-[var(--card-border)] hover:border-[#8B7355]/30 transition-all duration-300">
                      <div className="relative aspect-square p-6 bg-gradient-to-br from-[#F5F0E8]/5 to-transparent overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-8xl opacity-30 grayscale">{
                            product.subcategory === 'thermos' ? '🧴' :
                            product.subcategory === 'mug' ? '☕' :
                            product.subcategory === 'cup' ? '🍵' :
                            product.subcategory === 'piala' ? '🥣' :
                            product.subcategory === 'dry_tea' ? '🍃' : '🛍️'
                          }</span>
                        </div>
                        {product.image && (
                          <img 
                            src={product.image} 
                            alt={product.nameUk}
                            className="w-full h-full object-contain transition-all duration-500 group-hover:scale-110 relative z-10"
                          />
                        )}
                        {!product.inStock && (
                          <div className="absolute top-4 right-4 z-10">
                            <span className="px-3 py-1 bg-red-500/20 text-red-400 text-xs font-medium rounded-full">
                              Немає в наявності
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="p-5">
                        <h3 className="text-lg text-[var(--text-primary)] mb-2 group-hover:text-[#8B7355] transition-colors line-clamp-1" style={{ fontFamily: 'var(--font-heading)' }}>
                          {product.nameUk}
                        </h3>
                        <p className="text-[var(--text-primary)]/50 text-sm mb-4 line-clamp-2">
                          {product.descriptionUk}
                        </p>
                        <div className="flex items-end justify-between">
                          <p className="text-[#8B7355] text-2xl font-bold">
                            {product.price}₴
                          </p>
                          <button
                            onClick={() => addAccessoryToCart(product, 1)}
                            disabled={!product.inStock}
                            className="px-4 py-2 bg-[#8B7355] text-[var(--bg-primary)] text-sm font-semibold rounded-lg hover:bg-[#9F8465] transition-all disabled:opacity-50"
                          >
                            {t('accessories.addToCart') || 'В кошик'}
                          </button>
                        </div>
                      </div>
                    </div>
              ))}
            </div>
            
            <div className="mt-16 text-center">
               <a href="/accessories" className="inline-flex px-8 py-3 bg-[#8B7355]/20 text-[#8B7355] font-semibold rounded-full hover:bg-[#8B7355]/30 transition-colors">
                  Дивитись всі аксесуари та сухий чай
               </a>
            </div>
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
