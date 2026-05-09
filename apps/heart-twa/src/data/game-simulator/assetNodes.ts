/**
 * ASSET NODES — 4 DECISION VECTORS
 * GDD §3: Вектори прийняття рішень
 *
 * Vector 1: Хотєлки (Mystery Random desire mechanic)
 * Vector 2: Базові потреби (Awareness-scaled cost)
 * Vector 3: Купівля активів (Business investment with unit economics)
 * Vector 4: Мета (Goal decomposition + hour cost)
 */

import { PlayerState, getMindsetFromBanks, CurrencyBill, BILLS, CurrencyType } from "./rules";

// ─────────────────────────────────────────────
// SHARED TYPES
// ─────────────────────────────────────────────
export interface ActionResult {
  financialDelta: number;
  mentalDelta: number;
  socialDelta: number;
  mindset: "PROFICIT" | "DEFICIT" | "NEUTRAL";
  title: string;
  message: string;
  lesson: string;
  isBlackSwan?: boolean;
}

// ─────────────────────────────────────────────
// VECTOR 1: ХОТЄЛКИ (Desires — Mystery Random)
// ─────────────────────────────────────────────
export interface DesireAction {
  id: string;
  label: string;
  description: string;
  cost: number;
  currency: CurrencyType;
  consciousOutcome: ActionResult;   // High awareness → positive experience
  unconsciousOutcome: ActionResult; // Low awareness → Mystery Random disaster
  awarenessThreshold: number;       // Min awareness for conscious outcome
}

