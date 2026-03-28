"use client";
export type Language = 'en' | 'ua';

export const translations = {
  en: {
    // Navigation
    nav: {
      home: 'Home',
      heroes: 'Heroes',
      comics: 'Comics',
      joinTeam: 'Join Team',
      shop: 'Shop',
      merch: 'Merch',
      quiz: 'Quiz',
    },
    // Hero Section
    hero: {
      badge: 'BoosterTea Comic Universe',
      title1: 'MYTHBUSTERS',
      title2: 'OF TEA',
      subtitle: '6 myths destroyed. 2 legendary heroes. Infinite energy.',
      subtitleHighlight: 'Mykyta and Nazar shatter tea stereotypes!',
      ctaRead: 'Explore Comics',
      ctaMeet: 'Meet the Legends',
      scrollText: 'Discover the mythbusters',
      stats: {
        series: 'Series',
        pages: 'Pages',
        heroes: 'Heroes',
        coming: 'Coming',
      },
    },
    // Ambassadors Section
    ambassadors: {
      badge: 'The Legends',
      title1: 'MEET THE',
      title2: 'MYTHBUSTERS',
      description: 'Mykyta and Nazar — the legendary MythBusters of Tea. They\'ve put everything on the line to reveal the truth about tea to the world.',
      cta: 'Meet the mythbusters',
      stats: {
        energy: 'Energy',
        focus: 'Focus',
        charisma: 'Charisma',
      },
    },
    // Comic Gallery
    comics: {
      badge: 'Comic Universe',
      title1: 'CHOOSE YOUR',
      title2: 'ADVENTURE',
      description: '6 tea myths — DESTROYED! Each series dismantles one popular myth with scientific precision and epic storytelling.',
      available: 'Available Now',
      comingSoon: 'Coming Soon',
      easterEgg: 'Easter Egg',
      pages: 'pages',
      readTime: 'min read',
      status: {
        available: 'Available',
        comingSoon: 'Coming Soon',
      },
      stats: {
        mythsBusted: 'Myths Destroyed',
        comicPages: 'Comic Pages',
        scientificFacts: 'Scientific Facts',
        mythsLeft: 'Myths Left',
      },
      storyProgress: 'Mythbusters Progress',
      season1: 'Season 1: Origins',
      season2: 'Season 2: The Shadow Awakens',
      completed: 'Completed',
    },
    // Comic Reader
    reader: {
      page: 'Page',
      of: 'of',
    },
    // Trainees Section
    trainees: {
      badge: 'Recruitment Open',
      title1: 'BECOME A',
      title2: 'LEGEND',
      description: 'Starting Series 7, we\'re recruiting the next generation of heroes. Train under Mykyta and Nazar, destroy your own myths, and become part of the eternal legend.',
      recruitment: {
        title: 'Series 7: Recruitment is Open!',
        description: 'Applications are now being accepted for the next generation of MythBusters',
        cta: 'Apply Now',
      },
      currentTrainees: 'Current Recruits',
      trainingPath: 'Path to Legend',
      steps: {
        recruit: { title: 'Recruit', desc: 'Apply and pass selection' },
        apprentice: { title: 'Apprentice', desc: 'Learn from the masters' },
        mythbuster: { title: 'MythBuster', desc: 'Destroy your first myth' },
        master: { title: 'Master', desc: 'Lead your own team' },
      },
      modal: {
        title: 'Coming Soon!',
        description: 'Applications for Series 7 will open soon. Follow us on social media to be the first to know!',
        button: 'Got it!',
      },
      progress: 'Training Progress',
      mentor: 'Mentor',
    },
    // Quiz Section
    quiz: {
      badge: 'Test Your Knowledge',
      title1: 'WHICH MYTH',
      title2: 'BUSTER ARE YOU?',
      description: 'Take our quiz to discover your MythBuster archetype and get personalized tea recommendations.',
      start: 'Start Quiz',
      question: 'Question',
      of: 'of',
      next: 'Next',
      results: 'Your Result',
      share: 'Share Result',
      retake: 'Retake Quiz',
    },
    // Merch Section
    merch: {
      badge: 'Official Collection',
      title1: 'WEAR THE',
      title2: 'LEGEND',
      description: 'Official BoosterTea MythBusters collection. From comic panels to premium streetwear.',
      categories: {
        all: 'All',
        stickers: 'Stickers',
        apparel: 'Apparel',
        accessories: 'Accessories',
      },
      cta: 'Shop Now',
      comingSoon: 'Coming to store',
      bestseller: 'Bestseller',
      new: 'New',
      limited: 'Limited',
      hot: 'Hot!',
    },
    // CTA Section
    cta: {
      badge: 'Join the Revolution',
      title1: 'READY TO EXPERIENCE',
      title2: 'PURE ENERGY?',
      description: '6 hours of stable energy without the crash. 40+ servings in every bottle. 100% natural. Made in Ukraine.',
      features: {
        servings: '40+ Servings',
        shipping: 'Free Shipping from $40',
        delivery: '1-3 Day Delivery',
      },
      price: {
        amount: '975 ₴',
        perServing: '= 40+ servings',
        subtext: 'Only 24 ₴ per serving — cheaper than coffee shop coffee!',
      },
      buttons: {
        order: 'Order Now',
        telegram: 'Message on Telegram',
      },
      qrText: 'Scan for instant ordering',
    },
    // Footer
    footer: {
      description: 'MythBusters of Tea — an epic comic series that destroys popular tea myths with scientific precision and cinematic storytelling.',
      quickLinks: 'Quick Links',
      legal: 'Legal',
      copyright: 'All rights reserved.',
      madeIn: 'Made with',
      inUkraine: 'in Ukraine',
    },
    // Funnel
    funnel: {
      progress: 'Progress',
      reset: 'Reset',
      close: 'Close',
      // Comic Reader
      comic: {
        easterEggsFound: 'Easter eggs found:',
        codeCollected: 'Code collected!',
        hint: '💡 Look for hidden Easter eggs on the comic pages!',
        destroyMyth: 'Destroy the myth!',
        page: 'Page',
        of: 'of',
      },
      // Myth Destroyer
      destroy: {
        title: 'Time to destroy the myth!',
        subtitle: 'Click {clicks} times to break the tea bag and see the truth',
        mythDestroyed: 'Myth destroyed! Truth revealed!',
        continue: 'Continue the journey',
      },
      // Quiz
      quiz: {
        question: 'Did you know this before?',
        subtitle: 'Share your opinion and find out what others think',
        optionYes: 'Yes, I knew it!',
        optionNo: 'No, it was a surprise',
        likeYou: 'like you',
        likeMost: 'like most people',
        expertTitle: 'You are an expert!',
        expertDesc: 'You belong to the elite minority that knows the truth about tea. Now you are ready to become a true MythBuster!',
        learnedTitle: 'Now you know more!',
        learnedDesc: '85% of people believed in this myth. Now you know the truth and can share it with others!',
        statsQuiz: 'took the quiz',
        statsSurprised: 'surprised',
        getReward: 'Get reward',
      },
      // Terminal
      terminal: {
        title: 'Secret Terminal',
        subtitle: 'Enter the code collected from Easter eggs to unlock an exclusive discount',
        level: 'Tea Expert Level',
        foundEggs: 'Easter eggs found:',
        placeholder: 'ENTER CODE...',
        validating: 'Validating...',
        unlock: 'Unlock',
        hint: '💡 Hint: Find all Easter eggs in the comic to get the code',
        successTitle: 'Discount unlocked!',
        yourDiscount: 'Your discount',
        onEverything: 'on everything',
        promoCode: 'Promo code',
        copy: 'Copy',
        copied: 'Promo code copied!',
        saveUpTo: 'Save up to 150₴',
        exclusive: 'Exclusive offer',
        orderWithDiscount: 'Order with discount',
        invalidCode: 'Invalid code',
        tryAgain: 'Try again or find all Easter eggs',
      },
    },
  },
  ua: {
    // Navigation
    nav: {
      home: 'Головна',
      heroes: 'Герої',
      comics: 'Комікси',
      joinTeam: 'Вступити',
      shop: 'Магазин',
      merch: 'Мерч',
      quiz: 'Тест',
    },
    // Hero Section
    hero: {
      badge: 'Всесвіт коміксів BoosterTea',
      title1: 'РУЙНІВНИКИ',
      title2: 'МІФІВ',
      subtitle: '6 міфів знищено. 2 легендарних героя. Нескінченна енергія.',
      subtitleHighlight: 'Mykyta та Nazar розбивають стереотипи про чай!',
      ctaRead: 'Дослідити комікси',
      ctaMeet: 'Познайомитися з легендами',
      scrollText: 'Відкрий історію',
      stats: {
        series: 'Серії',
        pages: 'Сторінки',
        heroes: 'Герої',
        coming: 'Незабаром',
      },
    },
    // Ambassadors Section
    ambassadors: {
      badge: 'Легенди',
      title1: 'ПОЗНАЙОМСЯ ЗІ',
      title2: 'РУЙНІВНИКАМИ',
      description: 'Mykyta та Nazar — легендарні Руйнівники міфів про чай. Вони поставили все на карту, щоб відкрити світові правду про чай.',
      cta: 'Прочитати їхню історію',
      stats: {
        energy: 'Енергія',
        focus: 'Фокус',
        charisma: 'Харизма',
      },
    },
    // Comic Gallery
    comics: {
      badge: 'Всесвіт коміксів',
      title1: 'ОБЕРИ СВОЮ',
      title2: 'ПРИГОДУ',
      description: '6 міфів про чай — ЗНИЩЕНО! Кожна серія розбирає один популярний міф із науковою точністю та епічним сюжетом.',
      available: 'Вже доступно',
      comingSoon: 'Скоро',
      easterEgg: 'Пасхалка',
      pages: 'сторінок',
      readTime: 'хв читання',
      status: {
        available: 'Доступно',
        comingSoon: 'Скоро',
      },
      stats: {
        mythsBusted: 'Міфів знищено',
        comicPages: 'Сторінок коміксів',
        scientificFacts: 'Наукових фактів',
        mythsLeft: 'Міфів залишилося',
      },
      storyProgress: 'Прогрес Руйнівників Міфів',
      season1: 'Сезон 1: Походження',
      season2: 'Сезон 2: Пробудження Тіні',
      completed: 'Завершено',
    },
    // Comic Reader
    reader: {
      page: 'Сторінка',
      of: 'з',
    },
    // Trainees Section
    trainees: {
      badge: 'Набір відкрито',
      title1: 'СТАНЬ',
      title2: 'ЛЕГЕНДОЮ',
      description: 'Починаючи з 7 серії, ми набираємо наступне покоління героїв. Тренуйся під керівництвом Mykyta та Nazar, знищуй власні міфи та стань частиною вічної легенди.',
      recruitment: {
        title: 'Серія 7: Набір відкрито!',
        description: 'Прийом заявок на наступне покоління Руйнівників міфів',
        cta: 'Подати заяву',
      },
      currentTrainees: 'Поточні рекрути',
      trainingPath: 'Шлях до легенди',
      steps: {
        recruit: { title: 'Рекрут', desc: 'Подай заяву та пройди відбір' },
        apprentice: { title: 'Учень', desc: 'Навчайся в майстрів' },
        mythbuster: { title: 'Руйнівник', desc: 'Знищуй свій перший міф' },
        master: { title: 'Майстер', desc: 'Керуй власною командою' },
      },
      modal: {
        title: 'Скоро!',
        description: 'Прийом заявок на 7 серію відкриється незабаром. Слідкуй за нами в соцмережах, щоб дізнатися першим!',
        button: 'Зрозуміло!',
      },
      progress: 'Прогрес тренування',
      mentor: 'Наставник',
    },
    // Quiz Section
    quiz: {
      badge: 'Перевір свої знання',
      title1: 'ЯКИЙ ТИ',
      title2: 'РУЙНІВНИК МІФІВ?',
      description: 'Пройди наш тест, щоб дізнатися свій архетип Руйнівника міфів і отримати персональні рекомендації щодо чаю.',
      start: 'Почати тест',
      question: 'Питання',
      of: 'з',
      next: 'Далі',
      results: 'Твій результат',
      share: 'Поділитися',
      retake: 'Пройти ще раз',
    },
    // Merch Section
    merch: {
      badge: 'Офіційна колекція',
      title1: 'НОСИ',
      title2: 'ЛЕГЕНДУ',
      description: 'Офіційна колекція BoosterTea Руйнівники міфів. Від комікс-панелей до преміального стрітверу.',
      categories: {
        all: 'Все',
        stickers: 'Стікери',
        apparel: 'Одяг',
        accessories: 'Аксесуари',
      },
      cta: 'Купити',
      comingSoon: 'Скоро в магазині',
      bestseller: 'Хіт',
      new: 'Новинка',
      limited: 'Лімітка',
      hot: 'Гаряче!',
    },
    // CTA Section
    cta: {
      badge: 'Приєднуйся до революції',
      title1: 'ГОТОВИЙ ВІДЧУТИ',
      title2: 'ЧИСТУ ЕНЕРГІЮ?',
      description: '6 годин стабільної енергії без падіння. 40+ порцій у кожній пляшці. 100% натуральний. Зроблено в Україні.',
      features: {
        servings: '40+ порцій',
        shipping: 'Безкоштовна доставка від 1500 ₴',
        delivery: 'Доставка 1–3 дні',
      },
      price: {
        amount: '975 ₴',
        perServing: '= 40+ порцій',
        subtext: 'Усього 24 ₴ за порцію — дешевше, ніж кава в кав\'ярні!',
      },
      buttons: {
        order: 'Замовити зараз',
        telegram: 'Написати в Telegram',
      },
      qrText: 'Скануй для миттєвого замовлення',
    },
    // Footer
    footer: {
      description: 'Руйнівники міфів про чай — епічна комікс-серія, яка знищує популярні міфи про чай із науковою точністю й кінематографічним оповіданням.',
      quickLinks: 'Швидкі посилання',
      legal: 'Юридична інформація',
      copyright: 'Усі права захищено.',
      madeIn: 'Зроблено з',
      inUkraine: 'в Україні',
    },
    // Funnel
    funnel: {
      progress: 'Прогрес',
      reset: 'Скинути',
      close: 'Закрити',
      // Comic Reader
      comic: {
        easterEggsFound: 'Знайдено пасхалок:',
        codeCollected: 'Код зібрано!',
        hint: '💡 Шукай приховані пасхалки на сторінках коміксу!',
        destroyMyth: 'Руйнувати міф!',
        page: 'Сторінка',
        of: 'із',
      },
      // Myth Destroyer
      destroy: {
        title: 'Час руйнувати міф!',
        subtitle: 'Клікни {clicks} рази, щоб розбити пакетик і побачити правду',
        mythDestroyed: 'Міф зруйновано! Правду відкрито!',
        continue: 'Продовжити подорож',
      },
      // Quiz
      quiz: {
        question: 'Чи знав ти про це раніше?',
        subtitle: 'Поділися своєю думкою та дізнайся, що думають інші',
        optionYes: 'Так, я знав це!',
        optionNo: 'Ні, це був сюрприз',
        likeYou: 'як ти',
        likeMost: 'як більшість',
        expertTitle: 'Ти — експерт!',
        expertDesc: 'Ти належиш до елітної меншини, яка знає правду про чай. Тепер ти готовий стати справжнім Руйнівником міфів!',
        learnedTitle: 'Тепер ти знаєш більше!',
        learnedDesc: '85% людей вірили в цей міф. Тепер ти знаєш правду й можеш поділитися нею з іншими!',
        statsQuiz: 'пройшли квіз',
        statsSurprised: 'здивовані',
        getReward: 'Отримати нагороду',
      },
      // Terminal
      terminal: {
        title: 'Секретний термінал',
        subtitle: 'Введи код, зібраний із пасхалок, щоб розблокувати ексклюзивну знижку',
        level: 'Рівень чайного експерта',
        foundEggs: 'Знайдено пасхалок:',
        placeholder: 'ВВЕДИ КОД...',
        validating: 'Перевірка...',
        unlock: 'Розблокувати',
        hint: '💡 Підказка: Знайди всі пасхалки в коміксі, щоб отримати код',
        successTitle: 'Знижка розблокована!',
        yourDiscount: 'Твоя знижка',
        onEverything: 'на все',
        promoCode: 'Промокод',
        copy: 'Копіювати',
        copied: 'Промокод скопійовано!',
        saveUpTo: 'Економія до 150₴',
        exclusive: 'Ексклюзивна пропозиція',
        orderWithDiscount: 'Замовити зі знижкою',
        invalidCode: 'Невірний код',
        tryAgain: 'Спробуй ще раз або знайди всі пасхалки',
      },
    },
  },
};

export type Translations = typeof translations;
