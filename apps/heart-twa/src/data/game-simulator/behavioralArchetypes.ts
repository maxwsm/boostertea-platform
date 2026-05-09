/**
 * BEHAVIORAL ARCHETYPES DATABASE
 * 
 * GAP FILLED: The debrief engine classified actions as
 * PROFICIT/DEFICIT/NEUTRAL but had no deeper behavioral
 * archetype analysis. This creates personality profiles
 * based on decision patterns.
 * 
 * Based on: Cipolla matrix × Jungian shadows × real behavioral economics
 */

export interface BehavioralArchetype {
  id: string;
  name: string;
  nameUA: string;
  cipollaQuadrant: "INTELLIGENT" | "NAIVE" | "BANDIT" | "STUPID";
  shadowPattern: string;
  description: string;
  triggerConditions: ArchetypeTrigger;
  strengthsWhenConscious: string[];
  weaknessesWhenUnconscious: string[];
  realWorldExample: { person: string; context: string };
  growthPath: string;
  compatibilityWith: string[];  // IDs of compatible archetypes
  conflictsWith: string[];      // IDs of conflicting archetypes
}

export interface ArchetypeTrigger {
  deficitRatio: [number, number];   // min/max % of deficit actions
  proficitRatio: [number, number];
  mentalEnergyRange: [number, number];
  socialCapitalRange: [number, number];
}

