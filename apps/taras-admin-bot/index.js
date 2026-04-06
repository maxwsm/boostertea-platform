// BoosterTea Command System v2.0 — Main Orchestrator
// Deploy: start.boostertea.com.ua
require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const cron = require('node-cron');
const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const uuidv4 = () => crypto.randomUUID();

const { TASKS: RAW_TASKS } = require('./tasks14days');
let TASKS = JSON.parse(JSON.stringify(RAW_TASKS));
const { getRagContext } = require('./boostertea_context');
const { MANIFEST_TEXT } = require('./lib/manifest');
const { ROLES, TEAM_ROLES, getRoleByUserId, getUserByRole, getCurrentDay, getDayProgress, getDayPercent, broadcastToTeam, getOtherTeamRoles } = require('./lib/helpers');
const { random, GREETINGS, DONE_PHRASES, PUSH_PHRASES, FULL_DONE_PHRASES, ASSIGN_REMINDERS } = require('./lib/phrases');
const { WAITING_PHRASES } = require('./lib/valera_phrases');
const { addXP, XP_REWARDS, XP_PENALTIES, checkAchievements } = require('./lib/xp');
const { setupAPI } = require('./api/routes');

// ─── ENV ────────────────────────────────────────────
const BOT_TOKEN  = process.env.BOT_TOKEN;
const GEMINI_KEY = process.env.GEMINI_API_KEY;
const ADMIN_ID   = process.env.ADMIN_ID;
const PORT       = process.env.PORT || 3005;
if (!BOT_TOKEN) { console.error('❌ BOT_TOKEN відсутній!'); process.exit(1); }

// ─── PRISMA ─────────────────────────────────────────
const { PrismaClient } = require('./prisma/client');
const prisma = new PrismaClient();

// ─── GEMINI ─────────────────────────────────────────
const { AI_TOOLS, handleFunctionCall } = require('./lib/ai_tools');

let geminiModel = null;
if (GEMINI_KEY) {
  const gemini = new GoogleGenerativeAI(GEMINI_KEY);
  geminiModel = gemini.getGenerativeModel({ model: 'gemini-2.5-flash', tools: AI_TOOLS });
}

const { handleOfflineMode } = require('./lib/offline_valera');

async function askGemini(userId, userMessage, extraContext = '', sessionIdProvided = null) {
  if (!geminiModel) return handleOfflineMode(userMessage);
  try {
    // Get last 10 messages for context
    const history = await prisma.chatMessage.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });
    
    const contents = history.reverse().map(m => ({
      role: m.msgRole === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }]
    }));

    const dynamicContext = getRagContext(userMessage);
    const prompt = `[SYSTEM CONTEXT]\n${dynamicContext}\n\n[STATE]\n${extraContext}\n\n[USER MSG]\n"${userMessage}"\n\nВідповідай коротко, чітко, українською. Використовуй tools якщо юзер просить проаналізувати або оновити задачі.`;
    
    contents.push({ role: 'user', parts: [{ text: prompt }] });

    let result = await geminiModel.generateContent({ contents });
    let answer = '';
    
    const calls = result.response.functionCalls && result.response.functionCalls();
    if (calls && calls.length > 0) {
      const call = calls[0];
      const funcResult = await handleFunctionCall(call);
      
      contents.push({ role: 'model', parts: [{ functionCall: call }] });
      contents.push({ role: 'function', parts: [{ functionResponse: { name: call.name, response: funcResult } }] });
      
      const followUp = await geminiModel.generateContent({ contents });
      answer = followUp.response.text();
    } else {
      answer = result.response.text();
    }

    // Save both messages
    const sessionId = sessionIdProvided || history[0]?.sessionId || uuidv4();
    await prisma.chatMessage.createMany({
      data: [
        { userId, msgRole: 'user', content: userMessage, context: extraContext, sessionId },
        { userId, msgRole: 'assistant', content: answer, sessionId },
      ],
    });

    return answer;
  } catch (e) {
    console.error('Gemini error:', e.message);
    if (e.message.includes('429') || e.message.includes('quota') || e.message.includes('fetch')) {
      return handleOfflineMode(userMessage);
    }
    return handleOfflineMode(userMessage); // Default fallback
  }
}

// ─── TASK OVERRIDES ─────────────────────────────────
async function reloadTaskOverrides() {
  const s = await prisma.settings.findUnique({ where: { key: 'task_overrides' } });
  TASKS = JSON.parse(JSON.stringify(RAW_TASKS));
  if (s) {
    try {
      const overrides = JSON.parse(s.value);
      for (const day in TASKS) {
        TASKS[day].tasks.forEach(t => { if (overrides[t.id]) t.owner = overrides[t.id]; });
      }
    } catch(e) {}
  }
}
reloadTaskOverrides().catch(console.error);

