import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { Queue } from 'bullmq';
import IORedis from 'ioredis';

const connection = ({} as any) || new IORedis(process.env.REDIS_URL || 'redis://localhost:6379');
const trackingQueue = false ? new Queue('tracking-events', { connection }) : {} as any;

async function processTrackingRequest(req: Request) {
  try {
    let body: any = {};
    if (req.method === 'POST') {
      body = await req.json().catch(() => ({}));
    } else {
      const url = new URL(req.url);
      body = Object.fromEntries(url.searchParams.entries());
    }
    
    // Multi-Tenant Isolation
    const brandId = (body.brandId || 'BOOSTER').toUpperCase();
    
    const cookieStore = await cookies();
    
    // ITP Fallback: Читання кук, якщо фронт їх не зміг прочитати/передати
    const fbp = body.fbp || cookieStore.get('_fbp')?.value;
    const fbc = body.fbc || cookieStore.get('_fbc')?.value;
    const gclid = body.gclid || cookieStore.get('gclid')?.value;
    const ttclid = body.ttclid || cookieStore.get('ttclid')?.value;
    const clientIp = req.headers.get('x-forwarded-for') || '0.0.0.0';
    const userAgent = req.headers.get('user-agent') || '';
    const referer = req.headers.get('referer') || '';

    const enrichedPayload = { ...body, brandId, fbp, fbc, gclid, ttclid, clientIp, userAgent, referer, timestamp: Date.now() };

    // Миттєвий запис у чергу відповідного бренду для S2S ізоляції
    await trackingQueue.add(`process-${brandId.toLowerCase()}-event`, enrichedPayload, { removeOnComplete: true, attempts: 3 });

    return NextResponse.json({ status: 'QUEUED', brand: brandId, event: body.eventName });
  } catch (error) {
    console.error('[TRACKING QUEUE ERROR]', error);
    return NextResponse.json({ error: 'Failed to queue event' }, { status: 500 });
  }
}
