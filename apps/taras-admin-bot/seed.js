// BoosterTea Command System v2.0 — Seed: Skills, Resources, Contacts, Achievements, Milestones
// Run: node seed.js

const { PrismaClient } = require('./prisma/client');
const prisma = new PrismaClient();

// ═══════════════════════════════════════════
// SKILL CATEGORIES & SKILLS (12 Ultra Skills)
// ═══════════════════════════════════════════

const SKILL_CATEGORIES = [
  {
    slug: 'ai-engineering',
    name: 'AI & Prompt Engineering',
    icon: '🤖',
    sortOrder: 1,
    skills: [
      { slug: 'prompt-engineering', name: 'Prompt Engineering', tier: 'base', description: 'Структурування промптів: роль → контекст → задача → формат. Побудова складних ланцюгових запитів.' },
      { slug: 'ai-coding', name: 'AI-Assisted Coding', tier: 'mid', description: 'Використання Antigravity, Cursor, Claude Code для побудови додатків та ботів без класичного кодингу.' },
      { slug: 'ai-automation', name: 'AI Automation', tier: 'pro', description: 'Автоматизація бізнес-процесів через AI: звіти, аналітика, генерація контенту, прийняття рішень.' },
    ]
  },
  {
    slug: 'web-development',
    name: 'Full-Stack Web Dev',
    icon: '💻',
    sortOrder: 2,
    skills: [
      { slug: 'web-basics', name: 'Web Fundamentals', tier: 'base', description: 'HTML, CSS, JavaScript основи. Як працює веб, домени, хостинг.' },
      { slug: 'telegram-bots', name: 'Telegram Bots & TWA', tier: 'mid', description: 'Створення ботів (Telegraf), Telegram Web Apps, Express API.' },
      { slug: 'databases', name: 'Database Design', tier: 'pro', description: 'Проектування схем БД (Prisma), міграції, оптимізація запитів, реляційна логіка.' },
    ]
  },
  {
    slug: 'digital-marketing',
    name: 'Digital Marketing',
    icon: '📊',
    sortOrder: 3,
    skills: [
      { slug: 'meta-ads', name: 'Meta Ads (FB/IG)', tier: 'base', description: 'Структура кампаній, аудиторії (cold/warm/hot), LAL, CBO vs ABO, A/B тести.' },
      { slug: 'seo-analytics', name: 'SEO & Analytics', tier: 'mid', description: 'Google Analytics, Search Console, ключові метрики, UTM, attribution models.' },
      { slug: 'tiktok-youtube-ads', name: 'TikTok & YouTube Ads', tier: 'mid', description: 'Рекламні формати, CPM vs CPC, автоматичні стратегії, креативи.' },
      { slug: 'google-ads', name: 'Google Ads & PMax', tier: 'mid', description: 'Пошукова реклама, Performance Max, Smart Shopping, конверсії.' },
      { slug: 'tracking-pixel', name: 'Pixel & GTM Setup', tier: 'base', description: 'Meta Pixel, Conversions API, Google Tag Manager, Data Layer events.' },
    ]
  },
  {
    slug: 'neuromarketing',
    name: 'Neuromarketing & Psychology',
    icon: '🧠',
    sortOrder: 4,
    skills: [
      { slug: 'cognitive-biases', name: 'Cognitive Biases', tier: 'base', description: 'Anchoring, FOMO, Social Proof, Scarcity, Decoy Effect, Loss Aversion.' },
      { slug: 'pricing-psychology', name: 'Pricing Psychology', tier: 'mid', description: 'Charm pricing, bundle logic, decoy pricing, subscription models.' },
      { slug: 'consumer-neuroscience', name: 'Consumer Neuroscience', tier: 'pro', description: 'System 1 vs 2 (Kahneman), вплив кольору/текстури на конверсію, UX psychology.' },
    ]
  },
  {
    slug: 'mixology-rnd',
    name: 'Mixology & Product R&D',
    icon: '🧪',
    sortOrder: 5,
    skills: [
      { slug: 'flavor-engineering', name: 'Flavor Engineering', tier: 'base', description: 'Смакові комбінації, багатоповерхові конструкції, пропорції, поєднання непоєднуваного.' },
      { slug: 'stabilization', name: 'Product Stabilization', tier: 'mid', description: 'Стабілізатори, гомогенність, shelf-life, прекурсори, ароматизатори.' },
      { slug: 'saturation-tech', name: 'Saturation Technology', tier: 'pro', description: 'Сатурація CO2, температурні режими, промислове обладнання, масовий розлив.' },
    ]
  },
  {
    slug: 'business-architecture',
    name: 'Business Architecture',
    icon: '🏗️',
    sortOrder: 6,
    skills: [
      { slug: 'ecosystem-thinking', name: 'Ecosystem Thinking', tier: 'base', description: 'Мульти-проектне управління, причинно-наслідкові зв\'язки, системний підхід.' },
      { slug: 'startup-methodology', name: 'Startup Methodology', tier: 'mid', description: 'MVP, Product-Market Fit, OKR, Kanban, BEER, agile без бюрократії.' },
      { slug: 'scaling', name: 'Scaling Operations', tier: 'pro', description: 'Масштабування команди, процесів, виробництва. Від 4 людей до 40.' },
    ]
  },
  {
    slug: 'financial-modeling',
    name: 'Financial Modeling',
    icon: '💰',
    sortOrder: 7,
    skills: [
      { slug: 'unit-economics', name: 'Unit Economics', tier: 'base', description: 'CAC, LTV, ARPU, Churn, Payback Period, маржинальність.' },
      { slug: 'pl-cashflow', name: 'P&L & Cash Flow', tier: 'mid', description: 'Прибутки та збитки, грошовий потік, burn rate, фін.планування.' },
      { slug: 'banking-grants', name: 'Banking & Grants', tier: 'mid', description: 'ФОП vs ТОВ, банківські кредити, EU4Business, USAID, грантові програми.' },
    ]
  },
  {
    slug: 'negotiation',
    name: 'Negotiation & Communication',
    icon: '🗣️',
    sortOrder: 8,
    skills: [
      { slug: 'elevator-pitch', name: 'Elevator Pitch', tier: 'base', description: '30-секундне пояснення проекту. Структура: проблема → рішення → чому ми.' },
      { slug: 'harvard-negotiation', name: 'Harvard Negotiation', tier: 'mid', description: 'BATNA, якорення, win-win фреймворк, принципи Chris Voss (Never Split the Difference).' },
      { slug: 'b2b-sales', name: 'B2B Sales', tier: 'mid', description: 'Проведення зустрічей, closing, follow-up, pipeline management.' },
      { slug: 'public-speaking', name: 'Public Speaking', tier: 'pro', description: 'Body language, гучність/темп/паузи, live-стріми, презентації.' },
    ]
  },
  {
    slug: 'legal-compliance',
    name: 'Legal & Compliance',
    icon: '⚖️',
    sortOrder: 9,
    skills: [
      { slug: 'tm-certification', name: 'TM & Certification', tier: 'base', description: 'Торгова марка, ХАСП (HACCP), штрих-коди, сертифікація харчового виробництва.' },
      { slug: 'fop-tov', name: 'FOP/TOV & Taxes', tier: 'mid', description: 'Форми підприємництва, податкова звітність, спрощена система, ПДВ.' },
    ]
  },
  {
    slug: 'team-psychology',
    name: 'Team Psychology',
    icon: '👥',
    sortOrder: 10,
    skills: [
      { slug: 'motivation-frameworks', name: 'Motivation Frameworks', tier: 'base', description: 'Внутрішня vs зовнішня мотивація, XP/gamification, мікро-перемоги.' },
      { slug: 'conflict-resolution', name: 'Conflict Resolution', tier: 'mid', description: 'Управління конфліктами, delegation framework, feedback loops.' },
    ]
  },
  {
    slug: 'web3-tokenomics',
    name: 'Web3 & Tokenomics',
    icon: '🔗',
    sortOrder: 11,
    skills: [
      { slug: 'blockchain-basics', name: 'Blockchain Basics', tier: 'base', description: 'Блокчейн, смарт-контракти, гаманці, DeFi основи.' },
      { slug: 'tokenomics', name: 'Tokenomics Design', tier: 'pro', description: 'Token utility, vesting, governance, incentive models.' },
    ]
  },
  {
    slug: 'design-thinking',
    name: 'Design Thinking',
    icon: '🎨',
    sortOrder: 12,
    skills: [
      { slug: 'visual-storytelling', name: 'Visual Storytelling', tier: 'base', description: 'Мудборди, кольорові палітри, композиція, атмосфера бренду.' },
      { slug: 'video-production', name: 'Video Production', tier: 'mid', description: 'Зйомка, світло, монтаж (DaVinci Resolve), UGC framework.' },
      { slug: 'product-design', name: 'Product & Packaging Design', tier: 'mid', description: 'Упаковка, ергономіка, shelf-appeal, бренд-носії.' },
    ]
  },
];

