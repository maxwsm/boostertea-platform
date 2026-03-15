import { Link } from 'wouter';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Toast from '../components/Toast';
import TelegramButton from '../components/TelegramButton';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { useStore, BONUS_EARN_RATE, BONUS_POINT_VALUE } from '../lib/store';
import { useTranslation } from '../lib/i18n';
import { SEO, useSEOConfig } from '../components/SEO';

const Cart = () => {
  const { 
    cart, 
    accessoryCart,
    removeFromCart, 
    removeAccessoryFromCart,
    updateQuantity, 
    updateAccessoryQuantity,
    clearCart, 
    getCartTotal,
    getCartItemCount, 
    promoCode, 
    setPromoCode,
    promoDiscount,
    getMarketingGifts,
    calculateBonusEarned
  } = useStore();
  const { t, language } = useTranslation();
  const seoConfig = useSEOConfig('cart');

  const teaSubtotal = cart.reduce((total, item) => {
    const price = item.volume === '1L' ? item.product.price1L
      : item.volume === 'sticks' ? (item.product.priceSticks ?? item.product.price025L)
      : item.product.price025L;
    return total + price * item.quantity;
  }, 0);

  // Calculate total tea volume in liters (sticks = 0, bundle 1L = 3)
  const totalTeaVolume = cart.reduce((total, item) => {
    if (item.volume === 'sticks') return total;
    const baseVolume = item.volume === '1L' ? 1 : 0.25;
    const multiplier = item.product.isBundle ? 3 : 1;
    return total + baseVolume * multiplier * item.quantity;
  }, 0);
  
  const accessoriesUnlocked = totalTeaVolume >= 3;
  const volumeToUnlock = Math.max(0, 3 - totalTeaVolume);

  // Special price accessories (cost + 20%)
  const specialAccessories = [
    { id: 'hammock', name: 'Гамак BoosterTea', regularPrice: 500, specialPrice: 240, image: '🏕️' },
    { id: 'lamp', name: 'LED Лампа BoosterTea', regularPrice: 500, specialPrice: 300, image: '💡' },
    { id: 'backpack', name: 'Рюкзак BoosterTea', regularPrice: 1000, specialPrice: 540, image: '🎒' },
    { id: 'table', name: 'Складний столик', regularPrice: 1500, specialPrice: 960, image: '🪑' },
    { id: 'powerbank', name: 'Powerbank 10000mAh', regularPrice: 900, specialPrice: 720, image: '🔋' },
  ];

  const accessorySubtotal = accessoryCart.reduce((total, item) => {
    return total + item.accessory.price * item.quantity;
  }, 0);

  const subtotal = teaSubtotal + accessorySubtotal;
  const total = getCartTotal();
  const discount = subtotal - total;
  const itemCount = getCartItemCount();
  const isEmpty = cart.length === 0 && accessoryCart.length === 0;

  // Get localized empty message
  const getRandomEmptyMessage = () => {
    const messageKeys = ["cart.emptyMessage1", "cart.emptyMessage2", "cart.emptyMessage3"];
    const randomKey = messageKeys[Math.floor(Math.random() * messageKeys.length)];
    return t(randomKey);
  };

  const getProductName = (product: typeof cart[0]['product']) => {
    if (language === 'uk') return product.nameUk;
    return product.name;
  };

  const getAccessoryName = (accessory: typeof accessoryCart[0]['accessory']) => {
    if (language === 'en') return accessory.nameEn || accessory.nameUk;
    if (language === 'es') return accessory.nameEs || accessory.nameUk;
    return accessory.nameUk;
  };

  if (isEmpty) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)]">
        <SEO 
          title={seoConfig.title}
          description={seoConfig.description}
          noIndex={true}
        />
        <Header />
        
        <main className="pt-24 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="text-center max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-8 bg-[var(--accent)]/10 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              
              <h1 
                className="text-3xl text-[var(--text-primary)] mb-4"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {t('cart.empty')}
              </h1>
              
              <p className="text-[var(--text-primary)]/var(--text-muted) mb-8">
                {getRandomEmptyMessage()}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/products"
                  className="px-8 py-4 bg-[var(--accent)] text-[#0D0D0D] font-semibold rounded-xl hover:bg-[var(--accent-hover)] transition-all"
                >
                  {t('cart.chooseTea')}
                </Link>
                <Link 
                  href="/accessories"
                  className="px-8 py-4 bg-[#8B7355]/20 text-[var(--secondary)] font-semibold rounded-xl hover:bg-[#8B7355]/30 transition-all"
                >
                  {t('nav.accessories')}
                </Link>
              </div>
            </div>
          </div>
        </main>

        <Footer />
        <TelegramButton />
        <Toast />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <SEO 
        title={seoConfig.title}
        description={seoConfig.description}
        noIndex={true}
      />
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumbs */}
          <div className="mb-8">
            <Breadcrumbs 
              items={[
                { label: t('nav.home'), href: '/' },
                { label: t('nav.cart') }
              ]} 
            />
          </div>

          <h1 
            className="text-4xl sm:text-5xl text-[var(--text-primary)] mb-12"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {t('cart.title')} <span className="gradient-text">{t('cart.titleAccent')}</span>
          </h1>

          <div className="grid lg:grid-cols-3 gap-12">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {/* Tea Concentrates */}
              {cart.length > 0 && (
                <>
                  <h3 className="text-[var(--text-primary)]/var(--text-muted) text-sm font-medium uppercase tracking-wide">
                    🍵 {t('nav.products')}
                  </h3>
                  {cart.map((item) => {
                    const price = item.volume === '1L' ? item.product.price1L
                      : item.volume === 'sticks' ? (item.product.priceSticks ?? item.product.price025L)
                      : item.product.price025L;
                    const minQuantity = 1; // B2C can buy single bottles
                    
                    return (
                      <div 
                        key={`${item.product.id}-${item.volume}`}
                        className="bg-[var(--bg-secondary)] rounded-2xl p-4 sm:p-6 border border-[var(--card-border)] cart-item"
                      >
                        <div className="flex gap-4 sm:gap-6">
                          {/* Image */}
                          <Link href={`/products/${item.product.slug}`} className="shrink-0">
                            <div className="w-16 h-16 sm:w-24 sm:h-24 bg-[var(--bg-primary)] rounded-xl overflow-hidden cart-item-image">
                              <img 
                                src={item.product.image} 
                                alt={getProductName(item.product)}
                                className="w-full h-full object-contain p-1 sm:p-2"
                              />
                            </div>
                          </Link>

                          {/* Info */}
                          <div className="flex-1 min-w-0 cart-item-info">
                            <div className="flex items-start justify-between gap-2 sm:gap-4">
                              <div className="min-w-0 flex-1">
                                <Link href={`/products/${item.product.slug}`}>
                                  <h3 
                                    className="text-base sm:text-xl text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors truncate sm:whitespace-normal"
                                    style={{ fontFamily: 'var(--font-heading)' }}
                                  >
                                    {getProductName(item.product)}
                                  </h3>
                                </Link>
                                <p className="text-[var(--text-primary)]/var(--text-muted) text-xs sm:text-sm">{item.volume}</p>
                              </div>
                              
                              <button
                                onClick={() => removeFromCart(item.product.id, item.volume)}
                                className="text-[var(--text-primary)]/var(--text-subtle) hover:text-red-400 transition-colors p-1"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-3 sm:mt-4 gap-2 sm:gap-4">
                              {/* Quantity */}
                              <div className="flex items-center bg-[var(--bg-primary)] rounded-lg overflow-hidden quantity-controls">
                                <button
                                  onClick={() => updateQuantity(item.product.id, item.volume, item.quantity - 1)}
                                  disabled={item.quantity <= minQuantity}
                                  className="px-3 py-2 sm:px-3 sm:py-2 text-[var(--text-primary)] hover:bg-[#F5F0E8]/10 transition-colors disabled:opacity-30"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                  </svg>
                                </button>
                                <span className="w-10 sm:w-12 text-center text-[var(--text-primary)] font-medium text-sm sm:text-base">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => updateQuantity(item.product.id, item.volume, item.quantity + 1)}
                                  className="px-3 py-2 sm:px-3 sm:py-2 text-[var(--text-primary)] hover:bg-[#F5F0E8]/10 transition-colors"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                  </svg>
                                </button>
                              </div>

                              {/* Price */}
                              <p className="text-[var(--accent)] text-lg sm:text-xl font-bold text-right">
                                {(price * item.quantity).toLocaleString()}₴
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </>
              )}

              {/* Accessories */}
              {accessoryCart.length > 0 && (
                <>
                  <h3 className="text-[var(--text-primary)]/var(--text-muted) text-sm font-medium uppercase tracking-wide mt-8">
                    🛍️ {t('nav.accessories')}
                  </h3>
                  {accessoryCart.map((item) => (
                    <div 
                      key={item.accessory.id}
                      className="bg-[var(--bg-secondary)] rounded-2xl p-4 sm:p-6 border border-[#8B7355]/20 cart-item"
                    >
                      <div className="flex gap-4 sm:gap-6">
                        {/* Image */}
                        <div className="shrink-0">
                          <div className="w-16 h-16 sm:w-24 sm:h-24 bg-[var(--bg-primary)] rounded-xl overflow-hidden flex items-center justify-center cart-item-image">
                            {item.accessory.image ? (
                              <img 
                                src={item.accessory.image} 
                                alt={getAccessoryName(item.accessory)}
                                className="w-full h-full object-contain p-1 sm:p-2"
                              />
                            ) : (
                              <span className="text-2xl sm:text-4xl opacity-30">
                                {item.accessory.subcategory === 'thermos' ? '🧴' :
                                 item.accessory.subcategory === 'mug' ? '☕' :
                                 item.accessory.subcategory === 'cup' ? '🍵' :
                                 item.accessory.subcategory === 'piala' ? '🥣' :
                                 item.accessory.subcategory === 'dry_tea' ? '🍃' : '🛍️'}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0 cart-item-info">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h3 
                                className="text-xl text-[var(--text-primary)]"
                                style={{ fontFamily: 'var(--font-heading)' }}
                              >
                                {getAccessoryName(item.accessory)}
                              </h3>
                              <span className="px-2 py-0.5 bg-[#8B7355]/20 text-[var(--secondary)] text-xs rounded">
                                {t(`accessories.filters.${item.accessory.subcategory === 'thermos' ? 'thermoses' : 
                                   item.accessory.subcategory === 'mug' ? 'mugs' : 
                                   item.accessory.subcategory === 'cup' ? 'cups' : 
                                   item.accessory.subcategory === 'piala' ? 'pialas' : 'dryTea'}`)}
                              </span>
                            </div>
                            
                            <button
                              onClick={() => removeAccessoryFromCart(item.accessory.id)}
                              className="text-[var(--text-primary)]/var(--text-subtle) hover:text-red-400 transition-colors"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>

                          <div className="flex items-center justify-between mt-4">
                            {/* Quantity */}
                            <div className="flex items-center bg-[var(--bg-primary)] rounded-lg overflow-hidden">
                              <button
                                onClick={() => updateAccessoryQuantity(item.accessory.id, item.quantity - 1)}
                                className="px-3 py-2 text-[var(--text-primary)] hover:bg-[#F5F0E8]/10 transition-colors"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                </svg>
                              </button>
                              <span className="w-12 text-center text-[var(--text-primary)] font-medium">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateAccessoryQuantity(item.accessory.id, item.quantity + 1)}
                                className="px-3 py-2 text-[var(--text-primary)] hover:bg-[#F5F0E8]/10 transition-colors"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                              </button>
                            </div>

                            {/* Price */}
                            <p className="text-[var(--secondary)] text-xl font-bold">
                              {(item.accessory.price * item.quantity).toLocaleString()}₴
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}

              {/* Special Price Accessories Section */}
              {cart.length > 0 && (
                <div className="mt-8 pt-8 border-t border-[var(--border)]">
                  {/* Progress to unlock */}
                  {!accessoriesUnlocked && (
                    <div className="bg-gradient-to-r from-[#8B7355]/20 to-[#C9A55C]/20 rounded-xl p-4 mb-6 border border-[#8B7355]/30">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-2xl">🎁</span>
                        <div>
                          <p className="text-[var(--text-primary)] font-medium">
                            До спецціни на аксесуари залишилось {volumeToUnlock.toFixed(1)} л
                          </p>
                          <p className="text-[var(--text-primary)]/var(--text-muted) text-sm">
                            Купіть 3+ л концентрату і отримайте доступ до аксесуарів за собівартістю!
                          </p>
                        </div>
                      </div>
                      {/* Progress bar */}
                      <div className="w-full bg-[var(--bg-primary)] rounded-full h-2.5">
                        <div 
                          className="bg-gradient-to-r from-[#8B7355] to-[#C9A55C] h-2.5 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(100, (totalTeaVolume / 3) * 100)}%` }}
                        />
                      </div>
                      <p className="text-[var(--text-primary)]/var(--text-muted) text-xs mt-2 text-right">
                        {totalTeaVolume.toFixed(1)} / 3 л
                      </p>
                    </div>
                  )}

                  {/* Accessories unlocked */}
                  {accessoriesUnlocked && (
                    <>
                      <div className="bg-gradient-to-r from-[var(--accent)]/20 to-[#9FD356]/30 rounded-xl p-4 mb-6 border border-[var(--accent)]/30">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">✨</span>
                          <div>
                            <p className="text-[var(--accent)] font-bold">
                              Спеціальні ціни розблоковано!
                            </p>
                            <p className="text-[var(--text-primary)]/var(--text-muted) text-sm">
                              Оберіть аксесуари за собівартістю +20% (до 60% дешевше!)
                            </p>
                          </div>
                        </div>
                      </div>

                      <h3 className="text-[var(--text-primary)]/var(--text-muted) text-sm font-medium uppercase tracking-wide mb-4">
                        🎁 Аксесуари за спецціною
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {specialAccessories.map((accessory) => (
                          <div 
                            key={accessory.id}
                            className="bg-[var(--bg-secondary)] rounded-xl p-4 border border-[#8B7355]/20 hover:border-[#8B7355]/40 transition-all"
                          >
                            <div className="flex items-center gap-3 mb-3">
                              <span className="text-3xl">{accessory.image}</span>
                              <div className="flex-1">
                                <p className="text-[var(--text-primary)] font-medium text-sm">{accessory.name}</p>
                                <div className="flex items-center gap-2">
                                  <span className="text-[var(--text-primary)]/var(--text-muted) text-xs line-through">
                                    {accessory.regularPrice}₴
                                  </span>
                                  <span className="text-[var(--accent)] font-bold">
                                    {accessory.specialPrice}₴
                                  </span>
                                </div>
                              </div>
                            </div>
                            <button 
                              className="w-full py-2 bg-[#8B7355]/20 text-[#C9A55C] text-sm font-medium rounded-lg hover:bg-[#8B7355]/30 transition-colors"
                              onClick={() => {
                                // TODO: Add special accessory to cart
                                alert('Скоро! Аксесуари з\'являться на сайті найближчим часом.');
                              }}
                            >
                              Додати в кошик
                            </button>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Clear cart */}
              <button
                onClick={clearCart}
                className="text-[var(--text-primary)]/var(--text-subtle) hover:text-red-400 text-sm transition-colors mt-6"
              >
                {t('cart.clearCart')}
              </button>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-[var(--bg-secondary)] rounded-2xl p-8 border border-[var(--card-border)] sticky top-24">
                <h2 
                  className="text-2xl text-[var(--text-primary)] mb-6"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {t('cart.summary')}
                </h2>

                {/* Promo code */}
                <div className="mb-6">
                  <label className="block text-[var(--text-primary)]/var(--text-muted) text-sm mb-2">{t('cart.promoCode')}</label>
                  <div className="flex gap-2">
                    <input 
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder={t('cart.promoPlaceholder')}
                      className="flex-1 px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] placeholder-[#F5F0E8]/30 text-sm"
                    />
                  </div>
                  {promoDiscount > 0 && (
                    <p className="text-[var(--accent)] text-sm mt-2">
                      {t('cart.promoApplied', { discount: promoDiscount.toString() })}
                    </p>
                  )}
                </div>

                {/* Totals */}
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-[var(--text-primary)]/var(--text-muted)">
                    <span>{t('cart.items')}</span>
                    <span>{itemCount} {t('cart.itemsUnit')}</span>
                  </div>
                  {teaSubtotal > 0 && (
                    <div className="flex justify-between text-[var(--text-primary)]/var(--text-muted) text-sm">
                      <span>🍵 {t('nav.products')}</span>
                      <span>{teaSubtotal.toLocaleString()}₴</span>
                    </div>
                  )}
                  {accessorySubtotal > 0 && (
                    <div className="flex justify-between text-[var(--text-primary)]/var(--text-muted) text-sm">
                      <span>🛍️ {t('nav.accessories')}</span>
                      <span>{accessorySubtotal.toLocaleString()}₴</span>
                    </div>
                  )}
                  <div className="flex justify-between text-[var(--text-primary)]/var(--text-muted)">
                    <span>{t('cart.subtotal')}</span>
                    <span>{subtotal.toLocaleString()}₴</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-[var(--accent)]">
                      <span>{t('cart.discount')}</span>
                      <span>-{discount.toLocaleString()}₴</span>
                    </div>
                  )}
                  <div className="flex justify-between text-[var(--text-primary)]/var(--text-muted)">
                    <span>{t('cart.delivery')}</span>
                    <span className="text-[var(--accent)]">{t('cart.freeDelivery')}</span>
                  </div>
                </div>

                <hr className="border-[var(--border)] mb-6" />

                <div className="flex justify-between items-center mb-6">
                  <span className="text-[var(--text-primary)] text-lg">{t('cart.total')}</span>
                  <span className="text-[var(--accent)] text-3xl font-bold">{Math.round(total).toLocaleString()}₴</span>
                </div>

                {/* Marketing Gifts - Branded Cups */}
                {cart.length > 0 && (
                  <div className="bg-[#E07B2D]/10 rounded-xl p-4 mb-4 border border-[#E07B2D]/30">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🎁</span>
                      <div>
                        <p className="text-[#E07B2D] font-bold text-sm">
                          {language === 'uk' ? 'Ваш подарунок до замовлення!' : 'Your order gift!'}
                        </p>
                        <p className="text-[var(--text-primary)] text-sm">
                          <span className="font-bold text-[#E07B2D]">{getMarketingGifts().totalCups}</span>{' '}
                          {language === 'uk' 
                            ? 'брендованих стаканчиків з кришками'
                            : 'branded cups with lids'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Bonus points - NEW SYSTEM: 10% earning */}
                <div className="bg-[#C9A962]/10 rounded-xl p-4 mb-6 border border-[#C9A962]/30">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">⭐</span>
                    <div>
                      <p className="text-[#C9A962] font-bold text-sm">
                        {language === 'uk' ? 'Ви отримаєте бонуси!' : 'You will earn bonus points!'}
                      </p>
                      <p className="text-[var(--text-primary)] text-sm">
                        <span className="font-bold text-[#C9A962]">+{calculateBonusEarned(total)}</span>{' '}
                        {language === 'uk' 
                          ? `балів (${Math.round(BONUS_EARN_RATE * 100)}% від замовлення)`
                          : `points (${Math.round(BONUS_EARN_RATE * 100)}% of order)`}
                      </p>
                      <p className="text-[var(--text-primary)]/60 text-xs mt-1">
                        {language === 'uk' 
                          ? `1 бал = ${BONUS_POINT_VALUE.toFixed(2)}₴ на аксесуари`
                          : `1 point = ${BONUS_POINT_VALUE.toFixed(2)}₴ for accessories`}
                      </p>
                    </div>
                  </div>
                </div>

                <button className="w-full py-4 bg-[var(--accent)] text-[#0D0D0D] font-bold rounded-xl hover:bg-[var(--accent-hover)] transition-all">
                  <Link href="/checkout" className="block w-full h-full">
                    {t('cart.checkout')}
                  </Link>
                </button>

                <p className="text-[var(--text-primary)]/var(--text-subtle) text-xs text-center mt-4">
                  {t('cart.terms')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <TelegramButton />
      <Toast />
    </div>
  );
};

export default Cart;
