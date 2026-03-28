// @ts-nocheck
import { Queue } from 'bullmq';
import { redisConnection } from './redis';

const isBuild = process.env.npm_lifecycle_event === 'build' || process.env.NEXT_PHASE === 'phase-production-build';
const hasRedis = false;

export const metaCampaignQueue = (isBuild || !hasRedis)
  ? ({} as Queue)
  : new Queue('meta-campaigns', {
      connection: redisConnection,
      defaultJobOptions: {
        attempts: 3, // 3 спроби у разі помилки
        backoff: {
          type: 'exponential',
          delay: 1000, // Затримка 1с, 2с, 4с...
        },
      },
    });

// Підключаємо фонових воркерів
if (!isBuild && hasRedis) {
  require('../workers/trackingWorker');
  require('../workers/spendAggregator');
  require('../workers/rulesEngine');
  require('../workers/portfolioBidding');
}
