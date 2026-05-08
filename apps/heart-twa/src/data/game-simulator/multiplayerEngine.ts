/**
 * MULTIPLAYER PARTNER ENGINE
 * 
 * 2-5 players share ONE company but have HIDDEN personal motivations.
 * Hidden motivations = distorted perception of reality = conflict.
 * 
 * Reveal happens ONLY in debrief:
 * - Each player's real motivation exposed
 * - Ego distortion map visualized
 * - Team compatibility matrix shown
 * - Real-world team case attached
 */

// ─── HIDDEN MOTIVATIONS ──────────────────────
export type HiddenMotivationType =
  | "MONEY_EXIT"        // Хоче продати бізнес якомога швидше
  | "CONTROL"           // Хоче одноосібно керувати
  | "STATUS"            // Хоче престиж і визнання
  | "SECURITY"          // Боїться ризику, хоче стабільність
  | "MISSION"           // Щиро вірить у місію компанії
  | "REVENGE"           // Доводить щось комусь (батькам, ex, суспільству)
  | "LEARNING"          // Хоче отримати досвід і піти
  | "RELATIONSHIP"      // Хоче зміцнити стосунки з партнером
  | "COMPETITION"       // Перемогти конкурента / іншого гравця
  | "LEGACY"            // Побудувати щось на десятиліття

export interface HiddenMotivation {
  type: HiddenMotivationType;
  label: string;
  icon: string;
  description: string;
  // How this motivation distorts decision-making
  distortions: {
    investTendency: number;    // -1 (avoid) to +1 (aggressive)
    riskTolerance: number;     // -1 (ultra-conservative) to +1 (reckless)
    conflictStyle: string;     // How they behave in conflict
    hiddenVeto: string;        // What they'll secretly block
    blindSpot: string;         // What they genuinely don't see
  };
  realWorldExample: string;
}

