'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface HolographicHotspotProps {
  xPercent: number; // 0 to 100
  yPercent: number; // 0 to 100
  title: string;
  description: string;
  ctaText?: string;
  onCtaClick?: () => void;
  // Direction the popup opens towards
  position?: 'top' | 'bottom' | 'left' | 'right';
  theme?: 'dark' | 'light';
}

/**
 * Places a pulsing glowing dot over a relative container.
 * When clicked, it expands via Glassmorphism into a product card/detail view,
 * acting as a true "Pattern Interrupt".
 */
export const HolographicHotspot: React.FC<HolographicHotspotProps> = ({
  xPercent,
  yPercent,
  title,
  description,
  ctaText = 'Відкрити',
  onCtaClick,
  position = 'top',
  theme = 'dark'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const isDark = theme === 'dark';

  return (
    <div 
      className="absolute z-40 transform -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${xPercent}%`, top: `${yPercent}%` }}
    >
      {/* The Pulsing Core */}
      <motion.button
        className="relative w-8 h-8 rounded-full flex items-center justify-center outline-none group"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {/* Radar Ping Animation */}
        <div className="absolute inset-0 rounded-full bg-cyan-400 opacity-40 animate-ping group-hover:bg-red-500" />
        {/* Solid Center */}
        <div className="w-3 h-3 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,1)] group-hover:bg-red-500 group-hover:shadow-[0_0_20px_rgba(255,0,0,1)] transition-colors" />
      </motion.button>

      {/* The Shatter Reveal Card */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className={`absolute w-64 p-5 rounded-2xl border shadow-2xl backdrop-blur-3xl ${
              position === 'top' ? 'bottom-full mb-4 left-1/2 -translate-x-1/2' :
              position === 'bottom' ? 'top-full mt-4 left-1/2 -translate-x-1/2' :
              position === 'left' ? 'right-full mr-4 top-1/2 -translate-y-1/2' :
              'left-full ml-4 top-1/2 -translate-y-1/2'
            } ${
              isDark 
                ? 'bg-black/60 border-white/20 text-white shadow-[0_0_40px_rgba(0,0,0,0.8)]' 
                : 'bg-white/70 border-black/10 text-black shadow-[0_0_40px_rgba(255,255,255,0.8)]'
            }`}
          >
            <h4 className="font-bold text-lg mb-2" style={{ fontFamily: '"Syne", sans-serif' }}>
              {title}
            </h4>
            <p className={`text-sm mb-4 leading-relaxed ${isDark ? 'text-white/70' : 'text-black/70'}`}>
              {description}
            </p>
            {ctaText && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onCtaClick && onCtaClick();
                }}
                className={`w-full py-2 px-4 rounded-xl font-medium text-sm transition-colors ${
                  isDark ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'
                }`}
              >
                {ctaText}
              </button>
            )}
            
            {/* The little pointer arrow */}
            <div className={`absolute w-4 h-4 rotate-45 border-b border-r ${
              isDark ? 'border-white/20 bg-black/60 backdrop-blur-3xl' : 'border-black/10 bg-white/70 backdrop-blur-3xl'
            } ${
              position === 'top' ? 'bottom-[-9px] left-1/2 -translate-x-1/2' :
              position === 'bottom' ? 'top-[-9px] left-1/2 -translate-x-1/2 rotate-[225deg]' :
              position === 'left' ? 'right-[-9px] top-1/2 -translate-y-1/2 rotate-[-45deg]' :
              'left-[-9px] top-1/2 -translate-y-1/2 rotate-[135deg]'
            }`} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
