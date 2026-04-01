// Blog posts data - static import of all MDX files
// This file is used to load blog posts data

// Re-export types and constants
export { CATEGORY_MAP } from './types';
export type { BlogPost, BlogPostMeta, TocItem, RecipeIngredient, RecipeCardProps, TeaTimelineStage, TeaTimelineProps, FAQItem, InternalLink, ProductLink, CategoryInfo, GTMEvent } from './types';

import type { BlogPost, BlogPostMeta, TocItem } from './types';

// Static list of all blog posts with their metadata
// This is generated from the MDX files in /content/blog/articles/

export const blogPostsMeta: BlogPostMeta[] = [
  {
    id: 1,
    slug: 'holodniy-da-hong-pao-5-receptiv-na-lito',
    title: '5 способів приготувати холодний DA HONG PAO влітку',
    seoTitle: 'Холодний DA HONG PAO: 5 рецептів крижаного чаю на літо',
    seoDescription: 'Як приготувати холодний чай DA HONG PAO вдома за 5 хвилин. Рецепти з лимоном, м\'ятою та фруктами. Чайний концентрат BoosterTea замість пакетованого чаю.',
    category: 'recipe',
    tags: ['da-hong-pao', 'рецепт', 'холодний-чай', 'літо', 'айс-ті'],
    date: '2025-04-13',
    readingTime: 7,
    coverImage: 'wow/blog_banner_ancient_master_1774562042808.png',
    coverAlt: 'Холодний чай DA HONG PAO з лимоном та льодом у прозорій склянці на літньому столі',
    ogImage: 'og-cold-dahongpao-recipes.jpg',
    author: 'BoosterTea',
    featured: true,
    schema: ['Article', 'Recipe'],
    internalLinks: [
      { slug: 'chaynyy-koncentrat-vs-paketovanyy-chay', anchor: 'чайний концентрат' },
      { slug: 'naylepshi-dozuvannya-koncentratu', anchor: 'правильне дозування' }
    ],
    productLinks: [
      { product: 'da-hong-pao', anchor: 'DA HONG PAO від BoosterTea' }
    ],
    faq: [
      { q: 'Скільки концентрату DA HONG PAO додавати на склянку?', a: 'Рекомендовано 25-30 мл концентрату на 250 мл води. Для насиченішого смаку — до 40 мл.' },
      { q: 'Чи можна заморожувати чайний концентрат?', a: 'Так, можна зробити чайні кубики льоду з концентрату. Вони тануть і поступово насичують напій смаком.' },
      { q: 'Скільки зберігається холодний чай з концентрату?', a: 'Готовий напій зберігайте в холодильнику до 24 годин. Концентрат у закритій пляшці — до 6 місяців.' }
    ]
  },
  {
    id: 2,
    slug: 'chaynyy-smuzi-puerh-banan-korytsya',
    title: 'Чайний смузі: PU-ERH з бананом та корицею',
    seoTitle: 'Чайний смузі з PU-ERH: рецепт з бананом та корицею',
    seoDescription: 'Рецепт смузі з чайним концентратом PU-ERH. Банан, кориця та енергія пуеру в одному напої. Ідеально для сніданку.',
    category: 'recipe',
    tags: ['pu-erh', 'смузі', 'рецепт', 'сніданок', 'енергія'],
    date: '2025-04-27',
    readingTime: 6,
    coverImage: 'wow/blog_banner_golden_pour_1774562007377.png',
    coverAlt: 'Чайний смузі PU-ERH з бананом та корицею у склянці',
    ogImage: 'og-puerh-smoothie.jpg',
    author: 'BoosterTea',
    featured: false,
    schema: ['Article', 'Recipe'],
    internalLinks: [
      { slug: 'vytrymka-puerh-chomu-chay-staye-krashchym', anchor: 'витримка PU-ERH' },
      { slug: 'chay-zamist-kavy-yak-pereyty', anchor: 'заміна кави' }
    ],
    productLinks: [
      { product: 'pu-erh', anchor: 'PU-ERH BoosterTea' }
    ],
    faq: [
      { q: 'Чи підходить PU-ERH для смузі?', a: 'Так, землисті ноти пуеру чудово поєднуються з бананом та горіхами.' },
      { q: 'Коли найкраще пити такий смузі?', a: 'Вранці для енергії або перед тренуванням.' }
    ]
  },
  {
    id: 3,
    slug: 'gaba-latte-retsept-idealnogo-vechirnyogo-napoyu',
    title: 'GABA-латте: рецепт ідеального вечірнього напою',
    seoTitle: 'GABA-латте рецепт — заспокійливий вечірній напій',
    seoDescription: 'Як приготувати GABA-латте вдома. Рецепт заспокійливого чайного напою для гарного сну без кофеїну.',
    category: 'recipe',
    tags: ['gaba', 'латте', 'рецепт', 'сон', 'релаксація'],
    date: '2025-05-11',
    readingTime: 6,
    coverImage: 'wow/blog_banner_liquid_gold_1774562086956.png',
    coverAlt: 'GABA латте у керамічній чашці з молочною пінкою',
    ogImage: 'og-gaba-latte.jpg',
    author: 'BoosterTea',
    featured: true,
    schema: ['Article', 'Recipe'],
    internalLinks: [
      { slug: 'gaba-chay-nauka-za-spokoyem', anchor: 'наука GABA' },
      { slug: 'naylepshi-dozuvannya-koncentratu', anchor: 'дозування' }
    ],
    productLinks: [
      { product: 'gaba', anchor: 'GABA чай BoosterTea' }
    ],
    faq: [
      { q: 'Чи допомагає GABA-латте заснути?', a: 'GABA чай містить гамма-аміномасляну кислоту, яка сприяє розслабленню.' },
      { q: 'Чи можна пити GABA-латте вдень?', a: 'Так, він не викликає сонливості, а лише розслаблення.' }
    ]
  },
  {
    id: 4,
    slug: 'chaynyy-kokteyl-da-hong-pao-imbyr-med',
    title: 'Чайний коктейль: DA HONG PAO з імбиром та медом',
    seoTitle: 'Чайний коктейль DA HONG PAO з імбиром та медом',
    seoDescription: 'Рецепт зігріваючого чайного коктейлю з концентратом DA HONG PAO, імбиром та медом. Ідеально для холодних вечорів.',
    category: 'recipe',
    tags: ['da-hong-pao', 'коктейль', 'імбир', 'мед', 'зігріваючий'],
    date: '2025-05-25',
    readingTime: 5,
    coverImage: 'wow/blog_banner_macro_leaf_1774562074047.png',
    coverAlt: 'Гарячий чайний коктейль DA HONG PAO з імбиром у склянці',
    ogImage: 'og-dahongpao-cocktail.jpg',
    author: 'BoosterTea',
    featured: false,
    schema: ['Article', 'Recipe'],
    internalLinks: [
      { slug: 'holodniy-da-hong-pao-5-receptiv-na-lito', anchor: 'DA HONG PAO рецепти' },
      { slug: 'chayna-kultura-futszyan-batkivshchyna-da-hong-pao', anchor: 'провінція Фуцзянь' }
    ],
    productLinks: [
      { product: 'da-hong-pao', anchor: 'DA HONG PAO' }
    ]
  },
  {
    id: 5,
    slug: 'ays-ti-z-kontsentratu-za-30-sekund',
    title: 'Айс-ті з концентрату за 30 секунд',
    seoTitle: 'Айс-ті за 30 секунд — найшвидший рецепт холодного чаю',
    seoDescription: 'Як приготувати айс-ті за 30 секунд з чайного концентрату. Найшвидший спосіб освіжитися влітку без заварювання.',
    category: 'recipe',
    tags: ['айс-ті', 'холодний-чай', 'рецепт', 'швидко', 'літо'],
    date: '2025-06-08',
    readingTime: 4,
    coverImage: 'wow/blog_banner_neon_tea_1774562025662.png',
    coverAlt: 'Айс-ті з чайного концентрату з льодом у високій склянці',
    ogImage: 'og-ice-tea-30sec.jpg',
    author: 'BoosterTea',
    featured: true,
    schema: ['Article', 'Recipe'],
    internalLinks: [
      { slug: 'holodniy-da-hong-pao-5-receptiv-na-lito', anchor: 'DA HONG PAO рецепти' },
      { slug: 'chaynyy-koncentrat-vs-paketovanyy-chay', anchor: 'концентрат переваги' }
    ],
    productLinks: [
      { product: 'da-hong-pao', anchor: 'DA HONG PAO' },
      { product: 'pu-erh', anchor: 'PU-ERH' }
    ]
  },
  {
    id: 6,
    slug: 'puerh-tonik-retsept-dlya-detoksu-ta-energiyi',
    title: 'PU-ERH тонік: рецепт для детоксу та енергії',
    seoTitle: 'PU-ERH тонік — рецепт для детоксу та енергії',
    seoDescription: 'Рецепт оздоровчого тоніку з чайним концентратом PU-ERH. Детокс, енергія та користь для травлення.',
    category: 'recipe',
    tags: ['pu-erh', 'тонік', 'детокс', 'енергія', 'рецепт'],
    date: '2025-06-22',
    readingTime: 5,
    coverImage: 'wow/blog_banner_zen_minimalist_1774562101749.png',
    coverAlt: 'PU-ERH тонік для детоксу з лимоном та м\'ятою',
    ogImage: 'og-puerh-tonic.jpg',
    author: 'BoosterTea',
    featured: false,
    schema: ['Article', 'Recipe'],
    internalLinks: [
      { slug: 'chaynyy-smuzi-puerh-banan-korytsya', anchor: 'PU-ERH рецепти' },
      { slug: 'vytrymka-puerh-chomu-chay-staye-krashchym', anchor: 'витримка' }
    ],
    productLinks: [
      { product: 'pu-erh', anchor: 'PU-ERH' }
    ]
  },
  {
    id: 7,
    slug: '3-garyachi-retsepti-gaba-dlya-zymy',
    title: '3 гарячих рецепти GABA для зими',
    seoTitle: '3 гарячих рецепти GABA чаю для зимових вечорів',
    seoDescription: 'Теплі рецепти з GABA чаєм для зимових вечорів. Заспокійливі напої для релаксації та комфорту.',
    category: 'recipe',
    tags: ['gaba', 'зима', 'гарячий-чай', 'рецепт', 'релаксація'],
    date: '2025-07-06',
    readingTime: 6,
    coverImage: 'wow/blog_banner_ancient_master_1774562042808.png',
    coverAlt: 'Гарячий GABA чай з корицею у затишній атмосфері',
    ogImage: 'og-gaba-winter.jpg',
    author: 'BoosterTea',
    featured: false,
    schema: ['Article', 'Recipe'],
    internalLinks: [
      { slug: 'gaba-latte-retsept-idealnogo-vechirnyogo-napoyu', anchor: 'GABA латте' },
      { slug: 'gaba-chay-nauka-za-spokoyem', anchor: 'наука GABA' }
    ],
    productLinks: [
      { product: 'gaba', anchor: 'GABA чай' }
    ]
  },
  {
    id: 8,
    slug: 'gunfu-cha-mystetstvo-kytayskoyi-chaynoyi-tseremoniyi',
    title: 'Гунфу Ча: мистецтво китайської чайної церемонії',
    seoTitle: 'Гунфу Ча — мистецтво китайської чайної церемонії: повний гайд',
    seoDescription: 'Що таке Гунфу Ча, як проводити китайську чайну церемонію вдома. Необхідний посуд, етапи заварювання, філософія чаю.',
    category: 'culture',
    tags: ['гунфу-ча', 'чайна-церемонія', 'китайська-культура', 'улун', 'традиція'],
    date: '2025-07-20',
    readingTime: 9,
    coverImage: 'wow/blog_banner_golden_pour_1774562007377.png',
    coverAlt: 'Китайська чайна церемонія Гунфу Ча — глиняний чайник ісін, чахай та піали на чабані',
    ogImage: 'og-gongfu-cha-ceremony.jpg',
    author: 'BoosterTea',
    featured: true,
    schema: ['Article', 'HowTo'],
    internalLinks: [
      { slug: '7-pravyl-povedinky-na-kytayskiy-chayniy-tseremoniyi', anchor: 'правила чайної церемонії' },
      { slug: 'chayna-kultura-futszyan-batkivshchyna-da-hong-pao', anchor: 'провінція Фуцзянь' }
    ],
    productLinks: [
      { product: 'da-hong-pao', anchor: 'DA HONG PAO — класичний чай для Гунфу Ча' }
    ],
    faq: [
      { q: 'Чи можна проводити Гунфу Ча вдома без спеціального посуду?', a: 'Так, можна адаптувати з маленьким керамічним чайничком та будь-якими маленькими чашками.' },
      { q: 'Скільки часу займає повна церемонія Гунфу Ча?', a: 'Від 30 хвилин до 2 годин, залежно від кількості проливів та темпу бесіди.' },
      { q: 'Який чай найкращий для Гунфу Ча?', a: 'Класичний вибір — улунські чаї (DA HONG PAO, Тє Гуань Інь) та PU-ERH.' }
    ]
  },
  {
    id: 9,
    slug: '7-pravyl-povedinky-na-kytayskiy-chayniy-tseremoniyi',
    title: '7 правил поведінки на китайській чайній церемонії',
    seoTitle: '7 правил поведінки на китайській чайній церемонії',
    seoDescription: 'Етикет чайної церемонії: як поводитися, як приймати чашку, як дякувати. Повний гайд з правил поведінки.',
    category: 'culture',
    tags: ['етикет', 'чайна-церемонія', 'правила', 'китай', 'гунфу-ча'],
    date: '2025-08-03',
    readingTime: 7,
    coverImage: 'wow/blog_banner_liquid_gold_1774562086956.png',
    coverAlt: 'Традиційні чайні піали на чабані під час церемонії',
    ogImage: 'og-tea-etiquette.jpg',
    author: 'BoosterTea',
    featured: false,
    schema: ['Article', 'HowTo'],
    internalLinks: [
      { slug: 'gunfu-cha-mystetstvo-kytayskoyi-chaynoyi-tseremoniyi', anchor: 'Гунфу Ча' },
      { slug: 'chayna-kultura-futszyan-batkivshchyna-da-hong-pao', anchor: 'культура' }
    ],
    productLinks: [
      { product: 'da-hong-pao', anchor: 'DA HONG PAO' }
    ]
  },
  {
    id: 10,
    slug: 'chayna-kultura-futszyan-batkivshchyna-da-hong-pao',
    title: 'Чайна культура Фуцзянь — батьківщина DA HONG PAO',
    seoTitle: 'Чайна культура Фуцзянь — батьківщина легендарного DA HONG PAO',
    seoDescription: 'Історія провінції Фуцзянь — колиски улунських чаїв. Гора Уішань, скелясті схили та секрети вирощування DA HONG PAO.',
    category: 'culture',
    tags: ['фуцзянь', 'da-hong-pao', 'культура', 'уішань', 'улун'],
    date: '2025-08-17',
    readingTime: 8,
    coverImage: 'wow/blog_banner_macro_leaf_1774562074047.png',
    coverAlt: 'Гори Уішань у провінції Фуцзянь — батьківщина DA HONG PAO',
    ogImage: 'og-fujian-culture.jpg',
    author: 'BoosterTea',
    featured: true,
    schema: ['Article'],
    internalLinks: [
      { slug: 'gunfu-cha-mystetstvo-kytayskoyi-chaynoyi-tseremoniyi', anchor: 'Гунфу Ча' },
      { slug: 'terruar-chayu-yak-grunt-i-vysota-vyznachayut-smak', anchor: 'терруар' }
    ],
    productLinks: [
      { product: 'da-hong-pao', anchor: 'DA HONG PAO' }
    ]
  },
  {
    id: 11,
    slug: 'yunnan-kray-puerh-yak-provintsiya-vyznachaye-smak',
    title: 'Юньнань — край PU-ERH: як провінція визначає смак',
    seoTitle: 'Юньнань — край PU-ERH: як провінція визначає смак чаю',
    seoDescription: 'Експедиція в Юньнань — батьківщину PU-ERH. Як клімат, ґрунти та висота вирощування впливають на смак чаю.',
    category: 'culture',
    tags: ['юньнань', 'pu-erh', 'провінція', 'терруар', 'клімат'],
    date: '2025-09-01',
    readingTime: 8,
    coverImage: 'wow/blog_banner_neon_tea_1774562025662.png',
    coverAlt: 'Чайні плантації Юньнань — батьківщина PU-ERH',
    ogImage: 'og-yunnan-puerh.jpg',
    author: 'BoosterTea',
    featured: false,
    schema: ['Article'],
    internalLinks: [
      { slug: 'vytrymka-puerh-chomu-chay-staye-krashchym', anchor: 'витримка PU-ERH' },
      { slug: 'terruar-chayu-yak-grunt-i-vysota-vyznachayut-smak', anchor: 'терруар' }
    ],
    productLinks: [
      { product: 'pu-erh', anchor: 'PU-ERH' }
    ]
  },
  {
    id: 12,
    slug: 'chaynyy-shlyah-velykyy-shovkovyy-chaynyy-marshrut',
    title: 'Чайний шлях — Великий шовковий чайний маршрут',
    seoTitle: 'Чайний шлях — Великий шовковий чайний маршрут історія',
    seoDescription: 'Історія Чайного шляху — від Китаю до Європи. Як чай змінив світову торгівлю та культуру.',
    category: 'culture',
    tags: ['чайний-шлях', 'шовковий-шлях', 'історія', 'торгівля', 'культура'],
    date: '2025-09-14',
    readingTime: 7,
    coverImage: 'wow/blog_banner_zen_minimalist_1774562101749.png',
    coverAlt: 'Історичний чайний шлях через гори та долини',
    ogImage: 'og-tea-road.jpg',
    author: 'BoosterTea',
    featured: false,
    schema: ['Article'],
    internalLinks: [
      { slug: 'chayna-kultura-futszyan-batkivshchyna-da-hong-pao', anchor: 'Фуцзянь' },
      { slug: 'yunnan-kray-puerh-yak-provintsiya-vyznachaye-smak', anchor: 'Юньнань' }
    ]
  },
  {
    id: 13,
    slug: 'shcho-vidbuvayetsya-z-chaynym-lystkom-pid-chas-fermentatsiyi',
    title: 'Що відбувається з чайним листком під час ферментації',
    seoTitle: 'Ферментація чаю — що відбувається з листком: науковий гайд',
    seoDescription: 'Наука ферментації чаю простою мовою. Як ферменти перетворюють зелений лист на чорний чай, улун та PU-ERH.',
    category: 'science',
    tags: ['ферментація', 'наука', 'оксидація', 'хімія-чаю', 'поліфеноли'],
    date: '2025-09-28',
    readingTime: 9,
    coverImage: 'wow/blog_banner_ancient_master_1774562042808.png',
    coverAlt: 'Етапи ферментації чайного листка — від зеленого до повністю ферментованого',
    ogImage: 'og-tea-fermentation-science.jpg',
    author: 'BoosterTea',
    featured: true,
    schema: ['Article'],
    internalLinks: [
      { slug: 'oksydatsiya-vs-fermentatsiya-v-chomu-riznytsia', anchor: 'оксидація vs ферментація' },
      { slug: 'vytrymka-puerh-chomu-chay-staye-krashchym', anchor: 'витримка PU-ERH' }
    ],
    productLinks: [
      { product: 'da-hong-pao', anchor: 'DA HONG PAO — частково ферментований' },
      { product: 'pu-erh', anchor: 'PU-ERH — мікробна ферментація' }
    ],
    faq: [
      { q: 'Чи всі чаї ферментовані?', a: 'Ні. Зелений та білий чай — неферментовані. Улун (DA HONG PAO) — частково оксидований. Чорний чай — повністю оксидований. PU-ERH — єдиний справді ферментований мікробами.' },
      { q: 'Чим ферментація чаю відрізняється від ферментації вина?', a: 'У вині дріжджі перетворюють цукор на спирт. У PU-ERH бактерії та гриби трансформують поліфеноли без утворення алкоголю.' }
    ]
  },
  {
    id: 14,
    slug: 'gaba-chay-nauka-za-spokoyem',
    title: 'GABA чай: наука за спокоєм',
    seoTitle: 'GABA чай — наука за спокоєм та релаксацією',
    seoDescription: 'Наукове пояснення заспокійливої дії GABA чаю. Як гамма-аміномасляна кислота впливає на нервову систему.',
    category: 'science',
    tags: ['gaba', 'наука', 'релаксація', 'здоров\'я', 'нервова-система'],
    date: '2025-10-12',
    readingTime: 8,
    coverImage: 'wow/blog_banner_golden_pour_1774562007377.png',
    coverAlt: 'GABA чай та процеси в мозку — наукова ілюстрація',
    ogImage: 'og-gaba-science.jpg',
    author: 'BoosterTea',
    featured: false,
    schema: ['Article'],
    internalLinks: [
      { slug: 'gaba-latte-retsept-idealnogo-vechirnyogo-napoyu', anchor: 'GABA рецепт' },
      { slug: 'shcho-vidbuvayetsya-z-chaynym-lystkom-pid-chas-fermentatsiyi', anchor: 'ферментація' }
    ],
    productLinks: [
      { product: 'gaba', anchor: 'GABA чай' }
    ]
  },
  {
    id: 15,
    slug: 'vytrymka-puerh-chomu-chay-staye-krashchym',
    title: 'Витримка PU-ERH: чому чай стає кращим з роками',
    seoTitle: 'Витримка PU-ERH: чому чай стає кращим з роками',
    seoDescription: 'Наука витримки PU-ERH. Чому з роками змінюється смак, які процеси відбуваються, як правильно зберігати чай для витримки.',
    category: 'science',
    tags: ['pu-erh', 'витримка', 'старіння', 'наука', 'зберігання'],
    date: '2025-10-26',
    readingTime: 7,
    coverImage: 'wow/blog_banner_liquid_gold_1774562086956.png',
    coverAlt: 'Витриманий PU-ERH — чайні бліни різних років витримки',
    ogImage: 'og-puerh-aging.jpg',
    author: 'BoosterTea',
    featured: true,
    schema: ['Article'],
    internalLinks: [
      { slug: 'yunnan-kray-puerh-yak-provintsiya-vyznachaye-smak', anchor: 'Юньнань' },
      { slug: 'shcho-vidbuvayetsya-z-chaynym-lystkom-pid-chas-fermentatsiyi', anchor: 'ферментація' }
    ],
    productLinks: [
      { product: 'pu-erh', anchor: 'PU-ERH' }
    ]
  },
  {
    id: 16,
    slug: 'oksydatsiya-vs-fermentatsiya-v-chomu-riznytsia',
    title: 'Оксидація vs ферментація: в чому різниця?',
    seoTitle: 'Оксидація vs ферментація чаю: в чому різниця?',
    seoDescription: 'Пояснюємо різницю між оксидацією та ферментацією чаю простими словами. Які процеси відбуваються з чайним листком.',
    category: 'science',
    tags: ['оксидація', 'ферментація', 'наука', 'різниця', 'хімія'],
    date: '2025-11-09',
    readingTime: 6,
    coverImage: 'wow/blog_banner_macro_leaf_1774562074047.png',
    coverAlt: 'Порівняння оксидації та ферментації чайного листка',
    ogImage: 'og-oxidation-fermentation.jpg',
    author: 'BoosterTea',
    featured: false,
    schema: ['Article'],
    internalLinks: [
      { slug: 'shcho-vidbuvayetsya-z-chaynym-lystkom-pid-chas-fermentatsiyi', anchor: 'ферментація' },
      { slug: 'gaba-chay-nauka-za-spokoyem', anchor: 'GABA анаеробна' }
    ]
  },
  {
    id: 17,
    slug: 'yak-zmina-klimatu-vplyvaye-na-chayni-plantatsiyi-kytayu',
    title: 'Як зміна клімату впливає на чайні плантації Китаю',
    seoTitle: 'Зміна клімату та чайні плантації Китаю: вплив на виробництво',
    seoDescription: 'Як глобальна зміна клімату впливає на чайні плантації Китаю. Зміни в смаку, врожайності та майбутнє чайної індустрії.',
    category: 'production',
    tags: ['клімат', 'зміна-клімату', 'плантації', 'виробництво', 'китай'],
    date: '2025-11-23',
    readingTime: 8,
    coverImage: 'wow/blog_banner_neon_tea_1774562025662.png',
    coverAlt: 'Чайні плантації під впливом зміни клімату',
    ogImage: 'og-climate-tea.jpg',
    author: 'BoosterTea',
    featured: true,
    schema: ['Article'],
    internalLinks: [
      { slug: 'terruar-chayu-yak-grunt-i-vysota-vyznachayut-smak', anchor: 'терруар' },
      { slug: 'chayna-kultura-futszyan-batkivshchyna-da-hong-pao', anchor: 'Фуцзянь' }
    ]
  },
  {
    id: 18,
    slug: 'vid-lystka-do-kontsentratu-yak-vyroblyayut-chayni-ekstrakty',
    title: 'Від листка до концентрату: як виробляють чайні екстракти',
    seoTitle: 'Як виробляють чайні концентрати: від листка до екстракту',
    seoDescription: 'Процес виробництва чайних концентратів. Як з чайного листка отримують рідкий екстракт, технології та контроль якості.',
    category: 'production',
    tags: ['виробництво', 'концентрат', 'екстракція', 'технологія', 'якість'],
    date: '2025-12-07',
    readingTime: 7,
    coverImage: 'wow/blog_banner_zen_minimalist_1774562101749.png',
    coverAlt: 'Процес виробництва чайного концентрату — від листка до пляшки',
    ogImage: 'og-tea-extract-production.jpg',
    author: 'BoosterTea',
    featured: false,
    schema: ['Article'],
    internalLinks: [
      { slug: 'chaynyy-koncentrat-vs-paketovanyy-chay', anchor: 'концентрат vs пакетований' },
      { slug: 'yak-pravylno-zberigaty-chaynyy-kontsentrat', anchor: 'зберігання' }
    ]
  },
  {
    id: 19,
    slug: 'terruar-chayu-yak-grunt-i-vysota-vyznachayut-smak',
    title: 'Терруар чаю: як ґрунт і висота визначають смак',
    seoTitle: 'Терруар чаю: як ґрунт, висота та клімат визначають смак',
    seoDescription: 'Що таке терруар чаю та як він впливає на смак. Роль ґрунту, висоти, клімату та інших факторів вирощування.',
    category: 'production',
    tags: ['терруар', 'ґрунт', 'висота', 'смак', 'виробництво'],
    date: '2025-12-21',
    readingTime: 7,
    coverImage: 'wow/blog_banner_ancient_master_1774562042808.png',
    coverAlt: 'Чайні плантації на різній висоті — вплив терруару на смак',
    ogImage: 'og-tea-terroir.jpg',
    author: 'BoosterTea',
    featured: false,
    schema: ['Article'],
    internalLinks: [
      { slug: 'chayna-kultura-futszyan-batkivshchyna-da-hong-pao', anchor: 'Уішань' },
      { slug: 'yunnan-kray-puerh-yak-provintsiya-vyznachaye-smak', anchor: 'Юньнань' }
    ]
  },
  {
    id: 20,
    slug: 'yak-pravylno-zberigaty-chaynyy-kontsentrat',
    title: 'Як правильно зберігати чайний концентрат',
    seoTitle: 'Як правильно зберігати чайний концентрат: повний гайд',
    seoDescription: 'Правила зберігання чайного концентрату. Термін придатності, умови зберігання, як зберегти смак та корисні властивості.',
    category: 'tips',
    tags: ['зберігання', 'концентрат', 'лайфхак', 'термін-придатності', 'поради'],
    date: '2026-01-04',
    readingTime: 5,
    coverImage: 'wow/blog_banner_golden_pour_1774562007377.png',
    coverAlt: 'Правильне зберігання чайного концентрату в темному місці',
    ogImage: 'og-concentrate-storage.jpg',
    author: 'BoosterTea',
    featured: false,
    schema: ['Article'],
    internalLinks: [
      { slug: 'vid-lystka-do-kontsentratu-yak-vyroblyayut-chayni-ekstrakty', anchor: 'виробництво' },
      { slug: 'naylepshi-dozuvannya-koncentratu', anchor: 'дозування' }
    ]
  },
  {
    id: 21,
    slug: 'chaynyy-koncentrat-vs-paketovanyy-chay',
    title: 'Чайний концентрат vs пакетований чай: 5 причин перейти',
    seoTitle: 'Чайний концентрат vs пакетований чай — 5 переваг концентрату',
    seoDescription: 'Порівняння чайного концентрату BoosterTea та пакетованого чаю: смак, зручність, вартість порції, екологічність та корисність.',
    category: 'tips',
    tags: ['концентрат', 'пакетований-чай', 'порівняння', 'переваги', 'якість'],
    date: '2026-01-18',
    readingTime: 6,
    coverImage: 'wow/blog_banner_liquid_gold_1774562086956.png',
    coverAlt: 'Порівняння чайного концентрату BoosterTea та пакетованого чаю',
    ogImage: 'og-concentrate-vs-teabag.jpg',
    author: 'BoosterTea',
    featured: true,
    schema: ['Article', 'FAQPage'],
    internalLinks: [
      { slug: 'vid-lystka-do-kontsentratu-yak-vyroblyayut-chayni-ekstrakty', anchor: 'виробництво концентрату' },
      { slug: 'naylepshi-dozuvannya-koncentratu', anchor: 'дозування' }
    ],
    productLinks: [
      { product: 'da-hong-pao', anchor: 'DA HONG PAO' },
      { product: 'pu-erh', anchor: 'PU-ERH' }
    ],
    faq: [
      { q: 'Чим концентрат відрізняється від пакетованого чаю?', a: 'Концентрат BoosterTea — це рідкий екстракт преміального цільнолистового чаю. Пакетований чай — зазвичай подрібнений лист нижчих ґатунків у фільтр-пакеті.' },
      { q: 'Що дешевше — концентрат чи пакети?', a: 'Одна порція концентрату BoosterTea (30 мл) коштує приблизно стільки ж, скільки 2-3 преміальних чайних пакети, але дає значно кращий смак.' }
    ]
  },
  {
    id: 22,
    slug: 'naylepshi-dozuvannya-koncentratu',
    title: 'Найкращі дозування чайного концентрату',
    seoTitle: 'Дозування чайного концентрату: як розводити правильно',
    seoDescription: 'Як правильно дозувати чайний концентрат BoosterTea. Таблиця пропорцій для різних напоїв та смакових уподобань.',
    category: 'tips',
    tags: ['дозування', 'концентрат', 'пропорції', 'лайфхак', 'поради'],
    date: '2026-02-01',
    readingTime: 5,
    coverImage: 'wow/blog_banner_macro_leaf_1774562074047.png',
    coverAlt: 'Дозування чайного концентрату — пропорції та мірні стакани',
    ogImage: 'og-concentrate-dosage.jpg',
    author: 'BoosterTea',
    featured: false,
    schema: ['Article'],
    internalLinks: [
      { slug: 'holodniy-da-hong-pao-5-receptiv-na-lito', anchor: 'рецепти' },
      { slug: 'chaynyy-koncentrat-vs-paketovanyy-chay', anchor: 'концентрат' }
    ]
  },
  {
    id: 23,
    slug: 'chay-zamist-kavy-yak-pereyty',
    title: 'Чай замість кави: як перейти без стресу',
    seoTitle: 'Чай замість кави: як перейти без стресу та головного болю',
    seoDescription: 'Як замінити каву чаєм без симптомів відміни. Поради щодо переходу, які чаї обрати, енергія без кофеїнового краху.',
    category: 'tips',
    tags: ['чай-проти-кави', 'перехід', 'енергія', 'кава', 'здоров\'я'],
    date: '2026-02-15',
    readingTime: 7,
    coverImage: 'wow/blog_banner_neon_tea_1774562025662.png',
    coverAlt: 'Чашка чаю як альтернатива каві — переход без стресу',
    ogImage: 'og-tea-vs-coffee.jpg',
    author: 'BoosterTea',
    featured: true,
    schema: ['Article'],
    internalLinks: [
      { slug: 'gaba-chay-nauka-za-spokoyem', anchor: 'GABA сон' },
      { slug: 'chaynyy-smuzi-puerh-banan-korytsya', anchor: 'PU-ERH смузі' }
    ],
    productLinks: [
      { product: 'pu-erh', anchor: 'PU-ERH для енергії' },
      { product: 'gaba', anchor: 'GABA для релаксації' }
    ]
  }
];

