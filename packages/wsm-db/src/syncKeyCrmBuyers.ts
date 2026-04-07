import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const KEYCRM_TOKEN = process.env.KEYCRM_TOKEN;
const KEYCRM_API_URL = 'https://openapi.keycrm.app/v1';

async function fetchKeyCrmOrders(page = 1) {
  const url = `${KEYCRM_API_URL}/order?limit=50&page=${page}&include=buyer,products`;
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${KEYCRM_TOKEN}`,
      'Accept': 'application/json'
    }
  });

  if (!response.ok) {
    if (response.status === 401) throw new Error("Unauthorized! Invalid KEYCRM_TOKEN.");
    throw new Error(`KeyCRM API Error: ${response.statusText}`);
  }

  return response.json();
}

function normalizePhone(phone: string) {
  if (!phone) return null;
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) return `38${digits}`;
  if (digits.length === 12) return digits;
  return digits; // Fallback
}

export async function syncKeyCrmBuyers() {
  console.log('🚀 [ETL] Starting KeyCRM Buyers & Funnel Synchronization...');

  if (!KEYCRM_TOKEN) {
    console.error('❌ FATAL: KEYCRM_TOKEN is not set in environment variables!');
    process.exit(1);
  }

  let currentPage = 1;
  let totalProcessed = 0;
  let hasMore = true;

  // Track customer metrics to determine funnels grouped by normalized phone
  const customerStats = new Map<string, { 
    name: string; 
    email: string | null;
    totalOrders: number; 
    totalLtv: number; 
    boughtSyrup: boolean;
  }>();

  while (hasMore) {
    console.log(`⏳ Fetching KeyCRM Orders Page ${currentPage}...`);
    const data = await fetchKeyCrmOrders(currentPage);
    
    const orders = data.data || [];
    if (orders.length === 0) {
      hasMore = false;
      break;
    }

    for (const order of orders) {
      if (!order.buyer || !order.buyer.phone) continue;

      const phone = normalizePhone(order.buyer.phone);
      if (!phone) continue;

      const hasSyrup = (order.products || []).some((p: any) => 
        p.name && p.name.toLowerCase().includes('сироп')
      );

      const ltv = parseFloat(order.grand_total || 0);

      const existingStats = customerStats.get(phone) || {
        name: order.buyer.full_name || 'KeyCRM Client',
        email: order.buyer.email || null,
        totalOrders: 0,
        totalLtv: 0,
        boughtSyrup: false
      };

      existingStats.totalOrders += 1;
      existingStats.totalLtv += ltv;
      if (hasSyrup) existingStats.boughtSyrup = true;

      customerStats.set(phone, existingStats);
    }

    totalProcessed += orders.length;
    
    // Pagination check
    if (currentPage >= data.last_page) {
      hasMore = false;
    } else {
      currentPage++;
    }
  }

  console.log(`✅ Loaded ${totalProcessed} orders. Extracted ${customerStats.size} unique clients.`);
  console.log(`⏳ Pushing to BoosterTea PostgreSQL Database...`);

  let upsertedCount = 0;

  for (const [phone, stats] of customerStats.entries()) {
    // Determine Funnel
    let funnelStage: 'NEW_LEAD' | 'MEDIUM_WARM' | 'VIP_BUYER' | 'B2B_PARTNER' = 'NEW_LEAD';

    if (stats.boughtSyrup) {
      funnelStage = 'MEDIUM_WARM'; // "Середньо теплі ті що купували сиропи"
    } else if (stats.totalOrders > 3 || stats.totalLtv > 5000) {
      funnelStage = 'VIP_BUYER';
    } else if (stats.totalOrders > 0) {
      funnelStage = 'NEW_LEAD';
    }

    await prisma.user.upsert({
      where: { phone },
      update: {
        name: stats.name,
        funnelStage,
        totalOrdersCount: stats.totalOrders,
        lifetimeValue: stats.totalLtv
      },
      create: {
        phone,
        name: stats.name,
        email: stats.email,
        funnelStage,
        totalOrdersCount: stats.totalOrders,
        lifetimeValue: stats.totalLtv,
        languageCode: 'uk'
      }
    });

    upsertedCount++;
  }

  console.log(`🎯 SUCCESS! ${upsertedCount} clients synchronized to 'Readiness #1'.`);
}

// Allow direct execution
if (require.main === module) {
  syncKeyCrmBuyers()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
