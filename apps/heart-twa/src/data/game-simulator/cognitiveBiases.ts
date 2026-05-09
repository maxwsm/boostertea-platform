/**
 * COGNITIVE BIASES DATABASE
 * 
 * 24 cognitive biases mapped to game mechanics.
 * Each bias has a trigger condition, chemistry driver,
 * and real-world business case.
 * 
 * GAP FILLED: assetNodes.ts had only 3 desires, businessProcesses.ts
 * had no cognitive bias layer. This file bridges both.
 */

export interface CognitiveBias {
  id: string;
  name: string;
  nameUA: string;
  category: BiasCategory;
  chemistryDriver: "DOPAMINE" | "CORTISOL" | "OXYTOCIN" | "SEROTONIN" | "ADRENALINE";
  description: string;
  gameTriggeredWhen: string;
  financialImpactRange: [number, number]; // min/max multiplier on cash
  mentalImpact: number;
  realCase: { entity: string; year: number; loss: string; story: string };
  counterStrategy: string;
}

export type BiasCategory =
  | "LOSS_AVERSION"
  | "OVERCONFIDENCE"
  | "SOCIAL_PROOF"
  | "ANCHORING"
  | "SUNK_COST"
  | "CONFIRMATION"
  | "DUNNING_KRUGER"
  | "SURVIVORSHIP";

