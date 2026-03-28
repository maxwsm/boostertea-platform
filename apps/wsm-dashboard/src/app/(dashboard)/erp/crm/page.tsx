import { prisma as db } from '@wsm/db';
import CrmClient from './CrmClient';

export const dynamic = 'force-dynamic';

export default async function CrmPage() {
  const partners = await db.partner.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { accountMoves: true, stockMoves: true }
      }
    }
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          👥 Unified CRM (Панель Партнерів)
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Єдина адресна книга для всіх Клієнтів, Постачальників та Працівників. Odoo-style архітектура.
        </p>
      </div>

      <CrmClient initialPartners={partners as any} />
    </div>
  );
}
