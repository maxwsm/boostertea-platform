import { Link } from 'wouter';
import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Toast from '../components/Toast';
import TelegramButton from '../components/TelegramButton';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { useStore } from '../lib/store';
import { useTranslation } from '../lib/i18n';
import { SEO, useSEOConfig } from '../components/SEO';

const Cart = () => {
  const { 
    cart, accessoryCart, removeFromCart, removeAccessoryFromCart,
    updateQuantity, updateAccessoryQuantity, clearCart, getCartTotal,
    getCartItemCount, promoCode, setPromoCode, promoDiscount,
    calculateBonusEarned, addAccessoryToCart
  } = useStore();
  const { t } = useTranslation();
  const seoConfig = useSEOConfig('cart');
  const [timeLeft, setTimeLeft] = useState('14:59');

  // Персистентний таймер для FOMO ефекту
  useEffect(() => {
    let endTime = localStorage.getItem('bt_cart_timer_end');
    // If no timer exists, or it has expired, reset it to 15 mins
    if (!endTime || parseInt(endTime) < Date.now()) {
      endTime = (Date.now() + 15 * 60 * 1000).toString();
      localStorage.setItem('bt_cart_timer_end', endTime);
    }
    
    const updateTimer = () => {
      const now = Date.now();
      const distance = parseInt(endTime!) - now;
      
      if (distance <= 0) {
        setTimeLeft('00:00');
        return;
      }
      
      const min = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const sec = Math.floor((distance % (1000 * 60)) / 1000);
      setTimeLeft(`${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`);
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, []);

  // Ретаргетинг та аналітика
  useEffect(() => {
    if (cart.length > 0 && (window as any).fbq) {
      (window as any).fbq('track', 'AddToCart', {
        content_ids: cart.map(i => i.product.id),
        content_type: 'product',
        value: getCartTotal(),
        currency: 'UAH'
      });
    }
  }, [cart.length, getCartTotal]);

  const teaSubtotal = cart.reduce((total, item) => {
    const price = item.volume === '1L' ? item.product.price1L
      : item.volume === 'sticks' ? (item.product.priceSticks ?? item.product.price025L)
      : item.product.price025L;
    return total + price * item.quantity;
  }, 0);

  const totalTeaVolume = cart.reduce((total, item) => {
    if (item.volume === 'sticks') return total;
    const baseVolume = item.volume === '1L' ? 1 : 0.25;
    const multiplier = item.product.isBundle ? 3 : 1;
    return total + baseVolume * multiplier * item.quantity;
  }, 0);
  
  const accessoriesUnlocked = totalTeaVolume >= 3;
  const volumeToUnlock = Math.max(0, 3 - totalTeaVolume);

  const specialAccessories = [
    { id: 'hammock', name: 'Гамак BoosterTea', regularPrice: 500, specialPrice: 240, image: '🏕️' },
    { id: 'lamp', name: 'LED Лампа BoosterTea', regularPrice: 500, specialPrice: 300, image: '💡' },
    { id: 'backpack', name: 'Рюкзак BoosterTea', regularPrice: 1000, specialPrice: 540, image: '🎒' },
    { id: 'powerbank', name: 'Powerbank 10000mAh', regularPrice: 900, specialPrice: 720, image: '🔋' },
  ];

  const handleAddAccessory = (acc: any) => {
    addAccessoryToCart({ id: acc.id, name: acc.name, price: acc.specialPrice, image: acc.image } as any, 1);
  };

  const total = getCartTotal();
  const isEmpty = cart.length === 0 && accessoryCart.length === 0;

  if (isEmpty) return (
    <div className="text-center py-24 min-h-screen bg-[var(--bg-primary)] flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-4">{t('cart.empty')}</h1>
        <Link href="/products" className="bg-[var(--accent)] text-black px-8 py-3 rounded-xl font-bold hover:scale-105 transition-transform">Перейти до каталогу</Link>
      </main>
      <Footer />
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] relative pb-24 lg:pb-0">
      <SEO title={seoConfig.title} description={seoConfig.description} noIndex={true} />
      <Header />
      <main className="pt-24 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Breadcrumbs items={[{ label: t('nav.home'), href: '/' }, { label: t('nav.cart') }]} />
          <h1 className="text-4xl sm:text-5xl mb-12" style={{ fontFamily: 'var(--font-heading)' }}>
            {t('cart.title')} <span className="gradient-text">{t('cart.titleAccent')}</span>
          </h1>

          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-6">
              {/* Список товарів ЧАЮ */}
              {cart.map((item) => {
                const price = item.volume === '1L' ? item.product.price1L
                  : item.volume === 'sticks' ? (item.product.priceSticks ?? item.product.price025L)
                  : item.product.price025L;
                
                return (
                  <div key={`${item.product.id}-${item.volume}`} className="bg-[var(--bg-secondary)] rounded-2xl p-4 sm:p-6 border border-[var(--card-border)] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all hover:border-[var(--accent)]/50">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-white/5 rounded-xl flex items-center justify-center text-3xl shrink-0">
                        {item.product.category === 'classic' ? '🍵' : '⚡'}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg leading-tight">{item.product.nameUk}</h3>
                        <p className="opacity-70 text-sm mt-1">Об'єм: {item.volume} | {price}₴</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between w-full sm:w-auto gap-4 sm:gap-6 mt-2 sm:mt-0">
                      <div className="flex items-center gap-3 bg-[var(--bg-primary)] rounded-xl p-1 border border-white/5">
                        <button onClick={() => updateQuantity(item.product.id, item.volume, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 active:scale-95 transition-all text-xl" disabled={item.quantity <= 1}>-</button>
                        <span className="font-bold w-4 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.product.id, item.volume, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 active:scale-95 transition-all text-xl">+</button>
                      </div>
                      <p className="font-bold text-lg w-24 text-right">{price * item.quantity}₴</p>
                      <button onClick={() => removeFromCart(item.product.id, item.volume)} className="text-red-500 hover:text-red-400 p-2 opacity-50 hover:opacity-100 transition-all text-xl" title="Видалити">🗑️</button>
                    </div>
                  </div>
                );
              })}

              {/* Аксесуари у корзині */}
              {accessoryCart.length > 0 && (
                <div className="mt-8 space-y-4">
                  <h3 className="font-bold text-xl uppercase tracking-wider opacity-80">Ваші аксесуари:</h3>
                  {accessoryCart.map((item) => (
                    <div key={item.accessory.id} className="bg-[var(--bg-secondary)] rounded-2xl p-4 sm:p-6 border border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all hover:border-purple-500/50">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-black rounded-xl flex items-center justify-center text-3xl shrink-0">
                          {item.accessory.image || '🎁'}
                        </div>
                        <div>
                          <h3 className="font-bold text-lg leading-tight">{item.accessory.nameUk}</h3>
                          <p className="text-purple-400 font-bold mt-1 text-sm">{item.accessory.price}₴</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between w-full sm:w-auto gap-4 sm:gap-6 mt-2 sm:mt-0">
                        <div className="flex items-center gap-3 bg-[var(--bg-primary)] rounded-xl p-1 border border-white/5">
                          <button onClick={() => updateAccessoryQuantity(item.accessory.id, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 active:scale-95 transition-all text-xl" disabled={item.quantity <= 1}>-</button>
                          <span className="font-bold w-4 text-center">{item.quantity}</span>
                          <button onClick={() => updateAccessoryQuantity(item.accessory.id, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 active:scale-95 transition-all text-xl">+</button>
                        </div>
                        <p className="font-bold text-lg w-24 text-right">{item.accessory.price * item.quantity}₴</p>
                        <button onClick={() => removeAccessoryFromCart(item.accessory.id)} className="text-red-500 hover:text-red-400 p-2 opacity-50 hover:opacity-100 transition-all text-xl" title="Видалити">🗑️</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* UPSELL SECTION - TOP LEVEL */}
              <div className="mt-12 pt-8 border-t border-white/10">
                <div className={`p-6 sm:p-8 rounded-3xl border transition-all duration-500 ${accessoriesUnlocked ? 'bg-gradient-to-br from-green-500/10 to-transparent border-green-500/30' : 'bg-gray-500/5 border-gray-500/20 opacity-80'}`}>
                  <h3 className="text-2xl font-bold mb-2 flex items-center gap-3">
                    {accessoriesUnlocked ? <span className="animate-pulse">✅ Спецціни розблоковано!</span> : <span>🔒 Більше чаю — більше вигоди</span>}
                  </h3>
                  {!accessoriesUnlocked && (
                    <p className="opacity-70 text-sm mb-6">Додай ще {volumeToUnlock.toFixed(1)}л концентрату, щоб отримати фірмові аксесуари зі знижкою до 50%!</p>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                    {specialAccessories.map(acc => {
                      const inCart = accessoryCart.some(a => a.accessory.id === acc.id);
                      return (
                        <div key={acc.id} className={`bg-[var(--bg-primary)] p-4 rounded-2xl flex items-center gap-4 transition-all ${!accessoriesUnlocked ? 'grayscale opacity-60 pointer-events-none' : 'hover:border-[var(--accent)]/50 border border-transparent'}`}>
                          <span className="text-4xl drop-shadow-lg">{acc.image}</span>
                          <div className="flex-1">
                            <p className="text-sm font-bold leading-tight mb-1">{acc.name}</p>
                            <div className="flex items-center gap-2">
                              <p className="text-xs line-through opacity-50">{acc.regularPrice}₴</p>
                              <p className="text-[var(--accent)] font-bold">{acc.specialPrice}₴</p>
                            </div>
                          </div>
                          {accessoriesUnlocked && !inCart && (
                            <button onClick={() => handleAddAccessory(acc)} className="bg-[var(--accent)]/10 text-[var(--accent)] hover:bg-[var(--accent)] hover:text-black font-bold text-sm px-4 py-2 rounded-xl transition-all active:scale-95">+</button>
                          )}
                          {inCart && (
                            <span className="text-xs font-bold text-green-400 bg-green-400/10 px-3 py-1 rounded-lg">Вже у корзині</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* SIDEBAR WITH TIMER */}
            <div className="lg:col-span-1">
              <div className="bg-[var(--bg-secondary)] rounded-3xl p-6 sm:p-8 border border-[var(--card-border)] sticky top-24 shadow-2xl">
                <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 mb-8 flex items-center gap-3 animate-pulse">
                  <span className="text-2xl text-red-500 font-bold">⏳</span>
                  <p className="text-xs font-bold text-red-500 uppercase tracking-wider leading-tight">
                    Замовлення зарезервовано на<br/><span className="text-xl tabular-nums">{timeLeft}</span> хв.
                  </p>
                </div>
                
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-sm opacity-70">
                    <span>Товари ({getCartItemCount()} шт.)</span>
                    <span>{teaSubtotal}₴</span>
                  </div>
                  {accessoryCart.length > 0 && (
                    <div className="flex justify-between text-sm opacity-70">
                      <span>Аксесуари</span>
                      <span>{accessoryCart.reduce((acc, curr) => acc + curr.accessory.price * curr.quantity, 0)}₴</span>
                    </div>
                  )}
                  <div className="flex justify-between items-end border-t border-white/10 pt-4 mt-4 text-2xl font-bold">
                    <span>{t('cart.total')}</span>
                    <span className="text-[var(--accent)] text-4xl">{Math.round(total)}₴</span>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-[#C9A962]/20 to-transparent p-5 rounded-2xl mb-8 border border-[#C9A962]/30">
                  <p className="text-[#C9A962] text-sm font-bold flex items-center gap-2">
                    <span className="text-xl">⭐</span>
                    Ви заробляєте {calculateBonusEarned(total)} бонусів з цієї покупки
                  </p>
                </div>

                {/* Mobile Bottom Bar Placeholder for seamless Checkout Button */}
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-[var(--bg-secondary)] border-t border-white/10 lg:static lg:p-0 lg:bg-transparent lg:border-0 z-50">
                  <Link href="/checkout" className="block w-full py-4 bg-[var(--accent)] text-black text-center font-extrabold text-lg tracking-wide rounded-xl shadow-lg hover:shadow-[var(--accent)]/20 hover:scale-[1.02] transition-all active:scale-95">
                    {t('cart.checkout')}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer /><TelegramButton /><Toast />
    </div>
  );
};
export default Cart;
