export interface Product {
  id: string;
  slug: string;
  name: string;
  nameUk: string;
  description: string;
  descriptionUk: string;
  effects: string[];
  effectsUk: string[];
  price1L: number;
  price025L: number;
  priceSticks?: number;
  image: string;
  category: string;
  brewingTime: string;
  temperature: string;
  origin: string;
  isBundle?: boolean;
  bundleIncludes?: string[];
  merchantId?: 'boostertea' | 'funnydrops' | 'dinoslush' | 'tlab';
  packifyId?: string;
}

export interface Accessory {
  id: string;
  slug: string;
  nameUk: string;
  nameEn?: string;
  nameEs?: string;
  descriptionUk: string;
  descriptionEn?: string;
  descriptionEs?: string;
  subcategory: 'thermos' | 'mug' | 'cup' | 'piala' | 'dry_tea' | 'apparel' | 'stickers';
  price: number;
  image?: string;
  inStock: boolean;
  merchantId?: 'boostertea' | 'funnydrops' | 'dinoslush' | 'tlab';
}

export const products: Product[] = [
  {
    id: 'puerh-classic-001',
    slug: 'pu-erh',
    name: 'Pu-erh',
    nameUk: 'Пуер',
    description: 'Aged deep-fermented Pu-erh tea concentrate. Provides a powerful energy boost and crystal clear mental focus without the coffee crash.',
    descriptionUk: 'Витриманий у темряві століть, цей концентрат несе в собі мудрість стародавніх даоських ченців. Глибока ферментація розкриває потужну енергію Ці, даруючи ясний, непохитний фокус без кавового тремору. Кожна крапля — це шлях до ментальної досконалості.',
    effects: ['Powerful energy', 'Crystal focus', 'Digestion boost'],
    effectsUk: ['Потужна енергія Ці', 'Кришталевий фокус', 'Гармонія травлення'],
    price1L: 950,
    price025L: 320,
    priceSticks: undefined, // Removed 30ml
    image: '/boostertea-premium-tea-concentrate.webp',
    category: 'energy',
    brewingTime: '15 секунд',
    temperature: 'Холодна або 85°C',
    origin: 'Юньнань, Китай',
    merchantId: 'boostertea',
    packifyId: 'project_puerh_01'
  },
  {
    id: 'dahongpao-oolong-002',
    slug: 'da-hong-pao',
    name: 'Da Hong Pao',
    nameUk: 'Да Хун Пао',
    description: 'Legendary "Big Red Robe" dark oolong concentrate. Delivers a deep roasted flavor with a warming, stress-relieving physiological effect.',
    descriptionUk: 'Народжений на скелястих схилах Уїшаню, "Великий Червоний Халат" зберігає тепло тисячолітнього сонця. Темне просмаження вивільняє глибокий аромат, що зігріває тіло та знімає тягар повсякденного стресу. Напій імператорів, створений для віднайдення внутрішнього спокою.',
    effects: ['Warming effect', 'Stress relief', 'Mental clarity'],
    effectsUk: ['Внутрішнє тепло', 'Звільнення від стресу', 'Ментальна рівновага'],
    price1L: 1050,
    price025L: 350,
    priceSticks: undefined, // Removed 30ml
    image: '/boostertea-premium-tea-concentrate.webp',
    category: 'classic',
    brewingTime: '15 секунд',
    temperature: '80-90°C',
    origin: 'Уїшань, Китай',
    merchantId: 'boostertea',
    packifyId: 'project_dahongpao_02'
  },
  {
    id: '6bf02c5d-7949-4254-9943-acf1bd62f288',
    slug: 'gaba',
    name: 'GABA',
    nameUk: 'ГАБА',
    description: 'Unique GABA-enriched tea concentrate for relaxation without drowsiness. Perfect for evening unwinding and quality sleep preparation.',
    descriptionUk: 'Створений на основі стародавніх тайванських традицій, цей концентрат збагачений унікальною ГАМК. Відкриває двері до стану глибокого медитативного спокою без відчуття сонливості. Ідеальний провідник у світ відновлювального сну та духовної тиші.',
    effects: ['Deep relaxation', 'Better sleep', 'Anxiety reduction'],
    effectsUk: ['Медитативний стан', 'Відновлювальний сон', 'Абсолютний дзен'],
    price1L: 1068,
    price025L: 360,
    priceSticks: undefined,
    image: '/gaba-tea-concentrate-premium.png',
    category: 'relaxation',
    brewingTime: '15 секунд',
    temperature: '80-90°C',
    origin: 'Тайвань',
    merchantId: 'boostertea'
  },
  // FUNNYDROPS PRODUCTS
  {
    id: 'fd-bubblegum-01',
    slug: 'neon-bubblegum',
    name: 'Neon Bubblegum',
    nameUk: 'Неонова Жуйка',
    description: 'Explosive bubblegum flavor for the ultimate sweet tooth. Bright, playful, and packed with a sugar-free punch.',
    descriptionUk: 'Вибуховий смак класичної рожевої жуйки! Яскравий, грайливий та абсолютно космічний сироп для створення найвеселіших напоїв без зайвого цукру.',
    effects: ['Mood Boost', 'Sugar Rush (Zero Sugar)', 'Vibrant Colors'],
    effectsUk: ['Миттєвий настрій', 'Крейзі енергія', 'Яскраві кольори'],
    price1L: 850,
    price025L: 290,
    image: '/images/products/fd-neon-bubblegum.png',
    category: 'classic',
    brewingTime: 'Instant',
    temperature: 'Cold/Ice',
    origin: 'Candy Lab',
    merchantId: 'funnydrops'
  },
  {
    id: 'fd-sour-apple-02',
    slug: 'toxic-apple',
    name: 'Toxic Apple',
    nameUk: 'Токсичне Яблуко',
    description: 'Intensely sour green apple drops that will make your face pucker. Perfect for shocking mocktails.',
    descriptionUk: 'Екстремально кисле зелене яблуко, що змусить твої рецептори кричати від задоволення. Ідеальний дроп для шокуючих моктейлів.',
    effects: ['Sour Shock', 'Awakening', 'Social Fun'],
    effectsUk: ['Кислий шок', 'Пробудження', 'Соціальний фан'],
    price1L: 850,
    price025L: 290,
    image: '/images/products/fd-toxic-apple.png',
    category: 'energy',
    brewingTime: 'Instant',
    temperature: 'Cold/Ice',
    origin: 'Candy Lab',
    merchantId: 'funnydrops'
  },
  // DINOSLUSH PRODUCTS
  {
    id: 'ds-t-rex-blood-01',
    slug: 't-rex-blood',
    name: 'T-Rex Blood (Cherry)',
    nameUk: 'Кров Тірекса (Вишня)',
    description: 'Deep crimson cherry slush base. Prehistoric chilling effect guaranteed to freeze the hot summer.',
    descriptionUk: 'Глибока криваво-вишнева база для слашу. Доісторичний льодовий ефект гарантовано заморозить найспекотніше літо.',
    effects: ['Absolute Freeze', 'Fruity Blast', 'Thirst Quenching'],
    effectsUk: ['Абсолютна заморозка', 'Фруктовий вибух', 'Втамування спраги'],
    price1L: 750,
    price025L: 250,
    image: '/images/products/ds-t-rex-blood.png',
    category: 'energy',
    brewingTime: 'Slush Machine',
    temperature: 'SUB-ZERO',
    origin: 'Jurassic Era',
    merchantId: 'dinoslush'
  },
  {
    id: 'ds-ice-age-blue-02',
    slug: 'ice-age-blue',
    name: 'Ice Age Blue (Raspberry)',
    nameUk: 'Льодовиковий Період (Блакитна Малина)',
    description: 'Crystalline blue raspberry slush. A freezing journey back to the Ice Age.',
    descriptionUk: 'Кришталево чиста блакитна малина для слаш-апаратів. Твоя квиток в епоху Льодовикового Піоріду.',
    effects: ['Brain Freeze', 'Cooling', 'Sweet & Tart'],
    effectsUk: ['Справжній Брейн-Фріз', 'Охолодження', 'Солодко-терпкий'],
    price1L: 750,
    price025L: 250,
    image: '/images/products/ds-ice-age-blue.png',
    category: 'classic',
    brewingTime: 'Slush Machine',
    temperature: 'ABSOLUTE ZERO',
    origin: 'Ice Age',
    merchantId: 'dinoslush'
  },
  // TLAB PRODUCTS
  {
    id: 'tl-synth-matcha-01',
    slug: 'synth-matcha',
    name: 'Synthetic Matcha (L-Theanine Isolate)',
    nameUk: 'Синтезована Матча (Ізолят L-Теаніну)',
    description: 'Lab-grade matcha extraction. Perfectly balanced L-Theanine to Caffeine ratio for clinical cognitive enhancement.',
    descriptionUk: 'Лабораторна екстракція матчі. Ідеально вивірене співвідношення L-Теаніну до Кофеїну для клінічного покращення когнітивних функцій.',
    effects: ['Cognitive Enhancement', 'Jitter-free', 'Neurological Balance'],
    effectsUk: ['Когнітивний буст', 'Відсутність тремору', 'Нейро-баланс'],
    price1L: 1200,
    price025L: 400,
    image: '/images/products/tl-synth-matcha.png',
    category: 'energy',
    brewingTime: '0.5s Dissolve',
    temperature: 'Variable',
    origin: 'TLab Facility Protocol 01',
    merchantId: 'tlab'
  },
  {
    id: 'tl-oolong-extract-02',
    slug: 'clinical-oolong',
    name: 'Clinical Oolong (Oxidation Level 4)',
    nameUk: 'Клінічний Улун (Рівень Окислення 4)',
    description: 'Precision-oxidized Oolong tea extract. Synthesized for optimal metabolic regulation and metabolic clarity.',
    descriptionUk: 'Екстракт улуну прецизійного окислення. Синтезовано для оптимальної регуляції метаболізму та клітинної ясності.',
    effects: ['Metabolic Regulation', 'Cellular Clarity', 'Digestive Synthesis'],
    effectsUk: ['Регуляція метаболізму', 'Клітинна ясність', 'Синтез травлення'],
    price1L: 1100,
    price025L: 380,
    image: '/images/products/tl-clinical-oolong.png',
    category: 'classic',
    brewingTime: '0.5s Dissolve',
    temperature: 'Variable',
    origin: 'TLab Facility Protocol 04',
    merchantId: 'tlab'
  }
];

