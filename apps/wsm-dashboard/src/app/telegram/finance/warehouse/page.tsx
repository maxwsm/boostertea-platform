'use client';

import { motion } from 'framer-motion';
import { PackageSearch, AlertTriangle, PlusCircle } from 'lucide-react';
import WebApp from '@/lib/twa';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const MOCK_INVENTORY = [
  { id: '1', name: 'DA HONG PAO Екстракт', qty: 37.0, unit: 'kg', reorder: 20.0, status: 'OK' },
  { id: '2', name: 'Консервант E202', qty: 1.2, unit: 'kg', reorder: 2.0, status: 'CRITICAL' },
  { id: '3', name: 'Пляшка HDPE 1L', qty: 150, unit: 'pcs', reorder: 300, status: 'WARNING' },
];

export default function ArsenalControlUI() {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
    WebApp.BackButton.show();
    WebApp.BackButton.onClick(() => router.back());
    return () => WebApp.BackButton.hide();
  }, [router]);

  if (!isReady) return null;

  return (
    <div className="relative min-h-screen px-5 pt-8 pb-20 flex flex-col space-y-6 bg-[#09090b]">
      {/* Dynamic Header */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center justify-between z-10"
      >
        <h1 className="text-2xl font-bold tracking-tight text-white">Arsenal (DB13)</h1>
        <PackageSearch size={22} className="text-blue-500" />
      </motion.header>

      {/* Critical Alerts */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="relative w-full p-5 rounded-3xl bg-red-500/10 border border-red-500/20 backdrop-blur-xl flex items-center space-x-4"
      >
        <AlertTriangle size={24} className="text-red-500 animate-pulse" />
        <div>
          <h2 className="text-sm font-bold text-red-400">Критичний дефіцит</h2>
          <p className="text-xs text-red-300 mt-1">Деякі позиції нижче Reorder Point</p>
        </div>
      </motion.div>

      {/* Inventory Modules */}
      <div className="space-y-4 flex-1">
        {MOCK_INVENTORY.map((item, i) => {
          const isCritical = item.status === 'CRITICAL';
          const isWarning = item.status === 'WARNING';
          
          let borderColor = 'border-white/5';
          let glowColor = '';
          if (isCritical) {
            borderColor = 'border-red-500/40';
            glowColor = 'shadow-[0_0_20px_rgba(239,68,68,0.15)] bg-red-500/5';
          } else if (isWarning) {
            borderColor = 'border-yellow-500/40';
            glowColor = 'shadow-[0_0_20px_rgba(234,179,8,0.1)] bg-yellow-500/5';
          } else {
             glowColor = 'bg-white/5';
          }

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + (i * 0.1) }}
              className={`p-4 rounded-2xl backdrop-blur-md \${borderColor} \${glowColor} border transition-all`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-white text-sm">{item.name}</h3>
                  <p className="text-xs text-zinc-500 mt-1">Reorder Point: {item.reorder} {item.unit}</p>
                </div>
                <div className="text-right">
                  <span className={`text-xl font-bold tracking-tight \${isCritical ? 'text-red-400' : isWarning ? 'text-yellow-400' : 'text-emerald-400'}`}>
                    {item.qty} <span className="text-sm font-medium">{item.unit}</span>
                  </span>
                </div>
              </div>
              
              {(isCritical || isWarning) && (
                <button
                  onClick={() => WebApp.HapticFeedback.notificationOccurred('success')}
                  className="mt-4 w-full flex items-center justify-center space-x-2 py-2 bg-white/10 hover:bg-white/20 active:bg-white/5 rounded-xl text-white text-sm font-medium transition-colors"
                >
                  <PlusCircle size={16} />
                  <span>Створити Purchase Order (DB15)</span>
                </button>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
