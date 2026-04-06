const { PrismaClient } = require('./prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');

async function seedMarketing() {
  console.log("🚀 Починаємо сид бази даних маркетингу та оперативних інструментів...");

  // CREATE CATEGORIES
  const mktCat = await prisma.skillCategory.upsert({
    where: { slug: "marketing_traffic" }, update: {}, create: { name: "💸 Marketing & Traffic", icon: "🔥", slug: "marketing_traffic" }
  });
  
  const contentCat = await prisma.skillCategory.upsert({
    where: { slug: "content_production" }, update: {}, create: { name: "🎥 Coliseum Production", icon: "🎬", slug: "content_production" }
  });
  
  const techCat = await prisma.skillCategory.upsert({
    where: { slug: "tech_motorics" }, update: {}, create: { name: "⚙️ System Motorics", icon: "⏱", slug: "tech_motorics" }
  });
  
  const stratCat = await prisma.skillCategory.upsert({
    where: { slug: "b2b_strategy" }, update: {}, create: { name: "🏢 Scaling & B2B", icon: "💼", slug: "b2b_strategy" }
  });

  // CREATE SKILLS
  const skills = [
    { categoryId: mktCat.id, slug: "meta-pixel-gtm", name: "Meta Pixel & GTM Mastery", tier: "pro", description: "Математика трафіку та Data-Layer." },
    { categoryId: contentCat.id, slug: "tiktok-retention", name: "TikTok Віральність", tier: "pro", description: "Утримання уваги (Retention) та YouTube воронки." },
    { categoryId: stratCat.id, slug: "b2b-ops", name: "B2B Onboarding", tier: "master", description: "Побудова системи роботи з партнерами 13WSM13." },
    { categoryId: techCat.id, slug: "db-motorics", name: "Database Motorics", tier: "master", description: "Безперебійність серверу та мінімізація затримок." }
  ];

  for (const s of skills) {
    await prisma.skill.upsert({ where: { slug: s.slug }, update: {}, create: s });
  }

  // CREATE RESOURCES (Linking to file paths)
  const metaSkill = await prisma.skill.findUnique({ where: { slug: "meta-pixel-gtm" } });
  const tiktokSkill = await prisma.skill.findUnique({ where: { slug: "tiktok-retention" } });
  const opsSkill = await prisma.skill.findUnique({ where: { slug: "b2b-ops" } });
  const techSkill = await prisma.skill.findUnique({ where: { slug: "db-motorics" } });

  const resources = [
    { id: "res-mkt-1", skillId: metaSkill.id, name: "Машина Трафіку: Meta Pixel & UGC", type: "article", url: "file:///knowledge_base/mykyta_traffic/meta_gtm_funnels.md", description: "Data-Layer, СAPI, та створення блогер-боксів для інфлюенсерів.", targetRole: "mykyta", priority: 10 },
    { id: "res-cnt-1", skillId: tiktokSkill.id, name: "Coliseum: YouTube та Reels виробництво", type: "article", url: "file:///knowledge_base/nazar_content/coliseum_production.md", description: "Правило 3-х секунд, ASMR шоти, та сетап освітлення для бренду.", targetRole: "nazar", priority: 10 },
    { id: "res-ops-1", skillId: opsSkill.id, name: "Архітектура B2B у BoosterTea", type: "article", url: "file:///knowledge_base/taras_strategy/13wsm13_scaling_b2b.md", description: "Регламенти (SOP), лояльність та відстеження якості партій.", targetRole: "taras", priority: 10 },
    { id: "res-tch-1", skillId: techSkill.id, name: "Data Motorics: Метрики та Затримки", type: "article", url: "file:///knowledge_base/andriy_motorics/system_latency_metrics.md", description: "Трекінг відгуку Vercel/PM2, оптимізація запитів SQLite, та воронки UI.", targetRole: "andryuha", priority: 10 }
  ];

  for (const r of resources) {
    await prisma.resource.upsert({ where: { id: r.id }, update: r, create: r });
  }

  console.log("✅ Marketing & Role Knowledge Base успішно підшита в нейромережу!");
}

seedMarketing()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
