import { NextRequest, NextResponse } from 'next/server';
import { prisma as db } from '@wsm/db';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { type, reference, partnerId, lines } = data;

    // Validate balance
    const totalDebit = lines.reduce((sum: number, line: any) => sum + Number(line.debit), 0);
    const totalCredit = lines.reduce((sum: number, line: any) => sum + Number(line.credit), 0);

    if (totalDebit !== totalCredit || totalDebit <= 0) {
      return NextResponse.json({ error: 'Unbalanced Journal Entry' }, { status: 400 });
    }

    const move = await db.accountMove.create({
      data: {
        type,
        reference: reference || null,
        partnerId: partnerId || null,
        state: 'POSTED',
        lines: {
          create: lines.map((l: any) => ({
            accountId: l.accountId,
            label: l.label || null,
            debit: Number(l.debit),
            credit: Number(l.credit)
          }))
        }
      },
      include: {
        partner: true,
        lines: true
      }
    });

    return NextResponse.json(move, { status: 201 });
  } catch (error) {
    console.error('[ERP Accounting POST Error]', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
