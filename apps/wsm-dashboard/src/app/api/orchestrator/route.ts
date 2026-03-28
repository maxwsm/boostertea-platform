import { NextRequest, NextResponse } from 'next/server';
import { prisma as db } from '@wsm/db';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { name, systemPrompt, canReadFiles, canReadAudio, canPostSocial, brandId } = data;

    if (!name || !systemPrompt || !brandId) {
      return NextResponse.json({ error: 'Missing required configuration for the AI Agent' }, { status: 400 });
    }

    const newAgent = await db.aiAgent.create({
      data: {
        name,
        systemPrompt,
        canReadFiles,
        canReadAudio,
        canPostSocial,
        brandId,
        isActive: true
      },
      include: {
        _count: { select: { memories: true } }
      }
    });

    return NextResponse.json(newAgent, { status: 201 });
  } catch (error) {
    console.error('[AI Orchestrator POST Error]', error);
    return NextResponse.json({ error: 'Failed to create AI Agent' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Agent ID required' }, { status: 400 });
    }

    // Cascade delete automatically handles the Agent's Memory
    await db.aiAgent.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[AI Orchestrator DELETE Error]', error);
    return NextResponse.json({ error: 'Failed to delete AI Agent' }, { status: 500 });
  }
}
