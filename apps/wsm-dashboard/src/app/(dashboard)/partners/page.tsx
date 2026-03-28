import { prisma as db } from '@wsm/db';
import { ShieldAlert, CheckCircle, Briefcase, FileSearch, Skull, AlertTriangle } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function PartnersPage() {
  const partners = await db.b2BPartner.findMany({
    orderBy: { createdAt: 'desc' },
    include: { user: true }
  });

  const trojanLeads = await db.b2BLead.findMany({
    orderBy: { createdAt: 'desc' },
    include: { user: { select: { name: true, phone: true } } }
  });

  return (
    <div className="relative min-h-screen bg-[#050505] font-sans overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 right-[-10%] w-[600px] h-[600px] bg-red-900/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-[-10%] w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-12 relative z-10 p-8">
        
        <header className="flex flex-col border-b border-white/5 pb-8 mb-8">
          <div className="flex items-center gap-3 mb-3">
             <Briefcase size={20} className="text-zinc-500" />
             <span className="text-xs uppercase font-mono tracking-widest text-zinc-500">Corporate Compliance Interface</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black bg-gradient-to-r from-white to-neutral-500 bg-clip-text text-transparent tracking-tighter">
            B2B LEGAL ENGINE
          </h1>
          <p className="text-neutral-500 mt-3 text-sm font-medium w-full md:max-w-2xl leading-relaxed">
            Модуль підключено до симуляції YouControl та Податкової. Оцінка кредитних ризиків та судових справ клієнтів відбувається в режимі реального часу.
          </p>
        </header>

        <div>
          <h2 className="text-sm font-bold tracking-[0.2em] text-white uppercase mb-6 flex items-center gap-2">
            <ShieldAlert size={16} className="text-blue-500"/> Verified Entities
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {partners.length === 0 ? (
              <div className="p-12 border border-dashed border-white/10 rounded-3xl bg-white/[0.01] text-center text-zinc-600 font-mono text-sm col-span-full">
                DATABASE_EMPTY // No Partners Loaded
              </div>
            ) : partners.map((partner, idx) => (
              <div key={partner.id} className="p-6 md:p-8 rounded-[2rem] bg-white/[0.02] backdrop-blur-3xl border border-white/5 hover:border-white/20 transition-all shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_10px_30px_rgba(0,0,0,0.5)] group relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/[0.02] rounded-full blur-3xl group-hover:bg-blue-500/10 transition-colors pointer-events-none" />
                
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-black text-white leading-tight mb-2 uppercase drop-shadow-md">{partner.companyName}</h3>
                    <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 w-max rounded-lg border border-white/5">
                      <span className="text-[10px] text-zinc-500 font-mono tracking-widest">ЄДРПОУ</span>
                      <span className="text-xs text-zinc-300 font-mono shadow-[0_0_10px_rgba(255,255,255,0.1)]">{partner.edrpou || 'N/A'}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-8">
                  {partner.isVerified && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold tracking-widest uppercase rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.15)]">
                      <CheckCircle size={12} /> KYC Passed
                    </div>
                  )}
                  {partner.hasTaxDebt ? (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold tracking-widest uppercase rounded-full bg-red-500/10 text-red-500 border border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.2)] animate-pulse">
                      <AlertTriangle size={12} /> Tax Debt
                    </div>
                  ) : (
                    <div className="px-3 py-1.5 text-[10px] font-bold tracking-widest uppercase rounded-full bg-emerald-500/5 text-emerald-500 border border-emerald-500/10">
                      Clean Record
                    </div>
                  )}
                </div>
                
                <div className="text-xs font-mono border-t border-white/5 pt-4 flex flex-col gap-3">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Legal Risk:</span>
                    <span className={partner.courtCasesCount > 0 ? "text-red-400 font-bold" : "text-zinc-300"}>
                      {partner.courtCasesCount} cases
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Contact:</span>
                    <span className="text-white bg-white/5 px-2 rounded">{partner.user?.name || 'Unassigned'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 border-t border-red-500/10 pt-16 relative">
          <div className="absolute top-0 left-10 w-full h-px bg-gradient-to-r from-red-500/40 to-transparent blur-[2px]" />
          
          <h2 className="text-sm font-bold tracking-[0.2em] text-red-400 uppercase mb-8 flex items-center gap-2 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]">
            <Skull size={18} className="animate-pulse" /> Trojan Protocol (C2B2B)
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trojanLeads.length === 0 ? (
              <div className="p-12 border border-dashed border-red-500/20 rounded-3xl bg-red-900/5 text-center text-red-500/50 font-mono text-sm col-span-full">
                NO_INTEL_GATHERED // Awaiting Scout Hits
              </div>
            ) : trojanLeads.map((lead, idx) => (
              <div key={lead.id} className="p-6 md:p-8 bg-black/60 backdrop-blur-3xl border border-red-500/20 rounded-[2rem] relative overflow-hidden group shadow-[inset_0_1px_0_rgba(239,68,68,0.1),0_10px_40px_rgba(0,0,0,0.8)]">
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-red-500/10 blur-[60px] pointer-events-none group-hover:bg-red-500/20 transition-all duration-700" />
                
                <div className="flex justify-between items-start mb-6 relative z-10">
                  <h3 className="font-black text-2xl text-white uppercase drop-shadow-lg">{lead.cafeName}</h3>
                  <div className="bg-red-500/20 p-2 rounded-xl border border-red-500/30">
                    <FileSearch size={16} className="text-red-400" />
                  </div>
                </div>
                
                <p className="text-sm font-mono text-zinc-400 mb-6 bg-white/5 p-3 rounded-lg border border-white/5 inline-block">
                  {lead.city}, {lead.address}
                </p>
                
                <div className="bg-[#050505] p-4 rounded-xl border border-white/5 mb-6 shadow-[inset_0_0_15px_rgba(0,0,0,0.5)] relative">
                  <span className="absolute -top-2 left-3 bg-red-900 text-[9px] uppercase font-bold tracking-widest text-red-200 px-2 py-0.5 rounded shadow-[0_0_10px_rgba(239,68,68,0.5)]">Scout Intel</span>
                  <p className="text-xs font-mono text-zinc-300 italic leading-relaxed pt-2">
                    "{lead.notes || 'No visual confirmation.'}"
                  </p>
                </div>

                <div className="flex justify-between items-center text-[10px] uppercase font-mono tracking-widest text-zinc-600 border-t border-white/5 pt-4">
                  <span className="flex items-center gap-1">AGENT: <strong className="text-red-400">{lead.user?.name || 'Anon'}</strong></span>
                  <span>{new Date(lead.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
      </div>
    </div>
  );
}
