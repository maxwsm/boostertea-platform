import { useState, useEffect, useRef } from 'react';
import { Link, useParams } from 'wouter';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Toast from '../components/Toast';
import TelegramButton from '../components/TelegramButton';
import ProductCard from '../components/ProductCard';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { products, useStore } from '../lib/store';
import { ScrollReveal, SteamParticles } from '../components/animations';
import { SEO } from '../components/SEO';
import { useI18n } from '../lib/i18n';

// Animated Brewing Guide Component
const AnimatedBrewingGuide = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { t } = useI18n();

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

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    
    const interval = setInterval(() => {
      setActiveStep(prev => (prev + 1) % 4);
    }, 2500);

    return () => clearInterval(interval);
  }, [isVisible]);

  return (
    <div ref={containerRef} className="w-full lg:w-1/2 mx-auto">
      <div className="relative bg-[var(--bg-primary)] rounded-2xl p-8 aspect-square max-w-xs mx-auto overflow-hidden">
        {/* Cup base */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-32">
          <svg viewBox="0 0 120 100" className="w-full">
            {/* Cup body */}
            <path 
              d="M20 20 L25 85 C25 92 35 98 60 98 L60 98 C85 98 95 92 95 85 L100 20 Z" 
              fill="#2A2A2A" 
              stroke="#3A3A3A" 
              strokeWidth="2"
            />
            {/* Cup handle */}
            <path 
              d="M100 30 Q118 30 118 55 Q118 78 100 78" 
              fill="none" 
              stroke="#3A3A3A" 
              strokeWidth="5"
            />
            
            {/* Tea liquid - animates based on step */}
            <path 
              d="M28 35 L32 80 C32 86 42 92 60 92 L60 92 C78 92 88 86 88 80 L92 35 Z" 
              fill="#9FD356"
              className="transition-all duration-700"
              style={{
                opacity: activeStep >= 1 ? 0.9 : 0,
                clipPath: activeStep === 1 
                  ? 'inset(70% 0 0 0)' 
                  : activeStep >= 2 
                    ? 'inset(0 0 0 0)' 
                    : 'inset(100% 0 0 0)'
              }}
            />
            
            {/* Shine */}
            <path 
              d="M35 40 L37 70" 
              stroke="rgba(255,255,255,0.1)" 
              strokeWidth="3" 
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Bottle pour animation */}
        <div 
          className={`absolute top-4 right-8 w-8 transition-all duration-700 ${
            activeStep === 0 ? 'rotate-0' : 'rotate-[-45deg]'
          }`}
          style={{ transformOrigin: 'bottom right' }}
        >
          <div className="w-8 h-20 bg-gradient-to-b from-[#9FD356] to-[#7FB030] rounded-t-lg rounded-b relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-[var(--bg-primary)] rounded-full" />
          </div>
        </div>

        {/* Drop animation */}
        {activeStep === 1 && (
          <div className="absolute top-24 right-12 w-2 h-4 bg-[var(--accent)] rounded-full animate-bounce" />
        )}

        {/* Water pour */}
        {activeStep === 2 && (
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-20 bg-gradient-to-b from-blue-400/var(--text-muted) to-transparent" />
        )}

        {/* Stirring animation */}
        {activeStep === 3 && (
          <div 
            className="absolute bottom-20 left-1/2 -translate-x-1/2 w-1 h-12 bg-[#8B7355] rounded-full origin-bottom"
            style={{ 
              animation: 'stir 0.5s ease-in-out infinite alternate',
            }}
          />
        )}

        {/* Steam on final step */}
        {activeStep === 3 && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 w-20 h-20">
            <SteamParticles count={6} />
          </div>
        )}

        {/* Step indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
          {[0, 1, 2, 3].map(step => (
            <div 
              key={step}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                step === activeStep 
                  ? 'bg-[var(--accent)] scale-125' 
                  : step < activeStep 
                    ? 'bg-[var(--accent)]/var(--text-muted)' 
                    : 'bg-[#F5F0E8]/20'
              }`}
            />
          ))}
        </div>

        <style>{`
          @keyframes stir {
            from { transform: translateX(-1/2) rotate(-15deg); }
            to { transform: translateX(-1/2) rotate(15deg); }
          }
        `}</style>
      </div>

      <p className="text-center text-[var(--text-primary)]/var(--text-muted) text-sm mt-4">
        {activeStep === 0 && t('productDetail.brewingStep1')}
        {activeStep === 1 && t('productDetail.brewingStep2')}
        {activeStep === 2 && t('productDetail.brewingStep3')}
        {activeStep === 3 && t('productDetail.brewingStep4')}
      </p>
    </div>
  );
};

const ProductDetail = () => {
  const params = useParams<{ slug: string }>();
  const product = products.find(p => p.slug === params.slug);
  const { addToCart } = useStore();
  const { language, t } = useI18n();
  
  const [selectedVolume, setSelectedVolume] = useState<'1L' | '0.25L' | 'sticks'>('1L');
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  if (!product) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center page-transition">
        <SEO 
          title={t('errors.productNotFound')}
          description={t('errors.productNotFoundDesc')}
          noIndex={true}
        />
        <div className="text-center">
          <h1 className="text-4xl text-[var(--text-primary)] mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
            {t('errors.productNotFound')}
          </h1>
          <Link href="/products" className="text-[var(--accent)] hover:underline">
            ← {t('errors.backToCatalog')}
          </Link>
        </div>
      </div>
    );
  }

  const minQuantity = 1; // B2C can buy single bottles
  const currentPrice = selectedVolume === '1L' ? product.price1L
    : selectedVolume === 'sticks' ? (product.priceSticks ?? product.price025L)
    : product.price025L;
  const totalPrice = currentPrice * quantity;

  const otherProducts = products.filter(p => p.id !== product.id);

  const handleAddToCart = () => {
    addToCart(product, selectedVolume, quantity);
  };

  // Simulated gallery images (in real app these would come from product data)
  const galleryImages = [product.image, product.image, product.image];

  // Recently viewed products
  const [recentlyViewed, setRecentlyViewed] = useState<typeof products>([]);

  // Track product view and save to recently viewed
  useEffect(() => {
    try {
      const w = window as any;
      if (w.BT_Track) w.BT_Track.viewProduct(product.name, currentPrice, product.slug);
      if (w.BoosterFunnel) w.BoosterFunnel.trackProductView(product.slug);
    } catch(e) {}
    
    // Save to recently viewed
    const RECENTLY_VIEWED_KEY = 'bt_recently_viewed';
    const stored = localStorage.getItem(RECENTLY_VIEWED_KEY);
    let viewed: string[] = stored ? JSON.parse(stored) : [];
    
    // Remove current product if exists, add to front
    viewed = viewed.filter(slug => slug !== product.slug);
    viewed.unshift(product.slug);
    
    // Keep only last 4
    viewed = viewed.slice(0, 4);
    localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(viewed));
    
    // Load recently viewed products (excluding current)
    const recentSlugs = viewed.filter(slug => slug !== product.slug);
    const recentProducts = recentSlugs
      .map(slug => products.find(p => p.slug === slug))
      .filter(Boolean) as typeof products;
    setRecentlyViewed(recentProducts);
  }, [product.slug]);

  // SEO data for the product
  const productSeoTitles: Record<string, Record<string, string>> = {
    'pu-erh': {
      uk: 'Пуер - чайний концентрат для енергії',
      en: 'Pu-erh - Energy Tea Concentrate',
      es: 'Pu-erh - Concentrado de Té Energético'
    },
    'da-hong-pao': {
      uk: 'Да Хун Пао - легендарний улун',
      en: 'Da Hong Pao - Legendary Oolong',
      es: 'Da Hong Pao - Oolong Legendario'
    },
    'gaba': {
      uk: 'ГАБА чай - для релаксації',
      en: 'GABA Tea - For Relaxation',
      es: 'Té GABA - Para Relajación'
    }
  };

  const productSeoDescriptions: Record<string, Record<string, string>> = {
    'pu-erh': {
      uk: `Пуер чайний концентрат від BoosterTea. ${product.price1L}₴ за 1л. Натуральний заряд енергії, покращення концентрації. Готовий напій за 15 секунд. Доставка по Україні.`,
      en: `Pu-erh tea concentrate by BoosterTea. ${product.price1L}₴ per 1L. Natural energy boost, focus enhancement. Ready drink in 15 seconds. Delivery across Ukraine.`,
      es: `Concentrado de té Pu-erh de BoosterTea. ${product.price1L}₴ por 1L. Energía natural, mejora la concentración. Bebida lista en 15 segundos. Entrega en toda Ucrania.`
    },
    'da-hong-pao': {
      uk: `Да Хун Пао чайний концентрат від BoosterTea. ${product.price1L}₴ за 1л. Легендарний улун "Великий Червоний Халат". Зігріваючий ефект, зняття стресу. Доставка по Україні.`,
      en: `Da Hong Pao tea concentrate by BoosterTea. ${product.price1L}₴ per 1L. Legendary "Big Red Robe" oolong. Warming effect, stress relief. Delivery across Ukraine.`,
      es: `Concentrado de té Da Hong Pao de BoosterTea. ${product.price1L}₴ por 1L. Legendario oolong "Gran Manto Rojo". Efecto cálido, alivio del estrés. Entrega en toda Ucrania.`
    },
    'gaba': {
      uk: `ГАБА чай концентрат від BoosterTea. ${product.price1L}₴ за 1л. Природна релаксація, спокійна зосередженість, покращення сну. Готовий напій за 15 секунд.`,
      en: `GABA tea concentrate by BoosterTea. ${product.price1L}₴ per 1L. Natural relaxation, calm focus, improved sleep. Ready drink in 15 seconds.`,
      es: `Concentrado de té GABA de BoosterTea. ${product.price1L}₴ por 1L. Relajación natural, concentración calmada, mejor sueño. Bebida lista en 15 segundos.`
    }
  };

  const seoTitle = productSeoTitles[product.slug]?.[language] || product.nameUk;
  const seoDescription = productSeoDescriptions[product.slug]?.[language] || product.descriptionUk;

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] page-transition">
      <SEO 
        title={seoTitle}
        description={seoDescription}
        image={product.image}
        type="product"
        product={{
          price: product.price1L,
          currency: 'UAH',
          availability: 'InStock',
          brand: 'BoosterTea',
          sku: `BT-${product.slug.toUpperCase()}-1L`,
          reviewCount: 47,
          ratingValue: 4.8
        }}
        breadcrumbs={[
          { name: t('nav.home'), url: '/' },
          { name: t('nav.products'), url: '/products' },
          { name: product.nameUk, url: `/products/${product.slug}` }
        ]}
      />
      <Header />
      
      <main id="main-content" className="pt-24 pb-16">
        {/* Breadcrumbs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Breadcrumbs 
            items={[
              { label: t('nav.home'), href: '/' },
              { label: t('nav.products'), href: '/products' },
              { label: product.nameUk }
            ]} 
          />
        </div>

        {/* Product Section */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Gallery */}
              <div>
                <div className="relative aspect-square bg-gradient-to-br from-[#1A1A1A] to-[#141414] rounded-3xl overflow-hidden mb-4">
                  <img 
                    src={galleryImages[activeImage]}
                    alt={product.nameUk}
                    className="w-full h-full object-contain p-8"
                  />
                  
                  {/* Category badge */}
                  <div className="absolute top-6 left-6">
                    <span className="px-4 py-2 bg-[var(--accent)]/20 text-[var(--accent)] text-sm font-medium rounded-full">
                      {product.category === 'energy' && '⚡ Енергія'}
                      {product.category === 'classic' && '🍵 Класика'}
                      {product.category === 'relaxation' && '🌙 Релакс'}
                    </span>
                  </div>
                </div>

                {/* Thumbnail gallery */}
                <div className="flex gap-4">
                  {galleryImages.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveImage(index)}
                      aria-label={`Переглянути зображення ${index + 1}`}
                      className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                        activeImage === index 
                          ? 'border-[#9FD356]' 
                          : 'border-transparent hover:border-[#F5F0E8]/20'
                      }`}
                    >
                      <img src={img} alt="" loading="lazy" decoding="async" className="w-full h-full object-contain bg-[var(--bg-secondary)] p-2" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Product Info */}
              <div>
                <h1 
                  className="text-5xl sm:text-6xl text-[var(--text-primary)] mb-4"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {product.nameUk}
                </h1>
                
                <p className="text-[var(--text-primary)]/var(--text-secondary) text-lg mb-8 leading-relaxed">
                  {product.descriptionUk}
                </p>

                {/* Effects */}
                <div className="mb-8">
                  <h3 className="text-[var(--text-primary)]/var(--text-muted) text-sm uppercase tracking-wider mb-3">{t('productDetail.effects')}</h3>
                  <div className="flex flex-wrap gap-3">
                    {product.effectsUk.map((effect, i) => (
                      <span 
                        key={i}
                        className="px-4 py-2 bg-[#8B7355]/20 text-[#C9A55C] rounded-lg text-sm"
                      >
                        {effect}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Volume Selector */}
                <div className="mb-8">
                  <h3 className="text-[var(--text-primary)]/var(--text-muted) text-sm uppercase tracking-wider mb-3">{t('productDetail.volume')}</h3>
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setSelectedVolume('1L');
                        setQuantity(1);
                      }}
                      className={`flex-1 py-4 rounded-xl border-2 transition-all ${
                        selectedVolume === '1L'
                          ? 'border-[#9FD356] bg-[var(--accent)]/10'
                          : 'border-[var(--border)] hover:border-[#F5F0E8]/30'
                      }`}
                    >
                      <p className="text-[var(--text-primary)] text-base font-semibold">
                        {product.isBundle ? '3× 1 л' : '1 л'}
                      </p>
                      <p className="text-[var(--accent)] font-bold">{product.price1L}₴</p>
                      <p className="text-[var(--text-muted)] text-xs mt-1">
                        {product.isBundle ? '~102 порції' : '~34 порції'}
                      </p>
                    </button>

                    <button
                      onClick={() => {
                        setSelectedVolume('0.25L');
                        setQuantity(1);
                      }}
                      className={`flex-1 py-4 rounded-xl border-2 transition-all ${
                        selectedVolume === '0.25L'
                          ? 'border-[#9FD356] bg-[var(--accent)]/10'
                          : 'border-[var(--border)] hover:border-[#F5F0E8]/30'
                      }`}
                    >
                      <p className="text-[var(--text-primary)] text-base font-semibold">
                        {product.isBundle ? '3× 0.25 л' : '0.25 л'}
                      </p>
                      <p className="text-[var(--accent)] font-bold">{product.price025L}₴</p>
                      <p className="text-[var(--text-muted)] text-xs mt-1">
                        {product.isBundle ? '~24 порції' : '~8 порцій'}
                      </p>
                    </button>

                    {product.priceSticks !== undefined && (
                      <button
                        onClick={() => {
                          setSelectedVolume('sticks');
                          setQuantity(1);
                        }}
                        className={`flex-1 py-4 rounded-xl border-2 transition-all ${
                          selectedVolume === 'sticks'
                            ? 'border-[#9FD356] bg-[var(--accent)]/10'
                            : 'border-[var(--border)] hover:border-[#F5F0E8]/30'
                        }`}
                      >
                        <p className="text-[var(--text-primary)] text-base font-semibold">
                          {product.isBundle ? '3× стіки' : 'Стіки'}
                        </p>
                        <p className="text-[var(--accent)] font-bold">{product.priceSticks}₴</p>
                        <p className="text-[var(--text-muted)] text-xs mt-1">
                          {product.isBundle ? '72 порції' : '24 порції'}
                        </p>
                      </button>
                    )}
                  </div>
                </div>

                {/* Quantity */}
                <div className="mb-8">
                  <h3 className="text-[var(--text-primary)]/var(--text-muted) text-sm uppercase tracking-wider mb-3">{t('productDetail.quantity')}</h3>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center bg-[var(--bg-secondary)] rounded-xl overflow-hidden">
                      <button
                        onClick={() => setQuantity(Math.max(minQuantity, quantity - 1))}
                        className="px-4 py-3 text-[var(--text-primary)] hover:bg-[#F5F0E8]/10 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                      </button>
                      <span className="w-16 text-center text-[var(--text-primary)] text-xl font-semibold">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="px-4 py-3 text-[var(--text-primary)] hover:bg-[#F5F0E8]/10 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Accessory Bonus Info */}
                {selectedVolume === '1L' && quantity < 3 && (
                  <div className="bg-gradient-to-r from-[#8B7355]/20 to-[#C9A55C]/20 rounded-xl p-4 mb-6 border border-[#8B7355]/30">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">🎁</span>
                      <div>
                        <p className="text-[var(--text-primary)] font-medium mb-1">
                          Додай ще {3 - quantity} л — отримай аксесуари за спецціною!
                        </p>
                        <p className="text-[var(--text-primary)]/var(--text-muted) text-sm">
                          Гамаки, рюкзаки, лампи та інше від 240₴ (замість 500₴+)
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                {selectedVolume === '1L' && quantity >= 3 && (
                  <div className="bg-gradient-to-r from-[var(--accent)]/20 to-[#9FD356]/30 rounded-xl p-4 mb-6 border border-[var(--accent)]/30">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">✨</span>
                      <div>
                        <p className="text-[var(--accent)] font-medium mb-1">
                          Аксесуари за спецціною розблоковано!
                        </p>
                        <p className="text-[var(--text-primary)]/var(--text-muted) text-sm">
                          Перейдіть в кошик, щоб додати гамак, рюкзак або лампу за собівартістю +20%
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Price Calculator */}
                <div className="bg-[var(--bg-secondary)] rounded-2xl p-6 mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[var(--text-primary)]/var(--text-secondary)">{t('productDetail.perUnit')}:</span>
                    <span className="text-[var(--text-primary)] font-semibold">{currentPrice}₴</span>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[var(--text-primary)]/var(--text-secondary)">{t('productDetail.quantity')}:</span>
                    <span className="text-[var(--text-primary)] font-semibold">{quantity} {t('productDetail.pieces')}</span>
                  </div>
                  <hr className="border-[var(--border)] my-4" />
                  <div className="flex justify-between items-center">
                    <span className="text-[var(--text-primary)] text-lg">{t('productDetail.total')}:</span>
                    <span className="text-[var(--accent)] text-3xl font-bold">{totalPrice.toLocaleString()}₴</span>
                  </div>
                </div>

                {/* Add to Cart */}
                <button
                  onClick={handleAddToCart}
                  disabled={selectedVolume === '0.25L'}
                  className="w-full py-4 bg-[var(--accent)] text-[#0D0D0D] text-lg font-bold rounded-xl hover:bg-[var(--accent-hover)] transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t('productDetail.addToCart')}
                </button>

                {/* Certification Badges */}
                <div className="mt-8 pt-8 border-t border-[var(--border)]">
                  <p className="text-[var(--text-muted)] text-sm mb-4">{t('productDetail.certifiedProducts')}:</p>
                  <div className="flex flex-wrap gap-3">
                    <Link 
                      href="/certificates"
                      className="flex items-center gap-2 px-3 py-2 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border)] hover:border-[var(--accent)] transition-colors"
                    >
                      <svg className="w-4 h-4 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      <span className="text-[var(--text-muted)] text-xs font-medium">HACCP</span>
                    </Link>
                    <Link 
                      href="/certificates"
                      className="flex items-center gap-2 px-3 py-2 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border)] hover:border-[var(--tea-gold)] transition-colors"
                    >
                      <svg className="w-4 h-4 text-[var(--tea-gold)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                      <span className="text-[var(--text-muted)] text-xs font-medium">ISO 22000</span>
                    </Link>
                    <div className="flex items-center gap-2 px-3 py-2 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border)]">
                      <span className="text-sm">🇺🇦</span>
                      <span className="text-[var(--text-muted)] text-xs font-medium">Made in Ukraine</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-2 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border)]">
                      <svg className="w-4 h-4 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-[var(--text-muted)] text-xs font-medium">100% Natural</span>
                    </div>
                  </div>
                </div>

                {/* Share Buttons */}
                <div className="mt-6 pt-6 border-t border-[var(--border)]">
                  <p className="text-[var(--text-muted)] text-sm mb-3">Поділитись:</p>
                  <div className="flex flex-wrap gap-2">
                    <a 
                      href={`https://t.me/share/url?url=${encodeURIComponent(`https://boostertea.com.ua/products/${product.slug}`)}&text=${encodeURIComponent(product.nameUk + ' — BoosterTea')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-[#0088cc] text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                      </svg>
                      Telegram
                    </a>
                    <a 
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://boostertea.com.ua/products/${product.slug}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-[#1877F2] text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                      Facebook
                    </a>
                    <a 
                      href={`viber://forward?text=${encodeURIComponent(product.nameUk + ' — BoosterTea\nhttps://boostertea.com.ua/products/' + product.slug)}`}
                      className="flex items-center gap-2 px-4 py-2 bg-[#7360F2] text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M11.4 0C9.473.028 5.333.344 3.02 2.467 1.302 4.187.58 6.773.525 9.803c-.054 3.03-.126 8.71 5.347 10.305l-.01 2.353s-.04.953.592 1.147c.76.234 1.198-.486 1.922-1.263.396-.427.943-1.055 1.357-1.536 3.723.313 6.583-.404 6.908-.504.748-.233 4.98-.787 5.666-6.42.71-5.816-.337-9.497-2.215-11.15C17.686.666 12.86-.024 11.398 0zm.312 1.778c1.32.01 5.494.455 7.22 2.115 1.512 1.42 2.084 4.618 1.5 9.453-.532 4.386-3.77 4.963-4.4 5.16-.27.082-2.6.653-5.686.465 0 0-2.248 2.718-2.95 3.424-.107.11-.237.152-.322.132-.123-.03-.156-.174-.156-.385l.022-3.7c-4.4-1.285-4.147-5.79-4.1-8.267.046-2.477.624-4.622 2.025-5.99 1.896-1.772 5.526-2.418 6.847-2.408zm-.426 2.515c-.087-.005-.176.05-.19.193-.014.143.063.337.166.337.867.08 1.6.35 2.203.834.597.477 1.014 1.135 1.244 1.97.012.064.083.178.19.216.107.037.193-.037.208-.107.105-.48-.205-1.665-1.073-2.43-.637-.56-1.462-.926-2.514-.998-.08-.008-.153-.01-.233-.015zm.001 1.03c-.08-.006-.163.04-.178.166-.016.125.05.28.148.295.585.054 1.063.23 1.443.534.377.298.646.713.803 1.235.015.075.083.176.172.207.09.03.17-.03.19-.107.082-.32-.1-1.168-.694-1.717-.405-.373-.94-.553-1.658-.605-.078-.005-.146-.003-.226-.008zm.22 1.017c-.084-.005-.174.046-.19.17-.017.124.048.27.145.283.345.032.613.135.815.315.2.177.33.42.39.732.016.096.098.174.187.187s.168-.048.187-.148c.066-.36-.054-.808-.437-1.158-.278-.254-.639-.339-1.097-.382zm-2.04.48c-.273-.005-.6.065-.978.227-.565.24-1.125.996-1.122 1.59.003.254.094.532.288.843.193.31.45.64.757.98 1.524 1.618 3.627 3.357 3.867 3.512.24.155.484.237.728.24.245.003.49-.072.733-.21.46-.26.88-.94 1.056-1.445.177-.507-.082-.838-.46-1.013-.37-.17-.74-.34-1.088-.5-.334-.15-.513-.105-.678.104-.166.21-.556.69-.697.844-.14.154-.337.167-.498.07-.162-.097-.728-.37-1.298-.833-.57-.463-1.043-1.023-1.213-1.258-.156-.214-.068-.405.06-.555.13-.15.35-.39.487-.572.138-.182.15-.378-.01-.582-.16-.204-.616-.834-.915-1.282-.265-.397-.483-.414-.715-.417-.04 0-.076-.004-.123-.002-.047-.003-.091.005-.18.003z"/>
                      </svg>
                      Viber
                    </a>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(`https://boostertea.com.ua/products/${product.slug}`);
                        alert('Посилання скопійовано!');
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-lg text-sm font-medium hover:bg-[var(--bg-tertiary)] transition-colors border border-[var(--border)]"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                      </svg>
                      Копіювати
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Details Section */}
        <section className="py-16 bg-[var(--bg-tertiary)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-[var(--bg-secondary)] rounded-2xl p-8 border border-[var(--card-border)]">
                <div className="w-12 h-12 bg-[var(--accent)]/20 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl text-[var(--text-primary)] mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                  Час приготування
                </h3>
                <p className="text-[var(--accent)] text-2xl font-bold">{product.brewingTime}</p>
              </div>

              <div className="bg-[var(--bg-secondary)] rounded-2xl p-8 border border-[var(--card-border)]">
                <div className="w-12 h-12 bg-[#C9A55C]/20 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-[#C9A55C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl text-[var(--text-primary)] mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                  Температура води
                </h3>
                <p className="text-[#C9A55C] text-2xl font-bold">{product.temperature}</p>
              </div>

              <div className="bg-[var(--bg-secondary)] rounded-2xl p-8 border border-[var(--card-border)]">
                <div className="w-12 h-12 bg-[#8B7355]/20 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-[var(--secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl text-[var(--text-primary)] mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                  Походження
                </h3>
                <p className="text-[var(--secondary)] text-2xl font-bold">{product.origin}</p>
              </div>
            </div>

            {/* Animated Brewing Guide */}
            <ScrollReveal>
              <div className="mt-12 bg-[var(--bg-secondary)] rounded-2xl p-8 border border-[var(--card-border)]">
                <h3 className="text-2xl text-[var(--text-primary)] mb-8" style={{ fontFamily: 'var(--font-heading)' }}>
                  Інструкція приготування
                </h3>
                
                {/* Animated brewing visualization */}
                <div className="flex flex-col lg:flex-row gap-8 mb-8">
                  <AnimatedBrewingGuide />
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { step: 1, title: 'Відміряй', desc: '25 мл концентрату', icon: '🧪' },
                    { step: 2, title: 'Долий воду', desc: '200-250 мл води', icon: '💧' },
                    { step: 3, title: 'Перемішай', desc: 'Ложкою або збовтай', icon: '🥄' },
                    { step: 4, title: 'Готово!', desc: 'Насолоджуйся 🍵', icon: '☕' },
                  ].map((item, index) => (
                    <ScrollReveal key={item.step} delay={index * 100}>
                      <div className="flex items-start gap-4 group">
                        <div className="w-12 h-12 bg-[var(--accent)] rounded-full flex items-center justify-center text-[#0D0D0D] font-bold shrink-0 group-hover:scale-110 transition-transform">
                          {item.step}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xl">{item.icon}</span>
                            <p className="text-[var(--text-primary)] font-medium">{item.title}</p>
                          </div>
                          <p className="text-[var(--text-primary)]/var(--text-muted) text-sm">{item.desc}</p>
                        </div>
                      </div>
                    </ScrollReveal>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Reviews placeholder */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 
              className="text-3xl text-[var(--text-primary)] mb-8"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Відгуки
            </h2>
            
            <div className="bg-[var(--bg-secondary)] rounded-2xl p-12 text-center border border-[var(--card-border)]">
              <p className="text-[var(--text-primary)]/var(--text-muted) text-lg mb-4">
                Поки що немає відгуків. Будь першим!
              </p>
              <button className="px-6 py-3 bg-[#F5F0E8]/10 text-[var(--text-primary)] rounded-lg hover:bg-[#F5F0E8]/20 transition-colors">
                Залишити відгук
              </button>
            </div>
          </div>
        </section>

        {/* Related Products */}
        <section className="py-16 bg-[var(--bg-tertiary)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 
              className="text-3xl text-[var(--text-primary)] mb-8"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Спробуй також
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              {otherProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* Recently Viewed Products */}
        {recentlyViewed.length > 0 && (
          <section className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 
                className="text-3xl text-[var(--text-primary)] mb-8"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Нещодавно переглянуті
              </h2>
              
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentlyViewed.map((viewedProduct, index) => (
                  <Link 
                    key={viewedProduct.id} 
                    href={`/products/${viewedProduct.slug}`}
                    className="group bg-[var(--bg-secondary)] rounded-2xl p-4 border border-[var(--card-border)] hover:border-[var(--accent)] transition-all"
                  >
                    <div className="flex gap-4 items-center">
                      <div className="w-20 h-20 bg-[var(--bg-primary)] rounded-xl overflow-hidden shrink-0">
                        <img 
                          src={viewedProduct.image} 
                          alt={viewedProduct.nameUk}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-contain p-2 group-hover:scale-110 transition-transform"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-[var(--text-primary)] font-semibold mb-1 truncate group-hover:text-[var(--accent)] transition-colors">
                          {viewedProduct.nameUk}
                        </h3>
                        <p className="text-[var(--accent)] font-bold">{viewedProduct.price1L}₴</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
      <TelegramButton />
      <Toast />
    </div>
  );
};

export default ProductDetail;