export const accessoryProducts: Accessory[] = [
  {
    id: 'puerh-bing-325g',
    slug: 'puerh-bing-325g',
    nameUk: 'Пуер у млинці (Сухий чай, 325г)',
    descriptionUk: 'Спресований часом та майстерністю, цей шу пуер зберігає в собі дихання стародавніх лісів Юньнані. Відколюючи шматок цього преміального млинця, ви вивільняєте густий, землистий настій, що пробуджує внутрішню силу, рішучість та безкомпромісну бадьорість.',
    subcategory: 'dry_tea',
    price: 1140, // 950 * 1.2
    image: '/images/products/puerh-bing-8k.png',
    inStock: true,
    merchantId: 'boostertea'
  },
  {
    id: 'dahongpao-bing-325g',
    slug: 'dahongpao-bing-325g',
    nameUk: 'Да Хун Пао у млинці (Сухий чай, 325г)',
    descriptionUk: 'Темний перлинний улун слабкої спресовки, створений для істинних цінителів естетики. У кожному чайному листку схована могутність кам\'яних круч Уїшаню. Розколюючи цей млинець, ви доторкаєтесь до стародавньої магії, що дарує тепло та первозданну ясність думок.',
    subcategory: 'dry_tea',
    price: 1260, // 1050 * 1.2
    image: '/images/products/dahongpao-bing-8k.png',
    inStock: true,
    merchantId: 'boostertea'
  },
  {
    id: 'gaba-loose-50g',
    slug: 'gaba-loose-50g',
    nameUk: 'ГАБА розсипна (50г)',
    descriptionUk: 'Скручене вручну чайне листя найвищого ґатунку, що пройшло безкисневу ферментацію. Настій бурштинового кольору несе в собі абсолютну гармонію та бездоганно розчиняє найглибшу напругу розуму. Порція чистого дзену для справжніх майстрів свого життя.',
    subcategory: 'dry_tea',
    price: 256,
    image: '/images/products/gaba-loose-8k.png',
    inStock: true,
    merchantId: 'boostertea'
  },
  {
    id: 'gaba-loose-100g',
    slug: 'gaba-loose-100g',
    nameUk: 'ГАБА розсипна (100г)',
    descriptionUk: 'Скручене вручну чайне листя найвищого ґатунку, що пройшло безкисневу ферментацію. Настій бурштинового кольору несе в собі абсолютну гармонію та бездоганно розчиняє найглибшу напругу розуму. Порція чистого дзену для справжніх майстрів свого життя.',
    subcategory: 'dry_tea',
    price: 513,
    image: '/images/products/gaba-loose-8k.png',
    inStock: true,
    merchantId: 'boostertea'
  },
  {
    id: 'gaba-loose-250g',
    slug: 'gaba-loose-250g',
    nameUk: 'ГАБА розсипна (250г)',
    descriptionUk: 'Скручене вручну чайне листя найвищого ґатунку, що пройшло безкисневу ферментацію. Настій бурштинового кольору несе в собі абсолютну гармонію та бездоганно розчиняє найглибшу напругу розуму. Порція чистого дзену для справжніх майстрів свого життя.',
    subcategory: 'dry_tea',
    price: 1282, // 1068 * 1.2
    image: '/images/products/gaba-loose-8k.png',
    inStock: true,
    merchantId: 'boostertea'
  },
  {
    id: 'acc-1',
    slug: 'thermos-boostertea-500',
    nameUk: 'Термос BoosterTea 500ml',
    nameEn: 'BoosterTea Thermos 500ml',
    nameEs: 'Termo BoosterTea 500ml',
    descriptionUk: 'Викуваний зі сталі преміум-класу, цей термос — надійний хранитель тепла. Його подвійні стінки зберігають душу чаю недоторканою до 12 годин, дозволяючи вам насолоджуватись істинною гармонією у будь-якій подорожі.',
    descriptionEn: 'Premium double-walled vacuum insulated thermos. Keeps drinks hot for up to 12 hours. Perfect for travel and office.',
    descriptionEs: 'Termo premium de doble pared con aislamiento al vacío. Mantiene el calor hasta 12 horas. Perfecto para viajes y oficina.',
    subcategory: 'thermos',
    price: 899,
    image: '/images/products/thermos-boostertea-500.png',
    inStock: true,
    merchantId: 'boostertea'
  },
  {
    id: 'acc-2',
    slug: 'thermal-mug-travel',
    nameUk: 'Термокружка Travel',
    nameEn: 'Travel Thermal Mug',
    nameEs: 'Taza Térmica de Viaje',
    descriptionUk: 'Створена для сучасних кочівників. Ця стильна термокружка з антипроливним дизайном надійно береже ваш чайний дзен навіть у вирі неспокійного мегаполіса (350ml).',
    descriptionEn: 'Stylish thermal mug for car and office. Spill-proof design, comfortable handle, 350ml capacity.',
    descriptionEs: 'Elegante taza térmica para coche y oficina. Diseño antiderrame, asa cómoda, capacidad 350ml.',
    subcategory: 'mug',
    price: 549,
    image: '/images/products/thermos-boostertea-500.png',
    inStock: true,
    merchantId: 'boostertea'
  },
  {
    id: 'acc-3',
    slug: 'ceramic-cup',
    nameUk: 'Чашка Ceramic',
    nameEn: 'Ceramic Cup',
    nameEs: 'Taza de Cerámica',
    descriptionUk: 'Керамічна піала ручної роботи, що пам\'ятає дотик майстра. Ідеальний баланс місткості (250мл) розкриває кожен відтінок чайного настою, поєднуючи землю і воду в єдине ціле.',
    descriptionEn: 'Elegant handmade ceramic cup with BoosterTea logo. 250ml capacity, perfect for tea ceremonies.',
    descriptionEs: 'Elegante taza de cerámica hecha a mano con logo BoosterTea. Capacidad 250ml, perfecta para ceremonias de té.',
    subcategory: 'cup',
    price: 299,
    image: '/images/products/ceramic-cup.png',
    inStock: true,
    merchantId: 'boostertea'
  },
  {
    id: 'acc-4',
    slug: 'piala-gongfu',
    nameUk: 'Піала Gongfu',
    nameEn: 'Gongfu Tea Bowl',
    nameEs: 'Cuenco de Té Gongfu',
    descriptionUk: 'Витончена піала для традиційної чайної церемонії Гунфу Ча. Білосніжна глазур дозволяє оцінити найчистіший колір чайного настою, наповнюючи процес медитативним спокоєм (50ml).',
    descriptionEn: 'Classic tea bowl for Gongfu Cha tea ceremony. Excellent quality white porcelain, 50ml capacity.',
    descriptionEs: 'Cuenco de té clásico para la ceremonia del té Gongfu Cha. Porcelana blanca de excelente calidad, capacidad 50ml.',
    subcategory: 'piala',
    price: 159,
    image: '/images/products/piala-gongfu.png',
    inStock: true,
    merchantId: 'boostertea'
  },
  {
    id: 'acc-5',
    slug: 'tea-mat',
    nameUk: 'Чайний Килимок (Ча Чі)',
    nameEn: 'Bamboo Tea Mat',
    descriptionUk: 'Сплетений вручну з гнучкого бамбука, цей чайний килимок є фундаментом вашого чайного простору. Він створює ідеальну атмосферу для усамітнення або глибокої розмови за чашею чаю.',
    subcategory: 'piala', // Used 'piala' to reuse category filtering if needed
    price: 199,
    image: '/images/products/tea-mat.png',
    inStock: true,
    merchantId: 'boostertea'
  },
  {
    id: 'dry-puerh-100',
    slug: 'dry-puerh-100',
    nameUk: 'Сухий чай Пуер 100г',
    nameEn: 'Dry Pu-erh Tea 100g',
    nameEs: 'Té Pu-erh Seco 100g',
    descriptionUk: 'Справжній витриманий пуер з провінції Юньнань. Для тих, хто любить заварювати чай традиційним способом.',
    descriptionEn: 'Authentic aged pu-erh from Yunnan province. For those who love brewing tea the traditional way.',
    descriptionEs: 'Auténtico pu-erh añejo de la provincia de Yunnan. Para quienes aman preparar té de forma tradicional.',
    subcategory: 'dry_tea',
    price: 450,
    image: '/images/products/dry-puerh-cake.png',
    inStock: true,
    merchantId: 'boostertea'
  },
  {
    id: 'dry-puerh-cake-325',
    slug: 'dry-puerh-cake-325',
    nameUk: 'Пуер Шу Бін 325г',
    nameEn: 'Pu-erh Shu Bing 325g',
    descriptionUk: 'Оригінальний витриманий сухий чай Пуер, спресований у класичний блін (325 грамів). Класика чайної церемонії.',
    descriptionEn: 'Original aged dry Pu-erh tea, pressed into a classic cake (325 grams). A tea ceremony classic.',
    subcategory: 'dry_tea',
    price: 1140,
    image: '/images/products/dry-puerh-cake.png',
    inStock: true,
    merchantId: 'boostertea'
  },
  {
    id: 'dry-dahongpao-cake-325',
    slug: 'dry-dahongpao-cake-325',
    nameUk: 'Да Хун Пао Бін 325г',
    nameEn: 'Da Hong Pao Cake 325g',
    descriptionUk: 'Легендарний темний улун Да Хун Пао, спресований у блін (325 грамів) для тривалого зберігання та глибокого розкриття смаку.',
    descriptionEn: 'Legendary dark oolong Da Hong Pao, pressed into a 325g cake for long-term storage and profound flavor evolution.',
    subcategory: 'dry_tea',
    price: 1260,
    image: '/images/products/dahongpao-bing-8k.png',
    inStock: true,
    merchantId: 'boostertea'
  },
  {
    id: 'dry-gaba-250',
    slug: 'dry-gaba-loose-250',
    nameUk: 'ГАБА розсипна 250г',
    nameEn: 'Loose GABA Tea 250g',
    descriptionUk: 'Відбірний розсипний чай ГАБА з високим вмістом ГАМК (250 грамів). Ідеальний для спокою та фокусу.',
    descriptionEn: 'Premium loose leaf GABA tea with high GABA content (250 grams). Perfect for calmness and focus.',
    subcategory: 'dry_tea',
    price: 1282,
    image: '/images/products/dry-gaba-loose.png',
    inStock: true,
    merchantId: 'boostertea'
  },
  {
    id: 'merch-hoodie-rebirth',
    slug: 'merch-hoodie-rebirth',
    nameUk: 'Худі "Агент Відродження"',
    nameEn: 'Agent of Rebirth Hoodie',
    descriptionUk: 'Створене в тіні для тих, хто несе світло. Щільна тканина цього преміального худі огортає вас невидимою бронею впевненості, а тонкі візерунки надихають на древній шлях воїна. Одягайте його, коли світ потребує справжньої сили Ці.',
    subcategory: 'apparel',
    price: 1499,
    image: '/images/products/merch-hoodie-8k.png',
    inStock: true,
    merchantId: 'boostertea'
  },
  {
    id: 'merch-tee-myth',
    slug: 'merch-tee-myth',
    nameUk: 'Футболка "Руйнівники"',
    nameEn: 'MythBusters Logo Tee',
    descriptionUk: 'Мінімалістична чорна мантра, втілена у тканині. Дотик преміальної бавовни нагадує прохолоду обтесаного каменю, а фірмовий каліграфічний друк єднає вас із кланом справжніх руйнівників міфів.',
    subcategory: 'apparel',
    price: 799,
    image: '/images/products/merch-tee-8k.png',
    inStock: true,
    merchantId: 'boostertea'
  },
  {
    id: 'merch-stickers-cyber',
    slug: 'merch-stickers-cyber',
    nameUk: 'Стікери "Кібер Дзен"',
    nameEn: 'Cyber Zen Stickers',
    descriptionUk: 'Символи сучасної епохи, поєднані з віковими знаннями. Набір вінілових талісманів, що перетворюють будь-яку поверхню на вівтар вашого стилю. Вони сяють у темряві невігластва, вказуючи шлях руйнівникам.',
    subcategory: 'stickers',
    price: 299,
    image: '/images/products/merch-stickers-8k.png',
    inStock: true,
    merchantId: 'boostertea'
  },
  {
    id: 'dry-gaba-100',
    slug: 'dry-gaba-loose-100',
    nameUk: 'ГАБА розсипна 100г',
    nameEn: 'Loose GABA Tea 100g',
    descriptionUk: 'Відбірний розсипний чай ГАБА з високим вмістом ГАМК. Порція 100 грамів.',
    descriptionEn: 'Premium loose leaf GABA tea with high GABA content. 100 gram portion.',
    subcategory: 'dry_tea',
    price: 513,
    image: '/images/products/dry-gaba-loose.png',
    inStock: true,
    merchantId: 'boostertea'
  },
  {
    id: 'dry-gaba-50',
    slug: 'dry-gaba-loose-50',
    nameUk: 'ГАБА розсипна 50г',
    nameEn: 'Loose GABA Tea 50g',
    descriptionUk: 'Дегустаційна порція розсипного чаю ГАБА (50 грамів).',
    descriptionEn: 'Tasting portion of premium loose leaf GABA tea (50 grams).',
    subcategory: 'dry_tea',
    price: 257,
    image: '/images/products/dry-gaba-loose.png',
    inStock: true,
    merchantId: 'boostertea'
  }
];

