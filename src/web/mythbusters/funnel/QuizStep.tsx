"use client";
import { useState, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Button } from '@myth/components/ui/button';
import { useFunnelStore } from '@myth/store/funnelStore';
import { useTranslation } from '@myth/hooks/useTranslation';
import { Check, Users, TrendingUp, Award } from 'lucide-react';

interface QuizOption {
  id: string;
  text: string;
  percentage: number;
}

const COLORS = ['#27AE60', '#8B1A1A'];

const QuizStep = memo(function QuizStep() {
  const [selected, setSelected] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const { setQuizAnswer, setStep } = useFunnelStore();
  const { t } = useTranslation();
  
  const quizData: QuizOption[] = [
    { id: 'yes', text: t('funnel.quiz.optionYes'), percentage: 15 },
    { id: 'no', text: t('funnel.quiz.optionNo'), percentage: 85 },
  ];
  
  const handleSelect = useCallback((optionId: string) => {
    setSelected(optionId);
    setQuizAnswer(optionId);
    
    setTimeout(() => {
      setShowResults(true);
    }, 500);
  }, [setQuizAnswer]);
  
  const handleContinue = useCallback(() => {
    setStep('terminal');
  }, [setStep]);
  
  return (
    <div className="h-full flex flex-col items-center justify-center p-6">
      <AnimatePresence mode="wait">
        {!showResults ? (
          // Question Screen
          <motion.div
            key="question"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className="max-w-2xl w-full text-center"
          >
            {/* Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
              className="w-20 h-20 bg-gradient-to-br from-[#C9A227] to-[#8B1A1A] rounded-full flex items-center justify-center mx-auto mb-8"
            >
              <Users className="w-10 h-10 text-white" />
            </motion.div>
            
            {/* Question */}
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
              {t('funnel.quiz.question')}
            </h2>
            <p className="text-white/60 mb-10">
              {t('funnel.quiz.subtitle')}
            </p>
            
            {/* Options */}
            <div className="space-y-4">
              {quizData.map((option) => (
                <motion.button
                  key={option.id}
                  onClick={() => handleSelect(option.id)}
                  className={`w-full p-6 rounded-2xl border-2 transition-all text-left ${
                    selected === option.id
                      ? 'border-[#C9A227] bg-[#C9A227]/10'
                      : 'border-white/10 bg-white/5 hover:bg-white/10'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-white text-lg font-medium">{option.text}</span>
                    {selected === option.id && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-8 h-8 bg-[#C9A227] rounded-full flex items-center justify-center"
                      >
                        <Check className="w-5 h-5 text-white" />
                      </motion.div>
                    )}
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        ) : (
          // Results Screen
          <motion.div
            key="results"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl w-full text-center"
          >
            {/* Chart */}
            <div className="relative w-64 h-64 mx-auto mb-8">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={quizData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="percentage"
                    animationBegin={0}
                    animationDuration={1000}
                  >
                    {quizData.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              
              {/* Center Text */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl font-black text-white">
                    {selected === 'yes' ? '15%' : '85%'}
                  </div>
                  <div className="text-white/40 text-sm">
                    {selected === 'yes' ? t('funnel.quiz.likeYou') : t('funnel.quiz.likeMost')}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mb-8"
            >
              {selected === 'yes' ? (
                <div className="bg-[#27AE60]/10 border border-[#27AE60]/30 rounded-2xl p-6">
                  <div className="flex items-center justify-center gap-2 text-[#27AE60] font-bold text-xl mb-2">
                    <Award className="w-6 h-6" />
                    {t('funnel.quiz.expertTitle')}
                  </div>
                  <p className="text-white/70">
                    {t('funnel.quiz.expertDesc')}
                  </p>
                </div>
              ) : (
                <div className="bg-[#C9A227]/10 border border-[#C9A227]/30 rounded-2xl p-6">
                  <div className="flex items-center justify-center gap-2 text-[#C9A227] font-bold text-xl mb-2">
                    <TrendingUp className="w-6 h-6" />
                    {t('funnel.quiz.learnedTitle')}
                  </div>
                  <p className="text-white/70">
                    {t('funnel.quiz.learnedDesc')}
                  </p>
                </div>
              )}
            </motion.div>
            
            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex justify-center gap-8 mb-8"
            >
              <div className="text-center">
                <div className="text-3xl font-black text-white">2,847</div>
                <div className="text-white/40 text-sm">{t('funnel.quiz.statsQuiz')}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black text-[#C9A227]">94%</div>
                <div className="text-white/40 text-sm">{t('funnel.quiz.statsSurprised')}</div>
              </div>
            </motion.div>
            
            {/* Continue Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              <Button
                onClick={handleContinue}
                className="px-10 py-6 bg-gradient-to-r from-[#8B1A1A] to-[#C9A227] text-white text-lg font-bold rounded-xl hover:shadow-lg hover:shadow-[#C9A227]/30"
              >
                {t('funnel.quiz.getReward')}
                <Award className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

export default QuizStep;
