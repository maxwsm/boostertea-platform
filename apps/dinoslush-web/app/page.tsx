'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';

// Custom spring transition for "Jello" bouncy effect
const springJello = {
  type: 'spring',
  stiffness: 400,
  damping: 15,
  mass: 0.8
};

// Floating animation for abstract ice blocks
const floatingIce = {
  animate: {
    y: [0, -20, 0],
    rotate: [0, 5, -5, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  }
};

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="min-h-screen bg-[#F0F8FF] text-[#0F172A] overflow-hidden relative font-sans selection:bg-[#FF6B00]/30 selection:text-[#FF6B00]">
      
      {/* Dynamic Jello Blobs Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0], borderRadius: ["40%", "60%", "40%"] }} 
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
          className="absolute top-[-15%] left-[-15%] w-[60vw] h-[60vw] bg-gradient-to-br from-[#FF9D00]/40 to-[#FF6B00]/20 blur-[120px] mix-blend-multiply"
        />
        <motion.div 
          animate={{ scale: [1, 1.3, 1], rotate: [0, -90, 0], borderRadius: ["60%", "40%", "60%"] }} 
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute bottom-[-10%] right-[-10%] w-[70vw] h-[70vw] bg-gradient-to-tl from-[#00D4FF]/40 to-[#00A3FF]/20 blur-[150px] mix-blend-multiply"
        />
      </div>

      {/* Navigation (Frost Glass) */}
      <nav className="fixed top-0 w-full z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between bg-white/40 backdrop-blur-2xl border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.04)] rounded-[2rem] px-6 py-3">
          <motion.div 
            initial={{ y: -50, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            transition={{ ...springJello, delay: 0.1 }}
          >
            <Link href="/" className="text-3xl font-black tracking-tight flex items-center gap-2">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B00] to-[#FF9D00] drop-shadow-sm">
                DinoSlush
              </span>
              <motion.span 
                animate={{ rotate: [0, 15, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                className="inline-block origin-bottom"
              >
                🦖
              </motion.span>
            </Link>
          </motion.div>
          
          <div className="flex gap-4">
            <Link href="/catalog">
              <motion.button 
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={springJello}
                className="hidden md:block bg-[#0F172A] text-white px-8 py-3 rounded-[1.5rem] font-bold shadow-[0_10px_20px_rgba(15,23,42,0.15)] hover:shadow-[0_10px_25px_rgba(15,23,42,0.25)] hover:bg-[#1E293B]"
              >
                Мої Слаші
              </motion.button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Content */}
      <main className="relative z-10 pt-32 pb-20 px-6 max-w-7xl mx-auto min-h-screen flex flex-col justify-center items-center text-center">
        
        {/* Playful Emoji Pill */}
        <motion.div
           initial={{ scale: 0, opacity: 0 }}
           animate={{ scale: 1, opacity: 1 }}
           transition={{ ...springJello, delay: 0.2 }}
           whileHover={{ scale: 1.1, rotate: 5 }}
           className="mb-10 px-6 py-3 bg-white/70 backdrop-blur-xl border border-white/80 rounded-[2rem] shadow-[0_10px_30px_rgba(0,0,0,0.05)] cursor-pointer"
        >
          <span className="text-2xl tracking-widest">🧊 + 🍓 = 😋</span>
        </motion.div>

        {/* Massive Bubble Typography */}
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springJello, delay: 0.3 }}
          className="text-[5rem] sm:text-[7rem] md:text-[9rem] leading-[0.9] font-black tracking-tighter mb-8"
        >
          <motion.span 
            className="inline-block relative"
            whileHover={{ y: -10, scale: 1.05 }}
            transition={springJello}
          >
            Струси.
            {/* Frost Overlay Effect on Text */}
            <span className="absolute inset-0 bg-gradient-to-t from-white/30 to-transparent mix-blend-screen pointer-events-none rounded-lg" />
          </motion.span> 
          <br/>
          <motion.span 
            className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#00D4FF] to-[#0077FF] drop-shadow-sm relative"
            whileHover={{ y: -10, scale: 1.05, rotate: -2 }}
            transition={springJello}
          >
            Заморозь.
          </motion.span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-lg md:text-2xl text-slate-600 mb-14 max-w-2xl font-medium leading-relaxed"
        >
          Перший в Україні натуральний фруктовий слаш для крутих настроїв. <br className="hidden md:block"/>
          <strong className="text-[#FF6B00]">Нуль цукру, максимум фану!</strong>
        </motion.p>

        {/* Giant Jello CTA Button */}
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ ...springJello, delay: 0.6 }}
        >
          <Link href="/catalog" className="relative group inline-block">
            {/* Ambient Glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-[#FF6B00] to-[#FF9D00] rounded-[3rem] blur opacity-30 group-hover:opacity-60 transition duration-500 group-hover:duration-200" />
            
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={springJello}
              className="relative flex items-center justify-center gap-3 bg-gradient-to-br from-[#FF6B00] to-[#FF4500] text-white px-10 md:px-14 py-5 md:py-6 rounded-[3rem] font-black text-2xl md:text-3xl border-4 border-white/20 shadow-[inset_0_-4px_10px_rgba(0,0,0,0.2)] overflow-hidden"
            >
              <span className="relative z-10 drop-shadow-md">Купити Слаш!</span>
              {/* Glass Shine effect sweeping across the button */}
              <div className="absolute top-0 -left-[100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[45deg] group-hover:animate-shine z-0" />
            </motion.button>
          </Link>
        </motion.div>

        {/* Decorative Floating Ice Cubes (Client Side Only) */}
        {mounted && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
            {/* Ice Cube 1 */}
            <motion.div 
              {...floatingIce}
              className="absolute top-1/4 left-10 md:left-[15%] w-16 h-16 bg-white/30 backdrop-blur-md rounded-2xl border border-white/50 shadow-xl rotate-12"
            />
            {/* Ice Cube 2 */}
            <motion.div 
              {...floatingIce}
              className="absolute bottom-1/4 right-10 md:right-[20%] w-24 h-24 bg-white/40 backdrop-blur-lg rounded-[2rem] border border-white/60 shadow-2xl -rotate-12"
              transition={{ delay: 1, duration: 7, repeat: Infinity, ease: 'easeInOut' }}
            />
            {/* Fruit Blob */}
            <motion.div 
              {...floatingIce}
              className="absolute top-1/3 right-5 md:right-[10%] w-12 h-12 bg-[#FF6B00]/40 backdrop-blur-sm rounded-full border border-white/30 shadow-lg"
              transition={{ delay: 2, duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
        )}

      </main>

    </div>
  );
}
