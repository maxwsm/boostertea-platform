const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });
const { Telegraf, Markup } = require('telegraf');

const token = process.env.BOT_TOKEN;
if (!token) {
  throw new Error('BOT_TOKEN must be provided!');
}

const bot = new Telegraf(token);
// Add a version parameter to bust Telegram WebApp cache
const twaUrl = process.env.TWA_URL ? `${process.env.TWA_URL}?v=2.2` : 'https://heart-twa.vercel.app?v=2.2';

// Access codes (synced with AuthGate.tsx)
const ACCESS_CODES = [
  "MRRT-ALPHA-773", "MRRT-BETA-892", "MRRT-GAMMA-415",
  "MRRT-DELTA-901", "MRRT-EPSILON-334", "MRRT-ZETA-556",
  "MRRT-ETA-289", "MRRT-THETA-742", "MRRT-IOTA-118", "MRRT-KAPPA-605"
];

// /start — Welcome + Open TWA
bot.start((ctx) => {
  const code = ACCESS_CODES[Math.floor(Math.random() * ACCESS_CODES.length)];

  const message = `
⚡️ *З'ЄДНАННЯ ВСТАНОВЛЕНО\\.*
\\[ Статус користувача: Неопізнаний \\]

Ви знаходитесь у зовнішньому шлюзі I³\\.MRMRRT\\.ƐI\\.
Доступ до стратегічних модулів та нейро\\-архітектури закрито\\.

Для ініціалізації протоколу відкрийте термінал нижче та введіть ваш персональний ключ доступу\\.

🔑 *Ключ доступу:* \`${code}\`
  `.trim();

  ctx.replyWithMarkdownV2(message, Markup.inlineKeyboard([
    [Markup.button.webApp('🔑 ІНІЦІАЛІЗАЦІЯ', twaUrl)],
    [Markup.button.callback('[ ДАНИХ: Тіні ]', 'codex_shadows')],
    [Markup.button.callback('[ ДАНИХ: Фреймворки ]', 'codex_frameworks')],
    [Markup.button.callback('[ МАНІФЕСТ ]', 'about')]
  ]));
});

// /codex — Direct command
bot.command('codex', (ctx) => {
  ctx.reply('[ ДОСТУП ДО КОДЕКСУ ТІНЕЙ ]\nІніціалізуйте термінал:', Markup.inlineKeyboard([
    [Markup.button.webApp('🔑 ІНІЦІАЛІЗАЦІЯ', twaUrl)]
  ]));
});

// /frameworks — Direct command
bot.command('frameworks', (ctx) => {
  ctx.reply('[ ДОСТУП ДО ФРЕЙМВОРКІВ РІШЕНЬ ]\nІніціалізуйте термінал:', Markup.inlineKeyboard([
    [Markup.button.webApp('🔑 ІНІЦІАЛІЗАЦІЯ', twaUrl)]
  ]));
});

// Callback: Codex Shadows
bot.action('codex_shadows', (ctx) => {
  ctx.answerCbQuery();
  ctx.replyWithMarkdownV2(`
\\[ *СИСТЕМНИЙ РЕЄСТР: ТІНЬОВІ АРХЕТИПИ* \\]

Ідентифіковано 8 патернів \\(за К\\.Г\\. Юнгом\\):

\\[ Ескапіст \\] — Дисоціація та втеча від реальності
\\[ Перфекціоніст \\] — Параліч через гіперконтроль
\\[ Жертва \\] — Делегування відповідальності за біль
\\[ Агресор \\] — Компенсація страху через домінування
\\[ Самозванець \\] — Хронічне відчуття недостатності
\\[ Рятувальник \\] — Кодепенденція та втрата фокусу
\\[ Маніпулятор \\] — Тіньова влада та недовіра
\\[ Спостерігач \\] — Відмова від дії через гіпер\\-аналіз

Кожен профіль містить: _біохімічні маркери, соматичні реакції, лінгвістичні тригери та протокол виходу в Профіцит_\\.

Для розшифровки ініціалізуйте термінал\\.
  `.trim(), Markup.inlineKeyboard([
    [Markup.button.webApp('🔑 ІНІЦІАЛІЗАЦІЯ', twaUrl)]
  ]));
});

// Callback: Decision Frameworks
bot.action('codex_frameworks', (ctx) => {
  ctx.answerCbQuery();
  ctx.replyWithMarkdownV2(`
\\[ *БАЗА ДАНИХ: ФРЕЙМВОРКИ РІШЕНЬ* \\]

Доступні 5 тактичних моделей вищого рівня:

\\[ Google \\] — OKR \\(Objectives \\& Key Results\\)
\\[ Tesla / SpaceX \\] — First Principles Thinking
\\[ NASA \\] — Pre\\-Mortem Analysis
\\[ Pentagon / DARPA \\] — Red Team / Blue Team
\\[ Meta / Dragon Capital \\] — Blitzscaling

Специфікація кожної моделі включає: _базовий принцип, когнітивний алгоритм, реальний прецедент використання та загрози зловживання_\\.

Для розшифровки ініціалізуйте термінал\\.
  `.trim(), Markup.inlineKeyboard([
    [Markup.button.webApp('🔑 ІНІЦІАЛІЗАЦІЯ', twaUrl)]
  ]));
});

// Callback: About
bot.action('about', (ctx) => {
  ctx.answerCbQuery();
  ctx.replyWithMarkdownV2(`
\\[ *МАНІФЕСТ СИСТЕМИ: I³\\.MRMRRT\\.ƐI* \\]

Статус: Автономний Тіньовий Стратег\\.
Інструмент елітарного моделювання реальності для тих, хто керує системами, а не є їхньою частиною\\.

\\[ *АРХІТЕКТУРА* \\]:
▪️ Нейро\\-перетин: К\\.Г\\. Юнг × Polyvagal Theory × Human Design
▪️ Аналітичний рушій: 8 Архетипів Тіней
▪️ Тактичний рушій: 5 Фреймворків рішень
▪️ Інтерфейс: GLSL\\-Фрактали та Соматичне картування
▪️ Аудіо\\-корекція: Нейро\\-частоти \\(432 Hz / 396 Hz\\)

\\[ *УВАГА* \\]: Система не надає медичних консультацій\\. Лише холодний стратегічний аналіз\\.
  `.trim());
});

// Any text message — prompt to use terminal
bot.on('text', (ctx) => {
  ctx.reply('[ СТАТУС: ВІДМОВА ]\nДля аналізу ініціалізуйте Термінал:', Markup.inlineKeyboard([
    [Markup.button.webApp('🔑 ІНІЦІАЛІЗАЦІЯ', twaUrl)]
  ]));
});

// Start bot
console.log('🚀 Starting I3.MRMRRT.ƐI Bot (v2.2)...');
console.log(`📡 TWA URL: ${twaUrl}`);
console.log(`🔑 Token: ...${token.slice(-6)}`);

bot.launch({ dropPendingUpdates: true })
  .then(() => console.log('✅ Bot polling active — @MRMRRTI_bot'))
  .catch(err => console.error('❌ Launch error:', err.message));

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
