import { NextRequest, NextResponse } from 'next/server';
import { prisma as db } from '@wsm/db';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { orderId, nextState } = data;

    if (!orderId || !nextState) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    // Fetch the order with items and user
    const order = await db.order.findUnique({
      where: { id: orderId },
      include: {
        items: true,
        user: true
      }
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // ERP INTEGRATION: Transition to SHIPPED triggers StockMoves
    // The items mathematically leave the internal physical existence and go to a Customer Location.
    if (order.status === 'PROCESSING' && nextState === 'SHIPPED') {
      
      // 1. Ensure Partner exists in CRM (Unified Partner Layer)
      let partnerId: string | undefined = undefined;
      
      if (order.user.email || order.user.phone) {
        let partner = await db.partner.findFirst({
          where: { OR: [ { email: order.user.email || 'N/A' }, { phone: order.user.phone || 'N/A' } ] }
        });
        
        if (!partner) {
          // Auto-create CRM Partner linked to Ecosystem user
          partner = await db.partner.create({
            data: {
              name: order.user.name || 'Клієнт з Сайту',
              email: order.user.email,
              phone: order.user.phone,
              isCustomer: true,
              userId: order.userId
            }
          });
        }
        partnerId = partner.id;
      }

      // 2. Create StockMoves for each OrderItem
      const stockMovesData = order.items.map(item => ({
        productId: item.productId,
        sourceLocId: 'WH/Stock',
        destLocId: 'Partner Locations/Customers',
        qty: item.quantity,
        state: 'DONE',
        partnerId: partnerId
      }));

      // We use a transaction to safely update order and insert stock moves
      await db.$transaction([
        db.order.update({ where: { id: orderId }, data: { status: nextState } }),
        db.stockMove.createMany({ data: stockMovesData })
      ]);

      return NextResponse.json({ success: true, erpIntegrated: true });
    }

    // Standard Status Update (No ERP triggers)
    const updatedOrder = await db.order.update({
      where: { id: orderId },
      data: { status: nextState }
    });

    return NextResponse.json(updatedOrder);

  } catch (error) {
    console.error('[ORDERS TRANSIT API ERROR]', error);
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}
