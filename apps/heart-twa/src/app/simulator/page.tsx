"use client";
import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { createInitialPlayer, PlayerState, FundingType, calculateCurrentNetworth, getMindsetFromBanks } from "@/data/game-simulator/rules";
import { ActionResult } from "@/data/game-simulator/assetNodes";
import { GAME_STEPS, OnboardingForm, createEmptyForm, getRandomPuzzle, LogicPuzzle } from "@/data/game-simulator/gameFlow";
import { rollMonthlyEvents, applyCipollaCategory } from "@/data/game-simulator/blackSwans";
import { createScienceTracker, ScienceTracker } from "@/data/game-simulator/scienceEasterEgg";
import { useOfflineState } from "@/data/game-simulator/offlineStorage";
import { MultiplayerSession, VOTING_TOPICS } from "@/data/game-simulator/multiplayerEngine";

// Components
import { HUD } from "./components/HUD";
import { OnboardingPhase } from "./components/OnboardingPhase";
import { FundingPhase } from "./components/FundingPhase";
import { PlayingPhase } from "./components/PlayingPhase";
import { TeamVotePhase } from "./components/TeamVotePhase";
import { EventPhase } from "./components/EventPhase";
import { PuzzlePhase } from "./components/PuzzlePhase";
import { DebriefPhase } from "./components/DebriefPhase";
import { SciencePickPhase } from "./components/SciencePickPhase";

type Phase = "ONBOARDING" | "FUNDING" | "PLAYING" | "TEAM_VOTE" | "EVENT" | "PUZZLE" | "SCIENCE_PICK" | "DEBRIEF";

