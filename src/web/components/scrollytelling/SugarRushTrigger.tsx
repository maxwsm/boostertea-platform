'use client'

"use client";
import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';

export const SugarRushTrigger = () => {
  const [active, setActive] = useState(false);

  const triggerRush = () => {
    setActive(true);
    
    // Play an 8-bit dubstep or sound effect if we had one
    // const audio = new Audio('/sugar-rush.mp3'); audio.play();

    // Trigger intense confetti
    const end = Date.now() + (3 * 1000);
    const colors = ['#00ff00', '#ff00ff', '#00ffff'];

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());

    // Reset after some time
    setTimeout(() => {
      setActive(false);
    }, 10000); // 10s of chaos
  };

  return (
    <div className={`my-16 flex flex-col items-center justify-center p-12 transition-all duration-300 rounded-3xl ${active ? 'backdrop-blur-none bg-black scale-105' : 'glass border border-[var(--danger)]/30'}`}>
      
      {!active ? (
        <button 
          onClick={triggerRush}
          className="group relative px-12 py-6 bg-red-600 hover:bg-red-500 rounded-full font-black text-2xl tracking-widest uppercase transition-all shadow-[0_0_50px_rgba(255,0,0,0.5)] active:scale-95 text-white"
        >
          <span className="relative z-10">ТІЛЬКИ НЕ НАТИСКАЙ!</span>
          <div className="absolute inset-0 bg-red-400 opacity-0 group-hover:opacity-20 rounded-full animate-ping" />
        </button>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.h2 
            animate={{ 
              color: ['#ff00ff', '#00ff00', '#00ffff', '#ff00ff'],
              x: [-5, 5, -5, 5, 0],
              y: [5, -5, 5, -5, 0]
            }}
            transition={{ duration: 0.3, repeat: Infinity }}
            className="text-6xl md:text-8xl font-black mb-8 italic drop-shadow-[0_0_20px_rgba(255,255,255,0.8)]"
          >
            SUGAR RUSH!
          </motion.h2>
          <p className="text-xl md:text-3xl font-mono text-white mb-8 bg-black/50 p-4 rounded-xl">
            Ти звільнив Діно! Твій персональний код на 5 боксів слашу:
          </p>
          <div className="bg-white text-black font-mono text-5xl font-black px-8 py-4 rounded-xl border-4 border-dashed border-red-500 inline-block shadow-[0_0_40px_rgba(255,255,255,1)]">
            DINO-CRAZY-50
          </div>
          <p className="mt-8 text-white/50 animate-pulse text-sm">Скинь цей лінк друзям, хай теж натиснуть 💀</p>
        </motion.div>
      )}
    </div>
  );
};
