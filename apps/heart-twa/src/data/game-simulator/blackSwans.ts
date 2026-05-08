/**
 * BLACK SWANS + CIPOLLA NPC ENGINE
 * GDD §6: Генератор випадковостей
 *
 * Implements:
 * - Nassim Taleb's Black Swan theory (§6.1)
 * - Carlo Cipolla's Laws of Human Stupidity (§6.2)
 *   Categories: Intelligent / Bandit / Helpless / Stupid
 */

import { PlayerState } from "./rules";

// ─────────────────────────────────────────────
// CIPOLLA NPC CATEGORIES
// GDD §6.2: Закони людської дурості
// ─────────────────────────────────────────────
export type CipollaCategory = "INTELLIGENT" | "BANDIT" | "HELPLESS" | "STUPID";

export interface NPCEvent {
  id: string;
  npcName: string;
  category: CipollaCategory;
  title: string;
  description: string;
  trigger: "INTERNAL" | "EXTERNAL"; // Your employee vs outside actor
  financialImpactMultiplier: number; // Applied to player's net worth
  mentalImpact: number;
  socialImpact: number;
  awarenessRequiredToAvoid: number; // Min awareness level to mitigate
  mitigatedOutcome?: {
    financialImpactMultiplier: number;
    mentalImpact: number;
    message: string;
  };
  lesson: string;
  cipollaPrinciple: string;
}