export const HIDDEN_MOTIVATIONS: Record<HiddenMotivationType, HiddenMotivation> = {
  MONEY_EXIT: {
    type: "MONEY_EXIT",
    label: "Стратег виходу",
    icon: "💰",
    description: "Основна мета — вийти через 2-3 роки з максимальним прибутком. Все інше вторинне.",
    distortions: {
      investTendency: 1.0,
      riskTolerance: 0.7,
      conflictStyle: "Блокує довгострокові інвестиції, прискорює 'красиву звітність'",
      hiddenVeto: "Будь-яка ініціатива, що знижує поточну оцінку компанії",
      blindSpot: "Команда та культура — 'це не моя проблема після виходу'",
    },
    realWorldExample: "Tiger Global в Uber: інвестор хотів виходу, CEO хотів будувати. Конфлікт паралізував стратегію на 18 місяців.",
  },
  CONTROL: {
    type: "CONTROL",
    label: "Контролер",
    icon: "🎮",
    description: "Повинен мати останнє слово у кожному рішенні. 'Моя компанія = моя воля'.",
    distortions: {
      investTendency: -0.3,
      riskTolerance: 0.2,
      conflictStyle: "Блокує будь-які рішення прийняті без його участі",
      hiddenVeto: "Найм сильніших людей (загроза владі)",
      blindSpot: "Делегування як інструмент зростання, а не слабкість",
    },
    realWorldExample: "Стів Джобс в Apple 1.0: геніальний контролер без делегування. Результат — звільнення власним радою.",
  },
  STATUS: {
    type: "STATUS",
    label: "Статусний гравець",
    icon: "👑",
    description: "Визнання, медіа, Forbes-список важливіший за P&L. Образ > реальність.",
    distortions: {
      investTendency: 0.8,
      riskTolerance: 0.9,
      conflictStyle: "Витрачає бюджет на PR і 'представницькі витрати' без ROI",
      hiddenVeto: "Будь-яке рішення, що робить його менш 'видимим' публічно",
      blindSpot: "Операційна реальність — 'є люди для цього'",
    },
    realWorldExample: "Адам Нойман, WeWork: офіс за $60k/міс, серфінг на гроші інвесторів, образ > бізнес.",
  },
  SECURITY: {
    type: "SECURITY",
    label: "Захисник стабільності",
    icon: "🛡️",
    description: "Головний страх — втратити те, що є. Мінімізація ризику за будь-яку ціну.",
    distortions: {
      investTendency: -0.8,
      riskTolerance: -0.9,
      conflictStyle: "Блокує масштабування, наполягає на 'резервах'",
      hiddenVeto: "Будь-яке зростання, що потребує боргового фінансування",
      blindSpot: "Opportunity cost нерішучості — теж ризик",
    },
    realWorldExample: "Kodak: фотохімічний бізнес генерував $10B. Менеджмент блокував digital-трансформацію заради збереження поточного доходу. Результат: банкрутство.",
  },
  MISSION: {
    type: "MISSION",
    label: "Місіонер",
    icon: "🌍",
    description: "Щиро вірить, що змінює світ. Місія > гроші. Часто нехтує unit-економікою.",
    distortions: {
      investTendency: 0.3,
      riskTolerance: 0.5,
      conflictStyle: "Конфліктує коли 'монетизація' суперечить місії",
      hiddenVeto: "Будь-яке рішення, що 'продає душу' заради доходу",
      blindSpot: "Бізнес без прибутку — це charity, не бізнес",
    },
    realWorldExample: "Patagonia: засновник Yvon Chouinard передав компанію на благодійність. Місія > exit. Унікальний win-win.",
  },
  REVENGE: {
    type: "REVENGE",
    label: "Доводить точку",
    icon: "🔥",
    description: "Підсвідома мотивація: довести батькам / ex / суспільству / конкуренту що 'я можу'. Надмірна енергія, ірраціональні рішення під кортизолом.",
    distortions: {
      investTendency: 1.0,
      riskTolerance: 1.0,
      conflictStyle: "Атакує опонентів всередині команди, сприймає критику як особисту атаку",
      hiddenVeto: "Будь-яке рішення, що виглядає як 'поступка'",
      blindSpot: "Власна мотивація — не бачить, що кортизол керує рішеннями",
    },
    realWorldExample: "Ілон Маск, Twitter/X: купівля з мотивацією 'врятувати свободу слова'. Або доведення точки? $44B + $13B боргу. Рішення приймаються під кортизолом.",
  },
  LEARNING: {
    type: "LEARNING",
    label: "Студент ринку",
    icon: "📖",
    description: "Хоче отримати досвід і піти через 1-2 роки. Компанія — MBA за чужі гроші.",
    distortions: {
      investTendency: 0.5,
      riskTolerance: 0.7,
      conflictStyle: "Пропонує нестандартні рішення 'заради досвіду'",
      hiddenVeto: "Рутинні операційні рішення (нецікаво)",
      blindSpot: "Довгострокові наслідки власних 'експериментів' для команди",
    },
    realWorldExample: "Більшість консультантів McKinsey в стартапах. Вони принесуть цінність, але підуть через 18-24 міс — з вашими знаннями до конкурента.",
  },
  RELATIONSHIP: {
    type: "RELATIONSHIP",
    label: "Зміцнення стосунків",
    icon: "🤝",
    description: "Бізнес — спосіб зміцнити стосунки з партнером/другом. Гроші вторинні.",
    distortions: {
      investTendency: -0.2,
      riskTolerance: -0.3,
      conflictStyle: "Уникає конфліктів, погоджується 'заради миру'",
      hiddenVeto: "Рішення, що можуть зашкодити особистим стосункам",
      blindSpot: "Бізнес-партнерство і дружба — різні контракти з різними правилами",
    },
    realWorldExample: "Ben & Jerry's: засновники хотіли будувати разом — і побудували. Але більшість таких партнерств руйнуються коли бізнес-тиск розкриває різницю в цінностях.",
  },
  COMPETITION: {
    type: "COMPETITION",
    label: "Конкурент у команді",
    icon: "⚔️",
    description: "Внутрішня конкуренція з іншими партнерами. Хоче 'виграти' всередині команди.",
    distortions: {
      investTendency: 0.6,
      riskTolerance: 0.6,
      conflictStyle: "Підриває рішення інших партнерів, щоб власні виглядали краще",
      hiddenVeto: "Ідеї інших партнерів (навіть хороші)",
      blindSpot: "Компанія програє коли гравці б'ються між собою",
    },
    realWorldExample: "Microsoft під Стівом Балмером: stack ranking система зробила менеджерів ворогами одне одного. Результат: 10 втрачених років інновацій.",
  },
  LEGACY: {
    type: "LEGACY",
    label: "Будівник спадщини",
    icon: "🏛️",
    description: "Думає на 20-50 років вперед. Повільний, методичний, не приймає рішення під тиском.",
    distortions: {
      investTendency: 0.2,
      riskTolerance: 0.3,
      conflictStyle: "Зупиняє 'швидкі рішення' заради довгострокової стійкості",
      hiddenVeto: "Будь-яке рішення, що жертвує майбутнім заради поточного результату",
      blindSpot: "Ринковий час — поки будуєш спадщину, конкурент захопив ринок",
    },
    realWorldExample: "Berkshire Hathaway: Баффет думає в декадах. Відмовився від Amazon у 1999 ('не розумію'). Але і не втратив все в dot-com кризі.",
  },
};