export const DESIRE_ACTIONS: DesireAction[] = [
  {
    id: "desire_escort",
    label: "Зняти ескорт (стрес-розрядка)",
    description: "Гравець відчуває стрес і хоче «відпочити» через імпульсивну взаємодію.",
    cost: 300,
    currency: "USD_100",
    awarenessThreshold: 6,
    consciousOutcome: {
      financialDelta: -300,
      mentalDelta: 20,
      socialDelta: 0,
      mindset: "PROFICIT",
      title: "Усвідомлений вибір",
      message: "Ти розумієш, що тобі потрібно: відновлення, а не тікання від проблем. Ти отримав справжній відпочинок.",
      lesson: "Усвідомлена потреба у відновленні — це не слабкість. Знання своїх потреб захищає від імпульсивних рішень.",
    },
    unconsciousOutcome: {
      financialDelta: -4500,
      mentalDelta: -60,
      socialDelta: -40,
      mindset: "DEFICIT",
      title: "Mystery Random: Катастрофа",
      message: "Недбалість → хвороба → партнер дізнався. Медичні рахунки, скандал, розподіл майна. Замість відпочинку — криза.",
      lesson: "Ти керувався тваринним 'хочу і вже', не запитавши: 'Коли я востаннє думав про свою сексуальність усвідомлено?' Неусвідомлена дія в 15x дорожча за дію усвідомлену.",
      isBlackSwan: true,
    },
  },
  {
    id: "desire_luxury_gadget",
    label: "Купити новий iPhone Pro Max",
    description: "Останній флагман. Усі колеги вже мають.",
    cost: 1500,
    currency: "USD_100",
    awarenessThreshold: 5,
    consciousOutcome: {
      financialDelta: -1500,
      mentalDelta: 15,
      socialDelta: 5,
      mindset: "PROFICIT",
      title: "Інструмент, а не статус",
      message: "Ти купив гаджет тому що він реально покращить твою продуктивність, а не для демонстрації.",
      lesson: "Купівля інструментів — це інвестиція. Важливо знати різницю між 'я хочу' і 'мені потрібно'.",
    },
    unconsciousOutcome: {
      financialDelta: -1500,
      mentalDelta: 5,
      socialDelta: 10,
      mindset: "DEFICIT",
      title: "Соціальний конформізм",
      message: "Дофамін спалахнув і згас за 3 дні. Ти купив не телефон, а схвалення оточення.",
      lesson: "Імпульсивне споживання дає короткий дофаміновий сплеск, що швидко гасне. Щоразу відстань від мети зростає.",
    },
  },
  {
    id: "desire_vacation",
    label: "Тиждень у Балі (відпустка)",
    description: "Гравець виснажений і хоче повноцінного відпочинку.",
    cost: 2500,
    currency: "EUR_100",
    awarenessThreshold: 4,
    consciousOutcome: {
      financialDelta: -2500,
      mentalDelta: 45,
      socialDelta: 5,
      mindset: "PROFICIT",
      title: "Стратегічний відпочинок",
      message: "Ти повернувся відновленим. Рівень усвідомленості зростає на +1. Нові зв'язки та ідеї.",
      lesson: "Відпочинок — це не витрата, це інвестиція у продуктивність наступних місяців.",
    },
    unconsciousOutcome: {
      financialDelta: -2500,
      mentalDelta: 15,
      socialDelta: 0,
      mindset: "DEFICIT",
      title: "Втеча від проблем",
      message: "Ти привіз свої тривоги у Балі на першому класі. Проблеми чекали вдома.",
      lesson: "Географічна зміна не змінює внутрішній стан. Справжній відпочинок починається з усвідомлення причини втоми.",
    },
  },
  {
    id: "desire_crypto",
    label: "Вкласти в крипто ('100x обіцяли')",
    description: "Друг скинув посилання на 'новий мемкоін'. Обіцяють x100. FOMO натискає.",
    cost: 2000,
    currency: "USD_100",
    awarenessThreshold: 7,
    consciousOutcome: {
      financialDelta: -2000,
      mentalDelta: 5,
      socialDelta: 0,
      mindset: "PROFICIT",
      title: "Інвестиція з due diligence",
      message: "Ти вивчив проєкт, tokenomics, команду. Вклав лише те, що готовий втратити. Навіть якщо -50%, ти не стресуєш.",
      lesson: "Інвестиція без дослідження — це не інвестиція, а пожертва. Різниця між інвестором і гравцем — в process, не в outcome.",
    },
    unconsciousOutcome: {
      financialDelta: -2000,
      mentalDelta: -40,
      socialDelta: -10,
      mindset: "DEFICIT",
      title: "Rug Pull: -100%",
      message: "Токен впав на 98%. Ліквідність виведена. Друг теж втратив. Тепер і гроші пропали, і дружба під тиском.",
      lesson: "Якщо хтось 'гарантує' дохід — це перша ознака шахрайства. Закон: чим вищий обіцяний дохід, тим вищий ризик нуля.",
      isBlackSwan: true,
    },
  },
  {
    id: "desire_car",
    label: "Купити BMW в кредит",
    description: "Ти їздиш на старій машині. Колеги на BMW і Tesla. 'Треба відповідати статусу'.",
    cost: 800,
    currency: "USD_100",
    awarenessThreshold: 5,
    consciousOutcome: {
      financialDelta: -800,
      mentalDelta: 10,
      socialDelta: 5,
      mindset: "PROFICIT",
      title: "Транспорт як інструмент",
      message: "Ти обрав надійний авто за функціоналом, а не за брендом. Зекономив $30k і вклав різницю в бізнес.",
      lesson: "Автомобіль — це депреціюючий актив. Кожна $1000 в BMW = $1000 НЕ в бізнесі, який може приносити $100/міс.",
    },
    unconsciousOutcome: {
      financialDelta: -800,
      mentalDelta: -15,
      socialDelta: 15,
      mindset: "DEFICIT",
      title: "Кредитна петля",
      message: "BMW = $800/міс кредит + $300 страхування + $200 паркінг. $1,300/міс на актив, що втрачає 15%/рік.",
      lesson: "Статусне споживання — це податок на его. $1,300/міс × 12 = $15,600/рік на враження для людей, яким все одно.",
    },
  },
  {
    id: "desire_course",
    label: "Купити онлайн-курс за $997",
    description: "'Навчись заробляти $10k/міс за 30 днів'. Красива landing page, відгуки, таймер.",
    cost: 997,
    currency: "USD_100",
    awarenessThreshold: 6,
    consciousOutcome: {
      financialDelta: -997,
      mentalDelta: 25,
      socialDelta: 5,
      mindset: "PROFICIT",
      title: "Навчання = ROI",
      message: "Ти перевірив автора, відгуки, і проходиш курс системно. Знання конвертуються в навичку за 3 місяці.",
      lesson: "Освіта — найкращий ROI, якщо вона конвертується в дію. Ключ: не в кількості курсів, а в глибині застосування.",
    },
    unconsciousOutcome: {
      financialDelta: -997,
      mentalDelta: -10,
      socialDelta: 0,
      mindset: "DEFICIT",
      title: "Ілюзія прогресу",
      message: "Ти купив курс, подивився 2 уроки і закинув. 14-й курс за рік. Знання без дії = ентертеймент за $997.",
      lesson: "Купівля курсу — це не навчання. Це покупка ІЛЮЗІЇ прогресу. Мозок отримує дофамін від 'я інвестую в себе' і зупиняється.",
    },
  },
  {
    id: "desire_restaurant",
    label: "Бізнес-вечеря за $500",
    description: "Потенційний клієнт хоче зустрітись у дорогому ресторані. 'Треба показати рівень'.",
    cost: 500,
    currency: "EUR_100",
    awarenessThreshold: 4,
    consciousOutcome: {
      financialDelta: -500,
      mentalDelta: 15,
      socialDelta: 20,
      mindset: "PROFICIT",
      title: "Стратегічний нетворкінг",
      message: "Ти побудував відносини, які через 2 місяці принесли контракт на $25k. ROI 50x.",
      lesson: "Витрата на відносини — це інвестиція. Але лише якщо є чітка ціль зустрічі та follow-up.",
    },
    unconsciousOutcome: {
      financialDelta: -500,
      mentalDelta: 5,
      socialDelta: 5,
      mindset: "DEFICIT",
      title: "Дорога їжа, нуль результату",
      message: "Приємна вечеря. Обмінялись візитками. Жоден не зателефонував. $500 на атмосферу.",
      lesson: "Вечеря без цілі, без follow-up і без чіткої пропозиції — це не нетворкінг. Це споживання з ілюзією продуктивності.",
    },
  },
  {
    id: "desire_charity",
    label: "Пожертвувати $1000 на благодійність",
    description: "Знайомий просить підтримати фонд. Ти ще не стабільний фінансово.",
    cost: 1000,
    currency: "USD_100",
    awarenessThreshold: 5,
    consciousOutcome: {
      financialDelta: -1000,
      mentalDelta: 30,
      socialDelta: 25,
      mindset: "PROFICIT",
      title: "Усвідомлена щедрість",
      message: "Ти пожертвував суму, яку можеш дозволити. Репутація зросла. Внутрішнє відчуття значущості.",
      lesson: "Благодійність з профіциту — це інвестиція в соціальний капітал та власний ментальний ресурс.",
    },
    unconsciousOutcome: {
      financialDelta: -1000,
      mentalDelta: -15,
      socialDelta: 10,
      mindset: "DEFICIT",
      title: "Жертва провини",
      message: "Ти дав $1000, яких не мав. Тепер не вистачає на оренду. Почуття провини 'я мав би дати більше' замість подяки.",
      lesson: "Благодійність з дефіциту — це не щедрість, а самозруйнація. Спочатку поставте маску собі, потім дитині.",
    },
  },
];

