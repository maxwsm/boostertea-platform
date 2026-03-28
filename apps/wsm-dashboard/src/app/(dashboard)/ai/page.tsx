import Ai3DCanvas from './Ai3DCanvas';

export default function AiAgentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">AI Cognitive Center</h1>
          <p className="text-gray-400 text-sm mt-1">Manage TAI_COO learning pipelines, behavioral archives, and profit allocation.</p>
        </div>
      </div>

      <Ai3DCanvas />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#111] p-6 rounded-xl border border-white/5">
          <h3 className="text-pink-400 font-bold mb-2">Behavior Archive</h3>
          <p className="text-sm text-gray-400">Total mirrored sessions: <span className="text-white font-mono">1,024</span></p>
          <div className="mt-4 text-xs font-mono text-fuchsia-500 bg-[#0a000a] p-3 rounded-lg border border-pink-500/10">
            Scanning latest intent sequences... Status: Healthy
          </div>
        </div>
        <div className="bg-[#111] p-6 rounded-xl border border-white/5">
          <h3 className="text-purple-400 font-bold mb-2">Elite Mentoring Budget</h3>
          <p className="text-sm text-gray-400">Current accumulation: <span className="text-white font-mono font-bold">$4,250.00</span></p>
          <div className="w-full bg-black h-2 mt-4 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-full w-[65%]"></div>
          </div>
          <p className="text-[10px] text-gray-500 mt-2 text-right">65% to next team event</p>
        </div>
        <div className="bg-[#111] p-6 rounded-xl border border-white/5">
          <h3 className="text-cyan-400 font-bold mb-2">Omni-Routing</h3>
          <p className="text-sm text-gray-400">Active Webhooks: <span className="text-white font-mono">12</span></p>
          <p className="text-sm text-gray-400">Ping Rate: <span className="text-white font-mono">24 req/s</span></p>
        </div>
      </div>
    </div>
  );
}
