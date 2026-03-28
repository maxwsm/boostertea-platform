import { NextRequest, NextResponse } from 'next/server';
import { prisma as db } from '@wsm/db';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { memoryId, text } = data;

    if (!memoryId || !text) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const memory = await db.agentMemory.findUnique({
      where: { id: memoryId },
      include: {
        agent: { include: { brand: true, integrations: true } }
      }
    });

    if (!memory) {
      return NextResponse.json({ error: 'Memory not found' }, { status: 404 });
    }

    // 1. Update the Memory Context so the AI knows the Human spoke
    let history = [];
    try {
      history = JSON.parse(memory.context);
      if (!Array.isArray(history)) history = [];
    } catch (e) {
      history = [{ role: 'system', parts: [{ text: 'Old context: ' + memory.context }] }];
    }

    // Append human's reply as a model response but explicitly prefixed
    history.push({
      role: 'model',
      parts: [{ text: `[OPERATOR REPLY]: ${text}` }]
    });

    const updatedMemory = await db.agentMemory.update({
      where: { id: memoryId },
      data: { context: JSON.stringify(history) },
      include: {
        agent: { include: { brand: { select: { name: true } } } }
      }
    });

    // 2. Here we would normally trigger a webhook or Redis PubSub
    // to instantly push this message to Telegram/Instagram.
    // e.g. await fetch(memory.agent.integrations[0].webhookUrl, { ... })
    console.log(`[SLA ESCALATION] Message dispatched to User ${memory.userId}: ${text}`);

    return NextResponse.json(updatedMemory);

  } catch (error) {
    console.error('[SUPPORT REPLY API ERROR]', error);
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}
