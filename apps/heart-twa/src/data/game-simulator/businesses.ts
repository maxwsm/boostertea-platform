/**
 * BUSINESS MODELS
 * GDD §3.3: Купівля активів — реальна юніт-економіка
 *
 * All models based on real franchise/business data.
 * Branded with fictional names but same mechanics:
 *
 * - "Vertex Arena" (Colizeum cybersport franchise)
 * - "Quantum Tea" (Booster Tea FMCG)
 * - "AeroCar Fleet" (LeoCar MaaS)
 * - "Nexus Hub" (Colosseum IT/CRM)
 * - "MetalCore Depot" (Кольоровий метал)
 * - "SkyBlock Realty" (Нерухомість)
 */

export interface BusinessModel {
  id: string;
  name: string;
  realWorldAnalog: string;
  industry: string;
  description: string;
  icon: string;

  // CAPEX (Initial Investment)
  minInvestmentUSD: number;
  capexBreakdown: CapexItem[];
  franchiseFeeUSD: number; // Паушальний внесок

  // OPEX & Revenue (monthly)
  monthlyRevenue: RevenueStream[];
  monthlyFixedCosts: CostItem[];
  royaltyPercent: number; // % of total revenue

  // Performance
  expectedROIMonths: number; // Payback period
  healthDecayPerMentalUnit: number; // How much business suffers per mental energy point lost

  // Risk profile
  riskLevel: "low" | "medium" | "high" | "extreme";
  mainRisks: string[];
  mentalCapitalRequirement: number; // Min mental energy to run effectively (0-100)

  // Management decisions unlocked by awareness level
  awarenessUnlocks: AwarenessUnlock[];
}

export interface CapexItem {
  name: string;
  costUSD: number;
}

export interface RevenueStream {
  name: string;
  monthlyUSD: number;
}

export interface CostItem {
  name: string;
  monthlyUSD: number;
}

export interface AwarenessUnlock {
  requiredAwareness: number;
  action: string;
  revenueBoostPercent: number;
  mentalBoost: number;
}

