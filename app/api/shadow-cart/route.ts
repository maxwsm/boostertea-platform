import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@wsm/db';

const inMemoryRateLimit = new Map<string, { count: number, timestamp: number }>();

export async function POST(req: NextRequest) {
  try {
    // 1. In-Memory Anti-Fraud Rate Limiting (Security against Console Hackers)
    const ip = req.headers.get('x-forwarded-for') || (req as any).ip || 'unknown';
    const now = Date.now();
    const rl = inMemoryRateLimit.get(ip);
    
    if (rl) {
      if (now - rl.timestamp < 60000) { // 1 minute window
        if (rl.count > 10) {
          return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
        }
        rl.count++;
      } else {
        inMemoryRateLimit.set(ip, { count: 1, timestamp: now });
      }
    } else {
      inMemoryRateLimit.set(ip, { count: 1, timestamp: now });
    }

    // 2. Parse payload from sendBeacon (Blob application/json)
    const bodyText = await req.text();
    const data = JSON.parse(bodyText);

    const { sessionId, phone, email, payload, triggerAt } = data;

    if (!sessionId || !payload) {
      return NextResponse.json({ error: 'Missing req fields' }, { status: 400 });
    }

    // 3. Upsert Shadow Cart
    const tAt = new Date(triggerAt);

    await prisma.shadowCart.upsert({
      where: { sessionId },
      update: {
        phone: phone || null,
        email: email || null,
        payload,
        triggerAt: tAt,
        status: 'abandoned' // Reset status if user comes back and edits
      },
      create: {
        sessionId,
        phone: phone || null,
        email: email || null,
        payload,
        triggerAt: tAt,
        status: 'abandoned'
      }
    });

    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('[ShadowCart API Error]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
