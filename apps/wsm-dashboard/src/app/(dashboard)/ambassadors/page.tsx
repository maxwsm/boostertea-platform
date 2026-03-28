'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchAmbassadorProfile, generateAmbassadorLink } from './actions';
import { Network, Link2, BarChart3, AlertTriangle } from 'lucide-react';

export default function AmbassadorDashboard() {
  // Mock User from Session
  const [userId, setUserId] = useState("mock-founder-id-1234");
  
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showAgreement, setShowAgreement] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const loadStats = async (uid: string) => {
    setLoading(true);
    const res = await fetchAmbassadorProfile(uid);
    if (!res.error && res.profile) {
      setStats(res.profile);
    } else {
      setStats(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadStats(userId);
  }, [userId]);

  const attemptGenerateLink = () => {
    setShowAgreement(true);
  };

  const handleApply = async () => {
    setShowAgreement(false);
    setIsGenerating(true);
    const res = await generateAmbassadorLink(userId);
    setIsGenerating(false);
    
    if (res.success) {
      setStats(res.profile);
      // Trigger Haptic Feedback simulation
      if (typeof window !== 'undefined' && (window as any).navigator?.vibrate) {
        (window as any).navigator.vibrate([50, 50, 50]);
      }
    }
  };

  return (
    <div className="relative min-h-screen bg-[#050505] text-white p-8 font-sans overflow-hidden">
      {/* Background Deep Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-10 relative z-10 pt-10">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2 text-indigo-400 font-mono text-[10px] tracking-widest uppercase">
              <Network size={14} /> Global B2B Protocol
            </div>
            <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent tracking-tight">
              AMBASSADOR RADAR
            </h1>
            <p className="text-neutral-500 mt-2 max-w-xl text-sm">
              Миттєва генерація реферальних лінків із записом у 1C ERP. 100% In-House.
            </p>
          </div>
          <div className="flex items-center space-x-3 bg-white/5 border border-white/10 px-4 py-2 rounded-xl backdrop-blur-md">
            <span className="text-xs text-neutral-500 font-mono">Agent ID:</span>
            <input 
              value={userId} 
              onChange={(e) => setUserId(e.target.value)}
              className="bg-transparent text-white font-mono text-sm uppercase outline-none w-32 focus:text-indigo-400 transition-colors"
            />
          </div>
        </header>

        {loading ? (
          <div className="h-64 rounded-[2rem] bg-white/[0.02] border border-white/5 animate-pulse w-full"></div>
        ) : stats ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-8 rounded-3xl bg-white/[0.02] backdrop-blur-3xl border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_10px_40px_rgba(0,0,0,0.5)] relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 blur-[50px] -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-500/30 transition-colors" />
                <h3 className="text-xs text-neutral-400 font-bold uppercase tracking-widest mb-2">Unique Clicks</h3>
                <p className="text-5xl font-black text-white">{stats.totalClicks}</p>
                <div className="mt-6 h-1 w-12 bg-blue-500/50 rounded-full" />
              </div>

              <div className="p-8 rounded-3xl bg-white/[0.02] backdrop-blur-3xl border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_10px_40px_rgba(0,0,0,0.5)] relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 blur-[50px] -translate-y-1/2 translate-x-1/2 group-hover:bg-emerald-500/30 transition-colors" />
                <h3 className="text-xs text-neutral-400 font-bold uppercase tracking-widest mb-2">Total Sales</h3>
                <p className="text-5xl font-black text-white">₴{Number(stats.totalSalesAmount)}</p>
                <div className="mt-6 h-1 w-12 bg-emerald-500/50 rounded-full" />
              </div>

              <div className="p-8 rounded-3xl bg-gradient-to-br from-indigo-900/40 to-black backdrop-blur-3xl border border-indigo-500/30 shadow-[0_0_50px_rgba(79,70,229,0.15)] relative overflow-hidden">
                <h3 className="text-xs text-indigo-300 font-bold uppercase tracking-widest mb-2 flex justify-between">
                  My Commission <span>{Number(stats.commissionRate) * 100}% Rate</span>
                </h3>
                 <p className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-white">
                  ₴{(Number(stats.totalSalesAmount) * Number(stats.commissionRate)).toFixed(2)}
                </p>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-transparent" />
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-white/[0.02] backdrop-blur-3xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
               <div className="flex-1 w-full">
                 <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2"><Link2 size={18} className="text-indigo-400"/> Primary T-Link</h2>
                 <p className="text-neutral-500 text-sm">Ваш рекламний інструмент. Розповсюджуйте його у соціальних мережах.</p>
               </div>
               <div className="flex w-full md:w-auto items-center gap-2 bg-black/50 p-2 rounded-2xl border border-white/5">
                 <input 
                   readOnly
                   value={`https://tma.boostertea.com.ua?ref=\${stats.referralCode}`}
                   className="bg-transparent w-full md:w-80 px-4 text-sm font-mono text-indigo-300 outline-none selection:bg-indigo-500/30"
                 />
                 <button 
                   onClick={() => navigator.clipboard.writeText(`https://tma.boostertea.com.ua?ref=\${stats.referralCode}`)}
                   className="bg-white text-black hover:bg-neutral-200 px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors"
                 >
                   Copy
                 </button>
               </div>
            </div>

            <div className="p-8 border-t border-white/10 mt-12">
               <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><BarChart3 size={20} className="text-neutral-400"/> Ledger Transactions</h2>
                 {stats.transactions?.length > 0 ? (
                    <table className="w-full text-left text-sm text-neutral-400">
                      <thead className="uppercase text-[10px] tracking-widest text-neutral-600 border-b border-white/5">
                        <tr>
                          <th className="pb-4 font-medium">Tx Hash</th>
                          <th className="pb-4 font-medium">Date</th>
                          <th className="pb-4 font-medium">Status</th>
                          <th className="pb-4 font-medium text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {stats.transactions.map((tx: any) => (
                           <tr key={tx.id} className="hover:bg-white/[0.01] transition-colors">
                              <td className="py-4 font-mono text-neutral-500">{tx.id.substring(0,8)}</td>
                              <td className="py-4">{new Date(tx.createdAt).toLocaleDateString()}</td>
                              <td className="py-4"><span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded text-[10px] font-mono tracking-widest">{tx.status}</span></td>
                              <td className="py-4 text-right font-bold text-white">₴{Number(tx.totalAmount).toFixed(2)}</td>
                           </tr>
                        ))}
                      </tbody>
                    </table>
                 ) : (
                   <div className="py-12 text-center border border-dashed border-white/10 rounded-2xl bg-white/[0.01]">
                      <p className="text-neutral-500 font-mono text-sm">TRANSACTION_LEDGER_EMPTY // Waiting for traffic</p>
                   </div>
                 )}
            </div>

          </motion.div>
        ) : (
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center justify-center py-32 bg-gradient-to-b from-white/[0.05] to-transparent border border-white/10 rounded-[3rem] shadow-[0_20px_80px_rgba(0,0,0,0.5)]">
            <h2 className="text-3xl font-black text-white mb-4">Affiliate AI Node</h2>
            <p className="text-neutral-400 max-w-md text-center mb-8">
              Станьте партнером TITAN і отримуйте 15% з кожної B2C/B2B транзакції. Усі розрахунки надійно виконуються 1С ядром Колізею автоматично.
            </p>
            <button 
              onClick={attemptGenerateLink}
              disabled={isGenerating}
              className="bg-white text-black hover:bg-neutral-200 px-8 py-4 rounded-full font-bold uppercase tracking-widest text-sm shadow-[0_0_40px_rgba(255,255,255,0.2)] transition-transform active:scale-95 flex items-center gap-2"
            >
              {isGenerating ? 'Deploying...' : 'Initialize Contract'}
            </button>
          </motion.div>
        )}

        {/* EULA Modal */}
        <AnimatePresence>
          {showAgreement && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl"
            >
              <div className="absolute inset-0" onClick={() => setShowAgreement(false)} />
              <motion.div 
                initial={{ y: 50, scale: 0.95 }} animate={{ y: 0, scale: 1 }} exit={{ y: 20, scale: 0.95 }}
                className="bg-[#050505] border border-white/10 p-10 rounded-3xl max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl relative z-10"
              >
                <div className="flex items-center gap-3 mb-6 text-indigo-400 bg-indigo-500/10 px-4 py-2 rounded-xl inline-flex border border-indigo-500/20">
                  <AlertTriangle size={16} /> 
                  <span className="text-xs font-mono font-bold tracking-widest uppercase">Brand Safety Doctrine v2.0</span>
                </div>
                
                <h2 className="text-3xl font-black text-white mb-8 leading-none tracking-tight">TERMS OF ENGAGEMENT</h2>
                
                <div className="space-y-6 text-sm text-neutral-400 leading-relaxed font-medium">
                  <p><strong className="text-white block mb-1">§ A. BRAND SAFETY</strong> Жодних слів "лікує", "для схуднення", "медикаменти". Тільки енергія та смак. За порушення — автоматичне блокування системою AiResponseAudit.</p>
                  <p><strong className="text-white block mb-1">§ B. АНТИ-ДЕМПІНГ</strong> Строго заборонено налаштовувати контекстну рекламу (Google Ads) на бренд-запити OMNIVERSE доменів.</p>
                  <p><strong className="text-white block mb-1">§ C. ФРОД-СИСТЕМА</strong> Самовикупи відслідковуються за Device ID (TelemetryLog). Фродові комісії анулюються перед виплатою.</p>
                </div>
                
                <div className="mt-10 flex gap-4">
                  <button 
                    onClick={() => setShowAgreement(false)}
                    className="flex-1 bg-white/5 hover:bg-white/10 text-white px-6 py-4 rounded-2xl font-bold transition-colors border border-white/10"
                  >
                    DECLINE
                  </button>
                  <button 
                    onClick={handleApply}
                    className="flex-1 bg-white hover:bg-neutral-200 text-black px-6 py-4 rounded-2xl font-bold shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-opacity"
                  >
                    ACCEPT & DEPLOY
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
