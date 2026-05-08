"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Sliders, ChevronDown, ChevronUp, Target, Zap, Shield, Skull, Swords } from "lucide-react";
import { SHADOWS_DATABASE, Shadow } from "@/data/shadowsDatabase";
import { DECISION_FRAMEWORKS, DecisionFramework } from "@/data/decisionFrameworks";

function ChemistryBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex items-center gap-2 text-[9px] font-mono">
      <span className="w-[70px] text-oatmeal/50 truncate">{label}</span>
      <div className="flex-1 h-[6px] bg-oatmeal/10 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`h-full rounded-full ${color}`}
        />
      </div>
      <span className="w-[28px] text-right text-oatmeal/60">{value}%</span>
    </div>
  );
}

function ShadowCard({ shadow, isAdhdMode }: { shadow: Shadow; isAdhdMode: boolean }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="w-full flex flex-col bg-graphite/60 border border-oatmeal/10 rounded-[20px] overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 flex items-center justify-between text-left hover:bg-oatmeal/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">{shadow.icon}</span>
          <span className={`text-sm text-oatmeal font-bold ${isAdhdMode ? "text-base" : ""}`}>{shadow.name}</span>
        </div>
        {expanded ? <ChevronUp size={18} className="text-oatmeal/40" /> : <ChevronDown size={18} className="text-oatmeal/40" />}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="w-full px-4 pb-4 overflow-hidden"
          >
            <div className="pt-3 border-t border-oatmeal/10 flex flex-col gap-5">
              {/* Chemistry Profile */}
              <div className="p-3 rounded-[16px] bg-black/20 border border-white/5">
                <span className="text-[10px] text-red-400 uppercase font-mono tracking-widest block mb-3">Хімічний Профіль</span>
                <div className="flex flex-col gap-2">
                  <ChemistryBar label="Кортизол" value={shadow.chemistry.cortisol} color="bg-red-500" />
                  <ChemistryBar label="Дофамін" value={shadow.chemistry.dopamine} color="bg-amber" />
                  <ChemistryBar label="Серотонін" value={shadow.chemistry.serotonin} color="bg-sage" />
                  <ChemistryBar label="Адреналін" value={shadow.chemistry.adrenaline} color="bg-orange-500" />
                  <ChemistryBar label="Окситоцин" value={shadow.chemistry.oxytocin} color="bg-pink-400" />
                  <ChemistryBar label="Тестостерон" value={shadow.chemistry.testosterone} color="bg-ocean" />
                </div>
              </div>

              {/* Trigger Phrases */}
              <div>
                <span className="text-[10px] text-amber uppercase font-mono tracking-widest">Тригерні фрази</span>
                <ul className="text-sm text-oatmeal/90 mt-1 list-disc list-inside">
                  {shadow.phrases.map((p, i) => (
                    <li key={i} className="text-oatmeal/70 italic">"{p}"</li>
                  ))}
                </ul>
              </div>

              {/* Somatics */}
              <div>
                <span className="text-[10px] text-ocean uppercase font-mono tracking-widest">Моторика / Тіло</span>
                <p className="text-sm text-oatmeal/90 mt-1 leading-relaxed">{shadow.somatics}</p>
              </div>

              {/* Behavior */}
              <div>
                <span className="text-[10px] text-red-400 uppercase font-mono tracking-widest">Паттерни Поведінки</span>
                <p className="text-sm text-oatmeal/90 mt-1 leading-relaxed">{shadow.behavior}</p>
              </div>

              {/* Affected Areas */}
              <div className="flex flex-wrap gap-1.5">
                {shadow.affectedLifeAreas.map((area, i) => (
                  <span key={i} className="text-[9px] px-2 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 font-mono">
                    {area}
                  </span>
                ))}
              </div>

              {/* Resolution */}
              <div className="bg-sage/10 p-4 rounded-xl border border-sage/20">
                <span className="text-[10px] text-sage uppercase font-mono tracking-widest">Методологія Виходу</span>
                <p className={`text-sm text-oatmeal font-medium mt-2 leading-relaxed ${isAdhdMode ? "text-base font-bold" : ""}`}>
                  {shadow.resolution}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FrameworkCard({ framework, isAdhdMode }: { framework: DecisionFramework; isAdhdMode: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const iconMap: Record<string, any> = { "🎯": Target, "⚛️": Zap, "💀": Skull, "⚔️": Swords, "⚡": Shield };

  return (
    <div className="w-full flex flex-col bg-graphite/60 border border-ocean/10 rounded-[20px] overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 flex items-center justify-between text-left hover:bg-ocean/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">{framework.icon}</span>
          <div className="flex flex-col">
            <span className={`text-sm text-oatmeal font-bold ${isAdhdMode ? "text-base" : ""}`}>{framework.name}</span>
            <span className="text-[10px] text-ocean/60 font-mono uppercase">{framework.company}</span>
          </div>
        </div>
        {expanded ? <ChevronUp size={18} className="text-oatmeal/40" /> : <ChevronDown size={18} className="text-oatmeal/40" />}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="w-full px-4 pb-4 overflow-hidden"
          >
            <div className="pt-3 border-t border-ocean/10 flex flex-col gap-5">
              {/* Principle */}
              <div>
                <span className="text-[10px] text-ocean uppercase font-mono tracking-widest">Принцип</span>
                <p className="text-sm text-oatmeal/90 mt-1 leading-relaxed">{framework.principle}</p>
              </div>

              {/* Thinking Pattern */}
              <div className="p-3 rounded-[16px] bg-amber/5 border border-amber/20">
                <span className="text-[10px] text-amber uppercase font-mono tracking-widest">Модель Мислення</span>
                <p className={`text-sm text-oatmeal italic mt-2 leading-relaxed ${isAdhdMode ? "text-base font-bold not-italic" : ""}`}>
                  {framework.thinking}
                </p>
              </div>

              {/* Steps */}
              <div>
                <span className="text-[10px] text-sage uppercase font-mono tracking-widest">Алгоритм (Кроки)</span>
                <ol className="mt-2 space-y-2">
                  {framework.steps.map((step, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-oatmeal/80">
                      <span className="w-5 h-5 rounded-full bg-ocean/20 text-ocean text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5 font-bold">
                        {i + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>

              {/* Real World Example */}
              <div className="p-3 rounded-[16px] bg-ocean/5 border border-ocean/20">
                <span className="text-[10px] text-ocean uppercase font-mono tracking-widest">Реальний Кейс</span>
                <p className="text-sm text-oatmeal/90 mt-2 leading-relaxed">{framework.realWorldExample}</p>
              </div>

              {/* Danger */}
              <div className="p-3 rounded-[16px] bg-red-500/5 border border-red-500/20">
                <span className="text-[10px] text-red-400 uppercase font-mono tracking-widest">⚠ Небезпека Зловживання</span>
                <p className="text-sm text-oatmeal/70 mt-2 leading-relaxed">{framework.dangerOfMisuse}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function CodexTab({ isAdhdMode }: { isAdhdMode: boolean }) {
  const [activeSection, setActiveSection] = useState<"shadows" | "frameworks" | "simulator">("shadows");

  // Human Design Simulator
  const [sacralEnergy, setSacralEnergy] = useState(30);
  const [emotionalWave, setEmotionalWave] = useState(70);
  const [splenicIntuition, setSplenicIntuition] = useState(50);
  const [throatExpression, setThroatExpression] = useState(40);
  const [headPressure, setHeadPressure] = useState(80);

  const avgBalance = Math.round((sacralEnergy + (100 - emotionalWave) + splenicIntuition + throatExpression + (100 - headPressure)) / 5);

  const realityState =
    avgBalance > 60
      ? { title: "Задоволення (Профіцит)", desc: "Енергія тече вільно. Рішення приймаються з ядра, а не з голови. Ви в зоні генератора.", color: "text-sage", bg: "bg-sage/10 border-sage/20" }
      : avgBalance > 35
      ? { title: "Нестабільність (Перехід)", desc: "Система коливається між порядком і хаосом. Потрібна усвідомлена пауза перед рішеннями.", color: "text-amber", bg: "bg-amber/10 border-amber/20" }
      : { title: "Фрустрація (Дефіцит)", desc: "Спроба ініціювати без внутрішнього відгуку. Нервова система працює на резервах.", color: "text-red-400", bg: "bg-red-500/10 border-red-500/20" };

  const sections = [
    { id: "shadows" as const, label: "Тіні", count: SHADOWS_DATABASE.length },
    { id: "frameworks" as const, label: "Рішення", count: DECISION_FRAMEWORKS.length },
    { id: "simulator" as const, label: "Симулятор", count: 5 },
  ];

  return (
    <div className="w-full min-h-full flex flex-col items-center p-6 bg-graphite pb-48">
      <div className="text-center space-y-2 mb-6 z-10 w-full max-w-md">
        <h1 className="text-2xl font-sans font-light tracking-tight text-oatmeal flex items-center justify-center gap-3">
          <BookOpen className="text-ocean" /> Кодекс Системи
        </h1>
        <p className="text-oatmeal/50 font-mono text-xs uppercase tracking-widest">[ Методологія • Фреймворки • Симулятор ]</p>
      </div>

      {/* Section Tabs */}
      <div className="w-full max-w-md flex gap-2 mb-6">
        {sections.map((s) => (
          <button
            key={s.id}
            onClick={() => setActiveSection(s.id)}
            className={`flex-1 py-2.5 rounded-[16px] text-xs font-mono uppercase tracking-widest transition-all ${
              activeSection === s.id
                ? "bg-ocean/20 text-ocean border border-ocean/30"
                : "bg-oatmeal/5 text-oatmeal/40 border border-transparent hover:bg-oatmeal/10"
            }`}
          >
            {s.label} ({s.count})
          </button>
        ))}
      </div>

      <div className="w-full max-w-md flex flex-col gap-3">
        <AnimatePresence mode="wait">
          {activeSection === "shadows" && (
            <motion.div key="shadows" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex flex-col gap-3">
              <p className="text-[10px] text-oatmeal/40 font-mono text-center mb-2">
                8 архетипів Юнга з хімічним профілем, моторикою тіла та методологією виходу
              </p>
              {SHADOWS_DATABASE.map((shadow) => (
                <ShadowCard key={shadow.id} shadow={shadow} isAdhdMode={isAdhdMode} />
              ))}
            </motion.div>
          )}

          {activeSection === "frameworks" && (
            <motion.div key="frameworks" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex flex-col gap-3">
              <p className="text-[10px] text-oatmeal/40 font-mono text-center mb-2">
                5 інструментів прийняття рішень рівня Google, Tesla, NASA, Pentagon, Meta
              </p>
              {DECISION_FRAMEWORKS.map((fw) => (
                <FrameworkCard key={fw.id} framework={fw} isAdhdMode={isAdhdMode} />
              ))}
            </motion.div>
          )}

          {activeSection === "simulator" && (
            <motion.div key="simulator" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex flex-col gap-6">
              <div className={`w-full p-6 rounded-[24px] border ${isAdhdMode ? "bg-graphite/80 border-oatmeal/20" : "bg-graphite/40 border-oatmeal/10"}`}>
                <h3 className="text-xs font-mono uppercase tracking-widest text-oatmeal/60 mb-6 flex items-center gap-2">
                  <Sliders size={14} className="text-sage" /> Симулятор Реальності (Human Design)
                </h3>

                <div className="space-y-5">
                  {[
                    { label: "Сакральна Енергія (Генератор)", value: sacralEnergy, setter: setSacralEnergy, color: "accent-sage" },
                    { label: "Емоційна Хвиля (Solar Plexus)", value: emotionalWave, setter: setEmotionalWave, color: "accent-amber" },
                    { label: "Селезінкова Інтуїція (Spleen)", value: splenicIntuition, setter: setSplenicIntuition, color: "accent-ocean" },
                    { label: "Горлова Експресія (Throat)", value: throatExpression, setter: setThroatExpression, color: "accent-pink-400" },
                    { label: "Тиск Голови (Head/Ajna)", value: headPressure, setter: setHeadPressure, color: "accent-red-400" },
                  ].map((param) => (
                    <div key={param.label} className="space-y-1.5">
                      <div className="flex justify-between text-[10px] font-mono text-oatmeal/60">
                        <span>{param.label}</span>
                        <span>{param.value}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={param.value}
                        onChange={(e) => param.setter(Number(e.target.value))}
                        className="w-full h-1 bg-oatmeal/10 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  ))}

                  {/* Balance Indicator */}
                  <div className="w-full h-3 bg-oatmeal/10 rounded-full overflow-hidden mt-4">
                    <motion.div
                      animate={{ width: `${avgBalance}%` }}
                      className={`h-full rounded-full transition-colors ${avgBalance > 60 ? "bg-sage" : avgBalance > 35 ? "bg-amber" : "bg-red-500"}`}
                    />
                  </div>
                  <div className="flex justify-between text-[9px] font-mono text-oatmeal/40">
                    <span>ДЕФІЦИТ</span>
                    <span>БАЛАНС: {avgBalance}%</span>
                    <span>ПРОФІЦИТ</span>
                  </div>

                  {/* Reality Output */}
                  <motion.div key={realityState.title} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className={`mt-2 p-4 rounded-[16px] border ${realityState.bg}`}>
                    <span className="text-[10px] uppercase font-mono tracking-widest text-oatmeal/40 block mb-2">Наслідок у реальності:</span>
                    <span className={`text-sm font-bold ${realityState.color}`}>{realityState.title}</span>
                    <p className="text-xs text-oatmeal/80 leading-relaxed mt-1">{realityState.desc}</p>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
