// sync_academy.js — Синхронізує SQLite/PG з Notion (Skill Map та Resources)
const https = require('https');
require('dotenv').config();
const { PrismaClient } = require('./prisma/client');

const prisma = new PrismaClient();
const NOTION_TOKEN = process.env.NOTION_TOKEN;
const ACADEMY_DB = process.env.NOTION_ACADEMY_DB;
const RESOURCE_DB = process.env.NOTION_RESOURCE_DB;

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

function delay(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

async function main() {
  console.log('🔄 Синхронізуємо Академію з Notion...\n');

  // ─── 1. SKILLS ────────────────────────────────────────────────────────
  const skills = await prisma.skill.findMany({ include: { category: true } });
  console.log(`📤 Вивантажуємо ${skills.length} скілів до Notion...`);
  
  for (const skill of skills) {
    await notionRequest('POST', '/v1/pages', {
      parent: { database_id: ACADEMY_DB },
      properties: {
        'Skill Name': { title: [{ text: { content: skill.name } }] },
        'Category': { select: { name: skill.category.name } },
        'Max Level': { number: skill.maxLevel },
        'Description': { rich_text: [{ text: { content: skill.description } }] },
        'Taras Level': { number: 0 },
        'Mykyta Level': { number: 0 },
        'Nazar Level': { number: 0 },
      }
    });
    await delay(350); // Ratelimit protection
  }
  console.log('✅ Skills вивантажено.');

  // ─── 2. RESOURCES ─────────────────────────────────────────────────────
  const resources = await prisma.resource.findMany({ include: { skill: true } });
  console.log(`\n📤 Вивантажуємо ${resources.length} ресурсів до Notion...`);

  for (const res of resources) {
    const relatedSkillName = res.skill?.name || '';
    const target = res.targetRole === 'all' ? 'All' : (res.targetRole === 'taras' ? 'Taras' : (res.targetRole === 'mykyta' ? 'Mykyta' : 'Nazar'));
    
    await notionRequest('POST', '/v1/pages', {
      parent: { database_id: RESOURCE_DB },
      properties: {
        'Title': { title: [{ text: { content: res.title } }] },
        'Type': { select: { name: res.type === 'video' ? 'YouTube Відео' : (res.type === 'link' ? 'Стаття/Мануал' : 'Книга') } },
        'Related Skill': { rich_text: [{ text: { content: relatedSkillName } }] },
        'Target Role': { select: { name: target } },
        'Link/URL': { url: res.url },
        'Priority': { number: res.priority },
      }
    });
    await delay(350); // Ratelimit protection
  }
  console.log('✅ Resources вивантажено.');

  console.log('\n🚀 ВСЕ СИНХРОНІЗОВАНО З ENTERPRISE NOTION!');
  process.exit(0);
}

main().catch(err => {
  console.error("❌ Sync error:", err);
});
