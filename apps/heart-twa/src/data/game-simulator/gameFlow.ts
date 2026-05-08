/**
 * GAME FLOW ENGINE — 13 Steps to Goal
 * 
 * Pre-game form → Individual event line generation
 * Black Swans trigger AT THE MOMENT of action (currency + multiplier)
 * Consequences can be liquidated via: logic puzzle OR asset sale
 */

import { PlayerState, CurrencyType, BILLS, createInitialPlayer } from "./rules";

// ─── STEP STRUCTURE ──────────────────────────
export type GamePhase = 
  | "ONBOARDING"   // Pre-game form
  | "PLAYING"      // 13 steps
  | "DEBRIEF";     // Reflection

export interface GameStep {
  number: number; // 1-13
  title: string;
  category: "SETUP" | "ACTION" | "CRISIS" | "REFLECTION";
  description: string;
}

export const GAME_STEPS: GameStep[] = [
  { number: 1, title: "Визнач напрямок", category: "SETUP", description: "Виробництво, послуги чи рітейл?" },
  { number: 2, title: "Визнач нішу", category: "SETUP", description: "Конкретний ринок та продукт." },
  { number: 3, title: "Визнач мотивацію", category: "SETUP", description: "Чому саме це? Що рухає тобою?" },
  { number: 4, title: "Підважити вибір", category: "REFLECTION", description: "Чи витримує вибір 1 і 2 перевірку мотивацією?" },
  { number: 5, title: "Фінансова мета", category: "SETUP", description: "Скільки грошей тобі потрібно об'єктивно?" },
  { number: 6, title: "Особиста мета", category: "SETUP", description: "Що ти хочеш відчувати, коли досягнеш мети?" },
  { number: 7, title: "Критерій досягнення", category: "REFLECTION", description: "Як ти зрозумієш, що мета досягнута?" },
  { number: 8, title: "Перший капітал", category: "ACTION", description: "Отримай фінансування та розпочни." },
  { number: 9, title: "Перший актив", category: "ACTION", description: "Купи або створи перший актив." },
  { number: 10, title: "Перша криза", category: "CRISIS", description: "Чорний лебідь перевіряє стійкість." },
  { number: 11, title: "Масштабування", category: "ACTION", description: "Реінвестуй, делегуй, зростай." },
  { number: 12, title: "Другий актив", category: "ACTION", description: "Диверсифікуй або поглибюй." },
  { number: 13, title: "Рефлексія мети", category: "REFLECTION", description: "Чи досягнуто мету? Яка справжня вартість шляху?" },
];

// ─── MULTIPLIER SYSTEM ──────────────────────
export type BillMultiplier = "x2" | "x5" | "x10" | "minus20" | "minus50";

export interface MultiplierConfig {
  id: BillMultiplier;
  label: string;
  factor: number;
  blackSwanChance: number; // Probability of Black Swan at action moment
  color: string;
}

export const MULTIPLIERS: MultiplierConfig[] = [
  { id: "minus20", label: "-20%", factor: -0.20, blackSwanChance: 0.05, color: "#FF6B6B" },
  { id: "minus50", label: "-50%", factor: -0.50, blackSwanChance: 0.10, color: "#FF4444" },
  { id: "x2", label: "×2", factor: 2.0, blackSwanChance: 0.15, color: "#00FF88" },
  { id: "x5", label: "×5", factor: 5.0, blackSwanChance: 0.30, color: "#FF9500" },
  { id: "x10", label: "×10", factor: 10.0, blackSwanChance: 0.50, color: "#FF00FF" },
];

// ─── PLAYER PROFILE (Pre-game) ───────────────
export interface PlayerProfile {
  // Demographics (Human Design context)
  name: string;
  age: number;
  birthDay: number;
  birthMonth: number;
  birthYear: number;
  humanDesignNote: string; // "Для розуміння циклів Сатурна (28-30 р.), Хірона (50 р.) та вікових криз"

  // Experience calibration
  biggestEarned: number;          // Найбільша зароблена сума / актив
  biggestEarnedDescription: string;
  biggestLost: number;            // Найбільша втрачена сума / актив
  biggestLostDescription: string;
  biggestAchievement: string;     // Найбільше досягнення
  biggestAchievementLost: string; // Найбільше втрачене досягнення

  // Game direction
  excitingNiche: string;          // Яка ніша запалює
}

export interface OnboardingForm {
  profile: PlayerProfile;
  direction: "PRODUCTION" | "SERVICES" | "RETAIL" | null;
  niche: string;
  motivation: string;
  financialGoal: number;
  personalGoal: string;
  successCriteria: string;
  riskTolerance: number; // 1-10
  stressResilience: number; // 1-10
}