// ─── PARTNER PROFILE ─────────────────────────
export interface PartnerProfile {
  id: string;
  name: string;
  hiddenMotivation: HiddenMotivationType; // NOT shown until debrief
  statedMotivation: string;               // What they SAY publicly
  equityShare: number;                    // 0-100%
  roleInCompany: string;
  votingPower: number;                    // 0-100
  decisions: PartnerDecision[];           // Logged during game
}

export interface PartnerDecision {
  step: number;
  topic: string;
  vote: "YES" | "NO" | "ABSTAIN";
  publicReason: string;
  // Hidden: why they REALLY voted this way — shown in debrief
  hiddenReason: string;
}

// ─── MULTIPLAYER SESSION ─────────────────────
export interface MultiplayerSession {
  sessionId: string;
  players: PartnerProfile[];
  sharedCompany: {
    name: string;
    direction: "PRODUCTION" | "SERVICES" | "RETAIL";
    niche: string;
    totalValuation: number;
    month: number;
  };
  votingHistory: GroupVote[];
  isDebriefReady: boolean;
}

export interface GroupVote {
  step: number;
  topic: string;
  description: string;
  votes: { playerId: string; vote: "YES" | "NO" | "ABSTAIN"; reason: string }[];
  outcome: "PASSED" | "BLOCKED" | "DEFERRED";
  hiddenConsequence: string; // What actually happens based on group dynamics
}

// ─── TEAM VOTING TOPICS (shared decisions) ────
export interface VotingTopic {
  id: string;
  step: number;
  title: string;
  description: string;
  financialImpact: { yes: number; no: number }; // multiplier on company value
  mentalImpact: { yes: number; no: number };
  // How each motivation type typically votes
  motivationBias: Partial<Record<HiddenMotivationType, "YES" | "NO" | "ABSTAIN">>;
  lesson: string;
}

