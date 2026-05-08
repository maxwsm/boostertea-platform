/**
 * DEBRIEF ENGINE
 * GDD §8: Глибокий дебрифінг та рефлексія
 *
 * Analyzes player action log and surfaces:
 * - Deficit vs Proficit mindset patterns
 * - Subconscious motivations
 * - Opportunity cost
 * - Hour cost evolution
 */

import { PlayerState, ActionLogEntry, calculateHourCost, calculateCurrentNetworth, getMindsetFromBanks } from "./rules";

export interface MindsetPattern {
  type: "DEFICIT" | "PROFICIT" | "NEUTRAL";
  label: string;
  color: string;
  percentage: number;
  examples: ActionLogEntry[];
}

export interface DebriefInsight {
  category: "FINANCIAL" | "MENTAL" | "SOCIAL" | "BEHAVIORAL";
  severity: "positive" | "warning" | "critical";
  title: string;
  observation: string;
  lesson: string;
  proficitReframe?: string; // How a proficit mindset would approach it
}

export interface GameDebrief {
  month: number;
  networth: number;
  mentaEnergy: number;
  hourCostNow: number;
  hourCostAtGoal: number;
  mindsetPatterns: MindsetPattern[];
  insights: DebriefInsight[];
  overallScore: number; // 0-100 composite
  overallLabel: string;
  nextMonthFocus: string[];
}