// ─── KEYBOARD ───────────────────────────────────────
function getMainKeyboard(isAdmin) {
  const buttons = [
    [Markup.button.webApp("⚡ ВБІГТИ В MISSION CONTROL", "https://boostertea-twa.vercel.app")],
    [Markup.button.callback('📜 Кодекс', 'menu_manifest'), Markup.button.callback('🧠 ШІ-Ментор', 'menu_ai')],
    [Markup.button.callback('📋 Задачі', 'menu_tasks'), Markup.button.callback('📊 Прогрес', 'menu_progress')],
  ];
  if (isAdmin) {
    buttons.push([Markup.button.callback('📈 Звіт', 'menu_report'), Markup.button.callback('👥 Екіпаж', 'menu_team')]);
    buttons.push([Markup.button.callback('🚀 Старт Програми', 'menu_startplan')]);
  }
  return Markup.inlineKeyboard(buttons);
}

// ═══════════════════════════════════════════════════
// BOT HANDLERS
// ═══════════════════════════════════════════════════
const bot = new Telegraf(BOT_TOKEN);

// /start
bot.start(async (ctx) => {
  const userId = ctx.from.id.toString();
  
  // Приховати стару клавіатуру:
  try {
    const tmp = await ctx.reply("...", Markup.removeKeyboard());
    await ctx.deleteMessage(tmp.message_id);
  } catch(e) {}

  const captionText = `*[ SYSTEM INITIALIZED: BOOSTERTEA v2.0 ]*\n\nВітаю в мережі 13WSMƐI, *${ctx.from.first_name}*.\n\nТи підключений до закритої магістралі управління. Тут немає лояльності до слабкостей, тільки чистий першопринцип. Я контролюю логіку та KPI. Ти контролюєш реальність.\n\nТвій ID: \`${userId}\`\nВибери модуль і почни зміну:`;
  try {
    await ctx.replyWithPhoto(
      { source: '/Users/ANTI 001/wsm-ecosystem/apps/boostertea-twa/public/bg-dark.png' },
      { parse_mode: 'Markdown', caption: captionText, ...getMainKeyboard(userId === ADMIN_ID) }
    );
  } catch(e) {
    console.error("Photo send failed, fallback to text", e);
    await ctx.reply(captionText, { parse_mode: 'Markdown', ...getMainKeyboard(userId === ADMIN_ID) });
  }
});

// 📜 Маніфест
bot.action('menu_manifest', async (ctx) => {
  await ctx.answerCbQuery();
  ctx.reply(MANIFEST_TEXT, { parse_mode: 'Markdown' });
});

// /setmember
bot.command('setmember', async (ctx) => {
  if (ctx.from.id.toString() !== ADMIN_ID) return ctx.reply("❌ Тільки адмін.");
  const parts = ctx.message.text.split(' ');
  if (parts.length < 3) return ctx.reply("Формат: /setmember <роль> <ID>\nРолі: taras | mykyta | nazar | maks");
  const [, role, memberId] = parts;
  if (!ROLES[role]) return ctx.reply("❌ Невідома роль.");
  await prisma.user.upsert({ where: { telegramId: memberId }, update: { role }, create: { telegramId: memberId, role, name: ROLES[role] } });
  ctx.reply(`✅ *${ROLES[role]}* → ID ${memberId}`, { parse_mode: 'Markdown' });
  try { await bot.telegram.sendMessage(memberId, `✅ Тебе додано як *${ROLES[role]}*!`, { parse_mode: 'Markdown' }); } catch(e) {}
});

// /reassign
bot.command('reassign', async (ctx) => {
  if (ctx.from.id.toString() !== ADMIN_ID) return ctx.reply("❌ Тільки адмін.");
  const parts = ctx.message.text.split(' ');
  if (parts.length < 3) return ctx.reply("Формат: /reassign <taskId> <нова_роль>");
  const [, taskId, newRole] = parts;
  if (!ROLES[newRole]) return ctx.reply("❌ Невідома роль.");
  const s = await prisma.settings.findUnique({ where: { key: 'task_overrides' } });
  let overrides = {}; if (s) { try { overrides = JSON.parse(s.value); } catch(e){} }
  overrides[taskId] = newRole;
  await prisma.settings.upsert({ where: { key: 'task_overrides' }, update: { value: JSON.stringify(overrides) }, create: { key: 'task_overrides', value: JSON.stringify(overrides) } });
  await reloadTaskOverrides();
  ctx.reply(`✅ Задачу ${taskId} → ${ROLES[newRole]}`);
});

