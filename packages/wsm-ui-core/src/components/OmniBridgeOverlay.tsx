import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export type OmniBrand = 'dino' | 'tlab' | 'funny' | 'booster';

export interface OmniBridgeProps {
  targetBrand: OmniBrand;
  isComplete?: boolean;
}

export const OmniBridgeOverlay = ({ targetBrand, isComplete = false }: OmniBridgeProps) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isComplete) {
      setProgress(100);
      return;
    }
    const timer = setInterval(() => {
      setProgress(prev => (prev < 90 ? prev + 3 : prev)); // зупиняється на 90% до isComplete
    }, 30);
    return () => clearInterval(timer);
  }, [isComplete]);

  const styles = {
    dino: { bg: 'bg-[#000814]', color: 'text-cyan-400', label: 'КРІО-СИНХРОНІЗАЦІЯ', effect: '❄️' },
    tlab: { bg: 'bg-[#050505]', color: 'text-emerald-500', label: 'DECRYPTING NEURAL DATA', effect: '💾' },
    funny: { bg: 'bg-[#1a001a]', color: 'text-fuchsia-500', label: 'CHAOS MERGING', effect: '🌀' },
    booster: { bg: 'bg-[#0A0705]', color: 'text-[#C4956A]', label: 'WSM CORE SYNC', effect: '⚡' }
  };

  const theme = styles[targetBrand];

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
        transition={{ duration: 0.5 }}
        className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center ${theme.bg} font-mono`}
      >
        {/* Анімований фон (Grid) */}
        <div className="absolute inset-0 opacity-20 bg-[url('/assets/grid.svg')] bg-center pointer-events-none" />
        
        <motion.div 
          animate={{ scale: [1, 1.1, 1] }} 
          transition={{ repeat: Infinity, duration: 2 }}
          className={`text-6xl mb-8 ${theme.color} z-10`}
        >
          {theme.effect}
        </motion.div>

        <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden mb-4 z-10">
          <motion.div 
            className={`h-full ${theme.color.replace('text-', 'bg-')}`}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: "easeOut", duration: 0.2 }}
          />
        </div>

        <div className={`text-xs tracking-[0.4em] uppercase ${theme.color} animate-pulse z-10 text-center`}>
          {theme.label} [{progress}%]
        </div>

        {/* Лог завантаження (тільки для TLab) */}
        {targetBrand === 'tlab' && (
          <div className="mt-8 text-[10px] text-emerald-500/50 space-y-2 text-left w-64 z-10">
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>{`> Fetching encrypted_inventory... OK`}</motion.p>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>{`> Handshaking with node_kyiv... OK`}</motion.p>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>{`> Bypassing firewall... OK`}</motion.p>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};
