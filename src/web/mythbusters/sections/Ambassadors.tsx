"use client";
import { useRef, useState, memo, useCallback } from 'react';
import { motion, useInView, useSpring } from 'framer-motion';
import { Instagram, Youtube, Sparkles, Target, Zap, Quote, TrendingUp } from 'lucide-react';
import { ambassadors } from '@myth/data/comics';
import { useTranslation } from '@myth/hooks/useTranslation';

interface AmbassadorCardProps {
  ambassador: typeof ambassadors[0];
  index: number;
}

const AmbassadorCard = memo(function AmbassadorCard({ ambassador, index }: AmbassadorCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState({ rotateX: 0, rotateY: 0 });
  const [isHovered, setIsHovered] = useState(false);
  
  const springRotateX = useSpring(transform.rotateX, { stiffness: 300, damping: 30 });
  const springRotateY = useSpring(transform.rotateY, { stiffness: 300, damping: 30 });
  
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const rotateY = ((e.clientX - centerX) / (rect.width / 2)) * 12;
    const rotateX = -((e.clientY - centerY) / (rect.height / 2)) * 12;
    
    setTransform({ rotateX, rotateY });
  }, []);
  
  const handleMouseLeave = useCallback(() => {
    setTransform({ rotateX: 0, rotateY: 0 });
    setIsHovered(false);
  }, []);
  
  const isEven = index % 2 === 0;
  const gradientColors = isEven 
    ? 'from-[#8B1A1A] via-[#6d1515] to-[#4a0e0e]' 
    : 'from-[#1B2E1B] via-[#142414] to-[#0d1a0d]';
  
  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, x: isEven ? -100 : 100 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8, delay: index * 0.2, type: 'spring' }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="relative perspective-1000"
      style={{ transformStyle: 'preserve-3d' }}
    >
      <motion.div
        style={{
          rotateX: springRotateX,
          rotateY: springRotateY,
          transformStyle: 'preserve-3d',
        }}
        className="relative"
      >
        {/* Card Glow Effect */}
        <motion.div 
          className={`absolute -inset-1 rounded-3xl blur-xl transition-opacity duration-500 -z-10 ${isEven ? 'bg-[#8B1A1A]' : 'bg-[#1B2E1B]'}`}
          animate={{ opacity: isHovered ? 0.6 : 0.3 }}
        />
        
        <div className={`
          relative overflow-hidden rounded-3xl bg-gradient-to-br ${gradientColors}
          p-8 sm:p-10 backdrop-blur-xl
        `}>
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div 
              className="absolute inset-0"
              style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.3) 1px, transparent 0)`,
                backgroundSize: '30px 30px',
              }}
            />
          </div>
          
          {/* Floating Particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-white/20 rounded-full"
                style={{
                  left: `${20 + i * 15}%`,
                  top: `${30 + (i % 3) * 20}%`,
                }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0.2, 0.5, 0.2],
                }}
                transition={{
                  duration: 3 + i,
                  repeat: Infinity,
                  delay: i * 0.5,
                }}
              />
            ))}
          </div>
          
          {/* Content */}
          <div className="relative z-10">
            {/* Header */}
            <div className="flex items-start justify-between mb-8">
              <div>
                <motion.span 
                  className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-xs font-bold uppercase tracking-widest mb-3 border border-white/20"
                  animate={{ 
                    scale: isHovered ? 1.05 : 1,
                    boxShadow: isHovered ? '0 0 20px rgba(255,255,255,0.2)' : 'none'
                  }}
                >
                  {ambassador.codename}
                </motion.span>
                <h3 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                  {ambassador.name}
                </h3>
                <p className="text-white/60 text-sm mt-1 font-medium">{ambassador.role}</p>
              </div>
              
              {/* Avatar with Glow */}
              <motion.div 
                className="relative"
                animate={{ scale: isHovered ? 1.08 : 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="absolute inset-0 bg-white/30 rounded-2xl blur-xl" />
                <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden border-4 border-white/20 shadow-2xl">
                  <img
                    src={ambassador.image}
                    alt={ambassador.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
              </motion.div>
            </div>
            
            {/* Quote with Icon */}
            <div className="mb-8 relative">
              <Quote className="absolute -top-3 -left-2 w-10 h-10 text-white/10" />
              <p className="quote-text text-xl sm:text-2xl text-white/90 italic pl-8 leading-relaxed">
                "{ambassador.quote}"
              </p>
            </div>
            
            {/* Description */}
            <p className="text-white/60 text-sm mb-8 leading-relaxed max-w-md">
              {ambassador.description}
            </p>
            
            {/* Stats with Animated Progress Bars */}
            <div className="space-y-4 mb-8">
              {[
                { icon: Zap, label: 'Energy', value: ambassador.stats.energy, color: '#FFD700' },
                { icon: Target, label: 'Focus', value: ambassador.stats.focus, color: '#00D9C0' },
                { icon: Sparkles, label: 'Charisma', value: ambassador.stats.charisma, color: '#FF6B9D' },
              ].map((stat, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                    <stat.icon className="w-5 h-5 text-white/60" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between text-xs text-white/60 mb-1.5">
                      <span className="font-medium uppercase tracking-wider">{stat.label}</span>
                      <span className="font-bold">{stat.value}%</span>
                    </div>
                    <div className="h-2.5 bg-white/10 rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full rounded-full relative"
                        style={{ backgroundColor: stat.color }}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${stat.value}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, delay: 0.5 + i * 0.2, ease: 'easeOut' }}
                      >
                        <motion.div 
                          className="absolute inset-0 bg-white/30"
                          animate={{ x: ['-100%', '100%'] }}
                          transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
                        />
                      </motion.div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Social Links */}
            <div className="flex gap-3">
              {ambassador.socialLinks.instagram && (
                <motion.a 
                  href={`https://instagram.com/${ambassador.socialLinks.instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-white text-sm font-medium transition-all border border-white/10"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Instagram className="w-4 h-4" />
                  Instagram
                </motion.a>
              )}
              {ambassador.socialLinks.youtube && (
                <motion.a 
                  href={`https://youtube.com/${ambassador.socialLinks.youtube}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-white text-sm font-medium transition-all border border-white/10"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Youtube className="w-4 h-4" />
                  YouTube
                </motion.a>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
});

export default function Ambassadors() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const { t } = useTranslation();
  
  return (
    <section 
      id="ambassadors"
      ref={sectionRef}
      className="relative py-24 sm:py-32 overflow-hidden"
    >
      {/* Premium Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#F5F0E8] via-[#F8F5F0] to-[#F5F0E8]" />
      
      {/* Animated Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          className="absolute w-[600px] h-[600px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(139, 26, 26, 0.08) 0%, transparent 70%)',
            left: '-10%',
            top: '10%',
          }}
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div 
          className="absolute w-[500px] h-[500px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(201, 162, 39, 0.08) 0%, transparent 70%)',
            right: '-5%',
            bottom: '20%',
          }}
          animate={{ 
            scale: [1.2, 1, 1.2],
            y: [0, -30, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.span 
            className="inline-block px-5 py-2 bg-[#C9A227]/10 border border-[#C9A227]/20 rounded-full text-[#C9A227] text-sm font-bold uppercase tracking-widest mb-6"
            whileHover={{ scale: 1.05 }}
          >
            {t('ambassadors.badge')}
          </motion.span>
          <h2 className="text-5xl sm:text-6xl md:text-7xl font-black text-[#0D0D0D] mb-6 tracking-tight">
            {t('ambassadors.title1')} <span className="text-gradient">{t('ambassadors.title2')}</span>
          </h2>
          <p className="text-xl text-[#0D0D0D]/60 max-w-2xl mx-auto leading-relaxed">
            {t('ambassadors.description')}
          </p>
        </motion.div>
        
        {/* Ambassador Cards */}
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-12">
          {ambassadors.map((ambassador, index) => (
            <AmbassadorCard key={ambassador.id} ambassador={ambassador} index={index} />
          ))}
        </div>
        
        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-20"
        >
          <motion.a 
            href="#comics"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('comics')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-3 text-[#8B1A1A] font-bold text-lg hover:underline group"
            whileHover={{ x: 5 }}
          >
            {t('ambassadors.cta')}
            <TrendingUp className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
