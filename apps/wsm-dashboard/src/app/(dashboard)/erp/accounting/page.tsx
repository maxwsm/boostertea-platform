import { prisma as db } from '@wsm/db';
import AccountingClient from './AccountingClient';

export const dynamic = 'force-dynamic';

export default async function AccountingPage() {
  const accountMoves = await db.accountMove.findMany({
    orderBy: { date: 'desc' },
    include: {
      partner: true,
      lines: true
    }
  });

  const partners = await db.partner.findMany({ select: { id: true, name: true }});

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          💰 Double-Entry Accounting
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Сувора фінансова звітність. Кожна дія створює збалансовані лінії Дебету і Кредиту.
        </p>
      </div>

      <AccountingClient initialMoves={accountMoves as any} partners={partners} />
    </div>
  );
}
