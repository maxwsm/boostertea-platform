import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export const TornPageEasterEgg = () => {
  const [hovered, setHovered] = useState(false);

  return (
    <div 
      className="fixed top-0 right-0 z-[200] w-24 h-24 sm:w-32 sm:h-32 pointer-events-none"
    >
      <Link 
        href="/influencer" 
        className="block w-full h-full relative cursor-pointer outline-none group pointer-events-auto"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        
        {/* The underlying secret comic panel (Revealed top-right triangle) */}
        <div className="absolute top-0 right-0 w-full h-full bg-[#0a0a0a] overflow-hidden shadow-inner border-l border-b border-black/50" 
             style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%)' }}>
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-30 mix-blend-overlay"></div>
          <div className="absolute inset-0 bg-gradient-to-bl from-[#7FB030]/30 via-transparent to-transparent"></div>
          
          <div className="absolute top-2 right-2 sm:top-3 sm:right-3 flex flex-col items-end text-right">
             <span className="text-[8px] sm:text-[10px] uppercase font-black tracking-widest text-black bg-[#7FB030] px-1.5 py-0.5 rounded shadow-[0_0_10px_rgba(127,176,48,0.5)]">WSM COMIC</span>
             <span className="text-[6px] sm:text-[8px] text-white/90 max-w-[80px] leading-tight mt-1.5 font-mono uppercase">
               Nikita & Nazar<br/>Ambassador<br/>Protocol
             </span>
          </div>
        </div>

        {/* The Front Page (The masking layer simulating the corner cut) */}
        <motion.div 
          animate={{
            clipPath: hovered 
              ? 'polygon(0 0, 0 0, 100% 100%, 100% 100%, 0 100%)' 
              : 'polygon(0 0, 65% 0, 100% 35%, 100% 100%, 0 100%)' 
          }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="absolute inset-0 bg-[var(--bg-primary)]"
        />
        
        {/* The Folded Curl Shadow */}
        <motion.div
           animate={{
              top: hovered ? '50%' : '17.5%',
              right: hovered ? '50%' : '17.5%',
              width: hovered ? '0%' : '35%',
              height: hovered ? '0%' : '35%',
              opacity: hovered ? 0 : 1
           }}
           transition={{ type: "spring", stiffness: 300, damping: 25 }}
           className="absolute pointer-events-none"
           style={{
             background: 'linear-gradient(225deg, transparent 50%, var(--bg-secondary) 50%, var(--bg-tertiary) 100%)',
             borderBottomLeftRadius: '12px',
             boxShadow: '-8px 8px 15px rgba(0,0,0,0.6)'
           }}
        />
        
      </Link>
    </div>
  );
};
