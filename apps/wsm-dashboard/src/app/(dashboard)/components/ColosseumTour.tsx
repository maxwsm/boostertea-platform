'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TOUR_STEPS = [
  {
    title: 'Вітаємо у Колізеї WSM',
    description: 'Це ваш Master Brain. Усі 4 бренди (BoosterTea, DinoSlush, FunnyDrops, TLab) зібрані в одному 150% In-House дашборді. Нам не потрібні Notion чи Miro — все налаштовано всередині.',
    position: 'center'
  },
  {
    title: 'Trinity Офлайну (Food R&D Engine)',
    description: 'Зліва у вашому модулі ERP ви знайдете Production Board. Перетягуйте карточки замовлень (Drag & Drop), а система під капотом зведе 1С бухгалтерію (Двійний запис) та спише сиропи за FEFO алгоритмом.',
    position: 'left'
  },
  {
    title: 'Trinity Онлайну (Маркетинг Симуляція)',
    description: 'Прямо перед вами 3D-матриця рекламних алгоритмів. Meta, Google та TikTok працюють синхронно. Якщо лід відвалюється — він отримує Ретаргет-лазер та повертається.',
    position: 'bottom-right'
  },
  {
    title: 'Native-AI Knowledge Base',
    description: 'Готові побачити майбутнє? Ваші рецептури тепер це нативні RAG-документи (клон Notion), які відкриваються з кліку в Production і завжди читаються ШІ-асистентами.',
    position: 'center'
  }
];

export default function ColosseumTour() {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Check if tour was already shown. If not, auto-start.
    const hasSeen = localStorage.getItem('@wsm/colosseum_tour_v1');
    if (!hasSeen) {
      setTimeout(() => setIsActive(true), 1500); // Wait for initial 3D load
    }
  }, []);

  const handleNext = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep(s => s + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    localStorage.setItem('@wsm/colosseum_tour_v1', 'true');
    setIsActive(false);
  };

  if (!isActive) return (
    <button 
      onClick={() => { setCurrentStep(0); setIsActive(true); }}
      className="absolute bottom-6 right-6 z-40 bg-white/10 hover:bg-white/20 backdrop-blur border border-white/20 px-4 py-2 rounded-full text-xs font-mono text-white transition-all shadow-lg"
    >
      [ RESTART TOUR ]
    </button>
  );

  const step = TOUR_STEPS[currentStep];

  // Helper for layout positioning
  const getAlignment = () => {
    if (step.position === 'center') return 'items-center justify-center';
    if (step.position === 'left') return 'items-center justify-start ml-24';
    if (step.position === 'bottom-right') return 'items-end justify-end mb-24 mr-24 pb-32';
    return 'items-center justify-center';
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`fixed inset-0 z-50 pointer-events-auto flex ${getAlignment()} bg-black/60 backdrop-blur-sm`}
      >
        <div className="absolute inset-0" onClick={handleNext} />
        
        <motion.div 
          key={currentStep}
          initial={{ y: 20, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -20, opacity: 0, scale: 0.95 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative z-10 p-8 max-w-md bg-[#09090b]/80 backdrop-blur-3xl border border-white/20 rounded-2xl shadow-[0_0_80px_rgba(255,255,255,0.1)]"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="flex h-3 w-3 bg-primary rounded-full animate-pulse shadow-[0_0_10px_#fff]"></span>
            <span className="text-[10px] text-zinc-400 font-mono tracking-widest uppercase">System Override // Step 0{currentStep + 1}</span>
          </div>

          <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent mb-4">
            {step.title}
          </h2>
          
          <p className="text-sm text-zinc-300 leading-relaxed mb-8 font-medium">
            {step.description}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex gap-1.5">
              {TOUR_STEPS.map((_, i) => (
                <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === currentStep ? 'w-6 bg-primary' : 'w-1.5 bg-white/20'}`} />
              ))}
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={handleComplete}
                className="text-xs text-zinc-500 hover:text-white transition-colors px-3 py-2"
              >
                Skip
              </button>
              <button 
                onClick={handleNext}
                className="bg-white text-black text-sm px-6 py-2 rounded-full font-semibold hover:bg-zinc-200 transition-transform active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
              >
                {currentStep === TOUR_STEPS.length - 1 ? 'Start Engine' : 'Next'}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