export interface MerchProduct {
  id: string;
  slug: string;
  nameUk: string;
  nameEn?: string;
  descriptionUk: string;
  descriptionEn?: string;
  category: 'stickers' | 'apparel' | 'accessories';
  price: number;
  image: string;
  badge?: string;
  features: string[];
  inStock: boolean;
  merchantId?: 'boostertea' | 'funnydrops' | 'dinoslush' | 'tlab' | 'academy';
}

export const academyMerch: MerchProduct[] = [
  {
    id: 'sticker-pack-1',
    slug: 'mythbusters-sticker-pack-1',
    nameUk: 'Набір стікерів Руйнівники Міфів',
    nameEn: 'MythBusters Sticker Pack',
    descriptionUk: '12 вінілових стікерів з Mykyta, Nazar та культовими моментами коміксів',
    descriptionEn: '12 vinyl stickers featuring Mykyta, Nazar, and iconic comic moments',
    price: 299,
    image: '/merch/sticker-pack-1.jpg',
    category: 'stickers',
    badge: 'Bestseller',
    features: ['Водостійкі', 'UV захист', 'Легко знімаються'],
    inStock: true,
    merchantId: 'academy'
  },
  {
    id: 'sticker-pack-2',
    slug: 'myth-busted-stickers',
    nameUk: 'Набір стікерів MYTH BUSTED!',
    nameEn: 'MYTH BUSTED! Sticker Set',
    descriptionUk: '8 яскравих стейтмент-стікерів для ноутбука, пляшки чи блокнота',
    descriptionEn: '8 bold statement stickers for your laptop, bottle, or notebook',
    price: 199,
    image: '/merch/sticker-pack-2.jpg',
    category: 'stickers',
    features: ['Матове покриття', 'Багаторазові'],
    inStock: true,
    merchantId: 'academy'
  },
  {
    id: 'sticker-pack-3',
    slug: 'character-portrait-stickers',
    nameUk: 'Портретні стікери персонажів',
    nameEn: 'Character Portrait Stickers',
    descriptionUk: 'Індивідуальні стікери персонажів з голографічним покриттям',
    descriptionEn: 'Individual character stickers with holographic finish',
    price: 149,
    image: '/merch/sticker-pack-3.jpg',
    category: 'stickers',
    badge: 'New',
    features: ['Голографічні', 'Преміум вініл'],
    inStock: true,
    merchantId: 'academy'
  },
  {
    id: 'tshirt-1',
    slug: 'mythbusters-logo-tee',
    nameUk: 'Футболка з логотипом Руйнівників',
    nameEn: 'MythBusters Logo Tee',
    descriptionUk: 'Класична чорна футболка з вишитим логотипом Руйнівників Міфів',
    descriptionEn: 'Classic black tee with embroidered MythBusters logo',
    price: 799,
    image: '/merch/tshirt-1.jpg',
    category: 'apparel',
    badge: 'Limited',
    features: ['100% бавовна', 'Преміум крій', 'Вишивка'],
    inStock: true,
    merchantId: 'academy'
  },
  {
    id: 'tshirt-2',
    slug: 'comic-panel-tee',
    nameUk: 'Футболка з комікс-панеллю',
    nameEn: 'Comic Panel Tee',
    descriptionUk: 'Повнокольоровий принт комікс-панелі на преміумній бавовні',
    descriptionEn: 'Full-color comic panel print on premium cotton',
    price: 899,
    image: '/merch/tshirt-2.jpg',
    category: 'apparel',
    features: ['DTG принт', 'Unisex'],
    inStock: true,
    merchantId: 'academy'
  },
  {
    id: 'hoodie-1',
    slug: 'agent-rebirth-hoodie',
    nameUk: 'Худі Агент Відродження',
    nameEn: 'Agent of Rebirth Hoodie',
    descriptionUk: 'Худі в стилі Mykyta з тактичними деталями',
    descriptionEn: 'Mykyta-inspired hoodie with tactical details',
    price: 1499,
    image: '/merch/hoodie-1.jpg',
    category: 'apparel',
    features: ['Щільна тканина', 'Кишеня кенгуру', 'Преміум фурнітура'],
    inStock: true,
    merchantId: 'academy'
  },
  {
    id: 'mug-1',
    slug: 'mythbusters-ceramic-mug',
    nameUk: 'Керамічна кружка Руйнівники',
    nameEn: 'MythBusters Ceramic Mug',
    descriptionUk: 'Кружка, що змінює малюнок від температури, відкриває секретне комікс-арт',
    descriptionEn: 'Heat-changing mug reveals secret comic art',
    price: 449,
    image: '/merch/mug-1.jpg',
    category: 'accessories',
    badge: 'Hot!',
    features: ['Змінює колір від тепла', '350ml'],
    inStock: true,
    merchantId: 'academy'
  },
  {
    id: 'bottle-1',
    slug: 'twin-neck-style-bottle',
    nameUk: 'Пляшка в стилі Twin-Neck',
    nameEn: 'Twin-Neck Style Bottle',
    descriptionUk: 'Лімітоване видання пляшки, натхненне коміксом',
    descriptionEn: 'Limited edition bottle inspired by the comic',
    price: 599,
    image: '/merch/bottle-1.jpg',
    category: 'accessories',
    features: ['Не містить BPA', 'Герметична', '1Л'],
    inStock: true,
    merchantId: 'academy'
  },
  {
    id: 'tote-1',
    slug: 'comic-tote-bag',
    nameUk: 'Сумка-шопер з коміксом',
    nameEn: 'Comic Tote Bag',
    descriptionUk: 'Канвас шопер з повнокольоровим принтом обкладинки коміксу',
    descriptionEn: 'Canvas tote with full comic cover print',
    price: 399,
    image: '/merch/tote-1.jpg',
    category: 'accessories',
    features: ['Органічна бавовна', 'Посилені ручки', 'Eco-friendly'],
    inStock: true,
    merchantId: 'academy'
  }
];
