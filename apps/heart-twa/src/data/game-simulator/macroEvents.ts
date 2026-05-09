/**
 * SEASONAL & MACRO EVENTS ENGINE
 * 
 * GAP FILLED: The game had no macro-economic layer.
 * Real businesses face seasonal cycles, currency crises,
 * regulatory shifts, and global disruptions.
 * 
 * These events affect ALL businesses simultaneously,
 * unlike NPC events which are individual.
 */

export interface MacroEvent {
  id: string;
  name: string;
  type: MacroEventType;
  triggerMonth: number | "RANDOM";
  probability: number;
  description: string;
  financialMultiplier: number;  // Applied to ALL revenue
  mentalImpact: number;
  socialImpact: number;
  duration: number;  // months
  affectedIndustries: string[] | "ALL";
  realWorldPrecedent: string;
  proficitResponse: string;
  deficitResponse: string;
}

export type MacroEventType =
  | "SEASONAL"
  | "CURRENCY_CRISIS"
  | "REGULATION"
  | "PANDEMIC"
  | "TECH_DISRUPTION"
  | "WAR"
  | "ENERGY_CRISIS"
  | "AI_DISRUPTION";

export const MACRO_EVENTS: MacroEvent[] = [
  // ── SEASONAL ───────────────────────────────
  {
    id: "macro_summer_slump",
    name: "Літній спад попиту",
    type: "SEASONAL",
    triggerMonth: 6,
    probability: 0.85,
    description: "Червень-серпень: клієнти у відпустках, B2B продажі падають на 25-40%. Команда теж хоче відпочивати.",
    financialMultiplier: -0.30,
    mentalImpact: -10,
    socialImpact: 0,
    duration: 3,
    affectedIndustries: "ALL",
    realWorldPrecedent: "Стандартний сезонний цикл для B2B в Європі. HoReCa навпаки зростає.",
    proficitResponse: "Використай літо для R&D, навчання команди, підготовки осіннього запуску.",
    deficitResponse: "Паніка, звільнення, скорочення маркетингу — і восени нікого немає для зростання.",
  },
  {
    id: "macro_holiday_boom",
    name: "Передріздвяний бум",
    type: "SEASONAL",
    triggerMonth: 11,
    probability: 0.90,
    description: "Листопад-грудень: Black Friday, корпоративні замовлення, подарунки. Revenue +40-80% для ритейлу.",
    financialMultiplier: 0.50,
    mentalImpact: -15,
    socialImpact: 5,
    duration: 2,
    affectedIndustries: ["RETAIL", "FMCG", "Entertainment"],
    realWorldPrecedent: "Amazon робить 35% річного доходу за Q4. Alibaba Singles Day 2023: $85B за 1 день.",
    proficitResponse: "Підготовка з вересня: запаси, логістика, маркетинг-бюджет. Найм тимчасового персоналу.",
    deficitResponse: "Не підготувався → stock-out, клієнти у конкурентів, стрес від авралу.",
  },

  // ── CURRENCY ───────────────────────────────
  {
    id: "macro_currency_shock",
    name: "Валютний шок (девальвація)",
    type: "CURRENCY_CRISIS",
    triggerMonth: "RANDOM",
    probability: 0.15,
    description: "Національна валюта падає на 20-30% за місяць. Імпортні витрати зростають миттєво, ціни ростуть з затримкою.",
    financialMultiplier: -0.25,
    mentalImpact: -25,
    socialImpact: -10,
    duration: 4,
    affectedIndustries: "ALL",
    realWorldPrecedent: "Україна 2014: USD/UAH з 8 до 25 за 6 місяців. Турція 2021: лира -44% за рік. Аргентина 2023: песо -54%.",
    proficitResponse: "Мультивалютні рахунки, хеджування, перехід на місцевих постачальників, підвищення цін.",
    deficitResponse: "«Зачекаю, може повернеться». Ніколи не повертається. Маржа зникає за 2 місяці.",
  },

  // ── REGULATION ─────────────────────────────
  {
    id: "macro_tax_reform",
    name: "Зміна податкового законодавства",
    type: "REGULATION",
    triggerMonth: "RANDOM",
    probability: 0.20,
    description: "Нові правила оподаткування. ФОП обмежені, ставки змінені, нова звітність.",
    financialMultiplier: -0.10,
    mentalImpact: -20,
    socialImpact: 0,
    duration: 2,
    affectedIndustries: "ALL",
    realWorldPrecedent: "Україна: зміна правил ФОП 3 групи кожні 2-3 роки. ЄС: DAC7 (звітність маркетплейсів). Індія: раптова демонетизація 2016.",
    proficitResponse: "Податковий консультант на ретейнері. Гнучка структура (ТОВ + ФОП). Моніторинг законодавства.",
    deficitResponse: "«Це мене не стосується» → штраф + донарахування через 12 місяців.",
  },

  // ── TECH DISRUPTION ────────────────────────
  {
    id: "macro_ai_wave",
    name: "AI-хвиля: автоматизація професій",
    type: "AI_DISRUPTION",
    triggerMonth: "RANDOM",
    probability: 0.25,
    description: "AI-інструменти замінюють 30-50% рутинних задач. Компанії, що адаптувались — скорочують витрати на 40%. Решта — втрачають клієнтів.",
    financialMultiplier: -0.15,
    mentalImpact: -20,
    socialImpact: -5,
    duration: 6,
    affectedIndustries: "ALL",
    realWorldPrecedent: "2023-2025: ChatGPT/Claude замінили 30% контент-менеджерів. Klarna скоротила 700 CS-агентів. IBM заморозила найм 7,800 позицій.",
    proficitResponse: "Інвестувати в AI-навчання команди. Автоматизувати рутину. Перефокусуватись на high-value задачі.",
    deficitResponse: "«AI — це хайп, пройде». Не пройде. Через 18 місяців конкуренти працюють з 30% менше витрат.",
  },

  // ── ENERGY ─────────────────────────────────
  {
    id: "macro_energy_crisis",
    name: "Енергетична криза",
    type: "ENERGY_CRISIS",
    triggerMonth: "RANDOM",
    probability: 0.10,
    description: "Вартість електроенергії та газу зростає в 2-3x. Виробництво стає нерентабельним. Офіси скорочують години.",
    financialMultiplier: -0.20,
    mentalImpact: -15,
    socialImpact: -5,
    duration: 4,
    affectedIndustries: "ALL",
    realWorldPrecedent: "ЄС 2022: газ з €20 до €340/MWh. Німецькі виробники скоротили виробництво на 20%. BASF закрив 2 заводи.",
    proficitResponse: "Енергоаудит, solar panels, перехід на хмарну інфраструктуру, remote work.",
    deficitResponse: "«Це тимчасово» → 6 місяців кровотечі. Закриття виробництва коли вже пізно оптимізувати.",
  },

  // ── BLACK SWAN ─────────────────────────────
  {
    id: "macro_pandemic",
    name: "Пандемія / карантин",
    type: "PANDEMIC",
    triggerMonth: "RANDOM",
    probability: 0.05,
    description: "Локдаун. Офлайн-бізнеси закриті. Онлайн-бізнеси зростають x3. Ланцюжки поставок розірвані.",
    financialMultiplier: -0.50,
    mentalImpact: -40,
    socialImpact: -15,
    duration: 6,
    affectedIndustries: "ALL",
    realWorldPrecedent: "COVID-19 2020: $22 трильйони глобальних збитків. Але Zoom з $330M до $4.1B доходу за рік. Amazon +38%.",
    proficitResponse: "Піворт в онлайн за перший місяць. Підписна модель. Зниження fix costs до мінімуму.",
    deficitResponse: "Чекати 'поки все повернеться'. Не повернулось. 30% малих бізнесів закрились назавжди.",
  },
];

// ─── MACRO EVENT ROLLER ──────────────────────
export const rollMacroEvent = (month: number): MacroEvent | null => {
  for (const event of MACRO_EVENTS) {
    if (event.triggerMonth === month || event.triggerMonth === "RANDOM") {
      const roll = Math.random();
      if (roll < event.probability) {
        return event;
      }
    }
  }
  return null;
};