export const processDesireAction = (
  action: DesireAction,
  player: PlayerState
): ActionResult => {
  const isConscious = player.awarenessLevel >= action.awarenessThreshold;
  
  if (isConscious) {
    return action.consciousOutcome;
  }

  // Mystery Random: 60% chance of disaster below threshold
  const disasterRoll = Math.random();
  if (disasterRoll < 0.60) {
    return action.unconsciousOutcome;
  }

  // Partial negative even without full disaster
  return {
    ...action.consciousOutcome,
    mentalDelta: Math.floor(action.consciousOutcome.mentalDelta * 0.4),
    lesson: "Ти отримав щось, але не розумієш чому. Без усвідомленості навіть позитивний досвід не стає ресурсом.",
  };
};

// ─────────────────────────────────────────────
// VECTOR 2: БАЗОВІ ПОТРЕБИ (Basic Needs)
// Conformism paradox: awareness → lower cost + higher return
// ─────────────────────────────────────────────
export interface BasicNeedCategory {
  id: string;
  name: string;
  baseCostUSD: number;
  description: string;
}

export const BASIC_NEEDS: BasicNeedCategory[] = [
  { id: "housing", name: "Житло", baseCostUSD: 500, description: "Аренда місяця" },
  { id: "food", name: "Харчування", baseCostUSD: 300, description: "Продукти на місяць" },
  { id: "health", name: "Здоров'я", baseCostUSD: 150, description: "Лікар, ліки, спортзал" },
  { id: "transport", name: "Транспорт", baseCostUSD: 200, description: "Пальне або проїзд" },
];

