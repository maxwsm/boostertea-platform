// @ts-nocheck
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bizSdk from 'facebook-nodejs-business-sdk';

const db = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { userId, episodeId, email, phone } = await req.json();

    // 1. Фіксуємо прогрес у БД
    await db.userLoreProgress.upsert({
      where: { userId_episodeId: { userId, episodeId } },
      update: { viewedAt: new Date() },
      create: { userId, episodeId }
    });

    // 2. Якщо це фінальна серія (Епізод 6) — пушимо в Custom Audience
    if (episodeId === 6 && process.env.META_ACCESS_TOKEN && process.env.META_AMBASSADOR_AUDIENCE_ID) {
      bizSdk.FacebookAdsApi.init(process.env.META_ACCESS_TOKEN);
      const CustomAudience = bizSdk.CustomAudience;
      const audience = new CustomAudience(process.env.META_AMBASSADOR_AUDIENCE_ID);

      try {
        await audience.addUsers([{
          email: email ? [email] : [], // Хешування відбудеться автоматично в SDK або через наш hashData
          phone: phone ? [phone] : []
        }]);
        console.log(`[LORE ENGINE] Юзер ${userId} доданий до аудиторії Амбасадорів`);
      } catch (e) {
        console.error('Meta Audience Error', e);
      }
    }

    return NextResponse.json({ status: 'PROGRESS_TRACKED', episode: episodeId });
  } catch (error) {
    console.error('[LORE ENGINE ERROR]', error);
    return NextResponse.json({ error: 'Failed to track lore progress' }, { status: 500 });
  }
}
