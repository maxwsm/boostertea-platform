/**
 * VISION ADAPTATION TYPES
 * 
 * Clinical-grade vision accessibility system.
 * Diopter-calibrated font scaling, letter spacing,
 * and sensory-described color schemes.
 */

export type DioptrieRange = number; // -8.0 to +8.0

export type VisionCondition =
  | "normal"       // 0 diopters
  | "myopia_mild"  // -0.5 to -3.0
  | "myopia_mod"   // -3.0 to -6.0
  | "myopia_high"  // -6.0+
  | "hyperopia_mild" // +0.5 to +2.0
  | "hyperopia_mod"  // +2.0 to +5.0
  | "hyperopia_high" // +5.0+
  | "astigmatism";

export type FontProfile = {
  family: string;
  googleFontUrl?: string;
  weight: number;
  letterSpacing: string;
  lineHeight: string;
  baseSize: number;       // rem multiplier relative to 1rem=16px
  description: string;
  bestFor: string;
};

export type ColorSchemeId =
  | "graphite"
  | "high_contrast"
  | "warm_amber"
  | "ocean_depth"
  | "forest"
  | "sepia";

export interface ColorScheme {
  id: ColorSchemeId;
  name: string;
  sensoryDescription: string;  // What user FEELS looking at this
  bestFor: string;
  tokens: {
    bg: string;
    bgCard: string;
    bgInput: string;
    text: string;
    textMuted: string;
    textDim: string;
    accent: string;
    accentMuted: string;
    border: string;
    borderActive: string;
    danger: string;
    success: string;
    warning: string;
    shadow: string;
  };
}

export interface VisionSettings {
  diopters: DioptrieRange;
  hasAstigmatism: boolean;
  fontProfileId: string;
  colorSchemeId: ColorSchemeId;
  contrastBoost: number;     // 0-100, extra contrast %
  reduceMotion: boolean;
  largeTouch: boolean;       // bigger touch targets
}

export const DEFAULT_VISION: VisionSettings = {
  diopters: 0,
  hasAstigmatism: false,
  fontProfileId: "inter",
  colorSchemeId: "graphite",
  contrastBoost: 0,
  reduceMotion: false,
  largeTouch: false,
};

/**
 * Detect vision condition from diopter value
 */
export function detectVisionCondition(diopters: number, astigmatism: boolean): VisionCondition {
  if (astigmatism) return "astigmatism";
  if (diopters >= -0.25 && diopters <= 0.25) return "normal";
  if (diopters < 0) {
    if (diopters >= -3) return "myopia_mild";
    if (diopters >= -6) return "myopia_mod";
    return "myopia_high";
  }
  if (diopters <= 2) return "hyperopia_mild";
  if (diopters <= 5) return "hyperopia_mod";
  return "hyperopia_high";
}

/**
 * Calculate font size multiplier from diopters
 * Clinical: every -1 diopter ≈ +6% text size needed
 */
export function calcFontScale(diopters: number): number {
  const absDiopters = Math.abs(diopters);
  if (absDiopters <= 0.5) return 1.0;
  return 1.0 + absDiopters * 0.06;
}

/**
 * Calculate letter spacing from diopters
 * Higher diopters need more spacing for readability
 */
export function calcLetterSpacing(diopters: number): string {
  const absDiopters = Math.abs(diopters);
  if (absDiopters <= 1) return "0em";
  if (absDiopters <= 3) return "0.01em";
  if (absDiopters <= 5) return "0.02em";
  return "0.03em";
}
