import { prisma as db } from '@wsm/db';
import Link from 'next/link';
import ColosseumTour from './components/ColosseumTour';
import AdvertisingTrinity3D from './components/AdvertisingTrinity3D';
import { ChevronDown, ArrowRight, Zap, PlayCircle, ShieldCheck } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'WSM COLOSSEUM | Master Ecosystem' };

export default async function DashboardHome() {
  const allProducts = await db.product.findMany({ take: 5, orderBy: { createdAt: 'desc' } });
  const brands = await db.brand.findMany();
  
  const totalProducts = await db.product.count();
  const activeFranchises = brands.length;

  return (
    <div className="relative min-h-screen bg-[#050505] overflow-hidden text-zinc-100 font-sans p-2">
      <ColosseumTour />
      
      {/* Absolute Ambient Background Lights for Deep Volumetric Feel */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[50%] bg-purple-600/10 rounded-full blur-[150px] mix-blend-screen pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-12 relative z-10 pt-4">
        
        {/* Header Module */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <p className="text-xs font-mono tracking-widest uppercase text-emerald-400">System AI Link: STABLE</p>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent">
              COLOSSEUM OS
            </h1>
            <p className="text-zinc-500 mt-2 max-w-xl text-sm leading-relaxed">
              Master control interface for the WSM Omniverse. Managing 1C Financials, Miro-style Production, and Notion-cloned Tech Cards under one AI sovereignty.
            </p>
          </div>
          
          <div className="flex gap-4">
            <button className="flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl backdrop-blur-xl text-sm font-medium transition-all shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
              Last Synced: Just now <ChevronDown size={14} className="text-zinc-400" />
            </button>
            <Link href="/erp/production-board" className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary to-blue-500 hover:brightness-110 text-black border border-white/20 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)]">
              <PlayCircle size={16} /> Open Production Engine
            </Link>
          </div>
        </header>

        {/* Top 3 Metrics (Deep Glassmorphism) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white/[0.02] backdrop-blur-3xl border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_8px_32px_rgba(0,0,0,0.5)] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 blur-[50px] -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-500/30 transition-colors" />
            <h3 className="text-xs text-zinc-400 font-semibold tracking-wider uppercase mb-1">Total Assets Connected</h3>
            <p className="text-4xl font-black text-white">{totalProducts}</p>
            <div className="mt-6 flex items-center justify-between text-xs text-zinc-500">
              <span className="flex items-center gap-1"><ShieldCheck size={14} className="text-emerald-400"/> Synced w/ @wsm/db</span>
              <span className="font-mono">+12.4%</span>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white/[0.02] backdrop-blur-3xl border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_8px_32px_rgba(0,0,0,0.5)] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 blur-[50px] -translate-y-1/2 translate-x-1/2 group-hover:bg-purple-500/30 transition-colors" />
            <h3 className="text-xs text-zinc-400 font-semibold tracking-wider uppercase mb-1">Active Franchises</h3>
            <p className="text-4xl font-black text-white">{activeFranchises}</p>
            <div className="mt-6 flex items-center justify-between text-xs text-zinc-500">
              <span>All Hubs Online</span>
              <span className="font-mono text-emerald-400">100% UPTIME</span>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white/[0.02] backdrop-blur-3xl border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_8px_32px_rgba(0,0,0,0.5)] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 blur-[50px] -translate-y-1/2 translate-x-1/2 group-hover:bg-emerald-500/30 transition-colors" />
            <h3 className="text-xs text-zinc-400 font-semibold tracking-wider uppercase mb-1">Financial Ledger (1C)</h3>
            <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-emerald-500">
              Active
            </p>
            <div className="mt-6 flex items-center justify-between text-xs text-zinc-500">
              <span className="flex items-center gap-1"><Zap size={14} className="text-amber-400"/> Double-entry engine</span>
              <span className="font-mono">LIVE DND</span>
            </div>
          </div>
        </div>

        {/* Main Split View: 3D Trinity & The Logistics Table */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          
          {/* 3D Trinity Component (Spans 3 cols) */}
          <div className="lg:col-span-3">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-blue-400">❖</span> CAPI Circulation & Retarget Simulator
            </h3>
            <AdvertisingTrinity3D />
            <p className="text-xs text-zinc-500 mt-4 leading-relaxed max-w-2xl px-2">
              * Візуалізація циркуляції лідів: Система симулює живий потік трафіку між Google, TikTok та Meta. Відмови отримують лазерний імпульс (Retarget Ping) і повертаються у Колізей як фінальні конверсії.
            </p>
          </div>

          {/* Unified Catalog Module (Spans 2 cols) */}
          <div className="lg:col-span-2 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="text-purple-400">☗</span> Live Catalog Stream
              </h3>
              <Link href="/catalog" className="text-xs font-mono text-zinc-400 hover:text-white flex items-center gap-1 transition-colors">
                View All <ArrowRight size={12} />
              </Link>
            </div>
            
            <div className="flex-1 bg-white/[0.02] backdrop-blur-3xl border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_8px_32px_rgba(0,0,0,0.5)] rounded-2xl p-1 overflow-hidden">
              <div className="max-h-[400px] overflow-y-auto no-scrollbar rounded-xl">
                <table className="w-full text-left text-sm text-zinc-300">
                  <thead className="sticky top-0 bg-[#0A0A0A]/90 backdrop-blur-md z-10 text-[10px] text-zinc-500 uppercase tracking-widest border-b border-white/5">
                    <tr>
                      <th className="px-5 py-4 font-medium">SKU / Entity</th>
                      <th className="px-5 py-4 font-medium text-right">Pricing (UAH)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {allProducts.map(product => (
                      <tr key={product.id} className="hover:bg-white/[0.02] transition-colors group cursor-pointer">
                        <td className="px-5 py-4">
                          <p className="font-semibold text-white group-hover:text-primary transition-colors">{product.nameUk}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono border border-blue-500/30 text-blue-400 bg-blue-500/10">
                              {product.brandId || 'GLOBAL'}
                            </span>
                            <span className="text-[10px] text-zinc-500">{product.category}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <p className="font-mono text-zinc-300">{product.price.toString()} ₴</p>
                          <span className="text-[10px] text-emerald-400 flex items-center justify-end gap-1 mt-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> In Stock
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          
        </div>

      </div>
    </div>
  );
}
