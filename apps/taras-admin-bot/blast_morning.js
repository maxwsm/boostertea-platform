require('dotenv').config();
const { Telegraf } = require('telegraf');
const { PrismaClient } = require('./prisma/client');
const prisma = new PrismaClient();
const { ROLES } = require('./lib/helpers');

const bot = new Telegraf(process.env.BOT_TOKEN);

async function blastTasks() {
  const s = await prisma.settings.findUnique({ where: { key: 'currentDay' } });
  let day = s ? parseInt(s.value) : 1;

  const users = await prisma.user.findMany({ where: { role: { in: ['taras', 'mykyta', 'nazar'] } } });
  
  for (const user of users) {
    const wakeupTask = await prisma.task.findFirst({ 
      where: { ownerId: user.telegramId, text: { contains: 'УЛЬТИМАТУМ' } } 
    });
    
    if (wakeupTask && !wakeupTask.done) {
      let msg = `☀️ *Доброго ранку, ${ROLES[user.role]}!*\n\n🔵 *ЄДИНА ВАША ЦІЛЬ ПРЯМО ЗАРАЗ:*\n`;
      msg += `1. ${wakeupTask.text}\n\n`;
      msg += `🎯 Питання щодо партнерства має бути закрите. Ніякої мультизадачності. Доки не вирішиш це питання — жодних інших кроків. Читати Whitepaper і писати "Погоджуюсь".`;
      
      try {
        await bot.telegram.sendMessage(user.telegramId, msg, { parse_mode: 'Markdown' });
        console.log(`✅ Ранковий пуш надіслано до ${user.role}`);
      } catch (e) {
         console.error(`❌ Помилка для ${user.role}:`, e.message);
      }
    }
  }
}

blastTasks().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