export const generateDebrief = (player: PlayerState): GameDebrief => {
  const log = player.actionLog;
  const networth = calculateCurrentNetworth(player);
  const mentalEnergy = player.banks.MENTAL.balance;
  const hourCostNow = calculateHourCost(player);
  const hourCostAtGoal = player.goalCostUSD / (player.monthsToGoal * player.hoursPerMonth);

  // ── Mindset Pattern Analysis ─────────────────────────────────
  const proficitEntries = log.filter(e => e.mindset === "PROFICIT");
  const deficitEntries = log.filter(e => e.mindset === "DEFICIT");
  const neutralEntries = log.filter(e => e.mindset === "NEUTRAL");
  const total = log.length || 1;

  const mindsetPatterns: MindsetPattern[] = [
    {
      type: "PROFICIT",
      label: "Мислення Достатку",
      color: "#00FF88",
      percentage: Math.round((proficitEntries.length / total) * 100),
      examples: proficitEntries.slice(-2),
    },
    {
      type: "DEFICIT",
      label: "Мислення Дефіциту",
      color: "#FF4444",
      percentage: Math.round((deficitEntries.length / total) * 100),
      examples: deficitEntries.slice(-2),
    },
    {
      type: "NEUTRAL",
      label: "Нейтральні дії",
      color: "#FF9500",
      percentage: Math.round((neutralEntries.length / total) * 100),
      examples: neutralEntries.slice(-1),
    },
  ];

  // ── Behavioral Insights ──────────────────────────────────────
  const insights: DebriefInsight[] = [];

  // 1. Mental Energy Level
  if (mentalEnergy < 30) {
    insights.push({
      category: "MENTAL",
      severity: "critical",
      title: "Критичне Вигоряння",
      observation: `Ментальна енергія впала до ${mentalEnergy}%. Всі рішення приймаються з позиції дефіциту.`,
      lesson: "Коли ментальний резервуар порожній, мозок переходить у режим виживання. Буквально звужується поле зору та здатність бачити можливості.",
      proficitReframe: "Відновлення — це не слабкість, це стратегічний актив. Навіть 1 тиждень усвідомленого відпочинку може розблокувати рішення, які приносять в 10x більше грошей.",
    });
  } else if (mentalEnergy >= 75) {
    insights.push({
      category: "MENTAL",
      severity: "positive",
      title: "Високий Ментальний Ресурс",
      observation: `Ментальна енергія на рівні ${mentalEnergy}%. Стратегічне вікно відкрите.`,
      lesson: "Зараз оптимальний момент для прийняття складних рішень: переговори, читання договорів, вибір нових активів.",
      proficitReframe: "Використай цей стан для дій, які вимагають найбільшої концентрації. Делегуй операційну рутину.",
    });
  }

  // 2. Deficit Patterns
  if (deficitEntries.length > proficitEntries.length) {
    const topDeficitAction = deficitEntries[0];
    insights.push({
      category: "BEHAVIORAL",
      severity: "warning",
      title: "Переважає Мислення Дефіциту",
      observation: `${Math.round((deficitEntries.length / total) * 100)}% рішень прийнято з позиції страху або нестачі. Приклад: "${topDeficitAction?.action}"`,
      lesson: "Мислення дефіциту — це не вада характеру. Це нейронна програма виживання, яка блокує стратегічне мислення. Вона перемикається через усвідомленість.",
      proficitReframe: "Запитай перед кожним рішенням: 'Я роблю це з позиції страху чи з позиції можливості?' Відповідь змінює результат.",
    });
  }

  // 3. Hour Cost Gap
  if (hourCostNow < hourCostAtGoal * 0.5) {
    insights.push({
      category: "FINANCIAL",
      severity: "warning",
      title: "Вартість Години Значно Нижча Цільової",
      observation: `Поточна вартість твоєї години: $${hourCostNow.toFixed(2)}. Необхідна для досягнення мети: $${hourCostAtGoal.toFixed(2)}.`,
      lesson: "Більшість людей намагаються заощаджувати і не помічають, що проблема не у витратах — а у вартості години. Якщо твоя година коштує $5, жодна економія не дасть $50k.",
      proficitReframe: "Сфокусуйся на підвищенні вартості години (навчання, делегування рутини, масштабування). Не на зменшенні витрат.",
    });
  }

  // 4. Social Capital
  const socialBalance = player.banks.SOCIAL.balance;
  if (socialBalance < 20) {
    insights.push({
      category: "SOCIAL",
      severity: "warning",
      title: "Низький Соціальний Капітал",
      observation: "Репутаційний рахунок критично низький. Партнери уникають угод, регулятори налаштовані вороже.",
      lesson: "Соціальний капітал — це невидима валюта, яка конвертується у фінансову під час криз. Бізнес без репутації платить в 2-3x більше за будь-яку послугу.",
      proficitReframe: "Одна прозора дія (навіть дрібна) відновлює соціальний капітал. Прозорість — найдешевший маркетинг.",
    });
  }

  // 5. Asset concentration risk
  if (player.ownedAssets.length === 1) {
    insights.push({
      category: "FINANCIAL",
      severity: "warning",
      title: "Концентрований Ризик (1 Актив)",
      observation: "100% твоїх активів в одному бізнесі. Один Чорний лебідь = фінансовий крах.",
      lesson: "Диверсифікація — це не про відсутність фокусу. Це про те, щоб жоден одиничний провал не знищував усю систему.",
      proficitReframe: "Другий актив не обов'язково великий. Навіть $500/міс. пасивного доходу зі стабільного депозиту знижує системний ризик.",
    });
  }

  // ── Overall Score ────────────────────────────────────────────
  const financialScore = Math.min(40, (networth / (player.goalCostUSD * 0.25)) * 40);
  const mentalScore = (mentalEnergy / 100) * 30;
  const socialScore = (socialBalance / 100) * 20;
  const mindsetScore = (proficitEntries.length / total) * 10;
  const overallScore = Math.round(financialScore + mentalScore + socialScore + mindsetScore);

  const overallLabel =
    overallScore >= 80 ? "Архітектор Профіциту" :
    overallScore >= 60 ? "Усвідомлений Інвестор" :
    overallScore >= 40 ? "Підприємець у Розвитку" :
    overallScore >= 20 ? "Виживання" : "Кризовий Режим";

  // ── Next Month Focus ─────────────────────────────────────────
  const nextMonthFocus: string[] = [];
  if (mentalEnergy < 40) nextMonthFocus.push("Пріоритет 1: Відновити ментальний ресурс (відпочинок + рефлексія)");
  if (networth < 0) nextMonthFocus.push("Пріоритет 1: Перекрити кровотечу — знайти перший актив з позитивним cash-flow");
  if (player.ownedAssets.length === 0) nextMonthFocus.push("Купи перший актив, навіть малий — переломний момент");
  if (player.monthlyDebts.length > 0) nextMonthFocus.push("Контролюй борговий тягар: платежі мають бути < 30% місячного доходу");
  if (nextMonthFocus.length === 0) nextMonthFocus.push("Масштабуй найефективніший актив", "Делегуй операційну рутину — підвищуй вартість своєї години");

  return {
    month: player.month,
    networth,
    mentaEnergy: mentalEnergy,
    hourCostNow,
    hourCostAtGoal,
    mindsetPatterns,
    insights,
    overallScore,
    overallLabel,
    nextMonthFocus,
  };
};
