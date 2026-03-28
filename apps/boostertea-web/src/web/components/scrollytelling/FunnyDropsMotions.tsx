import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

// 1. Frost Overlay (Canvas clearing logic placeholder)
export const FrostOverlay = () => {
  const [cleared, setCleared] = useState(0);

  return (
    <div className="relative h-[400px] w-full rounded-2xl overflow-hidden glass border border-blue-300/30 group">
      {/* Background Content */}
      <div className="absolute inset-0 flex items-center justify-center bg-zinc-900 p-8">
        <div className="text-center">
          <h3 className="text-3xl font-black text-blue-400 mb-4 drop-shadow-[0_0_10px_rgba(96,165,250,0.8)]">Секретний B2B Оффер</h3>
          <p className="text-xl text-white">Знижка 30% на льодогенератори Hoshizaki.</p>
        </div>
      </div>
      
      {/* Frost Layer - Simulated with blur and motion */}
      <motion.div 
        className="absolute inset-0 backdrop-blur-3xl bg-blue-100/10 cursor-pointer flex items-center justify-center"
        initial={{ opacity: 1 }}
        whileHover={{ opacity: 0.2 }}
        onHoverStart={() => setCleared(100)}
        transition={{ duration: 1.5 }}
      >
        <span className="text-blue-200/50 font-mono tracking-widest select-none pointer-events-none text-2xl drop-shadow-lg">
          [ Проведіть курсором, щоб розтопити лід ]
        </span>
      </motion.div>
    </div>
  );
};

// 2. Liquid Hover Drips
export const LiquidHoverDrips = ({ title = "Mango Syrup" }) => {
  return (
    <motion.div 
      whileHover="hover"
      className="relative p-12 glass rounded-2xl border-b-4 border-yellow-500 overflow-hidden cursor-pointer bg-gradient-to-t from-yellow-500/10 to-transparent"
    >
      <h3 className="text-4xl font-black text-white relative z-10">{title}</h3>
      
      {/* SVG Liquid Drip */}
      <motion.svg 
        viewBox="0 0 100 100" 
        preserveAspectRatio="none" 
        className="absolute top-0 left-0 w-full h-20 fill-yellow-500/30 -z-0"
        variants={{
          hover: { y: [ -20, 0 ], scaleY: [1, 1.5] }
        }}
        transition={{ type: 'spring', bounce: 0.6 }}
      >
        <path d="M0,0 L100,0 L100,10 Q80,40 50,10 Q20,40 0,10 Z" />
      </motion.svg>
    </motion.div>
  );
};

// 3. Expert Context PIP (Picture-in-Picture)
export const ExpertContext = ({ text, tooltip, videoUrl }: { text: string, tooltip: string, videoUrl?: string }) => {
  const [show, setShow] = useState(false);

  return (
    <span className="relative inline-block">
      <span 
        className="underline decoration-yellow-500 decoration-wavy cursor-help underline-offset-4 text-yellow-300 mx-1 font-bold"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
      >
        {text}
      </span>
      
      <AnimatePresence>
        {show && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-64 p-4 glass rounded-xl border border-yellow-500/50 shadow-2xl z-50 pointer-events-none"
          >
            <div className="w-full h-32 bg-zinc-800 rounded-lg mb-3 overflow-hidden relative">
              {/* Fake Video Player */}
              <div className="absolute inset-0 bg-yellow-500/20 mix-blend-overlay" />
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-12 h-12 text-yellow-500 opacity-50" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" /></svg>
              </div>
            </div>
            <p className="text-white text-sm leading-tight border-l-2 border-yellow-500 pl-2">
              <span className="text-yellow-500 font-bold block mb-1">Назар каже:</span>
              {tooltip}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
};

// 4. Neon Cocktail Mixer Widget
export const NeonCocktailMixer = () => {
  const [mix, setMix] = useState(0);
  
  return (
    <div className="p-8 rounded-3xl border border-purple-500/30 glass flex flex-col items-center">
      <h3 className="text-2xl text-white font-black mb-6">Синтезатор Смаку</h3>
      <div className="relative w-40 h-64 border-4 border-white/20 rounded-b-3xl rounded-t-lg overflow-hidden flex items-end mb-8 shadow-[0_0_30px_rgba(255,0,255,0.2)]">
        <motion.div 
          className="w-full bg-gradient-to-t from-purple-600 to-pink-400"
          animate={{ height: `${mix}%` }}
          transition={{ type: "spring", stiffness: 50 }}
        />
        {/* Fill marker lines */}
        <div className="absolute inset-0 flex flex-col justify-between py-4 pointer-events-none opacity-30">
          <div className="w-4 h-px bg-white" /><div className="w-8 h-px bg-white" /><div className="w-4 h-px bg-white" />
        </div>
      </div>
      <input 
        type="range" 
        min="0" max="100" 
        value={mix} 
        onChange={e => setMix(Number(e.target.value))}
        className="w-64 accent-pink-500"
      />
      <p className="mt-4 font-mono text-pink-400">Насиченість: {mix}%</p>
    </div>
  );
};
import { AnimatePresence } from 'framer-motion';
