import { PrismaClient } from '@prisma/client';
const db = new PrismaClient();

async function seed() {
  console.log('Seeding initial Kanban tasks...');
  try {
    await db.task.create({ data: { title: 'Оновити складські залишки DinoSlush', status: 'TODO', priority: 'HIGH' } });
    await db.task.create({ data: { title: 'Перевірити договори постачання (ТОВ ТайДрінк)', status: 'IN_PROGRESS', priority: 'URGENT' } });
    await db.task.create({ data: { title: 'Згенерувати пости для Instagram BoosterTea', status: 'REVIEW', priority: 'MEDIUM' } });
    await db.task.create({ data: { title: 'Оплатити податки ФОП (YouControl)', status: 'DONE', priority: 'HIGH' } });
    console.log('Tasks seeded successfully.');
  } catch (e) {
    console.error('Error seeding:', e);
  } finally {
    await db.$disconnect();
  }
}
seed();
