"use client";

/**
 * PARTICIPANT CARD — Professional opponent profile
 * 
 * Shows visual cues, social facts, shadow analysis with
 * probability bars, and influence on other participants.
 */

import { motion, AnimatePresence } from "framer-motion";
import { X, Eye, Users, Brain, ArrowRight } from "lucide-react";
import { ShadowIcon, SHADOW_ACCENT_COLORS } from "@/components/ui/ShadowIcons";
import type { ParticipantProfile, ShadowProbabilityResult, InfluenceEdge } from "@/data/game-simulator/shadowProbability";

interface ParticipantCardProps {
  participant: ParticipantProfile;
  probability: ShadowProbabilityResult;
  influences: InfluenceEdge[];
  isOpen: boolean;
  onClose: () => void;
  isAdhdMode: boolean;
}

export function ParticipantCard({
  participant,
  probability,
  influences,
  isOpen,
  onClose,
  isAdhdMode,
}: ParticipantCardProps) {
  const shadowColor = SHADOW_ACCENT_COLORS[participant.dominantShadow] || "text-oatmeal/60";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md max-h-[85vh] overflow-y-auto bg-graphite rounded-t-[28px] border-t border-oatmeal/10 p-6 pb-12"
          >
            {/* Handle bar */}
            <div className="w-10 h-1 bg-oatmeal/20 rounded-full mx-auto mb-5" />

            {/* Header */}
            <div className="flex items-start justify-between mb-5">
              <div>
                <h3 className={`font-bold text-oatmeal ${isAdhdMode ? "text-xl" : "text-lg"}`}>
                  {participant.name}
                </h3>
                <p className="text-[10px] text-oatmeal/40 font-mono uppercase tracking-widest mt-0.5">
                  {participant.role}
                  {participant.age ? ` • ${participant.age} років` : ""}
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-oatmeal/10 flex items-center justify-center hover:bg-oatmeal/20 transition-colors"
              >
                <X size={14} className="text-oatmeal/60" />
              </button>
            </div>

            {/* Visual Cues */}
            {participant.visualCues.length > 0 && (
              <Section icon={<Eye size={12} />} title="Візуальні сигнали">
                <ul className="space-y-1.5">
                  {participant.visualCues.map((cue, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber/60 mt-1.5 flex-shrink-0" />
                      <span className={`text-oatmeal/80 ${isAdhdMode ? "text-sm font-medium" : "text-xs"}`}>
                        {cue}
                      </span>
                    </li>
                  ))}
                </ul>
              </Section>
            )}

            {/* Social Facts */}
            {participant.socialFacts.length > 0 && (
              <Section icon={<Users size={12} />} title="Соціальні факти">
                <ul className="space-y-1.5">
                  {participant.socialFacts.map((fact, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-ocean/60 mt-1.5 flex-shrink-0" />
                      <span className={`text-oatmeal/80 ${isAdhdMode ? "text-sm font-medium" : "text-xs"}`}>
                        {fact}
                      </span>
                    </li>
                  ))}
                </ul>
              </Section>
            )}

            {/* Shadow Analysis */}
            <Section icon={<Brain size={12} />} title="Тіньовий аналіз">
              <div className="space-y-3">
                {/* Shadow bar */}
                <ProbabilityBar
                  label={participant.dominantShadow === "escapist" ? "Ескапіст" :
                    participant.dominantShadow === "perfectionist" ? "Перфекціоніст" :
                    participant.dominantShadow === "victim" ? "Жертва" :
                    participant.dominantShadow === "aggressor" ? "Агресор" :
                    participant.dominantShadow === "impostor" ? "Самозванець" :
                    participant.dominantShadow === "rescuer" ? "Рятувальник" :
                    participant.dominantShadow === "manipulator" ? "Маніпулятор" :
                    "Спостерігач"}
                  value={probability.shadow}
                  color="bg-red-400"
                  icon={<ShadowIcon shadowId={participant.dominantShadow} size={14} className={shadowColor} />}
                />

                {/* Secondary shadow */}
                {participant.secondaryShadow && (
                  <ProbabilityBar
                    label={participant.secondaryShadow === "impostor" ? "Самозванець" :
                      participant.secondaryShadow === "victim" ? "Жертва" :
                      participant.secondaryShadow === "perfectionist" ? "Перфекціоніст" :
                      participant.secondaryShadow}
                    value={Math.round(probability.shadow * 0.4)}
                    color="bg-amber"
                    icon={<ShadowIcon shadowId={participant.secondaryShadow} size={14} className="text-amber" />}
                  />
                )}

                {/* Totem bar */}
                <ProbabilityBar
                  label="Тотем (Self)"
                  value={probability.totem}
                  color="bg-sage"
                />

                {/* Explanation */}
                <p className="text-[11px] text-oatmeal/60 italic leading-relaxed mt-2 p-3 rounded-[12px] bg-oatmeal/3 border border-oatmeal/5">
                  {probability.explanation}
                </p>
              </div>
            </Section>

            {/* Known Behavior */}
            {participant.knownBehavior && (
              <div className="p-4 rounded-[16px] bg-amber/5 border border-amber/15 mt-4">
                <p className="text-[10px] text-amber/60 font-mono uppercase tracking-widest mb-1.5">
                  Відомий паттерн
                </p>
                <p className={`text-oatmeal/80 ${isAdhdMode ? "text-sm" : "text-xs"} leading-relaxed`}>
                  {participant.knownBehavior}
                </p>
              </div>
            )}

            {/* Influence on Others */}
            {influences.length > 0 && (
              <Section icon={<ArrowRight size={12} />} title="Вплив на інших">
                <div className="space-y-2">
                  {influences.map((edge, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-[12px] bg-oatmeal/3 border border-oatmeal/5"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-mono text-oatmeal/50">
                          → {edge.to}
                        </span>
                        <span className={`text-[10px] font-mono font-bold ${
                          edge.type === "ДОМІНУВАННЯ" || edge.type === "МАНІПУЛЯЦІЯ"
                            ? "text-red-400"
                            : edge.type === "КОАЛІЦІЯ"
                            ? "text-ocean"
                            : edge.type === "КОДЕПЕНДЕНЦІЯ"
                            ? "text-amber"
                            : "text-oatmeal/40"
                        }`}>
                          {edge.type} ({edge.strength}%)
                        </span>
                      </div>
                      <p className="text-[10px] text-oatmeal/50 leading-relaxed">
                        {edge.mechanism}
                      </p>
                    </div>
                  ))}
                </div>
              </Section>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── HELPERS ─────────────────────────

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="mt-5">
      <div className="flex items-center gap-2 text-[10px] font-mono text-oatmeal/40 uppercase tracking-widest mb-3">
        {icon} {title}
      </div>
      {children}
    </div>
  );
}

function ProbabilityBar({ label, value, color, icon }: { label: string; value: number; color: string; icon?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      {icon && <div className="w-5 flex items-center justify-center">{icon}</div>}
      <div className="flex-1">
        <div className="flex justify-between text-[10px] font-mono mb-1">
          <span className="text-oatmeal/60">{label}</span>
          <span className="text-oatmeal/80 font-bold">{value}%</span>
        </div>
        <div className="h-1.5 bg-oatmeal/10 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${value}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={`h-full rounded-full ${color}`}
          />
        </div>
      </div>
    </div>
  );
}
