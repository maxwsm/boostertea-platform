import { Bot, webhookCallback } from 'grammy';
import Redis from 'ioredis';
import type { BotContext, BotConfig } from './types/bot';
import startCommand from './commands/start';
import catalogCommand from './commands/catalog';
import cartCommand from './commands/cart';
import orderCommand from './commands/order';
import helpCommand from './commands/help';
import promoCommand from './commands/promo';
import statusCommand from './commands/status';
import callbackQueryHandler from './handlers/callback-query';
import messageHandler from './handlers/message';
import { createSessionMiddleware, rateLimitMiddleware, loggingMiddleware, errorHandler } from './handlers/middleware';
import { initCartService } from './services/cart-service';

export function createBot(config: BotConfig): Bot<BotContext> {
  const redis = new Redis(config.redisUrl);
  initCartService(redis);
  const bot = new Bot<BotContext>(config.token);
  bot.use(async (ctx, next) => { ctx.config = config; await next(); });
  bot.use(createSessionMiddleware(redis));
  bot.use(loggingMiddleware);
  bot.use(rateLimitMiddleware);
  bot.use(startCommand);
  bot.use(catalogCommand);
  bot.use(cartCommand);
  bot.use(orderCommand);
  bot.use(helpCommand);
  bot.use(promoCommand);
  bot.use(statusCommand);
  bot.use(callbackQueryHandler);
  bot.use(messageHandler);
  bot.catch(errorHandler);
  return bot;
}

async function main() {
  const config: BotConfig = {
    token: process.env.BOT_TOKEN || '',
    apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:3000',
    redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
    webhookUrl: process.env.WEBHOOK_URL,
    port: parseInt(process.env.PORT || '3001', 10),
    environment: (process.env.NODE_ENV as 'development' | 'production') || 'development',
  };
  if (!config.token) { console.error('BOT_TOKEN is required'); process.exit(1); }
  const bot = createBot(config);
  await bot.api.setMyCommands([
    { command: 'start', description: 'Почати роботу' },
    { command: 'catalog', description: 'Каталог' },
    { command: 'cart', description: 'Кошик' },
    { command: 'order', description: 'Замовлення' },
    { command: 'status', description: 'Статус замовлення' },
    { command: 'promo', description: 'Промокод' },
    { command: 'help', description: 'Допомога' },
  ]);
  await bot.start();
}

if (import.meta.main) { main().catch(console.error); }
export default main;
