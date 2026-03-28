import { NextResponse } from 'next/server';
import { z } from 'zod';
import { metaCampaignQueue } from '@/lib/queue';

export const dynamic = 'force-dynamic';
// Схема валідації вхідних даних за допомогою Zod
const launchSchema = z.object({
  headline: z.string().min(5).max(255),
  primaryText: z.string().min(10).max(1024),
  dailyBudget: z.number().int().positive(), // Бюджет в центах
  audience: z.string(), // В майбутньому може бути ID кастомної аудиторії
  cta: z.string(),
});

// Обробник POST-запиту для запуску кампанії
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const campaignData = launchSchema.parse(body);

    // Додаємо завдання в чергу BullMQ для асинхронної обробки
    // Це запобігає блокуванню API та обходить Rate Limits від Meta
    const job = await metaCampaignQueue.add('launch-new-campaign', campaignData);

    return NextResponse.json({
      message: 'Campaign launch has been successfully queued.',
      jobId: job.id,
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input data', details: error.errors }, { status: 400 });
    }
    console.error('Error queueing Meta campaign job:', error);
    return NextResponse.json({ error: 'Failed to queue campaign launch.' }, { status: 500 });
  }
}
