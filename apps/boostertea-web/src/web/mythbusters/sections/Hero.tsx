"use client";
import { useEffect, useRef, useState, memo } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Zap, Users, Play } from 'lucide-react';
import { Button } from '@myth/components/ui/button';
import { useTranslation } from '@myth/hooks/useTranslation';

// Floating tea leaf with 3D effect - memoized
const FloatingLeaf = memo(function FloatingLeaf({ delay, x, y, size, color }: { delay: number; x: string; y: string; size: number; color: string }) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left: x, top: y, width: size, height: size }}
      animate={{
        y: [0, -40, 0],
        rotate: [0, 360],
        scale: [1, 1.1, 1],
        opacity: [0.3, 0.6, 0.3],
      }}
      transition={{
        duration: 5 + Math.random() * 3,
        repeat: Infinity,
        delay: delay,
        ease: 'easeInOut',
      }}
    >
      <svg viewBox="0 0 24 24" fill={color} className="w-full h-full drop-shadow-lg">
        <path d="M17,8C8,10,5.9,16.17,3.82,21.34L5.71,22l1-2.3A4.49,4.49,0,0,0,8,20C19,20,22,3,22,3,21,5,14,5.25,9,6.25S2,11.5,2,13.5a6.22,6.22,0,0,0,1.75,3.75C7,13.37,11,9,17,8Z"/>
      </svg>
    </motion.div>
  );
});

