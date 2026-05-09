/**
 * VISION COLOR SCHEMES & FONT PROFILES
 * 
 * Each scheme has a sensory description — what the user
 * physically FEELS when looking at these colors.
 * Based on chromotherapy and neuro-accessibility research.
 */

import type { ColorScheme, FontProfile } from "./VisionTypes";

// ─── FONT PROFILES ─────────────────────────
export const FONT_PROFILES: Record<string, FontProfile> = {
  inter: {
    family: "'Inter', sans-serif",
    googleFontUrl: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap",
    weight: 400,
    letterSpacing: "0em",
    lineHeight: "1.6",
    baseSize: 1,
    description: "Універсальний. Чіткі контури, нейтральна геометрія.",
    bestFor: "Нормальний зір, міопія до -2",
  },
  atkinson: {
    family: "'Atkinson Hyperlegible', sans-serif",
    googleFontUrl: "https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible+Next:wght@400;500;700&display=swap",
    weight: 400,
    letterSpacing: "0.015em",
    lineHeight: "1.7",
    baseSize: 1.05,
    description: "Створений Braille Institute. Кожна літера максимально відрізняється від інших — 'b' ніколи не зплутати з 'd'.",
    bestFor: "Астигматизм, висока міопія, дислексія",
  },
  lexend: {
    family: "'Lexend', sans-serif",
    googleFontUrl: "https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700&display=swap",
    weight: 400,
    letterSpacing: "0.01em",
    lineHeight: "1.65",
    baseSize: 1.03,
    description: "Оптимізований для швидкості читання. Знижує когнітивне навантаження на 30%.",
    bestFor: "РДУГ, когнітивне виснаження, гіперопія",
  },
  outfit: {
    family: "'Outfit', sans-serif",
    googleFontUrl: "https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap",
    weight: 400,
    letterSpacing: "0.005em",
    lineHeight: "1.6",
    baseSize: 1,
    description: "Геометричний, преміальний. Однорідна товщина штрихів знижує навантаження при астигматизмі.",
    bestFor: "Нормальний зір, легка міопія, преміум-відчуття",
  },
  "jetbrains-mono": {
    family: "'JetBrains Mono', monospace",
    googleFontUrl: "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&display=swap",
    weight: 400,
    letterSpacing: "0em",
    lineHeight: "1.6",
    baseSize: 0.95,
    description: "Моноширинний. Кожен символ однакової ширини — мозок витрачає менше енергії на парсинг.",
    bestFor: "РДУГ (люблять структуру), розробники, аналітики",
  },
};

