// api/routes.js — Express API endpoints для TWA
const { ROLES, getRoleByUserId, getCurrentDay, getDayProgress, getDayPercent } = require('../lib/helpers');
const { addXP, addSkillXP, XP_REWARDS, checkAchievements } = require('../lib/xp');
const { getQuestionsForSkill } = require('../lib/quiz_db');

function setupAPI(app, prisma, bot, TASKS, ADMIN_ID, askGemini) {

  // ─── LEADS ──────────────────────────────────────────
  app.post('/api/leads', async (req, res) => {
    try {
      const { name, phone, product, total, url } = req.body;
      const message = `🚨 <b>НОВИЙ ЛІД!</b>\n\n👤 <b>Ім'я:</b> ${name || '—'}\n📞 <b>Телефон:</b> ${phone || '—'}\n📦 <b>Товар:</b> ${product || '—'}\n💰 <b>Сума:</b> ${total ? total + ' грн' : '—'}\n🔗 <b>Джерело:</b> ${url || 'Сайт'}`;
      const users = await prisma.user.findMany();
      const ids = new Set([...users.map(u => u.telegramId), ADMIN_ID].filter(Boolean));
      for (const id of ids) { try { await bot.telegram.sendMessage(id, message, { parse_mode: 'HTML' }); } catch(e) {} }
      res.json({ success: true });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
  });

  // ─── TWA DASHBOARD ──────────────────────────────────
  app.get('/api/twa/dashboard', async (req, res, next) => {
    try {
      const { userId } = req.query;
      if (!userId) return res.status(400).json({ error: 'Missing userId' });
      const role = await getRoleByUserId(prisma, userId);
      if (!role) return res.json({ error: 'Не в команді' });
      const day = await getCurrentDay(prisma) || 1;
      const dayData = TASKS[day] || { theme: "ПЛАН ЗАВЕРШЕНО", tasks: [] };
      const progress = await getDayProgress(prisma, day);

      // Primary tasks (from 14-day plan)
      const myTasks = dayData.tasks.filter(t => t.owner === role).map(t => ({ ...t, done: !!progress[t.id]?.done, type: 'primary' }));

      // Assigned tasks (from other team members)
      const assignedTasks = await prisma.task.findMany({
        where: { ownerId: userId, day, type: 'assigned' },
        include: { assignedBy: true },
      });

      const user = await prisma.user.findUnique({ where: { telegramId: userId } });
      const { pct } = await getDayPercent(prisma, TASKS, day);

      res.json({
        role: ROLES[role] || role, day, theme: dayData.theme,
        myTasks, assignedTasks,
        xp: user?.xpTotal || 0, level: user?.level || 1, streak: user?.streakDays || 0,
        progressPct: pct,
      });
    } catch(e) { next(e); }
  });

  // ─── TWA DONE ───────────────────────────────────────
  app.post('/api/twa/done', async (req, res, next) => {
    try {
      const { userId, taskId } = req.body;
      const role = await getRoleByUserId(prisma, userId);
      const day = await getCurrentDay(prisma);
      if (!role || !day) return res.status(400).json({ error: 'Помилка' });

      const existing = await prisma.task.findUnique({ where: { id: taskId } });
      if (existing) {
        await prisma.task.update({ where: { id: taskId }, data: { done: true, completedAt: new Date() } });
      } else {
        const dayData = TASKS[day]?.tasks.find(x => x.id === taskId);
        if (dayData) {
          await prisma.task.create({ data: { id: taskId, day, text: dayData.text, done: true, completedAt: new Date(), ownerId: userId, type: 'primary' } });
        }
      }

      const xpAmount = existing?.type === 'assigned' ? XP_REWARDS.ASSIGNED_TASK : XP_REWARDS.PRIMARY_TASK;
      let result = await addXP(prisma, userId, xpAmount, 'task_done');
      
      // Easter Egg: +5 extra tasks done
      if (existing?.type === 'assigned') {
        const doneAssignedCount = await prisma.task.count({
          where: { ownerId: userId, day, type: 'assigned', done: true }
        });
        if (doneAssignedCount === 5) {
          result = await addXP(prisma, userId, 1000, 'easter_egg_premium');
          try {
            await bot.telegram.sendMessage(userId, `🥚 *ПАСХАЛКА ВІДКРИТА!*\nТи виконав 5 додаткових задач за день! Це режим машини.\nНагорода: +1000 XP та бонусні преміальні поінти на розгляд CEO. 🚀`, { parse_mode: 'Markdown' });
            if (ADMIN_ID) {
              await bot.telegram.sendMessage(ADMIN_ID, `🥚 *ПАСХАЛКА ЗНАЙДЕНА!*\nКористувач: ${ROLES[role] || role}\nВиконав 5 додаткових (assigned) задач за день. Він лутає +1000 XP!`, { parse_mode: 'Markdown' });
            }
          } catch(e) {}
        }
      }

      await checkAchievements(prisma, bot, userId, ADMIN_ID);

      res.json({ success: true, xp: result.xpTotal, level: result.level, leveledUp: result.leveledUp });
    } catch(e) { next(e); }
  });

  // ─── ASSIGN (3+2 system) ────────────────────────────
  app.post('/api/twa/assign', async (req, res, next) => {
    try {
      const { userId, targetRole, text } = req.body;
      const day = await getCurrentDay(prisma);
      if (!day) return res.status(400).json({ error: 'План не запущено' });

      const targetUser = await prisma.user.findFirst({ where: { role: targetRole } });
      if (!targetUser) return res.status(400).json({ error: 'Юзер не знайдений' });

      const task = await prisma.task.create({
        data: { day: day + 1, text, ownerId: targetUser.telegramId, type: 'assigned', assignedById: userId, assignedAt: new Date() },
      });
      await addXP(prisma, userId, XP_REWARDS.ASSIGN_TASK, 'assign_task');
      res.json({ success: true, taskId: task.id });
    } catch(e) { next(e); }
  });

  app.get('/api/twa/assign/pending', async (req, res, next) => {
    try {
      const { userId } = req.query;
      const role = await getRoleByUserId(prisma, userId);
      const day = await getCurrentDay(prisma);
      if (!role || !day) return res.json({ pending: [] });
      const { getOtherTeamRoles } = require('../lib/helpers');
      const others = getOtherTeamRoles(role);
      const assigned = await prisma.task.findMany({ where: { assignedById: userId, day: day + 1, type: 'assigned' } });
      const assignedRoles = [];
      for (const t of assigned) {
        const u = await prisma.user.findUnique({ where: { telegramId: t.ownerId } });
        if (u) assignedRoles.push(u.role);
      }
      const pending = others.filter(r => !assignedRoles.includes(r));
      res.json({ pending: pending.map(r => ({ role: r, name: ROLES[r] })) });
    } catch(e) { next(e); }
  });

  // ─── SKILLS ─────────────────────────────────────────
  app.get('/api/twa/skills/categories', async (req, res, next) => {
    try {
      const cats = await prisma.skillCategory.findMany({ include: { skills: true }, orderBy: { sortOrder: 'asc' } });
      res.json(cats);
    } catch(e) { next(e); }
  });

  app.get('/api/twa/skills/my', async (req, res, next) => {
    try {
      const { userId } = req.query;
      const skills = await prisma.userSkill.findMany({ where: { userId }, include: { skill: { include: { category: true } } } });
      res.json(skills);
    } catch(e) { next(e); }
  });

  app.post('/api/twa/skills/select', async (req, res, next) => {
    try {
      const { userId, skillIds } = req.body;
      for (const skillId of skillIds) {
        await prisma.userSkill.upsert({
          where: { userId_skillId: { userId, skillId } },
          update: { selected: true },
          create: { userId, skillId, selected: true },
        });
      }
      await checkAchievements(prisma, bot, userId, ADMIN_ID);
      res.json({ success: true });
    } catch(e) { next(e); }
  });

  // ─── ASSESSMENT ─────────────────────────────────────
  app.get('/api/twa/assessment/questions', async (req, res, next) => {
    try {
      const { skillIds } = req.query; // comma separated
      if (!skillIds) return res.json({ questions: [] });
      
      const ids = skillIds.split(',');
      const skills = await prisma.skill.findMany({ where: { id: { in: ids } } });
      
      let allQuestions = [];
      skills.forEach(s => {
        let qs = getQuestionsForSkill(s.slug);
        qs = qs.map(q => ({ ...q, skillId: s.id, skillName: s.name })); // attach context
        allQuestions = allQuestions.concat(qs);
      });
      
      // Shuffle or format (remove correct answer id so client doesn't cheat if we wanted to be strict, but for MVP it's OK)
      res.json(allQuestions);
    } catch(e) { next(e); }
  });

  app.post('/api/twa/assessment/submit', async (req, res, next) => {
    try {
      const { userId, results } = req.body; // results: [{ skillId, level }]
      for (const r of results) {
        await prisma.userSkill.upsert({
          where: { userId_skillId: { userId, skillId: r.skillId } },
          update: { initialLevel: r.level, currentLevel: r.level },
          create: { userId, skillId: r.skillId, initialLevel: r.level, currentLevel: r.level },
        });
      }
      res.json({ success: true });
    } catch(e) { next(e); }
  });

  // ─── RESOURCES ──────────────────────────────────────
  app.get('/api/twa/resources', async (req, res, next) => {
    try {
      const { userId } = req.query;
      const role = await getRoleByUserId(prisma, userId);
      const resources = await prisma.resource.findMany({
        where: { OR: [{ targetRole: role }, { targetRole: 'all' }] },
        orderBy: { priority: 'asc' },
      });
      const checks = await prisma.userResource.findMany({ where: { userId } });
      const checksMap = {};
      checks.forEach(c => checksMap[c.resourceId] = c.status);
      res.json(resources.map(r => ({ ...r, status: checksMap[r.id] || 'pending' })));
    } catch(e) { next(e); }
  });

  app.post('/api/twa/resources/check', async (req, res, next) => {
    try {
      const { userId, resourceId, status } = req.body;
      await prisma.userResource.upsert({
        where: { userId_resourceId: { userId, resourceId } },
        update: { status, completedAt: status === 'done' ? new Date() : null },
        create: { userId, resourceId, status, completedAt: status === 'done' ? new Date() : null },
      });
      if (status === 'done') await addXP(prisma, userId, XP_REWARDS.RESOURCE_DONE, 'resource');
      res.json({ success: true });
    } catch(e) { next(e); }
  });

  // ─── CONTACTS CRM ───────────────────────────────────
  app.get('/api/twa/contacts', async (req, res, next) => {
    try {
      const { category, search } = req.query;
      const where = {};
      if (category) where.category = category;
      if (search) where.name = { contains: search };
      const contacts = await prisma.contact.findMany({ where, orderBy: { name: 'asc' }, include: { createdBy: true } });
      res.json(contacts);
    } catch(e) { next(e); }
  });

  app.post('/api/twa/contacts', async (req, res, next) => {
    try {
      const { userId, name, phone, email, company, contactRole, category, description, tags } = req.body;
      const contact = await prisma.contact.create({
        data: { name, phone, email, company, contactRole, category: category || 'other', description: description || '', tags: JSON.stringify(tags || []), createdById: userId },
      });
      await addXP(prisma, userId, XP_REWARDS.CONTACT_ADDED, 'contact');
      res.json(contact);
    } catch(e) { next(e); }
  });

  // ─── AI CHAT ────────────────────────────────────────
  app.get('/api/twa/chat/sessions', async (req, res, next) => {
    try {
      const { userId } = req.query;
      const msgs = await prisma.chatMessage.findMany({ where: { userId, msgRole: 'user' }, distinct: ['sessionId'], orderBy: { createdAt: 'desc' }, take: 20 });
      res.json(msgs.map(m => ({ sessionId: m.sessionId, preview: m.content.substring(0, 60), createdAt: m.createdAt })));
    } catch(e) { next(e); }
  });

  app.get('/api/twa/chat/session/:id', async (req, res, next) => {
    try {
      const msgs = await prisma.chatMessage.findMany({ where: { sessionId: req.params.id }, orderBy: { createdAt: 'asc' } });
      res.json(msgs);
    } catch(e) { next(e); }
  });

  app.post('/api/twa/chat/send', async (req, res, next) => {
    try {
      const { userId, text, sessionId } = req.body;
      const role = await getRoleByUserId(prisma, userId);
      const day = await getCurrentDay(prisma);
      const extra = role && day ? `Учасник: ${ROLES[role] || role}. День: ${day}.` : '';

      // Set custom sessionId in memory or pass through extra if askGemini didn't take sessionId natively.
      // wait, askGemini currently uses implicit logic. 
      // Let's pass sessionId directly via extra for now if not supported natively.
      // Easiest is to rely on existing askGemini and just append sessionId contextually or let askGemini handle DB.
      // The current askGemini gets sessionId if recent. We will let it use its own logic, BUT we inject this through askGemini.
      const answer = await askGemini(userId, text, extra, sessionId);
      
      res.json({ answer });
    } catch(e) { next(e); }
  });

  // Admin: Delete Chat Memory
  app.delete('/api/twa/chat/clear', async (req, res, next) => {
    try {
      const { userId } = req.body;
      await prisma.chatMessage.deleteMany({ where: { userId } });
      res.json({ success: true });
    } catch(e) { next(e); }
  });

  // ─── SYNDICATE / CAPITAL ────────────────────────────
  app.get('/api/twa/syndicate/overview', async (req, res, next) => {
    try {
      const { userId } = req.query;
      const user = await prisma.user.findUnique({ where: { telegramId: userId } });
      if (!user) return res.status(404).json({ error: 'User not found' });
      res.json({ 
        totalEarned: user.totalEarned, 
        royaltyCut: user.royaltyCut, 
        level: user.level,
        role: user.role
      });
    } catch(e) { next(e); }
  });

  app.post('/api/twa/syndicate/proposal', async (req, res, next) => {
    try {
      const { userId, type, payload } = req.body;
      const user = await prisma.user.findUnique({ where: { telegramId: userId } });
      const name = user ? (ROLES[user.role] || user.name || userId) : userId;

      let msg = '';
      if (type === 'loan') {
        msg = `💸 <b>НОВА ІНВЕСТИЦІЙНА ПРОПОЗИЦІЯ</b>\nВід: ${name}\nСума: $${payload.loan}\nСтавка: ${payload.rate}%\nВиплата в Місяць: $${payload.monthlyPayout}\nВиплата в Рік: $${payload.yearlyPayout}`;
      } else if (type === 'service') {
        msg = `🏢 <b>ПРОДАЖ B2B ПОСЛУГИ</b>\nВід: ${name}\nПакет: ${payload.packageName}\nОчікуваний %: $${payload.cutAmount}`;
      } else {
        msg = `❓ <b>СИНДИКАТ - ЗАПИТ</b>\nВід: ${name}\nДані: ${JSON.stringify(payload)}`;
      }

      if (ADMIN_ID) {
        try { await bot.telegram.sendMessage(ADMIN_ID, msg, { parse_mode: 'HTML' }); } catch(err) { console.error('TG Send Error:', err); }
      }
      res.json({ success: true });
    } catch(e) { next(e); }
  });

  app.post('/api/twa/syndicate/withdraw', async (req, res, next) => {
    try {
      const { userId, amount } = req.body;
      const user = await prisma.user.findUnique({ where: { telegramId: userId } });
      const name = user ? (ROLES[user.role] || user.name || userId) : userId;

      const msg = `💰 <b>ЗАПИТ НА ВИВЕДЕННЯ КЕШУ</b>\nВід: ${name}\nБажана Сума: $${amount}\nПоточний Баланс: $${user?.totalEarned || 0}`;
      
      if (ADMIN_ID) {
        try { await bot.telegram.sendMessage(ADMIN_ID, msg, { parse_mode: 'HTML' }); } catch(err) {}
      }
      res.json({ success: true });
    } catch(e) { next(e); }
  });

  // ─── ADMIN & LEADERBOARD ────────────────────────────
  app.get('/api/twa/admin/overview', async (req, res, next) => {
    try {
      const { userId } = req.query;
      const role = await getRoleByUserId(prisma, userId);
      const isAdmin = (role === 'taras' || role === 'maks' || role === 'andryuha' || userId === ADMIN_ID);

      const users = await prisma.user.findMany({ orderBy: { xpTotal: 'desc' } });
      const day = await getCurrentDay(prisma);
      
      const leaderboard = users.map(u => ({ id: u.telegramId, role: u.role, name: ROLES[u.role] || u.role, xp: u.xpTotal, level: u.level, streak: u.streakDays }));

      if (!isAdmin) {
        return res.json({ isAdmin: false, day, leaderboard });
      }

      // Detailed Admin Metrics 🔥 (CROSS-ASSIGN, PENALTIES)
      const openPenalties = await prisma.penalty.findMany({ where: { acknowledged: false }, include: { user: true }, orderBy: { createdAt: 'desc' } });
      
      // Fetch today's assignments
      const assignments = await prisma.task.findMany({
        where: { type: 'assigned', day: { gte: day } },
        include: { assignedBy: true, owner: true }
      });

      res.json({ 
        isAdmin: true, day, leaderboard, 
        openPenalties: openPenalties.map(p => ({ id: p.id, userName: ROLES[p.user.role], xpPenalty: p.xpPenalty, desc: p.description, day: p.day })),
        assignments: assignments.map(a => ({ id: a.id, text: a.text, from: ROLES[a.assignedBy?.role], to: ROLES[a.owner?.role], done: a.done, day: a.day }))
      });
    } catch(e) { next(e); }
  });

  // Admin: Forgive Penalty
  app.post('/api/twa/admin/penalties/:id/forgive', async (req, res, next) => {
    try {
      const { userId } = req.body;
      const role = await getRoleByUserId(prisma, userId);
      if (role !== 'taras' && role !== 'maks' && role !== 'andryuha' && userId !== ADMIN_ID) return res.status(403).json({error: 'Forbidden'});

      const penaltyId = req.params.id;
      const penalty = await prisma.penalty.findUnique({ where: { id: penaltyId } });
      if (!penalty) return res.status(404).json({error: 'Not found'});

      // Forgive: Mark acknowledged and refund XP
      await prisma.penalty.update({ where: { id: penaltyId }, data: { acknowledged: true, description: penalty.description + ' (АМНІСТІЯ)' } });
      await addXP(prisma, penalty.userId, penalty.xpPenalty, 'amnesty');
      
      try { await bot.telegram.sendMessage(penalty.userId, `🛡 *АМНІСТІЯ!*\nШтраф знято командою (Адмін). Повернено +${penalty.xpPenalty} XP. Життя дається один раз, не пройобуй.`, { parse_mode: 'Markdown' }); } catch(e){}

      res.json({ success: true });
    } catch(e) { next(e); }
  });

  // Admin: Manual XP Injector
  app.post('/api/twa/admin/xp/grant', async (req, res, next) => {
    try {
      const { userId, targetId, amount, reason } = req.body;
      const role = await getRoleByUserId(prisma, userId);
      if (role !== 'taras' && role !== 'maks' && role !== 'andryuha' && userId !== ADMIN_ID) return res.status(403).json({error: 'Forbidden'});

      await addXP(prisma, targetId, Number(amount), 'manual_grant');
      try { await bot.telegram.sendMessage(targetId, `⚡ *ДРОП ВІД ШЕФА!*\nТобі нараховано +${amount} XP.\nПричина: _${reason || 'за відмінну службу'}_ 🎯`, { parse_mode: 'Markdown' }); } catch(e){}
      
      res.json({ success: true });
    } catch(e) { next(e); }
  });

  // Shop: Dopamine Cashout
  app.post('/api/twa/dopamine/cashout', async (req, res, next) => {
    try {
      const { userId, item, cost } = req.body;
      const user = await prisma.user.findUnique({ where: { telegramId: userId } });
      if (!user || user.xpTotal < cost) {
        return res.status(400).json({ error: 'Недостатньо XP' });
      }

      await addXP(prisma, userId, -Math.abs(cost), 'cashout');
      
      // Notify Admin
      if (ADMIN_ID) {
        try { 
          await bot.telegram.sendMessage(ADMIN_ID, `🛒 *CASH OUT INITIATED!*\nКористувач: ${ROLES[user.role] || user.role}\nВитратив: -${cost} XP\nНагорода: ${item}\n\nЗалишок: ${user.xpTotal - cost} XP`, { parse_mode: 'Markdown' }); 
        } catch(e) {}
      }

      res.json({ success: true, newXP: user.xpTotal - cost });
    } catch(e) { 
      next(e); 
    }
  });

  // ─── HEALTH ─────────────────────────────────────────
  app.get('/health', async (req, res) => {
    const day = await getCurrentDay(prisma);
    const skillCount = await prisma.skill.count();
    res.json({ status: 'ok', version: '2.0', day, skills: skillCount });
  });

  // ─── ERROR HANDLER ──────────────────────────────────
  app.use(async (err, req, res, next) => {
    console.error('Express Error:', err);
    if (ADMIN_ID) { try { await bot.telegram.sendMessage(ADMIN_ID, `🚨 *API CRASH*\n${req.path}\n${err.message}`, { parse_mode: 'Markdown' }); } catch(e){} }
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  });
}

module.exports = { setupAPI };