export default function SimulatorPage() {
  const [phase, setPhase] = useOfflineState<Phase>("proficit_phase", "ONBOARDING");
  const [form, setForm] = useOfflineState<OnboardingForm & { teamSize?: number }>("proficit_form", createEmptyForm());
  const [player, setPlayer] = useOfflineState<PlayerState>("proficit_player", createInitialPlayer("Гравець"));
  const [step, setStep] = useOfflineState<number>("proficit_step", 0);
  const [scienceTracker, setScienceTracker] = useOfflineState<ScienceTracker>("proficit_science", createScienceTracker());
  const [multiplayerSession, setMultiplayerSession] = useOfflineState<MultiplayerSession | null>("proficit_multiplayer", null);
  
  const [lastResult, setLastResult] = useState<ActionResult | null>(null);
  const [pendingPuzzle, setPendingPuzzle] = useState<LogicPuzzle | null>(null);
  const [isNeuroMode, setIsNeuroMode] = useState(false);
  const [pendingLoss, setPendingLoss] = useState<number>(0);

  const applyResult = (r: ActionResult) => {
    setPlayer(p => ({
      ...p,
      banks: {
        ...p.banks,
        FINANCIAL: { ...p.banks.FINANCIAL, balance: Math.max(0, p.banks.FINANCIAL.balance + r.financialDelta) },
        MENTAL: { ...p.banks.MENTAL, balance: Math.max(0, Math.min(100, p.banks.MENTAL.balance + r.mentalDelta)) },
        SOCIAL: { ...p.banks.SOCIAL, balance: Math.max(0, Math.min(100, p.banks.SOCIAL.balance + r.socialDelta)) },
      },
      actionLog: [...p.actionLog, { month: p.month, action: r.title, financialDelta: r.financialDelta, mentalDelta: r.mentalDelta, socialDelta: r.socialDelta, mindset: r.mindset, lesson: r.lesson }],
    }));
    setLastResult(r);
    if (r.isBlackSwan) {
      setPendingPuzzle(getRandomPuzzle());
      setPhase("PUZZLE");
    }
  };

  const nextStep = () => {
    if (step >= 12) { setPhase("DEBRIEF"); return; }
    const nextS = step + 1;
    setStep(nextS);
    setLastResult(null);
    setPlayer(p => ({ ...p, month: p.month + 1 }));

    // Check for multiplayer vote
    if (multiplayerSession) {
      const voteTopic = VOTING_TOPICS.find(t => t.step === nextS);
      if (voteTopic) {
        setPhase("TEAM_VOTE");
        return; // Pause here for the vote
      }
    }

    const events = rollMonthlyEvents(player);
    if (events.npcEvent) {
      const e = events.npcEvent;
      const canMitigate = player.awarenessLevel >= e.awarenessRequiredToAvoid && e.mitigatedOutcome;
      const impact = canMitigate ? e.mitigatedOutcome! : e;
      applyResult({
        financialDelta: (canMitigate ? impact.financialImpactMultiplier : e.financialImpactMultiplier) * player.banks.FINANCIAL.balance,
        mentalDelta: canMitigate ? impact.mentalImpact : e.mentalImpact,
        socialDelta: e.socialImpact,
        mindset: e.category === "STUPID" || e.category === "BANDIT" ? "DEFICIT" : "PROFICIT",
        title: `${applyCipollaCategory(e.category)}: ${e.title}`,
        message: canMitigate ? (impact as any).message : e.description,
        lesson: e.lesson,
        isBlackSwan: e.category === "STUPID",
      });
      setPhase("EVENT");
    }
  };

  return (
    <div className={`min-h-screen bg-[#0D0F12] text-[#F5F5F0] p-5 pb-24 font-sans selection:bg-[#00FF88]/30 ${isNeuroMode ? "tracking-wide" : ""}`}>
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-96 h-96 bg-[#00FF88]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-80 h-80 bg-indigo-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-lg mx-auto">
        {/* Header & Neuro Toggle */}
        <div className="flex justify-between items-center mb-6">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-black tracking-tighter bg-gradient-to-r from-[#00FF88] to-[#FF9500] bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(0,255,136,0.2)]"
          >
            PROFICIT
          </motion.h1>
          <motion.button 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsNeuroMode(!isNeuroMode)} 
            className={`px-3 py-1.5 rounded-full text-[10px] font-mono uppercase tracking-widest border transition-all backdrop-blur-md ${isNeuroMode ? "bg-amber-500/20 border-amber-500/50 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]" : "bg-white/5 border-white/10 text-white/40"}`}
          >
            {isNeuroMode ? "🧠 РДУГ ON" : "РДУГ"}
          </motion.button>
        </div>

        {/* Step indicator */}
        <AnimatePresence>
          {phase !== "ONBOARDING" && phase !== "DEBRIEF" && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 overflow-hidden"
            >
              <div className="flex items-center gap-1 mb-2">
                {GAME_STEPS.map((s, i) => (
                  <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${i < step ? "bg-[#00FF88]" : i === step ? "bg-[#FF9500] shadow-[0_0_10px_rgba(255,149,0,0.5)]" : "bg-white/10"}`} />
                ))}
              </div>
              <p className="text-[10px] text-white/40 font-mono tracking-widest uppercase">Місяць {step + 1}/13: <span className="text-white/80">{GAME_STEPS[step]?.title}</span></p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* HUD */}
        <AnimatePresence>
          {phase !== "ONBOARDING" && <HUD player={player} isNeuroMode={isNeuroMode} />}
        </AnimatePresence>

        {/* Phase Router */}
        <AnimatePresence mode="wait">
          {phase === "ONBOARDING" && (
            <OnboardingPhase key="onb" form={form} setForm={setForm} isNeuroMode={isNeuroMode} onStart={() => {
              const size = form.teamSize || 1;
              if (size > 1) {
                // Initialized in OnboardingPhase, but handled here to sync properly.
                // Wait, the logic is in OnboardingPhase? No, OnboardingPhase just triggers onStart.
                import("@/data/game-simulator/multiplayerEngine").then(({ generateRandomPartner }) => {
                  const players = [generateRandomPartner("p1", "Ви (СЕО)", 100/size)];
                  for (let i = 2; i <= size; i++) players.push(generateRandomPartner(`p${i}`, `Партнер ${i}`, 100/size));
                  setMultiplayerSession({
                    sessionId: `sess_${Date.now()}`,
                    players,
                    sharedCompany: { name: form.niche, direction: form.direction as any, niche: form.niche, totalValuation: form.financialGoal, month: 1 },
                    votingHistory: [],
                    isDebriefReady: false
                  });
                });
              } else {
                setMultiplayerSession(null);
              }
              setPlayer(p => ({...p, goalCostUSD: form.financialGoal, goalDescription: form.personalGoal})); 
              setPhase("FUNDING"); 
            }} />
          )}

          {phase === "FUNDING" && (
            <FundingPhase key="fun" isNeuroMode={isNeuroMode} onTakeFunding={(type) => {
              import("@/data/game-simulator/rules").then(({ FUNDING_INSTRUMENTS }) => {
                const f = FUNDING_INSTRUMENTS[type];
                setPlayer(p => ({
                  ...p,
                  banks: {
                    ...p.banks,
                    FINANCIAL: { ...p.banks.FINANCIAL, balance: p.banks.FINANCIAL.balance + f.availableAmount },
                    MENTAL: { ...p.banks.MENTAL, balance: Math.max(0, p.banks.MENTAL.balance - f.upfrontMentalCost) },
                  },
                  monthlyDebts: f.monthlyInterestRate > 0 ? [...p.monthlyDebts, {
                    source: type, originalAmount: f.availableAmount, remainingAmount: f.availableAmount,
                    monthlyPayment: f.availableAmount * (f.monthlyInterestRate / 100), monthlyMentalCost: f.monthlyMentalCost, monthsRemaining: 24,
                  }] : p.monthlyDebts,
                }));
                setPhase("PLAYING");
              });
            }} />
          )}

          {phase === "PLAYING" && (
            <PlayingPhase key="play" player={player} lastResult={lastResult} applyResult={applyResult} setPlayer={setPlayer} nextStep={nextStep} isNeuroMode={isNeuroMode} onSciencePick={(loss) => { setPendingLoss(loss); setPhase("SCIENCE_PICK"); }} />
          )}

          {phase === "TEAM_VOTE" && multiplayerSession && (
            <TeamVotePhase key="vote" isNeuroMode={isNeuroMode} cash={player.banks.FINANCIAL.balance} multiplayerSession={multiplayerSession} setMultiplayerSession={setMultiplayerSession} applyResult={applyResult} setPhase={setPhase} step={step} topic={VOTING_TOPICS.find(t => t.step === step)!} />
          )}

          {phase === "EVENT" && (
            <EventPhase key="evt" lastResult={lastResult} setPhase={setPhase} isNeuroMode={isNeuroMode} />
          )}

          {phase === "PUZZLE" && pendingPuzzle && (
            <PuzzlePhase key="puz" puzzle={pendingPuzzle} lastResult={lastResult} applyResult={applyResult} setPendingPuzzle={setPendingPuzzle} setPhase={setPhase} isNeuroMode={isNeuroMode} />
          )}

          {phase === "SCIENCE_PICK" && (
            <SciencePickPhase key="sci" isNeuroMode={isNeuroMode} pendingLoss={pendingLoss} player={player} setScienceTracker={setScienceTracker} setPlayer={setPlayer} setLastResult={setLastResult} setPhase={setPhase} />
          )}

          {phase === "DEBRIEF" && (
            <DebriefPhase key="deb" isNeuroMode={isNeuroMode} player={player} scienceTracker={scienceTracker} multiplayerSession={multiplayerSession} setPhase={setPhase} setPlayer={setPlayer} setStep={setStep} setForm={setForm} setScienceTracker={setScienceTracker} setMultiplayerSession={setMultiplayerSession} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
