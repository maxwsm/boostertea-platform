import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * EcosystemOS - KeyCRM Sync Engine (ETL)
 * Single Source of Truth Architecture.
 * Routes products to 4 distinct Ecosystem Tenants simultaneously.
 */
export async function syncKeyCrmProducts() {
  console.log('🚀 [ETL] Starting KeyCRM Synchronization...');

  // 1. In a live environment, fetch from API:
  // const response = await fetch('https://openapi.keycrm.app/v1/products?limit=250', {
  //   headers: { "Authorization": `Bearer ${process.env.KEYCRM_TOKEN}` }
  // });
  // const data = await response.json();
  
  // Simulated Payload representing the 231 live SKUs:
  const mockKeyCrmCatalog = [
    { sku: 'bt-citrus-1l', name: 'BoosterTea Citrus 1L', price: 650, category: 'concentrate', tenant: 'boostertea' },
    { sku: 'fd-energy', name: 'FunnyDrops Energy', price: 900, category: 'drops', tenant: 'funnydrops' },
    { sku: 'ds-cherry', name: 'DinoSlush Cherry 500ml', price: 120, category: 'slush', tenant: 'dinoslush' },
    { sku: 'tlab-horeca-box', name: 'TLab HoReCa Box', price: 3200, category: 'b2b-kit', tenant: 'tlab' },
    { sku: 'bt-thermos', name: 'Premium Thermos (Unlockable)', price: 1500, category: 'accessory', tenant: 'boostertea' },
  ];

  let added = 0;
  let updated = 0;

  for (const item of mockKeyCrmCatalog) {
    // Discover the exact brand database node based on the SKU prefix / metadata
    const brand = await prisma.brand.findUnique({ where: { slug: item.tenant } });
    if (!brand) {
      console.warn(`[SKIP] Tenant ${item.tenant} not found in EcoSystem DB.`);
      continue;
    }

    // Upsert ensures we don't duplicate. We UPDATE prices/stock from KeyCRM,
    // but never override manual UI/UX descriptions made from the Master Panel.
    const product = await prisma.product.upsert({
      where: {
        brandId_slug: { brandId: brand.id, slug: item.sku }
      },
      update: {
        price: item.price,
      },
      create: {
        brandId: brand.id,
        slug: item.sku,
        nameUk: item.name,
        descriptionUk: `Імпортовано з KeyCRM`,
        price: item.price,
        category: item.category,
        stockStatus: true,
        stockQuantity: 100
      }
    });

    if (product.createdAt.getTime() === product.updatedAt.getTime()) added++;
    else updated++;
  }

  console.log(`✅ [ETL] Sync Complete. Added: ${added}, Updated: ${updated} SKUs.`);
}

// Allow direct execution
if (require.main === module) {
  syncKeyCrmProducts().catch(console.error).finally(() => prisma.$disconnect());
}
