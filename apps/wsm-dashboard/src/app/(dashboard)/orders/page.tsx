import { prisma as db } from '@wsm/db';
import OrdersKanban from './OrdersKanban';

export const dynamic = 'force-dynamic';

export default async function OrdersPage() {
  const orders = await db.order.findMany({
    include: {
      brand: { select: { name: true, slug: true } },
      user: { select: { name: true, phone: true, email: true } },
      items: { include: { product: { select: { nameUk: true } } } }
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-6 flex flex-col h-[calc(100vh-8rem)]">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          🛒 E-Commerce Orders
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Канбан-дошка замовлень з усіх брендів Екосистеми. Переміщення у статус "Відправлено" (SHIPPED) автоматично створює складську операцію (StockMove) та прив'язує Клієнта до CRM.
        </p>
      </div>

      <OrdersKanban initialOrders={orders as any} />
    </div>
  );
}
