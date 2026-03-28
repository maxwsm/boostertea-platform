import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Скидання старих даних та початок сівби...');
  
  // Clean up
  await prisma.carrierScore.deleteMany();
  await prisma.logisticsAchievement.deleteMany();
  await prisma.b2BPartner.deleteMany();
  await prisma.aiResponseAudit.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.wallet.deleteMany();
  await prisma.user.deleteMany();

  // 1. Створення Брендів (Brands)
  const boosterTea = await prisma.brand.create({
    data: {
      slug: 'boostertea',
      name: 'BoosterTea',
      domain: 'boostertea.com.ua',
    }
  });

  const dinoSlush = await prisma.brand.create({
    data: {
      slug: 'dinoslush',
      name: 'DinoSlush',
      domain: 'dinoslush.com.ua',
    }
  });

  console.log('✅ Бренди створено:', boosterTea.name, dinoSlush.name);

  // 2. Створення Каталогу Товарів BoosterTea
  const btProducts = [
    {
      brandId: boosterTea.id,
      slug: 'pu-erh',
      nameUk: 'Пуер',
      descriptionUk: 'Преміальний витриманий чайний концентрат з глибокими земляними нотами.',
      price: 900.0,
      category: 'energy',
      metadata: JSON.stringify({
        price1L: 900,
        price025L: 300,
        priceSticks: 720,
        effectsUk: ['Заряд енергії', 'Покращення концентрації', 'Підтримка метаболізму'],
        brewingTime: '15 секунд',
        temperature: '85-95°C',
        origin: 'Юньнань, Китай'
      })
    },
    {
      brandId: boosterTea.id,
      slug: 'gaba',
      nameUk: 'ГАБА',
      descriptionUk: 'Унікальний чайний концентрат збагачений ГАМК для розслаблення.',
      price: 1068.0,
      category: 'relaxation',
      metadata: JSON.stringify({
        price1L: 1068,
        price025L: 360,
        priceSticks: 1008,
        effectsUk: ['Глибоке розслаблення', 'Кращий сон', 'Зниження тривожності'],
        brewingTime: '15 секунд',
        temperature: '80-90°C',
        origin: 'Тайвань'
      })
    },
    {
      brandId: boosterTea.id,
      slug: 'da-hong-pao',
      nameUk: 'Да Хун Пао',
      descriptionUk: 'Легендарний улун "Великий Червоний Халат".',
      price: 936.0,
      category: 'classic',
      metadata: JSON.stringify({
        price1L: 936,
        price025L: 312,
        priceSticks: 900,
        effectsUk: ['Зігріваючий ефект', 'Зняття стресу', 'Комфорт травлення'],
        brewingTime: '15 секунд',
        temperature: '90-98°C',
        origin: 'Уішань, Китай'
      })
    },
    {
      id: 'puerh-bing-325g',
      brandId: boosterTea.id,
      slug: 'puerh-bing-325g',
      nameUk: 'Пуер у млинці (Сухий чай, 325г)',
      descriptionUk: 'Класичний шу пуер спресований у млинець. Глибокий смак та максимальна бадьорість.',
      price: 1140.0,
      category: 'dry_tea',
      metadata: JSON.stringify({
        weight: '325г',
        type: 'bing',
        origin: 'Юньнань, Китай'
      })
    },
    {
      id: 'dahongpao-bing-325g',
      brandId: boosterTea.id,
      slug: 'dahongpao-bing-325g',
      nameUk: 'Да Хун Пао у млинці (Сухий чай, 325г)',
      descriptionUk: 'Легендарний улун слабкої спресовки для справжніх поціновувачів та руйнівників міфів.',
      price: 1260.0,
      category: 'dry_tea',
      metadata: JSON.stringify({
        weight: '325г',
        type: 'bing',
        origin: 'Уішань, Китай'
      })
    },
    {
      id: 'gaba-loose-50g',
      brandId: boosterTea.id,
      slug: 'gaba-loose-50g',
      nameUk: 'ГАБА розсипна (50г)',
      descriptionUk: 'Унікальний тайванський чай для розслаблення.',
      price: 256.0,
      category: 'dry_tea',
      metadata: JSON.stringify({
        weight: '50г',
        type: 'loose',
        origin: 'Тайвань'
      })
    },
    {
      id: 'gaba-loose-100g',
      brandId: boosterTea.id,
      slug: 'gaba-loose-100g',
      nameUk: 'ГАБА розсипна (100г)',
      descriptionUk: 'Унікальний тайванський чай для розслаблення. Оптимальний формат.',
      price: 513.0,
      category: 'dry_tea',
      metadata: JSON.stringify({
        weight: '100г',
        type: 'loose',
        origin: 'Тайвань'
      })
    },
    {
      id: 'gaba-loose-250g',
      brandId: boosterTea.id,
      slug: 'gaba-loose-250g',
      nameUk: 'ГАБА розсипна (250г)',
      descriptionUk: 'Унікальний тайванський чай для розслаблення. Максимальний запас.',
      price: 1282.0,
      category: 'dry_tea',
      metadata: JSON.stringify({
        weight: '250г',
        type: 'loose',
        origin: 'Тайвань'
      })
    }
  ];

  for (const product of btProducts) {
    await prisma.product.create({ data: product });
  }

  // 3. Створення базових рецептів DinoSlush
  const dsProducts = [
    {
      brandId: dinoSlush.id,
      slug: 'neon-berry',
      nameUk: 'Neon Berry (Холодна Лава)',
      descriptionUk: 'Електричний смак лісових ягід з ефектом охолодження і неоновим кольором.',
      price: 120.0,
      category: 'slush',
      metadata: JSON.stringify({
        effectsUk: ['Миттєве охолодження', 'Екстремальна свіжість'],
        colors: ['#00F0FF', '#FF007F']
      })
    },
    {
      brandId: dinoSlush.id,
      slug: 't-rex-mango',
      nameUk: 'T-REX Манго',
      descriptionUk: 'Агресивний і потужний смак тропічного манго з легким кислим післясмаком.',
      price: 110.0,
      category: 'slush',
      metadata: JSON.stringify({
        effectsUk: ['Тропічний вибух', 'Енергія джунглів'],
        colors: ['#FFC700', '#FF3D00']
      })
    }
  ];

  for (const product of dsProducts) {
    await prisma.product.create({ data: product });
  }

  console.log('✅ Каталог продуктів завантажено в БД.');
  
  // 4. Тестовий користувач адмін
  const admin = await prisma.user.create({
    data: {
      email: 'admin@boostertea.com.ua',
      name: 'Maks WSM Master',
      languageCode: 'uk',
    }
  });

  await prisma.wallet.create({
    data: {
      userId: admin.id,
      balance: 1000.0,
    }
  });
  
  console.log('✅ Тестового Адміна створено. Гаманець поповнено на 1000 WSM Coins.');

  // 5. Тестова Телеметрія (AiResponseAudit)
  await prisma.aiResponseAudit.createMany({
    data: [
      { userId: admin.id, brandId: boosterTea.id, modelUsed: 'gpt-4-turbo', tokensInput: 450, tokensOutput: 120, costUsd: 0.0075 },
      { userId: admin.id, brandId: dinoSlush.id, modelUsed: 'claude-3-opus', tokensInput: 800, tokensOutput: 300, costUsd: 0.0350 },
      { userId: null, brandId: boosterTea.id, modelUsed: 'gpt-3.5-turbo', tokensInput: 150, tokensOutput: 50, costUsd: 0.0004 },
    ]
  });
  console.log('✅ Згенеровано AI Telemetry логи.');

  // 6. Тестові B2B-партнери (YouControl)
  await prisma.b2BPartner.create({
    data: {
      userId: admin.id, // Assigned to admin for testing
      companyName: 'ТОВ "Кавова Гуща"',
      edrpou: '12345678',
      hasTaxDebt: true,
      courtCasesCount: 2,
      isVerified: false
    }
  });

  await prisma.b2BPartner.create({
    data: {
      companyName: 'ФОП Шевченко О.О.',
      edrpou: '87654321',
      hasTaxDebt: false,
      courtCasesCount: 0,
      isVerified: true
    }
  });
  console.log('✅ Згенеровано B2B партнерів (вкл. боржників YouControl).');

  // 7. Складська Гейміфікація (CarrierScore & Achievements)
  const worker1 = await prisma.user.create({ data: { name: 'Іван Бойко', languageCode: 'uk' } });
  const worker2 = await prisma.user.create({ data: { name: 'Олена Коваль', languageCode: 'uk' } });

  await prisma.carrierScore.create({
    data: { userId: worker1.id, score: 3450, packSpeed: 45.5, level: 'Master Packer' }
  });
  await prisma.carrierScore.create({
    data: { userId: worker2.id, score: 2800, packSpeed: 38.2, level: 'Senior Packer' }
  });

  await prisma.logisticsAchievement.create({
    data: { userId: worker1.id, title: '🏃‍♂️ Flash Mover', description: 'Спакував 100+ посилок за зміну' }
  });
  console.log('✅ Згенеровано Gamified Logistics лідерборди.');

  console.log('🚀 БАЗА ДАНИХ ГОТОВА ДО ЗАПУСКУ.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