// /startplan
const startplanHandler = async (ctx) => {
  if (ctx.from.id.toString() !== ADMIN_ID) return ctx.reply("❌ Тільки адмін.");
  await prisma.settings.upsert({ where: { key: 'startDate' }, update: { value: new Date().toISOString() }, create: { key: 'startDate', value: new Date().toISOString() } });
  await broadcastToTeam(bot, prisma, ADMIN_ID, `🚀 *14-ДЕННИЙ ПЛАН СТАРТУВАВ!*\n\nДень 1: ${TASKS[1].theme}\n\nДедлайн щодня: *16:00*. 5 задач. Без виключень 😤🔥`);
  ctx.reply("✅ План запущено!", { ...getMainKeyboard(true) });
};

// 📋 Мої задачі (3🔵 + 2🟠)
const tasksHandler = async (ctx) => {
  const userId = ctx.from.id.toString();
  const role = await getRoleByUserId(prisma, userId);
  const day = await getCurrentDay(prisma);
  if (!day) return ctx.reply("⏳ План ще не запущено.");
  if (!role) return ctx.reply("❌ Тебе ще не прив'язано.");
  const dayData = TASKS[day];
  if (!dayData) return ctx.reply("🏆 14-денний план завершено!");

  // Primary tasks
  const myTasks = dayData.tasks.filter(t => t.owner === role);
  const progress = await getDayProgress(prisma, day);

  // Assigned tasks (from other team members)
  const assignedTasks = await prisma.task.findMany({ where: { ownerId: userId, day, type: 'assigned' }, include: { assignedBy: true } });

  let msg = `📋 *${dayData.theme}*\n\n*${ROLES[role]}*, задачі на сьогодні:\n\n`;
  msg += `🔵 *ОСНОВНІ:*\n`;
  const taskButtons = [];
  myTasks.forEach((t, i) => {
    const done = progress[t.id]?.done;
    msg += `${done ? '✅' : '🔲'} *${i + 1}.* ${t.text}\n\n`;
    if (!done) taskButtons.push(Markup.button.callback(`✅ Здати ${i + 1}`, `done_${i}`));
  });

  if (assignedTasks.length > 0) {
    msg += `\n🟠 *ПРИЗНАЧЕНІ ТОБІ:*\n`;
    assignedTasks.forEach((t, i) => {
      const byName = t.assignedBy ? ROLES[t.assignedBy.role] || '?' : 'Система';
      msg += `${t.done ? '✅' : '🔲'} *${myTasks.length + i + 1}.* ${t.text}\n📌 _від ${byName}_\n\n`;
      if (!t.done) taskButtons.push(Markup.button.callback(`✅ Здати ${myTasks.length + i + 1}`, `adone_${t.id}`));
    });
  }

  const user = await prisma.user.findUnique({ where: { telegramId: userId } });
  msg += `━━━━━━━━━━━━━━━\n⚡ XP: ${user?.xpTotal || 0} | Level: ${user?.level || 1} | 🔥 Streak: ${user?.streakDays || 0}`;

  const inlineKb = [];
  for (let i = 0; i < taskButtons.length; i += 2) inlineKb.push(taskButtons.slice(i, i + 2));
  await ctx.reply(msg, { parse_mode: 'Markdown', ...Markup.inlineKeyboard(inlineKb) });
};

// /assign — Cross-assignment
bot.command('assign', async (ctx) => {
  const userId = ctx.from.id.toString();
  const role = await getRoleByUserId(prisma, userId);
  const day = await getCurrentDay(prisma);
  if (!role || !day) return ctx.reply("❌ Роль/план не визначені.");

  const text = ctx.message.text.replace(/^\/assign\s+/, '');
  const parts = text.match(/^(\w+)\s+(.+)$/);
  if (!parts) return ctx.reply("Формат: /assign <роль> <текст задачі>\nПриклад: /assign mykyta Проаналізуй 3 конкурентів");
  const [, targetRole, taskText] = parts;
  if (!ROLES[targetRole] || targetRole === role) return ctx.reply("❌ Невірна роль або сам собі.");

  const target = await getUserByRole(prisma, targetRole);
  if (!target) return ctx.reply(`❌ ${ROLES[targetRole]} ще не в системі.`);

  await prisma.task.create({
    data: { day: day + 1, text: taskText, ownerId: target.telegramId, type: 'assigned', assignedById: userId, assignedAt: new Date() },
  });
  await addXP(prisma, userId, XP_REWARDS.ASSIGN_TASK, 'assign');
  ctx.reply(`✅ Задача призначена для *${ROLES[targetRole]}* на завтра:\n"${taskText}"`, { parse_mode: 'Markdown' });
  try { await bot.telegram.sendMessage(target.telegramId, `📌 *${ROLES[role]}* призначив тобі задачу на завтра:\n"${taskText}"`, { parse_mode: 'Markdown' }); } catch(e) {}
});

