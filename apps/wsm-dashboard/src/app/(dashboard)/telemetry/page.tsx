import { prisma as db } from '@wsm/db';

export const dynamic = 'force-dynamic';

export default async function TelemetryPage() {
  const audits = await db.aiResponseAudit.findMany({
    orderBy: { createdAt: 'desc' },
    take: 50,
    include: { user: true, brand: true }
  });

  const rewards = await db.transaction.findMany({
    orderBy: { createdAt: 'desc' },
    take: 50
  });

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Telemetry & AI Audit</h1>
        <p className="text-gray-400">WSM Founder Logic Paradigm: Контроль рентабельності ШІ-токенів та дзеркалювання поведінки.</p>

        <div className="bg-[#111] border border-white/10 rounded-xl overflow-hidden mt-6">
          <table className="w-full text-left text-sm text-gray-300">
          <thead className="text-xs text-gray-500 uppercase bg-[#0A0A0A] border-b border-white/5">
            <tr>
              <th className="px-4 py-3">ID / Time</th>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Brand</th>
              <th className="px-4 py-3">Model Used</th>
              <th className="px-4 py-3 text-right">Cost (USD)</th>
            </tr>
          </thead>
          <tbody>
            {audits.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-600">No AI requests logged yet in the new schema.</td></tr>
            ) : (audits.map(audit => (
              <tr key={audit.id} className="border-b border-white/5 hover:bg-white/5">
                <td className="px-4 py-3 font-mono text-xs">{audit.id.split('-')[0]}<br/><span className="text-gray-600">{audit.createdAt.toLocaleTimeString()}</span></td>
                <td className="px-4 py-3">{audit.user?.name || audit.userId || 'Guest'}</td>
                <td className="px-4 py-3">{audit.brand?.name || 'Global'}</td>
                <td className="px-4 py-3"><span className="px-2 py-1 bg-purple-500/10 text-purple-400 rounded-full text-xs box-border border border-purple-500/20">{audit.modelUsed}</span></td>
                <td className="px-4 py-3 text-right text-emerald-400">${audit.costUsd.toFixed(4)}</td>
              </tr>
            )))}
          </tbody>
        </table>
      </div>
      </div>

      <div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">Global Syndicate Transactions</h1>
        <p className="text-gray-400">Referrals, POS events, and Barista WSM-Coin injections.</p>

        <div className="bg-[#111] border border-white/10 rounded-xl overflow-hidden mt-6">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="text-xs text-gray-500 uppercase bg-[#0A0A0A] border-b border-white/5">
              <tr>
                <th className="px-4 py-3">ID / Time</th>
                <th className="px-4 py-3">Resident</th>
                <th className="px-4 py-3">Action Type</th>
                <th className="px-4 py-3">Reward / Reason</th>
                <th className="px-4 py-3 text-right">Points Transacted</th>
              </tr>
            </thead>
            <tbody>
              {rewards.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-600">No syndicate transactions recorded yet.</td></tr>
              ) : (rewards.map((tx: any) => (
                <tr key={tx.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="px-4 py-3 font-mono text-xs">{tx.id.split('-')[0]}<br/><span className="text-gray-600">{tx.createdAt.toLocaleTimeString()}</span></td>
                  <td className="px-4 py-3">{tx.buyerName || 'System'}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs rounded-full border ${tx.status === 'PAID' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-orange-500/10 text-orange-400 border-orange-500/20'}`}>
                      {tx.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400">Order ID: {tx.orderId || 'N/A'}</td>
                  <td className={`px-4 py-3 text-right font-bold ${tx.status === 'PAID' ? 'text-green-400' : 'text-orange-400'}`}>
                    ₴{tx.totalAmount}
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