export const BUSINESS_MODELS: BusinessModel[] = [
  // ── VERTEX ARENA (Colizeum) ────────────────────────────────────
  {
    id: "biz_cyber_arena",
    name: "Vertex Arena",
    realWorldAnalog: "Franshiza Colizeum (430+ arn)",
    industry: "Кіберспорт / Entertainment",
    description: "Кіберспортивний клуб. Гравці орендують ПК/консолі, проводяться турніри, є бар. Спальний район, 15-25 ПК.",
    icon: "🎮",

    minInvestmentUSD: 58900,
    franchiseFeeUSD: 12000,
    capexBreakdown: [
      { name: "Паушальний внесок франшизи", costUSD: 12000 },
      { name: "Ігрові ПК (20 шт × $1,400)", costUSD: 28000 },
      { name: "Ігрові крісла (20 шт × $300)", costUSD: 6000 },
      { name: "PlayStation консолі (5 шт × $500)", costUSD: 2500 },
      { name: "Великі телевізори (8 шт × $400)", costUSD: 3200 },
      { name: "Ремонт та дизайн приміщення", costUSD: 5000 },
      { name: "Мережеве обладнання + зона бару", costUSD: 2200 },
    ],

    monthlyRevenue: [
      { name: "Оренда ПК (основний потік)", monthlyUSD: 7900 },
      { name: "PlayStation-сесії", monthlyUSD: 1600 },
      { name: "Бар та снеки", monthlyUSD: 600 },
      { name: "Організація турнірів", monthlyUSD: 900 },
    ],

    monthlyFixedCosts: [
      { name: "Оренда приміщення", monthlyUSD: 1800 },
      { name: "Зарплата 2 адміни (shift)", monthlyUSD: 1200 },
      { name: "Інтернет (виділена лінія)", monthlyUSD: 300 },
      { name: "Роялті франшизі (5%)", monthlyUSD: 550 },
      { name: "Технічна підтримка ПК", monthlyUSD: 400 },
      { name: "Маркетинг (локальний)", monthlyUSD: 350 },
    ],

    royaltyPercent: 5,
    expectedROIMonths: 11,
    healthDecayPerMentalUnit: 0.8, // Low mental = admins quit, tournaments cancelled
    riskLevel: "medium",
    mainRisks: [
      "Некомпетентний персонал знижує завантаженість залу",
      "Технічні поломки ПК (амортизація без резерву)",
      "Відкриття конкурента поруч",
      "Зниження завантаженості в будні (-40% від вихідних)",
    ],
    mentalCapitalRequirement: 55,
    awarenessUnlocks: [
      { requiredAwareness: 4, action: "Провести регулярний турнір (щоп'ятниці)", revenueBoostPercent: 12, mentalBoost: 5 },
      { requiredAwareness: 6, action: "Навчання персоналу продажам бару", revenueBoostPercent: 18, mentalBoost: 8 },
      { requiredAwareness: 8, action: "Партнерство з локальною школою (кіберспорт-секція)", revenueBoostPercent: 25, mentalBoost: 15 },
    ],
  },

  // ── QUANTUM TEA (Booster Tea) ──────────────────────────────────
  {
    id: "biz_fmcg_tea",
    name: "Quantum Tea",
    realWorldAnalog: "Booster Tea (рідкі чайні концентрати)",
    industry: "FMCG / FoodTech",
    description: "Виробництво та B2B-дистрибуція рідких чайних концентратів (Пуер, Габа) у кав'ярні та HoReCa. Унікальний формат, нульова конкуренція.",
    icon: "🍵",

    minInvestmentUSD: 10000,
    franchiseFeeUSD: 0,
    capexBreakdown: [
      { name: "Закупівля першої партії сировини (КНР)", costUSD: 6000 },
      { name: "Обладнання для розливу та пакування", costUSD: 2500 },
      { name: "Брендинг та маркетингові матеріали", costUSD: 1500 },
    ],

    monthlyRevenue: [
      { name: "B2B продажі кав'ярням (1000 пляшок × $9.6)", monthlyUSD: 9600 },
      { name: "D2C online продажі", monthlyUSD: 1800 },
    ],

    monthlyFixedCosts: [
      { name: "Сировина та виробництво (собівартість)", monthlyUSD: 4800 },
      { name: "Логістика та доставка", monthlyUSD: 800 },
      { name: "Фонд ЗП (водій + менеджер)", monthlyUSD: 1500 },
      { name: "Маркетинг та сторінки", monthlyUSD: 500 },
    ],

    royaltyPercent: 0,
    expectedROIMonths: 4,
    healthDecayPerMentalUnit: 0.6,
    riskLevel: "medium",
    mainRisks: [
      "Затримка сировини на митниці (форс-мажор договору)",
      "Сезонність (зима — пік попиту, літо — падіння)",
      "B2B клієнт відмовляється без контракту",
      "Конкурент копіює формат через 6 місяців",
    ],
    mentalCapitalRequirement: 50,
    awarenessUnlocks: [
      { requiredAwareness: 4, action: "Персоналізована дегустація для кожного B2B клієнта", revenueBoostPercent: 15, mentalBoost: 10 },
      { requiredAwareness: 6, action: "Запустити лінійку 'Organic Energy' (замінник RedBull)", revenueBoostPercent: 30, mentalBoost: 8 },
      { requiredAwareness: 8, action: "Відкрити виробництво стіків (зниження собівартості на 40%)", revenueBoostPercent: 55, mentalBoost: 20 },
    ],
  },

  // ── AEROCAR FLEET (LeoCar) ─────────────────────────────────────
  {
    id: "biz_maas_car",
    name: "AeroCar Fleet",
    realWorldAnalog: "LeoCar MaaS (Mobility as a Service)",
    industry: "Mobility / Transport",
    description: "Управління автопарком для оренди та таксі з AI-моніторингом GPS та дистанційним контролем запалення.",
    icon: "🚗",

    minInvestmentUSD: 45000,
    franchiseFeeUSD: 0,
    capexBreakdown: [
      { name: "5 автомобілів (б/у, 2020-2022)", costUSD: 35000 },
      { name: "GPS-трекери та IoT-обладнання", costUSD: 3000 },
      { name: "IT-платформа (AI диспетчер)", costUSD: 5000 },
      { name: "Страховки та реєстрація", costUSD: 2000 },
    ],

    monthlyRevenue: [
      { name: "Добова оренда (3 авто × $50/день × 25 дн.)", monthlyUSD: 3750 },
      { name: "Таксі-режим (2 авто × $1,500)", monthlyUSD: 3000 },
    ],

    monthlyFixedCosts: [
      { name: "Технічне обслуговування парку", monthlyUSD: 1200 },
      { name: "Страхування КАСКО (5 авто)", monthlyUSD: 800 },
      { name: "Диспетчер + адміністратор", monthlyUSD: 1000 },
      { name: "Паливо та мийка (якщо компанія покриває)", monthlyUSD: 600 },
      { name: "Амортизаційний резерв", costUSD: 500 } as any,
    ],

    royaltyPercent: 0,
    expectedROIMonths: 18,
    healthDecayPerMentalUnit: 1.0, // High: ДТП, страхові, водії
    riskLevel: "high",
    mainRisks: [
      "ДТП (навіть одне може знищити місячний прибуток)",
      "Водії без ліцензії або пошкодження авто орендарями",
      "Сезонність (зима — зниження оренди, аварійність вища)",
      "Зростання вартості запчастин (курс USD)",
    ],
    mentalCapitalRequirement: 65,
    awarenessUnlocks: [
      { requiredAwareness: 5, action: "Встановити систему scoring водіїв (рейтинг безпеки)", revenueBoostPercent: 10, mentalBoost: 12 },
      { requiredAwareness: 7, action: "Корпоративний B2B контракт (офіс-партнер)", revenueBoostPercent: 35, mentalBoost: 15 },
      { requiredAwareness: 9, action: "Відкрити 2-ий клас (електро-авто + преміум-сегмент)", revenueBoostPercent: 60, mentalBoost: 20 },
    ],
  },

  // ── NEXUS HUB (Colosseum IT) ───────────────────────────────────
  {
    id: "biz_it_crm",
    name: "Nexus Hub",
    realWorldAnalog: "Colosseum (IT/CRM/AI-Agency)",
    industry: "SaaS / IT Services",
    description: "Розробка AI-агентів, CRM-систем та маркетингових автоматизацій для малого бізнесу. Низький CAPEX, менталоємний.",
    icon: "🧠",

    minInvestmentUSD: 3000,
    franchiseFeeUSD: 0,
    capexBreakdown: [
      { name: "Ноутбук та робоче місце", costUSD: 1500 },
      { name: "SaaS-інструменти (1 рік)", costUSD: 800 },
      { name: "Перший маркетинг (SMM + Ads)", costUSD: 700 },
    ],

    monthlyRevenue: [
      { name: "Ретейнери клієнтів (5 × $800)", monthlyUSD: 4000 },
      { name: "Разові проєкти", monthlyUSD: 2000 },
    ],

    monthlyFixedCosts: [
      { name: "SaaS підписки та API", monthlyUSD: 400 },
      { name: "Субпідряд (дизайнер, розробник)", monthlyUSD: 1200 },
      { name: "Маркетинг та лідогенерація", monthlyUSD: 600 },
    ],

    royaltyPercent: 0,
    expectedROIMonths: 2,
    healthDecayPerMentalUnit: 1.5, // HIGHEST: burnout kills IT businesses fast
    riskLevel: "high",
    mainRisks: [
      "Вигоряння власника (Mental Energy < 20% → проєкти зупиняються)",
      "Клієнт не платить після виконання роботи (дебіторка)",
      "Швидка зміна ринку AI (інструменти застарівають)",
      "Залежність від 1-2 великих клієнтів",
    ],
    mentalCapitalRequirement: 70, // HIGHEST mental requirement
    awarenessUnlocks: [
      { requiredAwareness: 5, action: "Впровадити пакетне ціноутворення (retainer)", revenueBoostPercent: 25, mentalBoost: 10 },
      { requiredAwareness: 7, action: "Делегувати рутинні завдання AI-агентам (24/7 продажі)", revenueBoostPercent: 40, mentalBoost: 25 },
      { requiredAwareness: 9, action: "Перетворити агентство на SaaS-продукт", revenueBoostPercent: 120, mentalBoost: 30 },
    ],
  },
];

// ─────────────────────────────────────────────
// BUSINESS HEALTH ENGINE
// ─────────────────────────────────────────────
export const calculateBusinessHealth = (
  business: BusinessModel,
  ownerMentalEnergy: number,
  monthsOwned: number
): number => {
  const mentalDeficiency = Math.max(0, business.mentalCapitalRequirement - ownerMentalEnergy);
  const healthDecay = mentalDeficiency * business.healthDecayPerMentalUnit * 0.1;
  const baseHealth = Math.max(10, 100 - (monthsOwned * 0.5) - healthDecay);
  return Math.min(100, baseHealth);
};

export const getMonthlyProfit = (
  model: BusinessModel,
  healthScore: number
): number => {
  const healthMultiplier = healthScore / 100;
  const totalRevenue = model.monthlyRevenue.reduce((s, r) => s + r.monthlyUSD, 0) * healthMultiplier;
  const totalCosts = model.monthlyFixedCosts.reduce((s, c) => s + (c.monthlyUSD || 0), 0);
  return totalRevenue - totalCosts;
};
