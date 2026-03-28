import { prisma as db } from '@wsm/db';

export const dynamic = 'force-dynamic';

export default async function LogisticsPage() {
  const scores = await db.carrierScore.findMany({
    include: { user: true },
    orderBy: { score: 'desc' }
  });

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Gamified Logistics & Warehouse</h1>
      <p className="text-gray-400">Progress bars, worker achievements, and real-time cargo tracking.</p>

      {/* Leaderboard */}
      <div className="bg-[#111] border border-white/10 rounded-xl p-6">
        <h2 className="text-lg font-bold text-white mb-4">Carrier Score Leaderboard</h2>
        <div className="space-y-4">
          {scores.length === 0 ? (
            <p className="text-gray-500 text-sm">No carrier statistics available yet.</p>
          ) : scores.map((score, idx) => (
             <div key={score.id} className="flex items-center justify-between p-4 rounded-lg bg-[#1a1a1a] border border-white/5">
              <div className="flex items-center gap-4">
                <span className="text-xl font-bold text-gray-600">#{idx + 1}</span>
                <div>
                  <h4 className="text-gray-200 font-medium">{score.user.name || 'Worker'}</h4>
                  <p className="text-xs text-gray-500">{score.level} • {score.packSpeed.toString()} pkgs/h</p>
                </div>
              </div>
              <div className="text-emerald-400 font-bold font-mono">
                {score.score} XP
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
