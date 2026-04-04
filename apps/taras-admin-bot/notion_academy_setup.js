// notion_academy_setup.js — Будує бази Skill Academy в Notion
const https = require('https');
require('dotenv').config();

const NOTION_TOKEN = process.env.NOTION_TOKEN;

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
  console.log('🔍 Шукаємо BoosterTea HQ...');

  // Знайти HQ базу або сторінку (Team Hub або іншу)
  const search = await notionRequest('POST', '/v1/search', {
    filter: { value: 'page', property: 'object' },
    page_size: 10,
  });

  const hqPage = search.results?.find(p => 
    p.properties?.title?.title?.[0]?.plain_text?.includes('BoosterTea HQ')
  ) || search.results?.[0]; // Fallback to first page

  if (!hqPage) {
    console.error('❌ HQ не знайдено.');
    process.exit(1);
  }

  const parentId = hqPage.id;
  console.log(`🏠 Використовуємо HQ: ${parentId}`);

  // ─── SKILL MAP DB ───────────────────────────────────────────────────
  console.log('\n📚 Створюємо Skill Map DB...');
  const skillDB = await notionRequest('POST', '/v1/databases', {
    parent: { page_id: parentId },
    icon: { type: 'emoji', emoji: '🧠' },
    title: [{ type: 'text', text: { content: '🧠 Skill Academy Map' } }],
    properties: {
      'Skill Name': { title: {} },
      'Category': { select: { options: [
        { name: '🤖 AI & Prompt Engineering', color: 'blue' },
        { name: '💻 Full-Stack Web Dev', color: 'green' },
        { name: '📊 Digital Marketing', color: 'orange' },
        { name: '🧠 Neuromarketing & Psychology', color: 'purple' },
        { name: '🧪 Mixology & Product R&D', color: 'pink' },
        { name: '🏗️ Business Architecture', color: 'gray' },
        { name: '💰 Financial Modeling', color: 'yellow' },
        { name: '🗣️ Negotiation & Communication', color: 'brown' },
        { name: '⚖️ Legal & Compliance', color: 'default' },
        { name: '👥 Team Psychology', color: 'blue' },
        { name: '🔗 Web3 & Tokenomics', color: 'purple' },
        { name: '🎨 Design Thinking', color: 'red' },
      ]}},
      'Max Level': { number: { format: 'number' } },
      'Description': { rich_text: {} },
      'Taras Level': { number: { format: 'percent' } },
      'Mykyta Level': { number: { format: 'percent' } },
      'Nazar Level': { number: { format: 'percent' } },
    }
  });

  if (skillDB.object === 'error') {
    console.error('❌ Skill Map Error:', skillDB.message);
  } else {
    console.log(`✅ Skill Map створено! ID: ${skillDB.id}`);
  }

  // ─── RESOURCES HUB DB ────────────────────────────────────────────────
  console.log('\n📖 Створюємо Enterprise Resource Library...');
  const resourceDB = await notionRequest('POST', '/v1/databases', {
    parent: { page_id: parentId },
    icon: { type: 'emoji', emoji: '📚' },
    title: [{ type: 'text', text: { content: '📚 Enterprise Resources' } }],
    properties: {
      'Title': { title: {} },
      'Type': { select: { options: [
        { name: 'Книга', color: 'brown' },
        { name: 'YouTube Відео', color: 'red' },
        { name: 'Стаття/Мануал', color: 'blue' },
        { name: 'Софт/Скрипт', color: 'green' },
        { name: 'Курс', color: 'purple' },
      ]}},
      'Related Skill': { rich_text: {} },
      'Target Role': { select: { options: [
        { name: 'All', color: 'gray' },
        { name: 'Taras', color: 'blue' },
        { name: 'Mykyta', color: 'green' },
        { name: 'Nazar', color: 'purple' },
      ]}},
      'Link/URL': { url: {} },
      'Priority': { number: { format: 'number' } },
    }
  });

  if (resourceDB.object === 'error') {
    console.error('❌ Resource Hub Error:', resourceDB.message);
  } else {
    console.log(`✅ Resource Hub створено! ID: ${resourceDB.id}`);
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  if (skillDB.id) console.log(`NOTION_ACADEMY_DB=${skillDB.id}`);
  if (resourceDB.id) console.log(`NOTION_RESOURCE_DB=${resourceDB.id}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

main();
