/**
 * PROFICIT SIMULATOR — GAME RULES ENGINE
 * Based on GDD v2.0 (Full Specification)
 *
 * Implements:
 * - Heterogeneous currency system (USD, EUR, UAH)
 * - Dual capital: Financial + Mental
 * - Three-bank ecosystem
 * - Startup funding mechanics
 */

// ─────────────────────────────────────────────
// CURRENCY SYSTEM
// ─────────────────────────────────────────────
export type CurrencyType = "USD_100" | "EUR_100" | "EUR_500" | "UAH_1000";

export interface CurrencyBill {
  id: CurrencyType;
  symbol: string;
  displayName: string;
  baseValueUSD: number;
  semanticRole: string;
  mentalMultiplier: number;   // Mental ROI modifier when used
  materialMultiplier: number; // Financial ROI modifier when invested
  riskProfile: "low" | "medium" | "high" | "extreme";
  historicalNote: string;
}

export const BILLS: Record<CurrencyType, CurrencyBill> = {
  USD_100: {
    id: "USD_100",
    symbol: "$100",
    displayName: "100 Доларів США",
    baseValueUSD: 100,
    semanticRole: "Глобальна ліквідність та стабільність. Базові операції та міжнародні акції.",
    mentalMultiplier: 1.0,
    materialMultiplier: 1.0,
    riskProfile: "medium",
    historicalNote: "Резервна валюта світу з 1944 р. (Бреттон-Вудська система). Висока прогнозованість.",
  },
  EUR_100: {
    id: "EUR_100",
    symbol: "€100",
    displayName: "100 Євро",
    baseValueUSD: 110,
    semanticRole: "Консервативні активи, SRI-інвестування (соціально-відповідальне). Збереження капіталу.",
    mentalMultiplier: 1.4,
    materialMultiplier: 0.7,
    riskProfile: "low",
    historicalNote: "Символ європейської стабільності. Захищена активами ЄЦБ.",
  },
  EUR_500: {
    id: "EUR_500",
    symbol: "€500",
    displayName: "500 Євро (\"Бен Ладен\")",
    baseValueUSD: 550,
    semanticRole: "Тіньова економіка, надризикові активи, спекулятивна крипта. Максимальні мультиплікатори АБО нуль.",
    mentalMultiplier: -0.5, // Constant anxiety cost
    materialMultiplier: 3.5, // Can 3.5x OR zero out
    riskProfile: "extreme",
    historicalNote: "ЄЦБ припинив випуск у 2018 р. — 30% від вартості готівки Єврозони, лише 3% за обсягом. Неформальна назва через зв'язок з тіньовими операціями.",
  },
  UAH_1000: {
    id: "UAH_1000",
    symbol: "₴1000",
    displayName: "1000 Гривень",
    baseValueUSD: 24,
    semanticRole: "Локальна операційна ліквідність. Малий бізнес та базові потреби. Схильна до інфляції.",
    mentalMultiplier: 0.8,
    materialMultiplier: 1.2,
    riskProfile: "medium",
    historicalNote: "Введена в 1996 р. Вразлива до інфляції, але є первинним інструментом локального ринку.",
  },
};

// ─────────────────────────────────────────────
// THREE-BANK ECOSYSTEM
// ─────────────────────────────────────────────
export type BankType = "FINANCIAL" | "SOCIAL" | "MENTAL";

export interface BankAccount {
  type: BankType;
  name: string;
  description: string;
  balance: number;
  maxCapacity?: number;
}

export const createInitialBanks = (): Record<BankType, BankAccount> => ({
  FINANCIAL: {
    type: "FINANCIAL",
    name: "Фінансовий Банк",
    description: "Традиційні операції: кредити, депозити, готівка.",
    balance: 5000,
  },
  SOCIAL: {
    type: "SOCIAL",
    name: "Соціальний Банк",
    description: "Репутаційний капітал. Зростає від етичних рішень, знижується від скандалів.",
    balance: 50,
    maxCapacity: 100,
  },
  MENTAL: {
    type: "MENTAL",
    name: "Ментальний Банк",
    description: "Когнітивна та емоційна енергія. Критично важливий для якості рішень.",
    balance: 80,
    maxCapacity: 100,
  },
});

// ─────────────────────────────────────────────
// STARTUP FUNDING INSTRUMENTS
// ─────────────────────────────────────────────
export type FundingType = "FRIENDS_FAMILY" | "BANK_LOAN" | "EQUITY_SALE" | "SELF_FUNDED";

export interface FundingInstrument {
  id: FundingType;
  name: string;
  description: string;
  availableAmount: number;
  monthlyInterestRate: number; // 0 for equity/self
  monthlyMentalCost: number;  // Emotional pressure per month
  upfrontMentalCost: number;  // One-time psychological cost
  tradeoffs: string[];
}