// ═══════════════════════════════════════════
// CONTACTS (підрядники з boostertea_context.js)
// ═══════════════════════════════════════════

const CONTACTS = [
  { name: 'Вадим', phone: '067 208 46 45', category: 'printing', contactRole: 'supplier', description: 'Упаковка, мерч, наліпки, тримачі на 6 пляшок' },
  { name: 'Олександр (Худі)', phone: '093 879 97 92', category: 'printing', contactRole: 'supplier', description: 'Друк на одязі: худі, мерч' },
  { name: 'Людмила', phone: '095 240 02 70', category: 'printing', contactRole: 'supplier', description: 'Масові етикетки' },
  { name: 'Юра', phone: '097 244 20 42', category: 'printing', contactRole: 'supplier', description: 'Шеврони' },
  { name: 'Іван (Чернівці)', phone: '050 832 32 54', category: 'packaging', contactRole: 'supplier', description: 'Двогорлова тара, дозатори' },
  { name: 'АСТ Тара', phone: null, category: 'packaging', contactRole: 'supplier', description: 'Каністри. ast-tara.com', company: 'АСТ' },
  { name: 'Женя', phone: '095 457 00 41', category: 'ingredients', contactRole: 'supplier', description: 'Чай, сировина — ключовий постачальник' },
  { name: 'Віктор', phone: '063 693 92 74', category: 'ingredients', contactRole: 'supplier', description: 'Стабілізатори, прекурсори, ароматизатори' },
  { name: 'Ігор (Юрист)', phone: '098 566 35 97', category: 'legal', contactRole: 'legal', description: 'Юрист: ТМ, ХАСП, меморандум, сертифікація' },
  { name: 'Олександр (Горінка)', phone: '098 545 24 97', category: 'production', contactRole: 'partner', description: 'Фасовка стіків' },
  { name: 'Роман (Маклер)', phone: null, category: 'logistics', contactRole: 'partner', description: 'Приміщення для виробництва' },
  { name: 'Марія Василівна', phone: '097 254 87 00', category: 'legal', contactRole: 'supplier', description: 'Метрологія, повірка обладнання' },
];

