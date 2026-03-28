"use client";
import { useRef, useState, memo, useCallback } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { BookOpen, Clock, CheckCircle, Lock, Sparkles, Egg, Play, TrendingUp } from 'lucide-react';
import { comicSeries } from '@myth/data/comics';
import { useTranslation } from '@myth/hooks/useTranslation';
import FunnelContainer from '@myth/funnel/FunnelContainer';

interface ComicCardProps {
  series: typeof comicSeries[0];
  index: number;
  onClick: () => void;
}

const ComicCard = memo(function ComicCard({ series, index, onClick }: ComicCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { t } = useTranslation();
  
  const isComingSoon = series.status === 'coming-soon';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => !isComingSoon && onClick()}
      className={`relative group ${isComingSoon ? 'cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <motion.div
        animate={{ 
          scale: isHovered && !isComingSoon ? 1.05 : 1,
          y: isHovered && !isComingSoon ? -10 : 0 
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="relative"
      >
        {/* Card */}
        <div 
          className="relative overflow-hidden rounded-2xl bg-white border-2 border-[#1B2E1B]/10"
          style={{ 
            boxShadow: isHovered && !isComingSoon ? `0 20px 40px ${series.color}40` : undefined,
            filter: isComingSoon ? 'grayscale(0.5)' : undefined
          }}
        >
          {/* Cover Image */}
          <div className="relative aspect-[2/3] overflow-hidden">
            <img
              src={series.coverImage}
              alt={series.subtitle}
              className={`w-full h-full object-cover transition-transform duration-500 ${!isComingSoon && 'group-hover:scale-110'}`}
              loading="lazy"
              decoding="async"
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            
            {/* Coming Soon Overlay */}
            {isComingSoon && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                <div className="text-center">
                  <Lock className="w-12 h-12 text-white/60 mx-auto mb-2" />
                  <span className="text-white font-bold text-lg">{t('comics.comingSoon')}</span>
                </div>
              </div>
            )}
            
            {/* Series Number Badge */}
            <div 
              className="absolute top-4 left-4 px-4 py-1.5 rounded-full text-white text-sm font-bold"
              style={{ backgroundColor: series.color }}
            >
              {series.title}
            </div>
            
            {/* Status Badge */}
            {!isComingSoon && (
              <div className="absolute top-4 right-4 px-3 py-1.5 bg-green-500/90 rounded-full text-white text-xs font-bold flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5" />
                {t('comics.status.available')}
              </div>
            )}
            
            {/* Easter Egg Badge */}
            {series.hasEasterEgg && (
              <div className="absolute top-14 right-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black text-xs font-bold rounded-full">
                  <Egg className="w-3.5 h-3.5" />
                  {t('comics.easterEgg')}
                </span>
              </div>
            )}
            
            {/* Play Button on Hover */}
            {!isComingSoon && (
              <motion.div 
                className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div
                  className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center shadow-2xl"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Play className="w-10 h-10 text-[#8B1A1A] ml-1" fill="currentColor" />
                </motion.div>
              </motion.div>
            )}
            
            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <h3 className="text-white font-bold text-xl mb-1 leading-tight">
                {series.subtitle}
              </h3>
              <p className="text-white/70 text-sm mb-4">
                {series.myth}
              </p>
              
              {/* Meta */}
              <div className="flex items-center gap-4 text-white/60 text-xs">
                <span className="flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  {series.pages} {t('comics.pages')}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  5 {t('comics.readTime')}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Glow Effect */}
        {!isComingSoon && (
          <motion.div 
            className="absolute -inset-2 rounded-2xl blur-xl -z-10"
            style={{ backgroundColor: series.color }}
            animate={{ opacity: isHovered ? 0.5 : 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </motion.div>
    </motion.div>
  );
});

export default function ComicGallery() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const { t } = useTranslation();
  const [selectedSeries, setSelectedSeries] = useState<number | null>(null);
  const [showFunnel, setShowFunnel] = useState(false);
  
  const handleOpenComic = useCallback((seriesId: number) => {
    setSelectedSeries(seriesId);
    setShowFunnel(true);
  }, []);
  
  const handleCloseFunnel = useCallback(() => {
    setShowFunnel(false);
    setSelectedSeries(null);
  }, []);
  
  const availableSeries = comicSeries.filter(s => s.status === 'available');
  const comingSoonSeries = comicSeries.filter(s => s.status === 'coming-soon');
  
  return (
    <section 
      id="comics"
      ref={sectionRef}
      className="relative py-24 sm:py-32 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#F5F0E8] via-[#FAF8F5] to-[#F5F0E8]" />
      
      {/* Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          className="absolute w-[500px] h-[500px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(139, 26, 26, 0.05) 0%, transparent 70%)',
            left: '-10%',
            top: '10%',
          }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.span 
            className="inline-flex items-center gap-2 px-5 py-2 bg-[#8B1A1A]/10 border border-[#8B1A1A]/20 rounded-full text-[#8B1A1A] text-sm font-bold uppercase tracking-widest mb-6"
            whileHover={{ scale: 1.05 }}
          >
            <Sparkles className="w-4 h-4" />
            {t('comics.badge')}
          </motion.span>
          <h2 className="text-5xl sm:text-6xl md:text-7xl font-black text-[#0D0D0D] mb-6 tracking-tight">
            {t('comics.title1')} <span className="text-gradient">{t('comics.title2')}</span>
          </h2>
          <p className="text-xl text-[#0D0D0D]/60 max-w-2xl mx-auto">
            {t('comics.description')}
          </p>
        </motion.div>
        
        {/* Available Comics Grid */}
        <div className="mb-16">
          <h3 className="text-xl font-bold text-[#0D0D0D] mb-8 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#C9A227]" />
            {t('comics.available')}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {availableSeries.map((series, index) => (
              <ComicCard 
                key={series.id} 
                series={series} 
                index={index}
                onClick={() => handleOpenComic(series.id)}
              />
            ))}
          </div>
        </div>
        
        {/* Coming Soon Grid */}
        {comingSoonSeries.length > 0 && (
          <div className="mb-16">
            <h3 className="text-xl font-bold text-[#0D0D0D]/60 mb-8 flex items-center gap-2">
              <Lock className="w-5 h-5" />
              {t('comics.comingSoon')}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {comingSoonSeries.map((series, index) => (
                <ComicCard 
                  key={series.id} 
                  series={series} 
                  index={index + availableSeries.length}
                  onClick={() => {}}
                />
              ))}
            </div>
          </div>
        )}
        
        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {[
            { value: '6', label: t('comics.stats.mythsBusted') },
            { value: '36', label: t('comics.stats.comicPages') },
            { value: '100%', label: t('comics.stats.scientificFacts') },
            { value: '0', label: t('comics.stats.mythsLeft') },
          ].map((stat, index) => (
            <div key={index} className="text-center p-6 bg-white rounded-2xl shadow-lg shadow-black/5">
              <div className="text-4xl font-black text-[#8B1A1A] mb-1">{stat.value}</div>
              <div className="text-sm text-[#0D0D0D]/60">{stat.label}</div>
            </div>
          ))}
        </motion.div>
        
        {/* Story Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 1 }}
          className="mt-16 p-8 bg-white rounded-2xl shadow-lg shadow-black/5"
        >
          <h3 className="text-lg font-bold text-[#0D0D0D] mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#8B1A1A]" />
            {t('comics.storyProgress')}
          </h3>
          <div className="space-y-5">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-[#0D0D0D]/70 font-medium">{t('comics.season1')}</span>
                <span className="text-[#27AE60] font-bold">{t('comics.completed')}</span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-[#27AE60] to-[#2ECC71] rounded-full"
                  initial={{ width: 0 }}
                  whileInView={{ width: '100%' }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-[#0D0D0D]/70 font-medium">{t('comics.season2')}</span>
                <span className="text-[#00D9C0] font-bold">{t('comics.comingSoon')}</span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-[#00D9C0] to-[#00B4A0] rounded-full"
                  initial={{ width: 0 }}
                  whileInView={{ width: '15%' }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.7 }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Funnel Modal */}
      <AnimatePresence>
        {showFunnel && selectedSeries && (
          <FunnelContainer 
            seriesId={selectedSeries} 
            onClose={handleCloseFunnel} 
          />
        )}
      </AnimatePresence>
    </section>
  );
}
