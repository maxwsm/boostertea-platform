const { PrismaClient } = require('./prisma/client');
const prisma = new PrismaClient();

async function addADHDSkills() {
  console.log("🧠 Додаємо категорію Neurodivergence...");

  // 1. Створюємо категорію (або знаходимо)
  const cat = await prisma.skillCategory.upsert({
    where: { slug: "neurodivergence" },
    update: {},
    create: {
      name: "🧠 Neurodivergence & Flow",
      icon: "⚡",
      slug: "neurodivergence"
    }
  });

  // 2. Створюємо скіли згідно з останніми дослідженнями ADHD
  const skills = [
    {
      categoryId: cat.id,
      name: "Dopamine-Driven Time Management",
      slug: "dopamine-time-management",
      description: "Розподіл часу через призму енергії та дофаміну, а не годин. Розуміння гіперфокусу і як його 'вимикати' та 'вмикати'.",
      tier: "master"
    },
    {
      categoryId: cat.id,
      name: "Guilt-Free Productivity",
      slug: "guilt-free-productivity",
      description: "За що себе НЕ ТРЕБА зайо*увати. Розуміння Executive Dysfunction (параліч рішень) та Time Blindness. Як не ламати себе, а адаптувати систему під свій мозок.",
      tier: "pro"
    },
    {
      categoryId: cat.id,
      name: "13WSM13 Protocol (ADHD Ops)",
      slug: "13wsm13-adhd-ops",
      description: "Архіважливо: як структурувати хаос. Розуміння, чому відмова від 9-to-5 і перехід на мікро-спринти (13 хв інтенсиву) є біологічною необхідністю для нас.",
      tier: "expert"
    }
  ];

  for (const s of skills) {
    await prisma.skill.upsert({
      where: { slug: s.slug },
      update: {},
      create: s
    });
  }

  // 3. Додаємо ресурси (Enterprise Resources)
  const skill2 = await prisma.skill.findFirst({ where: { name: "Guilt-Free Productivity" } });
  
    await prisma.resource.create({
      data: {
        name: "Russell Barkley - Essential Ideas for Parents (and adults) with ADHD",
        type: "youtube",
        url: "https://www.youtube.com/watch?v=SCAB9qA5D54",
        description: "Фундаментальна лекція про те, як працює СДУГ і чому це не проблема знань, а проблема виконання (Performance disorder).",
        targetRole: "all",
        priority: 10,
        skillId: skill2.id
      }
    });

    await prisma.resource.create({
      data: {
        name: "How to ADHD - The Wall of Awful",
        type: "youtube",
        url: "https://www.youtube.com/watch?v=Uo08uS904Rg",
        description: "Чому ми іноді не можемо почати робити просту річ (Executive Dysfunction) і як розбити цю Стіну.",
        targetRole: "all",
        priority: 9,
        skillId: skill2.id
      }
    });

  console.log("✅ Блок Neurodivergence успішно інтегровано в Систему.");
}

addADHDSkills()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
