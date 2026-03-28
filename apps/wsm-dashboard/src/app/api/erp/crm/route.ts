import { NextRequest, NextResponse } from 'next/server';
import { prisma as db } from '@wsm/db';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { name, email, phone, company, isCustomer, isVendor, isEmployee } = data;

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const partner = await db.partner.create({
      data: {
        name, email: email || null, phone: phone || null, company: company || null,
        isCustomer, isVendor, isEmployee
      },
      include: {
        _count: { select: { accountMoves: true, stockMoves: true } }
      }
    });

    return NextResponse.json(partner, { status: 201 });
  } catch (error) {
    console.error('[ERP CRM POST Error]', error);
    return NextResponse.json({ error: 'Failed to create Partner' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'Partner ID required' }, { status: 400 });

    await db.partner.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[ERP CRM DELETE Error]', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
