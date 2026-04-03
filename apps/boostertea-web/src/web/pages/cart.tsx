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
import { Sparkles, Zap, ShieldCheck, Box, MessageSquare } from 'lucide-react';

const Cart = () => {
  const { 
    cart, accessoryCart, removeFromCart, removeAccessoryFromCart,
    updateQuantity, updateAccessoryQuantity, clearCart, getCartTotal,
    getCartItemCount, calculateBonusEarned, addAccessoryToCart
  } = useStore();
  const { t } = useTranslation();
  const seoConfig = useSEOConfig('cart');
  const [timeLeft, setTimeLeft] = useState('14:59');

  // Ефект таймера "Temporal Stasis"
  useEffect(() => {
    let endTime = localStorage.getItem('bt_cart_timer_end');
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

  // FBQ Tracker
  useEffect(() => {
    if ((window as any).fbq) {
      (window as any).fbq('trackCustom', 'ViewCart', {
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
  
  const synergyUnlocked = totalTeaVolume >= 3;
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
    <div className="text-center py-24 min-h-screen bg-[#0D0F14] flex flex-col text-white">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-4 font-mono uppercase tracking-widest text-[#A89880]">Кошик порожній</h1>
        <p className="mb-8 opacity-70 max-w-md mx-auto">Ваш кошик наразі порожній. Перейдіть до каталогу, щоб вибрати потужні чайні концентрати.</p>
        <Link href="/products" className="bg-[#C4956A] text-[#0F0B08] px-8 py-4 rounded-xl font-bold tracking-widest uppercase text-xs hover:scale-105 hover:bg-[#D4A57A] transition-all">Перейти до Каталогу</Link>
      </main>
      <Footer />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0D0F14] text-white relative pb-24 lg:pb-0 overflow-x-hidden font-sans">
      <SEO title={seoConfig.title} description={seoConfig.description} noIndex={true} />
      <Header />
      
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#C4956A]/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#00D4FF]/5 blur-[120px] rounded-full" />
      </div>

      <main className="pt-24 pb-8 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          <div className="flex justify-between items-end mb-12 border-b border-white/5 pb-6">
            <div>
              <p className="text-[#00D4FF] tracking-widest uppercase text-xs mb-3 font-mono flex items-center gap-2 decoration-transparent">
                <Box size={14} /> Ваше Замовлення
              </p>
              <h1 className="text-5xl md:text-6xl font-black tracking-tighter uppercase" style={{ fontFamily: '"Syne", sans-serif' }}>Кошик</h1>
            </div>
            <div className="hidden md:block text-right opacity-50 text-[10px] font-mono leading-relaxed">
              SESSION_ID: {localStorage.getItem('wsm_session')?.slice(0, 8) || 'GUEST_PROTO'} <br />
              NODE: KYIV_CENTRAL<br />
              UPTIME: 99.9%
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* ТОВАРИ */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => {
                const price = item.volume === '1L' ? item.product.price1L
                  : item.volume === 'sticks' ? (item.product.priceSticks ?? item.product.price025L)
                  : item.product.price025L;
                
                return (
                  <div key={`${item.product.id}-${item.volume}`} 
                       className="group relative overflow-hidden backdrop-blur-xl bg-white/[0.02] border border-white/10 rounded-3xl p-6 transition-all hover:bg-white/[0.04] hover:border-[#C4956A]/50">
                    <div className="flex flex-col md:flex-row gap-6 items-center">
                      <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-white/5 to-transparent flex items-center justify-center border border-white/5 shadow-inner">
                        <span className="text-4xl">{item.product.category === 'classic' ? '🍵' : '⚡'}</span>
                      </div>

                      <div className="flex-1 text-center md:text-left w-full">
                        <h3 className="text-xl font-bold uppercase tracking-tight mb-1">{item.product.nameUk}</h3>
                        <p className="text-xs text-[#A89880] mb-4 font-mono">Клас: Енергетичний концентрат // Об'єм: {item.volume}</p>
                        
                        <div className="flex items-center justify-center md:justify-start gap-4">
                          <button onClick={() => updateQuantity(item.product.id, item.volume, item.quantity - 1)} className="w-8 h-8 rounded-full border border-white/10 hover:bg-white/10 active:scale-95 transition-all">-</button>
                          <span className="font-bold w-4 text-center text-lg">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.product.id, item.volume, item.quantity + 1)} className="w-8 h-8 rounded-full border border-white/10 hover:bg-white/10 active:scale-95 transition-all">+</button>
                          <button onClick={() => removeFromCart(item.product.id, item.volume)} className="ml-auto text-[10px] uppercase tracking-widest text-red-400 hover:text-red-300 opacity-50 hover:opacity-100 transition-opacity flex items-center gap-1"><ShieldCheck size={12}/> Видалити</button>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-2xl font-black tracking-tighter">{price * item.quantity}₴</div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Аксесуари */}
              {accessoryCart.length > 0 && (
                <div className="mt-8 space-y-4">
                  <h3 className="font-bold text-sm uppercase tracking-widest opacity-50 font-mono flex items-center gap-2"><Sparkles size={14} /> Додаткові Товари</h3>
                  {accessoryCart.map((item) => (
                    <div key={item.accessory.id} className="backdrop-blur-xl bg-purple-900/10 border border-purple-500/20 rounded-3xl p-6 flex flex-col md:flex-row justify-between items-center gap-6">
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-black rounded-2xl flex items-center justify-center text-3xl">
                          {item.accessory.image || '🎁'}
                        </div>
                        <div>
                          <h3 className="font-bold text-lg leading-tight uppercase">{item.accessory.nameUk}</h3>
                          <p className="text-purple-400 font-mono mt-1 text-xs">Цілісність: 100%</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-black text-xl">{item.accessory.price * item.quantity}₴</span>
                        <button onClick={() => removeAccessoryFromCart(item.accessory.id)} className="text-red-500 hover:text-red-400 p-2 opacity-50 hover:opacity-100 transition-all text-sm">✕</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* 🧩 CROSS-BRAND SYNERGY (Upsell - Semi-dynamic) */}
              {!cart.some(c => c.product.category === 'drops') && (
                <div className="relative overflow-hidden rounded-[2rem] p-[1px] mt-8">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00D4FF]/40 to-transparent animate-shimmer" />
                  <div className="relative bg-black/40 backdrop-blur-xl p-8 rounded-[2rem] border border-[#00D4FF]/20 flex flex-col md:flex-row items-center gap-8">
                    <div className="flex-1 text-center md:text-left">
                      <div className="flex items-center gap-2 mb-3 justify-center md:justify-start">
                        <Zap className="text-[#00D4FF]" size={16} />
                        <span className="text-[#00D4FF] font-black uppercase text-xs tracking-widest">Виявлено синергію!</span>
                      </div>
                      <h3 className="text-2xl font-bold mb-2 uppercase tracking-tight">FunnyDrops: Chaos Catalyst</h3>
                      <p className="text-[#A89880] text-sm leading-relaxed">Ці краплі посилюють дію твого чаю на 40% завдяки міксу елементів TLab. Ексклюзивна пропозиція для тебе.</p>
                    </div>
                    <Link href="/products" className="shrink-0 px-8 py-4 bg-[#00D4FF]/10 text-[#00D4FF] border border-[#00D4FF]/30 font-black uppercase text-sm tracking-tighter rounded-full hover:bg-[#00D4FF] hover:text-black transition-all hover:shadow-[0_0_30px_rgba(0,212,255,0.4)]">
                      Відкрити Каталог
                    </Link>
                  </div>
                </div>
              )}

              {/* СЕКЦІЯ РОЗБЛОКУВАННЯ */}
              <div className="mt-8 pt-8 border-t border-white/5">
                <div className={`p-8 rounded-[2rem] transition-all duration-500 border backdrop-blur-md ${synergyUnlocked ? 'bg-[#C4956A]/10 border-[#C4956A]/30' : 'bg-white/[0.02] border-white/5 opacity-80'}`}>
                  <h3 className="text-xl font-bold mb-2 flex items-center gap-3 uppercase tracking-tight">
                    {synergyUnlocked ? <span className="text-[#C4956A] flex items-center gap-2 animate-pulse"><ShieldCheck size={20}/> ПРОТОКОЛ "АРСЕНАЛ" РОЗБЛОКОВАНО!</span> : <span className="flex items-center gap-2"><Box size={20}/> Синхронізація недоступна</span>}
                  </h3>
                  {!synergyUnlocked && (
                    <p className="text-[#A89880] text-sm mb-6 leading-relaxed">
                      Додай ще {volumeToUnlock.toFixed(1)}л концентрату для розблокування секретного мерчу за собівартістю (Знижка до 50%).
                    </p>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                    {specialAccessories.map(acc => {
                      const inCart = accessoryCart.some(a => a.accessory.id === acc.id);
                      return (
                        <div key={acc.id} className={`bg-black/20 p-4 rounded-2xl flex items-center gap-4 transition-all ${!synergyUnlocked ? 'grayscale opacity-40 pointer-events-none' : 'hover:border-[#C4956A]/50 border border-transparent cursor-pointer'}`} onClick={() => synergyUnlocked && !inCart && handleAddAccessory(acc)}>
                          <span className="text-3xl drop-shadow-lg">{acc.image}</span>
                          <div className="flex-1">
                            <p className="text-sm font-bold uppercase leading-tight mb-1">{acc.name}</p>
                            <div className="flex items-center gap-2">
                              <p className="text-[10px] line-through opacity-50">{acc.regularPrice}₴</p>
                              <p className="text-[#C4956A] font-bold text-sm">{acc.specialPrice}₴</p>
                            </div>
                          </div>
                          {inCart && (
                            <span className="text-[10px] font-bold text-green-400 bg-green-400/10 px-2 py-1 rounded">ВІДКРИТО</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

            </div>

            {/* ПРАВАПАНЕЛЬ (Системні Дані) */}
            <div className="lg:col-span-1 space-y-4">
              
              {/* ANTIGRAVITY AGENT MESSAGE */}
              <div className="backdrop-blur-2xl bg-black/40 border border-[#C4956A]/30 rounded-3xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#C4956A]/10 blur-[40px] rounded-full pointer-events-none" />
                <div className="absolute -top-3 -left-3 w-8 h-8 bg-[#C4956A] rounded-full flex items-center justify-center shadow-[0_0_15px_#C4956A]">
                  <MessageSquare size={14} color="#0F0B08" fill="#0F0B08" />
                </div>
                <p className="text-[10px] uppercase text-[#C4956A] font-black mb-2 tracking-widest ml-4">Antigravity Agent v5.0</p>
                <p className="text-sm text-[#A89880] leading-relaxed font-mono">
                  "Аналізую ваш набір... Доставка в м. Київ можлива за 24 год. Рівень енергії екіпірування: <span className="text-[#C4956A] font-bold animate-pulse">КРИТИЧНИЙ</span>. Ви готові до деплою?"
                </p>
              </div>

              {/* CHECKOUT BOX */}
              <div className="backdrop-blur-3xl bg-[#0F0B08]/80 border border-white/10 rounded-3xl p-8 sticky top-24 shadow-2xl">
                <div className="flex items-center justify-between mb-8 opacity-60">
                  <span className="text-[10px] tracking-widest uppercase italic font-mono text-red-400">Temporal Stasis</span>
                  <span className="font-mono text-lg font-bold text-red-500 animate-pulse">{timeLeft}</span>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-[#A89880] text-sm">
                    <span>Товари ({getCartItemCount()} од)</span>
                    <span className="font-mono">{teaSubtotal}₴</span>
                  </div>
                  {accessoryCart.length > 0 && (
                    <div className="flex justify-between text-[#A89880] text-sm">
                      <span>Аксесуари та Додатки</span>
                      <span className="font-mono">{accessoryCart.reduce((acc, curr) => acc + curr.accessory.price * curr.quantity, 0)}₴</span>
                    </div>
                  )}
                  <div className="pt-6 mt-6 border-t border-white/10 flex justify-between items-end">
                    <span className="uppercase font-black text-sm tracking-tight text-white/50">До сплати</span>
                    <span className="text-4xl font-black tracking-tighter text-[#C4956A]">{Math.round(total)}₴</span>
                  </div>
                </div>

                <Link href="/checkout" onClick={() => {
                  if ((window as any).fbq) {
                    (window as any).fbq('track', 'InitiateCheckout', {
                      value: total,
                      currency: 'UAH',
                      content_ids: cart.map(i => i.product.id),
                      num_items: getCartItemCount()
                    });
                  }
                }} className="block w-full group relative overflow-hidden py-5 bg-white text-black font-black uppercase tracking-widest text-sm rounded-2xl transition-all hover:bg-[#C4956A] hover:shadow-[0_0_30px_rgba(196,149,106,0.3)] text-center cursor-pointer">
                    <span className="relative z-10 flex items-center justify-center gap-2">
                       Оформити Замовлення <Zap size={16} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                </Link>

                <div className="mt-6 flex items-center justify-center gap-2 flex-col">
                  <p className="text-[#C4956A] text-xs font-mono">
                    ⭐ +{calculateBonusEarned(total)} EXP (Бонусів) до профілю
                  </p>
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-white/30 pt-2 border-t border-white/5 w-full justify-center">
                    <ShieldCheck size={12} /> Encrypted by WSM Omniverse OS
                  </div>
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
