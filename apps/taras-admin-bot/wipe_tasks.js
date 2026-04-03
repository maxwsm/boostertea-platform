const https = require('https');
require('dotenv').config();

const NOTION_TOKEN = process.env.NOTION_TOKEN;
const DB_ID = process.env.NOTION_TASKS_DB;

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

async function wipe() {
  console.log('🗑 Видалення старих задач...');
  const res = await notionRequest('POST', `/v1/databases/${DB_ID}/query`);
  if (res.results) {
    console.log(`Знайдено ${res.results.length} задач для видалення.`);
    for (const page of res.results) {
      await notionRequest('PATCH', `/v1/pages/${page.id}`, { archived: true });
    }
  }
  console.log('✅ Всі попередні задачі архівовані.');
}
wipe();
