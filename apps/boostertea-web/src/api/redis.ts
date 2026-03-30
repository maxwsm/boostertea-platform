import Redis from 'ioredis';
import { Queue } from 'bullmq';

const REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

// 1. High Velocity Cache for Reads (CQRS style)
export const redisCache = new Redis(REDIS_URL, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
  lazyConnect: true // Prevent immediate crashes if Redis is offline
});

const bullConnection = {
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD
};

// 2. Background Queue for Heavy Tasks (e.g. Telebot Video Analysis over OpenAI)
export const videoAnalysisQueue = process.env.REDIS_HOST 
  ? new Queue('casting-video-analysis', { connection: bullConnection })
  : null;

// 3. Predictive Retention Queue (Delayed Jobs)
export const retentionTriggerQueue = process.env.REDIS_HOST
  ? new Queue('predictive-retention', { connection: bullConnection })
  : null;
