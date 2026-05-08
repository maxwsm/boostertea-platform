/**
 * CIPOLLA SCALE MATRIX
 * Same stupidity pattern at 3 financial scales — real cases
 * Proves: stupidity is scale-invariant (Law 2)
 */

export interface CipollaScaleCase {
  patternId: string;
  patternName: string;
  cipollaPrinciple: string;
  scales: {
    small: ScaleExample;   // $100-level (freelancer / micro)
    medium: ScaleExample;  // $50k-level (SME)
    large: ScaleExample;   // $1M+ level (corporation / country)
  };
}

export interface ScaleExample {
  level: string;
  realEntity: string;
  year: string;
  loss: string;
  description: string;
}

export const CIPOLLA_SCALE_CASES: CipollaScaleCase[] = [
  {
    patternId: "scale_no_backup",
    patternName: "Відсутність резервної копії",
    cipollaPrinciple: "Закон 3: шкода без вигоди. На будь-якому масштабі — нуль логіки, максимум руйнувань.",
    scales: {
      small: {
        level: "$100",
        realEntity: "Фрілансер-дизайнер",
        year: "щодня",
        loss: "$500 — тиждень роботи",
        description: "Ноутбук зламався, проєкт клієнта не збережений. Клієнт пішов. Фрілансер не зробив backup 'бо лінь'.",
      },
      medium: {
        level: "$50k",
        realEntity: "Knight Capital Group",
        year: "2012",
        loss: "$440M за 45 хвилин",
        description: "Тестовий код не видалений при деплої. Відсутність staging environment. $440M збитків за 45 хвилин. Компанія з 17-річною історією знищена.",
      },
      large: {
        level: "$1M+",
        realEntity: "British Airways",
        year: "2017",
        loss: "$150M",
        description: "IT-підрядник випадково вимкнув UPS (безперебійне живлення) дата-центру. 75,000 пасажирів застрягли. Збиток $150M. Дурень — один підрядник без чек-листа.",
      },
    },
  },
  {
    patternId: "scale_no_contract",
    patternName: "Бізнес без договору ('ми ж домовились')",
    cipollaPrinciple: "Закон 4: розумні недооцінюють бандитів. На всіх рівнях — довіра без паперу = нуль.",
    scales: {
      small: {
        level: "$100",
        realEntity: "Кафе 'У Марини'",
        year: "типовий",
        loss: "$3,000",
        description: "Постачальник кави 'домовився усно' про знижку 20%. Через 3 місяці ціни повернулись. 'Я нічого не обіцяв' — і формально правий.",
      },
      medium: {
        level: "$50k",
        realEntity: "Winklevoss vs Zuckerberg",
        year: "2004",
        loss: "потенційні мільярди",
        description: "Брати Вінклвосс найняли Цукерберга без формального контракту на IP. Він взяв ідею та створив Facebook. Відсудили $65M з $500B+.",
      },
      large: {
        level: "$1M+",
        realEntity: "Snapchat vs Reggie Brown",
        year: "2013",
        loss: "$157.5M компенсація",
        description: "Третій співзасновник Snapchat (Реджі Браун) був виключений без формальної угоди. Відсудив $157.5M. Один параграф Founders Agreement міг запобігти цьому.",
      },
    },
  },
  {
    patternId: "scale_ego_decision",
    patternName: "Рішення під его (кортизол + дофамін)",
    cipollaPrinciple: "Закон 5: дурень небезпечніший за бандита. Его перетворює CEO на системний ризик.",
    scales: {
      small: {
        level: "$100",
        realEntity: "Власник барбершопу",
        year: "типовий",
        loss: "$2,000/міс. у клієнтах",
        description: "Власник публічно посварився з клієнтом в Instagram Stories. Скріншот розійшовся. 30% клієнтів пішли до конкурента.",
      },
      medium: {
        level: "$50k",
        realEntity: "WeWork (Адам Нойман)",
        year: "2019",
        loss: "$39B капіталізації",
        description: "Дофамін від 'візіонерства' привів до витрат $60k/міс на серфінг та приватні літаки. IPO провалилось. Оцінка впала з $47B до $8B.",
      },
      large: {
        level: "$1M+",
        realEntity: "Uber (Тревіс Каланік)",
        year: "2017",
        loss: "$20B+ капіталізації",
        description: "Культура 'перемога за будь-яку ціну' призвела до сексуальних скандалів, крадіжки IP Waymo, публічного конфлікту з водієм. CEO звільнений радою директорів.",
      },
    },
  },
  {
    patternId: "scale_single_dependency",
    patternName: "Залежність від одного (людини/клієнта/постачальника)",
    cipollaPrinciple: "Закон 1: ви недооцінюєте ймовірність катастрофи. Один постачальник = один point of failure.",
    scales: {
      small: {
        level: "$100",
        realEntity: "Інстаграм-магазин",
        year: "2024",
        loss: "100% доходу",
        description: "Єдиний канал продажу — Instagram. Акаунт заблоковано за 'підозрілу активність'. Бізнес зупинено на 2 тижні. Нуль альтернатив.",
      },
      medium: {
        level: "$50k",
        realEntity: "Toys R Us",
        year: "2017",
        loss: "$5B борг → банкрутство",
        description: "Прибутковий бізнес з $11B обороту задушений одним leveraged buyout. Залежність від одного фінансового інструменту знищила 30,000 робочих місць.",
      },
      large: {
        level: "$1M+",
        realEntity: "Європа → Російський газ",
        year: "2022",
        loss: "€1 трильйон+ енергетична криза",
        description: "Залежність від одного постачальника енергоносіїв. Одне геополітичне рішення → енергетична криза цілого континенту. Ціни виросли в 10x.",
      },
    },
  },
  {
    patternId: "scale_accounting_fraud",
    patternName: "Фальсифікація звітності ('все ок, я контролюю')",
    cipollaPrinciple: "Закон 2: дурість/бандитизм не залежить від розміру компанії чи диплому аудитора.",
    scales: {
      small: {
        level: "$100",
        realEntity: "ФОП на єдиному податку",
        year: "типовий",
        loss: "$5,000 штраф + кримінал",
        description: "Бухгалтер 'оптимізує' через фіктивні чеки. Податкова перевірка → донарахування + штраф 200%. 'Так всі роблять' — поки не зловлять.",
      },
      medium: {
        level: "$50k",
        realEntity: "Wirecard",
        year: "2020",
        loss: "€24B → €0",
        description: "Німецький фінтех: €1.9B на балансі не існувало. Аудитори EY підписували 10 років. CEO втік. Найбільший корпоративний скандал Німеччини.",
      },
      large: {
        level: "$1M+",
        realEntity: "Enron",
        year: "2001",
        loss: "$74B капіталізації",
        description: "Систематична фальсифікація через SPV (special purpose vehicles). Arthur Andersen (аудитор) знищив документи. 20,000 людей втратили пенсії. Один з найбільших крахів в історії.",
      },
    },
  },
  {
    patternId: "scale_nepotism",
    patternName: "Кумівство та блат ('він свій, значить підходить')",
    cipollaPrinciple: "Закон 2: ймовірність дурної дії не залежить від посади, віку, чи кількості грошей.",
    scales: {
      small: {
        level: "$100",
        realEntity: "Сімейна пекарня",
        year: "типовий",
        loss: "$15,000/рік — різниця між компетентним і некомпетентним менеджером",
        description: "Племінник 'керує' пекарнею. Не вміє рахувати собівартість, замовляє на око. Списання 30% продукції. Сім'я мовчить 'бо він же свій'.",
      },
      medium: {
        level: "$50k",
        realEntity: "Parmalat (Італія)",
        year: "2003",
        loss: "€14B",
        description: "Сімейна компанія — засновник Танці призначив родичів на ключові фінансові позиції. Схема Понці на €14B. 36,000 інвесторів втратили заощадження.",
      },
      large: {
        level: "$1M+",
        realEntity: "Samsung Group (Корея)",
        year: "2017",
        loss: "$36B — вартість скандалу",
        description: "Спадкоємець Лі Дже Йон засуджений за хабарництво для забезпечення передачі влади в сімейному конгломераті. Корейська модель chaebol — кумівство на рівні економіки країни.",
      },
    },
  },
];

export const getScaleCaseForEvent = (patternId: string): CipollaScaleCase | undefined =>
  CIPOLLA_SCALE_CASES.find(c => c.patternId === patternId);
