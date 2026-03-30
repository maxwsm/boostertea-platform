import { Telegraf } from 'telegraf';
import { videoAnalysisQueue } from './redis';

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN || 'mock-token-for-dev';
export const bot = new Telegraf(TELEGRAM_TOKEN);

// Humanization helper: Typing indicators
const simulateTyping = async (ctx: any, ms = 2000) => {
  await ctx.sendChatAction('typing');
  return new Promise(resolve => setTimeout(resolve, ms));
};

bot.start(async (ctx) => {
  await simulateTyping(ctx, 1500);
  await ctx.reply(`Йоу, вітаю на кастингу амбасадорів WSM! Я твій цифровий продюсер.\n\nЗапиши круте відео на 15 секунд, розкажи, чому саме ти маєш розривати ринок з BoosterTea. Гори знімати! 🚀`);
});

bot.on('video', async (ctx) => {
  await simulateTyping(ctx, 3000);
  await ctx.reply("Крутяк, ловимо файл! Відео пішло на аналіз нашим AI-модераторам у підземелля.\n\nМаякну через пару хвилин як тільки будуть результати. ⏱️");

  // Push to Background Queue (Phase 15 req)
  const fileId = ctx.message.video.file_id;
  await videoAnalysisQueue.add('analyze-video', {
    chatId: ctx.chat.id,
    fileId: fileId,
    username: ctx.message.from.username
  });
});

export const sendSoftRejection = async (chatId: number) => {
  await bot.telegram.sendChatAction(chatId, 'record_voice'); // pretend to record audio or type
  await new Promise(r => setTimeout(r, 2000));
  await bot.telegram.sendMessage(chatId, "Слухай, крута спроба! Але нам зараз потрібен трохи інший вайб для цієї кампанії. Тримай втішний бонус — промокод на 15% для тебе особисто: WSM-TRY-15. Залітай на наступний кастинг!");
};

export const sendLightingError = async (chatId: number) => {
  await bot.telegram.sendChatAction(chatId, 'typing');
  await new Promise(r => setTimeout(r, 1500));
  await bot.telegram.sendMessage(chatId, "Бро, в тебе там темно, як у печері кажана 🦇. Не можу розгледіти емоції. Стань ближче до вікна і перезніми, пліз!");
};

export const sendSuccessAcceptance = async (chatId: number) => {
  await bot.telegram.sendChatAction(chatId, 'typing');
  await new Promise(r => setTimeout(r, 2000));
  await bot.telegram.sendMessage(chatId, "Це розрив! Ти пройшов кастинг. Твій рівень енергії — те що треба. 🔥 Переходь у WSM Dashboard, щоб згенерувати свої лінки!");
};

export const startBot = () => {
  // Catch blocks to prevent crashes on invalid mock tokens
  bot.launch().catch(err => console.log('[TeleBot] Waiting for real TELEGRAM_TOKEN... (skipped boot)'));
  console.log('[TeleBot] Superbrain Casting Bot logic initialized. 🤖');
};

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
