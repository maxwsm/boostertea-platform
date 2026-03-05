import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Toast from '../components/Toast';
import TelegramButton from '../components/TelegramButton';
import { Link } from 'wouter';
import { useTranslation } from '../lib/i18n';
import { SEO, useSEOConfig } from '../components/SEO';
import { ScrollReveal } from '../components/animations';
import { useStore, Accessory, accessoryProducts } from '../lib/store';

const Accessories = () => {
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [products, setProducts] = useState<Accessory[]>(accessoryProducts);
  const [isLoading, setIsLoading] = useState(false);
  const { t, language } = useTranslation();
  const { addAccessoryToCart } = useStore();
  const seoConfig = useSEOConfig('accessories');

  const categories = [
    { id: 'all', label: t('accessories.filters.all'), icon: '🛍️' },
    { id: 'thermos', label: t('accessories.filters.thermoses'), icon: '🧴' },
    { id: 'mug', label: t('accessories.filters.mugs'), icon: '☕' },
    { id: 'cup', label: t('accessories.filters.cups'), icon: '🍵' },
    { id: 'piala', label: t('accessories.filters.pialas'), icon: '🥣' },
    { id: 'dry_tea', label: t('accessories.filters.dryTea'), icon: '🍃' },
  ];

  const sortOptions = [
    { id: 'featured', label: t('accessories.sort.featured') },
    { id: 'price_asc', label: t('accessories.sort.priceAsc') },
    { id: 'price_desc', label: t('accessories.sort.priceDesc') },
    { id: 'name', label: t('accessories.sort.name') },
  ];

  const filteredProducts = products
    .filter(product => {
      if (categoryFilter !== 'all' && product.subcategory !== categoryFilter) return false;
      if (product.price < priceRange[0] || product.price > priceRange[1]) return false;
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price_asc': return a.price - b.price;
        case 'price_desc': return b.price - a.price;
        case 'name': return a.nameUk.localeCompare(b.nameUk);
        default: return 0;
      }
    });

  const getProductName = (product: Accessory) => {
    if (language === 'en') return product.nameEn || product.nameUk;
    if (language === 'es') return product.nameEs || product.nameUk;
    return product.nameUk;
  };

  const getProductDescription = (product: Accessory) => {
    if (language === 'en') return product.descriptionEn || product.descriptionUk;
    if (language === 'es') return product.descriptionEs || product.descriptionUk;
    return product.descriptionUk;
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <SEO 
        title={seoConfig.title}
        description={seoConfig.description}
        breadcrumbs={[
          { name: t('nav.home'), url: '/' },
          { name: t('nav.accessories'), url: '/accessories' }
        ]}
      />
      <Header />
      
      <main className="pt-24 pb-16">
        {/* Hero */}
        <section className="py-16 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-[#8B7355]/10 to-transparent" />
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[var(--accent)]/20 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-[#8B7355]/20 rounded-full blur-3xl" />
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <ScrollReveal>
              <div className="text-center mb-12">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#8B7355]/20 text-[var(--secondary)] text-sm font-medium mb-6">
                  🛍️ {t('accessories.badge')}
                </span>
                <h1 
                  className="text-5xl sm:text-6xl text-[var(--text-primary)] mb-4"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {t('accessories.title')} <span className="text-[var(--secondary)]">{t('accessories.titleAccent')}</span>
                </h1>
                <p className="text-[var(--text-primary)]/var(--text-muted) text-lg max-w-2xl mx-auto">
                  {t('accessories.subtitle')}
                </p>
              </div>
            </ScrollReveal>

            {/* Filters */}
            <ScrollReveal delay={0.1}>
              <div className="bg-[var(--bg-secondary)]/80 backdrop-blur-sm rounded-2xl p-6 border border-[var(--card-border)] mb-8">
                <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
                  {/* Category filter */}
                  <div className="flex flex-wrap gap-2">
                    {categories.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => setCategoryFilter(cat.id)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                          categoryFilter === cat.id
                            ? 'bg-[#8B7355] text-[var(--text-primary)]'
                            : 'bg-[#F5F0E8]/10 text-[var(--text-primary)]/var(--text-secondary) hover:bg-[#F5F0E8]/20'
                        }`}
                      >
                        <span>{cat.icon}</span>
                        {cat.label}
                      </button>
                    ))}
                  </div>

                  {/* Price range & sort */}
                  <div className="flex flex-wrap items-center gap-4">
                    {/* Price range */}
                    <div className="flex items-center gap-2 bg-[var(--bg-primary)] rounded-xl px-4 py-2">
                      <span className="text-[var(--text-primary)]/var(--text-muted) text-sm">{t('accessories.priceRange')}:</span>
                      <input
                        type="number"
                        value={priceRange[0]}
                        onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                        className="w-20 px-2 py-1 bg-transparent border border-[var(--border)] rounded text-[var(--text-primary)] text-sm"
                        min={0}
                      />
                      <span className="text-[var(--text-primary)]/30">—</span>
                      <input
                        type="number"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                        className="w-20 px-2 py-1 bg-transparent border border-[var(--border)] rounded text-[var(--text-primary)] text-sm"
                        min={0}
                      />
                      <span className="text-[var(--text-primary)]/var(--text-muted) text-sm">₴</span>
                    </div>

                    {/* Sort */}
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-4 py-2 bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] text-sm"
                    >
                      {sortOptions.map(opt => (
                        <option key={opt.id} value={opt.id}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Products Grid */}
        <section className="pb-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Results count */}
            <p className="text-[var(--text-primary)]/var(--text-subtle) text-sm mb-6">
              {t('accessories.found')}: {filteredProducts.length} {t('accessories.items')}
            </p>

            {isLoading ? (
              <div className="flex justify-center py-20">
                <div className="w-12 h-12 border-2 border-[#8B7355] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product, index) => (
                  <ScrollReveal key={product.id} delay={index * 0.05}>
                    <div className="group bg-gradient-to-b from-[#1A1A1A] to-[#141414] rounded-2xl overflow-hidden border border-[var(--card-border)] hover:border-[#8B7355]/30 transition-all duration-300">
                      {/* Product Image */}
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
                            alt={getProductName(product)}
                            className="w-full h-full object-contain transition-all duration-500 group-hover:scale-110 relative z-10"
                          />
                        )}
                        
                        {/* Category badge */}
                        <div className="absolute top-4 left-4 z-10">
                          <span className="px-3 py-1 bg-[#8B7355]/20 text-[var(--secondary)] text-xs font-medium rounded-full backdrop-blur-sm">
                            {categories.find(c => c.id === product.subcategory)?.label || product.subcategory}
                          </span>
                        </div>

                        {/* Stock badge */}
                        {!product.inStock && (
                          <div className="absolute top-4 right-4 z-10">
                            <span className="px-3 py-1 bg-red-500/20 text-red-400 text-xs font-medium rounded-full">
                              {t('accessories.outOfStock')}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="p-5">
                        <h3 
                          className="text-lg text-[var(--text-primary)] mb-2 group-hover:text-[var(--secondary)] transition-colors line-clamp-1"
                          style={{ fontFamily: 'var(--font-heading)' }}
                        >
                          {getProductName(product)}
                        </h3>
                        
                        <p className="text-[var(--text-primary)]/var(--text-muted) text-sm mb-4 line-clamp-2">
                          {getProductDescription(product)}
                        </p>

                        {/* Price and CTA */}
                        <div className="flex items-end justify-between">
                          <div>
                            <p className="text-[var(--secondary)] text-2xl font-bold">
                              {product.price}₴
                            </p>
                          </div>
                          
                          <button
                            onClick={() => addAccessoryToCart(product, 1)}
                            disabled={!product.inStock}
                            className="relative px-4 py-2 bg-[#8B7355] text-[var(--text-primary)] text-sm font-semibold rounded-lg hover:bg-[#9F8465] transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group/btn"
                          >
                            <span className="relative z-10">{t('accessories.addToCart')}</span>
                            <div className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-500 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <span className="text-6xl mb-4 block">🫖</span>
                <p className="text-[var(--text-primary)]/var(--text-muted) text-lg mb-4">
                  {t('accessories.noProducts')}
                </p>
                <button
                  onClick={() => {
                    setCategoryFilter('all');
                    setPriceRange([0, 2000]);
                  }}
                  className="px-6 py-2 bg-[#8B7355]/20 text-[var(--secondary)] rounded-lg hover:bg-[#8B7355]/30 transition-colors"
                >
                  {t('accessories.resetFilters')}
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Promo Section */}
        <section className="py-16 bg-[var(--bg-tertiary)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-8">
              <ScrollReveal>
                <div className="bg-gradient-to-br from-[#8B7355]/20 to-[#8B7355]/5 rounded-2xl p-8 border border-[#8B7355]/20">
                  <span className="text-4xl mb-4 block">🎁</span>
                  <h3 className="text-2xl text-[var(--text-primary)] mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
                    {t('accessories.promo.giftTitle')}
                  </h3>
                  <p className="text-[var(--text-primary)]/var(--text-muted) mb-6">
                    {t('accessories.promo.giftDesc')}
                  </p>
                  <Link
                    href="/products"
                    className="inline-flex items-center gap-2 text-[var(--secondary)] font-medium hover:text-[#9F8465] transition-colors"
                  >
                    {t('accessories.promo.viewTeas')}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.1}>
                <div className="bg-gradient-to-br from-[#9FD356]/20 to-[#9FD356]/5 rounded-2xl p-8 border border-[#9FD356]/20">
                  <span className="text-4xl mb-4 block">🍃</span>
                  <h3 className="text-2xl text-[var(--text-primary)] mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
                    {t('accessories.promo.dryTeaTitle')}
                  </h3>
                  <p className="text-[var(--text-primary)]/var(--text-muted) mb-6">
                    {t('accessories.promo.dryTeaDesc')}
                  </p>
                  <button
                    onClick={() => setCategoryFilter('dry_tea')}
                    className="inline-flex items-center gap-2 text-[var(--accent)] font-medium hover:text-[#7FB030] transition-colors"
                  >
                    {t('accessories.promo.viewDryTea')}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </ScrollReveal>
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

export default Accessories;
