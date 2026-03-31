// @ts-nocheck
import React, { useRef, useState } from 'react';
import { motion, useSpring, AnimatePresence } from 'framer-motion';
import { Zap } from 'lucide-react';

export interface MagneticProps {
  children?: React.ReactNode;
  onClick?: () => void;
  label?: string;
  variant?: 'dino' | 'tlab' | 'funny' | 'booster' | 'default';
  className?: string;
}

export const MagneticGlassButton = ({ children, onClick, label, variant = 'default', className = '' }: MagneticProps) => {
  const ref = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // 🧲 Магнітна фізика (Твої параметри: stiffness 150, damping 15)
  const springConfig = { stiffness: 150, damping: 15, mass: 0.8 };
  const x = useSpring(0, springConfig);
  const y = useSpring(0, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    
    // Рахуємо центр кнопки
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    
    // Дистанція зміщення (макс. 25px)
    x.set((clientX - centerX) * 0.35);
    y.set((clientY - centerY) * 0.35);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  // 🎨 Динамічні стилі шарів скла залежно від бренду
  const variants = {
    dino: "shadow-[0_0_20px_rgba(0,191,255,0.3)] border-[#00bfff]/30 text-[#00bfff]",
    tlab: "shadow-[0_0_20px_rgba(16,185,129,0.2)] border-emerald-500/40 text-emerald-500 font-mono",
    funny: "shadow-[0_0_25px_rgba(255,0,255,0.4)] border-fuchsia-500/50 text-fuchsia-200",
    booster: "shadow-[0_0_20px_rgba(196,149,106,0.2)] border-[#C4956A]/30 text-[#C4956A]",
    default: "shadow-[0_0_15px_rgba(255,255,255,0.1)] border-white/20 text-white"
  };

  return (
    <motion.button
      ref={ref}
      style={{ x, y }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={`
        relative group overflow-hidden px-8 py-4 rounded-2xl transition-all duration-300
        backdrop-blur-xl bg-white/5 border outline-none
        ${variants[variant]} ${className}
      `}
    >
      {/* ШАР 1: Deep Glass (Внутрішнє світіння) */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50 pointer-events-none" />
      
      {/* ШАР 2: Focus Glass (Блік при ховері) */}
      <motion.div 
        animate={{ 
          opacity: isHovered ? 1 : 0,
          x: isHovered ? '100%' : '-100%' 
        }}
        transition={{ duration: 0.5 }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 pointer-events-none"
      />

      {/* ШАР 3: Content (Text & Icon) */}
      <div className="relative z-10 flex items-center justify-center gap-3 uppercase tracking-[0.2em] font-black text-xs md:text-sm">
        <AnimatePresence>
          {isHovered && (
            <motion.span 
              initial={{ scale: 0, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0, opacity: 0 }}
            >
              <Zap size={16} fill="currentColor" />
            </motion.span>
          )}
        </AnimatePresence>
        {label || children}
      </div>

      {/* Ефект "пульсації" системи (Тільки для TLab/Funny/Booster) */}
      {isHovered && variant !== 'default' && (
        <motion.div 
          layoutId={`glow-${variant}`}
          className="absolute inset-0 bg-current opacity-10 blur-2xl rounded-full pointer-events-none"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1.5 }}
          transition={{ repeat: Infinity, duration: 2, repeatType: "reverse" }}
        />
      )}
    </motion.button>
  );
};
