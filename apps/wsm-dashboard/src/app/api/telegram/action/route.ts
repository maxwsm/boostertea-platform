import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { sendNotification } from '@/lib/telegram';

const db = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { userId, action, data } = await req.json();

    if (action === 'SUBMIT_CAFE') {
      const lead = await db.horecaLead.create({
        data: {
          scoutId: userId,
          cafeName: data.cafeName,
          address: data.address,
          status: 'PENDING'
        }
      });

      await sendNotification(`🏪 <b>Нова кав'ярня від Героя!</b>\nГерой ID: ${userId}\nНазва: ${data.cafeName}\nАдреса: ${data.address}`);
      
      return NextResponse.json({ status: 'CAFE_ADDED', leadId: lead.id });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    console.error('TMA Action Error', error);
    return NextResponse.json({ error: 'Action failed' }, { status: 500 });
  }
}