export const FUNDING_INSTRUMENTS: Record<FundingType, FundingInstrument> = {
  FRIENDS_FAMILY: {
    id: "FRIENDS_FAMILY",
    name: "Гроші Друзів та Родини (F&F)",
    description: "Найпоширеніше 'посівне' фінансування. Нульова ставка, але величезний соціальний тиск.",
    availableAmount: 10000,
    monthlyInterestRate: 0,
    monthlyMentalCost: 15, // Postoyanny pressure from relatives
    upfrontMentalCost: 5,
    tradeoffs: [
      "Щомісячні розмови 'ну як там справи?' при сімейних вечерях",
      "Почуття провини при першій невдачі",
      "Розмиття меж між особистим і бізнесом",
      "Ризик втрати стосунків при провалі",
    ],
  },
  BANK_LOAN: {
    id: "BANK_LOAN",
    name: "Банківський Кредит",
    description: "Формальний борг. Чіткий графік платежів, висока ставка. Без емоційного тиску.",
    availableAmount: 25000,
    monthlyInterestRate: 1.5, // ~18% per year
    monthlyMentalCost: 3, // Only financial stress, no personal
    upfrontMentalCost: 2,
    tradeoffs: [
      "Фіксований платіж $375/місяць зменшує грошовий потік",
      "Вимагає застави або поручителя",
      "Банк не цікавиться твоїми переживаннями",
      "Прострочення — штрафи та кредитна історія",
    ],
  },
  EQUITY_SALE: {
    id: "EQUITY_SALE",
    name: "Продаж Частки (Equity)",
    description: "Інвестор купує корпоративні права. Без відсотків, але втрата контролю.",
    availableAmount: 50000,
    monthlyInterestRate: 0,
    monthlyMentalCost: 8, // Investor pressure for results
    upfrontMentalCost: 10,
    tradeoffs: [
      "Втрата 20-40% частки в бізнесі",
      "Інвестор може вимагати зміни стратегії",
      "Необхідність щомісячної звітності",
      "Складний вихід при розбіжностях",
    ],
  },
  SELF_FUNDED: {
    id: "SELF_FUNDED",
    name: "Власний Капітал (Bootstrapping)",
    description: "Повна незалежність. Повільне зростання, але абсолютна автономія.",
    availableAmount: 3000,
    monthlyInterestRate: 0,
    monthlyMentalCost: 0,
    upfrontMentalCost: 0,
    tradeoffs: [
      "Обмежений старт — складніше масштабуватись",
      "Весь ризик на тобі",
      "Повна свобода рішень",
      "Максимальна мотивація (skin in the game)",
    ],
  },
};

// ─────────────────────────────────────────────
// PLAYER STATE
// ─────────────────────────────────────────────
export interface PlayerState {
  id: string;
  name: string;
  month: number; // Game month
  banks: Record<BankType, BankAccount>;
  monthlyDebts: MonthlyDebt[];
  ownedAssets: OwnedAsset[];
  goalDescription: string;
  goalCostUSD: number;
  monthsToGoal: number;
  hoursPerMonth: number;
  awarenessLevel: number; // 1-10, core stat that affects all outcomes
  // History
  actionLog: ActionLogEntry[];
}

export interface MonthlyDebt {
  source: FundingType;
  originalAmount: number;
  remainingAmount: number;
  monthlyPayment: number;
  monthlyMentalCost: number;
  monthsRemaining: number;
}

export interface OwnedAsset {
  businessId: string;
  purchasePrice: number;
  monthlyRevenue: number;
  monthlyExpenses: number;
  healthScore: number; // 0-100, degrades with low mental energy
}

export interface ActionLogEntry {
  month: number;
  action: string;
  financialDelta: number;
  mentalDelta: number;
  socialDelta: number;
  mindset: "PROFICIT" | "DEFICIT" | "NEUTRAL";
  lesson?: string;
}

// ─────────────────────────────────────────────
// HELPER CALCULATIONS
// ─────────────────────────────────────────────
export const calculateHourCost = (player: PlayerState): number => {
  if (player.hoursPerMonth <= 0 || player.monthsToGoal <= 0) return 0;
  return player.goalCostUSD / (player.monthsToGoal * player.hoursPerMonth);
};

export const calculateCurrentNetworth = (player: PlayerState): number => {
  const cash = player.banks.FINANCIAL.balance;
  const assetValue = player.ownedAssets.reduce((sum, a) => sum + a.purchasePrice * (a.healthScore / 100), 0);
  const totalDebt = player.monthlyDebts.reduce((sum, d) => sum + d.remainingAmount, 0);
  return cash + assetValue - totalDebt;
};

export const getMindsetFromBanks = (mental: number): "PROFICIT" | "DEFICIT" | "NEUTRAL" => {
  if (mental >= 70) return "PROFICIT";
  if (mental <= 30) return "DEFICIT";
  return "NEUTRAL";
};

export const createInitialPlayer = (name: string): PlayerState => ({
  id: `player_${Date.now()}`,
  name,
  month: 1,
  banks: createInitialBanks(),
  monthlyDebts: [],
  ownedAssets: [],
  goalDescription: "Власна квартира + $5k пасивного доходу в місяць",
  goalCostUSD: 80000,
  monthsToGoal: 36,
  hoursPerMonth: 160,
  awarenessLevel: 5,
  actionLog: [],
});
