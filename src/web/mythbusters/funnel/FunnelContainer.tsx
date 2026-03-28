"use client";
import { motion, AnimatePresence } from 'framer-motion';
import { useCallback, memo } from 'react';
import { useFunnelStore } from '@myth/store/funnelStore';
import { useTranslation } from '@myth/hooks/useTranslation';
import ComicReader from './ComicReader';
import MythDestroyer from './MythDestroyer';
import QuizStep from './QuizStep';
import SecretTerminal from './SecretTerminal';
import { X, RotateCcw } from 'lucide-react';
import { Button } from '@myth/components/ui/button';

interface FunnelContainerProps {
  onClose: () => void;
  seriesId: number;
}

const FunnelContainer = memo(function FunnelContainer({ onClose, seriesId }: FunnelContainerProps) {
  const { currentStep, getProgress, resetFunnel } = useFunnelStore();
  const { t } = useTranslation();
  
  const progress = getProgress();
  
  const handleReset = useCallback(() => {
    resetFunnel();
  }, [resetFunnel]);
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-[#0a0a0a] overflow-hidden"
    >
      {/* Progress Bar */}
      <div className="absolute top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/80 to-transparent p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <span className="text-white/60 text-sm font-medium">{t('funnel.progress')}</span>
            <span className="text-[#C9A227] font-bold">{progress}%</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="text-white/40 hover:text-white hover:bg-white/10"
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              {t('funnel.reset')}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white/60 hover:text-white hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[#8B1A1A] via-[#C9A227] to-[#27AE60]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
      </div>
      
      {/* Step Content */}
      <div className="h-full pt-20">
        <AnimatePresence mode="wait">
          {currentStep === 'comic' && (
            <motion.div
              key="comic"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.4 }}
              className="h-full"
            >
              <ComicReader seriesId={seriesId} />
            </motion.div>
          )}
          
          {currentStep === 'destroy' && (
            <motion.div
              key="destroy"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 0.4 }}
              className="h-full"
            >
              <MythDestroyer />
            </motion.div>
          )}
          
          {currentStep === 'quiz' && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.4 }}
              className="h-full"
            >
              <QuizStep />
            </motion.div>
          )}
          
          {currentStep === 'terminal' && (
            <motion.div
              key="terminal"
              initial={{ opacity: 0, rotateY: -90 }}
              animate={{ opacity: 1, rotateY: 0 }}
              exit={{ opacity: 0, rotateY: 90 }}
              transition={{ duration: 0.5 }}
              className="h-full"
              style={{ perspective: 1000 }}
            >
              <SecretTerminal />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#8B1A1A]/10 rounded-full blur-3xl will-change-transform" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#C9A227]/10 rounded-full blur-3xl will-change-transform" />
      </div>
    </motion.div>
  );
});

export default FunnelContainer;
