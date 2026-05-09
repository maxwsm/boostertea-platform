import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Scale, ChevronDown, ChevronUp } from "lucide-react";
import { CIPOLLA_SCALE_CASES } from "@/data/game-simulator/cipollaScaleMatrix";
import { ActionResult } from "@/data/game-simulator/assetNodes";
import { slideUp, staggerContainer, tapScale } from "./animations";

interface Props {
  lastResult: ActionResult | null;
  setPhase: (p: any) => void;
  isNeuroMode: boolean;
}

export const EventPhase: React.FC<Props> = ({ lastResult, setPhase, isNeuroMode }) => {
  const cls = (base: string) => `${base} ${isNeuroMode ? "text-lg leading-relaxed" : "text-sm"}`;
  const [scale] = useState(() => CIPOLLA_SCALE_CASES[Math.floor(Math.random() * CIPOLLA_SCALE_CASES.length)]);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  if (!lastResult) return null;

  const isStupid = lastResult.mindset === "DEFICIT" && lastResult.title.includes("Дурні");
  const eventColor = isStupid ? "red" : lastResult.mindset === "PROFICIT" ? "green" : "amber";
  const eventBg = isStupid ? "bg-red-500/10 border-red-500/30 shadow-[0_0_30px_rgba(239,68,68,0.15)]" : 
                  lastResult.mindset === "PROFICIT" ? "bg-green-500/10 border-green-500/30 shadow-[0_0_30px_rgba(34,197,94,0.15)]" : 
                  "bg-amber-500/10 border-amber-500/30 shadow-[0_0_30px_rgba(245,158,11,0.15)]";

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" exit="exit" className="space-y-6">
      
      {/* Event Reveal */}
      <motion.div 
        variants={slideUp} 
        animate={isStupid ? { x: [-5, 5, -5, 5, 0], transition: { duration: 0.4 } } : {}}
        className={`p-6 rounded-2xl border backdrop-blur-xl ${eventBg}`}
      >
        <AlertTriangle className={`text-${eventColor}-500 mb-3`} size={32} />
        <p className="font-black text-xl text-white mb-2">{lastResult.title}</p>
        <p className={cls("text-white/80 mb-4")}>{lastResult.message}</p>
        <div className="bg-black/20 p-3 rounded-xl border border-white/5">
          <p className="text-[10px] text-white/40 uppercase tracking-widest font-mono mb-1">💡 Урок</p>
          <p className="text-xs text-white/70 italic">{lastResult.lesson}</p>
        </div>
      </motion.div>

      {/* 3-Scale Cipolla Comparison */}
      <motion.div variants={slideUp} className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
        <div className="flex items-center gap-2 mb-4">
          <Scale size={16} className="text-amber-400" />
          <p className="text-[10px] text-amber-400 uppercase font-mono tracking-widest">Ця ж помилка на 3 масштабах</p>
        </div>
        
        <p className="text-sm font-black text-white mb-4">{scale.patternName}</p>
        
        <div className="space-y-2">
          {([scale.scales.small, scale.scales.medium, scale.scales.large] as const).map((s, i) => {
            const isExpanded = expandedIndex === i;
            const levelColor = i === 0 ? 'text-green-400 bg-green-500/10 border-green-500/20' : 
                               i === 1 ? 'text-amber-400 bg-amber-500/10 border-amber-500/20' : 
                               'text-red-400 bg-red-500/10 border-red-500/20';
            return (
              <motion.div key={i} layout className="border border-white/5 rounded-xl overflow-hidden bg-black/20">
                <button 
                  onClick={() => setExpandedIndex(isExpanded ? null : i)}
                  className="w-full flex items-center justify-between p-3"
                >
                  <div className="flex items-center gap-3">
                    <span className={`text-[9px] font-mono px-2 py-1 rounded border ${levelColor}`}>
                      {s.level}
                    </span>
                    <span className="text-xs font-bold text-white/90">{s.realEntity}</span>
                  </div>
                  {isExpanded ? <ChevronUp size={14} className="text-white/40"/> : <ChevronDown size={14} className="text-white/40"/>}
                </button>
                
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-3 pb-3 pt-1"
                    >
                      <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                        <p className="text-[10px] text-white/50 mb-1">Рік: {s.year} | Втрати: <span className="text-red-400 font-mono">{s.loss}</span></p>
                        <p className="text-xs text-white/70 leading-relaxed">{s.description}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
        
        <div className="mt-5 pt-4 border-t border-white/10">
          <p className="text-[10px] text-amber-400/80 italic text-center">"{scale.cipollaPrinciple}"</p>
        </div>
      </motion.div>

      <motion.button 
        variants={slideUp}
        {...tapScale}
        onClick={() => setPhase("PLAYING")} 
        className="w-full py-4 bg-white/10 text-white font-bold tracking-widest uppercase rounded-xl hover:bg-white/15 transition-all"
      >
        Зрозумів, далі →
      </motion.button>
    </motion.div>
  );
};
