import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export const LaunchSequence = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show the launch sequence on the first visit
    const hasLaunched = localStorage.getItem('wsm_system_launched');
    if (!hasLaunched) {
      setIsVisible(true);
      localStorage.setItem('wsm_system_launched', 'true');
    }
  }, []);

  if (!isVisible) return null;

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ delay: 3, duration: 1 }}
      onAnimationComplete={() => setIsVisible(false)}
      className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center font-mono pointer-events-none"
    >
      <motion.div 
        initial={{ scale: 0.8, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-[var(--accent)] text-4xl md:text-5xl font-black italic mb-6 tracking-tighter"
      >
        <span className="text-white">BOOSTER TEA</span> // OMNIVERSE
      </motion.div>
      
      <div className="w-64 h-[2px] bg-white/10 overflow-hidden relative mb-6">
        <motion.div 
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
          className="w-full h-full bg-[var(--accent)] absolute inset-0 shadow-[0_0_15px_var(--accent)]"
        />
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex flex-col items-center space-y-2"
      >
        <p className="text-[10px] uppercase tracking-[0.5em] text-[#CCFF00]/50 animate-pulse">
          Initializing Antigravity Protocols...
        </p>
        <p className="text-[10px] uppercase tracking-[0.3em] text-white/30">
          Neural Handshake Established
        </p>
      </motion.div>
    </motion.div>
  );
};
