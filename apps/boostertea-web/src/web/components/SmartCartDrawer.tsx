import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore, accessoryProducts } from '../lib/store';
import { useTranslation } from '../lib/i18n';
import Link from 'next/link';
// @ts-ignore
import confetti from 'canvas-confetti';
import { trackEvent } from './TelemetryTracker';

export const SmartCartDrawer = () => {
  const { 
    isCartDrawerOpen, setCartDrawerOpen, cart, accessoryCart,
    removeFromCart, removeAccessoryFromCart, updateQuantity, updateAccessoryQuantity,
    getCartTotal, getCartItemCount, user, isSubscription, setSubscription,
    usedCoins, setUsedCoins, addAccessoryToCart
  } = useStore();
  const { t } = useTranslation();

  const handleClose = () => setCartDrawerOpen(false);

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose(); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const rawTotal = getCartTotal();
  const isB2B = user?.isB2B || user?.role === 'B2B';
  const hasConcentrate = cart.some(item => item.product.category === 'classic' || item.product.category === 'energy');

  // Gamification Logic (Module 1)
  const TIER_1 = 1500;
  const TIER_2 = 2500;
  const progressRatio = Math.min(rawTotal / TIER_2, 1);
  const progressPercent = progressRatio * 100;

  useEffect(() => {
    if (rawTotal >= TIER_2 && !isB2B) {
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#9FD356', '#C9A55C', '#ffffff'],
          zIndex: 10000
        });
      } catch (e) {
        console.error('Confetti failed', e);
      }
    }
  }, [rawTotal, isB2B]);

  // Pricing Logic (Modules 2, 4 & 7)
  let subtotal = rawTotal;
  if (isSubscription && !isB2B) {
    subtotal = subtotal * 0.85; // 15% off
  }
  
  const finalTotal = Math.max(subtotal - usedCoins, 0);

  // Cross-sell
  const availableUpsells = accessoryProducts.filter(acc => !accessoryCart.some(ac => ac.accessory.id === acc.id));

  return (
    <AnimatePresence>
      {isCartDrawerOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
            onClick={handleClose}
          />
          <motion.div
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 z-[101] w-full max-w-sm sm:max-w-md bg-[var(--bg-primary)] border-l border-white/10 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[var(--bg-secondary)] relative z-10">
              <h2 className="text-xl font-bold flex items-center gap-2">
                Кошик <span className="text-[var(--text-subtle)] text-sm">({getCartItemCount()})</span>
              </h2>
              <button 
                onClick={handleClose} 
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                aria-label="Close cart"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* Content Array */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar pb-6 relative">
              
              {/* Mod 5: Ambassador Lock (Always Top) */}
              {!isB2B && user?.referralCode && (
                <div className="bg-gradient-to-r from-[var(--tea-gold)]/20 to-[var(--tea-gold)]/5 border-b border-[var(--tea-gold)]/20 p-3 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[var(--tea-gold)]/30 flex items-center justify-center text-xl shrink-0">🎁</div>
                  <p className="text-xs font-bold leading-tight">З тобою промокод <span className="text-[var(--tea-gold)]">{user.name.split(' ')[0]}</span>.<br/>Твоя знижка зафіксована!</p>
                </div>
              )}

              {/* Mod 1: Gamified Progress Bar */}
              {!isB2B && (
                <div className="p-4 border-b border-white/5 bg-[var(--bg-secondary)]/50 relative overflow-hidden">
                  <div className="flex justify-between text-xs font-bold mb-2">
                    {rawTotal >= TIER_1 ? (
                      <span className="text-[#9FD356] drop-shadow-[0_0_5px_rgba(159,211,86,0.3)]">✅ Безкоштовна доставка!</span>
                    ) : (
                      <span>Ще {Math.floor(TIER_1 - rawTotal)}₴ до фрі-доставки</span>
                    )}
                    <span className="text-[var(--text-muted)]">{Math.floor(rawTotal)}₴ / {TIER_2}₴</span>
                  </div>
                  <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden border border-white/5 relative">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-[var(--accent)] to-[var(--tea-gold)]"
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercent}%` }}
                      transition={{ ease: "easeOut", duration: 0.5 }}
                    />
                    {/* Tier markers */}
                    <div className="absolute top-0 bottom-0 left-[60%] w-px bg-white/20" />
                  </div>
                  {rawTotal >= TIER_1 && rawTotal < TIER_2 && (
                    <p className="text-[10px] text-[var(--tea-gold)] mt-2 font-bold uppercase tracking-wider">
                      Додай ще на {Math.floor(TIER_2 - rawTotal)}₴ до секретного подарунка! 🎁
                    </p>
                  )}
                  {rawTotal >= TIER_2 && (
                    <p className="text-[10px] text-[#9FD356] mt-2 font-bold uppercase tracking-wider animate-pulse">
                      🎉 Подарунок від шефа розблоковано!
                    </p>
                  )}
                </div>
              )}

              {/* Items List */}
              <div className="p-4 space-y-4">
                {cart.length === 0 && accessoryCart.length === 0 ? (
                  <div className="text-center py-10 opacity-50">
                    <p className="text-4xl mb-3">🛒</p>
                    <p className="font-bold">Кошик порожній</p>
                    <p className="text-sm">Твій організм чекає на енергію.</p>
                  </div>
                ) : (
                  <>
                    {cart.map(item => {
                      const p = item.volume === '1L' ? item.product.price1L : item.volume === 'sticks' ? (item.product.priceSticks ?? item.product.price025L) : item.product.price025L;
                      return (
                        <div key={`${item.product.id}-${item.volume}`} className="flex gap-4 p-3 bg-white/5 rounded-xl border border-white/5 relative group transition-colors hover:border-white/10">
                          <div className="w-16 h-16 bg-black/20 rounded-lg flex items-center justify-center shrink-0">🍵</div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-sm truncate pr-6">{item.product.nameUk}</h4>
                            <div className="text-[10px] text-[var(--text-muted)] mb-2 uppercase tracking-wider">{item.volume} {isB2B && '| ОПТ'}</div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 bg-black/30 rounded-lg p-1 border border-white/5">
                                <button onClick={() => updateQuantity(item.product.id, item.volume, item.quantity - 1)} className="w-6 h-6 flex items-center justify-center rounded hover:bg-white/10" disabled={item.quantity <= 1}>-</button>
                                <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                                <button onClick={() => updateQuantity(item.product.id, item.volume, item.quantity + 1)} className="w-6 h-6 flex items-center justify-center rounded hover:bg-white/10">+</button>
                              </div>
                              <span className="font-bold">{p * item.quantity}₴</span>
                            </div>
                          </div>
                          <button onClick={() => removeFromCart(item.product.id, item.volume)} className="absolute top-3 right-3 opacity-[0.3] md:opacity-0 group-hover:opacity-100 transition-opacity text-[var(--text-muted)] hover:text-red-400 p-1">✕</button>
                        </div>
                      )
                    })}
                    {accessoryCart.map(item => (
                        <div key={item.accessory.id} className="flex gap-4 p-3 bg-white/5 rounded-xl border border-white/5 relative group transition-colors hover:border-white/10">
                          <div className="w-16 h-16 bg-black/20 rounded-lg flex items-center justify-center shrink-0 text-2xl">{item.accessory.image||'🎁'}</div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-sm truncate pr-6">{item.accessory.nameUk}</h4>
                            <div className="flex items-center justify-between mt-4">
                              <div className="flex items-center gap-2 bg-black/30 rounded-lg p-1 border border-white/5">
                                <button onClick={() => updateAccessoryQuantity(item.accessory.id, item.quantity - 1)} className="w-6 h-6 flex items-center justify-center rounded hover:bg-white/10" disabled={item.quantity <= 1}>-</button>
                                <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                                <button onClick={() => updateAccessoryQuantity(item.accessory.id, item.quantity + 1)} className="w-6 h-6 flex items-center justify-center rounded hover:bg-white/10">+</button>
                              </div>
                              <span className="font-bold text-[var(--tea-gold)]">{item.accessory.price * item.quantity}₴</span>
                            </div>
                          </div>
                          <button onClick={() => removeAccessoryFromCart(item.accessory.id)} className="absolute top-3 right-3 opacity-[0.3] md:opacity-0 group-hover:opacity-100 transition-opacity text-[var(--text-muted)] hover:text-red-400 p-1">✕</button>
                        </div>
                    ))}
                  </>
                )}
              </div>

              {/* Mod 3: Tinder-Upsell for Accessories (if buying concentrate) */}
              {!isB2B && hasConcentrate && availableUpsells.length > 0 && cart.length > 0 && (
                <div className="px-4 py-2 mt-2 border-y border-white/5 bg-[var(--bg-secondary)]/30">
                  <h4 className="text-[10px] uppercase font-bold text-[var(--text-subtle)] mb-3 tracking-wider flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse" /> Ідеально до твого чека
                  </h4>
                  <div className="flex overflow-x-auto gap-3 pb-2 custom-scrollbar snap-x">
                    {availableUpsells.slice(0, 3).map(acc => (
                      <div key={acc.id} className="min-w-[140px] bg-[var(--bg-primary)] p-3 rounded-xl border border-white/5 shrink-0 snap-start flex flex-col justify-between hover:border-white/10 transition-colors">
                        <div>
                          <p className="text-xs font-bold leading-tight line-clamp-2 mb-1">{acc.nameUk}</p>
                          <p className="text-xs text-[var(--tea-gold)] font-bold">{acc.price}₴</p>
                        </div>
                        <button onClick={() => addAccessoryToCart(acc, 1)} className="w-full mt-3 py-1.5 bg-[var(--accent)]/10 text-[var(--accent)] hover:bg-[var(--accent)] hover:text-black font-bold text-xs uppercase rounded transition-colors active:scale-95">+ Додати</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Mod 2: Autopilot Toggle */}
              {!isB2B && cart.length > 0 && (
                <div className="mx-4 mt-4 p-4 rounded-xl border border-[var(--tea-lime)]/20 bg-gradient-to-r from-[#9FD356]/5 to-transparent flex items-center justify-between shadow-lg shadow-[#9FD356]/5">
                  <div>
                    <h4 className="font-bold text-sm tracking-tight flex items-center gap-2">
                      <span className="text-[var(--tea-lime)]">⚡</span> Автопілот <span className="text-[10px] bg-[var(--tea-lime)] text-black px-1.5 py-0.5 rounded font-black">-15%</span>
                    </h4>
                    <p className="text-[10px] text-[var(--text-muted)] mt-1">Отримуй свіжий пуер кожні 20 днів.</p>
                  </div>
                  {/* iOS Style Toggle */}
                  <label className="relative inline-flex items-center cursor-pointer transform scale-90">
                    <input type="checkbox" className="sr-only peer" checked={isSubscription} onChange={(e) => setSubscription(e.target.checked)} />
                    <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--tea-lime)]"></div>
                  </label>
                </div>
              )}

              {/* Mod 4: TaiCoins Range Slider */}
              {!isB2B && user && user.bonusPoints > 0 && (cart.length > 0 || accessoryCart.length > 0) && (
                <div className="mx-4 mt-4 p-4 rounded-xl border border-white/5 bg-[var(--bg-secondary)] relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--tea-gold)]/10 rounded-full blur-[30px] -mr-8 -mt-8 pointer-events-none" />
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-bold text-sm text-[var(--tea-gold)]">Списати TaiCoins</h4>
                    <span className="font-bold text-lg">{usedCoins} ₴</span>
                  </div>
                  <div className="relative pt-1">
                    <input 
                      type="range" 
                      min="0" 
                      max={Math.max(Math.floor(Math.min(user.bonusPoints, subtotal)), 0)} 
                      value={usedCoins} 
                      onChange={(e) => setUsedCoins(Number(e.target.value))}
                      className="w-full h-1.5 bg-black/60 rounded-lg appearance-none cursor-pointer accent-[var(--tea-gold)] border border-white/5"
                    />
                  </div>
                  <div className="flex justify-between mt-2 text-[10px] text-[var(--text-muted)] uppercase tracking-widest font-bold">
                    <span>0</span>
                    <span>Max {Math.floor(Math.min(user.bonusPoints, subtotal))}</span>
                  </div>
                </div>
              )}

            </div>

            {/* Footer with checkout actions */}
            <div className="p-4 bg-[var(--bg-secondary)] border-t border-white/10 shrink-0 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] z-20">
              {cart.length > 0 || accessoryCart.length > 0 ? (
                <>
                  <div className="flex justify-between mb-1 opacity-60 text-sm">
                    <span>Разом (початкова ціна)</span>
                    <span>{Math.floor(rawTotal)} ₴</span>
                  </div>
                  {isSubscription && !isB2B && (
                    <div className="flex justify-between mb-1 text-[var(--tea-lime)] text-sm font-bold">
                      <span>Автопілот знижка (-15%)</span>
                      <span>-{Math.floor(rawTotal * 0.15)} ₴</span>
                    </div>
                  )}
                  {usedCoins > 0 && (
                    <div className="flex justify-between mb-1 text-[var(--tea-gold)] text-sm font-bold">
                      <span>Оплата TaiCoins</span>
                      <span>-{usedCoins} ₴</span>
                    </div>
                  )}
                  {isB2B && (
                    <div className="flex justify-between mb-1 text-sm text-[var(--text-muted)] font-bold">
                      <span>Оптова знижка (Tier)</span>
                      <span>Активовано</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-end mt-3 mb-5 pt-3 border-t border-white/5">
                    <span className="uppercase text-xs font-bold tracking-widest text-[var(--text-secondary)]">До сплати</span>
                    <span className="text-3xl font-black">{Math.floor(finalTotal)} ₴</span>
                  </div>

                  {/* Mod 6 & 7: Express Checkout vs B2B */}
                  {isB2B ? (
                    <Link 
                      href="/checkout" 
                      onClick={() => {
                        trackEvent('InitiateCheckout', { value: finalTotal, currency: 'UAH', content_category: 'B2B' });
                        handleClose();
                      }}
                      className="w-full bg-[var(--text-primary)] text-black font-extrabold uppercase py-4 rounded-xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-xl block text-center"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                      Згенерувати IBAN Інвойс
                    </Link>
                  ) : (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <button onClick={() => { trackEvent('InitiateCheckout', { value: finalTotal, currency: 'UAH' }); handleClose(); window.location.href='/checkout'; }} className="bg-black border border-white/10 text-white font-bold py-3.5 rounded-xl hover:bg-white/5 hover:border-white/30 transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95">
                          <svg className="w-4 h-4" viewBox="0 0 384 512" fill="currentColor"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/></svg> <span>Pay</span>
                        </button>
                        <button onClick={() => { trackEvent('InitiateCheckout', { value: finalTotal, currency: 'UAH' }); handleClose(); window.location.href='/checkout'; }} className="bg-white border border-transparent text-black font-bold py-3.5 rounded-xl hover:bg-white/90 transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95">
                          <svg className="w-4 h-4" viewBox="0 0 488 512" fill="currentColor"><path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"/></svg> <span>Pay</span>
                        </button>
                      </div>
                      <Link 
                        href="/checkout" 
                        onClick={() => {
                          trackEvent('InitiateCheckout', { value: finalTotal, currency: 'UAH' });
                          handleClose();
                        }}
                        className="w-full bg-[var(--accent)] text-black font-extrabold uppercase py-4 rounded-xl shadow-[0_4px_15px_rgba(159,211,86,0.3)] hover:shadow-[0_6px_20px_rgba(159,211,86,0.5)] transition-all outline-none flex items-center justify-center block text-center"
                      >
                        Завершити Оформлення
                      </Link>

                      {/* Payment Methods Trust Badges */}
                      <div className="flex items-center justify-center gap-4 pt-4 pb-2 opacity-50 text-[var(--text-secondary)]">
                        <span className="sr-only">Accepted Payment Methods</span>
                        {/* Visa */}
                        <svg className="h-3" viewBox="0 0 576 512" fill="currentColor"><path d="M470.1 231.3s7.6-37.3 19.3-95h74.4l-20.4 95h-73.3zM166.4 136.3h-44.4l-31.8 95h45.1l31.1-95zM352 136.3h-44.4l-31.8 95h45.1l31.1-95zm61.1 0h-53l-31.5 95h50.7l16.1-48h37.5l6-30.8H428l15.1-16.2z"/></svg>
                        {/* Mastercard */}
                        <svg className="h-5" viewBox="0 0 576 512" fill="currentColor"><path d="M527.9 32H48.1C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48.1 48h479.8c26.6 0 48.1-21.5 48.1-48V80c0-26.5-21.5-48-48.1-48zM192 384c-70.7 0-128-57.3-128-128s57.3-128 128-128c50.3 0 93.8 29.1 115.5 71.7-21.7 42.6-65.2 71.7-115.5 71.7zm192 0c-50.3 0-93.8-29.1-115.5-71.7 21.7-42.6 65.2-71.7 115.5-71.7 70.7 0 128 57.3 128 128s-57.3 128-128 128z"/></svg>
                        {/* Apple Pay */}
                        <svg className="h-4" viewBox="0 0 384 512" fill="currentColor"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9z"/></svg> 
                        {/* Google Pay */}
                        <svg className="h-4" viewBox="0 0 488 512" fill="currentColor"><path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"/></svg>
                        {/* Mono */}
                        <span className="font-bold text-xs tracking-tight italic">mono</span>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <button onClick={handleClose} className="w-full bg-white/5 border border-white/10 text-white font-bold py-4 rounded-xl hover:bg-white/10 transition-colors">
                  Продовжити покупки
                </button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
