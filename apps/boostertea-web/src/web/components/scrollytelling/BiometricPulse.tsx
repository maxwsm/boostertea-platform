'use client'

import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';

interface BiometricPulseProps {
  triggerWords: string[]; // e.g., ["стрес", "ритм", "тривога"]
  resolveWords: string[]; // e.g., ["фокус", "спокій", "L-теанін"]
  content: string;
}

export const BiometricPulse: React.FC<BiometricPulseProps> = ({ triggerWords, resolveWords, content }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { margin: "-20% 0px -20% 0px", once: false });
  const [phase, setPhase] = useState<'neutral' | 'stress' | 'resolve'>('neutral');

  // Listen to reading progress to switch phases
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  useEffect(() => {
    return scrollYProgress.onChange((v) => {
      if (v > 0.1 && v < 0.6) setPhase('stress');
      else if (v >= 0.6) setPhase('resolve');
      else setPhase('neutral');
    });
  }, [scrollYProgress]);

  // Visual effects based on phase
  const isStress = phase === 'stress';
  const isResolve = phase === 'resolve';

  return (
    <div ref={containerRef} className="relative py-20 px-8 my-16 rounded-3xl overflow-hidden glass border border-white/5 transition-all duration-1000">
      
      {/* Dynamic Background Pulse */}
      <motion.div 
        className="absolute inset-0 opacity-20 pointer-events-none -z-10"
        animate={{
          backgroundColor: isStress ? '#ff0033' : isResolve ? '#00ffaa' : '#ffffff',
          scale: isStress ? [1, 1.05, 1] : isResolve ? [1, 1.02, 1] : 1,
        }}
        transition={{
          backgroundColor: { duration: 1.5, ease: "easeInOut" },
          scale: { 
            duration: isStress ? 0.4 : isResolve ? 3 : 0, 
            repeat: isStress || isResolve ? Infinity : 0,
            ease: "easeInOut"
          }
        }}
      />
      
      {/* Content processing for Glitch based on trigger words */}
      <motion.div
        animate={{
          x: isStress ? [-1, 1, -2, 2, 0] : 0,
          y: isStress ? [1, -1, 2, -2, 0] : 0,
        }}
        transition={{
          repeat: isStress ? Infinity : 0,
          duration: 0.2,
          repeatType: "mirror"
        }}
        className={`relative z-10 text-xl md:text-2xl leading-relaxed tracking-wide ${isResolve ? 'font-mono text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400' : 'text-[var(--text-primary)]'}`}
        style={{ textShadow: isStress ? '2px 0 red, -2px 0 blue' : 'none' }}
      >
        {content}
      </motion.div>

      {/* Heartbeat EKG Line Overlay */}
      <AnimatePhaseEKG phase={phase} />
    </div>
  );
};

const AnimatePhaseEKG = ({ phase }: { phase: string }) => {
  return (
    <div className="absolute bottom-0 left-0 w-full h-12 pointer-events-none opacity-30">
      <svg viewBox="0 0 1000 100" className="w-full h-full preserve-3d" preserveAspectRatio="none">
        <motion.path
          d={phase === 'stress' 
            ? "M0,50 L200,50 L250,10 L300,90 L350,50 L1000,50" 
            : phase === 'resolve' 
            ? "M0,50 L400,50 L420,40 L450,50 L1000,50" 
            : "M0,50 L1000,50"}
          fill="none"
          stroke={phase === 'stress' ? '#ff0033' : phase === 'resolve' ? '#00ffaa' : '#ffffff'}
          strokeWidth="3"
          animate={{
            pathLength: [0, 1],
            pathOffset: [0, 1]
          }}
          transition={{
            duration: phase === 'stress' ? 0.8 : 3,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </svg>
    </div>
  );
};
