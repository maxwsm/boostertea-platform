"use client";

/**
 * INTAKE ENGINE — Multi-step context-driven situation input
 * 
 * Step 1: Choose life context (cards, not list)
 * Step 2: Choose sub-situation (plain language, 2 sentences)
 * Step 3: Optional free-text addition
 * Step 4: Bio parameters (collected once, stored in localStorage)
 */

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase, TrendingUp, Wallet, Heart, Flame,
  Handshake, Users, Brain, ChevronLeft, ArrowRight,
  Moon, Calendar, User, Baby, Dog, Clock, DollarSign,
} from "lucide-react";
import { INTAKE_CONTEXTS } from "@/data/intake/IntakeContextData";
import type { 
  LifeContext, SubSituation, BioParameters, 
  VacationPeriod, FamilyStatus, ChildrenStatus, WorkCycle 
} from "@/data/intake/IntakeTypes";

const LUCIDE_ICONS: Record<string, any> = {
  Briefcase, TrendingUp, Wallet, Heart, Flame, Handshake, Users, Brain,
};

const BIO_STORAGE_KEY = "mrrt_bio_params";

function loadBioParams(): BioParameters | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(BIO_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch { return null; }
}

function saveBioParams(params: BioParameters) {
  if (typeof window === "undefined") return;
  localStorage.setItem(BIO_STORAGE_KEY, JSON.stringify(params));
}

interface IntakeEngineProps {
  onComplete: (result: {
    context: LifeContext;
    situation: SubSituation;
    freeText: string;
    bioParameters: BioParameters;
  }) => void;
  isAdhdMode: boolean;
}

