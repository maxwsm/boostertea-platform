import { Worker } from 'bullmq';
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
    console.log(`[Automated CRM] It has been 14 days since transaction ${job.data.transactionId}. Triggering automated Set-Reorder Push/SMS to user ${job.data.userId}`);
    // Simulated SMS broadcast logic goes here via Twilio/TurboSMS
  }, { 
    connection: { host: '127.0.0.1', port: 6379 }
  });

  console.log('[BullMQ] Background Workers (Video AI & Predictive CRM) started 🏭');

  // Boot up TAIDRINK OS Telegram Bots
  try {
    castingBot.launch();
    console.log('[Superbrain] AI Casting Director mapped to Telegram via Telegraf 🎬');
    
    taicooBot.launch();
    console.log('[Superbrain] TAI-COO Executive Bot mapped to Telegram via Telegraf 💼');
  } catch (err) {
    console.log('[Superbrain] Bots failed to launch. (Missing env keys or already running)', err);
  }

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
