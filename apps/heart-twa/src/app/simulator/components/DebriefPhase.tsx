import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Target, GraduationCap, Users } from "lucide-react";
import { PlayerState, createInitialPlayer } from "@/data/game-simulator/rules";
import { generateDebrief } from "@/data/game-simulator/debrief";
import { ScienceTracker, generateRevelation, createScienceTracker } from "@/data/game-simulator/scienceEasterEgg";
import { MultiplayerSession, generateEgoDistortionReports } from "@/data/game-simulator/multiplayerEngine";
import { OnboardingForm, createEmptyForm } from "@/data/game-simulator/gameFlow";
import { slideUp, staggerContainer, tapScale, slideInRight } from "./animations";

interface Props {
  player: PlayerState;
  scienceTracker: ScienceTracker;
  multiplayerSession: MultiplayerSession | null;
  setPhase: (p: any) => void;
  setPlayer: (p: any) => void;
  setStep: (s: number) => void;
  setForm: (f: any) => void;
  setScienceTracker: (s: any) => void;
  setMultiplayerSession: (m: any) => void;
  isNeuroMode: boolean;
}

export const DebriefPhase: React.FC<Props> = ({ 
  player, scienceTracker, multiplayerSession, 
  setPhase, setPlayer, setStep, setForm, setScienceTracker, setMultiplayerSession, 
  isNeuroMode 
}) => {
  const cls = (base: string) => `${base} ${isNeuroMode ? "text-lg leading-relaxed" : "text-sm"}`;
  
  const d = generateDebrief(player);
  const revelation = generateRevelation(scienceTracker);
  const egoReports = multiplayerSession ? generateEgoDistortionReports(multiplayerSession) : null;

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" exit="exit" className="space-y-8 pb-10">
      
      {/* Score Section */}
      <motion.div variants={slideUp} className="text-center">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1, rotate: 360 }}
          transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
        >
          <Target size={64} className="mx-auto text-[#00FF88] mb-4 drop-shadow-[0_0_15px_rgba(0,255,136,0.5)]" />
        </motion.div>
        <h2 className="text-3xl font-black uppercase tracking-widest bg-gradient-to-r from-white to-white/50 bg-clip-text text-transparent">{d.overallLabel}</h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-6xl font-black text-[#FF9500] mt-2 drop-shadow-[0_0_20px_rgba(255,149,0,0.3)]"
        >
          {d.overallScore}/100
        </motion.p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={slideUp} className="grid grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center backdrop-blur-md shadow-lg">
          <p className="text-[10px] text-white/40 uppercase tracking-widest font-mono">Networth</p>
          <p className="font-bold text-xl mt-1">${Math.floor(d.networth)}</p>
        </div>
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center backdrop-blur-md shadow-lg">
          <p className="text-[10px] text-white/40 uppercase tracking-widest font-mono">$/година</p>
          <p className="font-bold text-xl mt-1 text-[#00FF88]">${d.hourCostNow.toFixed(1)}</p>
        </div>
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center backdrop-blur-md shadow-lg">
          <p className="text-[10px] text-white/40 uppercase tracking-widest font-mono">Менталка</p>
          <p className="font-bold text-xl mt-1 text-[#FF9500]">{d.mentaEnergy}%</p>
        </div>
      </motion.div>

      {/* Mindset Composition */}
      <motion.div variants={slideUp} className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
        <p className="text-[10px] text-white/40 uppercase tracking-widest font-mono mb-4">Аналіз мислення</p>
        <div className="space-y-3">
          {d.mindsetPatterns.map((m, i) => (
            <div key={m.type} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-black/20 border border-white/5 text-lg shadow-inner">
                {m.type === "PROFICIT" ? "📈" : m.type === "DEFICIT" ? "📉" : "⚖️"}
              </div>
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <span className="text-xs font-bold text-white/90">{m.label}</span>
                  <span className="text-xs font-mono" style={{color: m.color}}>{m.percentage}%</span>
                </div>
                <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${m.percentage}%` }}
                    transition={{ duration: 1, delay: 0.5 + (i * 0.2) }}
                    className="h-full rounded-full" 
                    style={{background: m.color}} 
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Behavioral Insights */}
      <motion.div variants={staggerContainer} className="space-y-3">
        <p className="text-[10px] text-white/40 uppercase tracking-widest font-mono pl-1">Ключові Інсайти</p>
        {d.insights.slice(0,3).map((ins, i) => (
          <motion.div 
            key={i} 
            variants={slideInRight}
            className={`p-5 rounded-2xl border backdrop-blur-md ${ins.severity === "critical" ? "bg-red-500/10 border-red-500/30" : ins.severity === "warning" ? "bg-[#FF9500]/10 border-[#FF9500]/30" : "bg-[#00FF88]/10 border-[#00FF88]/30"}`}
          >
            <p className="text-sm font-bold mb-2 uppercase">{ins.title}</p>
            <p className={cls("text-white/80 mb-3")}>{ins.observation}</p>
            {ins.proficitReframe && (
              <div className="mt-3 p-3 bg-black/20 rounded-xl border border-white/5">
                <p className="text-[10px] text-[#00FF88] uppercase tracking-widest mb-1">💡 Профіцитний Рефреймінг</p>
                <p className="text-xs text-white/90 italic">{ins.proficitReframe}</p>
              </div>
            )}
          </motion.div>
        ))}
      </motion.div>

      {/* ═══ SCIENCE EASTER EGG REVELATION ═══ */}
      <AnimatePresence>
        {revelation && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="p-6 rounded-2xl bg-gradient-to-br from-indigo-900/40 via-purple-900/20 to-black border border-indigo-500/40 shadow-[0_0_50px_rgba(99,102,241,0.2)] relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px]" />
            <GraduationCap size={40} className="text-indigo-400 mb-4" />
            <h3 className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300 uppercase tracking-widest mb-4">🔓 Прихована Механіка Розкрита</h3>
            
            <div className="grid grid-cols-2 gap-3 mb-5 relative z-10">
              <div className="p-4 rounded-xl bg-black/40 border border-white/5 text-center">
                <p className="text-[9px] text-white/40 uppercase tracking-widest mb-1">Збитків конвертовано</p>
                <p className="font-mono text-lg text-indigo-300">${Math.floor(revelation.totalInvested)}</p>
              </div>
              <div className="p-4 rounded-xl bg-black/40 border border-white/5 text-center">
                <p className="text-[9px] text-white/40 uppercase tracking-widest mb-1">Інтелектуальний ROI</p>
                <p className="font-mono text-lg text-[#00FF88]">${Math.floor(revelation.totalReturned)}</p>
              </div>
            </div>
            
            <div className="mb-5 relative z-10">
              <div className="flex justify-between items-end mb-2">
                <p className="text-[10px] text-indigo-300/70 uppercase font-mono tracking-widest">Трек Впевненості</p>
                <p className="text-xs font-bold text-indigo-300">{revelation.confidenceLevel}%</p>
              </div>
              <div className="w-full bg-black/50 rounded-full h-2 overflow-hidden shadow-inner">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${revelation.confidenceLevel}%` }}
                  transition={{ duration: 1.5, delay: 1.5 }}
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-400 relative" 
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse" />
                </motion.div>
              </div>
            </div>

            <p className={cls("text-indigo-100/90 mb-4 relative z-10 leading-relaxed")}>{revelation.patternMessage}</p>
            
            <div className="p-4 bg-indigo-950/50 rounded-xl border border-indigo-500/20 relative z-10">
              <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" /> Життєвий Цикл
              </p>
              <p className="text-xs text-indigo-200/80 leading-relaxed">{revelation.lifecycleInsight}</p>
            </div>
            
            {revelation.investedTopics.length > 0 && (
              <div className="flex gap-2 mt-4 flex-wrap relative z-10">
                {revelation.investedTopics.map(t => <span key={t} className="px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-[10px] text-indigo-300 font-mono">{t}</span>)}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ MULTIPLAYER DEBRIEF: EGO DISTORTIONS ═══ */}
      {egoReports && (
        <motion.div variants={staggerContainer} className="space-y-4 pt-4">
          <div className="text-center mb-8">
            <Users size={40} className="mx-auto text-amber-400 mb-3" />
            <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500 uppercase tracking-widest">Аналіз Команди</h3>
            <p className="text-xs text-amber-200/50 mt-1">Приховані мотивації та викривлення реальності</p>
          </div>
          
          {egoReports.map((report, idx) => (
            <motion.div 
              variants={slideUp}
              key={report.playerId} 
              className={`p-6 rounded-2xl border backdrop-blur-md relative overflow-hidden ${idx === 0 ? "bg-[#00FF88]/5 border-[#00FF88]/30 shadow-[0_0_30px_rgba(0,255,136,0.1)]" : "bg-black/40 border-white/10"}`}
            >
              {idx === 0 && <div className="absolute top-0 right-0 px-3 py-1 bg-[#00FF88]/20 text-[#00FF88] text-[9px] uppercase tracking-widest font-mono rounded-bl-lg">Це Ви</div>}
              
              <div className="flex items-start gap-4 mb-5">
                <div className="text-4xl">{report.revealedMotivation.icon}</div>
                <div>
                  <p className="font-black text-lg text-white">{report.playerName}</p>
                  <p className="text-[10px] text-amber-400 font-mono bg-amber-500/10 px-2 py-0.5 rounded inline-block mt-1">Справжня мотивація: {report.revealedMotivation.label}</p>
                </div>
              </div>
              
              <div className="mb-4 p-4 rounded-xl bg-white/5 border border-white/5">
                <p className="text-[9px] text-white/40 uppercase tracking-widest mb-2 flex items-center gap-1"><span className="w-1.5 h-1.5 bg-white/40 rounded-full"/> Що декларувалось публічно:</p>
                <p className="text-sm text-white/80 italic">"{report.statedMotivation}"</p>
                
                <div className="mt-4 pt-3 border-t border-white/10">
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-[9px] text-white/40 uppercase tracking-widest">Індекс відкритості</p>
                    <p className="text-[10px] font-mono text-white/60">{100 - report.gapScore}%</p>
                  </div>
                  <div className="w-full h-1.5 bg-black/50 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${100 - report.gapScore}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="h-full transition-colors" 
                      style={{ background: report.gapScore > 50 ? "#FF4444" : "#00FF88" }} 
                    />
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-[10px] text-white/40 uppercase tracking-widest mb-3">Як це викривляло реальність:</p>
                <ul className="space-y-2">
                  {report.keyDistortions.map((d, i) => (
                    <li key={i} className="text-xs text-white/70 flex items-start gap-2 bg-black/20 p-2.5 rounded-lg border border-white/5">
                      <span className="text-amber-500 mt-0.5 text-[10px]">⚠️</span> 
                      <span className="leading-relaxed">{d}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {idx === 0 && report.compatibilityWith.length > 0 && (
                <div className="mt-5 pt-5 border-t border-white/10">
                  <p className="text-[10px] text-white/40 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Users size={12}/> Сумісність з партнерами
                  </p>
                  <div className="space-y-3">
                    {report.compatibilityWith.map(comp => {
                      const partnerName = multiplayerSession?.players.find(p => p.id === comp.partnerId)?.name;
                      const compColor = comp.score > 60 ? "#00FF88" : comp.score > 30 ? "#FF9500" : "#FF4444";
                      return (
                        <div key={comp.partnerId} className="p-3 bg-white/5 rounded-xl border border-white/5">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-bold text-white/90">{partnerName}</span>
                            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded" style={{color: compColor, backgroundColor: `${compColor}20`}}>{comp.score}%</span>
                          </div>
                          <p className="text-[10px] text-white/60 leading-relaxed border-l-2 pl-2" style={{borderColor: compColor}}>{comp.insight}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      )}

      <motion.button 
        variants={slideUp}
        {...tapScale}
        onClick={() => { 
          setPhase("ONBOARDING"); 
          setPlayer(createInitialPlayer("Гравець")); 
          setStep(0); 
          setForm(createEmptyForm()); 
          setScienceTracker(createScienceTracker()); 
          setMultiplayerSession(null); 
        }} 
        className="w-full py-5 bg-gradient-to-r from-[#00FF88] to-[#00CC6A] text-black font-black uppercase tracking-widest rounded-2xl shadow-[0_0_30px_rgba(0,255,136,0.3)] hover:shadow-[0_0_40px_rgba(0,255,136,0.5)] transition-shadow mt-8"
      >
        Нова Гра
      </motion.button>
    </motion.div>
  );
};
