import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const ComingSoon = ({ onUnlock }: { onUnlock: () => void }) => {
  const [showInput, setShowInput] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ d: 23, h: 10, m: 45, s: 30 }); // Default for SSR
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const target = new Date('2026-04-13T10:00:00');
    
    const updateTimer = () => {
      const now = new Date();
      const diff = target.getTime() - now.getTime();
      if (diff <= 0) return;
      setTimeLeft({
        d: Math.floor(diff / (1000 * 60 * 60 * 24)),
        h: Math.floor((diff / (1000 * 60 * 60)) % 24),
        m: Math.floor((diff / 1000 / 60) % 60),
        s: Math.floor((diff / 1000) % 60),
      });
    };
    
    updateTimer(); // Run immediately
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, []);

  // Prevent hydration mismatch by not rendering time until mounted
  if (!isMounted) {
    return (
      <div className="fixed inset-0 z-[9999] bg-[#0A0A0A] flex flex-col items-center justify-center overflow-hidden font-sans">
        <div className="relative z-10 text-center px-6">
          <div onClick={() => setShowInput(!showInput)} className="cursor-pointer mb-12">
            <h1 className="text-6xl font-bold tracking-tighter text-white mb-2">BOOSTER<span className="text-[#D4A574]">TEA</span></h1>
            <p className="text-[#D4A574] tracking-[0.3em] uppercase text-sm">Coming Soon</p>
          </div>
          <div className="flex gap-4 md:gap-8 mb-12 justify-center">
            {['d', 'h', 'm', 's'].map((unit) => (
              <div key={unit} className="flex flex-col">
                <span className="text-4xl md:text-6xl font-light text-white tabular-nums">--</span>
                <span className="text-[10px] uppercase tracking-widest text-[#A0A0A0]">{unit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[9999] bg-[#0A0A0A] flex flex-col items-center justify-center overflow-hidden font-sans">
      <div className="relative z-10 text-center px-6">
        <div onClick={() => setShowInput(!showInput)} className="cursor-pointer mb-12">
          <h1 className="text-6xl font-bold tracking-tighter text-white mb-2">BOOSTER<span className="text-[#D4A574]">TEA</span></h1>
          <p className="text-[#D4A574] tracking-[0.3em] uppercase text-sm">Coming Soon</p>
        </div>
        <div className="flex gap-4 md:gap-8 mb-12 justify-center">
          {Object.entries(timeLeft).map(([unit, val]) => (
            <div key={unit} className="flex flex-col">
              <span className="text-4xl md:text-6xl font-light text-white tabular-nums">{String(val).padStart(2, '0')}</span>
              <span className="text-[10px] uppercase tracking-widest text-[#A0A0A0]">{unit}</span>
            </div>
          ))}
        </div>
        {showInput && (
          <input
            autoFocus
            type="password"
            placeholder="Кодове слово..."
            className="bg-transparent border-b border-[#D4A574] text-[#D4A574] text-center outline-none py-2 w-48 text-lg"
            onChange={(e) => { if(e.target.value.toLowerCase() === 'валєра') onUnlock(); }}
          />
        )}
      </div>
    </div>
  );
};
