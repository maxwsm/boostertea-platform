import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('📦 Розпочинаємо глибоке заповнення реального каталогу (Real Catalog Seed)...');

  // Find existing brands
  const boosterTea = await prisma.brand.findUnique({ where: { slug: 'boostertea' } });
  const dinoSlush = await prisma.brand.findUnique({ where: { slug: 'dinoslush' } });
  // Creating missing brands if needed for real data
  const funnyDrops = await prisma.brand.upsert({
    where: { slug: 'funnydrops' },
    update: {},
    create: { slug: 'funnydrops', name: 'FunnyDrops', domain: 'funnydrops.com.ua' }
  });

  const teaLab = await prisma.brand.upsert({
    where: { slug: 'tealab' },
    update: {},
    create: { slug: 'tealab', name: 'TeaLab', domain: 'tealab.com.ua' }
  });

  if (!boosterTea || !dinoSlush) {
    console.error('❌ Помилка: BoosterTea або DinoSlush не знайдено. Спочатку запустіть базовий seed.ts.');
    return;
  }

  // Define actual, realistic inventory arrays
  const boosterTeaProducts = [
    { slug: 'bt-matcha-premium', nameUk: 'Матча Преміум (Японія)', price: 1450.0, category: 'tea_powder', desc: 'Високоякісна церемоніальна матча з Уджі, Японія. Ідеально для Матча-Лате.' },
    { slug: 'bt-tapioca-classic', nameUk: 'Тапіока Класична (Чорна)', price: 320.0, category: 'topping', desc: 'Сира тапіока для варіння. Золотий стандарт бабл-ті, глибокий карамельний аромат.' },
    { slug: 'bt-syrup-brown-sugar', nameUk: 'Сироп "Чорний Цукор" (Brown Sugar)', price: 480.0, category: 'syrup', desc: 'Густий тайванський сироп чорного цукру. Створює ідеальні тигрові смуги на стінках стакана.' },
    { slug: 'bt-syrup-passion', nameUk: 'Сироп "Маракуя" (Passion Fruit)', price: 410.0, category: 'syrup', desc: 'Насичений тропічний сироп з кісточками для фруктових чаїв.' },
    { slug: 'bt-tea-jasmine', nameUk: 'Чай Зелений Жасмин (Листовий)', price: 850.0, category: 'tea_leaf', desc: 'Класична основа для фруктових бабл-ті. Квітковий аромат і терпкість зеленого чаю.' },
    { slug: 'bt-tea-assam', nameUk: 'Чай Чорний Ассам (Листовий)', price: 790.0, category: 'tea_leaf', desc: 'Міцний чорний чай, ідеальна база для класичного Milk Tea та Brown Sugar Boba.' },
    { slug: 'bt-powder-taro', nameUk: 'Пудра "Таро" (Taro Powder)', price: 560.0, category: 'tea_powder', desc: 'Фіолетова пудра з екстрактом кореня таро. Солодкий, кремовий, печивний смак.' }
  ];

  const funnyDropsProducts = [
    { slug: 'fd-popping-strawberry', nameUk: 'Boba "Полуниця" (Popping Boba)', price: 490.0, category: 'popping_boba', desc: 'Кульки з тонкою оболонкою з морських водоростей (агар-агар) та натуральним соком полуниці всередині.' },
    { slug: 'fd-popping-mango', nameUk: 'Boba "Манго" (Popping Boba)', price: 490.0, category: 'popping_boba', desc: 'Екзотичні жовті кульки, що вибухають солодким манговим соком.' },
    { slug: 'fd-popping-blueberry', nameUk: 'Boba "Лохина" (Popping Boba)', price: 490.0, category: 'popping_boba', desc: 'Темно-фіолетові кульки зі смаком стиглої лохини.' },
    { slug: 'fd-popping-apple', nameUk: 'Boba "Зелене Яблуко" (Popping Boba)', price: 490.0, category: 'popping_boba', desc: 'Освіжаючі, злегка кислуваті кульки з соком зеленого яблука.' },
    { slug: 'fd-jelly-coconut', nameUk: 'Кокосове желе (Nata de Coco)', price: 380.0, category: 'jelly', desc: 'Натуральне желе з ферментованої кокосової води, нарізане кубиками.' }
  ];

  const dinoSlushProducts = [
    { slug: 'ds-slush-cola', nameUk: 'DinoSlush Концентрат "Кола"', price: 800.0, category: 'concentrate', image: '/products/cola.png', desc: 'Сироп-концентрат для граніторів зі смаком класичної коли.' },
    { slug: 'ds-slush-bubblegum', nameUk: 'DinoSlush Концентрат "Бабл-Гам"', price: 850.0, category: 'concentrate', image: '/products/bubblegum.png', desc: 'Сироп для виготовлення блакитного слашу зі смаком жуйки.' },
    { slug: 'ds-cups-dome', nameUk: 'Стакани купольні PET (1000 шт)', price: 1200.0, category: 'packaging', desc: 'Прозорі стакани з купольною кришкою для слашів та бабл-ті.' }
  ];

  const teaLabProducts = [
    { slug: 'tl-sealer-machine', nameUk: 'Машина-запайщик (Cup Sealer)', price: 15400.0, category: 'equipment', image: '/products/cup_sealer.png', desc: 'Автоматичний запайщик пластикових і паперових стаканів плівкою.' },
    { slug: 'tl-fructose-dispenser', nameUk: 'Фруктозник (Fructose Dispenser)', price: 8300.0, category: 'equipment', image: '/products/fructose_dispenser.png', desc: 'Машина для точного автоматичного дозування сиропів/фруктози на барі.' },
    { slug: 'tl-shaker-machine', nameUk: 'Шейкер-машина (Auto Shaker)', price: 12100.0, category: 'equipment', desc: 'Подвійний автоматичний шейкер для ідеального збивання чаю з льодом.' }
  ];

  // Insert logic
  const insertProducts = async (products: any[], brandId: string) => {
    for (const p of products) {
      // Upsert to avoiding duplicates on multiple runs
      await prisma.product.upsert({
        where: { brandId_slug: { brandId: brandId, slug: p.slug } },
        update: { price: p.price, descriptionUk: p.desc, image: p.image },
        create: {
          brandId,
          slug: p.slug,
          nameUk: p.nameUk,
          descriptionUk: p.desc,
          price: p.price,
          category: p.category,
          image: p.image,
          metadata: JSON.stringify({ isReal: true, updatedAt: new Date() })
        }
      });
    }
  };

  await insertProducts(boosterTeaProducts, boosterTea.id);
  await insertProducts(funnyDropsProducts, funnyDrops.id);
  await insertProducts(dinoSlushProducts, dinoSlush.id);
  await insertProducts(teaLabProducts, teaLab.id);

  console.log('✅ Реальний каталог для всіх 4 брендів успішно оновлено!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
