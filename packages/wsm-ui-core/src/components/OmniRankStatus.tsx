import React from 'react';
import { motion } from 'framer-motion';
// Використовуватимемо локальний макет рівнів, якщо ліби ще немає.
// Відредагуй логіку відповідно до нашого level.ts.

export const LEVEL_TITLES = [
  { minXp: 0, title: "INITIATE", rank: "GUEST_PROTO" },
  { minXp: 500, title: "ENERGY WEAVER", rank: "BOOSTER_CLASS" },
  { minXp: 1500, title: "CRYO-EXPLORER", rank: "DINO_CLASS" },
  { minXp: 4000, title: "BIO-ARCHITECT", rank: "TLAB_ELITE" },
  { minXp: 10000, title: "OMNI-ARCHON", rank: "GOD_MODE" }
];

export const calculateLevel = (xp: number) => {
  const level = Math.floor(Math.sqrt(xp) / 5) || 1;
  const currentRank = [...LEVEL_TITLES].reverse().find(t => xp >= t.minXp) || LEVEL_TITLES[0];
  
  const currentIndex = LEVEL_TITLES.findIndex(t => t.minXp === currentRank.minXp);
  const nextRank = LEVEL_TITLES[currentIndex + 1];
  
  const progress = nextRank 
    ? ((xp - currentRank.minXp) / (nextRank.minXp - currentRank.minXp)) * 100 
    : 100;

  return { level, title: currentRank.title, progress, rankCode: currentRank.rank };
};

export const OmniRankStatus = ({ xp, className = '' }: { xp: number; className?: string }) => {
  const { level, title, progress, rankCode } = calculateLevel(xp);

  return (
    <div className={`mt-4 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md ${className}`}>
      <div className="flex justify-between items-end mb-2 font-mono">
        <div>
          <p className="text-[10px] uppercase opacity-50 tracking-tighter text-white">Current Rank</p>
          <h4 className="text-sm font-black italic tracking-widest text-accent text-[#C4956A]">{title}</h4>
        </div>
        <div className="text-right text-white">
          <p className="text-[10px] opacity-50 uppercase">Level</p>
          <span className="text-xl font-black italic">{level}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden relative">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          className="absolute left-0 top-0 h-full bg-gradient-to-r from-[#C4956A] to-white"
        />
      </div>
      
      <p className="mt-3 text-[9px] uppercase opacity-40 text-center tracking-[0.2em] font-mono text-white">
        {rankCode} // System Verified
      </p>
    </div>
  );
};
