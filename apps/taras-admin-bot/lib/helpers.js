// lib/helpers.js — Shared helpers для бота та API

const ROLES = { taras: 'Тарас (13WSM13)', mykyta: 'Микита (BoosterTea)', nazar: 'Назар (BoosterTea)', maks: 'Макс (Dev)', andryuha: 'Андрій (Neural Nomad)', kristaps: 'Крістапс (Neural Nomad)' };
const ROLE_KEYS = Object.keys(ROLES);
const TEAM_ROLES = ['taras', 'mykyta', 'nazar']; // Без maks та andryuha для 3+2

async function getRoleByUserId(prisma, userId) {
  if (!userId) return null;
  if (process.env.ANDRYUHA_ID && userId.toString() === process.env.ANDRYUHA_ID.toString()) {
    return 'andryuha'; 
  }
  const user = await prisma.user.findUnique({ where: { telegramId: userId.toString() } });
  return user ? user.role : null;
}

async function getUserByRole(prisma, role) {
  return prisma.user.findFirst({ where: { role } });
}

async function getCurrentDay(prisma) {
  const setting = await prisma.settings.findUnique({ where: { key: 'startDate' } });
  if (!setting) return null;
  const diffMs = Date.now() - new Date(setting.value).getTime();
  const day = Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;
  return Math.max(1, Math.min(day, 14));
}

async function getDayProgress(prisma, day) {
  const tasks = await prisma.task.findMany({ where: { day, done: true } });
  const progress = {};
  tasks.forEach(t => progress[t.id] = { done: true, completedAt: t.completedAt });
  return progress;
}

async function getDayPercent(prisma, TASKS, day) {
  const dayTasks = TASKS[day]?.tasks || [];
  if (dayTasks.length === 0) return { done: 0, total: 0, pct: 0 };
  const doneTasks = await prisma.task.count({ where: { day, done: true } });
  return { done: doneTasks, total: dayTasks.length, pct: Math.round((doneTasks / dayTasks.length) * 100) };
}

async function broadcastToTeam(bot, prisma, ADMIN_ID, message) {
  const users = await prisma.user.findMany();
  const ids = new Set([...users.map(u => u.telegramId), ADMIN_ID].filter(Boolean));
  for (const id of ids) {
    try { await bot.telegram.sendMessage(id, message, { parse_mode: 'Markdown' }); } catch(e) {}
  }
}

// Отримати роль (яка НЕ цей юзер) для 3+2
function getOtherTeamRoles(myRole) {
  return TEAM_ROLES.filter(r => r !== myRole);
}

module.exports = {
  ROLES, ROLE_KEYS, TEAM_ROLES,
  getRoleByUserId, getUserByRole, getCurrentDay,
  getDayProgress, getDayPercent, broadcastToTeam, getOtherTeamRoles,
};