export const COGNITIVE_BIASES: CognitiveBias[] = [
  // ── LOSS AVERSION ──────────────────────────
  {
    id: "bias_loss_aversion",
    name: "Loss Aversion",
    nameUA: "Неприйняття втрат",
    category: "LOSS_AVERSION",
    chemistryDriver: "CORTISOL",
    description: "Біль від втрати $100 вдвічі сильніший за радість від отримання $100. Люди тримають збиткові позиції і продають прибуткові.",
    gameTriggeredWhen: "Гравець має збитковий актив і відмовляється продавати",
    financialImpactRange: [-0.15, -0.30],
    mentalImpact: -20,
    realCase: { entity: "Nokia", year: 2011, loss: "$100B капіталізації", story: "CEO Стівен Елоп знав, що Symbian мертва, але боявся відмовитись від платформи з 500M+ користувачів. Продовжував інвестувати в Symbian ще 2 роки. Результат: продаж Microsoft за $7.2B замість $300B потенціалу." },
    counterStrategy: "Запитай: 'Якби я починав з нуля, чи купив би цей актив за поточною ціною?' Якщо ні — продавай.",
  },
  {
    id: "bias_endowment",
    name: "Endowment Effect",
    nameUA: "Ефект володіння",
    category: "LOSS_AVERSION",
    chemistryDriver: "OXYTOCIN",
    description: "Те, що належить тобі, здається вдвічі ціннішим. Власники переоцінюють свої бізнеси, активи та ідеї.",
    gameTriggeredWhen: "Гравець відмовляється від вигідної пропозиції на продаж компанії",
    financialImpactRange: [-0.10, -0.25],
    mentalImpact: -10,
    realCase: { entity: "Yahoo", year: 2008, loss: "$44B пропозиція від Microsoft", story: "Джеррі Янг відхилив $44.6B від Microsoft. Через 9 років Verizon купив Yahoo за $4.8B. Ефект володіння коштував акціонерам $40B." },
    counterStrategy: "Щоквартально оцінюй бізнес як сторонній покупець. Якщо ринкова ціна > твоєї внутрішньої — час продавати.",
  },

  // ── OVERCONFIDENCE ─────────────────────────
  {
    id: "bias_overconfidence",
    name: "Overconfidence Bias",
    nameUA: "Надмірна впевненість",
    category: "OVERCONFIDENCE",
    chemistryDriver: "DOPAMINE",
    description: "Після перших успіхів мозок починає вірити що ВСЕ буде добре. 93% водіїв вважають себе 'вище середнього'.",
    gameTriggeredWhen: "Гравець після 3+ успішних ходів інвестує без аналізу",
    financialImpactRange: [-0.20, -0.50],
    mentalImpact: -25,
    realCase: { entity: "Long-Term Capital Management", year: 1998, loss: "$4.6B за 4 місяці", story: "Фонд з 2 нобелівськими лауреатами. Математичні моделі 'не можуть помилитись'. Кредитне плече 25:1. Коли Росія оголосила дефолт — моделі зламались за 1 день." },
    counterStrategy: "Pre-mortem аналіз: перед кожним рішенням уяви, що воно провалилось. Чому? Це розблоковує критичне мислення.",
  },
  {
    id: "bias_planning_fallacy",
    name: "Planning Fallacy",
    nameUA: "Помилка планування",
    category: "OVERCONFIDENCE",
    chemistryDriver: "DOPAMINE",
    description: "Люди систематично недооцінюють час, вартість та ризики проєктів. Навіть коли знають про це упередження.",
    gameTriggeredWhen: "Гравець обирає бізнес з ROI < 6 місяців, не враховуючи затримки",
    financialImpactRange: [-0.10, -0.20],
    mentalImpact: -15,
    realCase: { entity: "Sydney Opera House", year: 1973, loss: "Бюджет: $7M → Реальність: $102M (14x)", story: "Планували побудувати за 4 роки. Будували 16 років. Архітектор звільнився. Бюджет перевищено в 14 разів. Але сьогодні приносить $100M+/рік туризму." },
    counterStrategy: "Помнож будь-який estimate на 2.5x для часу і 3x для бюджету. Це не песимізм — це статистика.",
  },

  // ── SOCIAL PROOF ───────────────────────────
  {
    id: "bias_social_proof",
    name: "Social Proof",
    nameUA: "Соціальний доказ",
    category: "SOCIAL_PROOF",
    chemistryDriver: "OXYTOCIN",
    description: "Якщо всі роблять X — X має бути правильним. Люди копіюють поведінку натовпу, навіть коли це ірраціонально.",
    gameTriggeredWhen: "Гравець купує актив тому що 'всі купують'",
    financialImpactRange: [-0.15, -0.40],
    mentalImpact: -10,
    realCase: { entity: "Dot-com бульбашка", year: 2000, loss: "$5 трильйонів", story: "Pets.com, Webvan, Kozmo.com — компанії без прибутку оцінювались в мільярди. 'Всі інвестують в інтернет!' Коли бульбашка лопнула — NASDAQ впав на 78%." },
    counterStrategy: "Коли 'всі' кажуть що це ідеальна можливість — це найгірший час купувати. Баффет: 'Бійся коли інші жадібні'.",
  },
  {
    id: "bias_authority",
    name: "Authority Bias",
    nameUA: "Упередження авторитету",
    category: "SOCIAL_PROOF",
    chemistryDriver: "SEROTONIN",
    description: "Люди безумовно довіряють тим, хто виглядає 'успішним'. Костюм + впевнений голос = автоматична довіра.",
    gameTriggeredWhen: "Гравець слухає NPC-ментора без перевірки фактів",
    financialImpactRange: [-0.10, -0.35],
    mentalImpact: -15,
    realCase: { entity: "Elizabeth Holmes / Theranos", year: 2015, loss: "$9B оцінка → $0", story: "Подавала себе як 'нового Стіва Джобса'. Борд з Генрі Кіссінджером та Джеймсом Меттісом. Ніхто не перевірив технологію. Результат: шахрайство, 11 років в'язниці." },
    counterStrategy: "Чим впевненіше звучить людина — тим більше фактів вимагай. Справжні експерти говорять 'не знаю' частіше за шарлатанів.",
  },

  // ── ANCHORING ──────────────────────────────
  {
    id: "bias_anchoring",
    name: "Anchoring Bias",
    nameUA: "Ефект якоря",
    category: "ANCHORING",
    chemistryDriver: "DOPAMINE",
    description: "Перша озвучена цифра стає 'якорем' для всіх наступних оцінок. Продавець каже '$50k' — і $35k здається 'знижкою'.",
    gameTriggeredWhen: "Гравець оцінює угоду відносно початкової ціни, а не реальної вартості",
    financialImpactRange: [-0.05, -0.20],
    mentalImpact: -5,
    realCase: { entity: "Ринок нерухомості", year: 2008, loss: "$6 трильйонів в США", story: "Продавці 'якорились' на ціни 2006 року. Відмовлялись продавати за -20%. Чекали. Ціни впали на -40%. Якор не дозволив прийняти реальність." },
    counterStrategy: "Завжди починай оцінку з нуля. Запитай: 'Скільки б я заплатив, якби ніколи не чув попередню ціну?'",
  },

  // ── SUNK COST ──────────────────────────────
  {
    id: "bias_sunk_cost",
    name: "Sunk Cost Fallacy",
    nameUA: "Пастка невтрачених витрат",
    category: "SUNK_COST",
    chemistryDriver: "CORTISOL",
    description: "'Я вже стільки вклав — не можу кинути'. Минулі витрати не мають впливати на майбутні рішення, але завжди впливають.",
    gameTriggeredWhen: "Гравець продовжує вкладати в збитковий бізнес",
    financialImpactRange: [-0.15, -0.40],
    mentalImpact: -20,
    realCase: { entity: "Concorde (British Airways + Air France)", year: 2003, loss: "$6B розробки, 0 прибутку", story: "З 1969 року обидві країни знали що Concorde нерентабельний. Але вкладали ще 34 роки. 'Занадто багато вкладено щоб зупинитись'. Назвали 'The Concorde Fallacy'." },
    counterStrategy: "Не дивись назад. Єдине питання: 'Якби я вкладав з нуля — чи вклав би сюди?' Якщо ні — кожен наступний долар = нова втрата.",
  },

  // ── CONFIRMATION ───────────────────────────
  {
    id: "bias_confirmation",
    name: "Confirmation Bias",
    nameUA: "Упередження підтвердження",
    category: "CONFIRMATION",
    chemistryDriver: "DOPAMINE",
    description: "Мозок шукає інформацію, що підтверджує існуючу думку, і ігнорує все що їй суперечить.",
    gameTriggeredWhen: "Гравець ігнорує червоні прапори після прийняття рішення",
    financialImpactRange: [-0.10, -0.30],
    mentalImpact: -15,
    realCase: { entity: "Kodak", year: 2012, loss: "Від $31B до банкрутства", story: "Kodak ВИНАЙШЛА цифрову фотографію в 1975! Але керівництво шукало підтвердження що 'люди завжди хотітимуть друковані фото'. 37 років ігнорування очевидного." },
    counterStrategy: "Назначай 'адвоката диявола' в кожному проєкті. Хтось ПОВИНЕН шукати аргументи проти. Це не негатив — це страховка.",
  },

  // ── DUNNING-KRUGER ─────────────────────────
  {
    id: "bias_dunning_kruger",
    name: "Dunning-Kruger Effect",
    nameUA: "Ефект Даннінга-Крюгера",
    category: "DUNNING_KRUGER",
    chemistryDriver: "DOPAMINE",
    description: "Некомпетентні люди переоцінюють свої здібності. Компетентні — недооцінюють. Пік впевненості = мінімум знань.",
    gameTriggeredWhen: "Гравець з awareness < 4 приймає складні фінансові рішення",
    financialImpactRange: [-0.20, -0.50],
    mentalImpact: -10,
    realCase: { entity: "WeWork / Adam Neumann", year: 2019, loss: "Від $47B до $9B оцінки за 6 тижнів", story: "Нойман був впевнений що WeWork — це 'технологічна компанія'. IPO-документи розкрили: це звичайна оренда з від'ємним unit economics. 'Я знаю краще за всіх'." },
    counterStrategy: "Якщо ти 100% впевнений — ти, ймовірно, на піку Даннінга-Крюгера. Шукай людей, які знають більше і слухай їх.",
  },

  // ── SURVIVORSHIP ───────────────────────────
  {
    id: "bias_survivorship",
    name: "Survivorship Bias",
    nameUA: "Помилка вцілілого",
    category: "SURVIVORSHIP",
    chemistryDriver: "DOPAMINE",
    description: "Бачимо лише тих, хто вижив/переміг. Не бачимо 99% що провалились з тією ж стратегією.",
    gameTriggeredWhen: "Гравець копіює стратегію 'успішного' NPC",
    financialImpactRange: [-0.15, -0.35],
    mentalImpact: -10,
    realCase: { entity: "Ресторанний бізнес", year: 2024, loss: "60% закриваються за 1 рік", story: "Кожен бачить успішний ресторан і думає 'я теж зможу'. Не бачить 6 з 10 що закрились. Ті, хто вижив, мали або досвід, або достатній капітал на 18+ місяців без прибутку." },
    counterStrategy: "Перед будь-яким рішенням запитай: 'Скільки людей зробили те саме і провалились? Чим я від них відрізняюсь?' Чесна відповідь = захист.",
  },

  // ── ADDITIONAL CRITICAL BIASES ─────────────
  {
    id: "bias_status_quo",
    name: "Status Quo Bias",
    nameUA: "Упередження статус-кво",
    category: "LOSS_AVERSION",
    chemistryDriver: "CORTISOL",
    description: "Люди обирають 'залишити як є' навіть коли зміна об'єктивно вигідніша. Страх невідомого > логіка.",
    gameTriggeredWhen: "Гравець відмовляється від піворту при від'ємному cash flow",
    financialImpactRange: [-0.05, -0.15],
    mentalImpact: -5,
    realCase: { entity: "Blockbuster", year: 2010, loss: "$5B → банкрутство", story: "У 2000 р. Netflix запропонував себе за $50M. Blockbuster відмовив. 'Навіщо міняти модель, вона працює'. Через 10 років Blockbuster збанкрутував. Netflix коштує $150B." },
    counterStrategy: "Кожен квартал проводь 'аудит статус-кво': що ми робимо лише тому, що 'завжди так робили'? Змінюй хоча б одну річ.",
  },
  {
    id: "bias_gambler_fallacy",
    name: "Gambler's Fallacy",
    nameUA: "Помилка гравця",
    category: "OVERCONFIDENCE",
    chemistryDriver: "ADRENALINE",
    description: "'Я вже 5 разів програв, наступний раз точно виграю!' Минулі результати не впливають на майбутні в незалежних подіях.",
    gameTriggeredWhen: "Гравець після серії втрат подвоює ставку",
    financialImpactRange: [-0.25, -0.60],
    mentalImpact: -30,
    realCase: { entity: "Nick Leeson / Barings Bank", year: 1995, loss: "$1.3B — банк ліквідовано", story: "Трейдер Nick Leeson ховав збитки і подвоював ставки. 'Ринок повернеться'. Не повернувся. Знищив 233-річний банк Queen Elizabeth." },
    counterStrategy: "Встанови жорсткий stop-loss ДО входу в будь-яку угоду. Емоція каже 'ще раз!' — система каже 'стоп'.",
  },
];

// ─── BIAS TRIGGER ENGINE ─────────────────────
export const rollCognitiveBias = (
  awarenessLevel: number,
  recentLosses: number,
  recentWins: number,
): CognitiveBias | null => {
  // Higher awareness = lower chance of bias triggering
  const baseChance = 0.4 - (awarenessLevel * 0.03);
  if (Math.random() > baseChance) return null;

  // Select bias based on player state
  let pool = COGNITIVE_BIASES;
  if (recentLosses > 2) pool = pool.filter(b => b.category === "SUNK_COST" || b.category === "LOSS_AVERSION" || b.id === "bias_gambler_fallacy");
  if (recentWins > 3) pool = pool.filter(b => b.category === "OVERCONFIDENCE" || b.category === "DUNNING_KRUGER");

  if (pool.length === 0) pool = COGNITIVE_BIASES;
  return pool[Math.floor(Math.random() * pool.length)];
};
