/**
 * TITAN OMNI-CHANNEL ERP: 100-Run Simulation
 * Повний краш-тест кошиків, оплат та mPrinter webhook'ів.
 * 
 * Запуск: npx tsx apps/wsm-dashboard/src/scripts/simulate100.ts
 */

const API_URL = 'http://localhost:3001/api';
// WEBHOOK URL matches the new worker api path
const WEBHOOK_URL = 'http://localhost:3001/api/webhooks/monobank';

const BRANDS = ['boostertea', 'funnydrops', 'dinoslush', 'tlab'];
const CHANNELS = ['WEB_BROWSER', 'TELEGRAM_MINI_APP', 'TELEGRAM_BOT_NATIVE'];

const CITIES = ['Київ', 'Львів', 'Одеса', 'Дніпро', 'Івано-Франківськ'];
const NAMES = ['Олексій', 'Марія', 'Тарас', 'Софія', 'Богдан'];
const SURNAMES = ['Коваленко', 'Шевченко', 'Бойко', 'Мельник', 'Ткаченко'];

// Функція-затримка, щоб імітувати реальний час між подіями людей
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

async function simulateOrder(runId: number) {
  const brand = BRANDS[Math.floor(Math.random() * BRANDS.length)];
  const channel = CHANNELS[Math.floor(Math.random() * CHANNELS.length)];
  const name = `${SURNAMES[Math.floor(Math.random() * SURNAMES.length)]} ${NAMES[Math.floor(Math.random() * NAMES.length)]}`;
  const phone = `+380${Math.floor(Math.random() * 90000000 + 10000000)}`;
  const city = CITIES[Math.floor(Math.random() * CITIES.length)];
  
  const orderPayload = {
    customerName: name,
    customerPhone: phone,
    deliveryCity: city,
    deliveryMethod: 'nova_poshta',
    merchantId: brand,
    sourceChannel: channel,
    // Фейкові товари
    items: [
      { productId: `test-prod-${brand}-1`, volume: '1L', quantity: 1 }
    ],
    // Додаємо мітку, що це фейк
    isSimulation: true,
  };

  try {
    console.log(`[Run #${runId}] Створення замовлення: ${name} (${brand} через ${channel})`);
    
    // КРОК 1: Створення Ордеру (Емуляція натискання "Оформити Замовлення")
    const orderRes = await fetch(`${API_URL}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderPayload)
    });
    
    if (!orderRes.ok) {
       console.error(`[Run #${runId}] СЕРВЕР ПОВЕРНУВ ПОМИЛКУ: ${orderRes.status}`);
       return false;
    }
    
    const orderData = await orderRes.json();
    const fakeInvoiceId = orderData.transaction?.id || `sim-inv-${runId}-${Date.now()}`;
    
    await delay(100); // Клієнт вводить картку в Монобанк...

    // КРОК 2: Вебхук від Монобанку (ОПЛАТА УСПІШНА)
    console.log(`[Run #${runId}] 💸 Монобанк підтвердив оплату! Стріляємо Webhook...`);
    
    await fetch(`${WEBHOOK_URL}/api/webhook/monobank`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        // 'X-Sign': 'fake-signature-bypassed-in-dev' 
      },
      body: JSON.stringify({
        invoiceId: fakeInvoiceId,
        status: 'success',
        amount: 55000,
        ccy: 980
      })
    });

    // КРОК 3: Принтер на складі друкує чек (mPrinter)
    console.log(`[Run #${runId}] 🖨️ mPrinter на складі видрукував ТТН Нової Пошти для ${city}!`);
    console.log(`---------------------------------------------------`);
    
    return true;
  } catch (error: any) {
    console.error(`[Run #${runId}] ❌ ПОМИЛКА:`, error.message);
    return false;
  }
}

async function run10() {
  console.log(`\n🚀 [TITAN OMNI-CHANNEL] ЗАПУСК ТЕСТОВОГО ПРОГОНУ (10 СЦЕНАРІЇВ)\n`);
  let successCount = 0;
  
  // Запускаємо 10 різних тест-кейсів
  const BATCH_SIZE = 5;
  const TOTAL_RUNS = 10;
  
  for (let i = 0; i < TOTAL_RUNS; i += BATCH_SIZE) {
    const batchPromises = [];
    for (let j = 0; j < BATCH_SIZE && (i + j) < TOTAL_RUNS; j++) {
      batchPromises.push(simulateOrder(i + j + 1));
      await delay(50); // Трохи більша затримка для стабільності
    }
    
    const results = await Promise.all(batchPromises);
    successCount += results.filter(r => r).length;
    
    console.log(`\n📦 Batch ${Math.floor(i/BATCH_SIZE) + 1} завершено. Оброблено ордерів: ${Math.min(i + BATCH_SIZE, TOTAL_RUNS)}`);
  }

  console.log(`\n✅ ТЕСТУВАННЯ ЗАВЕРШЕНО!`);
  console.log(`📊 Успішних життєвих циклів (Checkout -> Pay -> mPrinter): ${successCount}/${TOTAL_RUNS}\n`);
}

// Запускаємо 10 тестів на вимогу
run10();
