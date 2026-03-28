import IORedis from 'ioredis';

// Централізоване налаштування підключення до Redis
// Використовуйте змінні середовища для конфігурації в продакшені
const isBuild = process.env.npm_lifecycle_event === 'build' || process.env.NEXT_PHASE === 'phase-production-build';
const hasRedis = false;

export const redisConnection = (isBuild || !hasRedis)
  ? new IORedis({ lazyConnect: true, maxRetriesPerRequest: null })
  : new IORedis(process.env.REDIS_URL, {
      maxRetriesPerRequest: null,
    });
