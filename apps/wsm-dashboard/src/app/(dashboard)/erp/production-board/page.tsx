import { Suspense } from 'react';
import { prisma } from '@wsm/db';
import ProductionKanban from './ProductionKanban';

export const metadata = {
  title: 'WSM Food ERP | Production Board'
};

export default async function ProductionBoardPage() {
  const openOrders = await prisma.manufacturingOrder.findMany({
    where: { 
      status: { not: 'CANCELLED' } 
    },
    include: {
      techCard: {
        include: {
          knowledgeDocument: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="flex h-screen bg-[#09090b] text-white">
      {/* Sidebar Analytics or Tools */}
      <aside className="w-64 border-r border-white/10 bg-black/50 p-4 pt-20 hidden md:block">
        <h2 className="text-sm font-semibold uppercase text-zinc-400 tracking-wider mb-6">
          Food R&D Engine
        </h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-xs uppercase text-zinc-500 mb-2 font-mono">Operations</h3>
            <button className="w-full text-left p-2 rounded hover:bg-white/5 text-sm font-medium border border-dashed border-white/20 transition-colors">
              + Add Manufacturing Order
            </button>
          </div>

          <div>
            <h3 className="text-xs uppercase text-zinc-500 mb-2 font-mono">Native 1C Sync</h3>
            <div className="bg-primary/10 border border-primary/20 rounded p-3">
              <span className="flex h-2 w-2 bg-primary rounded-full animate-ping absolute"></span>
              <span className="flex h-2 w-2 bg-primary rounded-full"></span>
              <p className="text-xs text-primary mt-2 font-mono mt-0 ml-4">
                Ledger Connected. Drags map to Account Move
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-xs uppercase text-zinc-500 mb-2 font-mono">FEFO Logistics</h3>
            <div className="bg-white/5 rounded px-3 py-2 text-xs text-zinc-400">
              Lot tracking active. Automatically deducting oldest syrup first.
            </div>
          </div>
        </div>
      </aside>

      {/* Main Drag & Drop Canvas */}
      <main className="flex-1 flex flex-col h-full overflow-hidden pt-20 px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
              Infinite Production Canvas
            </h1>
            <p className="text-zinc-500 text-sm mt-1">
              Top-10 Industry Motorics (FEFO, HACCP, Costing) mapped into Drag-and-Drop
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-x-auto no-scrollbar pb-8">
          <Suspense fallback={<div className="animate-pulse bg-white/5 h-64 rounded-xl w-full"></div>}>
            <ProductionKanban initialOrders={JSON.parse(JSON.stringify(openOrders))} />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
