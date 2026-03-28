'use client';

import { motion } from 'framer-motion';
import { ShoppingCart, Star, PercentSquare } from 'lucide-react';
import WebApp from '@/lib/twa';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProductFluidPage({ params }: { params: Promise<{ productId: string }> }) {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
    WebApp.BackButton.show();
    WebApp.BackButton.onClick(() => router.back());
    return () => WebApp.BackButton.hide();
  }, [router]);

  if (!isReady) return null;

  const handleAddToCart = () => {
    WebApp.HapticFeedback.notificationOccurred('success');
    WebApp.showAlert('Товар додано до кошика! ✨');
    router.back();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 100 }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="fixed inset-0 z-50 bg-[#09090b] flex flex-col"
    >
      {/* Product Massive Visual */}
      <div className="relative w-full h-[55%] bg-gradient-to-br from-orange-600 to-red-900 rounded-b-[3rem] shadow-2xl flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-white/10 mix-blend-overlay pointer-events-none" />
        <motion.div 
          initial={{ scale: 0.8, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
          className="text-[180px] drop-shadow-[0_40px_40px_rgba(0,0,0,0.5)]"
        >
          🍁
        </motion.div>
        
        <div className="absolute top-6 right-6 bg-black/30 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 flex items-center text-yellow-400 font-bold text-xs shadow-lg">
          <Star size={14} fill="currentColor" className="mr-1" />
          <span>Special Edition</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 pt-8 pb-10 flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-black text-white uppercase tracking-tighter leading-none mb-2">DA HONG PAO 1L</h1>
            <p className="text-zinc-400 font-medium text-sm">Преміальний концентрат сильної обсмажки. Вистачить на 40+ порцій.</p>
          </div>
          <p className="text-2xl font-bold text-white tracking-tight shrink-0">1,250 ₴</p>
        </div>

        {/* Gamification Badge */}
        <div className="flex items-center space-x-3 bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl mb-auto">
          <PercentSquare size={24} className="text-emerald-400" />
          <div>
            <p className="text-white font-bold text-sm">10% Кешбек</p>
            <p className="text-emerald-400 text-xs font-semibold">+150 Карма на ваш акаунт</p>
          </div>
        </div>

        {/* Add to Cart Fixed Bottom */}
        <button
          onClick={handleAddToCart}
          className="w-full mt-6 py-4 bg-white text-black rounded-2xl font-black text-lg uppercase tracking-widest flex items-center justify-center shadow-[0_0_40px_rgba(255,255,255,0.3)] active:scale-95 transition-transform"
        >
          <ShoppingCart size={20} className="mr-3" />
          Додати в Кошик
        </button>
      </div>
    </motion.div>
  );
}
