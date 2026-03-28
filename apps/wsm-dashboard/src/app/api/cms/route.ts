import { NextRequest, NextResponse } from 'next/server';
import { prisma as db } from '@wsm/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const brandId = searchParams.get('brandId');

    if (!brandId) {
      return NextResponse.json({ error: 'brandId required' }, { status: 400 });
    }

    const contents = await db.brandContent.findMany({
      where: { brandId }
    });

    return NextResponse.json({ contents });
  } catch (error) {
    console.error('[CMS GET Error]', error);
    return NextResponse.json({ error: 'Failed to fetch contents' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { brandId, key, value } = data;

    if (!brandId || !key) {
      return NextResponse.json({ error: 'brandId and key are required' }, { status: 400 });
    }

    // Upsert the content block
    const updated = await db.brandContent.upsert({
      where: {
        brandId_key: { brandId, key }
      },
      update: { value },
      create: { brandId, key, value }
    });

    return NextResponse.json({ success: true, content: updated });
  } catch (error) {
    console.error('[CMS POST Error]', error);
    return NextResponse.json({ error: 'Failed to update content' }, { status: 500 });
  }
}
