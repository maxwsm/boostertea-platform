import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Запуск комплексного генератора екосистеми (Клієнти, Оплати, Замовлення, Авторизації)...');

  // Отримання існуючих брендів
  const boosterTea = await prisma.brand.findUnique({ where: { slug: 'boostertea' } });
  const dinoSlush = await prisma.brand.findUnique({ where: { slug: 'dinoslush' } });
  
  if (!boosterTea || !dinoSlush) {
        console.error('❌ Спочатку виконайте базовий seed (npm run seed) для створення брендів та товарів!');
        process.exit(1);
  }

  const btProducts = await prisma.product.findMany({ where: { brandId: boosterTea.id } });
  const dsProducts = await prisma.product.findMany({ where: { brandId: dinoSlush.id } });

  console.log(`✅ Знайдено ${btProducts.length} товарів BoosterTea та ${dsProducts.length} товарів DinoSlush.`);

  // ----------------------------------------------------
  // 1. ГЕНЕРАЦІЯ КЛІЄНТІВ ТА АВТОРИЗАЦІЙ
  // ----------------------------------------------------
  console.log('👤 Генерація клієнтської бази...');
  const clients = [];
  for (let i = 1; i <= 25; i++) {
    const isVip = i % 5 === 0;
    const user = await prisma.user.create({
      data: {
        email: `client${i}@example.com`,
        name: `Клієнт ${i}`,
        phone: `+3805012345${i.toString().padStart(2, '0')}`,
        telegramId: i % 3 === 0 ? `tg_id_${10000 + i}` : null,
        languageCode: i % 4 === 0 ? 'en' : 'uk',
        lastIpAddress: `192.168.1.${i}`,
        lastDeviceId: `device_xyz_${i}`,
        wallet: {
          create: {
            balance: isVip ? 500.0 : 50.0,
            totalEarned: isVip ? 1500.0 : 100.0,
            totalSpent: isVip ? 1000.0 : 50.0
          }
        }
      }
    });
    clients.push(user);
    
    // B2B Lead generation for every 7th user
    if (i % 7 === 0) {
      await prisma.b2BLead.create({
        data: {
          userId: user.id,
          cafeName: `Кав'ярня "Зерна #${i}"`,
          city: i % 2 === 0 ? 'Київ' : 'Львів',
          address: 'Вул. Центральна, 1',
          status: i % 2 === 0 ? 'NEW' : 'CONTACTED'
        }
      });
    }
  }

  // ----------------------------------------------------
  // 2. ГЕНЕРАЦІЯ ТРАНЗАКЦІЙ ТА ОПЛАТ (PAYMENTS)
  // ----------------------------------------------------
  console.log('💳 Генерація транзакцій, оплат та замовлень...');
  const statuses = ['COMPLETED', 'PENDING', 'FROZEN', 'CANCELLED'];
  const gateways = ['monobank', 'wayforpay', 'cash'];

  for (let i = 0; i < 40; i++) {
    const client = clients[Math.floor(Math.random() * clients.length)];
    const brand = Math.random() > 0.3 ? boosterTea : dinoSlush;
    const products = brand.id === boosterTea.id ? btProducts : dsProducts;
    
    if (products.length === 0) continue;
    
    // Вибираємо 1-3 випадкових товари
    const itemsCount = Math.floor(Math.random() * 3) + 1;
    const selectedItems = [];
    let totalAmount = 0;
    
    for (let j = 0; j < itemsCount; j++) {
      const prod = products[Math.floor(Math.random() * products.length)];
      const qty = Math.floor(Math.random() * 5) + 1;
      const price = Number(prod.price);
      totalAmount += price * qty;
      selectedItems.push({
        productId: prod.id,
        quantity: qty,
        priceAtBuy: price,
        variant: '1L' // Default mock
      });
    }

    const tStatus = statuses[Math.floor(Math.random() * statuses.length)];
    const tGateway = gateways[Math.floor(Math.random() * gateways.length)];

    // Транзакція
    const transaction = await prisma.transaction.create({
      data: {
        userId: client.id,
        brandId: brand.id,
        totalAmount,
        paymentGateway: tGateway,
        status: tStatus,
        ipAddress: client.lastIpAddress,
      }
    });

    // Замовлення
    await prisma.order.create({
      data: {
        userId: client.id,
        brandId: brand.id,
        transactionId: transaction.id,
        status: tStatus === 'COMPLETED' ? 'SHIPPED' : (tStatus === 'FROZEN' ? 'PROCESSING' : 'PENDING'),
        totalAmount,
        deliveryData: JSON.stringify({ method: 'nova_poshta', city: 'Київ', warehouse: 'Відділення №1' }),
        items: {
          create: selectedItems
        }
      }
    });
  }

  // ----------------------------------------------------
  // 3. ГЕНЕРАЦІЯ ПОКИНУТИХ КОШИКІВ (SHADOW CARTS)
  // ----------------------------------------------------
  console.log('🛒 Створення покинутих кошиків (Retention)...');
  for (let i = 0; i < 10; i++) {
    await prisma.shadowCart.create({
      data: {
        sessionId: `session_mock_abandoned_${i}`,
        phone: `+38067000112${i}`,
        status: i % 2 === 0 ? 'abandoned' : 'processing',
        payload: JSON.stringify({ items: [{ productId: 'mock', quantity: 1 }], total: 500 }),
        triggerAt: new Date(Date.now() + 1000 * 60 * 30 * (i + 1)) // Future trigger
      }
    });
  }
  
  console.log('🎉 Успішно! Базу наповнено потужним симуляційним масивом даних (Авторизації, Оплати, Клієнти).');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