// Glow orb effect - memoized
const GlowOrb = memo(function GlowOrb({ color, x, y, size }: { color: string; x: string; y: string; size: number }) {
  return (
    <motion.div
      className="absolute pointer-events-none rounded-full"
      style={{
        left: x,
        top: y,
        width: size,
        height: size,
        background: `radial-gradient(circle, ${color}40 0%, transparent 70%)`,
        filter: 'blur(40px)',
      }}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.5, 0.8, 0.5],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
});

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const { t } = useTranslation();
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start']
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);
  
  const springY = useSpring(y, { stiffness: 100, damping: 30 });
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);
  
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  // Generate floating elements
  const leaves = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    delay: Math.random() * 3,
    x: `${5 + (i * 8) % 90}%`,
    y: `${10 + (i * 7) % 80}%`,
    size: 20 + Math.random() * 30,
    color: ['#8B1A1A', '#C9A227', '#1B2E1B', '#FF6B35'][i % 4],
  }));

  const orbs = [
    { color: '#8B1A1A', x: '10%', y: '20%', size: 300 },
    { color: '#C9A227', x: '80%', y: '60%', size: 400 },
    { color: '#1B2E1B', x: '60%', y: '10%', size: 250 },
    { color: '#FF6B35', x: '30%', y: '70%', size: 200 },
  ];

  return (
    <section 
      ref={containerRef}
      className="relative min-h-screen w-full overflow-hidden"
    >
      {/* Premium Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#F5F0E8] via-[#EDE8E0] to-[#F5F0E8]" />
      
      {/* Animated Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(#8B1A1A 1px, transparent 1px),
              linear-gradient(90deg, #8B1A1A 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Glow Orbs */}
      {orbs.map((orb, i) => (
        <GlowOrb key={i} {...orb} />
      ))}
      
      {/* Floating Tea Leaves */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {leaves.map((leaf) => (
          <FloatingLeaf key={leaf.id} {...leaf} />
        ))}
      </div>
      
      {/* Main Content */}
      <motion.div 
        className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8"
        style={{ y: springY, opacity, scale }}
      >
        {/* Animated Badge */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={isLoaded ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2, type: 'spring' }}
          className="mb-8"
        >
          <motion.span 
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#8B1A1A]/10 to-[#C9A227]/10 border border-[#8B1A1A]/20 rounded-full text-[#8B1A1A] text-sm font-medium backdrop-blur-sm"
            whileHover={{ scale: 1.05 }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            >
              <Zap className="w-4 h-4" />
            </motion.div>
            {t('hero.badge')}
          </motion.span>
        </motion.div>
        
        {/* Main Title with 3D Effect */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.4, type: 'spring', stiffness: 100 }}
          className="text-center mb-6 perspective-1000"
        >
          <motion.h1 
            className="text-7xl sm:text-8xl md:text-9xl lg:text-[10rem] font-black text-[#0D0D0D] tracking-tighter leading-[0.85]"
            style={{
              textShadow: '0 4px 30px rgba(139, 26, 26, 0.3)',
            }}
          >
            <motion.span
              initial={{ rotateX: -90, opacity: 0 }}
              animate={isLoaded ? { rotateX: 0, opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="inline-block"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {t('hero.title1')}
            </motion.span>
          </motion.h1>
          <motion.h1 
            className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.85] mt-2"
            style={{
              background: 'linear-gradient(135deg, #8B1A1A 0%, #C9A227 50%, #1B2E1B 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 4px 20px rgba(201, 162, 39, 0.4))',
            }}
          >
            <motion.span
              initial={{ rotateX: 90, opacity: 0 }}
              animate={isLoaded ? { rotateX: 0, opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="inline-block"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {t('hero.title2')}
            </motion.span>
          </motion.h1>
        </motion.div>
        
        {/* Subtitle with Typewriter Effect */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 1 }}
          className="text-xl sm:text-2xl md:text-3xl text-[#0D0D0D]/70 text-center max-w-3xl mb-4 font-light"
        >
          {t('hero.subtitle')}
        </motion.p>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={isLoaded ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="text-lg text-center mb-10"
        >
          <span className="text-[#8B1A1A] font-semibold">Mykyta</span> {t('hero.subtitleHighlight') as string}
        </motion.p>
        
        {/* CTA Buttons with Premium Effects */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 1.4 }}
          className="flex flex-col sm:flex-row gap-4 mb-16"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={() => scrollToSection('comics')}
              className="group relative px-10 py-7 bg-gradient-to-r from-[#8B1A1A] to-[#6d1515] text-white text-lg font-bold rounded-2xl overflow-hidden shadow-xl shadow-[#8B1A1A]/30 hover:shadow-[#8B1A1A]/50 transition-all"
            >
              <span className="relative z-10 flex items-center gap-2">
                <Play className="w-5 h-5" />
                {t('hero.ctaRead')}
              </span>
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-[#C9A227] to-[#8B1A1A]"
                initial={{ x: '-100%' }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
            </Button>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={() => scrollToSection('ambassadors')}
              variant="outline"
              className="group px-10 py-7 border-2 border-[#1B2E1B] text-[#1B2E1B] hover:bg-[#1B2E1B] hover:text-white text-lg font-bold rounded-2xl transition-all backdrop-blur-sm"
            >
              <span className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                {t('hero.ctaMeet')}
              </span>
            </Button>
          </motion.div>
        </motion.div>
        
        {/* Main Comic Cover with Floating Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotateY: -30 }}
          animate={isLoaded ? { opacity: 1, scale: 1, rotateY: 0 } : {}}
          transition={{ duration: 1.2, delay: 1.6, type: 'spring', stiffness: 80 }}
          className="relative perspective-1000"
        >
          <motion.div 
            className="relative preserve-3d"
            animate={{ 
              y: [0, -15, 0],
              rotateY: [0, 3, 0, -3, 0],
            }}
            transition={{ 
              y: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
              rotateY: { duration: 8, repeat: Infinity, ease: 'easeInOut' },
            }}
          >
            {/* Glow behind cover */}
            <div className="absolute -inset-8 bg-gradient-to-r from-[#8B1A1A]/30 via-[#C9A227]/30 to-[#1B2E1B]/30 rounded-3xl blur-3xl" />
            
            <img
              src="/comic-cover-main.jpg"
              alt="MythBusters of Tea"
              className="relative w-56 sm:w-72 md:w-80 rounded-2xl shadow-2xl shadow-black/30"
              loading="lazy"
              decoding="async"
            />
            
            {/* Myth Busted Stamp */}
            <motion.div
              initial={{ scale: 0, rotate: -30 }}
              animate={isLoaded ? { scale: 1, rotate: -15 } : {}}
              transition={{ duration: 0.6, delay: 2, type: 'spring', stiffness: 200 }}
              className="absolute -bottom-4 -right-4 bg-[#E74C3C] text-white px-6 py-3 font-black text-xl tracking-wider border-4 border-white rounded-lg shadow-xl"
              style={{ transform: 'rotate(-15deg)' }}
            >
              MYTH BUSTED!
            </motion.div>
          </motion.div>
        </motion.div>
        
        {/* Stats with Counter Animation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 1.8 }}
          className="flex gap-10 sm:gap-16 mt-16"
        >
          {[
            { value: '6', label: t('hero.stats.series') },
            { value: '36', label: t('hero.stats.pages') },
            { value: '2', label: t('hero.stats.heroes') },
            { value: '50+', label: t('hero.stats.coming') },
          ].map((stat, index) => (
            <motion.div 
              key={index} 
              className="text-center"
              whileHover={{ scale: 1.15, y: -5 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <motion.div 
                className="text-4xl sm:text-5xl font-black text-[#8B1A1A]"
                initial={{ opacity: 0, scale: 0 }}
                animate={isLoaded ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 2 + index * 0.1, type: 'spring' }}
              >
                {stat.value}
              </motion.div>
              <div className="text-sm text-[#0D0D0D]/50 font-medium uppercase tracking-wider mt-1">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
      
      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center text-[#0D0D0D]/40 cursor-pointer group"
          onClick={() => scrollToSection('ambassadors')}
        >
          <span className="text-xs mb-2 font-medium uppercase tracking-widest group-hover:text-[#8B1A1A] transition-colors">
            {t('hero.scrollText')}
          </span>
          <motion.div
            className="w-8 h-12 border-2 border-current rounded-full flex justify-center pt-2"
            whileHover={{ borderColor: '#8B1A1A' }}
          >
            <motion.div 
              className="w-1.5 h-3 bg-current rounded-full"
              animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
