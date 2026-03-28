'use client';

import { motion } from 'framer-motion';
import { DownloadCloud, ArrowUpCircle, ArrowDownCircle, ArrowRight } from 'lucide-react';
import WebApp from '@/lib/twa';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const MOCK_AR_AP = [
  { id: 'AP-1', entity: 'ФОП Кубеко', amount: -179000, type: 'AP', date: '01.05.2026', status: 'CRITICAL' },
  { id: 'AR-1', entity: 'ТОВ Клевер Сорс', amount: 20000, type: 'AR', date: '03.05.2026', status: 'OPEN' },
  { id: 'AP-2', entity: 'ДПС (Податки ТОВ)', amount: -38400, type: 'AP', date: '20.04.2026', status: 'PENDING' },
];

export default function CashflowMap() {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
    WebApp.BackButton.show();
    WebApp.BackButton.onClick(() => router.back());
    return () => WebApp.BackButton.hide();
  }, [router]);

  if (!isReady) return null;

  return (
    <div className="relative min-h-screen px-5 pt-8 pb-20 flex flex-col space-y-6 bg-[#09090b]">
      {/* Dynamic Header */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center justify-between z-10"
      >
        <h1 className="text-2xl font-bold tracking-tight text-white">Cashflow Map</h1>
        <button onClick={() => WebApp.HapticFeedback.impactOccurred('light')}>
          <DownloadCloud size={20} className="text-blue-500" />
        </button>
      </motion.header>

      {/* Hero Heatmap (Glassmorphism) */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="relative w-full p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl"
      >
        <div className="flex justify-between items-end mb-6">
          <div>
            <p className="text-zinc-400 text-xs font-semibold tracking-wide mb-1">PAYABLES (БОРГИ)</p>
            <h2 className="text-2xl font-bold text-red-500">-217,400 ₴</h2>
          </div>
          <div className="text-right">
            <p className="text-zinc-400 text-xs font-semibold tracking-wide mb-1">RECEIVABLES</p>
            <h2 className="text-2xl font-bold text-emerald-500">+20,000 ₴</h2>
          </div>
        </div>

        {/* Heatmap Bar */}
        <div className="w-full h-3 rounded-full bg-black/50 overflow-hidden flex">
          <motion.div initial={{ width: 0 }} animate={{ width: '90%' }} className="bg-red-500 h-full" />
          <motion.div initial={{ width: 0 }} animate={{ width: '10%' }} className="bg-emerald-500 h-full" />
        </div>
        <p className="text-center text-xs text-zinc-500 mt-4">Увага: Негативний Cashflow-розрив на 01 Травня</p>
      </motion.div>

      {/* AR / AP Dynamic List */}
      <div className="space-y-3 z-10 mt-4">
        <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-widest pl-2 mb-2">Зобов'язання (DB16)</h3>
        
        {MOCK_AR_AP.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + (i * 0.1) }}
            onClick={() => WebApp.HapticFeedback.selectionChanged()}
            className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl active:bg-white/10 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-xl \${item.type === 'AR' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                {item.type === 'AR' ? <ArrowUpCircle size={20} /> : <ArrowDownCircle size={20} />}
              </div>
              <div>
                <h4 className="font-semibold text-white text-sm">{item.entity}</h4>
                <p className="text-xs text-zinc-500">{item.status} • {item.date}</p>
              </div>
            </div>
            
            <div className="flex items-center justify-end space-x-3">
               <span className={`font-mono font-bold \${item.type === 'AR' ? 'text-emerald-400' : 'text-red-400'}`}>
                 {item.amount > 0 ? '+' : ''}{item.amount.toLocaleString('uk-UA')}
               </span>
               <ArrowRight size={14} className="text-zinc-600" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