// Pending confirm state
const pendingConfirm = {};

const handleDoneTask = async (ctx, taskNum, isAssigned = false, assignedTaskId = null) => {
  const userId = ctx.from.id.toString();
  const role = await getRoleByUserId(prisma, userId);
  const day = await getCurrentDay(prisma);
  if (!day || !role) return ctx.reply("❌ Помилка.");

  let taskId, taskText;
  if (isAssigned && assignedTaskId) {
    const t = await prisma.task.findUnique({ where: { id: assignedTaskId } });
    if (!t || t.done) return ctx.reply("✅ Вже зроблено!");
    taskId = t.id; taskText = t.text;
  } else {
    const myTasks = TASKS[day].tasks.filter(t => t.owner === role);
    if (taskNum < 0 || taskNum >= myTasks.length) return ctx.reply("❌ Невірний номер.");
    const task = myTasks[taskNum];
    const progress = await getDayProgress(prisma, day);
    if (progress[task.id]?.done) return ctx.reply("✅ Вже зроблено!");
    taskId = task.id; taskText = task.text;
  }

  pendingConfirm[userId] = { day, taskId, taskText, isAssigned };
  await ctx.reply(`⏳ "${taskText.substring(0, 60)}..."\n\n📸 *Надішли фото або документ для пруфу!*`, { parse_mode: 'Markdown' });
};

// Inline button handlers
bot.action(/done_(\d+)/, async (ctx) => { await ctx.answerCbQuery(); handleDoneTask(ctx, parseInt(ctx.match[1])); });
bot.action(/adone_(.+)/, async (ctx) => { await ctx.answerCbQuery(); handleDoneTask(ctx, 0, true, ctx.match[1]); });
bot.command('done', (ctx) => { const n = parseInt(ctx.message.text.split(' ')[1]); if (isNaN(n)) return ctx.reply("/done <номер>"); handleDoneTask(ctx, n - 1); });

// Photo/document proof handlers
async function handleProof(ctx, userId) {
  const role = await getRoleByUserId(prisma, userId);
  if (!pendingConfirm[userId]) return;
  const { day, taskId, taskText, isAssigned } = pendingConfirm[userId];

  // Check if task exists in DB or create
  const existing = await prisma.task.findUnique({ where: { id: taskId } });
  if (existing) {
    await prisma.task.update({ where: { id: taskId }, data: { done: true, completedAt: new Date() } });
  } else {
    const dayData = TASKS[day]?.tasks.find(x => x.id === taskId);
    if (dayData) {
      await prisma.task.create({ data: { id: taskId, day, text: dayData.text, done: true, completedAt: new Date(), ownerId: userId, type: 'primary' } });
    }
  }
  delete pendingConfirm[userId];

  const xpAmount = isAssigned ? XP_REWARDS.ASSIGNED_TASK : XP_REWARDS.PRIMARY_TASK;
  const result = await addXP(prisma, userId, xpAmount, 'task_done');
  const { done, total, pct } = await getDayPercent(prisma, TASKS, day);

  let reply = `${random(DONE_PHRASES)}\n\n📊 ${done}/${total} (${pct}%) | ⚡ +${xpAmount} XP`;
  if (result.leveledUp) reply += `\n\n🎉 *LEVEL UP!* Тепер ти Level ${result.level}!`;
  await ctx.reply(reply, { parse_mode: 'Markdown' });

  if (done === total) await broadcastToTeam(bot, prisma, ADMIN_ID, `🏆 *ВСІ ЗАДАЧІ ДНЯ ${day} ВИКОНАНО!*\n\n${random(FULL_DONE_PHRASES)}`);
  await checkAchievements(prisma, bot, userId, ADMIN_ID);
  if (ADMIN_ID && userId !== ADMIN_ID) { try { await bot.telegram.sendMessage(ADMIN_ID, `✅ *${ROLES[role]}* здав: "${taskText.substring(0, 60)}..." | ${done}/${total}`, { parse_mode: 'Markdown' }); } catch(e) {} }
}

bot.on('photo', (ctx) => handleProof(ctx, ctx.from.id.toString()));
bot.on('document', (ctx) => handleProof(ctx, ctx.from.id.toString()));

