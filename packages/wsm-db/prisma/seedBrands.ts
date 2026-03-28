import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Executing Ecosystem Brand Seeding (Phase 7)...');
  
  const brands = [
    { slug: 'boostertea', name: 'BoosterTea', domain: 'boostertea.com.ua' },
    { slug: 'funnydrops', name: 'FunnyDrops', domain: 'funnydrops.com.ua' },
    { slug: 'dinoslush', name: 'DinoSlush', domain: 'dinoslush.com.ua' },
    { slug: 'tlab', name: 'TLab', domain: 'tlab.com.ua' }
  ];

  // Upsert prevents duplication errors on multiple runs
  let injected = 0;
  for (const b of brands) {
    const res = await prisma.brand.upsert({
      where: { slug: b.slug },
      update: {},
      create: b
    });
    console.log(`📡 Tenant linked: [${res.slug.toUpperCase()}]`);
    injected++;
  }
  
  console.log(`✅ Success! Database holds ${injected} Ecosystem Tenants. Ready for KeyCRM Sync.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
