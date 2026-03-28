'use client';

import { motion } from 'framer-motion';
import { Target, Skull, Activity } from 'lucide-react';
import WebApp from '@/lib/twa';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function OmniAdsControlUI() {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);
  const [roas] = useState(2.8); // Dangerously low ROAS example

  useEffect(() => {
    setIsReady(true);
    WebApp.BackButton.show();
    WebApp.BackButton.onClick(() => router.back());
    return () => WebApp.BackButton.hide();
  }, [router]);

  if (!isReady) return null;

  const handleKillSwitch = () => {
    WebApp.HapticFeedback.notificationOccurred('error');
    WebApp.showAlert('🚨 API Тригер: Всі кампанії Meta Ads зупинено.');
  };

  return (
    <div className="relative min-h-screen px-5 pt-8 pb-20 flex flex-col items-center justify-center space-y-8 bg-[#09090b]">
      {/* Background Alerts */}
      {roas < 3.0 && (
        <div className="absolute inset-0 z-0 bg-red-900/10 animate-pulse pointer-events-none" />
      )}

      {/* Header */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="absolute top-8 left-5 right-5 flex items-center justify-between z-10"
      >
        <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          <Target size={20} className="text-zinc-400" /> Omni-Ads
        </h1>
      </motion.div>

      {/* ROAS Sphere */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.7, type: 'spring' }}
        className="relative z-10 flex flex-col items-center justify-center"
      >
        <div className="w-48 h-48 rounded-full border-[6px] border-red-500/30 flex shadow-[0_0_80px_rgba(239,68,68,0.3)] items-center justify-center bg-black/50 backdrop-blur-xl relative">
          <Activity size={32} className="absolute top-6 text-red-500 animate-pulse" />
          <div className="text-center mt-4">
            <p className="text-5xl font-extrabold text-white tracking-tighter">{roas}</p>
            <p className="text-xs text-red-400 font-bold tracking-widest uppercase mt-2">ROAS Critical</p>
          </div>
        </div>
      </motion.div>

      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-center text-zinc-400 text-sm max-w-xs z-10"
      >
        Ефективність реклами впала нижче рентабельності. Активувати протокол зупинки бюджетів?
      </motion.p>

      {/* Kill Switch (Hold to execute simulation) */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="w-full mt-auto z-10"
      >
        <button
          onClick={handleKillSwitch}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-red-600 to-red-800 text-white font-bold text-lg flex items-center justify-center gap-2 shadow-[0_10px_40px_-10px_rgba(239,68,68,0.8)] active:scale-95 transition-all"
        >
          <Skull size={24} />
          <span>KILL ADS (PAUSE ALL)</span>
        </button>
      </motion.div>
    </div>
  );
}