// 📊 Прогрес команди
const progressHandler = async (ctx) => {
  const day = await getCurrentDay(prisma);
  if (!day) return ctx.reply("⏳ План ще не запущено.");
  const progress = await getDayProgress(prisma, day);
  const dayData = TASKS[day];
  let msg = `📊 *День ${day}: ${dayData.theme}*\n\n`;
  for (const role of ['taras', 'mykyta', 'nazar', 'maks']) {
    const myTasks = dayData.tasks.filter(t => t.owner === role);
    if (myTasks.length === 0) continue;
    const doneTasks = myTasks.filter(t => progress[t.id]?.done);
    const user = await getUserByRole(prisma, role);
    msg += `*${ROLES[role]}:* ${doneTasks.length}/${myTasks.length} ${doneTasks.length === myTasks.length ? '✅' : '🔲'} | XP: ${user?.xpTotal || 0}\n`;
  }
  const { done, total, pct } = await getDayPercent(prisma, TASKS, day);
  msg += `\n━━━━━━━━━━━━━━━\n🔥 Загалом: ${done}/${total} (${pct}%)`;
  await ctx.reply(msg, { parse_mode: 'Markdown' });
};

// Admin handlers
const reportHandler = async (ctx) => {
  if (ctx.from.id.toString() !== ADMIN_ID) return;
  const day = await getCurrentDay(prisma); if (!day) return ctx.reply("⏳");
  const progress = await getDayProgress(prisma, day);
  let msg = `📋 *Звіт — День ${day}*\n\n`;
  for (const t of TASKS[day].tasks) { msg += `${progress[t.id]?.done ? '✅' : '❌'} [${ROLES[t.owner]}] ${t.text.substring(0, 60)}...\n\n`; }
  await ctx.reply(msg, { parse_mode: 'Markdown' });
};

const teamHandler = async (ctx) => {
  if (ctx.from.id.toString() !== ADMIN_ID) return;
  const users = await prisma.user.findMany();
  let msg = `👥 *Команда BoosterTea v2.0:*\n\n`;
  for (const u of users) { msg += `*${ROLES[u.role] || u.role}:* ID ${u.telegramId} | XP: ${u.xpTotal} | Lv ${u.level} | 🔥${u.streakDays}\n`; }
  await ctx.reply(msg, { parse_mode: 'Markdown' });
};

// ─── REGISTER HANDLERS ─────────────────────────────
bot.command('tasks', tasksHandler);
bot.action('menu_tasks', async (ctx) => { await ctx.answerCbQuery(); tasksHandler(ctx); });
bot.command('progress', progressHandler);
bot.action('menu_progress', async (ctx) => { await ctx.answerCbQuery(); progressHandler(ctx); });
bot.command('startplan', startplanHandler);
bot.action('menu_startplan', async (ctx) => { await ctx.answerCbQuery(); startplanHandler(ctx); });
bot.command('report', reportHandler);
bot.action('menu_report', async (ctx) => { await ctx.answerCbQuery(); reportHandler(ctx); });
bot.command('team', teamHandler);
bot.action('menu_team', async (ctx) => { await ctx.answerCbQuery(); teamHandler(ctx); });

bot.command('notion_sync', async (ctx) => {
  const userId = ctx.from.id.toString();
  await ctx.reply("🔄 Ініціюю Neural Sync з Notion...");
  const answer = await askGemini(userId, "Проаналізуй всі мої задачі в Notion і онови їх статуси якщо потрібно. Використай tools.");
  await ctx.reply(`🧠 ${answer}`, { parse_mode: 'Markdown' });
});

bot.action('menu_ai', async (ctx) => {
  await ctx.answerCbQuery();
  ctx.reply("🧠 Валєра на зв'язку! Пиши прямо сюди, я слухаю.");
});

// Free text → Gemini (з збереженням історії)
bot.on('text', async (ctx) => {
  const text = ctx.message.text;
  if (text.startsWith('/') || text.startsWith('📜') || text.startsWith('📋') || text.startsWith('📊') || text.startsWith('🤖') || text.startsWith('📈') || text.startsWith('👥') || text.startsWith('🚀') || text.startsWith('🎯')) return;
  const userId = ctx.from.id.toString();
  const role = await getRoleByUserId(prisma, userId);
  const day = await getCurrentDay(prisma);
  const extra = role && day ? `Учасник: ${ROLES[role]}. День: ${day}. Тема: ${TASKS[day]?.theme}` : '';

  // Intermediary Loader logic (every 3rd user message)
  const msgCount = await prisma.chatMessage.count({ where: { userId, msgRole: 'user' } });
  let waitMsgId = null;
  if ((msgCount + 1) % 3 === 0) {
    const sent = await ctx.reply(`🕒 _${random(WAITING_PHRASES)}_`, { parse_mode: 'Markdown' });
    waitMsgId = sent.message_id;
  }

  const answer = await askGemini(userId, text, extra);

  if (waitMsgId) {
    try { await ctx.telegram.deleteMessage(ctx.chat.id, waitMsgId); } catch(e) {}
  }

  if (answer) await ctx.reply(`🧠 ${answer}`, { parse_mode: 'Markdown' });
});

