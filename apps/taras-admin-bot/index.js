require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const cron = require('node-cron');
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { TASKS } = require('./tasks14days');
const { BOOSTERTEA_CONTEXT } = require('./boostertea_context');

// ─── ENV ─────────────────────────────────────────────────────────────────────
const BOT_TOKEN   = process.env.BOT_TOKEN;
const GEMINI_KEY  = process.env.GEMINI_API_KEY;
const ADMIN_ID    = process.env.ADMIN_ID;
const PORT        = process.env.PORT || 3005;

if (!BOT_TOKEN) { console.error('❌ BOT_TOKEN відсутній!'); process.exit(1); }

// ─── STATE (JSON файл замість БД) ────────────────────────────────────────────
const STATE_FILE = path.join(__dirname, 'state.json');

function loadState() {
  if (!fs.existsSync(STATE_FILE)) return { members: {}, progress: {}, currentDay: 1, startDate: null };
  return JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
}

function saveState(state) {
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

let state = loadState();

// ─── Gemini ───────────────────────────────────────────────────────────────────
let gemini = null;
let geminiModel = null;
if (GEMINI_KEY) {
  gemini = new GoogleGenerativeAI(GEMINI_KEY);
  geminiModel = gemini.getGenerativeModel({ model: 'gemini-1.5-flash' });
}

async function askGemini(userMessage, extraContext = '') {
  if (!geminiModel) return null;
  try {
    const prompt = `${BOOSTERTEA_CONTEXT}\n\n${extraContext}\n\nПовідомлення від учасника команди: "${userMessage}"\n\nВідповідай коротко, чітко, українською мовою, у стилі дружнього наставника-мотиватора з гумором.`;
    const result = await geminiModel.generateContent(prompt);
    return result.response.text();
  } catch (e) {
    console.error('Gemini error:', e.message);
    return null;
  }
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const ROLES = { taras: 'Тарас', mykyta: 'Микита', nazar: 'Назар' };

function getRoleByUserId(userId) {
  const s = loadState();
  for (const [role, mid] of Object.entries(s.members)) {
    if (mid && mid.toString() === userId.toString()) return role;
  }
  return null;
}

function getCurrentDay() {
  const s = loadState();
  if (!s.startDate) return null;
  const diffMs = Date.now() - new Date(s.startDate).getTime();
  const day = Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;
  return Math.min(day, 14);
}

function getDayProgress(day) {
  const s = loadState();
  const key = `day${day}`;
  return s.progress[key] || {};
}

function markTaskDone(day, taskId, proof) {
  const s = loadState();
  const key = `day${day}`;
  if (!s.progress[key]) s.progress[key] = {};
  s.progress[key][taskId] = { done: true, proof, ts: new Date().toISOString() };
  saveState(s);
}

function getDayPercent(day) {
  const dayTasks = TASKS[day]?.tasks || [];
  const progress = getDayProgress(day);
  const done = dayTasks.filter(t => progress[t.id]?.done).length;
  return { done, total: dayTasks.length, pct: Math.round((done / dayTasks.length) * 100) };
}

function getRandomPhrase(phrases) {
  return phrases[Math.floor(Math.random() * phrases.length)];
}

const GREETINGS = [
  "О, привіт, хуйлуша 😂 Чим можу допомогти?",
  "Йоу! Що хочеш, красавчику? 🫡",
  "Опа, живий! Давай, що там у тебе?",
  "Привіт, бро! BoosterTea не спить 😤",
  "Хей! Готовий до роботи? Тому що я — завжди 🔥",
];

const DONE_PHRASES = [
  "КРАСАВА! 🔥 Задача зарахована, летиш як ракета!",
  "Оце так! Залік, бро. Один-нуль на твою користь 💪",
  "Так держати! Ще 4 такі й ти легенда дня 😎",
  "Молодець! Дивись, не зупиняйся, бо розмах є 🚀",
];

const PUSH_PHRASES = [
  "Слухай, ну шо ти гальмуєш?! До 16:00 лишилось МАЛО, а задачі не зроблені! Давай, не їбе нікаких відмазок! 😤",
  "Ей, ти там живий? Задачі самі себе не зроблять, чуєш?! Вставай і рухайся 🔥",
  "Шо за хєрня, бро?! 60% не виконано і ти мовчиш?! Ану піднімай дупу і їбаш! ⚡️",
  "Стоп! Нагадую — єдиний виняток від задач: СМЕРТЬ. Ти живий? Живий. То йди і роби! 💀➡️🔥",
];

const FULL_DONE_PHRASES = [
  "ЛЕГЕНДА! 🏆 Всі 5 задач виконані до 16:00! Сьогодні ти — КРАЩИЙ!",
  "ОТО ЙО! 🎉 5 з 5! Команда, дивіться на цього звіра 🦁",
  "ТОПЧИК! Всі задачі в дзвіночку! Завтра ще крутіше! 🚀",
];

// ─── BOT ──────────────────────────────────────────────────────────────────────
const bot = new Telegraf(BOT_TOKEN);

// /start — отримати свій ID + вибрати роль
bot.start(async (ctx) => {
  const userId = ctx.from.id.toString();
  const name = ctx.from.first_name;
  ctx.reply(
    `${getRandomPhrase(GREETINGS)}\n\n` +
    `Привіт, *${name}*! Ласкаво просимо в BoosterTea Control Bot 🍵\n\n` +
    `Твій Telegram ID: \`${userId}\`\n\n` +
    `Скинь цей ID Тарасу, щоб він прив'язав тебе до ролі.\n\n` +
    `Якщо ти вже прив'язаний — напиши /tasks щоб побачити свої задачі на сьогодні.`,
    { parse_mode: 'Markdown' }
  );
});

// /setmember — для адміна: прив'язати ID до ролі
bot.command('setmember', async (ctx) => {
  const userId = ctx.from.id.toString();
  if (userId !== ADMIN_ID) return ctx.reply("❌ Тільки адмін може це робити.");
  
  const parts = ctx.message.text.split(' ');
  if (parts.length < 3) return ctx.reply("Формат: /setmember <роль> <ID>\nРолі: taras | mykyta | nazar\nПриклад: /setmember nazar 123456789");
  
  const role = parts[1].toLowerCase();
  const memberId = parts[2];
  
  if (!['taras', 'mykyta', 'nazar'].includes(role)) return ctx.reply("❌ Невідома роль. Доступні: taras | mykyta | nazar");
  
  state = loadState();
  if (!state.members) state.members = {};
  state.members[role] = memberId;
  saveState(state);
  
  ctx.reply(`✅ Роль *${ROLES[role]}* прив'язана до ID ${memberId}!`, { parse_mode: 'Markdown' });
  
  try {
    await bot.telegram.sendMessage(memberId, 
      `Привіт! 🍵 Тарас додав тебе до команди BoosterTea Control Bot як *${ROLES[role]}*!\n\nПиши /tasks щоб бачити свої задачі.`,
      { parse_mode: 'Markdown' }
    );
  } catch(e) {}
});

// /startplan — для адміна: запустити 14-денний план
bot.command('startplan', async (ctx) => {
  const userId = ctx.from.id.toString();
  if (userId !== ADMIN_ID) return ctx.reply("❌ Тільки адмін може це робити.");
  
  state = loadState();
  state.startDate = new Date().toISOString();
  state.progress = {};
  saveState(state);
  
  await broadcastToTeam(
    `🚀 *14-ДЕННИЙ ПЛАН СТАРТУВАВ!*\n\n` +
    `Сьогодні — *День 1*.\n` +
    `${TASKS[1].theme}\n\n` +
    `Пишіть /tasks щоб побачити свої задачі. Виконання підтверджується фото або документом прямо в боті.\n\n` +
    `Дедлайн щодня: *16:00*. Виняток — смерть. В усіх інших випадках: 5 задач або смерть 😤🔥`
  );
  
  ctx.reply("✅ 14-денний план запущено! Команда отримала сповіщення.");
});

// /tasks — задачі на поточний день для конкретного учасника
bot.command('tasks', async (ctx) => {
  const userId = ctx.from.id.toString();
  const role = getRoleByUserId(userId);
  const day = getCurrentDay();
  
  if (!day) return ctx.reply("⏳ 14-денний план ще не запущено. Чекай на команду від Тараса.");
  if (!role) return ctx.reply("❌ Тебе ще не прив'язано до ролі. Скинь свій ID Тарасу (/start щоб отримати ID).");
  
  const dayData = TASKS[day];
  if (!dayData) return ctx.reply("🏆 14-денний план завершено! Ти — легенда.");
  
  const myTasks = dayData.tasks.filter(t => t.owner === role);
  const progress = getDayProgress(day);
  
  let msg = `📋 *${dayData.theme}*\n\n`;
  msg += `Привіт, *${ROLES[role]}*! Твої задачі на сьогодні:\n\n`;
  
  myTasks.forEach((t, i) => {
    const done = progress[t.id]?.done;
    msg += `${done ? '✅' : '🔲'} *Задача ${i + 1}:*\n${t.text}\n\n`;
  });
  
  const { done, total } = getDayPercent(day);
  msg += `━━━━━━━━━━━━━━━\n📊 Прогрес команди: ${done}/${total} задач виконано`;
  
  await ctx.reply(msg, { parse_mode: 'Markdown' });
  await ctx.reply("Щоб підтвердити задачу — надішли фото або документ і вкажи номер задачі командою:\n/done <номер задачі>\n\nПісля цього прикріпи фото/документ.");
});

// Стан очікування підтвердження задачі
const pendingConfirm = {};

// /done — позначити задачу як виконану (потім чекаємо фото)
bot.command('done', async (ctx) => {
  const userId = ctx.from.id.toString();
  const role = getRoleByUserId(userId);
  const day = getCurrentDay();
  
  if (!day || !role) return ctx.reply("❌ Роль не визначена або план не запущено.");
  
  const parts = ctx.message.text.split(' ');
  if (parts.length < 2) return ctx.reply("Формат: /done <номер задачі>\nПриклад: /done 3");
  
  const taskNum = parseInt(parts[1]) - 1;
  const myTasks = TASKS[day].tasks.filter(t => t.owner === role);
  
  if (taskNum < 0 || taskNum >= myTasks.length) {
    return ctx.reply(`❌ Невірний номер. У тебе ${myTasks.length} задачі на сьогодні.`);
  }
  
  const task = myTasks[taskNum];
  const progress = getDayProgress(day);
  
  if (progress[task.id]?.done) {
    return ctx.reply("✅ Ця задача вже зарахована! Красавчик.");
  }
  
  // Зберігаємо очікування фото
  pendingConfirm[userId] = { day, taskId: task.id, taskText: task.text };
  
  await ctx.reply(
    `⏳ Задача "${task.text.substring(0, 60)}..."\n\nТепер надішли фото або документ як підтвердження виконання. Без пруфу — не зарахую 😤`,
    { parse_mode: 'Markdown' }
  );
});

// Обробка фото — підтвердження задачі
bot.on('photo', async (ctx) => {
  const userId = ctx.from.id.toString();
  const role = getRoleByUserId(userId);
  
  if (!pendingConfirm[userId]) {
    // Якщо немає очікуваної задачі — просто відповідаємо
    return ctx.reply("Красиве фото 📸 Але якщо хочеш підтвердити задачу — спочатку напиши /done <номер>");
  }
  
  const { day, taskId, taskText } = pendingConfirm[userId];
  const fileId = ctx.message.photo[ctx.message.photo.length - 1].file_id;
  
  markTaskDone(day, taskId, { type: 'photo', fileId });
  delete pendingConfirm[userId];
  
  const { done, total, pct } = getDayPercent(day);
  
  await ctx.reply(`${getRandomPhrase(DONE_PHRASES)}\n\n📊 Прогрес дня: ${done}/${total} (${pct}%)`);
  
  // Якщо всі виконані
  if (done === total) {
    await broadcastToTeam(`🏆 *ВСІХ ЗАДАЧ ДНЯ ${day} ВИКОНАНО!*\n\n${getRandomPhrase(FULL_DONE_PHRASES)}\n\nЗавтра — день ${day + 1}. Відпочиньте трохи і готуйтесь 🔥`);
    return;
  }
  
  // Оповістити адміна
  if (ADMIN_ID && userId !== ADMIN_ID) {
    try {
      await bot.telegram.sendMessage(ADMIN_ID, 
        `✅ *${ROLES[role]}* підтвердив задачу дня ${day}:\n"${taskText.substring(0, 80)}..."\n\nПрогрес: ${done}/${total}`,
        { parse_mode: 'Markdown' }
      );
    } catch(e) {}
  }
});

// Обробка документів — підтвердження задачі
bot.on('document', async (ctx) => {
  const userId = ctx.from.id.toString();
  const role = getRoleByUserId(userId);
  
  if (!pendingConfirm[userId]) {
    return ctx.reply("Документ прийнято 📄 Якщо хочеш підтвердити задачу — спочатку /done <номер>");
  }
  
  const { day, taskId, taskText } = pendingConfirm[userId];
  const fileId = ctx.message.document.file_id;
  
  markTaskDone(day, taskId, { type: 'document', fileId });
  delete pendingConfirm[userId];
  
  const { done, total, pct } = getDayPercent(day);
  
  await ctx.reply(`${getRandomPhrase(DONE_PHRASES)}\n\n📊 Прогрес дня: ${done}/${total} (${pct}%)`);
  
  if (done === total) {
    await broadcastToTeam(`🏆 *ВСІХ ЗАДАЧ ДНЯ ${day} ВИКОНАНО!*\n\n${getRandomPhrase(FULL_DONE_PHRASES)}`);
  }
});

// /progress — загальний прогрес дня для всіх
bot.command('progress', async (ctx) => {
  const day = getCurrentDay();
  if (!day) return ctx.reply("⏳ План ще не запущено.");
  
  const s = loadState();
  const progress = getDayProgress(day);
  const dayData = TASKS[day];
  
  let msg = `📊 *Прогрес — День ${day}: ${dayData.theme}*\n\n`;
  
  for (const role of ['taras', 'mykyta', 'nazar']) {
    const myTasks = dayData.tasks.filter(t => t.owner === role);
    const doneTasks = myTasks.filter(t => progress[t.id]?.done);
    msg += `*${ROLES[role]}:* ${doneTasks.length}/${myTasks.length} задач `;
    msg += doneTasks.length === myTasks.length ? '✅' : '🔲';
    msg += '\n';
  }
  
  const { done, total, pct } = getDayPercent(day);
  msg += `\n━━━━━━━━━━━━━━━\n🔥 Загалом: ${done}/${total} (${pct}%)`;
  
  await ctx.reply(msg, { parse_mode: 'Markdown' });
});

// /ask — запитати Gemini (AI-наставник)
bot.command('ask', async (ctx) => {
  const userId = ctx.from.id.toString();
  const role = getRoleByUserId(userId);
  const day = getCurrentDay();
  
  const question = ctx.message.text.replace('/ask', '').trim();
  if (!question) return ctx.reply("Напиши питання після команди: /ask <твоє питання>\nНаприклад: /ask як краще написати ТЗ на дизайн упаковки?");
  
  await ctx.reply("🤔 Думаю...");
  
  const extraContext = role && day ? 
    `Учасник: ${ROLES[role]}. Поточний день плану: ${day}. Тема дня: ${TASKS[day]?.theme}` : '';
  
  const answer = await askGemini(question, extraContext);
  
  if (answer) {
    await ctx.reply(`🧠 *BoosterTea AI:*\n\n${answer}`, { parse_mode: 'Markdown' });
  } else {
    await ctx.reply("❌ Gemini зараз недоступний. Перевір GEMINI_API_KEY у .env");
  }
});

// /report — звіт про конкретний день (адмін)
bot.command('report', async (ctx) => {
  const userId = ctx.from.id.toString();
  if (userId !== ADMIN_ID) return ctx.reply("❌ Тільки для адміна.");
  
  const day = getCurrentDay();
  if (!day) return ctx.reply("⏳ План не запущено.");
  
  const progress = getDayProgress(day);
  const dayData = TASKS[day];
  
  let msg = `📋 *Детальний звіт — День ${day}*\n\n`;
  
  for (const task of dayData.tasks) {
    const done = progress[task.id]?.done;
    const owner = ROLES[task.owner];
    msg += `${done ? '✅' : '❌'} [${owner}] ${task.text.substring(0, 70)}...\n\n`;
  }
  
  await ctx.reply(msg, { parse_mode: 'Markdown' });
});

// /team — список команди
bot.command('team', async (ctx) => {
  const userId = ctx.from.id.toString();
  if (userId !== ADMIN_ID) return ctx.reply("❌ Тільки для адміна.");
  
  const s = loadState();
  const members = s.members || {};
  let msg = `👥 *Команда BoosterTea:*\n\n`;
  msg += `*Тарас:* ${members.taras || '❌ не прив'язано'}\n`;
  msg += `*Микита:* ${members.mykyta || '❌ не прив'язано'}\n`;
  msg += `*Назар:* ${members.nazar || '❌ не прив'язано'}\n`;
  msg += `\n*Адмін ID:* ${ADMIN_ID}`;
  
  await ctx.reply(msg, { parse_mode: 'Markdown' });
});

// Загальна обробка текстових повідомлень → Gemini
bot.on('text', async (ctx) => {
  const text = ctx.message.text;
  if (text.startsWith('/')) return; // пропускаємо команди
  
  // Якщо питання у вільній формі — відповідає Gemini
  const userId = ctx.from.id.toString();
  const role = getRoleByUserId(userId);
  const day = getCurrentDay();
  
  const extraContext = role && day ? 
    `Учасник: ${ROLES[role]}. День плану: ${day}. Тема: ${TASKS[day]?.theme}` : '';
  
  const answer = await askGemini(text, extraContext);
  if (answer) {
    await ctx.reply(`🧠 ${answer}`, { parse_mode: 'Markdown' });
  }
});

// ─── BROADCAST HELPER ─────────────────────────────────────────────────────────
async function broadcastToTeam(message) {
  const s = loadState();
  const members = s.members || {};
  const ids = new Set([...Object.values(members), ADMIN_ID].filter(Boolean));
  
  for (const id of ids) {
    try {
      await bot.telegram.sendMessage(id, message, { parse_mode: 'Markdown' });
    } catch(e) {
      console.error(`Broadcast error to ${id}:`, e.message);
    }
  }
}

// ─── CRON JOBS — нагадування ─────────────────────────────────────────────────

// 08:00 — ранкове збудження + задачі дня
cron.schedule('0 8 * * *', async () => {
  const day = getCurrentDay();
  if (!day) return;
  const dayData = TASKS[day];
  if (!dayData) return;
  
  const s = loadState();
  const members = s.members || {};
  
  for (const [role, userId] of Object.entries(members)) {
    if (!userId) continue;
    const myTasks = dayData.tasks.filter(t => t.owner === role);
    let msg = `☀️ *Доброго ранку, ${ROLES[role]}!*\n\n`;
    msg += `День ${day}: ${dayData.theme}\n\n`;
    msg += `*Твої 5 задач на сьогодні:*\n\n`;
    myTasks.forEach((t, i) => {
      msg += `${i + 1}. ${t.text}\n\n`;
    });
    msg += `⏰ Дедлайн: *16:00*. Підтверджуй фото через /done <номер>!\n\nДавай, не їбе відмазок 🔥`;
    
    try { await bot.telegram.sendMessage(userId, msg, { parse_mode: 'Markdown' }); } catch(e) {}
  }
}, { timezone: 'Europe/Kiev' });

// 13:00 — перевірка прогресу
cron.schedule('0 13 * * *', async () => {
  const day = getCurrentDay();
  if (!day) return;
  
  const { done, total, pct } = getDayPercent(day);
  
  const s = loadState();
  const members = s.members || {};
  
  for (const [role, userId] of Object.entries(members)) {
    if (!userId) continue;
    const myTasks = TASKS[day].tasks.filter(t => t.owner === role);
    const progress = getDayProgress(day);
    const myDone = myTasks.filter(t => progress[t.id]?.done).length;
    const myPct = Math.round((myDone / myTasks.length) * 100);
    
    let msg;
    if (myPct === 100) {
      msg = `🔥 *${ROLES[role]}*, ти вже красавчик! Всі задачі виконані! Допоможи команді або відпочивай 💪`;
    } else {
      msg = `⏰ *${ROLES[role]}*, 13:00! Прогрес: ${myDone}/${myTasks.length} (${myPct}%)\n\n`;
      msg += myPct < 40 
        ? `Ану ДАВАЙ! Шо за хєрня?! До 16:00 всього 3 години! 😤🔥`
        : `Добре, але не гальмуй — залишились ще задачі!`;
    }
    
    try { await bot.telegram.sendMessage(userId, msg, { parse_mode: 'Markdown' }); } catch(e) {}
  }
}, { timezone: 'Europe/Kiev' });

// 15:00 — жорсткий push якщо < 60%
cron.schedule('0 15 * * *', async () => {
  const day = getCurrentDay();
  if (!day) return;
  
  const s = loadState();
  const members = s.members || {};
  
  for (const [role, userId] of Object.entries(members)) {
    if (!userId) continue;
    const myTasks = TASKS[day].tasks.filter(t => t.owner === role);
    const progress = getDayProgress(day);
    const myDone = myTasks.filter(t => progress[t.id]?.done).length;
    const myPct = Math.round((myDone / myTasks.length) * 100);
    
    if (myPct < 60) {
      const msg = `🚨 *${ROLES[role]}, АЛАРМ!*\n\n${getRandomPhrase(PUSH_PHRASES)}\n\nВиконано ${myDone}/${myTasks.length}. До 16:00 — 1 ГОД. ГО! 💥`;
      try { await bot.telegram.sendMessage(userId, msg, { parse_mode: 'Markdown' }); } catch(e) {}
    }
  }
}, { timezone: 'Europe/Kiev' });

// 16:00 — фінальна перевірка
cron.schedule('0 16 * * *', async () => {
  const day = getCurrentDay();
  if (!day) return;
  
  const { done, total, pct } = getDayPercent(day);
  
  const s = loadState();
  const members = s.members || {};
  
  for (const [role, userId] of Object.entries(members)) {
    if (!userId) continue;
    const myTasks = TASKS[day].tasks.filter(t => t.owner === role);
    const progress = getDayProgress(day);
    const myDone = myTasks.filter(t => progress[t.id]?.done).length;
    const undone = myTasks.filter(t => !progress[t.id]?.done);
    
    if (myDone === myTasks.length) {
      const msg = `✅ *${ROLES[role]}* — ІДЕАЛ! Всі задачі закриті до 16:00. ЛЕГЕНДА! 🏆`;
      try { await bot.telegram.sendMessage(userId, msg, { parse_mode: 'Markdown' }); } catch(e) {}
    } else {
      let msg = `🕓 16:00 — ДЕДЛАЙН!\n\n*${ROLES[role]}*, невиконані задачі:\n\n`;
      undone.forEach(t => { msg += `❌ ${t.text.substring(0, 80)}...\n\n`; });
      msg += `Закрий їх ЗАРАЗ і надішли пруфи. Це не обговорюється 😤`;
      try { await bot.telegram.sendMessage(userId, msg, { parse_mode: 'Markdown' }); } catch(e) {}
    }
  }
}, { timezone: 'Europe/Kiev' });

// 21:00 — перехід на наступний день (якщо потрібно)
cron.schedule('0 21 * * *', async () => {
  const day = getCurrentDay();
  if (!day || day >= 14) return;
  const nextDay = day + 1;
  const nextData = TASKS[nextDay];
  if (!nextData) return;
  
  await broadcastToTeam(
    `🌙 *На сьогодні все! Готуйтесь до завтра.*\n\n` +
    `*Завтра — День ${nextDay}:* ${nextData.theme}\n\n` +
    `Завтра о 8:00 отримаєте детальні задачі. Відпочивайте, але подумайте як будете їх робити 🍵`
  );
}, { timezone: 'Europe/Kiev' });

// ─── EXPRESS (прийом лідів з сайту) ──────────────────────────────────────────
const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/leads', async (req, res) => {
  try {
    const { name, phone, product, total, url } = req.body;
    
    const message =
      `🚨 <b>НОВИЙ ЛІД!</b>\n\n` +
      `👤 <b>Ім'я:</b> ${name || 'Не вказано'}\n` +
      `📞 <b>Телефон:</b> ${phone || 'Не вказано'}\n` +
      `📦 <b>Товар:</b> ${product || 'Не вказано'}\n` +
      `💰 <b>Сума:</b> ${total ? total + ' грн' : 'Не вказано'}\n` +
      `🔗 <b>Джерело:</b> ${url || 'Сайт'}`;
    
    const s = loadState();
    const members = s.members || {};
    const ids = new Set([...Object.values(members), ADMIN_ID].filter(Boolean));
    
    for (const id of ids) {
      try { await bot.telegram.sendMessage(id, message, { parse_mode: 'HTML' }); } catch(e) {}
    }
    
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

app.get('/health', (_, res) => res.json({ status: 'ok', day: getCurrentDay() }));

app.listen(PORT, () => console.log(`🚀 Express на порту ${PORT}`));

// ─── LAUNCH ───────────────────────────────────────────────────────────────────
bot.launch().then(() => {
  console.log('🤖 BoosterTea Admin Bot запущений!');
  console.log('Gemini:', GEMINI_KEY ? '✅ підключений' : '❌ GEMINI_API_KEY відсутній');
}).catch(e => {
  console.error('❌ Помилка запуску:', e);
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