// ═══════════════════════════════════════════
// ACHIEVEMENTS
// ═══════════════════════════════════════════

const ACHIEVEMENTS = [
  { slug: 'first-blood', name: 'First Blood', description: 'Перша виконана задача', icon: '🩸', xpReward: 10, condition: '{"type":"task_count","value":1}' },
  { slug: 'five-alive', name: 'Five Alive', description: '5/5 задач за один день', icon: '🔥', xpReward: 50, condition: '{"type":"perfect_day","value":1}' },
  { slug: 'week-streak', name: 'Week Warrior', description: '7 днів без пропусків', icon: '⚡', xpReward: 100, condition: '{"type":"streak","value":7}' },
  { slug: 'two-week-streak', name: 'Iron Will', description: '14 днів без пропусків', icon: '🏆', xpReward: 250, condition: '{"type":"streak","value":14}' },
  { slug: 'skill-starter', name: 'Skill Starter', description: 'Обрав перші 3 скіли', icon: '📚', xpReward: 25, condition: '{"type":"skills_selected","value":3}' },
  { slug: 'level-5', name: 'Rising Star', description: 'Досягнув 5 рівня', icon: '⭐', xpReward: 100, condition: '{"type":"level","value":5}' },
  { slug: 'level-10', name: 'Unstoppable', description: 'Досягнув 10 рівня', icon: '🚀', xpReward: 250, condition: '{"type":"level","value":10}' },
  { slug: 'cross-assigner', name: 'Task Master', description: 'Призначив 10 задач іншим', icon: '🎯', xpReward: 50, condition: '{"type":"assign_count","value":10}' },
  { slug: 'contact-builder', name: 'Network Builder', description: 'Додав 5 контактів в CRM', icon: '📇', xpReward: 30, condition: '{"type":"contact_count","value":5}' },
  { slug: 'ai-explorer', name: 'AI Explorer', description: '10 розмов з Валєрою', icon: '🤖', xpReward: 40, condition: '{"type":"chat_sessions","value":10}' },
  { slug: 'speed-demon', name: 'Speed Demon', description: 'Закрив всі задачі до 13:00', icon: '💨', xpReward: 75, condition: '{"type":"early_finish","value":1}' },
  { slug: 'resource-hunter', name: 'Resource Hunter', description: 'Опрацював 20 ресурсів', icon: '🎓', xpReward: 60, condition: '{"type":"resources_done","value":20}' },
];

