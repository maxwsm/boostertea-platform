const { PrismaClient } = require('./prisma/client');
const prisma = new PrismaClient();

async function run() {
  const users = [
    { telegramId: '530631573', role: 'mykyta', name: 'Микита' },
    { telegramId: '8009046558', role: 'taras', name: 'Тарас' },
    { telegramId: '442594779', role: 'nazar', name: 'Назар' },
    { telegramId: '8374356466', role: 'maks', name: 'Макс' }
  ];

  for(const u of users) {
    await prisma.user.upsert({
      where: { telegramId: u.telegramId },
      update: { role: u.role, name: u.name },
      create: u
    });
  }
  console.log('✅ IDs updated successfully.');
}
run().then(() => process.exit(0)).catch(e => console.error(e));
