require('dotenv').config();
const { PrismaClient } = require('./prisma/client');
const prisma = new PrismaClient();

async function assignMorningStrike() {
  const s = await prisma.settings.findUnique({ where: { key: 'currentDay' } });
  let day = s ? parseInt(s.value) : 1;

  const users = await prisma.user.findMany({ where: { role: { not: 'maks' } } });
  
  for (const user of users) {
    const exist = await prisma.task.findFirst({ where: { ownerId: user.telegramId, text: { contains: 'УЛЬТИМАТУМ' } } });
    if (!exist) {
      await prisma.task.create({
        data: {
          text: '🚨 ПАРТНЕРСЬКИЙ УЛЬТИМАТУМ: Прочитати правила (Whitepaper), оцінити своє місце та надіслати "Погоджуюсь" + скріншот в бот.',
          day: day, 
          ownerId: user.telegramId,
          type: 'primary'
        }
      });
      console.log(`✅ Задача призначена для ${user.role}`);
    } else {
      console.log(`Задача вже існує для ${user.role}`);
    }
  }
}

assignMorningStrike().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
