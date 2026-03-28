import { Telegraf, Markup } from 'telegraf';
import { videoAnalysisQueue } from './redis';
import { generateText } from 'ai';
import { google } from '@ai-sdk/google';

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN || 'mock-token-for-dev';
export const bot = new Telegraf(TELEGRAM_TOKEN);

// Humanization helper: Typing indicators
const simulateTyping = async (ctx: any, ms = 2000) => {
  await ctx.sendChatAction('typing');
  return new Promise(resolve => setTimeout(resolve, ms));
};

bot.start(async (ctx) => {
  await simulateTyping(ctx, 1500);
  await ctx.replyWithPhoto(
    { url: 'https://boostertea.com.ua/images/mythbusters-welcome-8k.jpg' }, 
    {
      caption: `🔥 <b>Вітаємо у кібер-опорі WSM Ecosystem.</b>\n\nТи знаєш, чому ти тут. Ми ламаємо матрицю звичайних уявлень про чай та енергію. Заходь у Лабораторію, обирай свою зброю (DHP, Pu-Erh, GABA) або дізнайся свої можливості через AI.\n\nТвій доступ відкрито: 👇`,
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [
          [Markup.button.webApp('🚀 Увійти в Лабораторію (Store)', 'https://boostertea.com.ua/tma')],
          [Markup.button.callback('🧠 Що таке Mythbusters?', 'MYTHBUSTERS_INFO')]
        ]
      }
    }
  );
});

bot.action('MYTHBUSTERS_INFO', async (ctx) => {
  await ctx.answerCbQuery();
  await simulateTyping(ctx, 1500);
  await ctx.reply("Ми — Руйнівники Міфів. Микита та Назар доводять, що для фокусу та енергії не потрібна хімія. Напиши своє питання сюди, і наш AI-модератор допоможе тобі обрати продукт!");
});

// Gemini Live Chat Integration for Conversational Workflows
bot.on('text', async (ctx) => {
  const userMessage = ctx.message.text;
  await simulateTyping(ctx, 1500);

  try {
    const aiResponse = await generateText({
      model: google('gemini-1.5-pro'),
      system: `Ти — AI-модератор WSM Ecosystem. Твій тон: кіберпанк, дружній, як хакер-наставник з Mythbusters Academy. Допомагай клієнтам обрати Пуер (Енергія), Да Хун Пао (Релакс/Фокус) або Габу (Відновлення нейронів). Ніколи не будь нудним. Форматуй текст красиво. Наприкінці завжди скеровуй їх натиснути кнопку "Увійти в Лабораторію" у меню бота.`,
      prompt: userMessage,
    });
    
    await ctx.reply(aiResponse.text);
  } catch (error) {
    console.error('[Gemini AI Error]', error);
    await ctx.reply("Модуль зв'язку з Ядром тимчасово перевантажений. Спробуй ще раз трохи згодом. ⚡");
  }
});

export const startBot = () => {
  bot.launch().catch(err => console.log('[TeleBot] Waiting for real TELEGRAM_TOKEN... (skipped boot)'));
  console.log('[TeleBot] WSM Mythbusters Ecosystem Bot initialized. 🤖');
};

export const sendSoftRejection = async (chatId: string | number) => {
  try { await bot.telegram.sendMessage(chatId, "Твій запит відхилено AI. Спробуй ще раз."); } catch(e){}
};

export const sendLightingError = async (chatId: string | number) => {
  try { await bot.telegram.sendMessage(chatId, "Помилка освітлення. Запиши відео при кращому світлі."); } catch(e){}
};

export const sendSuccessAcceptance = async (chatId: string | number) => {
  try { await bot.telegram.sendMessage(chatId, "Запит прийнято! Вітаємо в системі."); } catch(e){}
};

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