// File & Audio Interceptors (Block 8.1 Optimization)
bot.on(['voice', 'audio'], async (ctx) => {
  await ctx.reply("🎙 Я не обробляю аудіо щоб економити ресурси ШІ. Використай Telegram Premium транскрипцію (кнопка 'A') і відправ мені сформований текст.");
});

bot.on('document', async (ctx) => {
  await ctx.reply("📂 Файли (PDF, Docx, Excel) не приймаються для збереження пам'яті. Зроби скріншот/фото і надішли картинкою.");
});

// ═══════════════════════════════════════════════════
// CRON JOBS
// ═══════════════════════════════════════════════════

// 08:00 — Morning brief (3🔵 + 2🟠)
cron.schedule('0 8 * * *', async () => {
  const day = await getCurrentDay(prisma); if (!day) return;
  const dayData = TASKS[day]; if (!dayData) return;
  const users = await prisma.user.findMany();
  for (const user of users) {
    const myTasks = dayData.tasks.filter(t => t.owner === user.role);
    const assigned = await prisma.task.findMany({ where: { ownerId: user.telegramId, day, type: 'assigned' }, include: { assignedBy: true } });
    let msg = `☀️ *Доброго ранку, ${ROLES[user.role]}!*\nДень ${day}: ${dayData.theme}\n\n🔵 *ОСНОВНІ (Твої цілі 13WSM13):*\n`;
    myTasks.forEach((t, i) => { msg += `${i + 1}. ${t.text}\n\n`; });
    if (assigned.length > 0) {
      msg += `🟠 *КРОС-ЗАДАЧІ:*\n`;
      assigned.forEach(t => { const by = t.assignedBy ? ROLES[t.assignedBy.role] : '?'; msg += `📌 від ${by}: ${t.text}\n\n`; });
    }
    msg += `🎯 План на сьогодні. Ніякої мультизадачності. Відкрий TWA -> Обери 1 -> Box Breathing -> Фокус. ⚡`;
    try { await bot.telegram.sendMessage(user.telegramId, msg, { parse_mode: 'Markdown' }); } catch(e) {}
  }
}, { timezone: 'Europe/Kiev' });

// 10:30 — Flow Positive Check (Microburst)
cron.schedule('30 10 * * *', async () => {
  const day = await getCurrentDay(prisma); if (!day) return;
  const users = await prisma.user.findMany();
  for (const user of users) {
    const progress = await getDayProgress(prisma, day);
    const myTasks = TASKS[day].tasks.filter(t => t.owner === user.role);
    const myDone = myTasks.filter(t => progress[t.id]?.done).length;
    
    if (myDone > 0) {
      try { await bot.telegram.sendMessage(user.telegramId, `⚡ *${ROLES[user.role]}!* Ти вже знищив ${myDone} задачі! Швидкий старт = більше дофаміну. Так тримати! 🏆`, { parse_mode: 'Markdown' }); } catch(e) {}
    } else {
      try { await bot.telegram.sendMessage(user.telegramId, `⏳ *${ROLES[user.role]}*, час запустити 13-хвилинний таймер. Зроби найпростішу задачу прямо зараз, щоб зловити потік. 🌊`, { parse_mode: 'Markdown' }); } catch(e) {}
    }
  }
}, { timezone: 'Europe/Kiev' });

// 11:00 — Academy & Learning Check
cron.schedule('0 11 * * *', async () => {
  const users = await prisma.user.findMany({ where: { role: { in: TEAM_ROLES } } });
  for (const user of users) {
    const pendingResources = await prisma.userResource.count({
      where: { userId: user.telegramId, status: { not: 'done' } }
    });
    // Check if they need to test skills
    const unassessed = await prisma.userSkill.count({
      where: { userId: user.telegramId, currentLevel: { lt: 5 } }
    });

    if (pendingResources > 0 || unassessed > 0) {
      const msg = `🧠 *ACADEMY REMINDER*\n\n${ROLES[user.role]}, у тебе є непрочитані матеріали: ${pendingResources} шт. або непідтверджені скіли.\nВитрать 15 хвилин на навчання прямо зараз. Відкрий вкладку Command -> Academy.`;
      try { await bot.telegram.sendMessage(user.telegramId, msg, { parse_mode: 'Markdown' }); } catch(e) {}
    }
  }
}, { timezone: 'Europe/Kiev' });

