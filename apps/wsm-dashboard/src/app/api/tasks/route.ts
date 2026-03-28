import { NextRequest, NextResponse } from 'next/server';
import { prisma as db } from '@wsm/db';

export async function GET() {
  try {
    const tasks = await db.task.findMany({
      include: { assignees: { include: { user: true } } },
      orderBy: { createdAt: 'desc' },
    });
    
    const mapped = tasks.map(t => ({
      id: t.id,
      title: t.title,
      status: t.status,
      priority: t.priority,
      assignee: t.assignees.length > 0 && t.assignees[0].user ? t.assignees[0].user.name : 'Team M'
    }));
    
    return NextResponse.json(mapped);
  } catch (error) {
    console.error('[GET TASKS]', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { title, priority } = await req.json();
    const task = await db.task.create({
      data: {
        title,
        priority: priority || 'MEDIUM',
        status: 'TODO',
      }
    });
    return NextResponse.json(task, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, status } = await req.json();
    const task = await db.task.update({
      where: { id },
      data: { status }
    });
    return NextResponse.json(task);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
