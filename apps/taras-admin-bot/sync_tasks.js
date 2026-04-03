require('dotenv').config();
const { Client } = require('@notionhq/client');
const { TASKS } = require('./tasks14days.js');

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const DB_ID = process.env.NOTION_TASKS_DB;

const TEAM_MAP = {
  'taras': 'Тарас',
  'mykyta': 'Микита',
  'nazar': 'Назар'
};

async function syncTasks() {
  console.log('🔄 Починаємо синхронізацію задач (70 шт)...');
  
  for (let day = 1; day <= 14; day++) {
    const dayData = TASKS[day];
    if (!dayData) continue;
    
    console.log(`\n📅 День ${day}: ${dayData.theme}`);
    
    for (const task of dayData.tasks) {
      try {
        await notion.pages.create({
          parent: { database_id: DB_ID },
          properties: {
            'Task Name': {
              title: [
                { text: { content: task.text } }
              ]
            },
            'Owner': {
              select: { name: TEAM_MAP[task.owner] }
            },
            'Day': {
              number: day
            },
            'Status': {
              status: { name: 'To Do' }
            },
            'Block': {
              select: { name: dayData.theme.split('—')[1]?.trim() || 'General' }
            }
          }
        });
        console.log(`  ✅ [${TEAM_MAP[task.owner]}] ${task.text.substring(0, 40)}...`);
      } catch (err) {
        console.log(`  ❌ Помилка: ${err.message}`);
      }
    }
  }
  
  console.log('\n🎉 Синхронізація завершена успішно!');
}

syncTasks();
