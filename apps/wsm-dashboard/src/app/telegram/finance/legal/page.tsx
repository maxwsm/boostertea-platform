'use client';

import { motion } from 'framer-motion';
import { Scale, Clock, ShieldAlert } from 'lucide-react';
import WebApp from '@/lib/twa';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const MOCK_LEGAL = [
  { id: '1', doc: 'ЄСВ Q1 • ФОП Кондратюк', type: 'TAX', deadline: '09.05.2026', status: 'PENDING' },
  { id: '2', doc: 'Договір Позики • ФОП Мартиновський', type: 'CONTRACT', deadline: '29.01.2026', status: 'OVERDUE' },
  { id: '3', doc: 'ПДВ ТОВ ТайДрінк', type: 'TAX', deadline: '20.04.2026', status: 'PREPARED' },
];

export default function LegalShieldUI() {
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
        <h1 className="text-2xl font-bold tracking-tight text-white">Legal Shield (DB8/17)</h1>
        <Scale size={22} className="text-emerald-500" />
      </motion.header>

      {/* Critical Overdue Block */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="relative w-full p-5 rounded-3xl bg-red-500/10 border border-red-500/30 backdrop-blur-xl flex flex-col space-y-3"
      >
        <div className="flex items-center space-x-2 text-red-400">
          <ShieldAlert size={20} />
          <h2 className="text-sm font-bold tracking-widest uppercase">Critical Flags</h2>
        </div>
        <div className="bg-red-500/20 p-3 rounded-xl border border-red-500/10">
          <p className="text-white text-sm font-semibold">Договір Позики ФОП Мартиновський</p>
          <p className="text-red-300 text-xs mt-1">Просрочено з 29.01.2026! Ризик блокування.</p>
        </div>
      </motion.div>

      {/* Deadlines List */}
      <div className="space-y-3 z-10 flex-1">
        <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-widest pl-2 mb-2">Календар Дедлайнів</h3>
        
        {MOCK_LEGAL.map((item, i) => {
          const isOverdue = item.status === 'OVERDUE';
          const isPending = item.status === 'PENDING';
          
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + (i * 0.1) }}
              className={`flex items-center justify-between p-4 bg-white/5 border \${isOverdue ? 'border-red-500/40 bg-red-500/5' : 'border-white/5'} rounded-2xl active:bg-white/10`}
            >
              <div className="flex-1">
                <span className={`text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-md \${item.type === 'TAX' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-blue-500/20 text-blue-300'}`}>
                  {item.type}
                </span>
                <h4 className="font-semibold text-white text-sm mt-2">{item.doc}</h4>
              </div>
              
              <div className="flex flex-col items-end pl-4">
                <div className={`flex items-center space-x-1 text-xs font-bold \${isOverdue ? 'text-red-400' : isPending ? 'text-yellow-400' : 'text-emerald-400'}`}>
                  <Clock size={12} />
                  <span>{item.deadline}</span>
                </div>
                {isOverdue && <span className="text-[10px] text-red-500 mt-1 uppercase font-bold">OVERDUE</span>}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
