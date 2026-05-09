/**
 * RELATIONSHIP & NEGOTIATION SCENARIOS
 * 
 * GAP FILLED: Game had business mechanics but no interpersonal
 * negotiation layer. Real business is 80% people, 20% numbers.
 * 
 * Each scenario models a real negotiation archetype with
 * chemistry-driven outcomes.
 */

export interface NegotiationScenario {
  id: string;
  title: string;
  context: string;
  counterparty: CounterpartyProfile;
  stakes: { financial: number; mental: number; social: number };
  options: NegotiationOption[];
  lesson: string;
  realCase: string;
}

export interface CounterpartyProfile {
  name: string;
  type: "CLIENT" | "SUPPLIER" | "PARTNER" | "INVESTOR" | "EMPLOYEE" | "REGULATOR";
  hiddenGoal: string;
  negotiationStyle: "AGGRESSIVE" | "COLLABORATIVE" | "PASSIVE_AGGRESSIVE" | "MANIPULATIVE" | "FAIR";
  pressurePoints: string[];
}

export interface NegotiationOption {
  id: string;
  label: string;
  approach: "AGGRESSIVE" | "COLLABORATIVE" | "AVOIDANT" | "COMPROMISING" | "ACCOMMODATING";
  financialDelta: number;
  mentalDelta: number;
  socialDelta: number;
  outcome: string;
  longTermEffect: string;
}

