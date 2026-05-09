import React from "react";
import { motion } from "framer-motion";
import { FundingType, FUNDING_INSTRUMENTS } from "@/data/game-simulator/rules";
import { slideUp, staggerContainer, tapScale } from "./animations";

interface Props {
  onTakeFunding: (type: FundingType) => void;
  isNeuroMode: boolean;
}

export const FundingPhase: React.FC<Props> = ({ onTakeFunding, isNeuroMode }) => {
  const cls = (base: string) => `${base} ${isNeuroMode ? "text-lg leading-relaxed" : "text-sm"}`;

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" exit="exit" className="space-y-4">
      <motion.div variants={slideUp}>
        <h2 className={cls("font-bold text-white")}>Крок 8: Обери джерело капіталу</h2>
        <p className="text-xs text-white/40 mb-4">Кожне джерело має ціну — не лише фінансову.</p>
      </motion.div>

      {Object.values(FUNDING_INSTRUMENTS).map(f => (
        <motion.button 
          variants={slideUp}
          {...tapScale}
          key={f.id} 
          onClick={() => onTakeFunding(f.id)} 
          className="w-full text-left p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all backdrop-blur-md relative overflow-hidden group"
        >
          {/* Subtle colored glow on hover based on instrument type */}
          <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 ${f.monthlyInterestRate > 0 ? "bg-red-500" : "bg-[#00FF88]"}`} />
          
          <div className="relative z-10">
            <div className="font-bold text-white mb-1">{f.name}</div>
            <div className="text-xs text-white/50 mb-2">{f.description}</div>
            <div className="flex gap-3 text-[10px] font-mono bg-black/20 p-2 rounded-lg inline-flex mb-2 border border-white/5">
              <span className="text-[#00FF88]">+${f.availableAmount}</span>
              {f.monthlyInterestRate > 0 && <span className="text-[#FF4444]">{f.monthlyInterestRate}%/міс</span>}
              <span className="text-[#FF9500]">Менталка: -{f.monthlyMentalCost}/міс</span>
            </div>
            <ul className="space-y-1">
              {f.tradeoffs.slice(0,2).map((t,i) => (
                <li key={i} className="text-[10px] text-white/40 flex items-start gap-1">
                  <span className="text-white/20 mt-0.5">•</span> {t}
                </li>
              ))}
            </ul>
          </div>
        </motion.button>
      ))}
    </motion.div>
  );
};
