// notion_training_setup.js — Будує бази для Assessment (Опитування) та Навчальних Модулів
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
  console.log('🔍 Шукаємо BoosterTea HQ для Опитувальників та Модулів...');

  const search = await notionRequest('POST', '/v1/search', {
    filter: { value: 'page', property: 'object' },
    page_size: 10,
  });

  const hqPage = search.results?.find(p => 
    p.properties?.title?.title?.[0]?.plain_text?.includes('BoosterTea HQ')
  ) || search.results?.[0];

  if (!hqPage) {
    console.error('❌ HQ не знайдено.');
    process.exit(1);
  }

  const parentId = hqPage.id;
  console.log(`🏠 Використовуємо HQ: ${parentId}`);

  // ─── ASSESSMENTS TRACKING DB ──────────────────────────────────────────
  console.log('\n🧠 Створюємо Assessment Results DB...');
  const assessDB = await notionRequest('POST', '/v1/databases', {
    parent: { page_id: parentId },
    icon: { type: 'emoji', emoji: '📝' },
    title: [{ type: 'text', text: { content: '📝 Skill Assessments Tracking' } }],
    properties: {
      'ID': { title: {} },
      'User': { select: { options: [
        { name: 'Taras', color: 'blue' },
        { name: 'Mykyta', color: 'green' },
        { name: 'Nazar', color: 'purple' },
        { name: 'Maks', color: 'red' }
      ]}},
      'Skill Name': { rich_text: {} },
      'Score (%)': { number: { format: 'percent' } },
      'Status': { select: { options: [
        { name: 'Beginner (0-30%)', color: 'gray' },
        { name: 'Intermediate (31-70%)', color: 'yellow' },
        { name: 'Pro (71-100%)', color: 'green' }
      ]}},
      'Latest Test Date': { date: {} },
      'Required Actions': { rich_text: {} }
    }
  });

  if (assessDB.object === 'error') {
    console.error('❌ Assessment DB Error:', assessDB.message);
  } else {
    console.log(`✅ Assessment DB створено! ID: ${assessDB.id}`);
  }

  // ─── TRAINING MODULES DB ──────────────────────────────────────────────
  console.log('\n📖 Створюємо Training Modules DB...');
  const moduleDB = await notionRequest('POST', '/v1/databases', {
    parent: { page_id: parentId },
    icon: { type: 'emoji', emoji: '🎓' },
    title: [{ type: 'text', text: { content: '🎓 Training Modules & Resources' } }],
    properties: {
      'Module Name': { title: {} },
      'Target Skill': { rich_text: {} },
      'Format': { select: { options: [
        { name: 'Книга', color: 'brown' },
        { name: 'YouTube Відео', color: 'red' },
        { name: 'Стаття / Мануал', color: 'blue' },
        { name: 'Quiz / Test', color: 'purple' },
        { name: 'Practical Task', color: 'green' }
      ]}},
      'Difficulty Level': { select: { options: [
        { name: 'Base', color: 'green' },
        { name: 'Mid', color: 'yellow' },
        { name: 'Pro', color: 'red' }
      ]}},
      'Target Role': { multi_select: { options: [
        { name: 'Taras', color: 'blue' },
        { name: 'Mykyta', color: 'green' },
        { name: 'Nazar', color: 'purple' },
        { name: 'All', color: 'gray' }
      ]}},
      'URL/Link': { url: {} },
      'Required XP Reward': { number: { format: 'number' } },
      'Actual Dataset Sync': { checkbox: {} }
    }
  });

  if (moduleDB.object === 'error') {
    console.error('❌ Training Modules DB Error:', moduleDB.message);
  } else {
    console.log(`✅ Training Modules DB створено! ID: ${moduleDB.id}`);
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  if (assessDB.id) console.log(`NOTION_ASSESSMENT_DB=${assessDB.id}`);
  if (moduleDB.id) console.log(`NOTION_TRAINING_DB=${moduleDB.id}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Порада: Додай ці ID до .env файлу.');
}

main();
