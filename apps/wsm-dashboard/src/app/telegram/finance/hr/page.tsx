'use client';

import { motion } from 'framer-motion';
import { Users, Fingerprint, Coins } from 'lucide-react';
import WebApp from '@/lib/twa';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const MOCK_TEAM = [
  { id: '1', name: 'Федченко С.', role: 'CTO', entity: 'ФОП Федченко', debt: 207000 },
  { id: '2', name: 'Балабанов В.', role: 'CFO', entity: 'ТОВ ТайДрінк', debt: 226000 },
  { id: '3', name: 'Карпин С.', role: 'Sales', entity: 'ФОП Федченко', debt: 0 },
];

export default function HRRadarUI() {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
    WebApp.BackButton.show();
    WebApp.BackButton.onClick(() => router.back());
    return () => WebApp.BackButton.hide();
  }, [router]);

  if (!isReady) return null;

  const totalDebt = MOCK_TEAM.reduce((acc, curr) => acc + curr.debt, 0);

  return (
    <div className="relative min-h-screen px-5 pt-8 pb-20 flex flex-col space-y-6 bg-[#09090b]">
      {/* Dynamic Header */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center justify-between z-10"
      >
        <h1 className="text-2xl font-bold tracking-tight text-white">HR Radar (DB9)</h1>
        <Users size={22} className="text-purple-500" />
      </motion.header>

      {/* Global Salary Debt Widget (Glassmorphism) */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="relative w-full p-6 rounded-3xl bg-purple-600/10 border border-purple-500/20 backdrop-blur-xl overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 blur-[60px] rounded-full pointer-events-none" />
        <p className="text-purple-300 text-xs font-bold tracking-widest uppercase mb-2 flex items-center">
          <Coins size={14} className="mr-2" /> Global Salary Debt
        </p>
        <h2 className="text-3xl font-bold text-white tracking-tight">
          {totalDebt.toLocaleString('uk-UA')} ₴
        </h2>
        <button 
          onClick={() => WebApp.showConfirm(`Авторизувати масову виплату \${totalDebt} ₴ через FaceID?`)}
          className="mt-5 w-full bg-white text-black py-3 rounded-xl font-bold flex items-center justify-center space-x-2 active:scale-95 transition-transform"
        >
          <Fingerprint size={18} />
          <span>Підписати Відомості (IBAN)</span>
        </button>
      </motion.div>

      {/* Team Radar List */}
      <div className="space-y-3 z-10">
        <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-widest pl-2 mb-2">Штат (ТОВ + ФОП)</h3>
        {MOCK_TEAM.map((member, i) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + (i * 0.1) }}
            className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl active:bg-white/10"
          >
            <div>
              <h4 className="font-semibold text-white text-sm">{member.name} {member.debt === 0 && '🟢'}</h4>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">{member.role} • {member.entity}</p>
            </div>
            {member.debt > 0 ? (
              <span className="font-mono text-xs font-bold text-red-400">-{member.debt.toLocaleString('uk-UA')} ₴</span>
            ) : (
              <span className="font-mono text-xs font-bold text-emerald-400">PAID</span>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
