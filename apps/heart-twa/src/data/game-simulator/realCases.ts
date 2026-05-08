/**
 * REAL-WORLD CASE STUDIES DATABASE
 * 
 * After each level, the game shows a real case proving
 * the player is NOT the first person to face this situation.
 * 
 * Categories map to game vectors and crisis types.
 */

export interface RealCase {
  id: string;
  person: string;
  company?: string;
  year: string;
  category: CaseCategory;
  title: string;
  story: string;
  lesson: string;
  financialImpact: string;
  mentalInsight: string;
  source?: string;
}

export type CaseCategory =
  | "PARTNER_BETRAYAL"
  | "INTERNAL_FOOL"
  | "EXTERNAL_FOOL"
  | "CHEMISTRY_POISONING"   // Decisions under cortisol/dopamine
  | "CONTRACT_TRAP"
  | "SCALING_CRISIS"
  | "CASHFLOW_DEATH"
  | "EGO_DESTRUCTION"
  | "GRANT_FRAUD"
  | "DOUBLE_STANDARDS"
  | "CRM_ERP_FAILURE"
  | "ACCOUNTING_FRAUD"
  | "BANKING_TRAP"
  | "BLACK_SWAN_SURVIVAL"
  | "PROFICIT_MINDSET";

export const REAL_CASES: RealCase[] = [

  // ══════════════════════════════════════════
  // PARTNER BETRAYAL / ЗРАДИ
  // ══════════════════════════════════════════
  {
    id: "case_zuckerberg_winklevoss",
    person: "Марк Цукерберг",
    company: "Facebook / Meta",
    year: "2004",
    category: "PARTNER_BETRAYAL",
    title: "Брати Вінклвосс: ідея без договору = нуль",
    story: "Камерон та Тайлер Вінклвосс найняли Цукерберга для розробки ConnectU. Він взяв ідею та створив Facebook. Близнюки судилися 4 роки і отримали лише $65M компенсації — крихту від вартості компанії.",
    lesson: "Ідея без юридичного оформлення не належить нікому. Договір NDA + Shareholders Agreement ПЕРЕД початком роботи — єдиний захист.",
    financialImpact: "Вінклвосси втратили потенційні мільярди. Відсудили $65M з $500B+ вартості Meta.",
    mentalInsight: "Довіра без формалізації — це не дружба, це наївність. 'Ми ж домовились' — це фраза банкрутів.",
  },
  {
    id: "case_jobs_sculley",
    person: "Стів Джобс",
    company: "Apple",
    year: "1985",
    category: "PARTNER_BETRAYAL",
    title: "Засновника вигнали з власної компанії",
    story: "Джобс запросив Джона Скаллі (CEO Pepsi) керувати Apple. Через 2 роки Скаллі переконав раду директорів звільнити Джобса. Засновник втратив контроль через відсутність блокуючого пакету акцій.",
    lesson: "Не має значення, хто заснував компанію. Має значення, хто контролює голосуючі акції. Завжди зберігай блокуючий пакет (25%+1).",
    financialImpact: "Джобс втратив $200M+ в акціях. Повернувся через 12 років і створив найдорожчу компанію планети.",
    mentalInsight: "Рішення Джобса про найм Скаллі прийнято під тиском дофаміну ('Він розуміє маркетинг!'). Хімія замінила стратегічний аналіз.",
  },
  {
    id: "case_eduardo_saverin",
    person: "Едуардо Саверін",
    company: "Facebook",
    year: "2005",
    category: "PARTNER_BETRAYAL",
    title: "Розмиття частки співзасновника до 0.03%",
    story: "Саверін вклав $19k стартового капіталу і отримав 30% Facebook. Цукерберг через нову емісію акцій розмив його частку до 0.03%. Саверін подав до суду і відсудив повернення частки.",
    lesson: "Anti-dilution clause (захист від розмиття) — обов'язковий пункт будь-якого Shareholders Agreement.",
    financialImpact: "Саверін врешті отримав ~5% Facebook ≈ $5B. Але без суду отримав би $0.",
    mentalInsight: "Друзі-засновники — найнебезпечніша конструкція без формалізованих правил гри.",
  },

  // ══════════════════════════════════════════
  // INTERNAL FOOL (Дурень у команді)
  // ══════════════════════════════════════════
  {
    id: "case_knight_capital",
    person: "Томас Джойс (CEO)",
    company: "Knight Capital Group",
    year: "2012",
    category: "INTERNAL_FOOL",
    title: "Програміст не видалив тестовий код → $440M за 45 хвилин",
    story: "Технік забув видалити тестовий алгоритм при оновленні. За 45 хвилин автоматична торгівля згенерувала $440M збитків. Компанія збанкрутіла за 2 дні.",
    lesson: "Відсутність code review та staging environment — це не 'економія на IT', це бомба уповільненої дії. Системи мають бути foolproof.",
    financialImpact: "$440M втрачено за 45 хвилин. Компанія з 17 роками історії знищена.",
    mentalInsight: "Людина не планувала шкодити — вона 'зробила як краще'. Третій закон Чіполли: дурень шкодить без жодної вигоди для себе.",
  },
  {
    id: "case_samsung_note7",
    person: "Інженерний відділ",
    company: "Samsung",
    year: "2016",
    category: "INTERNAL_FOOL",
    title: "Note 7: тиск дедлайнів → телефони вибухають",
    story: "Менеджмент тиснув на інженерів випустити телефон до iPhone 7. Батарею не протестували належно. 35 випадків загоряння. Відкликано 2.5M пристроїв.",
    lesson: "Тиск на швидкість за рахунок якості — це прихована форма дурості менеджменту. Deadline anxiety (кортизол) перемикає мозок в режим 'зроби хоч щось'.",
    financialImpact: "$17B прямих збитків + репутаційні втрати.",
    mentalInsight: "Кортизол від дедлайну звузив 'тунель сприйняття' менеджерів. Вони бачили лише дату релізу, а не ризик.",
  },

  // ══════════════════════════════════════════
  // CHEMISTRY POISONING (Рішення під хімією)
  // ══════════════════════════════════════════
  {
    id: "case_adam_neumann",
    person: "Адам Нойман",
    company: "WeWork",
    year: "2019",
    category: "CHEMISTRY_POISONING",
    title: "Дофамін від 'візіонерства' → оцінка $47B → крах до $8B",
    story: "Нойман витрачав гроші інвесторів на серфінг, приватні літаки та вечірки. Кожна перемога генерувала дофамін, який підкріплював ілюзію. IPO провалилось, оцінка впала з $47B до $8B.",
    lesson: "Дофамінова петля успіху: кожна 'перемога' генерує хімічне підкріплення, яке блокує критичне мислення. Засновник перестає бачити реальні цифри.",
    financialImpact: "Інвестори SoftBank втратили $11.5B. Нойман отримав $1.7B 'golden parachute'.",
    mentalInsight: "Нойман не був шахраєм — він був отруєний власним дофаміном. Мозок буквально не міг розрізнити реальність від фантазії.",
  },
  {
    id: "case_theranos",
    person: "Елізабет Холмс",
    company: "Theranos",
    year: "2018",
    category: "CHEMISTRY_POISONING",
    title: "Fake it till you make it → 20 років в'язниці",
    story: "Холмс обіцяла революцію в аналізах крові. Технологія не працювала, але вона продовжувала залучати $700M+ інвестицій. Доки не запрацює, вона фальсифікувала результати.",
    lesson: "Коли ставки зростають, мозок виробляє кортизол + дофамін одночасно. Ця суміш створює стан, де людина щиро вірить у власну брехню.",
    financialImpact: "$700M інвестицій знищено. Засновниця отримала 11+ років в'язниці.",
    mentalInsight: "Холмс не починала як шахрайка. Вона починала як візіонерка. Але хімічна петля 'успіх → дофамін → більша брехня → більший успіх' затягнула її.",
  },

  // ══════════════════════════════════════════
  // CONTRACT TRAPS / Пастки договорів
  // ══════════════════════════════════════════
  {
    id: "case_50cent_vitamin",
    person: "50 Cent (Curtis Jackson)",
    company: "Vitamin Water / Glaceau",
    year: "2007",
    category: "CONTRACT_TRAP",
    title: "Прочитав договір → $100M замість гонорару",
    story: "50 Cent відмовився від стандартного рекламного гонорару $5M. Натомість домовився про частку в Glaceau (Vitamin Water). Коли Coca-Cola купила компанію за $4.1B, 50 Cent отримав $100M.",
    lesson: "Уважне читання договору та переговори про equity замість cash — стратегія мислення профіциту. Більшість бере 'синицю в руках'.",
    financialImpact: "$100M замість $5M — різниця у 20x від одного рішення.",
    mentalInsight: "Мислення профіциту: 50 Cent бачив можливість там, де 99% бачили лише ризик.",
  },
  {
    id: "case_george_lucas",
    person: "Джордж Лукас",
    company: "Lucasfilm / Star Wars",
    year: "1977",
    category: "CONTRACT_TRAP",
    title: "Відмовився від гонорару режисера → мільярди на мерчі",
    story: "Лукас попросив Fox залишити йому права на merchandising та сиквели замість підвищення режисерського гонорару. Fox погодились, думаючи що мерч нічого не варт. Це рішення принесло Лукасу $4B+.",
    lesson: "Найцінніший пункт договору — не гроші зараз, а права на майбутнє. Більшість людей не читають IP-клаузи.",
    financialImpact: "$4B+ від одного пункту договору.",
    mentalInsight: "Лукас мислив категоріями 'що буде через 10 років?', а не 'скільки я отримаю зараз?'.",
  },

  // ══════════════════════════════════════════
  // CASHFLOW DEATH
  // ══════════════════════════════════════════
  {
    id: "case_toys_r_us",
    person: "Рада директорів",
    company: "Toys R Us",
    year: "2017",
    category: "CASHFLOW_DEATH",
    title: "Борг у $5B задушив прибутковий бізнес",
    story: "Toys R Us приносив прибуток, але після leveraged buyout у 2005 році борг у $5B з'їдав весь cash flow на відсотки. Компанія збанкрутіла, 30,000 людей втратили роботу.",
    lesson: "Прибутковий бізнес може померти від боргового навантаження. Debt-to-equity ratio вище 2:1 — червона зона.",
    financialImpact: "$5B боргу знищило компанію з $11B річного обороту.",
    mentalInsight: "Фінансисти-бандити (за Чіполлою) заробили на комісіях від LBO, знищивши бізнес. Класичний win-lose.",
  },

  // ══════════════════════════════════════════
  // EGO / ПОДВІЙНІ СТАНДАРТИ
  // ══════════════════════════════════════════
  {
    id: "case_uber_kalanick",
    person: "Тревіс Каланік",
    company: "Uber",
    year: "2017",
    category: "EGO_DESTRUCTION",
    title: "Его CEO знищило культуру компанії на $70B",
    story: "Каланік створив токсичну культуру 'перемога за будь-яку ціну'. Сексуальні скандали, крадіжка технологій Waymo, скандал з водієм на камеру. Рада директорів змусила його піти.",
    lesson: "Его CEO — це не 'характер лідера', це системний ризик. Коли засновник ототожнює себе з компанією, його тіньові сторони стають тіньовими сторонами бізнесу.",
    financialImpact: "Uber втратив $20B+ капіталізації через репутаційні кризи.",
    mentalInsight: "Каланік оточив себе 'yes-men' (безпорадними за Чіполлою), які не могли протистояти його его.",
  },
  {
    id: "case_wirecard",
    person: "Маркус Браун (CEO)",
    company: "Wirecard",
    year: "2020",
    category: "ACCOUNTING_FRAUD",
    title: "€1.9B яких ніколи не існувало",
    story: "Wirecard — німецька фінтех-компанія з оцінкою €24B. Аудитори EY підписували звітність 10 років. Виявилось, що €1.9B на балансі просто не існує. CEO втік.",
    lesson: "Навіть Big Four аудитори можуть пропустити (або ігнорувати) фрод. Довіряй, але верифікуй. Незалежний аудит — не гарантія, а один з рівнів захисту.",
    financialImpact: "€24B капіталізації → €0. Найбільший корпоративний скандал Німеччини.",
    mentalInsight: "Подвійні стандарти: регулятори захищали Wirecard від журналістів FT замість того, щоб перевірити їхні звіти.",
  },

  // ══════════════════════════════════════════
  // BLACK SWAN SURVIVAL
  // ══════════════════════════════════════════
  {
    id: "case_airbnb_pandemic",
    person: "Браян Чеські (CEO)",
    company: "Airbnb",
    year: "2020",
    category: "BLACK_SWAN_SURVIVAL",
    title: "Пандемія знищила 80% доходу → IPO на $100B",
    story: "COVID обвалив бронювання Airbnb на 80% за 8 тижнів. Чеські звільнив 25% команди, зрізав маркетинг і сфокусувався на 'local stays'. Через 12 місяців Airbnb вийшов на IPO з оцінкою $100B.",
    lesson: "Антикрихкість: Чеські використав кризу для радикального спрощення бізнесу. Замість 'пережити бурю' він перебудував корабель під час шторму.",
    financialImpact: "Від -80% доходу до IPO на $100B за 18 місяців.",
    mentalInsight: "Мислення профіциту: 'Що ми можемо створити ЧЕРЕЗ цю кризу, а не ПОПРИ неї?'",
  },

  // ══════════════════════════════════════════
  // PROFICIT MINDSET
  // ══════════════════════════════════════════
  {
    id: "case_sara_blakely",
    person: "Сара Блейклі",
    company: "Spanx",
    year: "2000",
    category: "PROFICIT_MINDSET",
    title: "$5,000 стартового капіталу → мільярдерка без інвесторів",
    story: "Блейклі витратила $5,000 власних заощаджень на патент та прототип коригувальної білизни. Жоден інвестор не вірив у продукт. Вона зробила все сама: дизайн, пакування, продаж. Spanx досягнув $1B+ оцінки без зовнішніх інвестицій.",
    lesson: "Bootstrapping — повільніший шлях, але зберігає 100% контролю та ментального ресурсу. Відсутність інвесторів = відсутність тиску.",
    financialImpact: "$5,000 → $1B+. ROI який неможливо порахувати.",
    mentalInsight: "Мислення профіциту: 'Мені не потрібен чийсь дозвіл або чиїсь гроші. Я сама є достатнім ресурсом.'",
  },
];

// Get cases relevant to a specific game situation
export const getCasesByCategory = (cat: CaseCategory): RealCase[] =>
  REAL_CASES.filter(c => c.category === cat);

export const getRandomCase = (cat?: CaseCategory): RealCase => {
  const pool = cat ? getCasesByCategory(cat) : REAL_CASES;
  return pool[Math.floor(Math.random() * pool.length)];
};

// Map game events to case categories
export const EVENT_TO_CASE_MAP: Record<string, CaseCategory> = {
  "npc_rogue_partner": "PARTNER_BETRAYAL",
  "npc_supplier_monopoly": "DOUBLE_STANDARDS",
  "npc_burning_supplier": "CASHFLOW_DEATH",
  "npc_stupid_employee_db": "INTERNAL_FOOL",
  "npc_stupid_ego_deal": "EGO_DESTRUCTION",
  "npc_stupid_inspector": "EXTERNAL_FOOL",
  "npc_mentor_intro": "PROFICIT_MINDSET",
  "swan_pandemic": "BLACK_SWAN_SURVIVAL",
  "swan_currency_crash": "BANKING_TRAP",
  "swan_cyber_attack": "CRM_ERP_FAILURE",
  "swan_regulatory_ban": "DOUBLE_STANDARDS",
};