// ─── COLOR SCHEMES ─────────────────────────
export const COLOR_SCHEMES: ColorScheme[] = [
  {
    id: "graphite",
    name: "Графітове тепло",
    sensoryDescription: "Відчуття теплого каменю під долонями. М'яка темрява, як вечір біля каміну. Очі відпочивають — немає різких контрастів. Парасимпатика активується: дихання уповільнюється, плечі опускаються.",
    bestFor: "Нормальний зір. Вечірнє використання. Зниження кортизолу.",
    tokens: {
      bg: "#0D0F12",
      bgCard: "rgba(247,245,240,0.03)",
      bgInput: "rgba(247,245,240,0.05)",
      text: "#F7F5F0",
      textMuted: "rgba(247,245,240,0.6)",
      textDim: "rgba(247,245,240,0.3)",
      accent: "#6a9cbb",
      accentMuted: "rgba(106,156,187,0.15)",
      border: "rgba(247,245,240,0.08)",
      borderActive: "rgba(106,156,187,0.4)",
      danger: "#ef4444",
      success: "#9fb29f",
      warning: "#d9a05b",
      shadow: "rgba(0,0,0,0.3)",
    },
  },
  {
    id: "high_contrast",
    name: "Кристальна ясність",
    sensoryDescription: "Як крижане повітря гірського ранку. Кожна буква вирізана в камені — чітко, безкомпромісно. Очі не напружуються шукаючи межі тексту. Для тих, хто втомився від розмитості світу.",
    bestFor: "Міопія -3 і вище. Гіперопія. Погане освітлення. Літній вік.",
    tokens: {
      bg: "#000000",
      bgCard: "rgba(255,255,255,0.06)",
      bgInput: "rgba(255,255,255,0.08)",
      text: "#FFFFFF",
      textMuted: "rgba(255,255,255,0.75)",
      textDim: "rgba(255,255,255,0.45)",
      accent: "#5CB8FF",
      accentMuted: "rgba(92,184,255,0.2)",
      border: "rgba(255,255,255,0.15)",
      borderActive: "rgba(92,184,255,0.6)",
      danger: "#FF5555",
      success: "#55FF55",
      warning: "#FFBB33",
      shadow: "rgba(0,0,0,0.5)",
    },
  },
  {
    id: "warm_amber",
    name: "Вечірнє сяйво",
    sensoryDescription: "Як світло старої лампи в бібліотеці. Бурштинове тепло обволікає — очі перестають боліти. Синє світло повністю прибране. Мелатонін зберігається. Ідеально перед сном, коли мозок і так перевантажений.",
    bestFor: "Вечірнє/нічне використання. Мігрені. Світлочутливість. Безсоння.",
    tokens: {
      bg: "#1A1410",
      bgCard: "rgba(217,160,91,0.05)",
      bgInput: "rgba(217,160,91,0.08)",
      text: "#F5E6D0",
      textMuted: "rgba(245,230,208,0.65)",
      textDim: "rgba(245,230,208,0.35)",
      accent: "#D9A05B",
      accentMuted: "rgba(217,160,91,0.15)",
      border: "rgba(217,160,91,0.12)",
      borderActive: "rgba(217,160,91,0.4)",
      danger: "#CC6644",
      success: "#88AA66",
      warning: "#DDAA44",
      shadow: "rgba(0,0,0,0.4)",
    },
  },
  {
    id: "ocean_depth",
    name: "Глибоке занурення",
    sensoryDescription: "Як зануритися під воду — синій та бірюзовий огортають. Периферійний зір заспокоюється. Фокус звужується до центру екрану. Для тих, хто потребує глибокої концентрації без відволікань.",
    bestFor: "РДУГ. Тривожність. Потреба у фокусі. Робота з текстом.",
    tokens: {
      bg: "#0A1520",
      bgCard: "rgba(106,156,187,0.06)",
      bgInput: "rgba(106,156,187,0.08)",
      text: "#D0E8F5",
      textMuted: "rgba(208,232,245,0.65)",
      textDim: "rgba(208,232,245,0.35)",
      accent: "#4DA8DA",
      accentMuted: "rgba(77,168,218,0.15)",
      border: "rgba(106,156,187,0.12)",
      borderActive: "rgba(77,168,218,0.5)",
      danger: "#E06060",
      success: "#60C0A0",
      warning: "#D0A040",
      shadow: "rgba(0,0,0,0.4)",
    },
  },
  {
    id: "forest",
    name: "Лісова тиша",
    sensoryDescription: "Зелений — єдиний колір, для якого очне яблуко НЕ напружується. Рецептори сітківки працюють у режимі мінімальної затрати. Як лежати на траві, дивлячись у крону дерев. Заземлення через зір.",
    bestFor: "Тривале читання. Астигматизм. Відновлення після екранів. Заземлення.",
    tokens: {
      bg: "#0E1510",
      bgCard: "rgba(159,178,159,0.05)",
      bgInput: "rgba(159,178,159,0.07)",
      text: "#D5E8D5",
      textMuted: "rgba(213,232,213,0.65)",
      textDim: "rgba(213,232,213,0.35)",
      accent: "#6B9B6B",
      accentMuted: "rgba(107,155,107,0.15)",
      border: "rgba(159,178,159,0.1)",
      borderActive: "rgba(107,155,107,0.45)",
      danger: "#CC6655",
      success: "#77BB77",
      warning: "#BBAA55",
      shadow: "rgba(0,0,0,0.35)",
    },
  },
  {
    id: "sepia",
    name: "Пергамент",
    sensoryDescription: "Як читати стару книгу при свічці. Папір з відтінком слонової кості, чорнильний текст. Очі отримують сигнал 'це безпечно, це знайомо'. Для тих, кого дратують яскраві екрани та хто звик до паперу.",
    bestFor: "Літній вік. Гіперопія. Ті, хто звик до паперу. Довге читання.",
    tokens: {
      bg: "#F5F0E8",
      bgCard: "rgba(80,60,40,0.05)",
      bgInput: "rgba(80,60,40,0.07)",
      text: "#2C2416",
      textMuted: "rgba(44,36,22,0.65)",
      textDim: "rgba(44,36,22,0.35)",
      accent: "#8B6B3D",
      accentMuted: "rgba(139,107,61,0.15)",
      border: "rgba(44,36,22,0.1)",
      borderActive: "rgba(139,107,61,0.4)",
      danger: "#AA4444",
      success: "#558844",
      warning: "#AA8833",
      shadow: "rgba(44,36,22,0.1)",
    },
  },
];

/**
 * Get recommended settings based on diopters
 */
export function getRecommendedSettings(diopters: number, astigmatism: boolean): {
  fontId: string;
  schemeId: string;
  contrastBoost: number;
} {
  const abs = Math.abs(diopters);

  if (astigmatism) {
    return { fontId: "atkinson", schemeId: "forest", contrastBoost: 20 };
  }
  if (abs <= 0.5) {
    return { fontId: "inter", schemeId: "graphite", contrastBoost: 0 };
  }
  if (diopters < -3) {
    return { fontId: "atkinson", schemeId: "high_contrast", contrastBoost: 30 };
  }
  if (diopters < 0) {
    return { fontId: "lexend", schemeId: "graphite", contrastBoost: 10 };
  }
  if (diopters > 2) {
    return { fontId: "lexend", schemeId: "sepia", contrastBoost: 15 };
  }
  return { fontId: "inter", schemeId: "graphite", contrastBoost: 0 };
}
