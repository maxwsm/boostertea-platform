'use client';

import { motion } from 'framer-motion';
import { PackageCheck, Home, Star } from 'lucide-react';
import WebApp from '@/lib/twa';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function GamifiedSuccessUI() {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
    WebApp.BackButton.hide(); // Немає сенсу повертатись на чекаут
    WebApp.HapticFeedback.notificationOccurred('success');
  }, [router]);

  if (!isReady) return null;

  return (
    <div className="relative min-h-[100dvh] flex flex-col items-center justify-center p-6 bg-[#09090b] text-center overflow-hidden">
      {/* Background Pulse */}
      <div className="absolute inset-0 z-0 bg-emerald-900/20 animate-pulse pointer-events-none" />
      <div className="absolute w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full z-0" />

      <motion.div
        initial={{ scale: 0, rotate: -45 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", bounce: 0.6, duration: 1 }}
        className="relative z-10 w-32 h-32 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-full flex items-center justify-center shadow-[0_0_80px_rgba(16,185,129,0.4)] mb-8"
      >
        <PackageCheck size={64} className="text-white" />
      </motion.div>

      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="z-10">
        <h1 className="text-3xl font-black text-white tracking-tight uppercase">Оплата Успішна!</h1>
        <p className="text-emerald-400 text-sm font-bold tracking-widest mt-2 uppercase">TITAN.ERP Синхронізовано</p>
      </motion.div>

      <motion.div 
        initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}
        className="z-10 bg-white/5 border border-white/5 p-6 rounded-3xl mt-8 max-w-sm w-full backdrop-blur-md"
      >
        <div className="flex justify-center mb-4">
          <Star size={32} className="text-yellow-400 fill-current animate-bounce" />
        </div>
        <h2 className="text-xl font-bold text-white uppercase tracking-wider mb-2">+ 350 EXP / Карма</h2>
        <p className="text-zinc-400 text-xs leading-relaxed">
          Ваше замовлення #PO-4091 автоматично передано на виробництво (Склад Львів). 
          Очікуйте сповіщення від Нової Пошти через Телеграм-бота.
        </p>
      </motion.div>

      <motion.button
        initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.7 }}
        onClick={() => router.push('/telegram/store')}
        className="z-10 mt-auto w-full py-4 bg-white/10 hover:bg-white/20 active:bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-white font-bold uppercase tracking-widest transition-all"
      >
        <Home size={18} className="mr-2" /> До Вітрини
      </motion.button>
    </div>
  );
}
