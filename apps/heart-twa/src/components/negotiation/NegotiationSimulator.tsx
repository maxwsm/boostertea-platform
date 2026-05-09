"use client";

/**
 * NEGOTIATION SIMULATOR (War Room)
 * 
 * Visual battlefield with up to 4 opponents.
 * Each has a shadow profile, probability analysis,
 * and influence connections to others.
 */

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Swords, ChevronLeft, Plus } from "lucide-react";
import { ShadowIcon, SHADOW_ACCENT_COLORS } from "@/components/ui/ShadowIcons";
import { ParticipantCard } from "./ParticipantCard";
import { InfluenceMatrix } from "./InfluenceMatrix";
import {
  calculateShadowProbability,
  calculateInfluenceMatrix,
  type ParticipantProfile,
  type NegotiationContext,
  type ShadowProbabilityResult,
  type InfluenceEdge,
} from "@/data/game-simulator/shadowProbability";
import { NEGOTIATION_SCENARIOS } from "@/data/game-simulator/negotiations";

interface NegotiationSimulatorProps {
  isAdhdMode: boolean;
  onBack: () => void;
}

// Demo data — converts existing scenarios to new format
function convertToParticipants(scenario: typeof NEGOTIATION_SCENARIOS[0]): ParticipantProfile[] {
  const cp = scenario.counterparty;
  return [
    {
      name: cp.name,
      role: cp.type === "CLIENT" ? "Клієнт" : cp.type === "PARTNER" ? "Партнер" : cp.type === "SUPPLIER" ? "Постачальник" : cp.type === "INVESTOR" ? "Інвестор" : "Працівник",
      visualCues: cp.pressurePoints.map(p => `Тисне через: ${p}`),
      socialFacts: [scenario.realCase.split(".")[0]],
      knownBehavior: `Стиль: ${cp.negotiationStyle}. Прихована ціль: ${cp.hiddenGoal}`,
      dominantShadow: cp.negotiationStyle === "AGGRESSIVE" ? "aggressor" :
        cp.negotiationStyle === "MANIPULATIVE" ? "manipulator" :
        cp.negotiationStyle === "PASSIVE_AGGRESSIVE" ? "victim" : "perfectionist",
      avgSleep: 6,
      comfortFinancialThreshold: scenario.stakes.financial,
    },
  ];
}

