import Fastify from 'fastify';
import { Telegraf } from 'telegraf';
import { PrismaClient } from '@wsm/db';
import dotenv from 'dotenv';
import path from 'path';

// Load locally configured .env variables holding user tokens
dotenv.config({ path: path.join(process.cwd(), '.env') });
dotenv.config({ path: path.join(process.cwd(), '.env.example') }); // Fallback for local debugging

const prisma = new PrismaClient();
const server = Fastify({ logger: true });

// Universal Omni-Bot Setup Factory
function setupBot(token: string | undefined, brandSlug: string) {
  if (!token) {
    server.log.warn(`[Skip] Token missing for ${brandSlug.toUpperCase()} bot.`);
    return null;
  }
  
  const bot = new Telegraf(token);
  
  // Basic Welcome & Auth Gateway
  bot.start(async (ctx) => {
    ctx.reply(`Вітаємо в екосистемі ${brandSlug}! 🚀\nНадішліть ваш контакт для реєстрації та "Universal Auth" підключення до особистого кабінету.`);
    
    try {
      // 1. Check if the Brand exists or needs to be safely handled
      let brandObj = await prisma.brand.findUnique({ where: { slug: brandSlug.toLowerCase() } });
      
      // If no strict DB entry yet, we bypass Telemetry logic to prevent crashes during initial seed periods
      if (brandObj) {
        await prisma.telemetryLog.create({
          data: {
            brandId: brandObj.id,
            eventType: 'TELEGRAM_BOT_OPEN',
            eventData: JSON.stringify({ userId: ctx.from.id, username: ctx.from.username })
          }
        });
      }
    } catch (e) {
      server.log.error(`[Error] DB Interaction failed on Bot Start:`, e);
    }
  });

  bot.launch();
  server.log.info(`[Bot] ${brandSlug.toUpperCase()} initialized securely on Telegraf (${token.split(':')[0]}:***)`);
  return bot;
}

// Bootstrapping the bots based on the user's provided Environment Variables
const ecosystemBots = {
  boostertea: setupBot(process.env.TELEGRAM_BOT_TOKEN_BOOSTERTEA, 'BoosterTea'),
  funnydrops: setupBot(process.env.TELEGRAM_BOT_TOKEN_FUNNYDROPS, 'FunnyDrops'),
  dinoslush: setupBot(process.env.TELEGRAM_BOT_TOKEN_DINOSLUSH, 'DinoSlush'),
  tlab: setupBot(process.env.TELEGRAM_BOT_TOKEN_TLAB, 'TLab'),
  master: setupBot(process.env.TELEGRAM_BOT_TOKEN_MASTER, 'EcosystemOS_Master')
};

// Root Fastify Endpoints
server.get('/health', async () => {
  return { status: 'ok', activeBotsCount: Object.values(ecosystemBots).filter(b => b !== null).length, architecture: 'EcosystemOS 2026 Multi-Tenant Live' };
});

const start = async () => {
  try {
    await server.listen({ port: 8080, host: '0.0.0.0' });
    console.log('🚀 Fastify Omni-Channel Orchestrator running strictly on http://localhost:8080');
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
