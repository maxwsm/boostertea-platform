'use client';

import { useState } from 'react';
import { Truck, Package, CheckCircle, CreditCard, Clock, XCircle, ArrowRight } from 'lucide-react';

const COLUMNS = [
  { id: 'PENDING', label: 'Очікує', icon: <Clock size={16} /> },
  { id: 'PAID', label: 'Оплачено', icon: <CreditCard size={16} /> },
  { id: 'PROCESSING', label: 'В роботі (Збірка)', icon: <Package size={16} /> },
  { id: 'SHIPPED', label: 'Відправлено', icon: <Truck size={16} /> },
  { id: 'DELIVERED', label: 'Доставлено', icon: <CheckCircle size={16} /> },
  { id: 'CANCELLED', label: 'Скасовано', icon: <XCircle size={16} /> }
];

const NEXT_STATE_MAP: Record<string, string> = {
  'PENDING': 'PAID',
  'PAID': 'PROCESSING',
  'PROCESSING': 'SHIPPED',
  'SHIPPED': 'DELIVERED'
};

export default function OrdersKanban({ initialOrders }: { initialOrders: any[] }) {
  const [orders, setOrders] = useState(initialOrders);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  const moveOrder = async (orderId: string, currentState: string) => {
    const nextState = NEXT_STATE_MAP[currentState];
    if (!nextState) return;

    if (currentState === 'PROCESSING' && nextState === 'SHIPPED') {
      const confirmMove = confirm('Увага: Переведення у статус "Відправлено" автоматично створить StockMove та спише товари зі складу. Продовжити?');
      if (!confirmMove) return;
    }

    try {
      setIsUpdating(orderId);
      const res = await fetch('/api/orders/transit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, nextState })
      });

      if (res.ok) {
        setOrders(orders.map(o => o.id === orderId ? { ...o, status: nextState } : o));
      } else {
        alert('Помилка оновлення статусу');
      }
    } catch(e) {
      console.error('[OrdersKanban] Failed to move order:', e);
    } finally {
      setIsUpdating(null);
    }
  };

  const cancelOrder = async (orderId: string) => {
    if (!confirm('Скасувати замовлення?')) return;
    try {
      setIsUpdating(orderId);
      const res = await fetch('/api/orders/transit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, nextState: 'CANCELLED' })
      });
      if (res.ok) {
        setOrders(orders.map(o => o.id === orderId ? { ...o, status: 'CANCELLED' } : o));
      }
    } catch(e) {
      console.error('[OrdersKanban] Failed to cancel order:', e);
    } finally {
      setIsUpdating(null);
    }
  }

  return (
    <div className="flex-1 overflow-x-auto pb-4 custom-scrollbar">
      <div className="flex gap-4 min-w-max h-full">
        {COLUMNS.map(col => {
          const colOrders = orders.filter(o => o.status === col.id);
          
          return (
            <div key={col.id} className="w-80 flex flex-col bg-[#0a0a0a] rounded-xl border border-white/5 overflow-hidden">
              <div className="p-3 bg-[#111] border-b border-white/5 flex justify-between items-center sticky top-0">
                <div className="flex items-center gap-2 font-bold text-sm text-gray-300">
                  {col.icon} {col.label}
                </div>
                <span className="bg-white/10 text-xs px-2 py-0.5 rounded-full text-gray-400">{colOrders.length}</span>
              </div>
              
              <div className="p-3 flex-1 overflow-y-auto space-y-3 custom-scrollbar">
                {colOrders.map(order => (
                  <div key={order.id} className="bg-[#161616] border border-white/10 p-4 rounded-xl hover:border-indigo-500/30 transition-colors group relative">
                    {/* Brand Badge */}
                    <div className="absolute top-3 right-3 text-[10px] px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 font-medium">
                      {order.brand.name}
                    </div>

                    <p className="text-xs text-gray-500 font-mono mb-2">#{order.id.slice(0, 8)}</p>
                    
                    <div className="mb-3">
                      <p className="text-sm font-bold text-gray-200">{order.user?.name || 'Клієнт'}</p>
                      <p className="text-xs text-gray-500">{order.user?.phone || order.user?.email || 'Без контактів'}</p>
                    </div>

                    <div className="space-y-1 mb-4">
                      {order.items.map((item: any, i: number) => (
                        <div key={i} className="flex justify-between text-xs text-gray-400">
                          <span className="truncate pr-2">{item.quantity}x {item.product.nameUk}</span>
                          <span className="font-mono">₴{item.priceAtBuy * item.quantity}</span>
                        </div>
                      ))}
                      <div className="pt-2 mt-2 border-t border-white/5 flex justify-between font-bold text-sm text-white">
                        <span>Всього:</span>
                        <span>₴{order.totalAmount}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    {isUpdating === order.id ? (
                      <div className="text-xs text-center text-indigo-400 py-2 animate-pulse">Оновлення...</div>
                    ) : (
                      <div className="flex items-center gap-2 mt-2">
                        {NEXT_STATE_MAP[col.id] && (
                          <button 
                            onClick={() => moveOrder(order.id, col.id)}
                            className="flex-1 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 py-2 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1"
                          >
                            В "{NEXT_STATE_MAP[col.id]}" <ArrowRight size={12}/>
                          </button>
                        )}
                        {(col.id !== 'CANCELLED' && col.id !== 'DELIVERED') && (
                          <button 
                            onClick={() => cancelOrder(order.id)}
                            className="bg-red-500/10 hover:bg-red-500/20 text-red-500 p-2 rounded-lg transition-colors"
                            title="Скасувати"
                          >
                            <XCircle size={14}/>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
                
                {colOrders.length === 0 && (
                  <div className="text-center py-8 text-xs text-gray-600 border border-dashed border-white/5 rounded-xl">
                    Пусто
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
}