export function NegotiationSimulator({ isAdhdMode, onBack }: NegotiationSimulatorProps) {
  const [activeScenarioIdx, setActiveScenarioIdx] = useState(0);
  const [selectedParticipant, setSelectedParticipant] = useState<string | null>(null);

  const scenario = NEGOTIATION_SCENARIOS[activeScenarioIdx];
  const participants = useMemo(() => convertToParticipants(scenario), [scenario]);
  
  // Add "YOU" as participant
  const allParticipants: ParticipantProfile[] = useMemo(() => [
    {
      name: "ВИ",
      role: "Головний учасник",
      visualCues: [],
      socialFacts: [],
      knownBehavior: "",
      dominantShadow: "perfectionist",
      avgSleep: 7,
      comfortFinancialThreshold: 5000,
    },
    ...participants,
  ], [participants]);

  const context: NegotiationContext = useMemo(() => ({
    stakes: scenario.stakes.financial,
    hasTimePressure: true,
    hasAuthorityFigure: false,
    isLowStakes: scenario.stakes.financial < 1000,
    emotionalCharge: Math.abs(scenario.stakes.mental) * 2,
  }), [scenario]);

  // Calculate probabilities for all participants
  const probabilities = useMemo<Map<string, ShadowProbabilityResult>>(() => {
    const map = new Map();
    allParticipants.forEach((p) => {
      map.set(p.name, calculateShadowProbability(p, context));
    });
    return map;
  }, [allParticipants, context]);

  // Calculate influence matrix
  const influenceEdges = useMemo<InfluenceEdge[]>(
    () => calculateInfluenceMatrix(allParticipants, context),
    [allParticipants, context]
  );

  const selectedPart = allParticipants.find((p) => p.name === selectedParticipant);
  const selectedProb = selectedParticipant ? probabilities.get(selectedParticipant) : undefined;
  const selectedInfluences = selectedParticipant
    ? influenceEdges.filter((e) => e.from === selectedParticipant)
    : [];

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center px-4 pt-4 pb-48">
      {/* Header */}
      <div className="w-full flex items-center justify-between mb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-oatmeal/40 hover:text-oatmeal text-xs font-mono uppercase tracking-widest transition-colors"
        >
          <ChevronLeft size={14} /> Вихід
        </button>
        <div className="flex items-center gap-2">
          <Swords size={14} className="text-red-400" />
          <span className="text-[10px] font-mono text-oatmeal/40 uppercase tracking-widest">
            Переговори {activeScenarioIdx + 1}/{NEGOTIATION_SCENARIOS.length}
          </span>
        </div>
      </div>

      {/* Scenario Title */}
      <div className="w-full p-4 rounded-[18px] bg-red-500/5 border border-red-500/15 mb-4">
        <h2 className={`text-oatmeal font-bold mb-1.5 ${isAdhdMode ? "text-lg" : "text-base"}`}>
          {scenario.title}
        </h2>
        <p className={`text-oatmeal/70 leading-relaxed ${isAdhdMode ? "text-sm" : "text-xs"}`}>
          {scenario.context}
        </p>
      </div>

      {/* Participants Arena */}
      <div className="w-full relative min-h-[200px] my-4">
        {/* Center node = YOU */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <ParticipantNode
            participant={allParticipants[0]}
            probability={probabilities.get("ВИ")!}
            onClick={() => setSelectedParticipant("ВИ")}
            isCenter
          />
        </div>

        {/* Opponent nodes */}
        {participants.map((p, i) => {
          const angle = (i * (2 * Math.PI)) / Math.max(participants.length, 1) - Math.PI / 2;
          const radius = 80;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;

          return (
            <div
              key={p.name}
              className="absolute left-1/2 top-1/2"
              style={{ transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))` }}
            >
              <ParticipantNode
                participant={p}
                probability={probabilities.get(p.name)!}
                onClick={() => setSelectedParticipant(p.name)}
              />
            </div>
          );
        })}

        {/* Influence lines (SVG overlay) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ left: "50%", top: "50%", transform: "translate(-50%, -50%)", width: "200%", height: "200%" }}>
          {influenceEdges.slice(0, 6).map((edge, i) => {
            const fromIdx = allParticipants.findIndex((p) => p.name === edge.from);
            const toIdx = allParticipants.findIndex((p) => p.name === edge.to);
            if (fromIdx < 0 || toIdx < 0) return null;

            // Simple line positioning
            const getPos = (idx: number) => {
              if (idx === 0) return { x: 50, y: 50 }; // center
              const angle = ((idx - 1) * (2 * Math.PI)) / Math.max(participants.length, 1) - Math.PI / 2;
              return {
                x: 50 + Math.cos(angle) * 20,
                y: 50 + Math.sin(angle) * 20,
              };
            };

            const from = getPos(fromIdx);
            const to = getPos(toIdx);

            const isAggressive = edge.type === "ДОМІНУВАННЯ" || edge.type === "МАНІПУЛЯЦІЯ";

            return (
              <line
                key={i}
                x1={`${from.x}%`}
                y1={`${from.y}%`}
                x2={`${to.x}%`}
                y2={`${to.y}%`}
                stroke={isAggressive ? "rgba(239,68,68,0.3)" : "rgba(106,156,187,0.2)"}
                strokeWidth={Math.max(1, edge.strength / 30)}
                strokeDasharray={edge.type === "ІГНОРУВАННЯ" ? "4 4" : "none"}
              />
            );
          })}
        </svg>
      </div>

      <p className="text-[9px] text-oatmeal/30 font-mono text-center mb-4">
        Натисніть на учасника для деталей
      </p>

      {/* Influence Matrix */}
      <InfluenceMatrix
        participants={allParticipants.map((p) => p.name)}
        edges={influenceEdges}
        isAdhdMode={isAdhdMode}
      />

      {/* Scenario lesson */}
      <div className="w-full p-4 rounded-[18px] bg-sage/5 border border-sage/15 mt-4">
        <p className="text-[10px] text-sage/60 font-mono uppercase tracking-widest mb-1.5">
          Урок
        </p>
        <p className={`text-oatmeal/80 leading-relaxed ${isAdhdMode ? "text-sm font-medium" : "text-xs"}`}>
          {scenario.lesson}
        </p>
      </div>

      {/* Options */}
      <div className="w-full flex flex-col gap-2 mt-4">
        {scenario.options.map((opt) => (
          <button
            key={opt.id}
            className="w-full text-left p-4 rounded-[16px] bg-oatmeal/5 border border-oatmeal/10 hover:bg-oatmeal/8 hover:border-oatmeal/20 transition-all"
          >
            <p className={`text-oatmeal/90 font-medium ${isAdhdMode ? "text-sm" : "text-xs"}`}>
              {opt.label}
            </p>
            <p className="text-[10px] text-oatmeal/40 mt-1">
              {opt.approach} • Фін: {opt.financialDelta > 0 ? "+" : ""}{opt.financialDelta}
            </p>
          </button>
        ))}
      </div>

      {/* Navigation */}
      <div className="w-full flex gap-2 mt-4">
        <button
          onClick={() => setActiveScenarioIdx((prev) => Math.max(0, prev - 1))}
          disabled={activeScenarioIdx === 0}
          className="flex-1 py-3 rounded-[16px] bg-oatmeal/5 text-oatmeal/40 font-mono text-xs tracking-widest disabled:opacity-30"
        >
          ← Попередня
        </button>
        <button
          onClick={() => setActiveScenarioIdx((prev) => Math.min(NEGOTIATION_SCENARIOS.length - 1, prev + 1))}
          disabled={activeScenarioIdx === NEGOTIATION_SCENARIOS.length - 1}
          className="flex-1 py-3 rounded-[16px] bg-ocean/15 text-ocean font-mono text-xs tracking-widest disabled:opacity-30"
        >
          Наступна →
        </button>
      </div>

      {/* Participant Card Modal */}
      {selectedPart && selectedProb && (
        <ParticipantCard
          participant={selectedPart}
          probability={selectedProb}
          influences={selectedInfluences}
          isOpen={!!selectedParticipant}
          onClose={() => setSelectedParticipant(null)}
          isAdhdMode={isAdhdMode}
        />
      )}
    </div>
  );
}

// ─── PARTICIPANT NODE ─────────────────────────
function ParticipantNode({
  participant,
  probability,
  onClick,
  isCenter = false,
}: {
  participant: ParticipantProfile;
  probability: ShadowProbabilityResult;
  onClick: () => void;
  isCenter?: boolean;
}) {
  const shadowColor = SHADOW_ACCENT_COLORS[participant.dominantShadow] || "text-oatmeal/60";
  const ringColor = probability.shadow > 60
    ? "border-red-400/50"
    : probability.shadow > 40
    ? "border-amber/50"
    : "border-sage/50";

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="flex flex-col items-center gap-1"
    >
      {/* Avatar ring */}
      <div className={`relative ${isCenter ? "w-14 h-14" : "w-12 h-12"} rounded-full border-2 ${ringColor} flex items-center justify-center ${isCenter ? "bg-ocean/10" : "bg-oatmeal/5"}`}>
        <ShadowIcon
          shadowId={participant.dominantShadow}
          size={isCenter ? 20 : 16}
          className={shadowColor}
        />
        {/* Pulse animation for high cortisol */}
        {probability.shadow > 60 && (
          <motion.div
            className={`absolute inset-0 rounded-full border ${ringColor}`}
            animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ repeat: Infinity, duration: 2 }}
          />
        )}
      </div>

      {/* Name */}
      <span className="text-[9px] font-mono text-oatmeal/60 max-w-[60px] truncate text-center">
        {participant.name.split(" ")[0]}
      </span>

      {/* Shadow/Totem badge */}
      <span className={`text-[7px] font-mono px-1.5 py-0.5 rounded-full ${
        probability.shadow > 60
          ? "bg-red-500/15 text-red-400"
          : probability.shadow > 40
          ? "bg-amber/15 text-amber"
          : "bg-sage/15 text-sage"
      }`}>
        {probability.shadow > 60 ? `Тінь ${probability.shadow}%` : `Тотем ${probability.totem}%`}
      </span>
    </motion.button>
  );
}
