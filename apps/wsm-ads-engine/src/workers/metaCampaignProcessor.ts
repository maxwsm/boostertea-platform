import { Worker, Job } from 'bullmq';
import { redisClient } from '../queue';
import { createMetaCampaign } from '../lib/meta';

// Цей файл потрібно запускати як окремий процес (node src/workers/metaCampaignProcessor.js)

console.log('🚀 Meta Campaign Worker is starting...');

// Створюємо воркер, який слухає чергу 'meta-campaigns'
new Worker('meta-campaigns', async (job: Job) => {
  console.log(`Processing job ${job.id} for campaign: ${job.data.headline}`);

  try {
    const result = await createMetaCampaign(job.data);
    console.log(`✅ Job ${job.id} completed successfully. Campaign ID: ${result.campaignId}`);
    return result;
  } catch (error) {
    console.error(`❌ Job ${job.id} failed.`, error);
    // Викидаємо помилку, щоб BullMQ міг спробувати виконати завдання ще раз
    throw error;
  }
}, {
  connection: redisClient,
  concurrency: 5, // Обробляти до 5 завдань одночасно
});

console.log('✨ Meta Campaign Worker is listening for jobs.');
