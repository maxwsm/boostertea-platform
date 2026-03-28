'use client';

import { motion } from 'framer-motion';
import { ShoppingBag, Star, Zap, CheckCircle2 } from 'lucide-react';
import WebApp from '@/lib/twa';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createTmaCheckoutAction } from '../actions';
import Link from 'next/link';

const PRODUCTS = [
  { id: 'p1', name: 'DA HONG PAO', variant: '1L', category: 'Premium Extract', price: 1250, karma: 150, color: 'from-orange-600/60 to-red-900/60', img: '🍁' },
  { id: 'p2', name: 'GABA OOLONG', variant: '0.5L', category: 'Energy Boost', price: 890, karma: 100, color: 'from-emerald-500/60 to-teal-900/60', img: '🌿' },
  { id: 'p3', name: 'MILK OOLONG', variant: '1L', category: 'Relaxation Extract', price: 950, karma: 120, color: 'from-blue-400/60 to-indigo-900/60', img: '🥛' },
];

export default function B2CStoreShowcase() {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);
  const [cart, setCart] = useState<string[]>([]);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [successTx, setSuccessTx] = useState<string | null>(null);

  useEffect(() => {
    setIsReady(true);
    WebApp?.expand();
  }, []);

  const addToCart = (id: string, e: any) => {
    e.preventDefault();
    WebApp.HapticFeedback.impactOccurred('medium');
    setCart(prev => [...prev, id]);
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return WebApp.HapticFeedback.notificationOccurred('error');
    
    WebApp.HapticFeedback.impactOccurred('heavy');
    setIsCheckingOut(true);

    const items = cart.map(id => PRODUCTS.find(p => p.id === id)!);
    const totalAmount = items.reduce((sum, item) => sum + item.price, 0);

    // Call Secure Payment Server Action
    const res = await createTmaCheckoutAction({
      items,
      totalAmount,
      initData: WebApp.initData || ''
    });

    setIsCheckingOut(false);

    if (res.success) {
      WebApp.HapticFeedback.notificationOccurred('success');
      setSuccessTx(res.transactionId);
      setCart([]);
    } else {
      WebApp.HapticFeedback.notificationOccurred('error');
      alert('Checkout sync failed: ' + res.error);
    }
  };

  if (!isReady) return null;

  return (
    <div className="relative min-h-screen px-5 pt-8 pb-32 bg-[#050505] font-sans overflow-x-hidden selection:bg-blue-500/30">
      {/* Background Ambient Glow (Deep Aesthetics) */}
      <div className="fixed top-[-50%] left-[-20%] w-[140%] h-[100%] bg-gradient-to-br from-blue-600/10 via-purple-900/10 to-transparent blur-[120px] pointer-events-none" />

      {/* Store Header */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center justify-between z-10 relative mb-10"
      >
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-white">TITAN<span className="font-light text-zinc-500 text-shadow-sm">.STORE</span></h1>
          <p className="text-[10px] font-mono tracking-widest text-[#00ff66] uppercase flex items-center mt-1">
            <Zap size={10} className="mr-1 shadow-[0_0_10px_#00ff66]" /> Premium Tier Synced
          </p>
        </div>
      </motion.header>

      {successTx ? (
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center justify-center py-20 text-center relative z-10">
          <div className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(16,185,129,0.2)] animate-pulse">
            <CheckCircle2 size={40} className="text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">ОПЛАТУ ТРЕКНУТО</h2>
          <p className="text-zinc-500 text-sm font-mono max-w-[250px]">
            Хеш транзакції #{successTx.split('-')[0].toUpperCase()} передано в Колізей (1C Ledger).
          </p>
          <button 
            onClick={() => setSuccessTx(null)}
            className="mt-8 px-8 py-3 bg-white/10 hover:bg-white/20 active:scale-95 transition-all text-white font-bold tracking-widest uppercase text-xs rounded-full border border-white/10"
          >
            Повернутись в каталог
          </button>
        </motion.div>
      ) : (
        <>
          {/* Featured Carousel (150% Visuals) */}
          <div className="relative z-10 w-full mb-8">
            <div className="flex space-x-5 overflow-x-auto pb-8 scrollbar-none snap-x snap-mandatory pr-5">
              {PRODUCTS.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1, type: 'spring', bounce: 0.4 }}
                  className={`snap-center shrink-0 w-[290px] h-[380px] rounded-[2.5rem] bg-gradient-to-br \${product.color} p-6 flex flex-col justify-between shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_20px_60px_-15px_rgba(0,0,0,0.8)] border border-white/5 relative overflow-hidden`}
                >
                  {/* Glass Shimmer */}
                  <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none mix-blend-overlay" />
                  
                  {/* Floating emoji/img */}
                  <motion.div 
                    initial={{ y: 0 }}
                    animate={{ y: [-5, 5, -5] }}
                    transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                    className="absolute -right-4 -top-8 text-[140px] opacity-90 filter drop-shadow-[0_20px_20px_rgba(0,0,0,0.3)] pointer-events-none"
                  >
                    {product.img}
                  </motion.div>

                  <div className="relative z-10 flex justify-between items-start">
                    <span className="inline-block px-3 py-1 bg-black/40 backdrop-blur-xl rounded-full text-zinc-300 text-[10px] font-mono tracking-widest uppercase border border-white/5">
                      {product.category}
                    </span>
                  </div>

                  <div className="relative z-10">
                    <h3 className="text-3xl font-black text-white leading-none mb-1 drop-shadow-xl">{product.name}</h3>
                    <p className="text-zinc-300 font-medium mb-4 text-sm mix-blend-screen">{product.variant}</p>
                    
                    <div className="flex items-end justify-between">
                      <p className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400 drop-shadow-md">{product.price.toString()} ₴</p>
                      
                      <button 
                        onClick={(e) => addToCart(product.id, e)}
                        className="bg-white/20 active:bg-white/40 hover:bg-white/30 backdrop-blur-xl border border-white/20 w-12 h-12 rounded-full flex items-center justify-center transition-all"
                      >
                        <span className="text-white text-lg font-bold">+</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Floating Checkout Button (Only shown if cart > 0) */}
      {!successTx && (
        <motion.div 
          initial={{ y: 100 }}
          animate={{ y: cart.length > 0 ? 0 : 100 }}
          className="fixed bottom-6 left-5 right-5 z-50 flex justify-center"
        >
          <button 
             onClick={handleCheckout}
             disabled={isCheckingOut}
             className="w-full max-w-[340px] flex items-center justify-between bg-primary active:scale-95 transition-transform text-black p-4 rounded-2xl shadow-[0_0_40px_rgba(255,255,255,0.2)]"
          >
            <div className="flex items-center gap-3">
              <div className="bg-black/10 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                {cart.length}
              </div>
              <span className="font-bold tracking-wide uppercase text-sm">Оформити</span>
            </div>
            
            <span className="font-mono font-bold text-lg">
              {cart.reduce((s, id) => s + PRODUCTS.find(p => p.id === id)!.price, 0)} ₴
            </span>
          </button>
        </motion.div>
      )}

    </div>
  );
}
