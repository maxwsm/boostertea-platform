export const MOCK_SCENARIOS = [
  {
    description: "Я не можу змусити себе сісти за цей проект, хоча дедлайн завтра. Я просто гортаю TikTok і ненавиджу себе.",
    identityArchetype: "Тіньовий Мандрівник (Вібрація 5)",
    nervousSystemState: "Дорсальний Вагус (Параліч завдань)",
    shadowTrigger: "Ескапіст / IFS Пожежник",
    deficiencyMarker: "Я хочу свободи, цей проект мене душить і обмежує.",
    rsdTrigger: "Страх зробити неідеально і отримати критику від ліда",
    totemAdvice: "Від чого саме тебе рятує цей екран? Свобода — це не втеча, а здатність обирати свої зобов'язання.",
    abundanceResolution: "Зроби мікро-крок на 2 хвилини без очікування результату. Віднови дихання (вдих коротший за видих).",
    consequences: "Втрата репутації перед командою, посилення синдрому самозванця, фінансовий збиток.",
    biometrics: {
      current: { cortisolLevel: 85, vagalTone: 15, cognitiveExhaustion: 90 },
      projected: { cortisolLevel: 30, vagalTone: 70, cognitiveExhaustion: 40 }
    },
    somaticInterventions: {
      supplements: ["Магній Гліцинат (ввечері)", "L-Тирозин (для фокусу)"],
      exercises: ["Вагусне дихання 4-7-8 (2 хв)", "Крижане вмивання обличчя"]
    },
    somaticMap: {
      blockedZones: ["Голова", "Очі"],
      targetZones: ["Живіт", "Ноги"]
    },
    vectors: { dopamine: 80, cognitiveLoad: 10, rsdSafety: 50, financial: -10, spiritual: 20 },
    verdict: "Ескапізм та Сенсорне Виснаження",
    isHappy: false
  },
  {
    description: "Я щойно закінчив складні переговори, клієнт погодився на всі умови. Я відчуваю себе живим.",
    identityArchetype: "Інтегрований Візіонер (Вібрація 11)",
    nervousSystemState: "Вентральний Вагус (Потік та Безпека)",
    shadowTrigger: "Немає (Діє з Self)",
    deficiencyMarker: "Відсутній",
    rsdTrigger: "Відсутній",
    totemAdvice: "Як ти можеш запам'ятати цей стан тіла, щоб повертатися до нього?",
    abundanceResolution: "Закріпи цей стан. Дай собі час на інтеграцію (прогулянка або склянка води) перед наступним завданням.",
    consequences: "Без інтеграції цей стан швидко вивітриться і мозок знову почне шукати стрес.",
    biometrics: {
      current: { cortisolLevel: 20, vagalTone: 95, cognitiveExhaustion: 30 },
      projected: { cortisolLevel: 10, vagalTone: 100, cognitiveExhaustion: 15 }
    },
    somaticInterventions: {
      supplements: ["Омега-3 (підтримка мозку)", "Вітамін D3"],
      exercises: ["Легка прогулянка 15 хв", "Заземлення (ходіння босоніж)"]
    },
    somaticMap: { blockedZones: [], targetZones: ["Груди", "Живіт"] },
    vectors: { dopamine: 90, cognitiveLoad: 40, rsdSafety: 100, financial: 100, spiritual: 80 },
    verdict: "Зона Профіциту",
    isHappy: true
  },
  {
    description: "Моя дівчина сказала, що я занадто багато працюю і не приділяю їй уваги. Я відчуваю провину і злість одночасно.",
    identityArchetype: "Роздвоєний Мандрівник (Вібрація 5/11)",
    nervousSystemState: "Симпатичний (Бій/Біжи — внутрішній конфлікт)",
    shadowTrigger: "Перфекціоніст + Рятувальник / IFS Менеджер",
    deficiencyMarker: "Якщо я зупинюсь — все розвалиться. Але якщо вона піде — я залишусь один.",
    rsdTrigger: "Критика з боку найближчої людини: 'Ти мене не бачиш' = 'Ти поганий партнер'",
    totemAdvice: "Ти намагаєшся заслужити любов через досягнення. Але любов не є KPI. Чи можеш ти бути поруч, нічого не роблячи?",
    abundanceResolution: "30 хвилин повної присутності з партнером без телефону. Вербалізувати: 'Я чую тебе. Я хочу бути тут.'",
    consequences: "Втрата стосунків. Ізоляція. Ще глибше занурення в роботу як ескапізм. Вигорання протягом 6-12 місяців.",
    biometrics: {
      current: { cortisolLevel: 75, vagalTone: 30, cognitiveExhaustion: 70 },
      projected: { cortisolLevel: 35, vagalTone: 75, cognitiveExhaustion: 30 }
    },
    somaticInterventions: {
      supplements: ["Ашваганда (адаптоген)", "5-HTP (серотонін)", "Магній Цитрат"],
      exercises: ["Обійми (20 сек мінімум — активує окситоцин)", "Спільна прогулянка без розмов про роботу"]
    },
    somaticMap: { blockedZones: ["Груди", "Горло"], targetZones: ["Живіт", "Таз"] },
    vectors: { dopamine: 45, cognitiveLoad: 80, rsdSafety: 15, financial: 60, spiritual: -20 },
    verdict: "RSD-каскад у стосунках",
    isHappy: false
  },
  {
    description: "Я дивлюсь на свій рахунок і бачу -$2,400. Клієнт не заплатив. Я відчуваю тривогу і злість, але нічого не роблю.",
    identityArchetype: "Заморожений Візіонер (Вібрація 11 у Тіні)",
    nervousSystemState: "Дорсальний Вагус (Заморозка / Fawn response)",
    shadowTrigger: "Жертва + Ескапіст / IFS Вигнанець",
    deficiencyMarker: "Гроші — це не про мене. Я творець, а не бухгалтер.",
    rsdTrigger: "Страх конфронтації з клієнтом: 'Якщо я попрошу гроші — він подумає, що я жадібний'",
    totemAdvice: "Ти плутаєш духовність з фінансовою безвідповідальністю. Гроші — це енергія. Відмовляючись від них, ти відмовляєшся від своєї сили.",
    abundanceResolution: "Написати клієнту ЗАРАЗ (не завтра). Формулювання: 'Відповідно до нашої угоди, оплата мала надійти [дата]. Коли я можу її очікувати?' Без емоцій, без пояснень.",
    consequences: "Хронічний фінансовий стрес. Резонанс з архетипом Жертви. Втрата самоповаги. Ескалація тривоги до панічних атак.",
    biometrics: {
      current: { cortisolLevel: 80, vagalTone: 20, cognitiveExhaustion: 85 },
      projected: { cortisolLevel: 40, vagalTone: 65, cognitiveExhaustion: 45 }
    },
    somaticInterventions: {
      supplements: ["L-Теанін (зняття тривоги)", "Вітамін B-комплекс (нервова система)", "Родіола Рожева"],
      exercises: ["Box Breathing 4-4-4-4 перед дзвінком", "Power Pose 2 хв (руки вгору)"]
    },
    somaticMap: { blockedZones: ["Живіт", "Горло"], targetZones: ["Груди", "Ноги"] },
    vectors: { dopamine: 20, cognitiveLoad: 90, rsdSafety: 10, financial: -80, spiritual: -30 },
    verdict: "Фінансова Заморозка (FOMO + Fawn)",
    isHappy: false
  },
  {
    description: "Я працюю 14 годин на добу вже третій тиждень. Я не відчуваю нічого — ні радості, ні втоми. Просто порожнеча.",
    identityArchetype: "Вигорілий Візіонер (Вібрація 11 — Дисоціація)",
    nervousSystemState: "Дорсальний Вагус (Shutdown / Дисоціація)",
    shadowTrigger: "Спостерігач + Перфекціоніст / IFS Менеджер у колапсі",
    deficiencyMarker: "Якщо я зупинюсь, все розвалиться. Я не маю права відпочивати.",
    rsdTrigger: "Відсутній (придушений дорсальним колапсом)",
    totemAdvice: "Ти не продуктивний — ти в режимі виживання. Твоє тіло вже кричить, але ти вимкнув звук. Що ти відчуєш, якщо зупинишся на 5 хвилин?",
    abundanceResolution: "СТОП. Лягти на підлогу на 5 хвилин (позиція «зірочка»). Дихати животом. Не перевіряти телефон. Дозволити собі НІЧОГО не робити.",
    consequences: "Повне вигорання протягом 2-4 тижнів. Колапс імунної системи. Ризик депресивного епізоду. Руйнування стосунків через емоційну недоступність.",
    biometrics: {
      current: { cortisolLevel: 95, vagalTone: 5, cognitiveExhaustion: 98 },
      projected: { cortisolLevel: 45, vagalTone: 60, cognitiveExhaustion: 50 }
    },
    somaticInterventions: {
      supplements: ["Мелатонін (відновлення циклу сну)", "Магній Гліцинат", "Вітамін C (антистрес)", "Omega-3"],
      exercises: ["Yoga Nidra 20 хв (нейронне відновлення)", "Контрастний душ", "Заборона екранів після 21:00"]
    },
    somaticMap: { blockedZones: ["Голова", "Очі", "Горло"], targetZones: ["Таз", "Ноги", "Живіт"] },
    vectors: { dopamine: 5, cognitiveLoad: 95, rsdSafety: 30, financial: 40, spiritual: -60 },
    verdict: "Дисоціативне Вигорання",
    isHappy: false
  },
  {
    description: "Я виграв тендер на великий проект. Адреналін зашкалює. Хочу одразу взятися за ще два проекти.",
    identityArchetype: "Маніакальний Мандрівник (Вібрація 5 — Гіпоманія)",
    nervousSystemState: "Симпатичний Вагус (Гіперактивація / Ейфорія)",
    shadowTrigger: "Перфекціоніст + Агресор / IFS Менеджер у режимі експансії",
    deficiencyMarker: "Я можу все! Зараз або ніколи! Треба ковтати поки дають!",
    rsdTrigger: "Відсутній (замаскований ейфорією)",
    totemAdvice: "Ейфорія — це такий же екстрем, як і депресія. Обидва стани — не ТИ. Перемога без інтеграції стає наступним вигоранням. Як ти себе почуватимеш через 3 дні, якщо візьмеш усі три проекти?",
    abundanceResolution: "Правило 48 годин: НЕ приймати жодних нових зобов'язань протягом 48 годин після перемоги. Записати план і покласти в шухляду. Подивитись на нього через 2 дні.",
    consequences: "Перевантаження. Порушення якості. Втрата репутації через невиконання обіцянок. Маніакально-депресивний цикл.",
    biometrics: {
      current: { cortisolLevel: 55, vagalTone: 50, cognitiveExhaustion: 40 },
      projected: { cortisolLevel: 25, vagalTone: 85, cognitiveExhaustion: 20 }
    },
    somaticInterventions: {
      supplements: ["L-Теанін (стабілізація)", "CBD олія (регуляція збудження)"],
      exercises: ["Повільна прогулянка 30 хв (без музики)", "Журналювання: записати 3 речі, за які вдячний"]
    },
    somaticMap: { blockedZones: ["Груди", "Голова"], targetZones: ["Живіт", "Таз", "Ноги"] },
    vectors: { dopamine: 95, cognitiveLoad: 55, rsdSafety: 80, financial: 70, spiritual: 10 },
    verdict: "Маніакальна Експансія (Ейфоричний Дефіцит)",
    isHappy: false
  }
];
