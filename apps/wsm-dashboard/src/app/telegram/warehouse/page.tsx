'use client';

import { motion } from 'framer-motion';
import { Package, CheckCircle, Zap, ShieldAlert } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useState } from 'react';
import WebApp from '@/lib/twa';

const DUMMY_ORDERS = [
  { id: 'PO-2026-0001', item: 'DA HONG PAO 1L', qty: 20, status: 'pending' },
  { id: 'PO-2026-0002', item: 'GABA 0.25L', qty: 5, status: 'pending' },
];

export default function WarehousePackerUI() {
  const [orders, setOrders] = useState(DUMMY_ORDERS);
  const [karma, setKarma] = useState(1240);

  const handlePack = (id: string) => {
    // 1. Анімація кнопки та звуковий відгук Telegram
    if (typeof window !== 'undefined' && WebApp && WebApp.HapticFeedback) {
      WebApp.HapticFeedback.notificationOccurred('success');
    }

    // 2. Локальний стейт для зникнення (Framer Motion exit)
    setOrders((prev) => prev.filter((o) => o.id !== id));

    // 3. Гейміфікація (Карма)
    setKarma((k) => k + 50);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.8 },
      colors: ['#3b82f6', '#8b5cf6', '#10b981']
    });

    // 4. API Виклик до erp-notion.ts (буде тут)
    console.log(`[TMA] Відправлено сигнал списання на склад: \${id}`);
  };

  return (
    <div className="p-6 flex flex-col space-y-6">
      {/* Шапка з Кармою (Гейміфікація) */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Термінал Складу</h1>
          <p className="text-zinc-400 text-sm mt-1">Зміна 1 • Склад Львів</p>
        </div>
        <div className="flex items-center space-x-2 bg-white/5 border border-white/10 rounded-2xl px-4 py-2 backdrop-blur-xl">
          <Zap className="text-yellow-400" size={18} fill="currentColor" />
          <motion.span 
            key={karma}
            initial={{ scale: 1.5, color: '#facc15' }}
            animate={{ scale: 1, color: '#ffffff' }}
            className="font-bold text-lg"
          >
            {karma}
          </motion.span>
        </div>
      </motion.div>

      {/* Список замовлень для пакування */}
      <div className="space-y-4">
        <div className="flex justify-between items-center text-sm font-medium text-zinc-400 border-b border-white/10 pb-2">
          <span>ДО ВІДВАНТАЖЕННЯ</span>
          <span>{orders.length} ЗАВДАНЬ</span>
        </div>

        {orders.length === 0 ? (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center justify-center py-12 text-center"
          >
            <ShieldAlert className="text-zinc-600 mb-4" size={48} />
            <h3 className="text-zinc-300 font-medium">Черга порожня</h3>
            <p className="text-zinc-500 text-sm mt-2">Ви спакували всі замовлення! Відпочивайте.</p>
          </motion.div>
        ) : (
          orders.map((order, i) => (
            <motion.div
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50, scale: 0.9 }}
              transition={{ delay: i * 0.1 }}
              key={order.id}
              className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-xl shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
              
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-xs font-mono tracking-wider text-blue-400 bg-blue-500/10 px-2 py-1 rounded-md">
                    {order.id}
                  </span>
                  <h3 className="text-lg font-semibold text-white mt-2">{order.item}</h3>
                  <p className="text-zinc-400 text-sm mt-1 flex items-center">
                    <Package size={14} className="mr-1 inline" /> 
                    Кількість: <b className="text-white ml-1">{order.qty} шт</b>
                  </p>
                </div>
              </div>

              <button
                onClick={() => handlePack(order.id)}
                className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl py-3.5 font-bold shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all active:scale-95"
              >
                <CheckCircle size={20} />
                <span>СПАКОВАНО (Списати +50 ⚡)</span>
              </button>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
