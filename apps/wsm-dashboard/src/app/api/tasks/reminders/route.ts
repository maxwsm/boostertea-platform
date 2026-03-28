import { NextRequest, NextResponse } from 'next/server';
import { prisma as db } from '@wsm/db';

export async function POST() {
  try {
    const tasks = await db.task.findMany({ 
      where: { status: { in: ['TODO', 'IN_PROGRESS', 'REVIEW'] } } 
    });
    
    // Simulate TAI_COO Analysis Engine logic
    const urgentTasks = tasks.filter(t => t.priority === 'URGENT');
    const slowTasks = tasks.filter(t => t.status === 'TODO' && (Date.now() - t.createdAt.getTime()) > 86400000); // older than 24h
    
    let report = `[TAI_COO] Моніторинг ERP. Відкритих задач: ${tasks.length}.\n\n`;
    
    if (urgentTasks.length > 0) {
      report += `🚨 КРИТИЧНО: У нас ${urgentTasks.length} URGENT задач!`;
      urgentTasks.forEach(u => report += `\n- [${u.id}] ${u.title}`);
      report += `\nКоманді: негайно локалізувати ці проблеми.\n\n`;
    } else {
      report += `✅ Немає критичних URGENT пожеж. Система стабільна.\n\n`;
    }

    if (slowTasks.length > 0) {
      report += `⏱️ Увага: ${slowTasks.length} задач висять в TODO довше 24 годин. Колеги, чому блокери? Прошу статусу.\n`;
    }
    
    // Log behavioral telemetry
    await db.behavioralArchive.create({
      data: {
        userId: 'TAI_SYSTEM',
        platform: 'ERP',
        message: 'Згенеровано AI Task Audit Report',
        role: 'TAI_COO',
        intent: 'TEAM_PERFORMANCE_CHECK',
        sentiment: urgentTasks.length > 0 ? -0.5 : 0.8 // Negative if fires exist
      }
    });

    return NextResponse.json({ report });
  } catch (error) {
    console.error('[AI REMINDER]', error);
    return NextResponse.json({ error: 'Failed AI Report' }, { status: 500 });
  }
}
