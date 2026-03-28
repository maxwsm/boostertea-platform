import { prisma as db } from '@wsm/db';
import OrchestratorClient from './OrchestratorClient';
import Orchestrator3DMap from './Orchestrator3DMap';

export const dynamic = 'force-dynamic';

export default async function OrchestratorPage() {
  const brands = await db.brand.findMany({ select: { id: true, name: true, slug: true }});
  const agents = await db.aiAgent.findMany({
    include: {
      brand: true,
      integrations: true,
      _count: { select: { memories: true } }
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            🤖 AI Workforce Orchestrator
          </h1>
          <p className="text-sm text-gray-400">
            Зберіть "команду" цифрових працівників. Кожен агент має ізольовану пам'ять, специфічний контекст (System Prompt) і підключення до месенджерів (Viber, TG, Insta).
          </p>
        </div>
      </div>

      <Orchestrator3DMap agents={agents as any} brands={brands} />

      <OrchestratorClient initialAgents={agents as any} brands={brands} />
    </div>
  );
}
