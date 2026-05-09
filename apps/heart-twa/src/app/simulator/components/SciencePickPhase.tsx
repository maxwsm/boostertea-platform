import React from "react";
import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";
import { ScienceTracker, investLossInScience, SCIENCE_TOPICS } from "@/data/game-simulator/scienceEasterEgg";
import { PlayerState } from "@/data/game-simulator/rules";
import { ActionResult } from "@/data/game-simulator/assetNodes";
import { slideUp, staggerContainer, tapScale } from "./animations";

interface Props {
  pendingLoss: number;
  player: PlayerState;
  setScienceTracker: React.Dispatch<React.SetStateAction<ScienceTracker>>;
  setPlayer: React.Dispatch<React.SetStateAction<PlayerState>>;
  setLastResult: (r: ActionResult) => void;
  setPhase: (p: any) => void;
  isNeuroMode: boolean;
}

export const SciencePickPhase: React.FC<Props> = ({ pendingLoss, player, setScienceTracker, setPlayer, setLastResult, setPhase, isNeuroMode }) => {
  const cls = (base: string) => `${base} ${isNeuroMode ? "text-lg leading-relaxed" : "text-sm"}`;

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" exit="exit" className="space-y-4 relative z-50">
      <motion.div variants={slideUp} className="p-5 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 backdrop-blur-xl shadow-[0_0_30px_rgba(99,102,241,0.15)] mb-6">
        <GraduationCap className="text-indigo-400 mb-3" size={32} />
        <p className="text-[10px] text-indigo-400 uppercase font-mono tracking-widest mb-2">Прихований Механізм</p>
        <p className="font-black text-xl text-white mb-2">Перенаправити збиток у навчання</p>
        <p className={cls("text-indigo-100/70 mb-4")}>Ти втратив ${pendingLoss}. Але капітал — це не лише гроші. Обери сферу для дослідження. Ефект виявиться пізніше.</p>
      </motion.div>

      <motion.div variants={staggerContainer} className="space-y-3">
        {SCIENCE_TOPICS.map(t => (
          <motion.button 
            variants={slideUp}
            {...tapScale}
            key={t.id} 
            onClick={() => {
              setScienceTracker(prev => investLossInScience(prev, pendingLoss, "USD", "loss", t.id, player.month));
              // Neutralize the financial loss silently
              setPlayer(p => ({ ...p, banks: { ...p.banks, FINANCIAL: { ...p.banks.FINANCIAL, balance: p.banks.FINANCIAL.balance + pendingLoss } } }));
              setLastResult({ financialDelta: 0, mentalDelta: 3, socialDelta: 0, mindset: "NEUTRAL", title: `📚 Інвестовано: ${t.name}`, message: t.description, lesson: "Справжній ROI від освіти завжди відкладений у часі.", isBlackSwan: false });
              setPhase("PLAYING");
            }} 
            className="w-full text-left p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-indigo-500/20 hover:border-indigo-500/50 transition-all backdrop-blur-md group shadow-sm"
          >
            <span className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors flex items-center gap-2"><span className="text-xl">{t.icon}</span> {t.name}</span>
            <p className="text-[10px] text-white/40 mt-2 leading-relaxed">{t.description}</p>
          </motion.button>
        ))}
      </motion.div>

      <motion.button 
        variants={slideUp}
        {...tapScale}
        onClick={() => setPhase("PLAYING")} 
        className="w-full py-4 text-xs font-bold tracking-widest uppercase text-white/30 hover:text-white/70 transition-colors"
      >
        Відмовитись (Змиритись із втратою)
      </motion.button>
    </motion.div>
  );
};
