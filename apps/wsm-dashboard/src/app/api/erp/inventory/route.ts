import { NextRequest, NextResponse } from 'next/server';
import { prisma as db } from '@wsm/db';
import { jwtVerify } from 'jose';

async function checkAuth(req: NextRequest) {
  const token = req.cookies.get('wsm_session')?.value || req.headers.get('authorization')?.split(' ')[1];
  if (!token) return false;
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    if (!process.env.JWT_SECRET) throw new Error("No secret");
    await jwtVerify(token, secret);
    return true;
  } catch (e) {
    return false;
  }
}

export async function POST(req: NextRequest) {
  if (!(await checkAuth(req))) return NextResponse.json({ error: 'Unauthorized ERP Access' }, { status: 401 });
  try {
    const data = await req.json();
    const { productId, sourceLocId, destLocId, qty, partnerId } = data;

    const move = await db.stockMove.create({
      data: {
        productId,
        sourceLocId,
        destLocId,
        qty: Number(qty),
        partnerId: partnerId || null,
        state: 'DRAFT'
      },
      include: { partner: true }
    });

    return NextResponse.json(move, { status: 201 });
  } catch (error) {
    console.error('[ERP Inventory POST Error]', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  if (!(await checkAuth(req))) return NextResponse.json({ error: 'Unauthorized ERP Access' }, { status: 401 });
  try {
    const data = await req.json();
    const { id, state } = data;

    if (!id || !state) return NextResponse.json({ error: 'Missing data' }, { status: 400 });

    const move = await db.stockMove.update({
      where: { id },
      data: { state },
      include: { partner: true }
    });

    return NextResponse.json(move);
  } catch (error) {
    console.error('[ERP Inventory PATCH Error]', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
