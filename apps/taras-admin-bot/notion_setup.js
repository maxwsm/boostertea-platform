// notion_setup.js — Створює весь BoosterTea workspace в Notion
// Використовує лише вбудований https (без npm)

const https = require('https');

const NOTION_TOKEN = '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';

function notionRequest(method, path, body) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const options = {
      hostname: 'api.notion.com',
      port: 443,
      path,
      method,
      headers: {
        'Authorization': `Bearer ${NOTION_TOKEN}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
        ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {}),
      },
    };

    const req = https.request(options, (res) => {
      let raw = '';
      res.on('data', chunk => raw += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(raw)); }
        catch(e) { reject(new Error('JSON parse error: ' + raw)); }
      });
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function main() {
  console.log('🔍 Шукаємо workspace...');

  // 1. Знайти доступні батьківські сторінки
  const search = await notionRequest('POST', '/v1/search', {
    filter: { value: 'page', property: 'object' },
    page_size: 5,
  });

  if (search.status === 401) {
    console.error('❌ Токен невалідний або не підключений до жодної сторінки.');
    console.log('👉 Зайди в Notion → будь-яку сторінку → ... → Connections → додай "BoosterTea Bot"');
    process.exit(1);
  }

  const pages = search.results || [];
  console.log(`\n📄 Знайдено ${pages.length} доступних сторінок:\n`);
  pages.forEach((p, i) => {
    const title = p.properties?.title?.title?.[0]?.plain_text
      || p.properties?.Name?.title?.[0]?.plain_text
      || '(без назви)';
    console.log(`  ${i + 1}. [${p.id}] ${title}`);
  });

  if (pages.length === 0) {
    console.log('\n⚠️  Інтеграція не підключена до жодної сторінки в Notion!');
    console.log('👉 Кроки:');
    console.log('   1. Відкрий будь-яку сторінку в Notion');
    console.log('   2. Натисни "..." зверху праворуч');
    console.log('   3. Connections → Connect to → "BoosterTea Bot"');
    console.log('   4. Запусти цей скрипт знову\n');
    process.exit(0);
  }

  // 2. Використати першу доступну сторінку як батьківську
  const parentId = pages[0].id;
  const parentTitle = pages[0].properties?.title?.title?.[0]?.plain_text
    || pages[0].properties?.Name?.title?.[0]?.plain_text
    || '(без назви)';

  console.log(`\n🏠 Будуємо BoosterTea HQ всередині: "${parentTitle}"`);

  // 3. Створити головну Hub сторінку
  const hub = await notionRequest('POST', '/v1/pages', {
    parent: { page_id: parentId },
    icon: { type: 'emoji', emoji: '🍵' },
    cover: { type: 'external', external: { url: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200' } },
    properties: {
      title: { title: [{ text: { content: '🏠 BoosterTea HQ' } }] }
    },
    children: [
      {
        object: 'block',
        type: 'callout',
        callout: {
          rich_text: [{ type: 'text', text: { content: 'Головний штаб BoosterTea. Дедлайн щодня: 16:00. Виняток — смерть. В усіх інших випадках 5 задач або смерть 😤🔥' } }],
          icon: { type: 'emoji', emoji: '⚡' },
          color: 'orange_background',
        }
      },
      { object: 'block', type: 'divider', divider: {} },
      { object: 'block', type: 'heading_2', heading_2: { rich_text: [{ text: { content: '📊 Бази даних команди' } }] } },
    ]
  });

  if (hub.object === 'error') {
    console.error('❌ Помилка створення Hub:', hub.message);
    process.exit(1);
  }

  const hubId = hub.id;
  console.log(`✅ BoosterTea HQ створено: ${hub.url}`);

  // ─── SPRINT BOARD ───────────────────────────────────────────────────
  console.log('\n📋 Створюємо Sprint Board...');
  const sprintDB = await notionRequest('POST', '/v1/databases', {
    parent: { page_id: hubId },
    icon: { type: 'emoji', emoji: '🗓️' },
    title: [{ type: 'text', text: { content: '🗓️ 14-Day Sprint Board' } }],
    properties: {
      'Task Name': { title: {} },
      'Owner': { select: { options: [
        { name: 'Тарас', color: 'blue' },
        { name: 'Микита', color: 'green' },
        { name: 'Назар', color: 'purple' },
      ]}},
      'Day': { number: { format: 'number' } },
      'Status': { status: { options: [
        { name: 'To Do', color: 'gray' },
        { name: 'In Progress', color: 'yellow' },
        { name: 'Done', color: 'green' },
        { name: 'Blocked', color: 'red' },
      ]}},
      'Block': { select: { options: [
        { name: 'Юридичне', color: 'red' },
        { name: 'Виробництво', color: 'orange' },
        { name: 'Контент', color: 'purple' },
        { name: 'Логістика', color: 'blue' },
        { name: 'Брендинг', color: 'pink' },
        { name: 'B2B', color: 'green' },
        { name: 'Реклама', color: 'yellow' },
        { name: 'Інфлюєнсери', color: 'brown' },
        { name: 'Інфраструктура', color: 'gray' },
      ]}},
      'Proof': { files: {} },
      'Done At': { date: {} },
      'Deadline': { date: {} },
      'Bot Synced': { checkbox: {} },
      'Notes': { rich_text: {} },
    }
  });

  if (sprintDB.object === 'error') {
    console.error('❌ Sprint Board:', sprintDB.message);
  } else {
    console.log(`✅ Sprint Board: ${sprintDB.url}`);
    console.log(`   DB ID: ${sprintDB.id}`);
  }

  // ─── TEAM HUB ───────────────────────────────────────────────────────
  console.log('\n👥 Створюємо Team Hub...');
  const teamDB = await notionRequest('POST', '/v1/databases', {
    parent: { page_id: hubId },
    icon: { type: 'emoji', emoji: '👥' },
    title: [{ type: 'text', text: { content: '👥 Team Hub' } }],
    properties: {
      'Name': { title: {} },
      'Role': { select: { options: [
        { name: 'Інфраструктура', color: 'blue' },
        { name: 'Операції', color: 'green' },
        { name: 'Продакшн', color: 'purple' },
      ]}},
      'Telegram ID': { number: {} },
      'Telegram Username': { rich_text: {} },
      'Email': { email: {} },
      'Phone': { phone_number: {} },
      'Responsibilities': { rich_text: {} },
      'Current Focus': { rich_text: {} },
    }
  });

  if (teamDB.object === 'error') {
    console.error('❌ Team Hub:', teamDB.message);
  } else {
    console.log(`✅ Team Hub: ${teamDB.url}`);

    // Додати 3 учасників
    const members = [
      { name: 'Тарас', role: 'Інфраструктура', resp: 'WSM 13, Telegram-бот, CRM, реклама, Notion' },
      { name: 'Микита', role: 'Операції', resp: 'Креатив, операційка, дизайн, пакування, логістика' },
      { name: 'Назар', role: 'Продакшн', resp: 'Технолог, амбасадор, фото/відео продакшн, рецептури' },
      { name: 'Євген Кубеко', role: 'Операції', resp: 'Партнер, власник Пангурма, сировина, виробництво' },
      { name: 'Сергій', role: 'Інфраструктура', resp: 'Партнер, фінансист, контроль бюджету' },
      { name: 'Любомир', role: 'Інфраструктура', resp: 'Партнер, юрист, договори, ТМ, сертифікація' },
    ];

    for (const m of members) {
      await notionRequest('POST', '/v1/pages', {
        parent: { database_id: teamDB.id },
        properties: {
          'Name': { title: [{ text: { content: m.name } }] },
          'Role': { select: { name: m.role } },
          'Responsibilities': { rich_text: [{ text: { content: m.resp } }] },
        }
      });
    }
    console.log('   ✅ Додано: Тарас, Микита, Назар');
  }

  // ─── OPERATIONS CENTER ──────────────────────────────────────────────
  console.log('\n📦 Створюємо Operations Center...');
  const opsDB = await notionRequest('POST', '/v1/databases', {
    parent: { page_id: hubId },
    icon: { type: 'emoji', emoji: '📦' },
    title: [{ type: 'text', text: { content: '📦 Operations Center' } }],
    properties: {
      'Contact Name': { title: {} },
      'Type': { select: { options: [
        { name: 'Постачальник', color: 'blue' },
        { name: 'Виробник', color: 'orange' },
        { name: 'Підрядник', color: 'green' },
        { name: 'Партнер', color: 'purple' },
      ]}},
      'Area': { select: { options: [
        { name: 'Сировина', color: 'green' },
        { name: 'Тара', color: 'blue' },
        { name: 'Пакування', color: 'orange' },
        { name: 'Поліграфія', color: 'pink' },
        { name: 'Логістика', color: 'yellow' },
        { name: 'Обладнання', color: 'gray' },
        { name: 'Мерч', color: 'purple' },
      ]}},
      'Status': { select: { options: [
        { name: 'Новий', color: 'gray' },
        { name: 'В роботі', color: 'yellow' },
        { name: 'Узгоджено', color: 'green' },
        { name: 'Відмова', color: 'red' },
      ]}},
      'Phone': { phone_number: {} },
      'Next Action': { rich_text: {} },
      'Next Action Date': { date: {} },
      'Notes': { rich_text: {} },
    }
  });

  if (opsDB.object === 'error') {
    console.error('❌ Operations:', opsDB.message);
  } else {
    console.log(`✅ Operations: ${opsDB.url}`);

    const contacts = [
      { name: 'Євген (Сировина)', type: 'Постачальник', area: 'Сировина', note: 'Підтвердити об\'єми та дати доставки' },
      { name: 'Виробництво Київ (Стіки)', type: 'Виробник', area: 'Пакування', note: 'Переговори по потужностях для пакування стіків' },
      { name: 'Виробник двогорлової тари', type: 'Виробник', area: 'Тара', note: '0.33 темна пляшка - запросити КП' },
      { name: 'Підрядник пакування стіків', type: 'Підрядник', area: 'Пакування', note: 'ТЗ готове, обговорити умови та дати' },
      { name: 'Постачальник плівки для стіків', type: 'Постачальник', area: 'Пакування', note: 'Зібрати 3+ КП та ціни' },
      { name: 'Логістичні коробки', type: 'Підрядник', area: 'Логістика', note: '1л-12шт / 250мл-24шт / стіки-12пачок' },
      { name: 'Поліграфія (скотч, пакети)', type: 'Підрядник', area: 'Поліграфія', note: 'Брендований скотч + пакети BoosterTea' },
      { name: 'Термоси та термокружки', type: 'Постачальник', area: 'Мерч', note: 'Мінімальний тираж + ціна брендування' },
      { name: 'Виробник кліше для штампів', type: 'Підрядник', area: 'Поліграфія', note: 'Лого на коробки для пришвидшення брендування' },
      { name: 'Виробник сатураційного блоку', type: 'Виробник', area: 'Обладнання', note: 'Адаптація під газовані чаї 0.33л темна пляшка' },
    ];

    for (const c of contacts) {
      await notionRequest('POST', '/v1/pages', {
        parent: { database_id: opsDB.id },
        properties: {
          'Contact Name': { title: [{ text: { content: c.name } }] },
          'Type': { select: { name: c.type } },
          'Area': { select: { name: c.area } },
          'Status': { select: { name: 'Новий' } },
          'Notes': { rich_text: [{ text: { content: c.note } }] },
        }
      });
    }
    console.log(`   ✅ Додано ${contacts.length} контактів`);
  }

  // ─── LEGAL ──────────────────────────────────────────────────────────
  console.log('\n⚖️  Створюємо Legal & Compliance...');
  const legalDB = await notionRequest('POST', '/v1/databases', {
    parent: { page_id: hubId },
    icon: { type: 'emoji', emoji: '⚖️' },
    title: [{ type: 'text', text: { content: '⚖️ Legal & Compliance' } }],
    properties: {
      'Item': { title: {} },
      'Type': { select: { options: [
        { name: 'ТМ', color: 'red' },
        { name: 'Сертифікат', color: 'orange' },
        { name: 'Штрих-код', color: 'blue' },
        { name: 'Документ', color: 'gray' },
        { name: 'Оренда', color: 'green' },
        { name: 'Юрпослуга', color: 'purple' },
      ]}},
      'Status': { select: { options: [
        { name: 'Не розпочато', color: 'gray' },
        { name: 'В процесі', color: 'yellow' },
        { name: 'Подано', color: 'blue' },
        { name: '✅ Отримано', color: 'green' },
      ]}},
      'Deadline': { date: {} },
      'Notes': { rich_text: {} },
    }
  });

  if (legalDB.object === 'error') {
    console.error('❌ Legal:', legalDB.message);
  } else {
    console.log(`✅ Legal: ${legalDB.url}`);
    const legalItems = [
      { item: 'Реєстрація ТМ BoosterTea', type: 'ТМ' },
      { item: 'Сертифікація Shot 30ml', type: 'Сертифікат' },
      { item: 'Сертифікація стіків', type: 'Сертифікат' },
      { item: 'Сертифікація газованих чаїв 0.33л', type: 'Сертифікат' },
      { item: 'Реєстрація штрих-кодів GS1 Ukraine', type: 'Штрих-код' },
      { item: 'Стандартні накладні та документи', type: 'Документ' },
      { item: 'Оренда Городоцька 242', type: 'Оренда' },
      { item: 'Лабораторні тести (зразки)', type: 'Сертифікат' },
    ];
    for (const l of legalItems) {
      await notionRequest('POST', '/v1/pages', {
        parent: { database_id: legalDB.id },
        properties: {
          'Item': { title: [{ text: { content: l.item } }] },
          'Type': { select: { name: l.type } },
          'Status': { select: { name: 'Не розпочато' } },
        }
      });
    }
    console.log(`   ✅ Додано ${legalItems.length} юридичних пунктів`);
  }

  // ─── CONTENT FACTORY ────────────────────────────────────────────────
  console.log('\n🎬 Створюємо Content Factory...');
  const contentDB = await notionRequest('POST', '/v1/databases', {
    parent: { page_id: hubId },
    icon: { type: 'emoji', emoji: '🎬' },
    title: [{ type: 'text', text: { content: '🎬 Content Factory' } }],
    properties: {
      'Title': { title: {} },
      'Type': { select: { options: [
        { name: 'Відео', color: 'purple' },
        { name: 'Фото', color: 'blue' },
        { name: 'Reels', color: 'pink' },
        { name: 'Сторіс', color: 'yellow' },
        { name: 'TikTok', color: 'orange' },
      ]}},
      'Category': { select: { options: [
        { name: 'Руйнівник Міфів', color: 'red' },
        { name: 'Лайфстайл', color: 'green' },
        { name: 'Продукт', color: 'blue' },
        { name: 'Відгук', color: 'yellow' },
        { name: 'B-roll', color: 'gray' },
        { name: 'Behind the scenes', color: 'orange' },
      ]}},
      'Format': { select: { options: [
        { name: '9:16', color: 'purple' },
        { name: '4:5', color: 'blue' },
        { name: '1:1', color: 'green' },
        { name: '16:9', color: 'gray' },
      ]}},
      'Duration': { select: { options: [
        { name: 'до 15с', color: 'green' },
        { name: 'до 30с', color: 'yellow' },
        { name: 'до 60с', color: 'orange' },
        { name: '1-3хв', color: 'red' },
      ]}},
      'Status': { select: { options: [
        { name: 'Ідея', color: 'gray' },
        { name: 'ТЗ готове', color: 'blue' },
        { name: 'В зйомці', color: 'yellow' },
        { name: 'Монтаж', color: 'orange' },
        { name: 'Готово', color: 'green' },
        { name: 'Опубліковано', color: 'purple' },
      ]}},
      'Episode #': { number: {} },
      'Hook': { rich_text: {} },
      'Drive Link': { url: {} },
      'Published URL': { url: {} },
    }
  });

  if (contentDB.object === 'error') {
    console.error('❌ Content Factory:', contentDB.message);
  } else {
    console.log(`✅ Content Factory: ${contentDB.url}`);
    const myths = [
      { ep: 1, title: 'Руйнівник Міфів #1 — "В пакетиках пил з доріг"', hook: 'Відкриваємо пакетик мас-маркету і пакетик якісного — різниця очевидна' },
      { ep: 2, title: 'Руйнівник Міфів #2 — "Темний чай = міцніший"', hook: 'Це брехня. Показую чому колір не дорівнює міцності' },
      { ep: 3, title: 'Руйнівник Міфів #3 — "Зелений чай без кофеїну"', hook: 'Зелений чай містить більше кофеїну ніж ти думаєш' },
      { ep: 4, title: 'Руйнівник Міфів #4 — "Окріп — це ок"', hook: '100°C вбиває смак. Показую що відбувається з чаєм' },
      { ep: 5, title: 'Руйнівник Міфів #5 — "Енергетик покращує фокус"', hook: '1 год енергетик vs 4 год бустер-чай — є різниця' },
      { ep: 6, title: 'Руйнівник Міфів #6 — "Чай заспокоює, треба перед сном"', hook: 'L-теанін vs кофеїн — пояснюю механізм' },
      { ep: 7, title: 'Руйнівник Міфів #7 — "Пакетик = листовий чай"', hook: 'Що реально всередині дешевого пакетика' },
      { ep: 8, title: 'Руйнівник Міфів #8 — "Чорний чай шкідливий"', hook: 'Антиоксиданти у чорному чаї > кава. Факти' },
      { ep: 9, title: 'Руйнівник Міфів #9 — "Настоювати довше = краще"', hook: 'Танін і гіркота — показую оптимальний час' },
      { ep: 10, title: 'Руйнівник Міфів #10 — "Чай не для схуднення"', hook: '5 наукових фактів про метаболізм і чай' },
      { ep: 11, title: 'Руйнівник Міфів #11 — "Дорогий чай = якісний"', hook: 'Дорогий маркетинг vs реальна якість листу' },
      { ep: 12, title: 'Руйнівник Міфів #12 — "Зберігати в холодильнику"', hook: 'Чому холодильник вбиває чай — правила зберігання' },
      { ep: 13, title: 'Руйнівник Міфів #13 — "Молоко нейтралізує чай"', hook: 'Дослідження: що відбувається з антиоксидантами' },
      { ep: 14, title: 'Руйнівник Міфів #14 — "Чай зневоднює"', hook: 'Кофеїн і гідратація — пояснюю різницю' },
      { ep: 15, title: 'Руйнівник Міфів #15 — "Всі чаї однакові"', hook: 'Від маси до BoosterTea — фінальне порівняння' },
    ];
    for (const m of myths) {
      await notionRequest('POST', '/v1/pages', {
        parent: { database_id: contentDB.id },
        properties: {
          'Title': { title: [{ text: { content: m.title } }] },
          'Type': { select: { name: 'Відео' } },
          'Category': { select: { name: 'Руйнівник Міфів' } },
          'Format': { select: { name: '9:16' } },
          'Duration': { select: { name: 'до 30с' } },
          'Status': { select: { name: 'Ідея' } },
          'Episode #': { number: m.ep },
          'Hook': { rich_text: [{ text: { content: m.hook } }] },
        }
      });
    }
    console.log(`   ✅ Додано 15 Руйнівників Міфів`);
  }

  // ─── INFLUENCER HUB ─────────────────────────────────────────────────
  console.log('\n🤝 Створюємо Influencer Hub...');
  const influencerDB = await notionRequest('POST', '/v1/databases', {
    parent: { page_id: hubId },
    icon: { type: 'emoji', emoji: '🤝' },
    title: [{ type: 'text', text: { content: '🤝 Influencer Hub' } }],
    properties: {
      'Name': { title: {} },
      'Platform': { multi_select: { options: [
        { name: 'Instagram', color: 'pink' },
        { name: 'TikTok', color: 'purple' },
        { name: 'Telegram', color: 'blue' },
        { name: 'YouTube', color: 'red' },
      ]}},
      'Niche': { select: { options: [
        { name: 'Здоров\'я', color: 'green' },
        { name: 'Спорт', color: 'orange' },
        { name: 'Lifestyle', color: 'pink' },
        { name: 'Їжа', color: 'yellow' },
        { name: 'Краса', color: 'purple' },
      ]}},
      'Followers': { number: {} },
      'Username': { rich_text: {} },
      'Status': { select: { options: [
        { name: 'Новий', color: 'gray' },
        { name: 'Надіслано', color: 'blue' },
        { name: 'Відповів', color: 'yellow' },
        { name: 'Погодився', color: 'orange' },
        { name: 'Отримав бокс', color: 'purple' },
        { name: '✅ Опублікував', color: 'green' },
        { name: 'Відмова', color: 'red' },
      ]}},
      'ТЗ Type': { select: { options: [
        { name: 'Фото 4:5', color: 'blue' },
        { name: 'Відео 9:16 до 15с', color: 'purple' },
        { name: 'Відео 9:16 до 30с', color: 'orange' },
        { name: 'Сторіс', color: 'pink' },
      ]}},
      'Box Sent': { checkbox: {} },
      'Post URL': { url: {} },
      'Reach': { number: {} },
      'Notes': { rich_text: {} },
    }
  });

  if (influencerDB.object === 'error') {
    console.error('❌ Influencers:', influencerDB.message);
  } else {
    console.log(`✅ Influencer Hub: ${influencerDB.url}`);
  }

  // ─── B2B PIPELINE ───────────────────────────────────────────────────
  console.log('\n💼 Створюємо B2B Pipeline...');
  const b2bDB = await notionRequest('POST', '/v1/databases', {
    parent: { page_id: hubId },
    icon: { type: 'emoji', emoji: '💼' },
    title: [{ type: 'text', text: { content: '💼 B2B Pipeline' } }],
    properties: {
      'Company': { title: {} },
      'Type': { select: { options: [
        { name: 'Кафе', color: 'orange' },
        { name: 'Бар', color: 'purple' },
        { name: 'Ресторан', color: 'red' },
        { name: 'HoReCa', color: 'blue' },
        { name: 'Ретейл', color: 'green' },
      ]}},
      'City': { select: { options: [
        { name: 'Львів', color: 'blue' },
        { name: 'Київ', color: 'green' },
        { name: 'Харків', color: 'orange' },
        { name: 'Інше', color: 'gray' },
      ]}},
      'Status': { select: { options: [
        { name: 'Лід', color: 'gray' },
        { name: 'Контакт', color: 'blue' },
        { name: 'Зустріч', color: 'yellow' },
        { name: 'Пробна партія', color: 'orange' },
        { name: '✅ Договір', color: 'green' },
        { name: 'Відмова', color: 'red' },
      ]}},
      'Contact Person': { rich_text: {} },
      'Phone': { phone_number: {} },
      'Next Step': { rich_text: {} },
      'Next Date': { date: {} },
      'Product Sent': { checkbox: {} },
      'Monthly Volume': { number: {} },
      'Notes': { rich_text: {} },
    }
  });

  if (b2bDB.object === 'error') {
    console.error('❌ B2B Pipeline:', b2bDB.message);
  } else {
    console.log(`✅ B2B Pipeline: ${b2bDB.url}`);
  }

  // ─── BOT LOG ────────────────────────────────────────────────────────
  console.log('\n🤖 Створюємо Bot Log...');
  const logDB = await notionRequest('POST', '/v1/databases', {
    parent: { page_id: hubId },
    icon: { type: 'emoji', emoji: '🤖' },
    title: [{ type: 'text', text: { content: '🤖 Bot Log' } }],
    properties: {
      'Event': { title: {} },
      'Type': { select: { options: [
        { name: 'Task Done', color: 'green' },
        { name: 'Lead', color: 'blue' },
        { name: 'Daily Report', color: 'orange' },
        { name: 'Message', color: 'gray' },
        { name: 'Error', color: 'red' },
      ]}},
      'Day': { number: {} },
      'Member': { select: { options: [
        { name: 'Тарас', color: 'blue' },
        { name: 'Микита', color: 'green' },
        { name: 'Назар', color: 'purple' },
        { name: 'System', color: 'gray' },
      ]}},
      'Details': { rich_text: {} },
      'Timestamp': { date: {} },
    }
  });

  if (logDB.object === 'error') {
    console.error('❌ Bot Log:', logDB.message);
  } else {
    console.log(`✅ Bot Log: ${logDB.url}`);
  }

  // ─── SUMMARY ────────────────────────────────────────────────────────
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🚀 BoosterTea Notion Workspace готовий!\n');
  console.log('📌 ЗБЕРЕЖИ ЦІ DATABASE IDs для .env бота:\n');
  if (sprintDB.id)     console.log(`NOTION_TASKS_DB=${sprintDB.id}`);
  if (teamDB.id)       console.log(`NOTION_TEAM_DB=${teamDB.id}`);
  if (opsDB.id)        console.log(`NOTION_OPS_DB=${opsDB.id}`);
  if (legalDB.id)      console.log(`NOTION_LEGAL_DB=${legalDB.id}`);
  if (contentDB.id)    console.log(`NOTION_CONTENT_DB=${contentDB.id}`);
  if (influencerDB.id) console.log(`NOTION_INFLUENCER_DB=${influencerDB.id}`);
  if (b2bDB.id)        console.log(`NOTION_B2B_DB=${b2bDB.id}`);
  if (logDB.id)        console.log(`NOTION_LOG_DB=${logDB.id}`);
  console.log('\n🏠 Hub URL:', hub.url);
}

main().catch(e => {
  console.error('\n💥 Помилка:', e.message);
  process.exit(1);
});
