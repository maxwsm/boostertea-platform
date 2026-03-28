import { Queue, Worker, QueueEvents } from 'bullmq';
import { Redis } from 'ioredis';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

// BullMQ requires maxRetriesPerRequest set to null
export const redisClient = new Redis(REDIS_URL, { maxRetriesPerRequest: null });

// Core Ads Execution Queue
export const adsQueueName = 'ads-automation-tasks';

export const adsQueue = new Queue(adsQueueName, {
  connection: redisClient,
});

export const adsQueueEvents = new QueueEvents(adsQueueName, {
  connection: redisClient,
});

// Primary AI/Ads API Worker
export const worker = new Worker(adsQueueName, async (job) => {
  console.log(`[AdsEngine Worker] Picked up Job: ${job.name} (ID: ${job.id})`);
  const data = job.data;
  
  if (job.name === 'generate-campaign') {
    console.log(`[Gemini Integration] Triggering AutoResearch and Ad Generation for Campaign...`);
    // Future integration: @google/genai module logic goes here.
  }

  if (job.name === 'sync-predictive-audience') {
    console.log(`[Vertex AI] Calculating LTV and pushing audience seed to Meta CAPI...`);
  }

  // Simulate remote API execution
  await new Promise((resume) => setTimeout(resume, 2000));

  return { success: true, executedAt: new Date().toISOString() };
}, {
  connection: redisClient,
  concurrency: 5, // allows parallel campaign generation
});

worker.on('completed', (job) => {
  console.log(`[AdsEngine Worker] Task completed smoothly: ${job.id}`);
});

worker.on('failed', (job, err) => {
  console.error(`[AdsEngine Worker] Task failed drastically: ${job?.id}`, err);
});

console.log('[BullMQ] Ads Automation Worker is online and bound to Redis.');
