const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });
const { Telegraf, Markup } = require('telegraf');

const token = process.env.BOT_TOKEN;
if (!token) {
  throw new Error('BOT_TOKEN must be provided!');
}

const bot = new Telegraf(token);
const twaUrl = process.env.TWA_URL || 'https://heart-twa.vercel.app';

// Access codes (synced with AuthGate.tsx)
const ACCESS_CODES = [
  "MRRT-ALPHA-773", "MRRT-BETA-892", "MRRT-GAMMA-415",
  "MRRT-DELTA-901", "MRRT-EPSILON-334", "MRRT-ZETA-556",
  "MRRT-ETA-289", "MRRT-THETA-742", "MRRT-IOTA-118", "MRRT-KAPPA-605"
];

// /start — Welcome + Open TWA
bot.start((ctx) => {
  const userName = ctx.from.first_name || 'Користувач';
  const code = ACCESS_CODES[Math.floor(Math.random() * ACCESS_CODES.length)];

  // Log the code for debugging/user info in terminal if needed, but we don't send it directly anymore
  // to maintain the "exclusive access" illusion if they already have one, or maybe we still provide it?
  // The user said: "Введіть ваш персональний ключ доступу." 
  // Let's provide it in a formatted block so they can copy it.
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
    [Markup.button.callback('📖 Кодекс Тіней', 'codex_shadows')],
    [Markup.button.callback('⚔️ Фреймворки Рішень', 'codex_frameworks')],
    [Markup.button.callback('ℹ️ Про Систему', 'about')]
  ]));
});

// /codex — Direct command
bot.command('codex', (ctx) => {
  ctx.reply('📖 Кодекс Тіней — відкрийте вкладку "Кодекс" у Терміналі:', Markup.inlineKeyboard([
    [Markup.button.webApp('📖 Відкрити Кодекс', twaUrl)]
  ]));
});

// /frameworks — Direct command
bot.command('frameworks', (ctx) => {
  ctx.reply('⚔️ Фреймворки Рішень — відкрийте вкладку "Кодекс" → "Рішення":', Markup.inlineKeyboard([
    [Markup.button.webApp('⚔️ Відкрити Фреймворки', twaUrl)]
  ]));
});

// Callback: Codex Shadows
bot.action('codex_shadows', (ctx) => {
  ctx.answerCbQuery();
  ctx.replyWithMarkdownV2(`
📖 *Енциклопедія Тіней \\(Юнг\\)*

У системі доступні 8 архетипів:
🏃 Ескапіст \\— Втеча від реальності
🎯 Перфекціоніст \\— Гіперконтроль
😔 Жертва \\— Безсилість
🔥 Агресор \\— Домінування
🎭 Самозванець \\— Недостатність
🛡 Рятувальник \\— Кодепенденція
🕸 Маніпулятор \\— Тіньова влада
👁 Спостерігач \\— Дисоціація

Кожен містить: _хімічний профіль, моторику тіла, тригерні фрази та методологію виходу_\\.

Відкрийте вкладку "Кодекс" у Терміналі для детального вивчення\\.
  `.trim(), Markup.inlineKeyboard([
    [Markup.button.webApp('🖥 Відкрити Кодекс', twaUrl)]
  ]));
});

// Callback: Decision Frameworks
bot.action('codex_frameworks', (ctx) => {
  ctx.answerCbQuery();
  ctx.replyWithMarkdownV2(`
⚔️ *Фреймворки Прийняття Рішень*

5 інструментів рівня топ\\-компаній:
🎯 *Google* \\— OKR \\(Objectives \\& Key Results\\)
⚛️ *Tesla / SpaceX* \\— First Principles Thinking
💀 *NASA* \\— Pre\\-Mortem Analysis
⚔️ *Pentagon / DARPA* \\— Red Team / Blue Team
⚡ *Meta / Red Bull / Dragon Capital* \\— Blitzscaling

Кожен фреймворк має: _принцип, модель мислення, покроковий алгоритм, реальний кейс та небезпеку зловживання_\\.
  `.trim(), Markup.inlineKeyboard([
    [Markup.button.webApp('🖥 Відкрити Фреймворки', twaUrl)]
  ]));
});

// Callback: About
bot.action('about', (ctx) => {
  ctx.answerCbQuery();
  ctx.replyWithMarkdownV2(`
🧠 *I³\\.MRMRRT\\.ƐI \\— Нейро\\-Ментор Профіциту*

Система працює на перетині:
• Аналітичної психології Юнга \\(Тінь, Архетипи\\)
• Polyvagal Theory \\(Вагусне регулювання\\)
• IFS \\(Внутрішні Частини\\)
• RSD \\(Rejection Sensitive Dysphoria\\)
• Human Design \\(Сакрал, Емоційна Хвиля\\)

*Модулі:*
📡 Нейро\\-Сканер \\(голос/текст → AI аналіз\\)
🧬 Соматична Карта Тіла
🌐 GLSL Фрактали \\(Julia Set\\)
📊 Біометричні Дельти
📖 Кодекс \\(8 Тіней \\+ 5 Фреймворків\\)
🎵 Аудіо\\-Терапія \\(432 Hz / 396 Hz\\)

_Не є медичним інструментом\\._
  `.trim());
});

// Any text message — prompt to use terminal
bot.on('text', (ctx) => {
  ctx.reply('Для аналізу використовуйте Термінал (TWA). Натисніть кнопку нижче:', Markup.inlineKeyboard([
    [Markup.button.webApp('🖥 Відкрити Термінал', twaUrl)]
  ]));
});

// Start bot
console.log('🚀 Starting I3.MRMRRT.ƐI Bot...');
console.log(`📡 TWA URL: ${twaUrl}`);
console.log(`🔑 Token: ...${token.slice(-6)}`);

bot.launch({ dropPendingUpdates: true })
  .then(() => console.log('✅ Bot polling active — @MRMRRTI_bot'))
  .catch(err => console.error('❌ Launch error:', err.message));

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
