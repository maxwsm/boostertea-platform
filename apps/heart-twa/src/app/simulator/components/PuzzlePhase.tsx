import React from "react";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import { LogicPuzzle } from "@/data/game-simulator/gameFlow";
import { ActionResult } from "@/data/game-simulator/assetNodes";
import { slideUp, staggerContainer, tapScale } from "./animations";

interface Props {
  puzzle: LogicPuzzle | null;
  lastResult: ActionResult | null;
  applyResult: (r: ActionResult) => void;
  setPendingPuzzle: (p: LogicPuzzle | null) => void;
  setPhase: (p: any) => void;
  isNeuroMode: boolean;
}

export const PuzzlePhase: React.FC<Props> = ({ puzzle, lastResult, applyResult, setPendingPuzzle, setPhase, isNeuroMode }) => {
  const cls = (base: string) => `${base} ${isNeuroMode ? "text-lg leading-relaxed" : "text-sm"}`;

  if (!puzzle) return null;

  const handleAnswer = (index: number) => {
    if (index === puzzle.correctIndex) {
      applyResult({ 
        financialDelta: Math.abs(lastResult?.financialDelta || 0) * 0.5, 
        mentalDelta: 15, 
        socialDelta: 5, 
        mindset: "PROFICIT", 
        title: "✅ Правильно!", 
        message: puzzle.explanation, 
        lesson: "Знання рятують капітал.",
        isBlackSwan: false
      });
    } else {
      applyResult({ 
        financialDelta: 0, 
        mentalDelta: -5, 
        socialDelta: 0, 
        mindset: "DEFICIT", 
        title: "❌ Неправильно", 
        message: puzzle.explanation, 
        lesson: "Цього разу не вдалося. Наслідки залишаються.",
        isBlackSwan: false
      });
    }
    setPendingPuzzle(null);
    setPhase("PLAYING");
  };

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" exit="exit" className="space-y-4 relative z-50">
      <motion.div variants={slideUp} className="p-6 rounded-2xl bg-[#FF9500]/10 border border-[#FF9500]/30 shadow-[0_0_40px_rgba(255,149,0,0.15)] backdrop-blur-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-[#FF9500]/20 rounded-full animate-pulse">
            <Zap className="text-[#FF9500]" size={24} />
          </div>
          <div>
            <p className="text-[10px] text-[#FF9500] uppercase font-mono tracking-widest">Антикризовий Менеджмент</p>
            <p className="text-xs text-white/50">{puzzle.topic}</p>
          </div>
        </div>
        
        <p className={cls("font-bold text-white text-lg mb-6 leading-relaxed")}>{puzzle.question}</p>
        
        <div className="space-y-3">
          {puzzle.options.map((option, i) => (
            <motion.button 
              key={i} 
              variants={slideUp}
              {...tapScale}
              onClick={() => handleAnswer(i)} 
              className="w-full text-left p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-[#FF9500]/50 transition-all text-sm text-white/90 shadow-sm"
            >
              {option}
            </motion.button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};
