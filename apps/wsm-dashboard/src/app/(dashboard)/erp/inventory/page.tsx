import { prisma as db } from '@wsm/db';
import InventoryClient from './InventoryClient';

export const dynamic = 'force-dynamic';

export default async function InventoryPage() {
  const stockMoves = await db.stockMove.findMany({
    orderBy: { createdAt: 'desc' },
    include: { partner: true }
  });

  const products = await db.product.findMany({ select: { id: true, nameUk: true }});
  const partners = await db.partner.findMany({ select: { id: true, name: true }});

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          📦 Virtual Inventory Moves
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Товар ніколи не зникає. Він переміщується між Локаціями (Warehouse, Customer, Scrap).
        </p>
      </div>

      <InventoryClient initialMoves={stockMoves as any} products={products} partners={partners} />
    </div>
  );
}