export const NEGOTIATION_SCENARIOS: NegotiationScenario[] = [
  {
    id: "neg_client_discount",
    title: "Клієнт вимагає 40% знижку",
    context: "Ваш найбільший B2B клієнт (30% доходу) просить знижку 40% або піде до конкурента. Ви знаєте, що конкурент дає гіршу якість.",
    counterparty: {
      name: "Директор ТОВ «ГлобалТрейд»",
      type: "CLIENT",
      hiddenGoal: "Отримати знижку, щоб показати начальству що 'оптимізував витрати'. Реально йти не планує.",
      negotiationStyle: "MANIPULATIVE",
      pressurePoints: ["Страх втрати клієнта", "Залежність від одного великого клієнта"],
    },
    stakes: { financial: 15000, mental: -20, social: -10 },
    options: [
      {
        id: "opt_agree",
        label: "Погодитись на 40% знижку",
        approach: "ACCOMMODATING",
        financialDelta: -6000,
        mentalDelta: -15,
        socialDelta: -5,
        outcome: "Клієнт задоволений, але через 3 місяці попросить ще 20%. Ви показали що ціна — гнучка.",
        longTermEffect: "Маржа впала нижче рентабельності. Через 6 місяців ви обслуговуєте цього клієнта в збиток.",
      },
      {
        id: "opt_counter",
        label: "Запропонувати 15% за річний контракт",
        approach: "COLLABORATIVE",
        financialDelta: -2250,
        mentalDelta: 10,
        socialDelta: 10,
        outcome: "Клієнт погодився. Ви зафіксували дохід на рік, він отримав 'перемогу' для звіту.",
        longTermEffect: "Win-win. Клієнт залишився, маржа збережена, відносини зміцнились.",
      },
      {
        id: "opt_refuse",
        label: "Відмовити: 'Наша ціна відображає якість'",
        approach: "AGGRESSIVE",
        financialDelta: 0,
        mentalDelta: 5,
        socialDelta: -15,
        outcome: "Клієнт образився і пішов. Через 2 місяці повернувся (конкурент не витягнув якість).",
        longTermEffect: "Ви встановили межу. Клієнт повернувся з повагою. Але 2 місяці без доходу від нього.",
      },
    ],
    lesson: "Ніколи не давай знижку під тиском. Завжди запитуй: 'Що я отримаю натомість?' Знижка без зустрічних умов = сигнал слабкості.",
    realCase: "Apple ніколи не дає знижок на iPhone. Результат: найвища маржа в індустрії (45%). Samsung дає знижки постійно — маржа 15%.",
  },
  {
    id: "neg_cofounder_equity",
    title: "Кофаундер хоче більше equity",
    context: "Ваш технічний кофаундер (50/50) вважає що він робить 80% роботи і хоче 70/30 на свою користь. Ви займаєтесь продажами і стратегією.",
    counterparty: {
      name: "Олексій, CTO та кофаундер",
      type: "PARTNER",
      hiddenGoal: "Насправді боїться що його замінять. Equity = гарантія безпеки.",
      negotiationStyle: "PASSIVE_AGGRESSIVE",
      pressurePoints: ["Страх бути непотрібним", "Недооцінка sales/strategy роботи"],
    },
    stakes: { financial: 25000, mental: -30, social: -20 },
    options: [
      {
        id: "opt_give",
        label: "Віддати 70/30",
        approach: "ACCOMMODATING",
        financialDelta: -12500,
        mentalDelta: -25,
        socialDelta: -10,
        outcome: "Через 3 місяці він попросить ще більше. Прецедент створено: тиск працює.",
        longTermEffect: "Ви стали миноритарним партнером у власній компанії. Мотивація впала до нуля.",
      },
      {
        id: "opt_vesting",
        label: "Запропонувати 4-річний vesting для обох",
        approach: "COLLABORATIVE",
        financialDelta: 0,
        mentalDelta: 15,
        socialDelta: 15,
        outcome: "Обидва заробляють equity щомісяця. Хто працює — той отримує. Чесна система.",
        longTermEffect: "Конфлікт вирішено системно. Через 2 роки обидва задоволені. Компанія росте.",
      },
      {
        id: "opt_split",
        label: "Запропонувати розійтись",
        approach: "AGGRESSIVE",
        financialDelta: -5000,
        mentalDelta: -10,
        socialDelta: -25,
        outcome: "Він пішов і забрав код. Ви наймаєте нового CTO за $3k/міс.",
        longTermEffect: "Дорого, болісно, але компанія залишилась вашою. Наступного разу — чіткий shareholders agreement з дня 1.",
      },
    ],
    lesson: "Equity-конфлікти — причина смерті 65% стартапів. Vesting + Shareholders Agreement ДО початку роботи. Не 'потім'.",
    realCase: "Facebook: Цукерберг vs. Winklevoss vs. Eduardo Saverin. 3 equity-конфлікти за перші 2 роки. Загальна вартість судових позовів: $165M.",
  },
  {
    id: "neg_supplier_monopoly",
    title: "Єдиний постачальник підвищує ціни на 60%",
    context: "Ваш ключовий постачальник сировини (єдиний на ринку з такою якістю) підвищив ціни на 60%. Ваша маржа стає від'ємною.",
    counterparty: {
      name: "Чжан Вей, CEO Guangzhou Materials Ltd",
      type: "SUPPLIER",
      hiddenGoal: "Тестує вашу залежність. Готовий дати -20% якщо побачить серйозність.",
      negotiationStyle: "AGGRESSIVE",
      pressurePoints: ["Монопольне становище", "Ваша залежність від одного постачальника"],
    },
    stakes: { financial: 20000, mental: -25, social: -5 },
    options: [
      {
        id: "opt_accept",
        label: "Прийняти нові ціни",
        approach: "ACCOMMODATING",
        financialDelta: -12000,
        mentalDelta: -20,
        socialDelta: 0,
        outcome: "Маржа впала з 40% до 8%. Бізнес ледь виживає.",
        longTermEffect: "Через 6 місяців постачальник підвищить ще. Ви в пастці залежності.",
      },
      {
        id: "opt_diversify",
        label: "Знайти 2 альтернативних постачальників (3 місяці)",
        approach: "COLLABORATIVE",
        financialDelta: -5000,
        mentalDelta: -10,
        socialDelta: 5,
        outcome: "Через 3 місяці у вас 3 постачальники. Оригінальний знизив ціну на 30% щоб утримати вас.",
        longTermEffect: "Ви ніколи більше не залежите від одного джерела. Маржа навіть вища за початкову.",
      },
      {
        id: "opt_vertical",
        label: "Почати власне виробництво сировини",
        approach: "AGGRESSIVE",
        financialDelta: -25000,
        mentalDelta: -30,
        socialDelta: 0,
        outcome: "Інвестиція $25k. Через 8 місяців собівартість падає на 50%. Повна незалежність.",
        longTermEffect: "Вертикальна інтеграція. Ви тепер і виробник, і продавець. Маржа x2.",
      },
    ],
    lesson: "Залежність від одного постачальника = ви не керуєте бізнесом, він керує вами. Правило: мінімум 2 постачальники для кожного критичного ресурсу.",
    realCase: "Apple після дефіциту чіпів 2021: інвестувала $450B у диверсифікацію від Samsung до TSMC, потім власний чіп M1. Тепер контролює весь ланцюг.",
  },
  {
    id: "neg_employee_raise",
    title: "Ключовий працівник вимагає +80% зарплати",
    context: "Ваш єдиний розробник отримав оффер від конкурента з ЗП +80%. Каже: або підвищуйте, або я йду. Він знає всю кодову базу.",
    counterparty: {
      name: "Дмитро, Full-stack розробник",
      type: "EMPLOYEE",
      hiddenGoal: "Насправді не хоче йти (йому подобається команда). Використовує оффер як важіль.",
      negotiationStyle: "MANIPULATIVE",
      pressurePoints: ["Bus factor = 1", "Відсутність документації", "Страх простою"],
    },
    stakes: { financial: 24000, mental: -30, social: -10 },
    options: [
      {
        id: "opt_full_raise",
        label: "Дати повні +80%",
        approach: "ACCOMMODATING",
        financialDelta: -19200,
        mentalDelta: -10,
        socialDelta: -5,
        outcome: "Дмитро залишився. Але інші дізнались і теж хочуть. Прецедент шантажу.",
        longTermEffect: "Кожен працівник тепер знає: отримай оффер → отримай підвищення. Токсична культура.",
      },
      {
        id: "opt_package",
        label: "+30% зарплати + бонус за документацію + опціон",
        approach: "COLLABORATIVE",
        financialDelta: -7200,
        mentalDelta: 10,
        socialDelta: 10,
        outcome: "Дмитро задоволений комплексним пакетом. Документація нарешті написана. Bus factor знижений.",
        longTermEffect: "Win-win. Документація = страховка. Опціон = мотивація залишитись.",
      },
      {
        id: "opt_let_go",
        label: "Відпустити: 'Дякую за роботу, бажаю успіхів'",
        approach: "AGGRESSIVE",
        financialDelta: -8000,
        mentalDelta: -25,
        socialDelta: 5,
        outcome: "2 місяці простою. Найнятий новий розробник. Але тепер є документація + bus factor = 3.",
        longTermEffect: "Болісно, але системно правильно. Бізнес більше не залежить від однієї людини.",
      },
    ],
    lesson: "Якщо bus factor = 1 — це не проблема працівника, це ваша архітектурна помилка. Документація + найм дублера ДО кризи.",
    realCase: "Basecamp: DHH (CTO) + Jason Fried побудували культуру без 'незамінних'. Кожна функція має 2+ розробників. За 20 років — жодної кризи з кадрами.",
  },
];

// ─── SCENARIO ROLLER ─────────────────────────
export const getRandomNegotiation = (): NegotiationScenario => {
  return NEGOTIATION_SCENARIOS[Math.floor(Math.random() * NEGOTIATION_SCENARIOS.length)];
};
