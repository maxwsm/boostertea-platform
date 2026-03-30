import { NextResponse } from 'next/server';
import { verifyWebhookSignature, MonobankWebhookPayload } from '@/src/web/lib/monobank';
import { PrismaClient } from '@wsm/db';
import { notionCreate, notionPayloads } from '@/src/lib/notion';

const prisma = new PrismaClient();

// In production, fetch this from https://api.monobank.ua/api/merchant/pubkey
// and ideally cache it in Redis to avoid rate limits.
const MONOBANK_PUB_KEY = process.env.MONOBANK_PUB_KEY || '';

export async function POST(request: Request) {
  try {
    const signatureBase64 = request.headers.get('X-Sign');
    if (!signatureBase64) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    const bodyText = await request.text();

    // Захист від шахраїв: перевірка криптографічного ECDSA-підпису
    if (MONOBANK_PUB_KEY) {
      const isValid = await verifyWebhookSignature(signatureBase64, bodyText, MONOBANK_PUB_KEY);
      if (!isValid) {
        console.error('[Monobank Webhook] Invalid signature detected!');
        return NextResponse.json({ error: 'Invalid signature' }, { status: 403 });
      }
    } else {
      console.warn('[Monobank Webhook] WARNING: MONOBANK_PUB_KEY missing. Signature verification bypassed (development mode only)');
    }

    const payload = JSON.parse(bodyText) as MonobankWebhookPayload;
    console.log(`[Monobank Webhook] Received status '${payload.status}' for Invoice ${payload.invoiceId}`);

    // Оновлюємо базу даних (залежить від твоєї Prisma схеми)
    const transaction = await prisma.transaction.findFirst({
      where: { id: payload.reference }
    });

    if (transaction) {
      // Map statuses
      let dbStatus = transaction.status;
      if (payload.status === 'success' || payload.status === 'hold') {
        dbStatus = 'COMPLETED';
      } else if (payload.status === 'failure' || payload.status === 'expired') {
        dbStatus = 'FAILED';
      } else if (payload.status === 'reversed') {
        dbStatus = 'REFUNDED';
      }

      await prisma.transaction.update({
        where: { id: transaction.id },
        data: { status: dbStatus }
      });

      console.log(`[Monobank Webhook] Updated transaction ${transaction.id} to ${dbStatus}`);
      
      // Якщо це success — стріляємо у Notion DB5 Finance безпосередньо:
      if (dbStatus === 'COMPLETED') {
        try {
           const DB5_ID = process.env.NOTION_FINANCE_DB_ID;
           if (DB5_ID) {
             const notionPayload = notionPayloads.db5PushTransaction('BoosterTea (Live)', payload.amount / 100);
             await notionCreate(DB5_ID, notionPayload);
             console.log(`[Notion SDK] Sent Live Transaction to DB5!`);
           } else {
             console.log(`[Notion SDK] Missing NOTION_FINANCE_DB_ID env var. Skipping Notion push.`);
           }
        } catch (err) {
           console.error(`[Notion SDK] Push failed, but order saved:`, err);
        }
      }

    } else {
      console.warn(`[Monobank Webhook] Transaction not found for invoice ${payload.invoiceId}`);
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('[Monobank Webhook Error]:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