// 13:00 — Midday check (Positive evaluation)
cron.schedule('0 13 * * *', async () => {
  const day = await getCurrentDay(prisma); if (!day) return;
  const users = await prisma.user.findMany();
  for (const user of users) {
    const myTasks = TASKS[day].tasks.filter(t => t.owner === user.role);
    const progress = await getDayProgress(prisma, day);
    const myDone = myTasks.filter(t => progress[t.id]?.done).length;
    const pct = Math.round((myDone / myTasks.length) * 100);
    const msg = pct === 100 ? `🔥 *${ROLES[user.role]}*, ти машина! 100% закрито. Можеш братися за саморозвиток (Academy) або чілити. 🏆` :
      pct < 40 ? `💡 *${ROLES[user.role]}*, половина дня позаду. Якщо відчуваєш 'Стіну' (Executive Dysfunction) — зроби дихальну практику в Academy. Давай заберемо хоча б 1 маленьку перемогу! 🚀` :
      `📈 *${ROLES[user.role]}*, ${myDone}/${myTasks.length} вже в скарбничці! Ти в правильному ритмі, дотискай. ⚡`;
    try { await bot.telegram.sendMessage(user.telegramId, msg, { parse_mode: 'Markdown' }); } catch(e) {}
  }
}, { timezone: 'Europe/Kiev' });

// 15:00 — Hard push (Neuro-friendly focus)
cron.schedule('0 15 * * *', async () => {
  const day = await getCurrentDay(prisma); if (!day) return;
  const users = await prisma.user.findMany();
  for (const user of users) {
    const myTasks = TASKS[day].tasks.filter(t => t.owner === user.role);
    const progress = await getDayProgress(prisma, day);
    const myDone = myTasks.filter(t => progress[t.id]?.done).length;
    if (Math.round((myDone / myTasks.length) * 100) < 100) {
      try { await bot.telegram.sendMessage(user.telegramId, `🎯 *${ROLES[user.role]}* — ОСТАННІЙ РИВОК!\nЗгадай Стоїків. 'Ти маєш контроль тільки над своїми діями прямо зараз'.\nВмикай 13WSM13, вимикай телефон. Час забирати свій Дофамін! 💥`, { parse_mode: 'Markdown' }); } catch(e) {}
    }
  }
}, { timezone: 'Europe/Kiev' });

// 16:00 — Deadline + Penalty
cron.schedule('0 16 * * *', async () => {
  const day = await getCurrentDay(prisma); if (!day) return;
  const users = await prisma.user.findMany();
  for (const user of users) {
    const myTasks = TASKS[day].tasks.filter(t => t.owner === user.role);
    const progress = await getDayProgress(prisma, day);
    const undone = myTasks.filter(t => !progress[t.id]?.done);
    if (undone.length === 0) {
      await prisma.user.update({ where: { telegramId: user.telegramId }, data: { streakDays: { increment: 1 } } });
      try { await bot.telegram.sendMessage(user.telegramId, `✅ *${ROLES[user.role]}* — ІДЕАЛ! Streak: 🔥${user.streakDays + 1} 🏆`, { parse_mode: 'Markdown' }); } catch(e) {}
    } else {
      await prisma.penalty.create({ data: { userId: user.telegramId, type: 'missed_deadline', description: `${undone.length} задач не виконано`, xpPenalty: Math.abs(XP_PENALTIES.MISSED_DEADLINE), day } });
      await addXP(prisma, user.telegramId, XP_PENALTIES.MISSED_DEADLINE, 'penalty');
      await prisma.user.update({ where: { telegramId: user.telegramId }, data: { streakDays: 0 } });
      let msg = `🕓 16:00 — ДЕДЛАЙН!\n\n*${ROLES[user.role]}*, невиконані:\n\n`;
      undone.forEach(t => { msg += `❌ ${t.text.substring(0, 70)}...\n\n`; });
      msg += `⚠️ Штраф: ${XP_PENALTIES.MISSED_DEADLINE} XP. Streak скинуто.`;
      try { await bot.telegram.sendMessage(user.telegramId, msg, { parse_mode: 'Markdown' }); } catch(e) {}
    }
    // DailyReport
    const donePrimary = myTasks.filter(t => progress[t.id]?.done).length;
    const assignedTasks = await prisma.task.findMany({ where: { ownerId: user.telegramId, day, type: 'assigned' } });
    const doneAssigned = assignedTasks.filter(t => t.done).length;
    await prisma.dailyReport.upsert({
      where: { userId_day: { userId: user.telegramId, day } },
      update: { primaryDone: donePrimary, assignedDone: doneAssigned },
      create: { userId: user.telegramId, day, primaryDone: donePrimary, assignedDone: doneAssigned },
    });
  }
}, { timezone: 'Europe/Kiev' });