export const createEmptyProfile = (): PlayerProfile => ({
  name: "",
  age: 0,
  birthDay: 1,
  birthMonth: 1,
  birthYear: 1995,
  humanDesignNote: "Вік та дата народження використовуються для визначення циклу Сатурна (28-30 р.) та Хірона (50 р.), які впливають на тип криз та можливостей у грі.",
  biggestEarned: 0,
  biggestEarnedDescription: "",
  biggestLost: 0,
  biggestLostDescription: "",
  biggestAchievement: "",
  biggestAchievementLost: "",
  excitingNiche: "",
});

export const createEmptyForm = (): OnboardingForm => ({
  profile: createEmptyProfile(),
  direction: null,
  niche: "",
  motivation: "",
  financialGoal: 50000,
  personalGoal: "",
  successCriteria: "",
  riskTolerance: 5,
  stressResilience: 5,
});

// ─── HUMAN DESIGN LIFE CYCLES ────────────────
export const getLifeCycleInsight = (birthYear: number): string => {
  const age = new Date().getFullYear() - birthYear;
  if (age < 18) return "Формування. Гра допоможе закласти правильні нейронні зв'язки ДО першого бізнес-досвіду.";
  if (age < 25) return "Пошук. Ідеальний час для ризику — мало зобов'язань, максимум енергії. Помилки зараз коштують найдешевше.";
  if (age >= 28 && age <= 30) return "Повернення Сатурна (28-30 р.). Криза ідентичності: хто я насправді? Рішення цього періоду визначають наступні 30 років.";
  if (age < 40) return "Будівництво. Фокус на системних активах та довгострокових рішеннях. Час капіталізувати досвід 20-х.";
  if (age >= 49 && age <= 51) return "Повернення Хірона (50 р.). Глибока переоцінка: чи живу я своє життя? Час зцілення старих ран та рішень.";
  if (age < 60) return "Зрілість. Максимальний досвід + капітал. Час для менторства та побудови спадщини.";
  return "Мудрість. Передача знань наступному поколінню — найцінніший актив.";
};

// ─── DIFFICULTY CALIBRATION ──────────────────
export const calibrateDifficulty = (profile: PlayerProfile): { startingCash: number; eventIntensity: number; awarenessStart: number } => {
  const expRatio = profile.biggestLost > 0 ? profile.biggestEarned / profile.biggestLost : 1;
  const age = profile.age || (new Date().getFullYear() - profile.birthYear);

  // Experienced players get harder events, more starting cash
  if (expRatio > 5 && age > 30) return { startingCash: 15000, eventIntensity: 1.5, awarenessStart: 7 };
  if (expRatio > 2) return { startingCash: 10000, eventIntensity: 1.2, awarenessStart: 6 };
  if (age < 20) return { startingCash: 3000, eventIntensity: 0.7, awarenessStart: 4 };
  return { startingCash: 5000, eventIntensity: 1.0, awarenessStart: 5 };
};

// ─── LOGIC PUZZLES (to liquidate Black Swan) ─
export interface LogicPuzzle {
  id: string;
  topic: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const LOGIC_PUZZLES: LogicPuzzle[] = [
  {
    id: "p1", topic: "Грошовий потік",
    question: "Бізнес генерує $10k/міс. доходу та має $8k/міс. витрат. Чи вигідно взяти кредит $50k під 2%/міс. на розширення?",
    options: ["Так, бо дохід перекриває кредит", "Ні, бо вільний потік лише $2k, а платіж буде $1k", "Потрібно більше даних"],
    correctIndex: 1,
    explanation: "Вільний потік $2k. Платіж $1k = 50% вільного потоку. Ризик: будь-яка криза знищить запас. Безпечно — не більше 30%."
  },
  {
    id: "p2", topic: "Альтернативна вартість",
    question: "Твоя година коштує $25. Ти витрачаєш 4 години на ремонт офісу замість найму за $80. Скільки ти реально заплатив?",
    options: ["$0 — зробив сам", "$80 — стільки коштує майстер", "$100 — 4 год × $25"],
    correctIndex: 2,
    explanation: "Opportunity cost: 4 × $25 = $100 втраченого доходу. Плюс фізична втома. Реальна вартість 'безкоштовної' роботи — $100."
  },
  {
    id: "p3", topic: "Диверсифікація",
    question: "У тебе 1 бізнес з прибутком $5k/міс. Куди направити профіцит?",
    options: ["Весь у цей бізнес (максимізація)", "50% сюди + 50% у новий актив", "Заощадити 100% на депозит"],
    correctIndex: 1,
    explanation: "Концентрація = крихкість. Диверсифікація не знижує фокус — вона захищає від руйнування одним Чорним лебедем."
  },
];

export const getRandomPuzzle = (): LogicPuzzle => {
  return LOGIC_PUZZLES[Math.floor(Math.random() * LOGIC_PUZZLES.length)];
};
