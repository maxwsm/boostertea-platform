import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, ArrowRight, ShieldAlert } from 'lucide-react';
// import { useStore } from '@/lib/store'; // При імплементації підключається стор

export interface NeuralAgentProps {
  variant?: 'booster' | 'tlab' | 'dino' | 'funny';
  cartItems?: Array<{ category: string, id: string }>; // Пропс для незалежності пакета
  onEquip?: (targetId: string, brand: string) => void;
}

export const NeuralAgentHub = ({ variant = 'booster', cartItems = [], onEquip }: NeuralAgentProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [suggestion, setSuggestion] = useState<any>(null);

  // 🧠 AI Логіка аналізу кошика
  useEffect(() => {
    const analyzeSynergy = () => {
      const hasTea = cartItems.some(item => item.category === 'tea' || item.category === 'classic');
      const hasDrops = cartItems.some(item => item.category === 'drops');

      if (hasTea && !hasDrops) {
        setSuggestion({
          title: "СИНЕРГІЯ: CHAOS CATALYST",
          desc: "Твій чайний інвентар потребує FunnyDrops для активації 100% потенціалу. Екіпірувати?",
          target: "funny-drops-original",
          brand: "funny",
          price: "149₴"
        });
      } else if (hasDrops && !hasTea) {
        setSuggestion({
          title: "БАЗА: GABA AMBER",
          desc: "Енергія крапель занадто нестабільна без щита. Рекомендую стабілізацію через BoosterTea.",
          target: "gaba-amber",
          brand: "booster",
          price: "350₴"
        });
      } else {
        setSuggestion(null); // Якщо ідеально
      }
    };

    analyzeSynergy();
  }, [cartItems]);

  const themes = {
    booster: "border-white/20 text-white shadow-white/5 glow-[#C4956A]",
    tlab: "border-emerald-500/30 text-emerald-400 shadow-emerald-500/10 glow-emerald-500",
    dino: "border-cyan-400/30 text-cyan-300 shadow-cyan-400/10 glow-cyan-400",
    funny: "border-fuchsia-500/30 text-fuchsia-300 shadow-fuchsia-500/10 glow-fuchsia-500"
  };

  const currentTheme = themes[variant];

  return (
    <div className="fixed bottom-6 right-6 z-[100] font-mono">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={`mb-4 w-72 md:w-80 backdrop-blur-3xl bg-black/80 border rounded-[2rem] p-6 shadow-2xl ${currentTheme.split(' glow')[0]}`}
          >
            <div className="flex items-center gap-2 mb-6 opacity-60 text-[10px] tracking-widest uppercase text-white">
              <ShieldAlert size={12} /> Agent v5.0
            </div>

            {suggestion ? (
              <div className="space-y-4">
                <h3 className="text-sm font-black leading-tight italic tracking-wide">{suggestion.title}</h3>
                <p className="text-xs opacity-70 leading-relaxed text-gray-300">{suggestion.desc}</p>
                
                <button 
                  onClick={() => onEquip && onEquip(suggestion.target, suggestion.brand)}
                  className={`w-full py-4 mt-2 rounded-xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all
                    ${variant === 'booster' ? 'bg-[#C4956A] text-black shadow-[0_0_15px_rgba(196,149,106,0.3)]' : 'bg-current text-black shadow-lg'} 
                    hover:scale-[1.03] active:scale-95`}
                >
                  Екіпірувати {suggestion.price} <ArrowRight size={14} />
                </button>
              </div>
            ) : (
              <p className="text-xs opacity-50 italic text-gray-400">Аналіз завершено. Інвентар збалансовано. Аномалій не виявлено.</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🔮 ПУЛЬСУЮЧИЙ ВУЗОЛ */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 md:w-16 md:h-16 rounded-full backdrop-blur-xl bg-white/5 border-2 flex items-center justify-center shadow-[0_0_20px_rgba(0,0,0,0.5)] outline-none relative z-10 ${currentTheme.split(' glow')[0]}`}
      >
        <div className="relative z-10">
          <MessageSquare size={22} className={variant === 'booster' ? 'text-[#C4956A]' : 'text-current'} />
          {suggestion && (
            <motion.div 
              className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border border-black shadow-[0_0_10px_red]"
              animate={{ scale: [1, 1.4, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            />
          )}
        </div>
      </motion.button>
    </div>
  );
};
