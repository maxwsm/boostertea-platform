'use client';

import { motion } from 'framer-motion';
import { CreditCard, Truck, AlertCircle } from 'lucide-react';
import WebApp from '@/lib/twa';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';

const CART_ITEMS = [
  { id: 'p1', name: 'DA HONG PAO 1L', qty: 1, price: 1250, img: '🍁' },
  { id: 'p2', name: 'GABA OOLONG 0.5L', qty: 2, price: 890, img: '🌿' },
];

export default function GravityCartUI() {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Constants
  const FREE_SHIPPING_THRESHOLD = 2500;
  const totalAmount = CART_ITEMS.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const isFreeShipping = totalAmount >= FREE_SHIPPING_THRESHOLD;
  const shippingCost = isFreeShipping ? 0 : 120;
  const finalTotal = totalAmount + shippingCost;

  useEffect(() => {
    setIsReady(true);
    WebApp.BackButton.show();
    WebApp.BackButton.onClick(() => router.back());
    
    // Confetti on mount if free shipping is achieved
    if (isFreeShipping && typeof window !== 'undefined') {
      WebApp.HapticFeedback.notificationOccurred('success');
      confetti({ particleCount: 150, spread: 80, y: 0.2, colors: ['#10b981', '#ffffff'] });
    }

    return () => WebApp.BackButton.hide();
  }, [router, isFreeShipping]);

  if (!isReady) return null;

  const handleMonobankCheckout = async () => {
    WebApp.HapticFeedback.impactOccurred('heavy');
    setIsProcessing(true);
    
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: finalTotal,
          products: CART_ITEMS,
          redirectUrl: `\${window.location.origin}/telegram/store/success`
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Payment failed');
      
      WebApp.HapticFeedback.notificationOccurred('success');
      
      // Open the Monobank acquiring payload link native or via popup
      if (WebApp.openLink) {
        WebApp.openLink(data.pageUrl);
      } else {
        window.location.href = data.pageUrl;
      }
    } catch (error) {
      console.error('Checkout error:', error);
      WebApp.HapticFeedback.notificationOccurred('error');
      alert('Error initiating checkout. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="relative min-h-screen px-5 pt-8 pb-32 bg-[#09090b]">
      {/* Header */}
      <h1 className="text-3xl font-black tracking-tighter text-white mb-6">Кошик</h1>

      {/* Cart Items (Gravity Drop Animation) */}
      <div className="space-y-4 mb-8">
        {CART_ITEMS.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: -50, rotate: i % 2 === 0 ? -2 : 2 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ type: "spring", bounce: 0.6, delay: i * 0.15 }}
            className="flex items-center p-4 bg-white/5 border border-white/5 rounded-3xl backdrop-blur-md"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-white/10 to-transparent rounded-2xl flex items-center justify-center text-3xl shadow-inner mr-4">
              {item.img}
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-white text-sm uppercase tracking-wider">{item.name}</h3>
              <p className="text-zinc-500 text-xs font-semibold mt-1">К-сть: {item.qty} шт.</p>
            </div>
            <p className="font-bold text-white text-lg">{(item.price * item.qty).toLocaleString('uk-UA')} ₴</p>
          </motion.div>
        ))}
      </div>

      {/* Shipping Progress */}
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
        className="w-full bg-white/5 p-5 rounded-3xl border border-white/5 mb-8"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
             <Truck size={18} className="\${isFreeShipping ? 'text-emerald-400' : 'text-zinc-400'}" />
             <span className="text-sm font-semibold text-white">Доставка Новою Поштою</span>
          </div>
          <span className="text-sm font-bold text-emerald-400">{isFreeShipping ? 'БЕЗКОШТОВНО' : '\${shippingCost} ₴'}</span>
        </div>
        
        {!isFreeShipping && (
          <>
            <div className="w-full h-2 bg-black/50 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }} 
                animate={{ width: `\${(totalAmount / FREE_SHIPPING_THRESHOLD) * 100}%` }} 
                className="h-full bg-blue-500" 
              />
            </div>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-2 flex items-center">
              <AlertCircle size={10} className="mr-1 inline" />
              Додайте товарів на {(FREE_SHIPPING_THRESHOLD - totalAmount).toLocaleString('uk-UA')} ₴ для фрі шипу
            </p>
          </>
        )}
      </motion.div>

      {/* Fixed Checkout Bar */}
      <motion.div 
        initial={{ y: 100 }} animate={{ y: 0 }} transition={{ type: 'spring', damping: 20 }}
        className="fixed bottom-0 left-0 w-full p-5 bg-[#09090b]/90 backdrop-blur-xl border-t border-white/10 z-50 flex items-center justify-between"
      >
        <div>
          <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">До сплати</p>
          <p className="text-2xl font-black text-white">{finalTotal.toLocaleString('uk-UA')} ₴</p>
        </div>
        <button
          onClick={handleMonobankCheckout}
          disabled={isProcessing}
          className="bg-white text-black px-6 py-4 rounded-2xl font-black uppercase tracking-widest flex items-center shadow-[0_0_40px_rgba(255,255,255,0.2)] active:scale-95 transition-transform disabled:opacity-50"
        >
          {isProcessing ? 'Шифрування...' : (
            <>
              <CreditCard size={20} className="mr-2" /> Pay
            </>
          )}
        </button>
      </motion.div>
    </div>
  );
}
