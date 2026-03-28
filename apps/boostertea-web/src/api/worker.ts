import { Worker } from 'bullmq';
import { prisma } from '@wsm/db';
import { sendSoftRejection, sendLightingError, sendSuccessAcceptance } from './bot';

import { castingBot } from './superbrain/casting';
import { taicooBot } from './superbrain/taicoo';

export const startWorker = () => {
  // 1. Video Analysis Worker
  const worker = new Worker('casting-video-analysis', async (job) => {
    console.log(`[BullMQ Worker] Picked up video for chat ${job.data.chatId}`);
    
    // Simulate complex background AI vision processing (Whisper / OpenAI Vision)
    await new Promise(resolve => setTimeout(resolve, 6000));
    
    const randomOutcome = Math.random();
    
    try {
      if (randomOutcome < 0.3) {
        await sendLightingError(job.data.chatId);
      } else if (randomOutcome < 0.6) {
        await sendSoftRejection(job.data.chatId);
      } else {
        await sendSuccessAcceptance(job.data.chatId);
      }
      console.log(`[BullMQ Worker] Successfully dispatched empathy response to chat ${job.data.chatId}`);
    } catch (e) {
      console.error(`[BullMQ Worker] Error signaling bot:`, e);
    }
    
  }, { 
    connection: { host: '127.0.0.1', port: 6379 } // Redis configuration
  });

  worker.on('completed', job => {
    console.log(`[BullMQ Worker] Job ${job.id} finalized cleanly.`);
  });

  // 2. Predictive Retention Trigger Worker (Executes after 14/20 day delays)
  const retentionWorker = new Worker('predictive-retention', async (job) => {
    console.log(`[Automated CRM] It has been 14 days since transaction ${job.data.transactionId}. Triggering automated Set-Reorder Push to user ${job.data.userId}`);
    
    // AI Studio Generated 14-day Retention Variants
    const variants = [
      `Відчуваєш, як концентрація падає? 🧠 Твій 14-денний запас BoosterTea майже вичерпано. Не чекай на "відкат" — замов нову партію енергії зараз, і ми відправимо її сьогодні. Твій мозок скаже "дякую". ⚡️`,
      `Легендо, твій інвентар порожній! 🎒 Рівно 14 днів тому ти обрав свій смак, і він добігає кінця. Час оновити запаси або відкрити новий "скілл" — спробуй наш новий FunnyDrops для максимального тюнінгу твого стану. Тисни, щоб поповнити резерви. 🧪`,
      `Reloading... 🔄 Твій Booster-цикл завершується. Щоб не втрачати ритм, натисни одну кнопку та повтори попереднє замовлення. Доставка в один клік, бадьорість — на максимумі. 🚀`
    ];
    const selectedVariant = variants[Math.floor(Math.random() * variants.length)];
    
    // In production, this would use Telegraf bot.telegram.sendMessage 
    // or TurboSMS API for users without Telegram.
    console.log(`[Push Notification Dispatch] Payload: ${selectedVariant}`);

  }, { 
    connection: { host: '127.0.0.1', port: 6379 }
  });

  console.log('[BullMQ] Background Workers (Video AI & Predictive CRM) started 🏭');

  // 3. GDPR Data Minimization Cron (Shadow Cart Purge)
  setInterval(async () => {
    try {
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const { count } = await prisma.shadowCart.deleteMany({
        where: { createdAt: { lt: sevenDaysAgo } }
      });
      if (count > 0) {
        console.log(`[GDPR Compliance] Purged ${count} abandoned ShadowCarts older than 7 days.`);
      }
    } catch (err) {
      console.error('[GDPR Compliance] Failed to run ShadowCart purge cron:', err);
    }
  }, 12 * 60 * 60 * 1000); // Run every 12 hours

  // Boot up TAIDRINK OS Telegram Bots
  castingBot.launch().catch(err => console.log('[Superbrain] Casting Bot failed to launch', err.message));
  console.log('[Superbrain] AI Casting Director mapped to Telegram via Telegraf 🎬');
  
  taicooBot.launch().catch(err => console.log('[Superbrain] TAI-COO failed to launch', err.message));
  console.log('[Superbrain] TAI-COO Executive Bot mapped to Telegram via Telegraf 💼');

  // Graceful bot shutdowns
  process.once('SIGINT', () => {
    castingBot.stop('SIGINT');
    taicooBot.stop('SIGINT');
  });
  process.once('SIGTERM', () => {
    castingBot.stop('SIGTERM');
    taicooBot.stop('SIGTERM');
  });
};