export const NPC_EVENTS: NPCEvent[] = [
  // ── INTELLIGENT (Win-Win) ─────────────────
  {
    id: "npc_mentor_intro",
    npcName: "Олег, Ментор",
    category: "INTELLIGENT",
    title: "Ментор пропонує співпрацю",
    description: "Досвідчений підприємець пропонує щомісячний менторинг. Коштує $400/міс., але відкриває стратегічні зв'язки.",
    trigger: "EXTERNAL",
    financialImpactMultiplier: -0.02,
    mentalImpact: 25,
    socialImpact: 20,
    awarenessRequiredToAvoid: 0,
    lesson: "Інтелігентна людина в мережі — найцінніший актив. Win-win не потребує компромісу.",
    cipollaPrinciple: "Перший закон Чіполли: Люди завжди недооцінюють кількість дурнів навколо. Знаходь і цінуй розумних.",
  },

  // ── BANDIT (Wins for them, loss for you) ──
  {
    id: "npc_rogue_partner",
    npcName: "Дмитро, Партнер-рейдер",
    category: "BANDIT",
    title: "Партнер намагається захопити частку",
    description: "Ваш ранній партнер, якому ви довіряли без договору, наймає юриста і вимагає 50% бізнесу. Ви нічого не підписували.",
    trigger: "INTERNAL",
    financialImpactMultiplier: -0.30,
    mentalImpact: -45,
    socialImpact: -15,
    awarenessRequiredToAvoid: 7,
    mitigatedOutcome: {
      financialImpactMultiplier: -0.05,
      mentalImpact: -10,
      message: "Ваш юридичний консультант заблокував претензію. Партнерський договір врятував бізнес.",
    },
    lesson: "Бандит є раціональним і передбачуваним — він хоче вигоди. Від бандита захищає юридично оформлена угода на старті.",
    cipollaPrinciple: "Другий закон Чіполли: Ймовірність бандита не залежить від решти характеристик людини. Завжди підписуй договір.",
  },
  {
    id: "npc_supplier_monopoly",
    npcName: "ТОВ 'Монополіст Захід'",
    category: "BANDIT",
    title: "Постачальник піднімає ціни вдвічі",
    description: "Ваш єдиний постачальник сировини раптово підвищує ціни на 100%. Ви залежні і не маєте альтернативи.",
    trigger: "EXTERNAL",
    financialImpactMultiplier: -0.15,
    mentalImpact: -20,
    socialImpact: 0,
    awarenessRequiredToAvoid: 6,
    mitigatedOutcome: {
      financialImpactMultiplier: -0.03,
      mentalImpact: -5,
      message: "Ви заздалегідь налагодили відносини з 3 альтернативними постачальниками. Диверсифікація врятувала маржу.",
    },
    lesson: "Монопольна залежність від одного постачальника — архітектурна вразливість. Завжди будуй 2-3 альтернативних канали.",
    cipollaPrinciple: "Четвертий закон Чіполли: Розумні люди недооцінюють руйнівний потенціал бандитів. Диверсифікуй ризики.",
  },

  // ── HELPLESS (Wins for you, hurts them) ───
  {
    id: "npc_burning_supplier",
    npcName: "Антон, Постачальник-альтруїст",
    category: "HELPLESS",
    title: "Постачальник продає нижче собівартості",
    description: "Ваш постачальник, поспішаючи допомогти, продає вам товар за старою ціною, поглинаючи збиток. За 2 місяці він збанкрутує.",
    trigger: "EXTERNAL",
    financialImpactMultiplier: 0.08,
    mentalImpact: 5,
    socialImpact: -5,
    awarenessRequiredToAvoid: 8,
    mitigatedOutcome: {
      financialImpactMultiplier: 0.02,
      mentalImpact: 15,
      message: "Ви помітили ситуацію і запропонували чесну ціну. Ви зберегли постачальника і зміцнили партнерство.",
    },
    lesson: "Короткострокова вигода за рахунок партнера руйнує екосистему. Гравець з мисленням профіциту підтримує партнерів, навіть коли це невигідно в моменті.",
    cipollaPrinciple: "Безпорадний приносить тобі вигоду, шкодячи собі. Зрілий підприємець не паразитує на таких людях.",
  },

  // ── STUPID (Hurts you AND hurts themselves) ─
  {
    id: "npc_stupid_employee_db",
    npcName: "Богдан, Адмін-самовпевнець",
    category: "STUPID",
    title: "Адмін видалив базу клієнтів",
    description: "Ваш IT-адмін вирішив 'оптимізувати' сервер без backup. Він видалив базу з 3,000 клієнтів. 'Я думав, що знаю'.",
    trigger: "INTERNAL",
    financialImpactMultiplier: -0.20,
    mentalImpact: -35,
    socialImpact: -20,
    awarenessRequiredToAvoid: 7,
    mitigatedOutcome: {
      financialImpactMultiplier: -0.01,
      mentalImpact: -5,
      message: "Автоматичний backup (налаштований завчасно) врятував дані. Система захищена від 'людського фактора'.",
    },
    lesson: "П'ятий закон Чіполли: Дурень небезпечніший за бандита. Бандита можна передбачити, дурня — ні. Будуй системи з захистом від дурня (foolproof).",
    cipollaPrinciple: "Третій закон: Дурна людина завдає шкоди іншим без вигоди для себе або навіть зі шкодою для себе самої.",
  },
  {
    id: "npc_stupid_ego_deal",
    npcName: "Ігор, Партнер з роздутим его",
    category: "STUPID",
    title: "Партнер зірвав мільйонну угоду",
    description: "На фінальних переговорах ваш партнер образився на тон покупця і встав з-за столу. Угода на $150k зірвана. Він втратив теж.",
    trigger: "INTERNAL",
    financialImpactMultiplier: -0.25,
    mentalImpact: -30,
    socialImpact: -10,
    awarenessRequiredToAvoid: 8,
    mitigatedOutcome: {
      financialImpactMultiplier: -0.02,
      mentalImpact: -5,
      message: "Ви провели попередній брифінг з партнером та встановили правила поведінки на переговорах.",
      },
    lesson: "Уражене его — найдорожчий непередбачений витрат у бізнесі. Емоційна зрілість команди — це інфраструктура, що захищає від дурних рішень.",
    cipollaPrinciple: "П'ятий закон Чіполли: дурень небезпечніший за бандита саме тому, що його дії ірраціональні та непередбачувані.",
  },
  {
    id: "npc_stupid_inspector",
    npcName: "Інспектор Микола, 'Я тут господар'",
    category: "STUPID",
    title: "Перевірка з надуманими штрафами",
    description: "Місцевий інспектор виписав штраф $2,000 за 'порушення', яких немає в законі. Він зіпсував свою репутацію, але й вас задержав.",
    trigger: "EXTERNAL",
    financialImpactMultiplier: -0.05,
    mentalImpact: -20,
    socialImpact: 0,
    awarenessRequiredToAvoid: 7,
    mitigatedOutcome: {
      financialImpactMultiplier: 0,
      mentalImpact: -5,
      message: "Ваш юрист оскаржив штраф. Документація була в порядку. Перевірка закрита без наслідків.",
    },
    lesson: "Зовнішні дурні існують у будь-якому середовищі. Системна документація та юридична підтримка є страховкою від ірраціональних зовнішніх агентів.",
    cipollaPrinciple: "Перший закон: Ніколи не недооцінюй кількість дурнів. Будуй бізнес так, ніби вони скрізь.",
  },
];

// ─────────────────────────────────────────────
// TALEB BLACK SWANS
// GDD §6.1: Аномальні, масштабні, ретроспективно зрозумілі
// ─────────────────────────────────────────────
export interface BlackSwanEvent {
  id: string;
  name: string;
  description: string;
  probability: number; // Base probability per month (very low, 0.01-0.05)
  financialImpactMultiplier: number; // Applied to all player assets
  mentalImpact: number;
  socialImpact: number;
  duration: number; // Months of aftereffect
  antiFragileBonus?: number; // Mental/financial bonus for players who prepared
  lesson: string;
}