// ═══════════════════════════════════════════
// MILESTONES (7/14/21/30 дні)
// ═══════════════════════════════════════════

const MILESTONES = [
  { title: 'Тиждень 1: Фундамент', description: 'Легальна база, перший контент, виробничі контакти, логістика', targetDay: 7, milestoneType: 'team', metrics: '{"tasks_completed":35,"contacts_added":10}' },
  { title: 'Тиждень 2: Машина працює', description: 'Перші продажі, блогер-бокси відправлені, pixel налаштований', targetDay: 14, milestoneType: 'team', metrics: '{"first_sale":true,"pixel_events":100}' },
  { title: 'Тиждень 3: Масштабування', description: 'B2B партнерства, ретаргет, команда в потоці', targetDay: 21, milestoneType: 'team', metrics: '{"b2b_meetings":5,"roas_positive":true}' },
  { title: 'Місяць: Швидкість', description: '600-800 чеків/день B2C, переїзд на Городоцьку 242', targetDay: 30, milestoneType: 'team', metrics: '{"daily_orders":600,"facility_ready":true}' },
];

// ═══════════════════════════════════════════
// RESOURCES (YouTube, Apps, Accounts)
// ═══════════════════════════════════════════

const RESOURCES = [
  // TARAS YouTube
  { type: 'youtube', name: 'Y Combinator', url: 'https://youtube.com/@ycombinator', description: 'Стартап стратегія, pitch, scaling', targetRole: 'taras', priority: 1 },
  { type: 'youtube', name: 'Alex Hormozi', url: 'https://youtube.com/@AlexHormozi', description: 'Unit-економіка, оффери, масштабування', targetRole: 'taras', priority: 1 },
  { type: 'youtube', name: 'Simon Sinek', url: 'https://youtube.com/@SimonSinek', description: 'Лідерство, мотивація, "Start with Why"', targetRole: 'taras', priority: 1 },
  { type: 'youtube', name: 'The Futur (Chris Do)', url: 'https://youtube.com/@thefutur', description: 'Бізнес + креатив + комунікація', targetRole: 'taras', priority: 2 },
  { type: 'youtube', name: 'Ali Abdaal', url: 'https://youtube.com/@aliabdaal', description: 'Продуктивність, системи', targetRole: 'taras', priority: 2 },
  { type: 'youtube', name: 'Google for Startups', url: 'https://youtube.com/@GoogleforStartups', description: 'Офіційні гайди від Google', targetRole: 'taras', priority: 2 },
  { type: 'youtube', name: 'Patrick Boyle', url: 'https://youtube.com/@PBoyle', description: 'Фінанси, економіка, інвестиції', targetRole: 'taras', priority: 3 },
  { type: 'youtube', name: 'Whiteboard Crypto', url: 'https://youtube.com/@WhiteboardCrypto', description: 'Web3 основи простою мовою', targetRole: 'taras', priority: 3 },

  // MYKYTA YouTube
  { type: 'youtube', name: 'Dara Denney', url: 'https://youtube.com/@DaraDenney', description: 'Meta Ads — найкращий канал по Meta', targetRole: 'mykyta', priority: 1 },
  { type: 'youtube', name: 'Wes McDowell', url: 'https://youtube.com/@WesMcDowell', description: 'Digital marketing стратегія', targetRole: 'mykyta', priority: 1 },
  { type: 'youtube', name: 'Andrew Huberman', url: 'https://youtube.com/@hubaboratorylab', description: 'Нейронаука: мозок, мотивація, фокус', targetRole: 'mykyta', priority: 1 },
  { type: 'youtube', name: 'Vanessa Van Edwards', url: 'https://youtube.com/@ScienceofPeople', description: 'Комунікація, body language, переговори', targetRole: 'mykyta', priority: 2 },
  { type: 'youtube', name: 'GaryVee', url: 'https://youtube.com/@garyvee', description: 'Контент-маркетинг, hustle, соц.мережі', targetRole: 'mykyta', priority: 2 },
  { type: 'youtube', name: 'Sorted Food', url: 'https://youtube.com/@SortedFood', description: 'Food business, food tech', targetRole: 'mykyta', priority: 3 },
  { type: 'youtube', name: 'HubSpot', url: 'https://youtube.com/@HubSpot', description: 'Inbound marketing, CRM', targetRole: 'mykyta', priority: 3 },

  // NAZAR YouTube
  { type: 'youtube', name: 'Peter McKinnon', url: 'https://youtube.com/@PeterMcKinnon', description: 'Кіновиробництво, камера, світло', targetRole: 'nazar', priority: 1 },
  { type: 'youtube', name: 'Daniel Schiffer', url: 'https://youtube.com/@DanielSchiffer', description: 'Product cinematography (top-tier)', targetRole: 'nazar', priority: 1 },
  { type: 'youtube', name: 'How To Drink', url: 'https://youtube.com/@HowToDrink', description: 'Міксологія нового рівня', targetRole: 'nazar', priority: 1 },
  { type: 'youtube', name: 'Charisma on Command', url: 'https://youtube.com/@CharismaOnCommand', description: 'Комунікація, впевненість ⚠️ КРИТИЧНО', targetRole: 'nazar', priority: 1 },
  { type: 'youtube', name: 'Casey Neistat', url: 'https://youtube.com/@CaseyNeistat', description: 'Storytelling, vlog, автентичність', targetRole: 'nazar', priority: 2 },
  { type: 'youtube', name: 'Matt D\'Avella', url: 'https://youtube.com/@MattDAvella', description: 'Мінімалізм, продуктивність, дисципліна', targetRole: 'nazar', priority: 3 },

  // ALL YouTube
  { type: 'youtube', name: 'Chris Do / The Futur', url: 'https://youtube.com/@thefutur', description: 'Брендинг, pricing, позиціонування', targetRole: 'all', priority: 2 },
  { type: 'youtube', name: 'Sorted Food', url: 'https://youtube.com/@SortedFood', description: 'Food tech + креатив', targetRole: 'all', priority: 3 },

  // APPS — TARAS
  { type: 'app', name: 'Claude Pro', description: 'AI для стратегії та deep thinking', targetRole: 'taras', priority: 1 },
  { type: 'app', name: 'Gemini Advanced', description: 'Google-інтегрований AI', targetRole: 'taras', priority: 1 },
  { type: 'app', name: 'Antigravity / Cursor', description: 'AI-кодинг — будувати разом з Максом', targetRole: 'taras', priority: 1 },
  { type: 'app', name: 'Notion', description: 'Стратегічне планування, OKR', targetRole: 'taras', priority: 1 },
  { type: 'app', name: 'Google Sheets', description: 'Фін.моделі, P&L', targetRole: 'taras', priority: 2 },
  { type: 'app', name: 'Miro', description: 'Візуалізація процесів', targetRole: 'taras', priority: 2 },
  { type: 'app', name: 'Loom', description: 'Відео-звіти і async комунікація', targetRole: 'taras', priority: 3 },

  // APPS — MYKYTA
  { type: 'app', name: 'Meta Business Suite', description: 'Управління рекламою FB/IG', targetRole: 'mykyta', priority: 1 },
  { type: 'app', name: 'Google Tag Manager', description: 'Трекінг подій', targetRole: 'mykyta', priority: 1 },
  { type: 'app', name: 'Google Analytics 4', description: 'Аналітика сайту', targetRole: 'mykyta', priority: 1 },
  { type: 'app', name: 'Canva Pro', description: 'Швидкі креативи', targetRole: 'mykyta', priority: 2 },
  { type: 'app', name: 'CapCut', description: 'Монтаж UGC', targetRole: 'mykyta', priority: 2 },
  { type: 'app', name: 'Claude / ChatGPT', description: 'Копірайтинг, аналітика, ідеї', targetRole: 'mykyta', priority: 1 },

  // APPS — NAZAR
  { type: 'app', name: 'DaVinci Resolve', description: 'Монтаж (безкоштовний, потужний)', targetRole: 'nazar', priority: 1 },
  { type: 'app', name: 'Lightroom Mobile', description: 'Обробка фото', targetRole: 'nazar', priority: 1 },
  { type: 'app', name: 'CapCut', description: 'Швидкий монтаж для IG/TT', targetRole: 'nazar', priority: 2 },
  { type: 'app', name: 'Pinterest', description: 'Мудборди, надивленість', targetRole: 'nazar', priority: 1 },
  { type: 'app', name: 'VSCO / Color Story', description: 'Єдиний візуальний стиль', targetRole: 'nazar', priority: 3 },
  { type: 'app', name: 'Figma', description: 'Мудборди, дизайн-мислення', targetRole: 'nazar', priority: 3 },

  // APPS — ALL
  { type: 'app', name: 'Perplexity', description: 'AI-пошук, дослідження ринку', targetRole: 'all', priority: 2 },
  { type: 'app', name: 'Notion', description: 'База знань, планування', targetRole: 'all', priority: 1 },
  { type: 'app', name: 'Telegram', description: 'Основний робочий інструмент', targetRole: 'all', priority: 1 },

  // ACCOUNTS — TARAS
  { type: 'account', name: 'Google Skillshop', url: 'https://skillshop.exceedlms.com', description: 'Безкоштовні сертифікати Google', targetRole: 'taras', priority: 1 },
  { type: 'account', name: 'HubSpot Academy', url: 'https://academy.hubspot.com', description: 'CRM, продажі, маркетинг (безкоштовно)', targetRole: 'taras', priority: 2 },
  { type: 'account', name: 'Coursera', url: 'https://coursera.org', description: 'AI for Everyone by Andrew Ng', targetRole: 'taras', priority: 2 },
  { type: 'account', name: 'ProductHunt', url: 'https://producthunt.com', description: 'Надивленість на продукти', targetRole: 'taras', priority: 3 },
  { type: 'account', name: 'LinkedIn', url: 'https://linkedin.com', description: 'B2B нетворкінг (активний профіль)', targetRole: 'taras', priority: 2 },

  // ACCOUNTS — MYKYTA
  { type: 'account', name: 'Meta Blueprint', url: 'https://facebook.com/business/learn', description: 'Сертифікати Meta (безкоштовно)', targetRole: 'mykyta', priority: 1 },
  { type: 'account', name: 'Google Skillshop', url: 'https://skillshop.exceedlms.com', description: 'Google Ads, Analytics сертифікати', targetRole: 'mykyta', priority: 1 },
  { type: 'account', name: 'Pinterest Business', url: 'https://pinterest.com/business', description: 'Надивленість + трафік', targetRole: 'mykyta', priority: 3 },

  // ACCOUNTS — NAZAR
  { type: 'account', name: 'Skillshare', url: 'https://skillshare.com', description: 'DaVinci Resolve курси, фото', targetRole: 'nazar', priority: 2 },
  { type: 'account', name: 'Pinterest Business', url: 'https://pinterest.com/business', description: 'Мудборди + трафік', targetRole: 'nazar', priority: 2 },
  { type: 'account', name: 'Behance', url: 'https://behance.net', description: 'Надивленість на дизайн', targetRole: 'nazar', priority: 3 },
  { type: 'account', name: 'YouTube (свій канал)', url: 'https://youtube.com', description: 'Початок brand ambassadorship', targetRole: 'nazar', priority: 2 },
];

