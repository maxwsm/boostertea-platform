import { Telegraf } from 'telegraf';
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN || '');
const chatId = process.env.TELEGRAM_CHAT_ID || '';
export const sendNotification = async (message: string) => { if (!process.env.TELEGRAM_BOT_TOKEN || !chatId) return; try { await bot.telegram.sendMessage(chatId, message, { parse_mode: 'HTML' }); } catch (error) { console.error('Помилка Telegram:', error); } };