export const VOTING_TOPICS: VotingTopic[] = [
  {
    id: "vt_hire_strong_coo",
    step: 3,
    title: "Найняти сильного COO за $8k/міс",
    description: "Досвідчений операційний директор може масштабувати бізнес, але знизить контроль засновників.",
    financialImpact: { yes: 0.25, no: -0.05 },
    mentalImpact: { yes: 15, no: -10 },
    motivationBias: {
      CONTROL: "NO",       // Загроза владі
      MONEY_EXIT: "YES",   // Підвищить оцінку
      SECURITY: "NO",      // Дорогий ризик
      MISSION: "YES",      // Потрібна операційна міць
      STATUS: "YES",       // Престижно мати топ-команду
    },
    lesson: "Сильний COO: для CONTROL-мотивації — загроза. Для EXIT-мотивації — актив. Одне рішення, діаметрально протилежні реакції.",
  },
  {
    id: "vt_raise_investment",
    step: 5,
    title: "Залучити $200k від інвестора за 25% частки",
    description: "Зростання прискориться, але частка засновників знизиться. Інвестор матиме право вето на стратегічні рішення.",
    financialImpact: { yes: 0.40, no: 0 },
    mentalImpact: { yes: -10, no: 5 },
    motivationBias: {
      MONEY_EXIT: "YES",
      CONTROL: "NO",
      SECURITY: "NO",
      COMPETITION: "YES",
      LEARNING: "YES",
      LEGACY: "NO",
    },
    lesson: "Інвестиція розкриває мотивації: хто хоче швидкого виходу (YES), хто боїться втратити контроль (NO).",
  },
  {
    id: "vt_expand_market",
    step: 7,
    title: "Відкрити другий ринок (місто/країна)",
    description: "Вихід на новий ринок потребує $50k і 6 місяців фокусу команди. Поточний бізнес може просісти.",
    financialImpact: { yes: 0.30, no: 0.05 },
    mentalImpact: { yes: -15, no: 10 },
    motivationBias: {
      STATUS: "YES",
      SECURITY: "NO",
      MISSION: "YES",
      RELATIONSHIP: "NO",
      MONEY_EXIT: "YES",
      LEARNING: "YES",
    },
    lesson: "Розширення: STATUS хоче масштабу, SECURITY хоче стабільності. Цей конфлікт — найпоширеніша причина розпаду партнерств.",
  },
  {
    id: "vt_pivot",
    step: 9,
    title: "Піворт: змінити бізнес-модель",
    description: "Дані показують, що початкова модель не масштабується. Піворт вимагає переосмислення всього.",
    financialImpact: { yes: -0.10, no: -0.20 },
    mentalImpact: { yes: -20, no: -30 },
    motivationBias: {
      LEARNING: "YES",
      LEGACY: "NO",
      REVENGE: "NO",        // Визнати помилку = слабкість
      MISSION: "NO",        // Зрадити місію
      MONEY_EXIT: "YES",    // Будь-що для зростання вартості
      SECURITY: "NO",
    },
    lesson: "Піворт вимагає покірності ego. REVENGE і LEGACY-мотивації блокують зміни: визнати помилку = загроза ідентичності.",
  },
  {
    id: "vt_sell_company",
    step: 12,
    title: "Прийняти оффер на купівлю компанії за $500k",
    description: "Стратегічний покупець пропонує $500k. Це 3x від поточної оцінки. Але компанія могла б коштувати $2M+ за 3 роки.",
    financialImpact: { yes: 0.50, no: 0 },
    mentalImpact: { yes: 20, no: -5 },
    motivationBias: {
      MONEY_EXIT: "YES",
      LEGACY: "NO",
      MISSION: "NO",
      CONTROL: "NO",
      SECURITY: "YES",
      COMPETITION: "NO",    // Ще не довів точку
    },
    lesson: "Продаж: фінальне розкриття мотивацій. MONEY_EXIT святкує. LEGACY і MISSION відчувають зраду. Один факт — 10 різних реальностей.",
  },
];

// ─── DEBRIEF: Ego Distortion Analysis ────────
export interface EgoDistortionReport {
  playerId: string;
  playerName: string;
  revealedMotivation: HiddenMotivation;
  statedMotivation: string;
  gapScore: number;              // 0-100: different stated vs real
  keyDistortions: string[];
  compatibilityWith: { partnerId: string; score: number; insight: string }[];
  realWorldArchetype: string;
}

export const generateEgoDistortionReports = (session: MultiplayerSession): EgoDistortionReport[] => {
  return session.players.map(player => {
    const motivation = HIDDEN_MOTIVATIONS[player.hiddenMotivation];

    // Calculate compatibility with other players
    const compatibilityWith = session.players
      .filter(p => p.id !== player.id)
      .map(partner => {
        const partnerMotivation = HIDDEN_MOTIVATIONS[partner.hiddenMotivation];
        const score = calculateCompatibility(player.hiddenMotivation, partner.hiddenMotivation);
        return {
          partnerId: partner.id,
          score,
          insight: getCompatibilityInsight(player.hiddenMotivation, partner.hiddenMotivation),
        };
      });

    // Gap between stated and real motivation
    const gapScore = calculateGap(player.statedMotivation, motivation.description);

    return {
      playerId: player.id,
      playerName: player.name,
      revealedMotivation: motivation,
      statedMotivation: player.statedMotivation,
      gapScore,
      keyDistortions: [
        motivation.distortions.conflictStyle,
        motivation.distortions.hiddenVeto,
        `Сліпа зона: ${motivation.distortions.blindSpot}`,
      ],
      compatibilityWith,
      realWorldArchetype: motivation.realWorldExample,
    };
  });
};