// Helper functions
export const getAllPosts = (): BlogPostMeta[] => {
  return blogPostsMeta.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const getPostBySlug = (slug: string): BlogPostMeta | undefined => {
  return blogPostsMeta.find(post => post.slug === slug);
};

export const getPostsByCategory = (category: string): BlogPostMeta[] => {
  return blogPostsMeta
    .filter(post => post.category === category)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const getPostsByTag = (tag: string): BlogPostMeta[] => {
  return blogPostsMeta
    .filter(post => post.tags.includes(tag))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const getFeaturedPosts = (): BlogPostMeta[] => {
  return blogPostsMeta
    .filter(post => post.featured)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const getRelatedPosts = (currentSlug: string, limit = 3): BlogPostMeta[] => {
  const currentPost = getPostBySlug(currentSlug);
  if (!currentPost) return [];
  
  return blogPostsMeta
    .filter(post => post.slug !== currentSlug && (
      post.category === currentPost.category ||
      post.tags.some(tag => currentPost.tags.includes(tag))
    ))
    .slice(0, limit);
};

export const searchPosts = (query: string): BlogPostMeta[] => {
  const lowercaseQuery = query.toLowerCase();
  return blogPostsMeta.filter(post =>
    post.title.toLowerCase().includes(lowercaseQuery) ||
    post.seoDescription.toLowerCase().includes(lowercaseQuery) ||
    post.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
};

export const getCategoryCounts = (): Record<string, number> => {
  return blogPostsMeta.reduce((acc, post) => {
    acc[post.category] = (acc[post.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
};

export const getAllTags = (): string[] => {
  const tagSet = new Set<string>();
  blogPostsMeta.forEach(post => post.tags.forEach(tag => tagSet.add(tag)));
  return Array.from(tagSet).sort();
};

// Format date for display
export const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('uk-UA', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

// Extract table of contents from markdown content
export const extractTableOfContents = (content: string): TocItem[] => {
  const toc: TocItem[] = [];
  const lines = content.split('\n');
  let counter = 0;
  
  lines.forEach(line => {
    const h2Match = line.match(/^## (.+)$/);
    const h3Match = line.match(/^### (.+)$/);
    
    if (h2Match) {
      toc.push({
        id: `heading-${counter++}`,
        text: h2Match[1].replace(/\*\*/g, ''),
        level: 2
      });
    } else if (h3Match) {
      toc.push({
        id: `heading-${counter++}`,
        text: h3Match[1].replace(/\*\*/g, ''),
        level: 3
      });
    }
  });
  
  return toc;
};
