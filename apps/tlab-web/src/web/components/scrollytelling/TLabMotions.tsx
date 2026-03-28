import React, { useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

// 1. Thermo Slider Environment Simulation
export const ThermoSliderEnv = () => {
  const [temp, setTemp] = useState(20);
  
  // Calculate visual state based on temperature (-30 to +50)
  const isCold = temp < 0;
  const isHot = temp > 30;
  
  const bgColor = isCold ? 'rgba(0, 100, 255, 0.1)' : isHot ? 'rgba(255, 50, 0, 0.1)' : 'rgba(255, 255, 255, 0.02)';
  const borderColor = isCold ? '#00f0ff' : isHot ? '#ff3300' : '#444444';

  return (
    <motion.div 
      className="p-12 rounded-3xl border transition-colors duration-500 overflow-hidden relative"
      style={{ backgroundColor: bgColor, borderColor: borderColor }}
    >
      {/* Background FX */}
      {isCold && (
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/ice-crystal.png')] opacity-30 mix-blend-screen pointer-events-none" />
      )}
      {isHot && (
        <motion.div 
          animate={{ y: [-10, 10, -10], opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 bg-gradient-to-t from-red-500/20 to-transparent pointer-events-none blur-xl" 
        />
      )}

      <div className="relative z-10 flex flex-col items-center">
        <h3 className="text-3xl font-mono text-white mb-8 tracking-widest font-black uppercase">Thermo Simulator</h3>
        
        <div className="text-7xl font-black mb-12 font-mono tabular-nums" style={{ color: borderColor }}>
          {temp > 0 ? `+${temp}` : temp}°C
        </div>

        <input 
          type="range" 
          min="-30" max="50" 
          value={temp} 
          onChange={e => setTemp(Number(e.target.value))}
          className="w-full max-w-md h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
          style={{ accentColor: borderColor }}
        />
        
        <div className="flex justify-between w-full max-w-md mt-4 text-zinc-500 font-mono text-sm">
          <span>Екстремальний холод</span>
          <span>Кімнатна</span>
          <span>Аномальна спека</span>
        </div>

        <div className={`mt-12 p-6 glass rounded-xl border border-[${borderColor}]/30 max-w-md text-center`}>
          <p className="text-white/80 font-mono">Втрата тепла напою в термосі T-Lab за 24 години: <strong className="text-white">{(Math.abs(20 - temp) * 0.1).toFixed(1)}°C</strong></p>
        </div>
      </div>
    </motion.div>
  );
};

// 2. Haptic Pump Button
export const HapticPump = () => {
  const [pumping, setPumping] = useState(false);

  const handlePump = () => {
    setPumping(true);
    // Vibrate API if available (mobile)
    if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate([20, 30, 20]);
    }
    setTimeout(() => setPumping(false), 200);
  };

  return (
    <div className="flex flex-col items-center justify-center p-16 glass rounded-3xl border border-white/10 my-16">
      <p className="text-zinc-500 font-mono mb-8 uppercase tracking-widest text-sm text-center">
        Натисніть для імітації роботи вакуумної помпи (смартфони завібрують)
      </p>
      <motion.button
        onPointerDown={handlePump}
        animate={{ 
          scale: pumping ? 0.95 : 1,
          y: pumping ? 10 : 0 
        }}
        className="w-48 h-48 rounded-full bg-gradient-to-b from-zinc-800 to-black border-4 border-zinc-700 shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_10px_20px_rgba(255,255,255,0.1)] flex items-center justify-center focus:outline-none"
      >
        <span className="text-zinc-600 font-black text-2xl tracking-widest">PUMP</span>
      </motion.button>
      
      {/* Visual liquid feedback */}
      <motion.div 
        className="h-2 w-32 bg-[#00f0ff] mt-12 rounded-full overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div 
          className="h-full bg-white"
          animate={{ x: pumping ? ['-100%', '100%'] : '-100%' }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>
    </div>
  );
};

// 3. Quantum Particle Flow (Glassmorphic Data Hub)
export const QuantumParticleFlow = () => {
  return (
    <div className="relative h-80 rounded-3xl glass overflow-hidden border border-white/5 p-8 flex items-end">
      {/* Complex CSS particle field placeholder */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,240,255,0.1)_0%,transparent_70%)] opacity-50 pointer-events-none" />
      
      <div className="w-full relative z-10 flex justify-between items-end border-b border-white/20 pb-4">
        {[40, 70, 30, 90, 50, 80, 20].map((h, i) => (
          <motion.div 
            key={i}
            initial={{ height: 0 }}
            whileInView={{ height: `${h}%` }}
            transition={{ duration: 1, delay: i * 0.1, type: 'spring' }}
            viewport={{ once: false }}
            className="w-1/12 bg-gradient-to-t from-[#00f0ff]/50 to-transparent rounded-t-sm"
          />
        ))}
      </div>
      
      <div className="absolute top-8 left-8">
        <h4 className="font-mono text-zinc-500 uppercase text-xs mb-1">Синтез структури</h4>
        <p className="text-3xl font-black text-white">OPTIMAL_STATE</p>
      </div>
    </div>
  );
};
