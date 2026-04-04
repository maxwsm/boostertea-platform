// lib/xp.js — XP & Achievement Engine

const XP_REWARDS = {
  PRIMARY_TASK:   10,   // Основна задача виконана
  ASSIGNED_TASK:  15,   // Призначена задача виконана (більше бо trust)
  SKILL_TASK:     25,   // Skill-задача
  ASSIGN_TASK:    5,    // Призначив задачу іншому
  RESOURCE_DONE:  5,    // Ресурс опрацьовано
  CONTACT_ADDED:  3,    // Новий контакт в CRM
  PERFECT_DAY:    50,   // 5/5 задач
  EARLY_FINISH:   25,   // Всі до 13:00
};

const XP_PENALTIES = {
  MISSED_DEADLINE:  -20,  // Не закрив до 16:00
  NO_PROOF:         -10,  // Без пруфу
  NO_ASSIGN:        -15,  // Не призначив задачі
  LATE_ASSIGN:      -5,   // Призначив після 20:00
};

const XP_PER_LEVEL = 100; // XP для level up

function calculateLevel(xpTotal) {
  return Math.max(1, Math.floor(xpTotal / XP_PER_LEVEL) + 1);
}

async function addXP(prisma, userId, amount, source) {
  const user = await prisma.user.update({
    where: { telegramId: userId },
    data: {
      xpTotal: { increment: amount },
      lastActiveAt: new Date(),
    },
  });

  // Recalculate level
  const newLevel = calculateLevel(user.xpTotal);
  if (newLevel !== user.level) {
    await prisma.user.update({
      where: { telegramId: userId },
      data: { level: newLevel },
    });
    return { xpTotal: user.xpTotal, level: newLevel, leveledUp: true };
  }

  return { xpTotal: user.xpTotal, level: user.level, leveledUp: false };
}

async function addSkillXP(prisma, userId, skillId, amount) {
  const us = await prisma.userSkill.findUnique({
    where: { userId_skillId: { userId, skillId } },
  });

  if (!us) return null;

  const updated = await prisma.userSkill.update({
    where: { id: us.id },
    data: {
      xp: { increment: amount },
      currentLevel: Math.min(100, us.currentLevel + Math.floor(amount / 5)),
      lastPracticedAt: new Date(),
    },
  });

  return updated;
}

// Check and award achievements
async function checkAchievements(prisma, bot, userId, ADMIN_ID) {
  const user = await prisma.user.findUnique({
    where: { telegramId: userId },
    include: { achievements: true },
  });
  if (!user) return [];

  const earned = user.achievements.map(a => a.achievementId);
  const allAchievements = await prisma.achievement.findMany();
  const newlyEarned = [];

  for (const ach of allAchievements) {
    if (earned.includes(ach.id)) continue;

    const cond = JSON.parse(ach.condition);
    let met = false;

    switch (cond.type) {
      case 'task_count': {
        const count = await prisma.task.count({ where: { ownerId: userId, done: true } });
        met = count >= cond.value;
        break;
      }
      case 'perfect_day': {
        const reports = await prisma.dailyReport.findMany({ where: { userId } });
        met = reports.some(r => r.primaryDone + r.assignedDone >= 5);
        break;
      }
      case 'streak': {
        met = user.streakDays >= cond.value;
        break;
      }
      case 'skills_selected': {
        const selected = await prisma.userSkill.count({ where: { userId, selected: true } });
        met = selected >= cond.value;
        break;
      }
      case 'level': {
        met = user.level >= cond.value;
        break;
      }
      case 'assign_count': {
        const assigned = await prisma.task.count({ where: { assignedById: userId } });
        met = assigned >= cond.value;
        break;
      }
      case 'contact_count': {
        const contacts = await prisma.contact.count({ where: { createdById: userId } });
        met = contacts >= cond.value;
        break;
      }
      case 'chat_sessions': {
        const sessions = await prisma.chatMessage.findMany({
          where: { userId, msgRole: 'user' },
          distinct: ['sessionId'],
        });
        met = sessions.length >= cond.value;
        break;
      }
      case 'resources_done': {
        const res = await prisma.userResource.count({ where: { userId, status: 'done' } });
        met = res >= cond.value;
        break;
      }
    }

    if (met) {
      await prisma.userAchievement.create({
        data: { userId, achievementId: ach.id },
      });
      await addXP(prisma, userId, ach.xpReward, `achievement:${ach.slug}`);
      newlyEarned.push(ach);

      // Notify user
      try {
        await bot.telegram.sendMessage(userId,
          `🏆 *ДОСЯГНЕННЯ!*\n\n${ach.icon} *${ach.name}*\n${ach.description}\n\n+${ach.xpReward} XP 🎉`,
          { parse_mode: 'Markdown' }
        );
      } catch(e) {}
    }
  }

  return newlyEarned;
}

module.exports = {
  XP_REWARDS, XP_PENALTIES, XP_PER_LEVEL,
  calculateLevel, addXP, addSkillXP, checkAchievements,
};
