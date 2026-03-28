import { prisma as db } from '@wsm/db';
import SupportHubClient from './SupportHubClient';

export const dynamic = 'force-dynamic';

export default async function SupportPage() {
  const memories = await db.agentMemory.findMany({
    orderBy: { updatedAt: 'desc' },
    include: {
      agent: {
        include: {
          brand: { select: { name: true } }
        }
      }
    }
  });

  return (
    <div className="space-y-6 flex flex-col h-[calc(100vh-8rem)]">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          🎧 SLA Support Hub (Live Chat Monitor)
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Єдиний центр моніторингу всіх ШІ-Агентів. Тут ви (оператор) можете читати розмови ботів з клієнтами у реальному часі та втручатися (Human Escalation).
        </p>
      </div>

      <SupportHubClient initialMemories={memories as any} />
    </div>
  );
}
