"use client";
import { useState, useEffect, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@myth/components/ui/button';
import { Input } from '@myth/components/ui/input';
import { useFunnelStore } from '@myth/store/funnelStore';
import { useTranslation } from '@myth/hooks/useTranslation';
import { Lock, Unlock, Sparkles, ShoppingCart, Percent, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

const SecretTerminal = memo(function SecretTerminal() {
  const [code, setCode] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const { foundEasterEggs, getCollectedCode, unlockDiscount, discountUnlocked } = useFunnelStore();
  const { t } = useTranslation();
  
  const correctCode = getCollectedCode();
  
  useEffect(() => {
    if (discountUnlocked) {
      setIsUnlocked(true);
    }
  }, [discountUnlocked]);
  
  const handleSubmit = useCallback(() => {
    setIsValidating(true);
    
    setTimeout(() => {
      if (code.toUpperCase() === correctCode) {
        setIsUnlocked(true);
        unlockDiscount();
        toast.success(t('funnel.terminal.copied'), {
          description: '15%',
          icon: <Sparkles className="w-4 h-4" />,
        });
      } else {
        toast.error(t('funnel.terminal.invalidCode'), {
          description: t('funnel.terminal.tryAgain'),
        });
      }
      setIsValidating(false);
    }, 800);
  }, [code, correctCode, unlockDiscount, t]);
  
  const handleShopNow = useCallback(() => {
    window.open('https://boostertea.com.ua?discount=MYTH15', '_blank');
  }, []);
  
  return (
    <div className="h-full flex flex-col items-center justify-center p-6">
      <AnimatePresence mode="wait">
        {!isUnlocked ? (
          // Locked State
          <motion.div
            key="locked"
            initial={{ opacity: 0, rotateY: -90 }}
            animate={{ opacity: 1, rotateY: 0 }}
            exit={{ opacity: 0, rotateY: 90 }}
            transition={{ duration: 0.5 }}
            className="max-w-lg w-full text-center"
            style={{ perspective: 1000 }}
          >
            {/* Lock Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
              className="w-24 h-24 bg-gradient-to-br from-[#8B1A1A] to-[#4a0e0e] rounded-full flex items-center justify-center mx-auto mb-8 border-4 border-[#C9A227]/30"
            >
              <Lock className="w-12 h-12 text-white" />
            </motion.div>
            
            {/* Title */}
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
              {t('funnel.terminal.title')}
            </h2>
            <p className="text-white/60 mb-8">
              {t('funnel.terminal.subtitle')}
            </p>
            
            {/* Progress */}
            <div className="bg-white/5 rounded-2xl p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <span className="text-white/60">{t('funnel.terminal.level')}</span>
                <span className="text-[#C9A227] font-bold">75%</span>
              </div>
              <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#8B1A1A] via-[#C9A227] to-[#27AE60]"
                  initial={{ width: 0 }}
                  animate={{ width: '75%' }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
              
              {/* Found Eggs */}
              <div className="mt-4 flex items-center justify-center gap-4">
                <span className="text-white/40 text-sm">{t('funnel.terminal.foundEggs')}</span>
                <div className="flex gap-2">
                  {foundEasterEggs.map((egg, i) => (
                    <motion.div
                      key={egg}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.8 + i * 0.1 }}
                      className="w-8 h-8 bg-[#C9A227] rounded-full flex items-center justify-center"
                    >
                      <Sparkles className="w-4 h-4 text-white" />
                    </motion.div>
                  ))}
                  {Array.from({ length: 2 - foundEasterEggs.length }).map((_, i) => (
                    <div
                      key={`empty-${i}`}
                      className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center"
                    >
                      <Lock className="w-4 h-4 text-white/30" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Code Input */}
            <div className="space-y-4">
              <div className="relative">
                <Input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder={t('funnel.terminal.placeholder')}
                  maxLength={8}
                  className="w-full h-16 bg-white/5 border-2 border-white/10 rounded-xl text-white text-center text-2xl font-mono tracking-[0.3em] placeholder:text-white/20 focus:border-[#C9A227] focus:ring-[#C9A227]/20"
                  disabled={isValidating}
                />
                {isValidating && (
                  <motion.div
                    className="absolute inset-0 bg-white/5 rounded-xl flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="w-6 h-6 border-2 border-[#C9A227] border-t-transparent rounded-full animate-spin" />
                  </motion.div>
                )}
              </div>
              
              <Button
                onClick={handleSubmit}
                disabled={code.length < 4 || isValidating}
                className="w-full h-14 bg-gradient-to-r from-[#8B1A1A] to-[#C9A227] text-white text-lg font-bold rounded-xl hover:shadow-lg hover:shadow-[#C9A227]/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isValidating ? t('funnel.terminal.validating') : t('funnel.terminal.unlock')}
                <Unlock className="w-5 h-5 ml-2" />
              </Button>
            </div>
            
            {/* Hint */}
            {foundEasterEggs.length < 2 && (
              <p className="mt-4 text-white/40 text-sm">
                {t('funnel.terminal.hint')}
              </p>
            )}
          </motion.div>
        ) : (
          // Unlocked State
          <motion.div
            key="unlocked"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-lg w-full text-center"
          >
            {/* Success Animation */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="w-32 h-32 bg-gradient-to-br from-[#27AE60] to-[#2ECC71] rounded-full flex items-center justify-center mx-auto mb-8"
            >
              <Unlock className="w-16 h-16 text-white" />
            </motion.div>
            
            {/* Title */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl font-black text-white mb-4"
            >
              {t('funnel.terminal.successTitle')}
            </motion.h2>
            
            {/* Discount Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="relative inline-block mb-8"
            >
              <div className="absolute inset-0 bg-[#C9A227] blur-2xl opacity-50" />
              <div className="relative bg-gradient-to-br from-[#C9A227] to-[#8B1A1A] px-12 py-8 rounded-3xl">
                <div className="text-white/80 text-sm uppercase tracking-widest mb-1">{t('funnel.terminal.yourDiscount')}</div>
                <div className="text-7xl font-black text-white">15%</div>
                <div className="text-white/80 text-lg">{t('funnel.terminal.onEverything')}</div>
              </div>
            </motion.div>
            
            {/* Promo Code */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white/5 border border-white/10 rounded-xl p-4 mb-8"
            >
              <div className="text-white/40 text-sm mb-2">{t('funnel.terminal.promoCode')}</div>
              <div className="flex items-center justify-center gap-3">
                <code className="text-2xl font-mono text-[#C9A227] font-bold tracking-wider">
                  MYTH15
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText('MYTH15');
                    toast.success(t('funnel.terminal.copied'));
                  }}
                  className="text-white/40 hover:text-white"
                >
                  {t('funnel.terminal.copy')}
                </Button>
              </div>
            </motion.div>
            
            {/* Benefits */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex justify-center gap-6 mb-8"
            >
              <div className="flex items-center gap-2 text-white/60">
                <Percent className="w-5 h-5 text-[#C9A227]" />
                <span>{t('funnel.terminal.saveUpTo')}</span>
              </div>
              <div className="flex items-center gap-2 text-white/60">
                <Sparkles className="w-5 h-5 text-[#C9A227]" />
                <span>{t('funnel.terminal.exclusive')}</span>
              </div>
            </motion.div>
            
            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              <Button
                onClick={handleShopNow}
                className="w-full h-16 bg-gradient-to-r from-[#27AE60] to-[#2ECC71] text-white text-xl font-bold rounded-xl hover:shadow-lg hover:shadow-[#27AE60]/30"
              >
                <ShoppingCart className="w-6 h-6 mr-2" />
                {t('funnel.terminal.orderWithDiscount')}
                <ExternalLink className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

export default SecretTerminal;