// ═══════════════════════════════════════════
// SEED FUNCTION
// ═══════════════════════════════════════════

async function seed() {
  console.log('🌱 Seeding BoosterTea Command System v2.0...\n');

  // 1. Skill Categories & Skills
  console.log('📚 Seeding Skills...');
  for (const cat of SKILL_CATEGORIES) {
    const created = await prisma.skillCategory.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, icon: cat.icon, sortOrder: cat.sortOrder },
      create: { slug: cat.slug, name: cat.name, icon: cat.icon, sortOrder: cat.sortOrder },
    });
    for (const skill of cat.skills) {
      await prisma.skill.upsert({
        where: { slug: skill.slug },
        update: { name: skill.name, description: skill.description, tier: skill.tier, categoryId: created.id },
        create: { slug: skill.slug, name: skill.name, description: skill.description, tier: skill.tier, categoryId: created.id },
      });
    }
    console.log(`  ✅ ${cat.icon} ${cat.name}: ${cat.skills.length} skills`);
  }

  // 2. Contacts
  console.log('\n👥 Seeding Contacts...');
  const adminUser = await prisma.user.findFirst({ where: { role: 'maks' } });
  const creatorId = adminUser?.telegramId || '8374356466';
  
  // Ensure creator user exists
  await prisma.user.upsert({
    where: { telegramId: creatorId },
    update: {},
    create: { telegramId: creatorId, role: 'maks', name: 'Макс' },
  });

  for (const c of CONTACTS) {
    const existing = await prisma.contact.findFirst({ where: { name: c.name } });
    if (!existing) {
      await prisma.contact.create({
        data: { ...c, createdById: creatorId },
      });
      console.log(`  ✅ ${c.name} (${c.category})`);
    } else {
      console.log(`  ⏭️ ${c.name} (already exists)`);
    }
  }

  // 3. Achievements
  console.log('\n🏆 Seeding Achievements...');
  for (const a of ACHIEVEMENTS) {
    await prisma.achievement.upsert({
      where: { slug: a.slug },
      update: { name: a.name, description: a.description, icon: a.icon, xpReward: a.xpReward, condition: a.condition },
      create: a,
    });
    console.log(`  ✅ ${a.icon} ${a.name}`);
  }

  // 4. Milestones
  console.log('\n🏁 Seeding Milestones...');
  for (const m of MILESTONES) {
    const existing = await prisma.milestone.findFirst({ where: { targetDay: m.targetDay, milestoneType: m.milestoneType } });
    if (!existing) {
      await prisma.milestone.create({ data: m });
      console.log(`  ✅ Day ${m.targetDay}: ${m.title}`);
    } else {
      console.log(`  ⏭️ Day ${m.targetDay}: already exists`);
    }
  }

  // 5. Resources
  console.log('\n📋 Seeding Resources...');
  let resCount = 0;
  for (const r of RESOURCES) {
    const existing = await prisma.resource.findFirst({ where: { name: r.name, targetRole: r.targetRole, type: r.type } });
    if (!existing) {
      await prisma.resource.create({ data: r });
      resCount++;
    }
  }
  console.log(`  ✅ ${resCount} resources created (${RESOURCES.length - resCount} skipped)`);

  // Summary
  const skillCount = await prisma.skill.count();
  const catCount = await prisma.skillCategory.count();
  const contactCount = await prisma.contact.count();
  const achieveCount = await prisma.achievement.count();
  const mileCount = await prisma.milestone.count();
  const resTotal = await prisma.resource.count();

  console.log('\n═══════════════════════════════════════');
  console.log('🏗️ SEED COMPLETE — BoosterTea v2.0');
  console.log('═══════════════════════════════════════');
  console.log(`  📚 ${catCount} categories, ${skillCount} skills`);
  console.log(`  👥 ${contactCount} contacts`);
  console.log(`  🏆 ${achieveCount} achievements`);
  console.log(`  🏁 ${mileCount} milestones`);
  console.log(`  📋 ${resTotal} resources`);
  console.log('═══════════════════════════════════════\n');
}

seed()
  .then(() => process.exit(0))
  .catch((e) => { console.error('❌ Seed error:', e); process.exit(1); })
  .finally(() => prisma.$disconnect());
