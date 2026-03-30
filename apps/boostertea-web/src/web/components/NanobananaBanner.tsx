import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export const NanobananaBanner = ({ isSoldOut = false }) => {
  const [timeState, setTimeState] = useState('DEFAULT');

  useEffect(() => {
    if (isSoldOut) {
      setTimeState('SOLD_OUT');
      return;
    }
    const hour = new Date().getHours();
    if (hour >= 22 || hour <= 4) setTimeState('NIGHT');
    else if (hour > 4 && hour <= 10) setTimeState('MORNING');
    else setTimeState('ACTIVE');
  }, [isSoldOut]);

  const copyRef = {
    NIGHT: { main: "НІЧНИЙ КОДИНГ.", sub: "Блокуй сон. Компілюй реальність.", accent: "#CCFF00" },
    MORNING: { main: "СИСТЕМУ ЗАПУЩЕНО.", sub: "Завантаження нейронів: 100%.", accent: "#CCFF00" },
    ACTIVE: { main: "OVERCLOCKING.", sub: "Твій фокус на межі можливостей.", accent: "#CCFF00" },
    DEFAULT: { main: "BOOSTERTEA SYNC.", sub: "Drink // Focus // Create", accent: "#CCFF00" },
    SOLD_OUT: { main: "CRITICAL LOAD", sub: "INVENTORY DEPLETED. SYNDICATE RESTOCKING.", accent: "#FF0033" }
  };

  const currentCopy = copyRef[timeState as keyof typeof copyRef];
  const isRed = timeState === 'SOLD_OUT';

  return (
    <div className={`relative w-full h-96 overflow-hidden rounded-[2rem] bg-black text-white font-mono flex items-center justify-center border group ${isRed ? 'border-red-500/50' : 'border-[#CCFF00]/20'}`}>
      
      {/* 📺 ШАР 1: Візуальний шум (Grain / Lo-Fi) */}
      <div 
        className="absolute inset-0 opacity-[0.2] mix-blend-overlay pointer-events-none"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
      />
      
      {/* 🧪 ШАР 2: Акцент (Nanobanana Acid Green / Error Red) */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] animate-pulse ${isRed ? 'bg-[radial-gradient(circle,rgba(255,0,51,0.15)_0%,transparent_50%)]' : 'bg-[radial-gradient(circle,rgba(204,255,0,0.1)_0%,transparent_50%)]'}`} />
      
      <div className={`absolute top-0 right-0 w-64 h-64 blur-3xl ${isRed ? 'bg-[radial-gradient(circle,rgba(255,0,0,0.2)_0%,transparent_70%)]' : 'bg-[radial-gradient(circle,rgba(255,0,255,0.15)_0%,transparent_70%)]'}`} />

      {/* 🖥 ШАР 3: Glitch Текст */}
      <div className="relative z-10 text-center uppercase">
        <motion.h2 
          className={`text-5xl md:text-7xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 relative ${isRed ? 'drop-shadow-[0_0_20px_rgba(255,0,51,0.8)]' : 'drop-shadow-[0_0_15px_rgba(204,255,0,0.5)]'}`}
          initial={{ x: -10, opacity: 0 }}
          animate={isRed ? { x: [-5, 5, -5, 5, 0], opacity: [0.8, 1, 0.8, 1] } : { x: 0, opacity: 1 }}
          transition={isRed ? { duration: 0.3, repeat: Infinity, repeatType: 'mirror' } : { duration: 0.5 }}
        >
          {/* Хроматична аберація */}
          <span className={`absolute -left-1 top-0 opacity-50 mix-blend-screen ${isRed ? 'text-red-500 -translate-x-1' : 'text-[#CCFF00]'}`}>{currentCopy.main}</span>
          <span className={`absolute left-1 top-0 opacity-50 mix-blend-screen ${isRed ? 'text-blue-500 translate-x-1' : 'text-[#FF00FF]'}`}>{currentCopy.main}</span>
          {currentCopy.main}
        </motion.h2>
        
        <motion.p 
          className={`mt-4 text-sm tracking-[0.3em] font-bold ${isRed ? 'text-red-400' : 'text-[#CCFF00]'}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {`> ${currentCopy.sub}`}
        </motion.p>
      </div>

      {/* 🛒 ШАР 4: Call to Action */}
      <button 
        disabled={isSoldOut}
        className={`absolute bottom-8 right-8 backdrop-blur-xl bg-white/5 border px-8 py-3 rounded-xl text-xs tracking-widest font-black uppercase transition-all duration-300 ${
          isRed 
          ? 'border-red-500/50 text-red-500 opacity-50 cursor-not-allowed' 
          : 'border-[#CCFF00]/50 text-[#CCFF00] hover:bg-[#CCFF00] hover:text-black shadow-[0_0_20px_rgba(204,255,0,0.2)]'
        }`}
      >
        {isSoldOut ? 'PRE-ORDER PENDING' : 'Екіпірувати Артефакт'}
      </button>

      {/* ⚡ Scanline ефект */}
      <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] pointer-events-none opacity-20" />
    </div>
  );
};
