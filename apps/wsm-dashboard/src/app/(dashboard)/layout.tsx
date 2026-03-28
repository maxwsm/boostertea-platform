import Link from 'next/link';
import LogoutButton from './LogoutButton';

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 bg-[#111] flex flex-col">
        <div className="p-6 border-b border-white/10">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
            WSM Neural Center
          </h1>
        </div>
        
        <div className="p-4 border-b border-white/10">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Context Switcher</p>
          <select className="w-full bg-[#222] border border-white/20 rounded p-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors cursor-pointer">
            <option value="all">🌍 Вся Екосистема</option>
            <option value="boostertea">🍵 BoosterTea (B2B/B2C)</option>
            <option value="dinoslush">🦖 DinoSlush (Seasonal)</option>
            <option value="funnydrops">💧 FunnyDrops (HoReCa)</option>
            <option value="tlab">🧪 TeaLab (Experimental)</option>
          </select>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          <div className="text-xs text-gray-400 uppercase tracking-wider mb-2 mt-6">Settings</div>
          <Link href="/legal" className="block px-3 py-2 rounded bg-pink-500/10 text-pink-400 border border-pink-500/20 transition-colors font-bold flex items-center gap-2">⚖️ 3D Legal Audit</Link>
          <Link href="/founder" className="block px-3 py-2 rounded bg-fuchsia-500/20 text-fuchsia-400 border border-fuchsia-500/30 transition-colors font-bold flex items-center gap-2 shadow-[0_0_15px_rgba(217,70,239,0.3)]">👑 Master Brain (Founder OS)</Link>
          <Link href="/profile" className="block px-3 py-2 rounded hover:bg-white/5 text-gray-300 transition-colors">My Profile</Link>
          <div className="text-xs text-gray-400 uppercase tracking-wider mb-2 mt-4">Enterprise ERP</div>
          <Link href="/" className="block px-3 py-2 rounded hover:bg-white/5 text-gray-300 transition-colors">Головна</Link>
          <Link href="/orders" className="block px-3 py-2 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 transition-colors font-bold flex items-center gap-2">🛒 Orders Kanban</Link>
          <Link href="/catalog" className="block px-3 py-2 rounded hover:bg-white/5 text-gray-300 transition-colors">📦 Master Catalog</Link>
          <Link href="/tasks" className="block px-3 py-2 rounded bg-orange-500/10 text-orange-400 border border-orange-500/20 transition-colors font-bold flex items-center gap-2">📋 Team Tasks</Link>
          <Link href="/cms" className="block px-3 py-2 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 transition-colors">🧠 Headless CMS (A to Z)</Link>
          <Link href="/erp/crm" className="block px-3 py-2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 transition-colors font-bold flex items-center gap-2">👥 Unified CRM (Odoo)</Link>
          <Link href="/erp/accounting" className="block px-3 py-2 rounded bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 transition-colors font-bold flex items-center gap-2">💰 Accounting</Link>
          <Link href="/erp/inventory" className="block px-3 py-2 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 transition-colors font-bold flex items-center gap-2">📦 Virtual Inventory</Link>
          <Link href="/partners" className="block px-3 py-2 rounded hover:bg-white/5 text-gray-300 transition-colors">B2B Compliance (Debt)</Link>
          
          <div className="text-xs text-gray-400 uppercase tracking-wider mb-2 mt-6">AI & Omnichannel</div>
          <Link href="/ai" className="block px-3 py-2 rounded bg-pink-500/10 text-pink-400 border border-pink-500/20 transition-colors font-bold flex items-center gap-2 shadow-[0_0_15px_rgba(236,72,153,0.15)]">🧠 AI Cognitive Center</Link>
          <Link href="/orchestrator" className="block px-3 py-2 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 transition-colors font-bold flex items-center gap-2">🤖 AI Orchestrator</Link>
          <Link href="/support" className="block px-3 py-2 rounded bg-red-500/10 text-red-400 border border-red-500/20 transition-colors font-bold flex items-center gap-2">🎧 SLA Support Hub</Link>
          <Link href="/telemetry" className="block px-3 py-2 rounded hover:bg-white/5 text-gray-300 transition-colors">AiResponse Audit</Link>
          
          <div className="text-xs text-gray-400 uppercase tracking-wider mb-2 mt-6">Logistics & Gamification</div>
          <Link href="/logistics" className="block px-3 py-2 rounded hover:bg-white/5 text-gray-300 transition-colors">Cargo & Achievements</Link>
        </nav>
      </aside>

      {/* Main Workspace */}
      <main className="flex-1 overflow-y-auto bg-[#050505]">
        <header className="h-16 border-b border-white/10 flex items-center justify-between px-8 bg-[#0A0A0A]/80 backdrop-blur sticky top-0 z-10">
          <h2 className="text-lg font-medium text-gray-200">Global Overview</h2>
          <div className="flex items-center gap-4">
            <div className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-sm border border-emerald-500/20">
              ● Systems Online
            </div>
            <LogoutButton />
          </div>
        </header>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
