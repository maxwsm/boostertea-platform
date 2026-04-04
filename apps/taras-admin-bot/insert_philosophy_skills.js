const { PrismaClient } = require('./prisma/client');
const prisma = new PrismaClient();

async function addPhilosophySkills() {
  console.log("🧘 Додаємо категорію Практичної Філософії...");

  const cat = await prisma.skillCategory.upsert({
    where: { slug: "philosophy" },
    update: {},
    create: {
      name: "🧘 Practical Philosophy & Flow",
      icon: "🏛️",
      slug: "philosophy"
    }
  });

  const skills = [
    {
      categoryId: cat.id,
      name: "Practical Stoicism (OS)",
      slug: "practical-stoicism",
      description: "Фундамент спокою. Дихотомія контролю. Розуміння того, що 100% нашого страждання — це наша реакція на події, а не самі події.",
      tier: "master"
    },
    {
      categoryId: cat.id,
      name: "Meditation & Mind Clearing",
      slug: "meditation-clear-mind",
      description: "Здатність зупиняти 'білий шум'. Практики дихання (Box Breathing) та гіперфокусування.",
      tier: "master"
    }
  ];

  for (const s of skills) {
    await prisma.skill.upsert({
      where: { slug: s.slug },
      update: {},
      create: s
    });
  }

  // Resources
  const stoic = await prisma.skill.findFirst({ where: { slug: "practical-stoicism" } });
  if (stoic) {
    await prisma.resource.upsert({
      where: { id: "res-stoic-1" },
      update: {},
      create: {
        id: "res-stoic-1",
        name: "Марк Аврелій — Роздуми (Аудіокнига/Самарі)",
        type: "youtube",
        url: "https://www.youtube.com/watch?v=5897dMWJiSM",
        description: "Щоденник римського імператора. 100% практичний підхід до вирішення проблем без істерик.",
        targetRole: "all",
        priority: 10,
        skillId: stoic.id
      }
    });
  }

  const med = await prisma.skill.findFirst({ where: { slug: "meditation-clear-mind" } });
  if (med) {
    await prisma.resource.upsert({
      where: { id: "res-med-1" },
      update: {},
      create: {
        id: "res-med-1",
        name: "Box Breathing Technique (4-4-4-4)",
        type: "video",
        url: "https://www.youtube.com/watch?v=tEmt1Znux58",
        description: "Техніка дихання Navy SEALs для миттєвого заспокоєння адреналіну та відновлення виконавчих функцій мозку.",
        targetRole: "all",
        priority: 10,
        skillId: med.id
      }
    });
  }

  console.log("✅ Блок Філософії успішно інтегровано!");
}

addPhilosophySkills()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