export const BLACK_SWAN_EVENTS: BlackSwanEvent[] = [
  {
    id: "swan_pandemic",
    name: "Глобальна Пандемія",
    description: "Всесвітня криза охорони здоров'я блокує ланцюги постачання. Офлайн-бізнеси втрачають до 70% доходу за 3 місяці.",
    probability: 0.01,
    financialImpactMultiplier: -0.50,
    mentalImpact: -25,
    socialImpact: 10, // Solidarity effect
    duration: 6,
    antiFragileBonus: 40,
    lesson: "Антикрихкий бізнес виграє від хаосу. Диверсифіковані потоки доходу (онлайн + офлайн) та резервний фонд (3-6 місяців витрат) перетворюють пандемію на перевагу над конкурентами.",
  },
  {
    id: "swan_currency_crash",
    name: "Валютна Криза (Девальвація 50%)",
    description: "Гривня обвалилася на 50%. Імпортні товари подорожчали вдвічі, локальні активи знецінились.",
    probability: 0.02,
    financialImpactMultiplier: -0.30,
    mentalImpact: -20,
    socialImpact: -5,
    duration: 3,
    antiFragileBonus: 35,
    lesson: "Зберігання активів у твердій валюті ($, €) та інвестиції в реальні активи (нерухомість, метали) — природній хедж проти девальвації. Гравець, що тримав 70%+ в UAH, втрачає найбільше.",
  },
  {
    id: "swan_cyber_attack",
    name: "Кібератака на IT-Інфраструктуру",
    description: "Хакери зашифрували всі дані. Вимога викупу $50k. Клієнти втрачені, система паралізована.",
    probability: 0.03,
    financialImpactMultiplier: -0.25,
    mentalImpact: -40,
    socialImpact: -30,
    duration: 2,
    antiFragileBonus: 45,
    lesson: "Кібербезпека — це не IT-бюджет, це страховка бізнесу. Гравці з налаштованими backup-системами та шифруванням даних відновлюються за 48 годин. Решта — за місяці.",
  },
  {
    id: "swan_regulatory_ban",
    name: "Регуляторна Заборона (Зміна закону)",
    description: "Новий закон миттєво забороняє ключовий продукт вашого бізнесу. Ліцензія анульована. Товарні запаси заморожені.",
    probability: 0.02,
    financialImpactMultiplier: -0.40,
    mentalImpact: -30,
    socialImpact: 0,
    duration: 4,
    antiFragileBonus: 30,
    lesson: "Регуляторна диверсифікація: бізнес в одній юрисдикції або секторі — крихкий. Гравці з продуктами в кількох регуляторних середовищах (різні країни або сектори) ізолюють ризик.",
  },
];

// ─────────────────────────────────────────────
// MERGE: Import expanded NPC events
// ─────────────────────────────────────────────
import { EXPANDED_NPC_EVENTS } from "./cipollaExpanded";

const ALL_NPC_EVENTS: NPCEvent[] = [...NPC_EVENTS, ...EXPANDED_NPC_EVENTS];

// ─────────────────────────────────────────────
// ENGINE: Roll for events each month
// ─────────────────────────────────────────────
export interface MonthlyEventRoll {
  npcEvent: NPCEvent | null;
  blackSwan: BlackSwanEvent | null;
}

export const rollMonthlyEvents = (player: PlayerState): MonthlyEventRoll => {
  const awareness = player.awarenessLevel;

  // NPC Event: Higher probability but dampened by awareness
  const npcBaseChance = 0.45;
  const npcAwarenessDampener = (awareness - 5) * 0.03;
  const npcChance = npcBaseChance - npcAwarenessDampener;

  let npcEvent: NPCEvent | null = null;
  if (Math.random() < npcChance) {
    // Weight: Stupid 40%, Bandit 30%, Helpless 20%, Intelligent 10%
    const roll = Math.random();
    let pool: NPCEvent[];
    if (roll < 0.10) pool = ALL_NPC_EVENTS.filter(e => e.category === "INTELLIGENT");
    else if (roll < 0.30) pool = ALL_NPC_EVENTS.filter(e => e.category === "HELPLESS");
    else if (roll < 0.60) pool = ALL_NPC_EVENTS.filter(e => e.category === "BANDIT");
    else pool = ALL_NPC_EVENTS.filter(e => e.category === "STUPID");

    if (pool.length > 0) {
      npcEvent = pool[Math.floor(Math.random() * pool.length)];
    }
  }

  // Black Swan: Very rare
  let blackSwan: BlackSwanEvent | null = null;
  for (const swan of BLACK_SWAN_EVENTS) {
    if (Math.random() < swan.probability) {
      blackSwan = swan;
      break;
    }
  }

  return { npcEvent, blackSwan };
};

export const applyCipollaCategory = (category: CipollaCategory): string => {
  const labels: Record<CipollaCategory, string> = {
    INTELLIGENT: "🟢 Розумний (Win-Win)",
    BANDIT: "🔴 Бандит (Wins for them, loss for you)",
    HELPLESS: "🟡 Безпорадний (Wins for you, hurts them)",
    STUPID: "⚫ Дурень (Loses all, causes chaos)",
  };
  return labels[category];
};

export { ALL_NPC_EVENTS };
