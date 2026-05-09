/**
 * INTAKE CONTEXT DATA — Structured situation descriptions
 * 
 * Each context has 5-7 sub-situations described in plain,
 * relatable language (2 sentences max per situation).
 * Contexts are not many: work, business, relationships, sex,
 * love, partnership, family, parenting.
 */

import { ContextCategory } from "./IntakeTypes";

export const INTAKE_CONTEXTS: ContextCategory[] = [
  {
    id: "work",
    label: "Робота",
    description: "Завдання, дедлайни, команда, процеси",
    lucideIcon: "Briefcase",
    situations: [
      {
        id: "work_procrastination",
        text: "Завдання лежить. Дедлайн горить. Я гортаю стрічку замість того, щоб працювати.",
        shadowHint: "escapist",
        chemistryShift: { cortisol: 30, dopamine: -20, oxytocin: -10 },
      },
      {
        id: "work_conflict",
        text: "Керівник або клієнт тисне. Я відчуваю несправедливість, але мовчу.",
        shadowHint: "victim",
        chemistryShift: { cortisol: 40, dopamine: -15, oxytocin: -20 },
      },
      {
        id: "work_cantDelegate",
        text: "Роблю все сам. Не можу делегувати. Контролюю кожен крок команди.",
        shadowHint: "perfectionist",
        chemistryShift: { cortisol: 35, dopamine: 10, oxytocin: -15 },
      },
      {
        id: "work_burnout",
        text: "Працюю 12+ годин. Не відчуваю ні радості, ні втоми. Просто автопілот.",
        shadowHint: "dissociator",
        chemistryShift: { cortisol: 50, dopamine: -40, oxytocin: -30 },
      },
      {
        id: "work_wantToQuit",
        text: "Хочу звільнитись, але страшно. Гроші, репутація, невизначеність.",
        shadowHint: "impostor",
        chemistryShift: { cortisol: 35, dopamine: -10, oxytocin: -5 },
      },
      {
        id: "work_partnerSabotage",
        text: "Партнер саботує. Уникає відповідальності. Я тягну все на собі.",
        shadowHint: "rescuer",
        chemistryShift: { cortisol: 30, dopamine: -15, oxytocin: -25 },
      },
      {
        id: "work_lostDirection",
        text: "Не знаю, чим займатись далі. Втратив напрямок і сенс.",
        shadowHint: "dissociator",
        chemistryShift: { cortisol: 20, dopamine: -35, oxytocin: -10 },
      },
    ],
  },
  {
    id: "business",
    label: "Бізнес",
    description: "Стратегія, масштабування, партнери, ринок",
    lucideIcon: "TrendingUp",
    situations: [
      {
        id: "biz_cashflowCrisis",
        text: "Гроші закінчуються. Клієнти не платять. Кожен день рахую, скільки ще протримаюсь.",
        shadowHint: "victim",
        chemistryShift: { cortisol: 50, dopamine: -30, oxytocin: -20 },
      },
      {
        id: "biz_scaleOrDie",
        text: "Потрібно масштабуватись, але боюсь ризикувати. Конкуренти наступають.",
        shadowHint: "impostor",
        chemistryShift: { cortisol: 35, dopamine: 5, oxytocin: -10 },
      },
      {
        id: "biz_cofounderConflict",
        text: "Конфлікт з кофаундером. Різне бачення, різні цінності. Компанія страждає.",
        shadowHint: "aggressor",
        chemistryShift: { cortisol: 45, dopamine: -10, oxytocin: -35 },
      },
      {
        id: "biz_imposterCEO",
        text: "Маю бути лідером, але відчуваю себе шахраєм. Команда вірить, а я ні.",
        shadowHint: "impostor",
        chemistryShift: { cortisol: 30, dopamine: -20, oxytocin: 5 },
      },
      {
        id: "biz_euphoriaWin",
        text: "Великий виграш. Ейфорія. Хочу одразу взяти ще більше. Зупинитись не можу.",
        shadowHint: "aggressor",
        chemistryShift: { cortisol: 10, dopamine: 50, oxytocin: 5 },
      },
    ],
  },
  {
    id: "finance",
    label: "Фінанси",
    description: "Борги, інвестиції, cash flow, залежності",
    lucideIcon: "Wallet",
    situations: [
      {
        id: "fin_debtSpiral",
        text: "Борг росте. Я уникаю дивитись на рахунки. Страх відкрити банківський додаток.",
        shadowHint: "escapist",
        chemistryShift: { cortisol: 45, dopamine: -25, oxytocin: -15 },
      },
      {
        id: "fin_cantAskMoney",
        text: "Мені винні гроші, але я не можу попросити. Боюсь конфронтації.",
        shadowHint: "victim",
        chemistryShift: { cortisol: 35, dopamine: -15, oxytocin: -20 },
      },
      {
        id: "fin_overspending",
        text: "Витрачаю більше ніж заробляю. Шопінг заспокоює, але ненадовго.",
        shadowHint: "escapist",
        chemistryShift: { cortisol: 15, dopamine: 30, oxytocin: -10 },
      },
      {
        id: "fin_riskParalysis",
        text: "Є можливість інвестувати, але паралізований страхом втрати.",
        shadowHint: "perfectionist",
        chemistryShift: { cortisol: 30, dopamine: -10, oxytocin: -5 },
      },
      {
        id: "fin_financialShame",
        text: "Соромлюсь свого фінансового стану. Приховую реальність від близьких.",
        shadowHint: "impostor",
        chemistryShift: { cortisol: 35, dopamine: -20, oxytocin: -30 },
      },
    ],
  },
  {
    id: "relationships",
    label: "Стосунки",
    description: "Кохання, довіра, конфлікти, комунікація",
    lucideIcon: "Heart",
    situations: [
      {
        id: "rel_partnerDistant",
        text: "Партнер віддаляється. Менше розмов, менше близькості. Я не знаю чому.",
        shadowHint: "victim",
        chemistryShift: { cortisol: 35, dopamine: -20, oxytocin: -40 },
      },
      {
        id: "rel_controlJealousy",
        text: "Ревную і контролюю. Перевіряю телефон, потребую постійного підтвердження.",
        shadowHint: "manipulator",
        chemistryShift: { cortisol: 45, dopamine: 10, oxytocin: -30 },
      },
      {
        id: "rel_cantLeave",
        text: "Стосунки токсичні, але піти не можу. Боюсь самотності більше ніж болю.",
        shadowHint: "victim",
        chemistryShift: { cortisol: 40, dopamine: -15, oxytocin: 10 },
      },
      {
        id: "rel_workVsLove",
        text: "Партнер каже що я занадто багато працюю. Відчуваю провину і злість.",
        shadowHint: "perfectionist",
        chemistryShift: { cortisol: 35, dopamine: -5, oxytocin: -20 },
      },
      {
        id: "rel_afterBreakup",
        text: "Розставання. Пустка. Не можу зосередитись ні на чому іншому.",
        shadowHint: "victim",
        chemistryShift: { cortisol: 50, dopamine: -40, oxytocin: -50 },
      },
    ],
  },
  {
    id: "sexuality",
    label: "Сексуальність",
    description: "Інтимність, бажання, блоки, енергія",
    lucideIcon: "Flame",
    situations: [
      {
        id: "sex_noDesire",
        text: "Бажання зникло. Ні до партнера, ні взагалі. Тіло мовчить.",
        shadowHint: "dissociator",
        chemistryShift: { cortisol: 20, dopamine: -30, oxytocin: -20 },
      },
      {
        id: "sex_performanceAnxiety",
        text: "Тривога перед близькістю. Боюсь не відповідати очікуванням.",
        shadowHint: "impostor",
        chemistryShift: { cortisol: 40, dopamine: -15, oxytocin: -25 },
      },
      {
        id: "sex_disconnectedBody",
        text: "Секс є, але я не відчуваю з'єднання. Тіло відключене від емоцій.",
        shadowHint: "dissociator",
        chemistryShift: { cortisol: 15, dopamine: -10, oxytocin: -35 },
      },
      {
        id: "sex_compulsiveBehavior",
        text: "Шукаю нових вражень компульсивно. Порно, випадкові зв'язки. Після — порожнеча.",
        shadowHint: "escapist",
        chemistryShift: { cortisol: 20, dopamine: 40, oxytocin: -30 },
      },
    ],
  },
  {
    id: "partnership",
    label: "Партнерство",
    description: "Бізнес-партнери, equity, конфлікти інтересів",
    lucideIcon: "Handshake",
    situations: [
      {
        id: "part_equityFight",
        text: "Партнер хоче більше частки. Вважає що робить більше. Я не згоден.",
        shadowHint: "aggressor",
        chemistryShift: { cortisol: 40, dopamine: -10, oxytocin: -35 },
      },
      {
        id: "part_silentDisagreement",
        text: "Не згоден з рішенням партнера, але мовчу. Накопичую образу.",
        shadowHint: "victim",
        chemistryShift: { cortisol: 30, dopamine: -15, oxytocin: -20 },
      },
      {
        id: "part_trustBroken",
        text: "Дізнався що партнер діяв за моєю спиною. Довіра зруйнована.",
        shadowHint: "aggressor",
        chemistryShift: { cortisol: 50, dopamine: -20, oxytocin: -45 },
      },
      {
        id: "part_exitStrategy",
        text: "Хочу розійтись з партнером, але юридично та фінансово складно.",
        shadowHint: "perfectionist",
        chemistryShift: { cortisol: 35, dopamine: -10, oxytocin: -15 },
      },
    ],
  },
  {
    id: "family",
    label: "Сім'я / Батьківство",
    description: "Діти, батьки, обов'язки, тіні роду",
    lucideIcon: "Users",
    situations: [
      {
        id: "fam_parentGuilt",
        text: "Відчуваю провину перед дитиною. Мало часу, мало уваги. Робота забирає все.",
        shadowHint: "rescuer",
        chemistryShift: { cortisol: 35, dopamine: -10, oxytocin: -15 },
      },
      {
        id: "fam_toxicParent",
        text: "Батьки тиснуть. Маніпулюють. Я дорослий, але поводжусь як дитина поруч з ними.",
        shadowHint: "victim",
        chemistryShift: { cortisol: 40, dopamine: -20, oxytocin: -25 },
      },
      {
        id: "fam_generationalPattern",
        text: "Ловлю себе на тому, що повторюю паттерни батьків. Те саме, від чого тікав.",
        shadowHint: "dissociator",
        chemistryShift: { cortisol: 25, dopamine: -15, oxytocin: -10 },
      },
      {
        id: "fam_cantSetBoundaries",
        text: "Не можу поставити межі з рідними. Кожне «ні» викликає відчуття зради.",
        shadowHint: "rescuer",
        chemistryShift: { cortisol: 30, dopamine: -10, oxytocin: 10 },
      },
      {
        id: "fam_newParentOverwhelm",
        text: "Став батьком/матір'ю. Тотальне перевантаження. Втрата себе.",
        shadowHint: "rescuer",
        chemistryShift: { cortisol: 45, dopamine: -25, oxytocin: 20 },
      },
    ],
  },
  {
    id: "mentalHealth",
    label: "Ментальне здоров'я",
    description: "Тривога, вигорання, дисоціація, депресія",
    lucideIcon: "Brain",
    situations: [
      {
        id: "mh_anxiety",
        text: "Постійна тривога. Не можу розслабитись. Тіло напружене, думки скачуть.",
        shadowHint: "perfectionist",
        chemistryShift: { cortisol: 50, dopamine: -10, oxytocin: -20 },
      },
      {
        id: "mh_numbness",
        text: "Нічого не відчуваю. Ні радості, ні болю. Просто існую на автопілоті.",
        shadowHint: "dissociator",
        chemistryShift: { cortisol: 10, dopamine: -40, oxytocin: -30 },
      },
      {
        id: "mh_panicAttacks",
        text: "Панічні атаки. Серце вилітає, дихання зникає. Здається що помираю.",
        shadowHint: "victim",
        chemistryShift: { cortisol: 60, dopamine: -30, oxytocin: -20 },
      },
      {
        id: "mh_suicidalThoughts",
        text: "Думки що світу було б краще без мене. Втома від боротьби.",
        shadowHint: "victim",
        chemistryShift: { cortisol: 55, dopamine: -50, oxytocin: -40 },
      },
      {
        id: "mh_addictionLoop",
        text: "Алкоголь, речовини, ігри — щоб не думати. Знаю що шкодить, але не зупиняюсь.",
        shadowHint: "escapist",
        chemistryShift: { cortisol: 30, dopamine: 40, oxytocin: -25 },
      },
    ],
  },
];
