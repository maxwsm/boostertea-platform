// lib/quiz_db.js — Хардкод База Запитань для Оцінки Скілів в Офлайн-режимі

const QUIZ_DB = [
  // ─── AI & Prompt Engineering (category: ai-prompt) ───
  {
    skillSlug: 'practical-ai', // assume this is the slug or we match by category
    question: "Що таке 'Few-Shot Prompting'?",
    options: [
      "Запит до ШІ, де ти робиш кілька спроб підряд (shots)",
      "Надання моделі 2-3 прикладів бажаного результату всередині промпту",
      "Метод оптимізації ваг моделі під час інференсу",
      "Обмеження пам'яті ШІ до кількох токенів"
    ],
    correct: 1,
    points: 25
  },
  {
    skillSlug: 'practical-ai',
    question: "Чому ШІ (LLM) іноді \"галюцинує\" (вигадує факти)?",
    options: [
      "Тому що це статистична модель, яка передбачає наступне слово, а не база даних",
      "Тому що підключення до Інтернету обривається",
      "Тому що API ключ не має доступу до преміум-серверів",
      "Це баг OpenAI, який вони обіцяють виправити"
    ],
    correct: 0,
    points: 25
  },
  {
    skillSlug: 'practical-ai',
    question: "Що з цього є найкращим фрагментом промпту для аналізу ЦА?",
    options: [
      "Привіт, розкажи хто купує чай",
      "Напиши 5 інсайтів про цільову аудиторію для матчі",
      "Ти - маркетолог рівня Senior. Проаналізуй ЦА для преміум-матчі (20-35 років, health-conscious). Відповідь надай у вигляді таблиці: Біль | Бажання | Рішення.",
      "Допоможи мені продати більше чаю"
    ],
    correct: 2,
    points: 50
  },

  // ─── Full-Stack Web Dev (category: web-dev) ───
  {
    skillSlug: 'next-react',
    question: "Яка основна перевага Next.js Server Components (App Router) порівняно з клієнтським React?",
    options: [
      "Вони рендеряться на сервері, віддають клієнту готовий HTML/RSC Payload з нульовим JS, що пришвидшує SEO та завантаження",
      "Вони дозволяють використовувати useEffect прямо на сервері",
      "Вони повністю безкоштовні для хостингу на Vercel",
      "Вони замінюють CSS на Tailwind автоматично"
    ],
    correct: 0,
    points: 30
  },
  {
    skillSlug: 'next-react',
    question: "Що робить хук useEffect в React?",
    options: [
      "Рендерить HTML компонента",
      "Виконує побічні ефекти (side effects), такі як запити на сервер або маніпуляції з DOM після рендеру",
      "Зберігає стан змінної між рендерами",
      "Зупиняє цикл React до отримання даних"
    ],
    correct: 1,
    points: 30
  },
  {
    skillSlug: 'next-react',
    question: "У чому відмінність між REST API та tRPC (або GraphQL)?",
    options: [
      "REST повертає завжди JSON, а GraphQL повертає XML",
      "REST має ендпоінти, а tRPC/GraphQL дозволяють клієнту вимагати конкретну структуру даних або мати повну типізацію від беку до фронту",
      "REST працює швидше через браузер",
      "tRPC можна використовувати тільки з Python"
    ],
    correct: 1,
    points: 40
  },

  // ─── Digital Marketing (category: marketing) ───
  {
    skillSlug: 'performance-marketing',
    question: "На що найбільше орієнтується Performance Marketing?",
    options: [
      "На підвищення впізнаваності бренду (Brand Awareness)",
      "На креативний дизайн банерів",
      "На вимірювані дії: ліди, продажі (CPA, ROAS, ROI)",
      "На кількість лайків під Reels"
    ],
    correct: 2,
    points: 30
  },
  {
    skillSlug: 'performance-marketing',
    question: "Що таке ROAS (Return On Ad Spend)?",
    options: [
      "Відсоток людей, які клікнули на рекламу (CTR)",
      "Сума доходу, отримана з кожного долара, витраченого на рекламу",
      "Кількість переглядів до кінця відео",
      "Вартість залучення одного підписника"
    ],
    correct: 1,
    points: 30
  },
  {
    skillSlug: 'performance-marketing',
    question: "Який інструмент найкраще підходить для трекінгу подій e-commerce у 2026 році (без cookie)?",
    options: [
      "Встановлення фрагменту коду Meta Pixel в <head>",
      "Google Analytics 3 (Universal Analytics)",
      "Google Tag Manager + Meta Conversions API (Server-Side Tracking)",
      "Використання UTM-міток"
    ],
    correct: 2,
    points: 40
  },

  // ─── Mixology & Product R&D ───
  {
    skillSlug: 'mixology-rd',
    question: "Що дає лецитин (або полісорбат) при створенні напоїв (Bubble Tea/Сиропи)?",
    options: [
      "Робить напій солодшим",
      "Служить емульгатором, що не дає розшаровуватись жирам або ефірним оліям (наприклад у матчі або ароматизаторах)",
      "Збільшує термін придатності без охолодження",
      "Фарбує напій у яскравий колір"
    ],
    correct: 1,
    points: 30
  },
  {
    skillSlug: 'mixology-rd',
    question: "Який оптимальний pH для стабільного зберігання лимонадних сиропів?",
    options: [
      "7.0 (Нейтральний)",
      "8.5 - 9.0 (Луговий)",
      "3.0 - 4.0 (Кислий, для запобігання росту бактерій)",
      "Близько 1.5 (Дуже кислий)"
    ],
    correct: 2,
    points: 30
  },
  {
    skillSlug: 'mixology-rd',
    question: "Що найкраще застосувати для синергії смаку (flavor synergy) і зменшення кількості цукру?",
    options: [
      "Додати більше лимонної кислоти",
      "Використати екстракт стевії у комбінації з еритритолом та дрібкою солі",
      "Замінити цукор на карамель",
      "Додати молоко"
    ],
    correct: 1,
    points: 40
  }
];

function getQuestionsForSkill(skillSlug) {
  // Return questions exactly for this slug, OR return a general test if not found.
  let q = QUIZ_DB.filter(x => x.skillSlug === skillSlug);
  if (q.length === 0) {
    // General fallback logic
    return [
      {
        skillSlug,
        question: "Оцініть свій практичний досвід у цій сфері?",
        options: ["Абсолютний нуль", "Читав статті / бачив відео", "Маю базову практику (Junior)", "Роблю результати стабільно (Pro)"],
        points: 0, // Fallback evaluation goes by direct map
        isFallback: true
      }
    ];
  }
  return q;
}

module.exports = { QUIZ_DB, getQuestionsForSkill };