export const BEHAVIORAL_ARCHETYPES: BehavioralArchetype[] = [
  {
    id: "arch_builder",
    name: "The Builder",
    nameUA: "Будівник",
    cipollaQuadrant: "INTELLIGENT",
    shadowPattern: "Перфекціонізм → Параліч аналізу",
    description: "Системний мислитель. Будує фундаменти, інвестує в довгострокове. Але може занадто довго 'готуватись' і пропускати вікна можливостей.",
    triggerConditions: { deficitRatio: [0, 0.25], proficitRatio: [0.6, 1.0], mentalEnergyRange: [60, 100], socialCapitalRange: [40, 100] },
    strengthsWhenConscious: [
      "Створює стійкі системи, що працюють без нього",
      "Інвестує в навчання і автоматизацію",
      "Рахує юніт-економіку перед кожним рішенням",
    ],
    weaknessesWhenUnconscious: [
      "Paralysis by analysis: місяці планування, нуль дій",
      "Не делегує ('ніхто не зробить як я')",
      "Ігнорує емоційний інтелект команди",
    ],
    realWorldExample: { person: "Ілон Маск (SpaceX)", context: "Будує з нуля, але перфекціонізм призводить до вигоряння команд. 80% інженерів звільняються за перший рік." },
    growthPath: "Навчитись запускати MVP замість 'ідеального продукту'. Done > Perfect.",
    compatibilityWith: ["arch_connector", "arch_visionary"],
    conflictsWith: ["arch_gambler", "arch_avoider"],
  },
  {
    id: "arch_gambler",
    name: "The Gambler",
    nameUA: "Гравець",
    cipollaQuadrant: "NAIVE",
    shadowPattern: "Адреналінова залежність → Самознищення",
    description: "Ризикує великими сумами. Живе від хайпу до хайпу. Може вигравати великі, але один програш знищує все.",
    triggerConditions: { deficitRatio: [0.4, 0.8], proficitRatio: [0.1, 0.4], mentalEnergyRange: [20, 60], socialCapitalRange: [10, 50] },
    strengthsWhenConscious: [
      "Бачить можливості де інші бояться",
      "Швидко приймає рішення (speed to market)",
      "Enragizes команду своєю енергією",
    ],
    weaknessesWhenUnconscious: [
      "All-in без due diligence",
      "Подвоює ставки після втрат (Gambler's fallacy)",
      "Ігнорує червоні прапори, бо 'цього разу точно'",
    ],
    realWorldExample: { person: "Адам Нойман (WeWork)", context: "Геніальний продавець ідей, але all-in в lifestyle замість unit economics. $47B → $8B за 6 тижнів." },
    growthPath: "Встановити жорсткий 'бюджет на ризик' (max 15% портфелю). Ніколи не ризикувати тим, що не можеш втратити.",
    compatibilityWith: ["arch_builder", "arch_analyst"],
    conflictsWith: ["arch_analyst", "arch_guardian"],
  },
  {
    id: "arch_connector",
    name: "The Connector",
    nameUA: "Нетворкер",
    cipollaQuadrant: "INTELLIGENT",
    shadowPattern: "People-pleasing → Втрата автентичності",
    description: "Будує мережі, знає 'потрібних людей'. Але може розпилятись на всіх і не зробити нічого глибокого.",
    triggerConditions: { deficitRatio: [0.1, 0.4], proficitRatio: [0.3, 0.7], mentalEnergyRange: [40, 80], socialCapitalRange: [60, 100] },
    strengthsWhenConscious: [
      "Знаходить партнерів і ресурси для будь-якого проєкту",
      "Вирішує конфлікти через дипломатію",
      "Будує бренд через особисті стосунки",
    ],
    weaknessesWhenUnconscious: [
      "Каже 'так' всім — і не виконує нікому",
      "Плутає кількість контактів з якістю відносин",
      "Уникає конфліктів замість їх вирішення",
    ],
    realWorldExample: { person: "Reid Hoffman (LinkedIn)", context: "Побудував найбільшу професійну мережу. Але його фонд Greylock пропустив ранній Airbnb і Uber — занадто багато зв'язків, мало фокусу." },
    growthPath: "Навчитись казати 'ні'. 5 глибоких відносин > 500 поверхневих.",
    compatibilityWith: ["arch_builder", "arch_visionary"],
    conflictsWith: ["arch_lone_wolf"],
  },
  {
    id: "arch_analyst",
    name: "The Analyst",
    nameUA: "Аналітик",
    cipollaQuadrant: "INTELLIGENT",
    shadowPattern: "Надмірний контроль → Страх дії",
    description: "Все рахує, все перевіряє. Ніколи не прийме рішення без даних. Але час — теж ресурс, і він його витрачає на аналіз.",
    triggerConditions: { deficitRatio: [0, 0.2], proficitRatio: [0.5, 0.9], mentalEnergyRange: [50, 90], socialCapitalRange: [30, 70] },
    strengthsWhenConscious: [
      "Знаходить ризики яких ніхто не бачить",
      "Unit economics на автоматі",
      "Ніколи не потрапить у фінансову пастку",
    ],
    weaknessesWhenUnconscious: [
      "Analysis paralysis: 6 місяців дослідження → 0 дій",
      "Критикує чужі ідеї замість генерації своїх",
      "Бачить лише ризики, ігнорує можливості",
    ],
    realWorldExample: { person: "Yahoo (2008)", context: "Аналітичний підхід до рішень призвів до відхилення $44.6B від Microsoft. 'Треба ще подумати'. Через 9 років продались за $4.8B." },
    growthPath: "Встановити дедлайн для аналізу: max 72 години на будь-яке рішення < $10k.",
    compatibilityWith: ["arch_gambler", "arch_builder"],
    conflictsWith: ["arch_visionary", "arch_gambler"],
  },
  {
    id: "arch_guardian",
    name: "The Guardian",
    nameUA: "Охоронець",
    cipollaQuadrant: "NAIVE",
    shadowPattern: "Гіперконтроль → Мікроменеджмент",
    description: "Захищає те, що є. Зберігає, копить, не ризикує. Ідеально зберігає капітал, але ніколи не примножує.",
    triggerConditions: { deficitRatio: [0.2, 0.5], proficitRatio: [0.2, 0.5], mentalEnergyRange: [30, 60], socialCapitalRange: [30, 60] },
    strengthsWhenConscious: [
      "Ніколи не втрачає більше ніж може дозволити",
      "Створює фінансову подушку (6+ місяців витрат)",
      "Стабільний і передбачуваний партнер",
    ],
    weaknessesWhenUnconscious: [
      "Сидить на грошах коли інфляція їх з'їдає",
      "Відмовляється від можливостей через страх",
      "Мікроменеджить команду до вигоряння",
    ],
    realWorldExample: { person: "Японська 'Lost Decade' (1991-2001)", context: "Ціла нація перейшла в режим Guardian після бульбашки. 20 років стагнації. Заощаджували замість інвестування." },
    growthPath: "Виділити 10% портфелю на 'контрольований ризик'. Кожного місяця робити одну дію поза зоною комфорту.",
    compatibilityWith: ["arch_analyst", "arch_connector"],
    conflictsWith: ["arch_gambler", "arch_visionary"],
  },
  {
    id: "arch_visionary",
    name: "The Visionary",
    nameUA: "Візіонер",
    cipollaQuadrant: "INTELLIGENT",
    shadowPattern: "Мегаломанія → Відрив від реальності",
    description: "Бачить майбутнє раніше за інших. Надихає. Але може відірватись від реальності і витрачати ресурси на 'великі ідеї' без фундаменту.",
    triggerConditions: { deficitRatio: [0.1, 0.4], proficitRatio: [0.4, 0.8], mentalEnergyRange: [50, 100], socialCapitalRange: [50, 100] },
    strengthsWhenConscious: [
      "Створює нові ринки, а не конкурує на існуючих",
      "Привертає найкращих людей через візію",
      "10x мислення замість 10%",
    ],
    weaknessesWhenUnconscious: [
      "Витрачає $1M на ідею без MVP-тесту",
      "Ігнорує операційну реальність ('деталі — не для мене')",
      "Змінює напрямок кожні 3 місяці",
    ],
    realWorldExample: { person: "Elizabeth Holmes (Theranos)", context: "Віра у власну візію без технологічного фундаменту. Обманювала інвесторів 10 років. Візія без execution = шахрайство." },
    growthPath: "Кожну візію перевіряй через MVP за $500 і 2 тижні. Якщо ринок не відповідає — це не ринок дурний, це ідея неправильна.",
    compatibilityWith: ["arch_builder", "arch_connector"],
    conflictsWith: ["arch_analyst", "arch_guardian"],
  },
  {
    id: "arch_avoider",
    name: "The Avoider",
    nameUA: "Уникач",
    cipollaQuadrant: "STUPID",
    shadowPattern: "Прокрастинація → Саботаж себе",
    description: "Уникає рішень. Не купує, не продає, не наймає, не звільняє. 'Якось само вирішиться'. Ніколи не вирішується.",
    triggerConditions: { deficitRatio: [0.5, 1.0], proficitRatio: [0, 0.2], mentalEnergyRange: [0, 40], socialCapitalRange: [0, 40] },
    strengthsWhenConscious: [
      "Обережний — уникає поганих угод",
      "Терплячий — не панікує при volatility",
      "Спостережливий — помічає деталі",
    ],
    weaknessesWhenUnconscious: [
      "Пропускає ВСЕ можливості (opportunity cost > фінансових втрат)",
      "Накопичує невирішені проблеми до критичної маси",
      "Втрачає повагу команди через бездіяльність",
    ],
    realWorldExample: { person: "Sears (2018)", context: "Знав про Amazon з 2002 року. 16 років уникав digital transformation. Банкрутство з 126-річною історією. Бездіяльність = найдорожча стратегія." },
    growthPath: "Правило 2 хвилин: якщо рішення займає < 2 хвилин — приймай ЗАРАЗ. Кожен день — одне маленьке рішення.",
    compatibilityWith: ["arch_connector"],
    conflictsWith: ["arch_builder", "arch_visionary", "arch_gambler"],
  },
  {
    id: "arch_lone_wolf",
    name: "The Lone Wolf",
    nameUA: "Одинак",
    cipollaQuadrant: "NAIVE",
    shadowPattern: "Ізоляція → Сліпа зона",
    description: "Все робить сам. Не довіряє нікому. Може бути геніальним виконавцем, але не масштабується.",
    triggerConditions: { deficitRatio: [0.2, 0.6], proficitRatio: [0.2, 0.6], mentalEnergyRange: [20, 50], socialCapitalRange: [0, 30] },
    strengthsWhenConscious: [
      "Не залежить від жодної людини",
      "Глибоко знає кожен аспект бізнесу",
      "Низькі витрати (нуль зарплат)",
    ],
    weaknessesWhenUnconscious: [
      "Bus factor = 1 (хвороба = зупинка бізнесу)",
      "Не бачить сліпих зон (немає кому сказати 'ти помиляєшся')",
      "Вигоряє за 12-18 місяців гарантовано",
    ],
    realWorldExample: { person: "Нотч (Minecraft)", context: "Створив Minecraft один. Продав за $2.5B. Але потім депресія і ізоляція. Гроші не компенсували відсутність команди і мети." },
    growthPath: "Знайди 1 людину, якій довіряєш. Делегуй їй 1 функцію. Побач, що нічого страшного не сталось.",
    compatibilityWith: ["arch_analyst"],
    conflictsWith: ["arch_connector", "arch_visionary"],
  },
];

// ─── ARCHETYPE DETECTION ENGINE ──────────────
export const detectArchetype = (
  deficitPercent: number,
  proficitPercent: number,
  mentalEnergy: number,
  socialCapital: number,
): BehavioralArchetype => {
  let bestMatch = BEHAVIORAL_ARCHETYPES[0];
  let bestScore = -1;

  for (const arch of BEHAVIORAL_ARCHETYPES) {
    const t = arch.triggerConditions;
    let score = 0;
    if (deficitPercent >= t.deficitRatio[0] && deficitPercent <= t.deficitRatio[1]) score += 25;
    if (proficitPercent >= t.proficitRatio[0] && proficitPercent <= t.proficitRatio[1]) score += 25;
    if (mentalEnergy >= t.mentalEnergyRange[0] && mentalEnergy <= t.mentalEnergyRange[1]) score += 25;
    if (socialCapital >= t.socialCapitalRange[0] && socialCapital <= t.socialCapitalRange[1]) score += 25;
    if (score > bestScore) { bestScore = score; bestMatch = arch; }
  }
  return bestMatch;
};
