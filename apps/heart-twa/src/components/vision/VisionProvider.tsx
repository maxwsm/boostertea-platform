"use client";

/**
 * VISION PROVIDER — Global vision adaptation context
 * 
 * Applies CSS custom properties to :root based on vision settings.
 * All components read from CSS vars → zero prop drilling.
 * Settings persist in localStorage.
 */

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import {
  type VisionSettings,
  DEFAULT_VISION,
  calcFontScale,
  calcLetterSpacing,
} from "@/data/vision/VisionTypes";
import { COLOR_SCHEMES, FONT_PROFILES } from "@/data/vision/VisionSchemes";

const STORAGE_KEY = "mrrt_vision";

interface VisionContextValue {
  settings: VisionSettings;
  updateSettings: (partial: Partial<VisionSettings>) => void;
  resetSettings: () => void;
  currentScheme: typeof COLOR_SCHEMES[0];
  currentFont: typeof FONT_PROFILES[keyof typeof FONT_PROFILES];
  fontScale: number;
}

const VisionContext = createContext<VisionContextValue | null>(null);

export function useVision(): VisionContextValue {
  const ctx = useContext(VisionContext);
  if (!ctx) throw new Error("useVision must be used within VisionProvider");
  return ctx;
}

function loadSettings(): VisionSettings {
  if (typeof window === "undefined") return DEFAULT_VISION;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? { ...DEFAULT_VISION, ...JSON.parse(stored) } : DEFAULT_VISION;
  } catch {
    return DEFAULT_VISION;
  }
}

function saveSettings(s: VisionSettings) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
}

/**
 * Apply vision settings as CSS custom properties on :root
 */
function applyToDOM(settings: VisionSettings) {
  if (typeof document === "undefined") return;

  const root = document.documentElement;
  const scheme = COLOR_SCHEMES.find((s) => s.id === settings.colorSchemeId) || COLOR_SCHEMES[0];
  const font = FONT_PROFILES[settings.fontProfileId] || FONT_PROFILES.inter;
  const fontScale = calcFontScale(settings.diopters);
  const extraSpacing = calcLetterSpacing(settings.diopters);

  // Color tokens
  root.style.setProperty("--v-bg", scheme.tokens.bg);
  root.style.setProperty("--v-bg-card", scheme.tokens.bgCard);
  root.style.setProperty("--v-bg-input", scheme.tokens.bgInput);
  root.style.setProperty("--v-text", scheme.tokens.text);
  root.style.setProperty("--v-text-muted", scheme.tokens.textMuted);
  root.style.setProperty("--v-text-dim", scheme.tokens.textDim);
  root.style.setProperty("--v-accent", scheme.tokens.accent);
  root.style.setProperty("--v-accent-muted", scheme.tokens.accentMuted);
  root.style.setProperty("--v-border", scheme.tokens.border);
  root.style.setProperty("--v-border-active", scheme.tokens.borderActive);
  root.style.setProperty("--v-danger", scheme.tokens.danger);
  root.style.setProperty("--v-success", scheme.tokens.success);
  root.style.setProperty("--v-warning", scheme.tokens.warning);
  root.style.setProperty("--v-shadow", scheme.tokens.shadow);

  // Typography
  root.style.setProperty("--v-font-family", font.family);
  root.style.setProperty("--v-font-weight", String(font.weight));
  root.style.setProperty("--v-line-height", font.lineHeight);
  root.style.setProperty("--v-letter-spacing", extraSpacing || font.letterSpacing);
  root.style.setProperty("--v-font-scale", String(fontScale * font.baseSize));

  // Contrast boost (filter)
  if (settings.contrastBoost > 0) {
    root.style.setProperty("--v-contrast", `${1 + settings.contrastBoost / 100}`);
  } else {
    root.style.setProperty("--v-contrast", "1");
  }

  // Reduce motion
  if (settings.reduceMotion) {
    root.style.setProperty("--v-motion-duration", "0.01ms");
  } else {
    root.style.setProperty("--v-motion-duration", "0.3s");
  }

  // Touch target size
  root.style.setProperty("--v-touch-min", settings.largeTouch ? "56px" : "44px");

  // Background color on body
  root.style.backgroundColor = scheme.tokens.bg;
  root.style.color = scheme.tokens.text;
}

export function VisionProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<VisionSettings>(DEFAULT_VISION);

  // Load on mount
  useEffect(() => {
    const loaded = loadSettings();
    setSettings(loaded);
    applyToDOM(loaded);
  }, []);

  const updateSettings = useCallback((partial: Partial<VisionSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...partial };
      saveSettings(next);
      applyToDOM(next);
      return next;
    });
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_VISION);
    saveSettings(DEFAULT_VISION);
    applyToDOM(DEFAULT_VISION);
  }, []);

  const currentScheme = COLOR_SCHEMES.find((s) => s.id === settings.colorSchemeId) || COLOR_SCHEMES[0];
  const currentFont = FONT_PROFILES[settings.fontProfileId] || FONT_PROFILES.inter;
  const fontScale = calcFontScale(settings.diopters);

  return (
    <VisionContext.Provider value={{ settings, updateSettings, resetSettings, currentScheme, currentFont, fontScale }}>
      {children}
    </VisionContext.Provider>
  );
}
