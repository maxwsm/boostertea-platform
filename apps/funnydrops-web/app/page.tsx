'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

// Cinema-grade entrance animation
const cinematicFade = {
  hidden: { opacity: 0, y: 40, filter: 'blur(10px)' },
  visible: { 
    opacity: 1, 
    y: 0, 
    filter: 'blur(0px)',
    transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } 
  }
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#030305] text-[#FAFAFA] overflow-hidden relative font-sans selection:bg-fuchsia-500/30 selection:text-white">
      
      {/* Deep Obsidian Background & Ambient Lights */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Subtle grid texture overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_0%,#000_20%,transparent_100%)] opacity-30" />
        
        {/* Ambient Neon Glows */}
        <motion.div 
          animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.2, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          className="absolute top-[-10%] left-[20%] w-[40vw] h-[40vw] bg-fuchsia-600/10 rounded-full blur-[120px] mix-blend-screen"
        />
        <motion.div 
          animate={{ opacity: [0.2, 0.4, 0.2], scale: [1, 1.3, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
          className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-violet-700/10 rounded-full blur-[150px] mix-blend-screen"
        />
      </div>

      {/* Ultra-Minimal Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/[0.03] bg-[#030305]/60 backdrop-blur-xl supports-[backdrop-filter]:bg-[#030305]/40">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}
            className="text-2xl font-black tracking-tighter"
          >
            FunnyDrops
            <span className="text-fuchsia-500">.</span>
          </motion.div>
          
          <div className="hidden md:flex gap-10 text-[11px] font-mono tracking-widest text-[#888] uppercase">
            <Link href="/catalog" className="hover:text-white transition-colors duration-300">Адаптогени</Link>
            <Link href="/b2b" className="hover:text-white transition-colors duration-300">B2B Партнерство</Link>
            <Link href="/blog" className="hover:text-white transition-colors duration-300">Блог</Link>
          </div>

          <Link href="/catalog">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative px-6 py-2 rounded-full overflow-hidden group border border-white/10 bg-white/[0.02]"
            >
              <span className="relative z-10 text-xs font-bold tracking-widest uppercase text-white group-hover:text-black transition-colors duration-500">Спробувати</span>
              <div className="absolute inset-0 bg-white transform translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-in-out" />
            </motion.button>
          </Link>
        </div>
      </nav>

      {/* Cinematic Hero */}
      <main className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto min-h-screen flex flex-col justify-center z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
          >
            <motion.div variants={cinematicFade} className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.05] text-[10px] font-mono tracking-widest text-white/50 mb-10 overflow-hidden relative">
              <span className="relative z-10 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-500 animate-pulse shadow-[0_0_10px_rgba(217,70,239,0.8)]"></span>
                Нова формула енергії
              </span>
              <motion.div 
                animate={{ x: ['-200%', '300%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-0 left-0 w-[50%] h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[45deg]" 
              />
            </motion.div>
            
            <motion.h1 variants={cinematicFade} className="text-6xl md:text-[5.5rem] font-light leading-[1.05] tracking-tight mb-8">
              Твій <br/>
              <span className="font-bold relative">
                Рідкий Вайб.
                {/* Glow behind text */}
                <span className="absolute inset-0 bg-gradient-to-r from-fuchsia-500 to-violet-500 blur-2xl opacity-20" />
              </span>
            </motion.h1>
            
            <motion.p variants={cinematicFade} className="text-lg md:text-xl text-[#888] font-light mb-12 max-w-lg leading-relaxed">
              Інноваційні чайні адаптогени та рослинні екстракти. <br className="hidden md:block"/>
              <span className="text-white/80 font-medium">Додай пару крапель у воду — і керуй своїм станом.</span>
            </motion.p>
            
            <motion.div variants={cinematicFade}>
              <Link href="/catalog" className="group relative inline-flex items-center gap-4">
                <div className="w-[60px] h-[60px] rounded-full border border-white/20 flex items-center justify-center bg-white/[0.02] backdrop-blur-md group-hover:bg-white group-hover:border-white transition-all duration-500">
                  <svg className="w-5 h-5 text-white group-hover:text-black transform group-hover:translate-x-1 transition-all duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
                <span className="text-xs tracking-[0.2em] font-bold uppercase text-white/70 group-hover:text-white transition-colors duration-500">
                  Почати Еволюцію
                </span>
              </Link>
            </motion.div>
          </motion.div>

          {/* Morphing Liquid Drop Element */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="relative h-[500px] w-full hidden lg:flex items-center justify-center perspective-[1000px]"
          >
            {/* The Liquid Mesh (CSS Organic Morphing) */}
            <motion.div 
              animate={{ 
                borderRadius: [
                  "60% 40% 30% 70% / 60% 30% 70% 40%", 
                  "30% 60% 70% 40% / 50% 60% 30% 60%", 
                  "60% 40% 30% 70% / 60% 30% 70% 40%"
                ],
                rotate: [0, 15, 0]
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="relative w-[350px] h-[350px] bg-gradient-to-br from-[#0c0c12] via-fuchsia-900/40 to-[#030305] border-[0.5px] border-white/10 shadow-[inset_0_0_100px_rgba(217,70,239,0.2),0_0_80px_rgba(217,70,239,0.1)] backdrop-blur-3xl overflow-hidden flex items-center justify-center transform-style-preserve-3d"
            >
              {/* Internal Refractions */}
              <div className="absolute top-[10%] left-[10%] w-24 h-24 bg-white opacity-[0.05] rounded-full blur-2xl" />
              <div className="absolute bottom-[20%] right-[10%] w-32 h-32 bg-fuchsia-400 opacity-[0.2] rounded-full blur-3xl" />
              
              {/* Central Text/Icon */}
              <motion.div 
                animate={{ scale: [1, 1.05, 1], filter: ["blur(0px)", "blur(2px)", "blur(0px)"] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="text-white/90 text-[10px] tracking-[0.3em] font-mono rotate-90 mix-blend-overlay"
              >
                LIQUID MATRIX
              </motion.div>
            </motion.div>
            
            {/* Reflection on floor */}
            <div className="absolute bottom-10 w-[200px] h-[20px] bg-fuchsia-500/20 blur-2xl rounded-[100%]" />
          </motion.div>

        </div>
      </main>
    </div>
  );
}
