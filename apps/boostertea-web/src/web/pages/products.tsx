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
          <div className="absolute inset-0 bg-gradient-to-b from-[#141414] to-transparent noise-overlay opacity-30" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center mb-16">
              <span className="text-[#C4956A] font-mono text-xs uppercase tracking-[0.3em] font-bold mb-4 block">Bio-Catalog</span>
              <h1 className="archival-heading text-5xl sm:text-7xl text-white mb-6 uppercase tracking-tight">
                {t('products.title')} <span className="text-[#C4956A]">{t('products.titleAccent')}</span>
              </h1>
              <p className="text-[#A89880] text-lg max-w-2xl mx-auto font-medium">
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
                    className={`px-6 py-2.5 rounded-xl text-xs uppercase tracking-widest font-bold transition-all ${
                      activeFilter === cat.id
                        ? 'bg-[#C4956A] text-black shadow-[0_0_15px_rgba(196,149,106,0.3)]'
                        : 'bg-white/5 text-[#A89880] hover:bg-white/10 hover:text-white'
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
                    className={`px-5 py-2.5 rounded-xl text-xs uppercase tracking-widest font-bold transition-all ${
                      volumeFilter === vol.id
                        ? 'bg-white text-black'
                        : 'bg-white/5 text-[#A89880] hover:bg-white/10 hover:text-white'
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
        <section className="pb-24 relative z-10 noise-overlay">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bento-grid">
              {filteredProducts.map((product, index) => (
                <div key={product.id} className={index === 0 ? "md:col-span-2" : ""}>
                   <ProductCard product={product} index={index} defaultVolume={volumeFilter} isHero={index === 0} />
                </div>
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
        {accessoryProducts && accessoryProducts.length > 0 && (
          <section className="py-24 relative z-10 border-t border-white/5">
            <div className="absolute inset-0 bg-[#050505] opacity-50" />
            <div className="absolute inset-0 noise-overlay opacity-30" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="text-center mb-16">
                <span className="text-[#C4956A] font-mono text-xs uppercase tracking-[0.3em] font-bold mb-4 block">Hardware & Add-ons</span>
                <h2 className="archival-heading text-4xl sm:text-5xl text-white mb-6 uppercase tracking-tight">
                  Сухий Чай та <span className="text-[#C4956A]">Аксесуари</span>
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {accessoryProducts.map((acc, index) => (
                  <article
                    key={acc.id}
                    className="bento-card group relative overflow-hidden transition-all duration-500 shadow-2xl flex flex-col h-full bg-[#0a0a0c]"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="absolute inset-0 noise-overlay opacity-30 mix-blend-overlay pointer-events-none" />
                    
                    <figure className="relative bg-[#050505] overflow-hidden m-0 aspect-square p-6 border-b border-white/5">
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-transparent to-transparent z-10 opacity-90 pointer-events-none" />
                      <div className="absolute inset-0 flex items-center justify-center z-0 p-8">
                        <img
                          src={acc.image || 'https://placehold.co/400x400/050505/C4956A?text=Image+Not+Found'}
                          alt={acc.nameUk}
                          loading="lazy"
                          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700 ease-out drop-shadow-[0_20px_20px_rgba(0,0,0,1)] relative z-10"
                        />
                      </div>
                    </figure>

                    <div className="p-6 flex flex-col flex-grow relative z-20">
                      <h3 className="archival-heading text-white mb-2 text-xl hover:opacity-80 transition-opacity">
                        {acc.nameUk}
                      </h3>
                      <p className="text-[#A89880] mb-5 text-sm line-clamp-3 leading-relaxed flex-grow">
                        {acc.descriptionUk}
                      </p>

                      <div className="mt-auto">
                        <div className="flex justify-between items-end mb-4 bg-white/5 p-3 rounded-xl border border-white/5">
                           <span className="text-[10px] uppercase font-mono tracking-widest text-[#A89880]">Ціна</span>
                           <span className="data-heavy text-[#E8DDD0] text-2xl tracking-tight" style={{ textShadow: `0 0 10px rgba(196,149,106,0.4)` }}>
                             {acc.price} ₴
                           </span>
                        </div>
                        <button
                          onClick={(e) => { e.preventDefault(); addAccessoryToCart(acc, 1); }}
                          className="w-full relative py-4 bg-white/5 hover:bg-[#C4956A] text-[#E8DDD0] hover:text-black text-xs font-black uppercase tracking-[0.2em] rounded-xl transition-all duration-300 flex items-center justify-center gap-3 group border border-white/10 hover:border-transparent active:scale-[0.98]"
                        >
                          <span>До кошика</span>
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}
        
        {/* Info Section */}
        <section className="py-24 bg-[#0a0a0c] relative overflow-hidden">
          <div className="absolute inset-0 noise-overlay opacity-50" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="bento-grid grid-cols-1 md:grid-cols-3">
              <div className="bento-card text-center p-10 flex flex-col items-center">
                <div className="w-20 h-20 mb-6 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.05)]">
                  <svg className="w-8 h-8 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                </div>
                <h3 className="archival-heading text-2xl text-white mb-3">
                  {t('products.info.minOrder')}
                </h3>
                <p className="text-[#A89880] text-sm">
                  {t('products.info.minOrderDesc1L')}<br />
                  {t('products.info.minOrderDesc025L')}
                </p>
              </div>

              <div className="bento-card text-center p-10 flex flex-col items-center">
                <div className="w-20 h-20 mb-6 rounded-2xl bg-[#C4956A]/10 border border-[#C4956A]/20 flex items-center justify-center shadow-[0_0_30px_rgba(196,149,106,0.1)]">
                  <svg className="w-10 h-10 text-[#C4956A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="archival-heading text-2xl text-white mb-3">
                  {t('products.info.discount')}
                </h3>
                <p className="text-[#A89880] text-sm">
                  {t('products.info.discountDesc')}<br />
                  {t('products.info.comingSoon')}
                </p>
              </div>

              <div className="bento-card text-center p-10 flex flex-col items-center">
                <div className="w-20 h-20 mb-6 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.05)]">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <h3 className="archival-heading text-2xl text-white mb-3">
                  {t('products.info.freeDelivery')}
                </h3>
                <p className="text-[#A89880] text-sm">
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
