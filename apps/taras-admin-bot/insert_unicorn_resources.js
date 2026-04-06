const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const adminId = process.env.ADMIN_ID || '8009046558';

  const newResources = [
    {
      name: "Sam Altman: How to Succeed with a Startup",
      type: "youtube",
      url: "https://youtu.be/0lJKucu6HoQ",
      description: "Фундаментальна лекція CEO OpenAI про те, як будувати мільярдні компанії. Обов'язкова база.",
      targetRole: "all",
      priority: 10
    },
    {
      name: "Naval Ravikant - How to Get Rich (without getting lucky)",
      type: "youtube",
      url: "https://youtu.be/1-TZqOsVCNM",
      description: "Концепція Важелів (Leverage), Специфічних знань та сили Капіталу/Коду.",
      targetRole: "all",
      priority: 9
    },
    {
      name: "Huberman Lab: Master Your Sleep & Focus",
      type: "youtube",
      url: "https://youtu.be/h2aWYjSA1Jc",
      description: "Нейробіологія сну та фокусу. Як оптимізувати своє тіло для 14-годинних спринтів без вигорання.",
      targetRole: "all",
      priority: 8
    },
    {
      name: "a16z: Understanding SaaS Metrics (LTV, CAC, Churn)",
      type: "article",
      url: "https://a16z.com/16-startup-metrics/",
      description: "Біблія венчурних фондів. Як рахувати економіку проекту, щоб він став єдинорогом.",
      targetRole: "maks",
      priority: 10
    },
    {
      name: "Liquid Death Marketing Case Study",
      type: "article",
      url: "https://www.marketingbrew.com/liquid-death-marketing",
      description: "Як продати звичайну воду за $1B через агресивний панк-маркетинг. Must-read для BoosterTea.",
      targetRole: "mykyta",
      priority: 9
    }
  ];

  console.log('Injcecting Unicorn Resources into DB...');

  for (const r of newResources) {
    const created = await prisma.resource.create({
      data: {
        name: r.name,
        type: r.type,
        url: r.url,
        description: r.description,
        targetRole: r.targetRole,
        priority: r.priority
      }
    });
    
    // Assign to users matching targetRole
    const users = await prisma.user.findMany();
    for (const u of users) {
      if (r.targetRole === 'all' || r.targetRole === u.role) {
        // assign
        await prisma.userResource.upsert({
          where: { userId_resourceId: { userId: u.telegramId, resourceId: created.id } },
          update: {},
          create: {
            userId: u.telegramId,
            resourceId: created.id,
            status: 'pending'
          }
        });
      }
    }
    console.log(`Inserted: ${created.name}`);
  }
  
  console.log('Unicorn injection complete.');
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
