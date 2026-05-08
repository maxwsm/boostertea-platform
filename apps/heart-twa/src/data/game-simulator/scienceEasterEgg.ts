/**
 * SCIENCE EASTER EGG ENGINE
 * 
 * HIDDEN MECHANIC (не показується гравцю до кінця гри):
 * 
 * Коли гравець отримує купюру з негативним множником (збиток),
 * він може "скинути" її в науку/AI-навчання.
 * 
 * Ефект:
 * - Негативний множник НІВЕЛЮЄТЬСЯ (збиток = 0)
 * - Створюється ПРИХОВАНИЙ інтелектуальний актив
 * - Зростає ПРИХОВАНИЙ трек впевненості
 * - Але гравець НЕ БАЧИТЬ результату одразу
 * - Ефект проявляється ЛИШЕ ЧЕРЕЗ 2 ПОВНИХ КОЛА
 * - Пояснення моторики — лише в кінці гри
 * 
 * Це точна модель реальності:
 * - Інвестиції в знання окупаються з затримкою
 * - AI/наука знімає будь-які негативні множники
 * - Паттерн "збиток → навчання" має шанс матеріалізуватись у житті
 * 
 * Якщо після розуміння гравець свідомо направляє ВСІ негативні
 * множники в науку — цей паттерн стає звичкою.
 */

export interface ScienceInvestment {
  month: number;
  originalLoss: number;           // Скільки б втратив
  currency: string;
  multiplier: string;
  topic: string;                  // Що "вивчив"
  hiddenIntellectualAsset: number; // Прихований актив (не видно гравцю)
  maturesAtCycle: number;         // Коли дозріє (поточний цикл + 2)
  isMatured: boolean;
}

export interface ScienceTracker {
  investments: ScienceInvestment[];
  hiddenConfidenceTrack: number;  // 0-100, НЕ ПОКАЗУЄТЬСЯ гравцю
  totalLossesConverted: number;   // Загальна сума конвертованих збитків
  totalIntellectualAssets: number; // Загальна вартість прихованих активів
  currentCycle: number;           // Номер поточного кола гри
  isRevealed: boolean;            // Чи розкрита пасхалка
}

export const createScienceTracker = (): ScienceTracker => ({
  investments: [],
  hiddenConfidenceTrack: 0,
  totalLossesConverted: 0,
  totalIntellectualAssets: 0,
  currentCycle: 1,
  isRevealed: false,
});

// ─── AI/SCIENCE LEARNING TOPICS ──────────────
// При "скиданні" збитку в науку, гравець обирає тему
export interface ScienceTopic {
  id: string;
  name: string;
  icon: string;
  description: string;
  multiplierAtMaturity: number; // Коефіцієнт повернення через 2 кола
  confidenceBoost: number;     // Прихований приріст впевненості
  realWorldParallel: string;   // Пояснення з реального життя
}

export const SCIENCE_TOPICS: ScienceTopic[] = [
  {
    id: "sci_ai_fundamentals",
    name: "AI Fundamentals",
    icon: "🤖",
    description: "Основи машинного навчання, нейромережі, prompt engineering",
    multiplierAtMaturity: 3.0,
    confidenceBoost: 15,
    realWorldParallel: "Підприємці які вивчили AI у 2023 році, до 2025 автоматизували 60% рутини та подвоїли дохід при тих самих годинах.",
  },
  {
    id: "sci_data_analysis",
    name: "Data Analytics",
    icon: "📊",
    description: "Аналіз даних, юніт-економіка, фінансове моделювання",
    multiplierAtMaturity: 2.5,
    confidenceBoost: 12,
    realWorldParallel: "Засновники з навичками аналізу даних приймають рішення на 40% швидше та з 60% меншою кількістю помилок (Harvard Business Review).",
  },
  {
    id: "sci_automation",
    name: "Business Automation",
    icon: "⚡",
    description: "No-code/low-code, API-інтеграції, автономні агенти",
    multiplierAtMaturity: 4.0,
    confidenceBoost: 18,
    realWorldParallel: "Один AI-агент замінює 3-5 операційних працівників. ROI автоматизації: 300-500% за перший рік.",
  },
  {
    id: "sci_behavioral_economics",
    name: "Поведінкова Економіка",
    icon: "🧠",
    description: "Когнітивні викривлення, теорія ігор, механізми прийняття рішень",
    multiplierAtMaturity: 2.0,
    confidenceBoost: 20,
    realWorldParallel: "Розуміння bias (викривлень) знижує імпульсивні рішення на 70%. Це найвищий ROI з усіх інвестицій в знання.",
  },
  {
    id: "sci_cybersecurity",
    name: "Кібербезпека",
    icon: "🔒",
    description: "Захист даних, шифрування, backup-системи, GDPR",
    multiplierAtMaturity: 2.0,
    confidenceBoost: 10,
    realWorldParallel: "Середня вартість кібератаки для малого бізнесу: $120k. Вартість базового захисту: $2k/рік.",
  },
];

