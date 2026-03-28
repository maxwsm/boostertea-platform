'use client';

import { useState } from 'react';
import { Settings, Shield, Plus, MessageSquare, Save, Trash, FileText, Mic, Globe } from 'lucide-react';

export default function OrchestratorClient({ initialAgents, brands }: { initialAgents: any[], brands: any[] }) {
  const [agents, setAgents] = useState(initialAgents);
  const [activeBrand, setActiveBrand] = useState(brands[0]?.id || '');
  const [editingAgent, setEditingAgent] = useState<any | null>(null);

  // New Agent Form
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    systemPrompt: '',
    canReadFiles: false,
    canReadAudio: false,
    canPostSocial: false,
  });

  const filteredAgents = agents.filter(a => a.brandId === activeBrand);

  const handleSave = async () => {
    try {
      const res = await fetch('/api/orchestrator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, brandId: activeBrand }),
      });
      if (res.ok) {
        const newAgent = await res.json();
        setAgents([newAgent, ...agents]);
        setIsCreating(false);
        setFormData({ name: '', systemPrompt: '', canReadFiles: false, canReadAudio: false, canPostSocial: false });
      }
    } catch(e) {
      alert('Error saving agent');
    }
  };

  const deleteAgent = async (id: string) => {
    if(!confirm("Ви впевнені? Пам'ять цього агента буде назавжди очищена.")) return;
    try {
      await fetch(`/api/orchestrator?id=${id}`, { method: 'DELETE' });
      setAgents(agents.filter(a => a.id !== id));
    } catch(e) {}
  };

  return (
    <div className="space-y-6">
      <div className="flex bg-[#111] p-1 border border-white/10 rounded-lg overflow-x-auto">
        {brands.map(brand => (
          <button
            key={brand.id}
            onClick={() => setActiveBrand(brand.id)}
            className={`flex-1 min-w-[120px] px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${
              activeBrand === brand.id 
                ? 'bg-blue-600 text-white shadow' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {brand.name}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold font-mono">Активні ШІ-Працівники</h2>
        <button 
          onClick={() => setIsCreating(true)}
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
        >
          <Plus size={16} /> Новий Агент
        </button>
      </div>

      {isCreating && (
        <div className="bg-[#111] border border-blue-500/30 rounded-xl p-5 mb-6">
          <h3 className="text-blue-400 font-bold mb-4">Створення нового ШІ агента</h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-gray-400">Посада / Ім'я Агента</label>
              <input 
                placeholder="напр. HR Менеджер"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full bg-[#050505] border border-white/10 rounded px-3 py-2 text-sm text-gray-300 focus:border-blue-500 outline-none mt-1"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400">Системний Промпт (Мозок)</label>
              <textarea 
                placeholder="Ти професійний HR-менеджер. Аналізуй резюме кандидатів які надсилають у Viber..."
                value={formData.systemPrompt}
                onChange={e => setFormData({...formData, systemPrompt: e.target.value})}
                className="w-full bg-[#050505] border border-white/10 rounded px-3 py-2 text-sm text-gray-300 focus:border-blue-500 outline-none mt-1 min-h-[100px]"
              />
            </div>
            
            <div className="flex gap-6 mt-4 p-4 bg-[#050505] rounded-lg border border-white/5">
               <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                 <input type="checkbox" checked={formData.canReadFiles} onChange={e => setFormData({...formData, canReadFiles: e.target.checked})} className="accent-blue-500" />
                 <FileText size={16} className="text-purple-400" /> Читати Файли (PDF, Docs)
               </label>
               <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                 <input type="checkbox" checked={formData.canReadAudio} onChange={e => setFormData({...formData, canReadAudio: e.target.checked})} className="accent-blue-500" />
                 <Mic size={16} className="text-yellow-400" /> Слухати Голосові
               </label>
               <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                 <input type="checkbox" checked={formData.canPostSocial} onChange={e => setFormData({...formData, canPostSocial: e.target.checked})} className="accent-blue-500" />
                 <Globe size={16} className="text-emerald-400" /> Публікувати в Соцмережі
               </label>
            </div>

            <div className="flex gap-3 justify-end mt-4">
              <button onClick={() => setIsCreating(false)} className="px-4 py-2 text-sm text-gray-400 hover:text-white">Скасувати</button>
              <button onClick={handleSave} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded text-sm font-bold flex items-center gap-2">
                <Save size={16} /> Створити Агента
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
        {filteredAgents.map(agent => (
          <div key={agent.id} className="bg-[#111] border border-white/10 rounded-xl overflow-hidden flex flex-col">
            <div className="p-4 border-b border-white/10 bg-[#0A0A0A]/50 flex justify-between items-center">
              <div className="flex items-center gap-2">
                 <div className={`w-2 h-2 rounded-full ${agent.isActive ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                 <h3 className="font-bold text-white text-lg">{agent.name}</h3>
              </div>
              <button onClick={() => deleteAgent(agent.id)} className="text-gray-500 hover:text-red-400"><Trash size={16} /></button>
            </div>
            <div className="p-5 flex-1">
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded-md border border-blue-500/30 flex items-center gap-1">
                   Gemini 1.5 Pro
                </span>
                {agent.canReadFiles && <span className="bg-purple-500/20 text-purple-400 text-xs px-2 py-1 rounded-md flex items-center gap-1"><FileText size={12}/> Файли</span>}
                {agent.canReadAudio && <span className="bg-yellow-500/20 text-yellow-400 text-xs px-2 py-1 rounded-md flex items-center gap-1"><Mic size={12}/> Голос</span>}
                {agent.canPostSocial && <span className="bg-emerald-500/20 text-emerald-400 text-xs px-2 py-1 rounded-md flex items-center gap-1"><Globe size={12}/> Соцмережі</span>}
              </div>
              <p className="text-sm text-gray-400 line-clamp-3 italic mb-4">"{agent.systemPrompt}"</p>
              
              <div className="mt-auto border-t border-white/5 pt-4">
                 <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="flex items-center gap-1"><Shield size={14} /> Ізольована Пам'ять:</span>
                    <span className="text-emerald-400 font-bold">{agent._count?.memories || 0} сесій</span>
                 </div>
                 
                 {/* Webhooks Config Button */}
                 <button className="w-full mt-4 bg-[#1A1D24] hover:bg-[#2A2D34] text-gray-300 border border-white/10 py-2 rounded text-sm transition-colors flex items-center justify-center gap-2">
                    <MessageSquare size={16} /> Налаштувати Канали (VK, TG, Insta)
                 </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
