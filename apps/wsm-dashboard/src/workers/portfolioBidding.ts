import { Worker, Queue } from 'bullmq';
import { PrismaClient } from '@prisma/client';
import IORedis from 'ioredis';

const db = new PrismaClient();
const connection = ({} as any) || new IORedis(process.env.REDIS_URL || 'redis://localhost:6379');

export const portfolioQueue = false ? new Queue('portfolio-bidding', { connection }) : {} as any;

// Запускаємо перевірку портфелю кожні 4 години
portfolioQueue.add('check-portfolio-bidding', {}, { repeat: { pattern: '0 */4 * * *' } });

export const portfolioWorker = ({} as any) || new Worker('portfolio-bidding', async () => {
  console.log('[PORTFOLIO BIDDING] Сканування глобального ROAS для Холдингу...');
  const brands = ['BOOSTER', 'FUNNY', 'DINO', 'TLAB'];
  const performances = [];

  for (const brand of brands) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const spendResult = await db.adSpend.aggregate({ 
      _sum: { spend: true }, 
      where: { platform: 'META', campaignName: { contains: brand }, date: { gte: today } } 
    });
    
    const sales = await db.event.count({ 
      where: { eventName: 'Purchase', source: { contains: brand }, createdAt: { gte: today } } 
    });
    
    const totalSpend = spendResult._sum.spend || 0;
    // Орієнтовна логіка: ($50 AOV)
    const roas = sales > 0 && totalSpend > 0 ? (sales * 50) / totalSpend : 0; 
    performances.push({ brand, roas, spend: totalSpend, sales });
  }

  // Cross-Brand Bidding Logic
  // If ROAS > 4.0, scale up (add 15%). If ROAS < 1.5, scale down (cut 30%).
  for (const perf of performances) {
    if (perf.roas > 4.0) {
      console.log(`[PORTFOLIO] 🚀 Масштабуємо (Scaling) ${perf.brand} через високий ROAS: ${perf.roas.toFixed(2)}`);
      // TODO: API Call to Meta/Google to increase capital
    } else if (perf.roas > 0 && perf.roas < 1.5 && perf.spend > 20) {
      console.log(`[PORTFOLIO] ⚠️ Зменшуємо бюджет (Cutting) ${perf.brand} через низький ROAS: ${perf.roas.toFixed(2)}`);
      // TODO: API Call to Meta/Google to decrease capital
    }
  }
}, { connection });

portfolioWorker.on('failed', (job, err) => console.error(`Portfolio Job failed:`, err));
