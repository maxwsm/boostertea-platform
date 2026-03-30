'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

// Strict technical reveal animation
const techReveal = {
  hidden: { opacity: 0, clipPath: 'inset(0 100% 0 0)' },
  visible: { 
    opacity: 1, 
    clipPath: 'inset(0 0% 0 0)',
    transition: { duration: 1.2, ease: [0.25, 1, 0.5, 1] }
  }
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" }
  }
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#09090B] text-[#FAFAFA] overflow-hidden relative font-mono selection:bg-amber-500/30">
      
      {/* Precision CAD Grid Background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:2rem_2rem] [mask-image:radial-gradient(ellipse_70%_70%_at_50%_0%,#000_10%,transparent_100%)]" />
        {/* Technical Data Markers */}
        <div className="absolute top-10 left-10 text-[10px] text-white/20 tracking-[0.3em]">SYS.OP: NORMAL</div>
        <div className="absolute top-10 right-10 text-[10px] text-white/20 tracking-[0.3em]">LAT: 32.1 // LNG: 0.4</div>
        <div className="absolute bottom-10 left-10 text-[10px] text-white/20 tracking-[0.3em]">v2026.1.0_PROD</div>
      </div>

      {/* Cyber-Industrial Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-[#09090B]/80 backdrop-blur-md">
        <div className="w-full px-8 h-16 flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-4"
          >
            <div className="w-4 h-4 bg-amber-500 rounded-sm animate-pulse" />
            <span className="text-xl font-bold tracking-[0.2em] uppercase text-white">T-Lab</span>
          </motion.div>
          
          <div className="hidden md:flex gap-12 text-[10px] tracking-[0.2em] uppercase text-[#A1A1AA]">
            <Link href="/catalog" className="hover:text-amber-500 transition-colors">Extracts</Link>
            <Link href="/b2b" className="hover:text-amber-500 transition-colors">HoReCa</Link>
            <Link href="/contacts" className="hover:text-amber-500 transition-colors">Partners</Link>
          </div>

          <Link href="/b2b">
            <button className="relative group overflow-hidden border border-white/20 bg-transparent px-6 py-2 text-[10px] uppercase tracking-[0.2em] text-white transition-all hover:border-amber-500">
              <span className="relative z-10 group-hover:text-black transition-colors duration-300">Cooperate</span>
              <div className="absolute inset-0 bg-amber-500 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out" />
            </button>
          </Link>
        </div>
      </nav>

      {/* Technical Hero */}
      <main className="relative z-10 pt-32 pb-20 px-8 w-full min-h-screen flex flex-col justify-center max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Main Title Block */}
          <div className="lg:col-span-8 relative">
            {/* Technical Label */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-3 border border-amber-500/30 bg-amber-500/5 px-3 py-1 mb-10"
            >
              <svg className="w-3 h-3 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="text-amber-500 text-[10px] tracking-[0.3em] uppercase">Corporate Liquid Intelligence</span>
            </motion.div>
            
            <motion.h1 
              initial="hidden"
              animate="visible"
              variants={techReveal}
              className="text-5xl md:text-7xl lg:text-[6rem] font-light tracking-tighter leading-[1.05] mb-8 font-sans"
            >
              Precision <br/> Engineering for <br/>
              <span className="font-semibold text-white">The Modern Bar.</span>
            </motion.h1>

            <motion.div 
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              transition={{ delay: 0.4 }}
              className="pl-4 border-l-2 border-white/20 max-w-2xl mb-12"
            >
              <p className="text-[#A1A1AA] text-lg md:text-xl font-light leading-relaxed font-sans">
                T-Lab provides ultra-premium tea concentrates designed exclusively for HoReCa. 
                <span className="text-white block mt-2">Standardize taste, erase wait times, and maximize net margins.</span>
              </p>
            </motion.div>

            <motion.div 
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-6"
            >
              <Link href="/catalog">
                <button className="bg-white text-black px-8 py-4 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-amber-400 hover:text-black transition-all duration-300">
                  Request Samples
                </button>
              </Link>
              <Link href="/b2b">
                <button className="border border-white/20 text-white px-8 py-4 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-white/5 transition-colors flex items-center gap-3">
                  Explore Tech
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </Link>
            </motion.div>
          </div>

          {/* Abstract Cyber HUD Graphic */}
          <div className="lg:col-span-4 hidden lg:flex justify-end perspective-[1000px]">
            <motion.div 
              initial={{ opacity: 0, rotateY: 30 }}
              animate={{ opacity: 1, rotateY: 0 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="relative w-[300px] h-[400px] border border-white/10 p-6 flex flex-col justify-between bg-[#09090B]/50 backdrop-blur-md"
            >
              {/* Rotating target reticle */}
              <motion.div 
                animate={{ rotate: 360 }} 
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 m-auto w-[250px] h-[250px] border border-dashed border-white/10 rounded-full"
              />
              <div className="absolute inset-0 m-auto w-[150px] h-[150px] border border-amber-500/20 rounded-full flex items-center justify-center">
                <div className="w-[100px] h-[100px] bg-gradient-to-br from-amber-500/10 to-transparent rounded-full border border-amber-500/40" />
              </div>

              {/* Data Rows */}
              <div className="text-[10px] text-white/40 tracking-[0.2em] uppercase flex justify-between">
                <span>Status</span>
                <span className="text-amber-500">Active</span>
              </div>
              <div className="text-[10px] text-white/40 tracking-[0.2em] font-mono flex justify-between">
                <span>YLD_RATE</span>
                <span>99.9%</span>
              </div>
            </motion.div>
          </div>

        </div>
      </main>
    </div>
  );
}