export function IntakeEngine({ onComplete, isAdhdMode }: IntakeEngineProps) {
  const [step, setStep] = useState<"context" | "situation" | "freeText" | "bio">("context");
  const [selectedContext, setSelectedContext] = useState<LifeContext | null>(null);
  const [selectedSituation, setSelectedSituation] = useState<SubSituation | null>(null);
  const [freeText, setFreeText] = useState("");
  const [bioParams, setBioParams] = useState<BioParameters>({
    avgSleepHours: 7,
    lastVacation7Days: "3to6m",
    birthDate: "",
    familyStatus: "single",
    children: "none",
    hasPets: false,
    avgWorkCycle: "3to12m",
    comfortFinancialThreshold: 1000,
  });

  // Check if bio params already exist
  const [hasBioParams, setHasBioParams] = useState(false);
  useEffect(() => {
    const saved = loadBioParams();
    if (saved) {
      setBioParams(saved);
      setHasBioParams(true);
    }
  }, []);

  const contextData = selectedContext
    ? INTAKE_CONTEXTS.find((c) => c.id === selectedContext)
    : null;

  const handleContextSelect = (id: LifeContext) => {
    setSelectedContext(id);
    setStep("situation");
  };

  const handleSituationSelect = (situation: SubSituation) => {
    setSelectedSituation(situation);
    setStep("freeText");
  };

  const handleFreeTextContinue = () => {
    if (hasBioParams) {
      // Bio already collected — go straight to analysis
      handleComplete();
    } else {
      setStep("bio");
    }
  };

  const handleComplete = useCallback(() => {
    if (!selectedContext || !selectedSituation) return;
    saveBioParams(bioParams);
    onComplete({
      context: selectedContext,
      situation: selectedSituation,
      freeText,
      bioParameters: bioParams,
    });
  }, [selectedContext, selectedSituation, freeText, bioParams, onComplete]);

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center px-4">
      <AnimatePresence mode="wait">
        {/* ─── STEP 1: CONTEXT ─── */}
        {step === "context" && (
          <motion.div
            key="context"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="w-full flex flex-col gap-4 pt-6"
          >
            <div className="text-center mb-2">
              <h2 className="text-lg font-sans font-light text-oatmeal tracking-tight">
                Що зараз відбувається?
              </h2>
              <p className="text-[10px] text-oatmeal/40 font-mono uppercase tracking-widest mt-1">
                Виберіть контекст ситуації
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {INTAKE_CONTEXTS.map((ctx) => {
                const Icon = LUCIDE_ICONS[ctx.lucideIcon] || Brain;
                return (
                  <motion.button
                    key={ctx.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleContextSelect(ctx.id)}
                    className="flex flex-col items-start gap-2 p-4 rounded-[18px] bg-oatmeal/5 border border-oatmeal/10 hover:bg-oatmeal/8 hover:border-oatmeal/20 transition-all text-left"
                  >
                    <div className="w-8 h-8 rounded-lg bg-ocean/10 border border-ocean/20 flex items-center justify-center">
                      <Icon size={16} className="text-ocean" />
                    </div>
                    <div>
                      <p className={`text-sm font-bold text-oatmeal ${isAdhdMode ? "text-base" : ""}`}>
                        {ctx.label}
                      </p>
                      <p className="text-[10px] text-oatmeal/40 mt-0.5 leading-tight">
                        {ctx.description}
                      </p>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* ─── STEP 2: SUB-SITUATION ─── */}
        {step === "situation" && contextData && (
          <motion.div
            key="situation"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="w-full flex flex-col gap-3 pt-6"
          >
            <button
              onClick={() => setStep("context")}
              className="flex items-center gap-1.5 text-oatmeal/40 hover:text-oatmeal text-xs font-mono uppercase tracking-widest transition-colors self-start"
            >
              <ChevronLeft size={14} /> Назад
            </button>

            <div className="text-center mb-1">
              <h2 className="text-lg font-sans font-light text-oatmeal tracking-tight">
                {contextData.label}
              </h2>
              <p className="text-[10px] text-oatmeal/40 font-mono uppercase tracking-widest mt-1">
                Виберіть що найбільш резонує
              </p>
            </div>

            <div className="flex flex-col gap-2">
              {contextData.situations.map((sit) => (
                <motion.button
                  key={sit.id}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSituationSelect(sit)}
                  className={`w-full text-left p-4 rounded-[16px] bg-oatmeal/5 border border-oatmeal/10 hover:bg-oatmeal/8 hover:border-oatmeal/20 transition-all ${
                    isAdhdMode ? "py-5" : ""
                  }`}
                >
                  <p className={`text-oatmeal/90 leading-relaxed ${
                    isAdhdMode ? "text-base font-medium" : "text-sm"
                  }`}>
                    {sit.text}
                  </p>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* ─── STEP 3: FREE TEXT ─── */}
        {step === "freeText" && selectedSituation && (
          <motion.div
            key="freeText"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="w-full flex flex-col gap-4 pt-6"
          >
            <button
              onClick={() => setStep("situation")}
              className="flex items-center gap-1.5 text-oatmeal/40 hover:text-oatmeal text-xs font-mono uppercase tracking-widest transition-colors self-start"
            >
              <ChevronLeft size={14} /> Назад
            </button>

            <div className="p-4 rounded-[16px] bg-ocean/5 border border-ocean/15">
              <p className="text-[10px] text-ocean/60 font-mono uppercase tracking-widest mb-2">
                Обрана ситуація
              </p>
              <p className={`text-oatmeal/80 leading-relaxed ${isAdhdMode ? "text-base" : "text-sm"}`}>
                {selectedSituation.text}
              </p>
            </div>

            <div>
              <p className="text-[10px] text-oatmeal/40 font-mono uppercase tracking-widest mb-2">
                Доповніть деталями (опціонально)
              </p>
              <textarea
                value={freeText}
                onChange={(e) => setFreeText(e.target.value)}
                placeholder="Що ще важливо знати..."
                className="w-full h-24 bg-oatmeal/5 border border-oatmeal/10 rounded-[16px] p-4 text-oatmeal text-sm focus:outline-none focus:border-ocean/40 resize-none placeholder:text-oatmeal/20"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleFreeTextContinue}
              className="w-full py-4 rounded-[18px] bg-ocean/15 border border-ocean/25 text-ocean font-mono text-sm tracking-widest uppercase flex items-center justify-center gap-2 hover:bg-ocean/25 transition-all"
            >
              {hasBioParams ? "Аналізувати" : "Далі"} <ArrowRight size={16} />
            </motion.button>
          </motion.div>
        )}

        {/* ─── STEP 4: BIO PARAMETERS ─── */}
        {step === "bio" && (
          <motion.div
            key="bio"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="w-full flex flex-col gap-5 pt-6 pb-32"
          >
            <div className="text-center mb-1">
              <h2 className="text-lg font-sans font-light text-oatmeal tracking-tight">
                Ваш профіль
              </h2>
              <p className="text-[10px] text-oatmeal/40 font-mono uppercase tracking-widest mt-1">
                Збирається один раз • Впливає на якість аналізу
              </p>
            </div>

            {/* Sleep */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-[10px] font-mono text-oatmeal/50 uppercase tracking-widest">
                <Moon size={12} /> Середній сон
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={3}
                  max={10}
                  step={0.5}
                  value={bioParams.avgSleepHours}
                  onChange={(e) => setBioParams({ ...bioParams, avgSleepHours: parseFloat(e.target.value) })}
                  className="flex-1 h-1 bg-oatmeal/10 rounded-lg appearance-none cursor-pointer"
                />
                <span className={`text-sm font-mono w-12 text-right ${
                  bioParams.avgSleepHours < 6 ? "text-red-400" : bioParams.avgSleepHours >= 7.5 ? "text-sage" : "text-amber"
                }`}>
                  {bioParams.avgSleepHours}h
                </span>
              </div>
            </div>

            {/* Last Vacation */}
            <SegmentedControl
              icon={<Calendar size={12} />}
              label="Останній відпуск 7+ днів"
              options={[
                { value: "less1m", label: "< 1 міс" },
                { value: "1to3m", label: "1-3 міс" },
                { value: "3to6m", label: "3-6 міс" },
                { value: "6plus", label: "6+ міс" },
                { value: "dontRemember", label: "Не пам'ятаю" },
              ]}
              value={bioParams.lastVacation7Days}
              onChange={(v) => setBioParams({ ...bioParams, lastVacation7Days: v as VacationPeriod })}
            />

            {/* Birth Date */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-[10px] font-mono text-oatmeal/50 uppercase tracking-widest">
                <User size={12} /> Дата народження
              </div>
              <input
                type="date"
                value={bioParams.birthDate}
                onChange={(e) => setBioParams({ ...bioParams, birthDate: e.target.value })}
                className="w-full bg-oatmeal/5 border border-oatmeal/10 rounded-[12px] px-4 py-2.5 text-oatmeal text-sm font-mono focus:outline-none focus:border-ocean/40"
              />
            </div>

            {/* Family Status */}
            <SegmentedControl
              icon={<Heart size={12} />}
              label="Сімейний статус"
              options={[
                { value: "single", label: "Сам/а" },
                { value: "inRelationship", label: "Є партнер" },
                { value: "married", label: "Шлюб" },
                { value: "divorced", label: "Розлучення" },
              ]}
              value={bioParams.familyStatus}
              onChange={(v) => setBioParams({ ...bioParams, familyStatus: v as FamilyStatus })}
            />

            {/* Children */}
            <SegmentedControl
              icon={<Baby size={12} />}
              label="Діти"
              options={[
                { value: "none", label: "Немає" },
                { value: "has", label: "Є" },
                { value: "expecting", label: "Очікую" },
              ]}
              value={bioParams.children}
              onChange={(v) => setBioParams({ ...bioParams, children: v as ChildrenStatus })}
            />

            {/* Pets */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[10px] font-mono text-oatmeal/50 uppercase tracking-widest">
                <Dog size={12} /> Домашні тварини
              </div>
              <button
                onClick={() => setBioParams({ ...bioParams, hasPets: !bioParams.hasPets })}
                className={`w-12 h-6 rounded-full transition-all ${
                  bioParams.hasPets ? "bg-ocean" : "bg-oatmeal/15"
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                  bioParams.hasPets ? "translate-x-6" : "translate-x-0.5"
                }`} />
              </button>
            </div>

            {/* Work Cycle */}
            <SegmentedControl
              icon={<Clock size={12} />}
              label="Середній цикл роботи в проєкті"
              options={[
                { value: "less3m", label: "< 3 міс" },
                { value: "3to12m", label: "3-12 міс" },
                { value: "1to3y", label: "1-3 роки" },
                { value: "3plusY", label: "3+ роки" },
              ]}
              value={bioParams.avgWorkCycle}
              onChange={(v) => setBioParams({ ...bioParams, avgWorkCycle: v as WorkCycle })}
            />

            {/* Comfort Financial Threshold */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-[10px] font-mono text-oatmeal/50 uppercase tracking-widest">
                <DollarSign size={12} /> Сума, що не викликає настороги
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={100}
                  max={100000}
                  step={100}
                  value={bioParams.comfortFinancialThreshold}
                  onChange={(e) => setBioParams({ ...bioParams, comfortFinancialThreshold: parseInt(e.target.value) })}
                  className="flex-1 h-1 bg-oatmeal/10 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-sm font-mono text-oatmeal/60 w-16 text-right">
                  ${bioParams.comfortFinancialThreshold >= 1000
                    ? `${(bioParams.comfortFinancialThreshold / 1000).toFixed(0)}K`
                    : bioParams.comfortFinancialThreshold
                  }
                </span>
              </div>
            </div>

            {/* Submit */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleComplete}
              className="w-full py-5 mt-2 rounded-[20px] bg-ocean/15 border border-ocean/25 text-ocean font-mono text-sm tracking-widest uppercase flex items-center justify-center gap-2 hover:bg-ocean/25 transition-all shadow-[0_10px_30px_rgba(106,156,187,0.1)]"
            >
              Аналізувати <ArrowRight size={16} />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── SEGMENTED CONTROL ─────────────────────────
function SegmentedControl({ icon, label, options, value, onChange }: {
  icon: React.ReactNode;
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 text-[10px] font-mono text-oatmeal/50 uppercase tracking-widest">
        {icon} {label}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`px-3 py-1.5 rounded-[10px] text-[11px] font-mono transition-all ${
              value === opt.value
                ? "bg-ocean/20 text-ocean border border-ocean/30"
                : "bg-oatmeal/5 text-oatmeal/40 border border-transparent hover:bg-oatmeal/10"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