// 17:00 — Assign time
cron.schedule('0 17 * * *', async () => {
  const day = await getCurrentDay(prisma); if (!day) return;
  const users = await prisma.user.findMany({ where: { role: { in: TEAM_ROLES } } });
  for (const user of users) {
    const others = getOtherTeamRoles(user.role);
    const assigned = await prisma.task.findMany({ where: { assignedById: user.telegramId, day: day + 1, type: 'assigned' } });
    const pendingNames = [];
    for (const other of others) {
      const target = await getUserByRole(prisma, other);
      if (target && !assigned.find(a => a.ownerId === target.telegramId)) pendingNames.push(ROLES[other]);
    }
    if (pendingNames.length > 0) {
      try { await bot.telegram.sendMessage(user.telegramId, `🎯 *Час призначити задачі на завтра!*\n\nТи ще не призначив для: *${pendingNames.join(', ')}*\n\nНапиши: /assign <роль> <задача>`, { parse_mode: 'Markdown' }); } catch(e) {}
    }
  }
}, { timezone: 'Europe/Kiev' });

// 18:00, 19:00, 20:00 — Reminders
for (const hour of [18, 19, 20]) {
  cron.schedule(`0 ${hour} * * *`, async () => {
    const day = await getCurrentDay(prisma); if (!day) return;
    const users = await prisma.user.findMany({ where: { role: { in: TEAM_ROLES } } });
    for (const user of users) {
      const assigned = await prisma.task.count({ where: { assignedById: user.telegramId, day: day + 1, type: 'assigned' } });
      if (assigned < 2) {
        try { await bot.telegram.sendMessage(user.telegramId, ASSIGN_REMINDERS[hour - 17] || ASSIGN_REMINDERS[0], { parse_mode: 'Markdown' }); } catch(e) {}
      }
    }
  }, { timezone: 'Europe/Kiev' });
}

// 19:30 — Obligations & Syndicate Matrix
cron.schedule('30 19 * * *', async () => {
  const users = await prisma.user.findMany({ where: { role: { in: TEAM_ROLES } } });
  for (const user of users) {
    try { 
      await bot.telegram.sendMessage(user.telegramId, `⚖️ *ЗОБОВ'ЯЗАННЯ & СИНДИКАТ*\n\nВечірній чек-ін. Проаналізуй свій соціальний капітал.\nЧи є в тебе на прикметі інвестори або B2B ліди?\nПройди 'Опитувальник/Бар'єри' у вкладці Syndicate, якщо відчуваєш страх продавати.`, { parse_mode: 'Markdown' }); 
    } catch(e) {}
  }
}, { timezone: 'Europe/Kiev' });

// 21:00 — End of day + alarm to admin
cron.schedule('0 21 * * *', async () => {
  const day = await getCurrentDay(prisma); if (!day) return;
  const users = await prisma.user.findMany({ where: { role: { in: TEAM_ROLES } } });
  const lazyOnes = [];
  for (const user of users) {
    const assigned = await prisma.task.count({ where: { assignedById: user.telegramId, day: day + 1, type: 'assigned' } });
    if (assigned < 2) {
      lazyOnes.push(ROLES[user.role]);
      await prisma.penalty.create({ data: { userId: user.telegramId, type: 'no_assign', description: 'Не призначив задачі', xpPenalty: Math.abs(XP_PENALTIES.NO_ASSIGN), day } });
      await addXP(prisma, user.telegramId, XP_PENALTIES.NO_ASSIGN, 'no_assign');
    }
  }
  if (lazyOnes.length > 0 && ADMIN_ID) {
    try { await bot.telegram.sendMessage(ADMIN_ID, `🚨 *ALARM!* Не призначили задачі: ${lazyOnes.join(', ')}`, { parse_mode: 'Markdown' }); } catch(e) {}
  }
  await broadcastToTeam(bot, prisma, ADMIN_ID, `🌙 *На сьогодні все!*\nЗавтра — День ${Math.min(day + 1, 14)}. Відпочиньте 🍵`);
}, { timezone: 'Europe/Kiev' });

// ═══════════════════════════════════════════════════
// EXPRESS + LAUNCH
// ═══════════════════════════════════════════════════
const app = express();
app.use(cors());
app.use(express.json());
setupAPI(app, prisma, bot, TASKS, ADMIN_ID, askGemini);
app.listen(PORT, () => console.log(`🚀 Express v2.0 на порту ${PORT}`));

bot.catch(async (err, ctx) => {
  console.error(`Telegraf error:`, err);
  if (ADMIN_ID) { try { await bot.telegram.sendMessage(ADMIN_ID, `🚨 *BOT CRASH*\n${err.message}`, { parse_mode: 'Markdown' }); } catch(e){} }
});

bot.launch().then(() => {
  console.log('🤖 BoosterTea Command System v2.0 запущений!');
  console.log(`Gemini: ${GEMINI_KEY ? '✅' : '❌'} | Port: ${PORT}`);
}).catch(e => console.error('❌', e));

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
