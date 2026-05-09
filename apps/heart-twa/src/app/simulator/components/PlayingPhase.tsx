import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlayerState } from "@/data/game-simulator/rules";
import { DESIRE_ACTIONS, ActionResult, processDesireAction } from "@/data/game-simulator/assetNodes";
import { getMonthlyProfit, BUSINESS_MODELS, BusinessModel } from "@/data/game-simulator/businesses";
import { slideUp, staggerContainer, tapScale } from "./animations";

interface Props {
  player: PlayerState;
  lastResult: ActionResult | null;
  applyResult: (r: ActionResult) => void;
  setPlayer: React.Dispatch<React.SetStateAction<PlayerState>>;
  nextStep: () => void;
  onSciencePick: (loss: number) => void;
  isNeuroMode: boolean;
}

export const PlayingPhase: React.FC<Props> = ({ player, lastResult, applyResult, setPlayer, nextStep, onSciencePick, isNeuroMode }) => {
  const cls = (base: string) => `${base} ${isNeuroMode ? "text-lg leading-relaxed" : "text-sm"}`;
  const cash = player.banks.FINANCIAL.balance;

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" exit="exit" className="space-y-4">
      
      <AnimatePresence mode="popLayout">
        {lastResult && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`p-5 rounded-2xl border backdrop-blur-md shadow-lg ${
              lastResult.mindset === "PROFICIT" ? "bg-[#00FF88]/10 border-[#00FF88]/30 shadow-[0_0_20px_rgba(0,255,136,0.15)]" : 
              lastResult.mindset === "DEFICIT" ? "bg-[#FF4444]/10 border-[#FF4444]/30 shadow-[0_0_20px_rgba(255,68,68,0.15)]" : 
              "bg-[#FF9500]/10 border-[#FF9500]/30 shadow-[0_0_20px_rgba(255,149,0,0.15)]"
            }`}
          >
            <p className="text-sm font-black tracking-wide mb-2 uppercase">{lastResult.title}</p>
            <p className={cls("text-white/80 mb-3")}>{lastResult.message}</p>
            <div className="flex gap-3 text-xs font-mono bg-black/20 inline-flex p-2 rounded-lg">
              <span style={{color: lastResult.financialDelta >= 0 ? "#00FF88" : "#FF4444"}}>${lastResult.financialDelta >= 0 ? "+" : ""}{Math.floor(lastResult.financialDelta)}</span>
              <span style={{color: lastResult.mentalDelta >= 0 ? "#00FF88" : "#FF4444"}}>🧠 {lastResult.mentalDelta >= 0 ? "+" : ""}{lastResult.mentalDelta}</span>
            </div>
            {lastResult.lesson && <p className="mt-3 text-[10px] text-white/50 italic border-t border-white/10 pt-3">💡 {lastResult.lesson}</p>}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.h3 variants={slideUp} className="text-[10px] text-white/40 uppercase font-mono tracking-widest mt-6">Доступні Дії</motion.h3>
      
      {/* Desires */}
      <motion.div variants={staggerContainer} className="space-y-2">

      {/* Correct Action mapping */}
      {DESIRE_ACTIONS.slice(0,2).map(d => (
        <motion.button 
          variants={slideUp}
          {...tapScale}
          key={d.id} 
          onClick={() => {
            applyResult(processDesireAction(d, player));
          }} 
          className="w-full text-left p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all backdrop-blur-md flex justify-between items-center group"
        >
          <span className="text-sm font-bold text-white/90 group-hover:text-white transition-colors">{d.label}</span>
          <span className="text-[10px] font-mono text-[#FF4444] bg-[#FF4444]/10 px-2 py-1 rounded">-${d.cost}</span>
        </motion.button>
      ))}
      </motion.div>

      {/* Business Investments */}
      {BUSINESS_MODELS.slice(0,2).map((b: BusinessModel) => (
        <motion.button 
          variants={slideUp}
          {...tapScale}
          key={b.id} 
          onClick={() => {
            const profit = getMonthlyProfit(b, 80);
            applyResult({ financialDelta: -b.minInvestmentUSD, mentalDelta: -10, socialDelta: 5, mindset: player.awarenessLevel >= 5 ? "PROFICIT" : "NEUTRAL", title: `Інвестиція: ${b.name}`, message: `Ти придбав ${b.name}. Очікуваний profit: $${Math.floor(profit)}/міс.`, lesson: b.mainRisks[0], isBlackSwan: false });
            setPlayer(p => ({...p, ownedAssets: [...p.ownedAssets, { businessId: b.id, purchasePrice: b.minInvestmentUSD, monthlyRevenue: b.monthlyRevenue.reduce((s: number, r: any) => s + r.monthlyUSD, 0), monthlyExpenses: b.monthlyFixedCosts.reduce((s: number, c: any) => s + (c.monthlyUSD||0), 0), healthScore: 80 }]}));
          }} 
          disabled={cash < b.minInvestmentUSD} 
          className="w-full text-left p-4 rounded-xl bg-gradient-to-r from-white/5 to-transparent border border-white/10 hover:border-white/20 transition-all backdrop-blur-md disabled:opacity-30 flex justify-between items-center group"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all">{b.icon}</span>
            <span className="text-sm font-bold text-white/90 group-hover:text-white transition-colors">{b.name}</span>
          </div>
          <span className="text-[10px] font-mono text-white/40 bg-white/5 px-2 py-1 rounded group-hover:text-[#FF9500] group-hover:bg-[#FF9500]/10 transition-all">-${b.minInvestmentUSD}</span>
        </motion.button>
      ))}

      {/* HIDDEN: Science button */}
      <AnimatePresence>
        {lastResult && lastResult.financialDelta < 0 && (
          <motion.button 
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: "auto", marginTop: 16 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            {...tapScale}
            onClick={() => onSciencePick(Math.abs(lastResult.financialDelta))} 
            className="w-full overflow-hidden text-left p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/30 hover:bg-indigo-500/20 transition-all backdrop-blur-md flex justify-between items-center shadow-[0_0_20px_rgba(99,102,241,0.1)] group"
          >
            <span className="text-sm font-bold text-indigo-300 flex items-center gap-2 group-hover:text-indigo-200"><span className="text-lg">📚</span> Вкласти збиток в науку</span>
            <span className="text-[10px] font-mono text-indigo-400/50 uppercase tracking-widest">Ефект Прихований</span>
          </motion.button>
        )}
      </AnimatePresence>

      <motion.button 
        variants={slideUp}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={nextStep} 
        className="w-full py-5 mt-6 bg-gradient-to-r from-[#FF9500] to-[#FFB03A] text-black font-black uppercase tracking-widest rounded-xl transition-all shadow-[0_0_20px_rgba(255,149,0,0.3)] hover:shadow-[0_0_30px_rgba(255,149,0,0.5)]"
      >
        Наступний Місяць →
      </motion.button>
    </motion.div>
  );
};
