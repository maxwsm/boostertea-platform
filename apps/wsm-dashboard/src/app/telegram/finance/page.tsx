'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Wallet, Bell, History } from 'lucide-react';
import WebApp from '@/lib/twa';
import { useEffect, useState } from 'react';

import { getLiveFinancePulse } from './actions';
import Link from 'next/link';

// Імітація хука анімації чисел
function AnimatedNumber({ value }: { value: number }) {
  // Фейкова анімація лічильника (в реальності useMotionValue + animate)
  return <span>{value.toLocaleString('uk-UA')}</span>;
}

export default function FinanceDashboardCore() {
  const [isReady, setIsReady] = useState(false);
  const [metrics, setMetrics] = useState({ revenue: 0, salaryDebt: 0, cashOnHand: 0, roas: 0 });

  useEffect(() => {
    setIsReady(true);
    if (typeof window !== 'undefined' && WebApp) {
      WebApp.HapticFeedback.notificationOccurred('success');
    }

    getLiveFinancePulse().then(data => setMetrics(data));
  }, []);

  if (!isReady) return null;

  return (
    <div className="relative min-h-screen px-5 pt-8 pb-32 flex flex-col space-y-8 bg-[#050505] selection:bg-blue-500/30 font-sans mx-auto max-w-lg">
      {/* Background Volumetric Lights */}
      <div className="fixed top-[-20%] right-[-30%] w-[120%] h-[80%] bg-gradient-to-bl from-blue-900/10 via-purple-900/10 to-transparent blur-[120px] pointer-events-none mix-blend-screen" />
      
      {/* Dynamic Header */}
      <motion.header 
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="flex items-center justify-between z-10"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white drop-shadow-md">
             TITAN<span className="text-blue-500 font-light">.OS</span>
          </h1>
          <p className="text-sm font-medium text-zinc-400 mt-1 uppercase tracking-widest">
            Founder Edition
          </p>
        </div>
        <button 
          onClick={() => WebApp.HapticFeedback.impactOccurred('light')}
          className="p-3 bg-white/5 border border-white/10 rounded-full backdrop-blur-xl active:scale-95 transition-transform"
        >
          <Bell size={20} className="text-zinc-300" />
        </button>
      </motion.header>

      {/* Hero Widget: Cash Balance (Glassmorphism Core) */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="relative z-10 w-full p-6 rounded-[2rem] bg-gradient-to-br from-white/10 to-transparent border border-white/5 shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_20px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden"
        style={{ backdropFilter: 'blur(24px)' }}
      >
        <div className="absolute -right-10 -top-10 w-32 h-32 bg-blue-500/20 blur-[50px] rounded-full pointer-events-none" />
        
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-blue-500/20 rounded-xl">
            <Wallet size={20} className="text-blue-400" />
          </div>
          <span className="text-sm font-semibold text-zinc-300 tracking-wide">CASH ON HAND</span>
        </div>
        
        <div className="flex flex-col">
          <h2 className="text-[2.5rem] leading-none font-bold text-white tracking-tight">
            {metrics.cashOnHand === 0 ? "..." : <AnimatedNumber value={metrics.cashOnHand} />} ₴
          </h2>
          <div className="flex items-center space-x-2 mt-3 text-emerald-400 bg-emerald-400/10 w-max px-3 py-1 rounded-lg">
            <TrendingUp size={16} />
            <span className="text-sm font-bold">+12.4% vs вчора (ROAS {metrics.roas})</span>
          </div>
        </div>
      </motion.div>

      {/* Brand Swapper (Step 9 Placeholder) */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-center space-x-2 z-10 w-full overflow-x-auto pb-2 scrollbar-none">
         <span className="px-4 py-1.5 bg-blue-600 rounded-full text-xs font-bold text-white shadow-[0_0_15px_rgba(37,99,235,0.4)] whitespace-nowrap">BoosterTea</span>
         <span className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs font-medium text-zinc-400 whitespace-nowrap">FunnyDrops</span>
         <span className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs font-medium text-zinc-400 whitespace-nowrap">TLab</span>
      </motion.div>

      {/* Secondary Quick Action Cards */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="grid grid-cols-2 gap-4 z-10"
      >
        <Link href="/telegram/finance" onClick={() => WebApp.HapticFeedback.impactOccurred('light')}>
          <div className="p-5 rounded-3xl bg-white/5 border border-white/5 backdrop-blur-md active:bg-white/10 transition-colors h-full">
            <h3 className="text-zinc-400 text-xs font-semibold tracking-wider mb-2">РЕВЕНЮ МІСЯЦЬ</h3>
            <p className="text-xl font-bold text-white"><AnimatedNumber value={metrics.revenue} /> ₴</p>
          </div>
        </Link>
        
        <Link href="/telegram/finance/cashflow" onClick={() => WebApp.HapticFeedback.impactOccurred('light')}>
          <div className="p-5 rounded-3xl bg-white/5 border border-white/5 backdrop-blur-md active:bg-white/10 transition-colors h-full">
            <h3 className="text-zinc-400 text-xs font-semibold tracking-wider mb-2">БОРГ (SALARY)</h3>
            <p className="text-xl font-bold text-red-400"><AnimatedNumber value={metrics.salaryDebt} /> ₴</p>
            <p className="text-[10px] text-zinc-500 mt-1 uppercase mt-auto">Відкрити Cashflow Map &rarr;</p>
          </div>
        </Link>
      </motion.div>

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="grid grid-cols-2 gap-3 z-10"
      >
        <Link href="/telegram/finance/warehouse" onClick={() => WebApp.HapticFeedback.selectionChanged()}>
          <div className="bg-white/5 border border-white/5 p-4 rounded-3xl flex flex-col items-center justify-center space-y-2 active:bg-white/10 h-full">
            <span className="text-2xl">📦</span>
            <span className="text-xs font-bold tracking-widest text-zinc-300">ARSENAL</span>
          </div>
        </Link>
        <Link href="/telegram/finance/hr" onClick={() => WebApp.HapticFeedback.selectionChanged()}>
          <div className="bg-white/5 border border-white/5 p-4 rounded-3xl flex flex-col items-center justify-center space-y-2 active:bg-white/10 h-full">
            <span className="text-2xl">👥</span>
            <span className="text-xs font-bold tracking-widest text-zinc-300">HR RADAR</span>
          </div>
        </Link>
        <Link href="/telegram/finance/ads" onClick={() => WebApp.HapticFeedback.selectionChanged()}>
          <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-3xl flex flex-col items-center justify-center space-y-2 active:bg-red-500/20 h-full shadow-[0_0_20px_rgba(239,68,68,0.1)]">
            <span className="text-2xl animate-pulse">🎯</span>
            <span className="text-xs font-bold tracking-widest text-red-400">OMNI-ADS</span>
          </div>
        </Link>
        <Link href="/telegram/finance/legal" onClick={() => WebApp.HapticFeedback.selectionChanged()}>
          <div className="bg-white/5 border border-white/5 p-4 rounded-3xl flex flex-col items-center justify-center space-y-2 active:bg-white/10 h-full">
            <span className="text-2xl">⚖️</span>
            <span className="text-xs font-bold tracking-widest text-zinc-300">LEGAL</span>
          </div>
        </Link>
        <Link href="/telegram/finance/god-mode" onClick={() => WebApp.HapticFeedback.impactOccurred('heavy')}>
             <div className="col-span-2 bg-gradient-to-r from-red-900/40 to-black border border-red-500/20 p-4 rounded-3xl flex items-center justify-center space-x-3 active:scale-95 transition-transform">
               <span className="text-xl">⚠️</span>
               <span className="text-sm font-bold tracking-widest text-red-500 uppercase">God Mode (Core Control)</span>
             </div>
        </Link>
      </motion.div>

      {/* The Oracle Floating Quick Button */}
      <motion.div 
        initial={{ y: 50, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }} 
        transition={{ delay: 0.6 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <Link href="/telegram/finance/oracle" onClick={() => WebApp.HapticFeedback.impactOccurred('medium')}>
          <div className="w-16 h-16 rounded-full bg-blue-600 shadow-[0_10px_30px_rgba(37,99,235,0.6)] flex items-center justify-center border-2 border-white/10">
            <span className="text-2xl">🔮</span>
          </div>
        </Link>
      </motion.div>

    </div>
  );
}