const calculateCompatibility = (a: HiddenMotivationType, b: HiddenMotivationType): number => {
  const COMPAT: Partial<Record<string, number>> = {
    "MONEY_EXIT-LEGACY": 10,
    "MONEY_EXIT-MISSION": 25,
    "MONEY_EXIT-MONEY_EXIT": 70,
    "CONTROL-CONTROL": 5,
    "CONTROL-SECURITY": 55,
    "CONTROL-MISSION": 60,
    "STATUS-MISSION": 65,
    "STATUS-STATUS": 30,
    "MISSION-MISSION": 85,
    "MISSION-LEGACY": 90,
    "LEARNING-MONEY_EXIT": 75,
    "RELATIONSHIP-RELATIONSHIP": 80,
    "COMPETITION-COMPETITION": 20,
    "REVENGE-REVENGE": 15,
    "LEGACY-SECURITY": 70,
  };
  const key1 = `${a}-${b}`;
  const key2 = `${b}-${a}`;
  return COMPAT[key1] ?? COMPAT[key2] ?? 50;
};

const getCompatibilityInsight = (a: HiddenMotivationType, b: HiddenMotivationType): string => {
  const key = `${a}-${b}`;
  const INSIGHTS: Record<string, string> = {
    "MONEY_EXIT-LEGACY": "Критичний конфлікт: один хоче продати, інший будувати вічно.",
    "CONTROL-CONTROL": "Два контролери = постійна боротьба за владу. Один має піти або прийняти роль.",
    "MISSION-LEGACY": "Ідеальна пара: місія + довгострокове мислення = стійкий бізнес.",
    "COMPETITION-COMPETITION": "Токсична динаміка: обидва хочуть 'виграти' всередині команди.",
    "REVENGE-REVENGE": "Небезпечна суміш: два ego, нульова здатність визнавати помилки.",
    "SECURITY-MONEY_EXIT": "Помірна сумісність: один гальмує, інший тисне на газ.",
  };
  return INSIGHTS[key] ?? INSIGHTS[`${b}-${a}`] ?? "Помірна сумісність. Потрібні чіткі правила прийняття рішень.";
};

const calculateGap = (stated: string, real: string): number => {
  if (!stated || stated.length < 10) return 80;
  const statedLower = stated.toLowerCase();
  const signals = ["гроші", "контроль", "статус", "визнання", "помститись", "довести", "заробити"];
  const honesty = signals.filter(s => statedLower.includes(s)).length;
  return Math.max(10, 90 - honesty * 20);
};

// ─── FACTORY: Generate random partners ───────
const MOTIVATIONS_LIST = Object.keys(HIDDEN_MOTIVATIONS) as HiddenMotivationType[];

export const generateRandomPartner = (id: string, name: string, equityShare: number): PartnerProfile => {
  const motivation = MOTIVATIONS_LIST[Math.floor(Math.random() * MOTIVATIONS_LIST.length)];
  const statedMotivations = [
    "Хочу побудувати успішний бізнес і заробити гідні гроші",
    "Вірю в цей продукт і хочу змінити індустрію",
    "Хочу разом з командою досягти наших цілей",
    "Прагну фінансової незалежності через успішний стартап",
    "Хочу реалізувати свій потенціал у цьому проєкті",
  ];
  return {
    id,
    name,
    hiddenMotivation: motivation,
    statedMotivation: statedMotivations[Math.floor(Math.random() * statedMotivations.length)],
    equityShare,
    roleInCompany: "Партнер-засновник",
    votingPower: equityShare,
    decisions: [],
  };
};