export const processBasicNeed = (
  need: BasicNeedCategory,
  player: PlayerState,
  conformismLevel: number // 0-10: how much player buys for status vs real need
): ActionResult => {
  const awareness = player.awarenessLevel;
  
  // Conformism raises cost (renting luxury apt for status costs 3x)
  const conformismMultiplier = 1 + (conformismLevel * 0.25);
  const awarenessSavings = 1 - ((awareness - 5) * 0.05); // Awareness 10 = 25% cheaper
  const finalCost = need.baseCostUSD * conformismMultiplier * Math.max(0.7, awarenessSavings);
  
  // Mental return is inversely proportional to conformism
  const mentalReturn = awareness * 3 - conformismLevel * 5;
  
  const isConformist = conformismLevel > 6;
  
  return {
    financialDelta: -finalCost,
    mentalDelta: Math.max(-15, Math.min(30, mentalReturn)),
    socialDelta: isConformist ? conformismLevel - 5 : 0,
    mindset: awareness >= 6 ? "PROFICIT" : (conformismLevel > 6 ? "DEFICIT" : "NEUTRAL"),
    title: isConformist ? "Куплено заради фасаду" : "Закрита реальна потреба",
    message: isConformist
      ? `Ти переплатив $${(finalCost - need.baseCostUSD).toFixed(0)} за враження. Ментальна енергія витрачається на підтримку штучного образу.`
      : `Потреба закрита якісно. Реальна вартість: $${finalCost.toFixed(0)} замість $${(need.baseCostUSD * conformismMultiplier).toFixed(0)}.`,
    lesson: isConformist
      ? "Соціальне викривлення: чим більше ти живеш для чужої оцінки, тим дорожчим стає твій базовий рівень комфорту — і тим менше він тебе задовольняє."
      : "Усвідомлена базова потреба — мінімальна сума, максимальний ментальний відгук.",
  };
};

// ─────────────────────────────────────────────
// VECTOR 4: МЕТА (Goal Decomposition)
// ─────────────────────────────────────────────
export interface GoalAnalysis {
  goalCost: number;
  currentMonthlySurplus: number;
  currentHourCost: number;
  targetHourCost: number;
  monthsToGoalAtCurrentRate: number;
  isGoalAffordable: boolean;
  mindsetMessage: string;
  actionableSteps: string[];
}

export const analyzeGoal = (player: PlayerState): GoalAnalysis => {
  const currentHourCost = player.goalCostUSD / (player.monthsToGoal * player.hoursPerMonth);
  
  const monthlyRevenue = player.ownedAssets.reduce((s, a) => s + a.monthlyRevenue, 0);
  const monthlyExpenses = player.ownedAssets.reduce((s, a) => s + a.monthlyExpenses, 0);
  const debtPayments = player.monthlyDebts.reduce((s, d) => s + d.monthlyPayment, 0);
  const monthlySurplus = monthlyRevenue - monthlyExpenses - debtPayments;

  const monthsToGoalAtCurrentRate = monthlySurplus > 0
    ? Math.ceil(player.goalCostUSD / monthlySurplus)
    : Infinity;

  const isGoalAffordable = monthsToGoalAtCurrentRate <= player.monthsToGoal;
  
  // Target hour cost at goal = goal requires this much per hour
  const targetHourCost = player.goalCostUSD / (player.monthsToGoal * player.hoursPerMonth);
  
  return {
    goalCost: player.goalCostUSD,
    currentMonthlySurplus: monthlySurplus,
    currentHourCost,
    targetHourCost,
    monthsToGoalAtCurrentRate,
    isGoalAffordable,
    mindsetMessage: isGoalAffordable
      ? "Твоя мета реальна при поточному темпі. Залишайся на курсі та масштабуй."
      : monthlySurplus <= 0
        ? "Ти ще не генеруєш профіцит. Фокус: перший актив, що покриє базові витрати."
        : `При поточному темпі тобі знадобиться ${monthsToGoalAtCurrentRate} місяців. Твоя ціль — ${player.monthsToGoal} міс. Потрібно збільшити доходи або зменшити витрати.`,
    actionableSteps: isGoalAffordable ? [
      "Підтримуй поточний темп та реінвестуй профіцит",
      "Делегуй рутину, вартість якої нижче за твою годину",
      "Фокусуйся на активах з ROI вище поточного",
    ] : [
      `Підвищ щомісячний профіцит хоча б до $${Math.ceil(player.goalCostUSD / player.monthsToGoal)}`,
      "Купи перший актив, що генерує пасивний дохід",
      "Знизь конформістські витрати на базові потреби",
    ],
  };
};
