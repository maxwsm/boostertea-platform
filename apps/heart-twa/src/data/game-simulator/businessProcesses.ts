/**
 * BUSINESS PROCESSES DATABASE
 * 
 * Real-world business operational scenarios:
 * ERP, CRM, Banking, Accounting, Grants, Inspections
 * 
 * Each process has a "fool" variant (internal/external)
 * showing how 99% of failures come from human factor.
 */

export interface BusinessProcess {
  id: string;
  domain: ProcessDomain;
  name: string;
  description: string;
  normalCost: number;    // Monthly cost when working
  foolScenario: FoolScenario;
  proficitApproach: string;
  deficitApproach: string;
}

export type ProcessDomain =
  | "ERP"
  | "CRM"
  | "BANKING"
  | "ACCOUNTING"
  | "GRANTS"
  | "LEGAL"
  | "HR"
  | "LOGISTICS";

export interface FoolScenario {
  type: "INTERNAL" | "EXTERNAL";
  trigger: string;
  chemistryDriver: string; // What brain chemical caused the bad decision
  financialDamage: number;
  mentalDamage: number;
  description: string;
  rootCause: string;
  prevention: string;
}

export const BUSINESS_PROCESSES: BusinessProcess[] = [
  // ── ERP ─────────────────────────────────────
  {
    id: "bp_erp_inventory",
    domain: "ERP",
    name: "Облік запасів (Inventory Management)",
    description: "Контроль залишків сировини, готової продукції та WIP (work in progress) у системі.",
    normalCost: 200,
    foolScenario: {
      type: "INTERNAL",
      trigger: "Комірник 'на око' рахує залишки замість сканування штрих-кодів",
      chemistryDriver: "Дофамін від 'я і так знаю' — мозок винагороджує за 'ефективність' (зроблено швидко), ігноруючи точність.",
      financialDamage: 8000,
      mentalDamage: -15,
      description: "Реальні залишки відрізняються від системних на 30%. Клієнт замовив 1000 од., на складі лише 400. Неустойка + втрата клієнта.",
      rootCause: "Відсутність обов'язкового сканування при кожній операції (прийом/відвантаження).",
      prevention: "Впровадити WMS з обов'язковим скануванням. Щотижневі інвентаризації. Система не дозволяє відвантаження без підтвердження.",
    },
    proficitApproach: "Інвестувати $3k в WMS-систему зараз = економити $8k+ на кожному факапі з запасами.",
    deficitApproach: "«Навіщо WMS, ми маленькі». Економія $3k → втрата $8k при першому великому замовленні.",
  },
  {
    id: "bp_erp_production",
    domain: "ERP",
    name: "Планування виробництва (MRP)",
    description: "Розрахунок потреби в сировині та графіку виробництва на основі замовлень.",
    normalCost: 300,
    foolScenario: {
      type: "INTERNAL",
      trigger: "Менеджер планує 'в голові' замість системи, забув врахувати lead time постачальника",
      chemistryDriver: "Адреналін від 'гарячих' замовлень перемикає мозок у режим тактики, ігноруючи стратегію.",
      financialDamage: 12000,
      mentalDamage: -20,
      description: "Сировина не прийшла вчасно. Виробництво стоїть 2 тижні. Зарплати йдуть, дохід — ні.",
      rootCause: "Відсутність формалізованого процесу планування з урахуванням lead time кожного постачальника.",
      prevention: "MRP-модуль в ERP з автоматичним розрахунком. Мінімальний запас = 2 тижні lead time.",
    },
    proficitApproach: "Системний MRP з буфером — передбачуваність і спокій.",
    deficitApproach: "«Я сам все розрахую» — постійний аврал і кортизол.",
  },

  // ── CRM ─────────────────────────────────────
  {
    id: "bp_crm_leads",
    domain: "CRM",
    name: "Управління лідами (Lead Pipeline)",
    description: "Трекінг потенційних клієнтів від першого контакту до підписання договору.",
    normalCost: 150,
    foolScenario: {
      type: "INTERNAL",
      trigger: "Менеджер з продажу тримає контакти в записній книжці/голові. Звільняється — забирає базу.",
      chemistryDriver: "Окситоцин ('мій менеджер, я йому довіряю') блокує системне мислення у власника.",
      financialDamage: 25000,
      mentalDamage: -30,
      description: "Менеджер звільнився з усією клієнтською базою. 200+ контактів втрачено. Він пішов до конкурента.",
      rootCause: "Клієнтська база не в CRM, а в голові одної людини. Немає NDA та non-compete.",
      prevention: "CRM обов'язковий з першого дня. NDA + non-compete для всіх менеджерів з продажу. Дані належать компанії.",
    },
    proficitApproach: "CRM з першого ліда. Дані — актив компанії, не власність менеджера.",
    deficitApproach: "«У нас і так мало клієнтів, навіщо CRM». Класика — поки не станеться.",
  },

  // ── BANKING ─────────────────────────────────
  {
    id: "bp_banking_cashflow",
    domain: "BANKING",
    name: "Cash Flow Management (Управління потоком)",
    description: "Контроль вхідних/вихідних грошових потоків, оптимізація залишків на рахунках.",
    normalCost: 100,
    foolScenario: {
      type: "EXTERNAL",
      trigger: "Банк заблокував рахунок через 'підозрілу операцію' (переказ на ФОП)",
      chemistryDriver: "Compliance-офіцер банку діє під тиском страху (кортизол від можливого штрафу НБУ). Блокує все підряд.",
      financialDamage: 15000,
      mentalDamage: -25,
      description: "Рахунок заблоковано на 30 днів. Зарплати не виплачені. Постачальники чекають. Бізнес паралізований.",
      rootCause: "Один банківський рахунок. Відсутність резервного банку та готівкового резерву.",
      prevention: "Мінімум 2 банки. Резерв 1 місяць витрат у готівці або на іншому рахунку. Compliance-ready документація.",
    },
    proficitApproach: "2+ банки, готівковий резерв, compliance документи завжди готові.",
    deficitApproach: "«Один банк зручніше». Зручно — поки рахунок не заморозять.",
  },

  // ── ACCOUNTING ──────────────────────────────
  {
    id: "bp_accounting_taxes",
    domain: "ACCOUNTING",
    name: "Податкове планування",
    description: "Оптимізація податкового навантаження в межах закону.",
    normalCost: 500,
    foolScenario: {
      type: "INTERNAL",
      trigger: "Бухгалтер 'оптимізує' податки нелегально, підробляючи первинну документацію",
      chemistryDriver: "Дофамін від 'ми заощадили' + кортизол від 'а раптом перевірка'. Постійний стрес.",
      financialDamage: 50000,
      mentalDamage: -40,
      description: "Податкова перевірка виявила невідповідності. Штраф + донарахування + кримінальне провадження.",
      rootCause: "Жадібність (дефіцитне мислення: 'заплатити менше за будь-яку ціну') замість легальної оптимізації.",
      prevention: "Кваліфікований податковий консультант. ФОП + ТОВ структура. Легальні інструменти оптимізації.",
    },
    proficitApproach: "Платити правильно та спати спокійно. Легальна оптимізація через структуру.",
    deficitApproach: "«Навіщо платити стільки податків». Економія $10k → штраф $50k + кримінал.",
  },

  // ── GRANTS ──────────────────────────────────
  {
    id: "bp_grants_application",
    domain: "GRANTS",
    name: "Грантове фінансування (EU/USAID/UNDP)",
    description: "Безповоротне фінансування проєктів від міжнародних організацій.",
    normalCost: 0,
    foolScenario: {
      type: "INTERNAL",
      trigger: "Подали заявку без розуміння вимог звітності. Отримали грант, витратили не за призначенням.",
      chemistryDriver: "Дофамін від 'безкоштовних грошей' блокує розуміння, що грант = зобов'язання з жорсткою звітністю.",
      financialDamage: 30000,
      mentalDamage: -35,
      description: "Грантодавець вимагає повернення коштів через нецільове використання. Плюс потрапляння в 'чорний список'.",
      rootCause: "Сприйняття гранту як 'подарунку', а не як контракту з жорсткими KPI.",
      prevention: "Грант = проєкт з бюджетом, дедлайнами та аудитом. Найми грантового менеджера ДО подачі.",
    },
    proficitApproach: "Грант — інструмент масштабування з чіткою звітністю. Найми менеджера.",
    deficitApproach: "«О, безкоштовні гроші!» → повернення + чорний список.",
  },

  // ── LEGAL ───────────────────────────────────
  {
    id: "bp_legal_ip",
    domain: "LEGAL",
    name: "Захист інтелектуальної власності (IP)",
    description: "Патенти, торгові марки, авторські права на продукти та бренд.",
    normalCost: 300,
    foolScenario: {
      type: "EXTERNAL",
      trigger: "Конкурент зареєстрував ВАШУ торгову марку раніше, бо ви 'не встигали'",
      chemistryDriver: "Прокрастинація = уникнення дискомфорту (амігдала сприймає юридичні документи як 'небезпеку').",
      financialDamage: 20000,
      mentalDamage: -25,
      description: "Ваш бренд тепер належить конкуренту. Або ребрендинг за $20k, або викуп марки за ще більшу суму.",
      rootCause: "IP-захист відкладений 'на потім'. 'Потім' = коли вже пізно.",
      prevention: "Реєстрація ТМ одразу після вибору назви. Вартість реєстрації ~$500. Вартість втрати ~$20k+.",
    },
    proficitApproach: "Захист IP з першого дня. $500 зараз = $20k збережено.",
    deficitApproach: "«Потім зареєструю, зараз є важливіше». Потім = ніколи.",
  },

  // ── HR ──────────────────────────────────────
  {
    id: "bp_hr_hiring",
    domain: "HR",
    name: "Найм ключових співробітників",
    description: "Пошук, відбір та онбординг ключових спеціалістів.",
    normalCost: 400,
    foolScenario: {
      type: "INTERNAL",
      trigger: "Наняв друга на ключову позицію 'бо довіряю', без перевірки компетенцій",
      chemistryDriver: "Окситоцин (довіра до близьких) перемагає раціональний аналіз. 'Він же свій!'",
      financialDamage: 15000,
      mentalDamage: -30,
      description: "Друг не справляється, але звільнити — значить зруйнувати дружбу. 6 місяців зарплати без результату.",
      rootCause: "Змішування особистих стосунків з бізнес-рішеннями. Відсутність KPI та випробувального терміну.",
      prevention: "Наймай за компетенціями, а не за стосунками. Обов'язковий KPI + випробувальний термін для ВСІХ.",
    },
    proficitApproach: "Наймай повільно, звільняй швидко. KPI з першого дня для кожного.",
    deficitApproach: "«Він мій друг, він точно зможе». Токсичний мікс окситоцину та бізнесу.",
  },
];

export const getProcessesByDomain = (domain: ProcessDomain): BusinessProcess[] =>
  BUSINESS_PROCESSES.filter(p => p.domain === domain);
