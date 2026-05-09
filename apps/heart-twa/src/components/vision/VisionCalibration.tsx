"use client";

/**
 * VISION CALIBRATION — Diopter-based accessibility setup
 * 
 * Step 1: Diopter input (slider + known prescription)
 * Step 2: Astigmatism toggle
 * Step 3: Font selection with live preview
 * Step 4: Color scheme with sensory descriptions
 * Step 5: Fine-tune (contrast, motion, touch)
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Type, Palette, SlidersHorizontal, ChevronLeft, Check, RotateCcw, Sun, Moon } from "lucide-react";
import { useVision } from "./VisionProvider";
import { COLOR_SCHEMES, FONT_PROFILES, getRecommendedSettings } from "@/data/vision/VisionSchemes";
import { detectVisionCondition, calcFontScale } from "@/data/vision/VisionTypes";
import type { ColorSchemeId } from "@/data/vision/VisionTypes";

interface VisionCalibrationProps {
  onClose: () => void;
}

type CalibStep = "diopter" | "font" | "scheme" | "tune";

const CONDITION_LABELS: Record<string, string> = {
  normal: "Нормальний зір",
  myopia_mild: "Легка міопія (короткозорість)",
  myopia_mod: "Середня міопія",
  myopia_high: "Висока міопія",
  hyperopia_mild: "Легка гіперопія (далекозорість)",
  hyperopia_mod: "Середня гіперопія",
  hyperopia_high: "Висока гіперопія",
  astigmatism: "Астигматизм",
};

export function VisionCalibration({ onClose }: VisionCalibrationProps) {
  const { settings, updateSettings, resetSettings } = useVision();
  const [step, setStep] = useState<CalibStep>("diopter");
  const [localDiopters, setLocalDiopters] = useState(settings.diopters);
  const [localAstigmatism, setLocalAstigmatism] = useState(settings.hasAstigmatism);

  const condition = detectVisionCondition(localDiopters, localAstigmatism);
  const recommended = getRecommendedSettings(localDiopters, localAstigmatism);
  const fontScale = calcFontScale(localDiopters);

  const applyDiopters = () => {
    updateSettings({
      diopters: localDiopters,
      hasAstigmatism: localAstigmatism,
      fontProfileId: recommended.fontId,
      colorSchemeId: recommended.schemeId as ColorSchemeId,
      contrastBoost: recommended.contrastBoost,
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/70 backdrop-blur-md">
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-t-[28px] border-t p-6 pb-16"
        style={{
          backgroundColor: "var(--v-bg, #0D0F12)",
          borderColor: "var(--v-border, rgba(247,245,240,0.08))",
          color: "var(--v-text, #F7F5F0)",
        }}
      >
        {/* Handle */}
        <div className="w-10 h-1 rounded-full mx-auto mb-5" style={{ backgroundColor: "var(--v-text-dim)" }} />

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Eye size={18} style={{ color: "var(--v-accent)" }} />
            <h2 className="text-lg font-bold" style={{ color: "var(--v-text)" }}>
              Адаптація зору
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={resetSettings} className="text-[9px] font-mono uppercase tracking-widest opacity-40 hover:opacity-80 transition-opacity">
              <RotateCcw size={12} />
            </button>
            <button onClick={onClose} className="text-sm opacity-40 hover:opacity-80 transition-opacity">✕</button>
          </div>
        </div>

        {/* Step tabs */}
        <div className="flex gap-1 mb-6">
          {(["diopter", "font", "scheme", "tune"] as CalibStep[]).map((s, i) => {
            const icons = [Eye, Type, Palette, SlidersHorizontal];
            const Icon = icons[i];
            return (
              <button
                key={s}
                onClick={() => setStep(s)}
                className="flex-1 py-2 rounded-[10px] text-[9px] font-mono uppercase tracking-widest flex items-center justify-center gap-1 transition-all"
                style={{
                  backgroundColor: step === s ? "var(--v-accent-muted)" : "var(--v-bg-card)",
                  color: step === s ? "var(--v-accent)" : "var(--v-text-dim)",
                  borderWidth: 1,
                  borderStyle: "solid",
                  borderColor: step === s ? "var(--v-border-active)" : "transparent",
                }}
              >
                <Icon size={12} />
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          {/* ─── STEP 1: DIOPTERS ─── */}
          {step === "diopter" && (
            <motion.div key="diopter" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-5">
              <div>
                <p className="text-[10px] font-mono uppercase tracking-widest mb-1" style={{ color: "var(--v-text-dim)" }}>
                  Ваші діоптрії (з рецепту окуліста)
                </p>
                <p className="text-[9px] mb-3" style={{ color: "var(--v-text-dim)" }}>
                  Мінус = короткозорість · Плюс = далекозорість · 0 = без корекції
                </p>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono" style={{ color: "var(--v-text-dim)" }}>-8</span>
                  <input
                    type="range"
                    min={-8}
                    max={8}
                    step={0.25}
                    value={localDiopters}
                    onChange={(e) => setLocalDiopters(parseFloat(e.target.value))}
                    className="flex-1 h-2 rounded-lg appearance-none cursor-pointer"
                    style={{ backgroundColor: "var(--v-bg-input)" }}
                  />
                  <span className="text-[10px] font-mono" style={{ color: "var(--v-text-dim)" }}>+8</span>
                </div>
                <div className="text-center mt-2">
                  <span className="text-2xl font-mono font-bold" style={{ color: "var(--v-accent)" }}>
                    {localDiopters > 0 ? "+" : ""}{localDiopters.toFixed(2)}
                  </span>
                  <p className="text-[10px] mt-1" style={{ color: "var(--v-text-muted)" }}>
                    {CONDITION_LABELS[condition]}
                  </p>
                </div>
              </div>

              {/* Astigmatism */}
              <div className="flex items-center justify-between p-4 rounded-[16px]" style={{ backgroundColor: "var(--v-bg-card)", border: "1px solid var(--v-border)" }}>
                <div>
                  <p className="text-sm font-medium" style={{ color: "var(--v-text)" }}>Астигматизм</p>
                  <p className="text-[10px]" style={{ color: "var(--v-text-dim)" }}>Нерівна кривизна рогівки</p>
                </div>
                <button
                  onClick={() => setLocalAstigmatism(!localAstigmatism)}
                  className="w-12 h-6 rounded-full transition-all"
                  style={{ backgroundColor: localAstigmatism ? "var(--v-accent)" : "var(--v-bg-input)" }}
                >
                  <div className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${localAstigmatism ? "translate-x-6" : "translate-x-0.5"}`} />
                </button>
              </div>

              {/* Preview text */}
              <div className="p-4 rounded-[16px]" style={{ backgroundColor: "var(--v-bg-card)", border: "1px solid var(--v-border)" }}>
                <p className="text-[10px] font-mono uppercase tracking-widest mb-2" style={{ color: "var(--v-text-dim)" }}>
                  Попередній перегляд (×{fontScale.toFixed(2)})
                </p>
                <p style={{ fontSize: `${14 * fontScale}px`, lineHeight: "1.6", color: "var(--v-text)" }}>
                  Цей текст адаптований під ваш зір. Кожна літера має бути чітко розрізнена без напруження очей.
                </p>
              </div>

              {/* Auto-apply recommendation */}
              <button
                onClick={() => { applyDiopters(); setStep("font"); }}
                className="w-full py-4 rounded-[18px] font-mono text-sm tracking-widest uppercase flex items-center justify-center gap-2 transition-all"
                style={{ backgroundColor: "var(--v-accent-muted)", color: "var(--v-accent)", border: "1px solid var(--v-border-active)" }}
              >
                Далі <ChevronLeft size={14} className="rotate-180" />
              </button>
            </motion.div>
          )}

          {/* ─── STEP 2: FONTS ─── */}
          {step === "font" && (
            <motion.div key="font" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
              <p className="text-[10px] font-mono uppercase tracking-widest mb-1" style={{ color: "var(--v-text-dim)" }}>
                Шрифт · Рекомендовано: {FONT_PROFILES[recommended.fontId]?.family.split("'")[1]}
              </p>
              {Object.entries(FONT_PROFILES).map(([id, font]) => (
                <button
                  key={id}
                  onClick={() => updateSettings({ fontProfileId: id })}
                  className="w-full text-left p-4 rounded-[16px] transition-all"
                  style={{
                    backgroundColor: settings.fontProfileId === id ? "var(--v-accent-muted)" : "var(--v-bg-card)",
                    border: `1px solid ${settings.fontProfileId === id ? "var(--v-border-active)" : "var(--v-border)"}`,
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold" style={{ fontFamily: font.family, color: "var(--v-text)" }}>
                      {font.family.split("'")[1] || font.family}
                    </span>
                    {settings.fontProfileId === id && <Check size={14} style={{ color: "var(--v-accent)" }} />}
                    {id === recommended.fontId && settings.fontProfileId !== id && (
                      <span className="text-[8px] font-mono px-2 py-0.5 rounded-full" style={{ backgroundColor: "var(--v-accent-muted)", color: "var(--v-accent)" }}>
                        REC
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] mb-2" style={{ color: "var(--v-text-dim)" }}>{font.description}</p>
                  <p className="text-[9px] font-mono" style={{ color: "var(--v-text-dim)" }}>
                    Найкраще для: {font.bestFor}
                  </p>
                  {/* Live preview */}
                  <p className="mt-2 text-sm" style={{ fontFamily: font.family, color: "var(--v-text-muted)", fontSize: `${14 * fontScale * font.baseSize}px`, letterSpacing: font.letterSpacing, lineHeight: font.lineHeight }}>
                    Абв Ґдж 0123 — Тінь і Тотем
                  </p>
                </button>
              ))}
              <button
                onClick={() => setStep("scheme")}
                className="w-full py-4 rounded-[18px] font-mono text-sm tracking-widest uppercase flex items-center justify-center gap-2 transition-all"
                style={{ backgroundColor: "var(--v-accent-muted)", color: "var(--v-accent)", border: "1px solid var(--v-border-active)" }}
              >
                Далі <ChevronLeft size={14} className="rotate-180" />
              </button>
            </motion.div>
          )}

          {/* ─── STEP 3: COLOR SCHEMES ─── */}
          {step === "scheme" && (
            <motion.div key="scheme" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
              <p className="text-[10px] font-mono uppercase tracking-widest mb-1" style={{ color: "var(--v-text-dim)" }}>
                Палітра · Кожна має сенсорний опис
              </p>
              {COLOR_SCHEMES.map((scheme) => (
                <button
                  key={scheme.id}
                  onClick={() => updateSettings({ colorSchemeId: scheme.id })}
                  className="w-full text-left p-4 rounded-[16px] transition-all"
                  style={{
                    backgroundColor: settings.colorSchemeId === scheme.id ? scheme.tokens.bgCard : "var(--v-bg-card)",
                    border: `1px solid ${settings.colorSchemeId === scheme.id ? scheme.tokens.accent : "var(--v-border)"}`,
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {/* Color swatch */}
                      <div className="flex gap-0.5">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: scheme.tokens.bg, border: `1px solid ${scheme.tokens.border}` }} />
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: scheme.tokens.accent }} />
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: scheme.tokens.text, opacity: 0.7 }} />
                      </div>
                      <span className="text-sm font-bold" style={{ color: "var(--v-text)" }}>{scheme.name}</span>
                    </div>
                    {settings.colorSchemeId === scheme.id && <Check size={14} style={{ color: scheme.tokens.accent }} />}
                  </div>

                  {/* Sensory description */}
                  <p className="text-[11px] italic leading-relaxed mb-2" style={{ color: "var(--v-text-muted)" }}>
                    {scheme.sensoryDescription}
                  </p>
                  <p className="text-[9px] font-mono" style={{ color: "var(--v-text-dim)" }}>
                    {scheme.bestFor}
                  </p>
                </button>
              ))}
              <button
                onClick={() => setStep("tune")}
                className="w-full py-4 rounded-[18px] font-mono text-sm tracking-widest uppercase flex items-center justify-center gap-2 transition-all"
                style={{ backgroundColor: "var(--v-accent-muted)", color: "var(--v-accent)", border: "1px solid var(--v-border-active)" }}
              >
                Далі <ChevronLeft size={14} className="rotate-180" />
              </button>
            </motion.div>
          )}

          {/* ─── STEP 4: FINE TUNE ─── */}
          {step === "tune" && (
            <motion.div key="tune" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-5">
              {/* Contrast Boost */}
              <div>
                <p className="text-[10px] font-mono uppercase tracking-widest mb-2" style={{ color: "var(--v-text-dim)" }}>
                  <Sun size={12} className="inline mr-1" /> Підсилення контрасту
                </p>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={0}
                    max={50}
                    step={5}
                    value={settings.contrastBoost}
                    onChange={(e) => updateSettings({ contrastBoost: parseInt(e.target.value) })}
                    className="flex-1 h-2 rounded-lg appearance-none cursor-pointer"
                    style={{ backgroundColor: "var(--v-bg-input)" }}
                  />
                  <span className="text-sm font-mono w-10 text-right" style={{ color: "var(--v-text-muted)" }}>
                    +{settings.contrastBoost}%
                  </span>
                </div>
              </div>

              {/* Reduce Motion */}
              <div className="flex items-center justify-between p-4 rounded-[16px]" style={{ backgroundColor: "var(--v-bg-card)", border: "1px solid var(--v-border)" }}>
                <div>
                  <p className="text-sm" style={{ color: "var(--v-text)" }}>Зменшити анімації</p>
                  <p className="text-[10px]" style={{ color: "var(--v-text-dim)" }}>Для епілепсії, мігреней, РДУГ</p>
                </div>
                <button
                  onClick={() => updateSettings({ reduceMotion: !settings.reduceMotion })}
                  className="w-12 h-6 rounded-full transition-all"
                  style={{ backgroundColor: settings.reduceMotion ? "var(--v-accent)" : "var(--v-bg-input)" }}
                >
                  <div className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${settings.reduceMotion ? "translate-x-6" : "translate-x-0.5"}`} />
                </button>
              </div>

              {/* Large Touch */}
              <div className="flex items-center justify-between p-4 rounded-[16px]" style={{ backgroundColor: "var(--v-bg-card)", border: "1px solid var(--v-border)" }}>
                <div>
                  <p className="text-sm" style={{ color: "var(--v-text)" }}>Збільшити зони дотику</p>
                  <p className="text-[10px]" style={{ color: "var(--v-text-dim)" }}>44px → 56px мінімальний тап</p>
                </div>
                <button
                  onClick={() => updateSettings({ largeTouch: !settings.largeTouch })}
                  className="w-12 h-6 rounded-full transition-all"
                  style={{ backgroundColor: settings.largeTouch ? "var(--v-accent)" : "var(--v-bg-input)" }}
                >
                  <div className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${settings.largeTouch ? "translate-x-6" : "translate-x-0.5"}`} />
                </button>
              </div>

              {/* Done */}
              <button
                onClick={onClose}
                className="w-full py-5 rounded-[20px] font-mono text-sm tracking-widest uppercase flex items-center justify-center gap-2 transition-all"
                style={{ backgroundColor: "var(--v-accent-muted)", color: "var(--v-accent)", border: "1px solid var(--v-border-active)" }}
              >
                <Check size={16} /> Готово
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
