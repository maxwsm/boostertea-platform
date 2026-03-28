"use client";
import { useCallback, useEffect, useState, memo } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Sparkles, Lock } from 'lucide-react';
import { Button } from '@myth/components/ui/button';
import { useFunnelStore } from '@myth/store/funnelStore';
import { useTranslation } from '@myth/hooks/useTranslation';

interface ComicReaderProps {
  seriesId: number;
}

interface EasterEgg {
  id: string;
  page: number;
  x: number;
  y: number;
  found: boolean;
}

const easterEggs: EasterEgg[] = [
  { id: 'myth', page: 2, x: 70, y: 30, found: false },
  { id: 'truth', page: 4, x: 20, y: 60, found: false },
];

const ComicReader = memo(function ComicReader({ seriesId }: ComicReaderProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showHint, setShowHint] = useState(true);
  const { foundEasterEggs, addEasterEgg, setStep } = useFunnelStore();
  const { t } = useTranslation();
  
  const totalPages = 6;
  
  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);
  
  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);
  
  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);
  
  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);
  
  const handleEasterEggClick = (eggId: string) => {
    if (!foundEasterEggs.includes(eggId)) {
      addEasterEgg(eggId);
    }
  };
  
  const handleContinue = () => {
    setStep('destroy');
  };
  
  // Hide hint after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowHint(false), 3000);
    return () => clearTimeout(timer);
  }, []);
  
  const currentPageEggs = easterEggs.filter(egg => egg.page === selectedIndex + 1);
  
  return (
    <div className="h-full flex flex-col">
      {/* Comic Carousel */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="relative w-full max-w-4xl">
          {/* Navigation Buttons */}
          <button
            onClick={scrollPrev}
            disabled={selectedIndex === 0}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 p-3 bg-black/50 hover:bg-black/70 disabled:opacity-30 disabled:cursor-not-allowed rounded-full transition-all"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          
          <button
            onClick={scrollNext}
            disabled={selectedIndex === totalPages - 1}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 p-3 bg-black/50 hover:bg-black/70 disabled:opacity-30 disabled:cursor-not-allowed rounded-full transition-all"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
          
          {/* Carousel */}
          <div className="overflow-hidden rounded-xl" ref={emblaRef}>
            <div className="flex">
              {Array.from({ length: totalPages }, (_, i) => (
                <div key={i} className="flex-[0_0_100%] min-w-0 relative">
                  <div className="relative aspect-[3/4] bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] rounded-xl overflow-hidden">
                    <img
                      src={`/comics/series-${seriesId}/page-${i + 1}.jpg`}
                      alt={`Page ${i + 1}`}
                      className="w-full h-full object-contain"
                    />
                    
                    {/* Easter Eggs on this page */}
                    {currentPageEggs.map((egg) => (
                      <motion.button
                        key={egg.id}
                        onClick={() => handleEasterEggClick(egg.id)}
                        className={`absolute w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                          foundEasterEggs.includes(egg.id)
                            ? 'bg-[#C9A227] text-white'
                            : 'bg-white/10 hover:bg-white/20 text-white/60 animate-pulse'
                        }`}
                        style={{ left: `${egg.x}%`, top: `${egg.y}%` }}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        {foundEasterEggs.includes(egg.id) ? (
                          <Sparkles className="w-6 h-6" />
                        ) : (
                          <Lock className="w-5 h-5" />
                        )}
                      </motion.button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Page Indicators */}
          <div className="flex justify-center gap-2 mt-4">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => emblaApi?.scrollTo(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  selectedIndex === i
                    ? 'w-8 bg-[#C9A227]'
                    : 'bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* Bottom Panel */}
      <div className="bg-gradient-to-t from-black via-black/80 to-transparent p-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          {/* Easter Eggs Status */}
          <div className="flex items-center gap-4">
            <div className="text-white/60 text-sm">
              {t('funnel.comic.easterEggsFound')}
              <span className="text-[#C9A227] font-bold ml-1">
                {foundEasterEggs.length}/2
              </span>
            </div>
            
            <AnimatePresence>
              {foundEasterEggs.length === 2 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2 text-[#27AE60] text-sm font-medium"
                >
                  <Sparkles className="w-4 h-4" />
                  {t('funnel.comic.codeCollected')}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Continue Button */}
          <Button
            onClick={handleContinue}
            disabled={selectedIndex < totalPages - 1}
            className={`px-8 py-6 text-lg font-bold rounded-xl transition-all ${
              selectedIndex === totalPages - 1
                ? 'bg-gradient-to-r from-[#8B1A1A] to-[#C9A227] hover:shadow-lg hover:shadow-[#C9A227]/30'
                : 'bg-white/10 text-white/40 cursor-not-allowed'
            }`}
          >
            {selectedIndex === totalPages - 1 
              ? t('funnel.comic.destroyMyth')
              : `${t('funnel.comic.page')} ${selectedIndex + 1} ${t('funnel.comic.of')} ${totalPages}`}
          </Button>
        </div>
        
        {/* Hint */}
        <AnimatePresence>
          {showHint && foundEasterEggs.length < 2 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center mt-4 text-white/40 text-sm"
            >
              {t('funnel.comic.hint')}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
});

export default ComicReader;