// ─── CORE MECHANIC: Convert Loss to Science ──
export const investLossInScience = (
  tracker: ScienceTracker,
  lossAmount: number,
  currency: string,
  multiplier: string,
  topicId: string,
  currentMonth: number
): ScienceTracker => {
  const topic = SCIENCE_TOPICS.find(t => t.id === topicId);
  if (!topic) return tracker;

  const intellectualValue = Math.abs(lossAmount) * topic.multiplierAtMaturity;

  const investment: ScienceInvestment = {
    month: currentMonth,
    originalLoss: lossAmount,
    currency,
    multiplier,
    topic: topic.name,
    hiddenIntellectualAsset: intellectualValue,
    maturesAtCycle: tracker.currentCycle + 2,
    isMatured: false,
  };

  return {
    ...tracker,
    investments: [...tracker.investments, investment],
    hiddenConfidenceTrack: Math.min(100, tracker.hiddenConfidenceTrack + topic.confidenceBoost),
    totalLossesConverted: tracker.totalLossesConverted + Math.abs(lossAmount),
    totalIntellectualAssets: tracker.totalIntellectualAssets + intellectualValue,
  };
};

// ─── MATURITY CHECK (After 2 cycles) ─────────
export const matureInvestments = (tracker: ScienceTracker): {
  tracker: ScienceTracker;
  maturedAssets: ScienceInvestment[];
  totalMaturedValue: number;
} => {
  const maturedAssets: ScienceInvestment[] = [];
  let totalMaturedValue = 0;

  const updatedInvestments = tracker.investments.map(inv => {
    if (!inv.isMatured && tracker.currentCycle >= inv.maturesAtCycle) {
      maturedAssets.push(inv);
      totalMaturedValue += inv.hiddenIntellectualAsset;
      return { ...inv, isMatured: true };
    }
    return inv;
  });

  return {
    tracker: { ...tracker, investments: updatedInvestments },
    maturedAssets,
    totalMaturedValue,
  };
};

// ─── END-GAME REVELATION ─────────────────────
// Показується ЛИШЕ в кінці гри (debrief)
export interface ScienceRevelation {
  totalInvested: number;         // Скільки "збитків" перенаправлено
  totalReturned: number;         // Скільки повернулось як інтелектуальний актив
  roi: number;                   // ROI науки
  confidenceLevel: number;       // Прихований трек впевненості
  patternMessage: string;        // Пояснення паттерну
  lifecycleInsight: string;      // Як це працює в реальному житті
  investedTopics: string[];      // Що вивчив
}

export const generateRevelation = (tracker: ScienceTracker): ScienceRevelation | null => {
  if (tracker.investments.length === 0) return null;

  const { maturedAssets, totalMaturedValue } = matureInvestments(tracker);
  const roi = tracker.totalLossesConverted > 0
    ? ((totalMaturedValue - tracker.totalLossesConverted) / tracker.totalLossesConverted) * 100
    : 0;

  const topics = [...new Set(tracker.investments.map(i => i.topic))];

  return {
    totalInvested: tracker.totalLossesConverted,
    totalReturned: totalMaturedValue,
    roi,
    confidenceLevel: tracker.hiddenConfidenceTrack,
    investedTopics: topics,
    patternMessage: getPatternMessage(tracker),
    lifecycleInsight: getLifecycleInsight(tracker),
  };
};

const getPatternMessage = (tracker: ScienceTracker): string => {
  const ratio = tracker.investments.length;
  if (ratio === 0) return "Ти не інвестував жодного збитку в науку. Всі втрати залишились втратами.";
  if (ratio <= 2) return "Ти спробував конвертувати збитки в знання, але непослідовно. У реальному житті так само — одноразове навчання не створює паттерн.";
  if (ratio <= 5) return "Ти формуєш паттерн 'збиток → навчання'. Це вже не випадковість, це стратегія. В реальному житті такий підхід створює антикрихкість.";
  return "Ти систематично перетворюєш кожен збиток на знання. Це і є мислення профіциту: будь-яка втрата — це інвестиція у власну компетентність. Цей паттерн, якщо перенести його в реальне життя, робить тебе непереможним.";
};

const getLifecycleInsight = (tracker: ScienceTracker): string => {
  const hasAI = tracker.investments.some(i => i.topic.includes("AI"));
  const hasAutomation = tracker.investments.some(i => i.topic.includes("Automation"));

  if (hasAI && hasAutomation) {
    return "Ти інвестував в AI та автоматизацію. В реальному світі це означає: до 2027 року 40% рутинних бізнес-процесів буде автоматизовано. Ті, хто вивчив AI на фундаментальному рівні ЗАРАЗ, будуть керувати тими, хто цього не зробив. Не тому що вони розумніші — а тому що їхня година коштує в 10x більше.";
  }
  if (hasAI) {
    return "AI — це не інструмент, це нова грамотність. Як читання у XV столітті: хто не вміє — працює руками. Хто вміє — керує тими, хто працює руками. Твоя інвестиція в AI-навчання — це найвищий ROI з усіх можливих інвестицій у 2024-2030.";
  }
  return "Кожен збиток, вкладений у знання, повертається мультиплікатором. В житті цей ефект проявляється через 1-3 роки (в грі — через 2 кола). Більшість людей не бачать цього зв'язку, бо шукають миттєвого результату.";
};

// ─── UI HELPER: What player sees vs what's hidden ─
export const getVisibleAction = (): { label: string; description: string } => ({
  label: "📚 Вкласти в науку / AI",
  description: "Перенаправити збиток на навчання. Ефект невідомий.",
});
