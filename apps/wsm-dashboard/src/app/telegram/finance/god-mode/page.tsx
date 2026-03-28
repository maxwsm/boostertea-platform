'use client';

import { motion } from 'framer-motion';
import { Skull, Power, RefreshCw, ServerCrash } from 'lucide-react';
import WebApp from '@/lib/twa';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function GodModeUI() {
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
    <div className="relative min-h-screen px-5 pt-8 pb-20 flex flex-col items-center justify-center space-y-8 bg-black">
      {/* Background Alerts */}
      <div className="absolute inset-0 z-0 bg-red-900/5 pointer-events-none" />

      {/* Header */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="absolute top-8 left-5 right-5 flex items-center justify-between z-10"
      >
        <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          <ServerCrash size={20} className="text-red-500" /> God Mode
        </h1>
      </motion.header>

      {/* Warning Text */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="relative z-10 mt-10 text-center"
      >
        <Skull size={48} className="text-red-600 mx-auto mb-4" />
        <h2 className="text-3xl font-black text-white uppercase tracking-widest">Titan Core</h2>
        <p className="text-red-500 text-xs font-bold mt-2 uppercase tracking-widest">Absolute Access Granted</p>
      </motion.div>

      {/* Controls */}
      <div className="w-full space-y-4 z-10 flex-1 flex flex-col justify-end pb-8">
        
        <motion.button
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          onClick={() => {
            WebApp.HapticFeedback.notificationOccurred('success');
            WebApp.showAlert('Triggering Vercel API Deploy...');
          }}
          className="w-full bg-blue-600/20 border border-blue-500/50 text-blue-400 py-4 flex items-center justify-center rounded-2xl font-bold uppercase tracking-wider active:scale-95 transition-transform"
        >
          <RefreshCw size={18} className="mr-2" /> Force Global Deploy
        </motion.button>
        
        <motion.button
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          onClick={() => {
             WebApp.HapticFeedback.notificationOccurred('error');
             WebApp.showConfirm('Виконати Master Kill? Це зупинить всі процеси екосистеми згідно DB1-DB17.');
          }}
          className="w-full bg-red-600 border border-red-500 text-white py-4 flex items-center justify-center rounded-2xl shadow-[0_0_40px_rgba(220,38,38,0.5)] font-bold uppercase tracking-wider active:scale-95 transition-transform"
        >
          <Power size={18} className="mr-2" /> Activate Kill Switch
        </motion.button>

      </div>
    </div>
  );
}
