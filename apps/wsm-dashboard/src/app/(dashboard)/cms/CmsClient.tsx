'use client';

import { useState, useEffect } from 'react';
import GenerativeCmsModule from '../../../components/cms/GenerativeCmsModule'; // Integrate user's AI module

type Brand = { id: string; name: string; slug: string };
type BrandContent = { id: string; key: string; value: string };

export default function CmsClient({ brands }: { brands: Brand[] }) {
  const [activeBrandId, setActiveBrandId] = useState<string>(brands[0]?.id || '');
  const [contents, setContents] = useState<BrandContent[]>([]);
  const [loading, setLoading] = useState(true);

  // New Key Form
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  const [savingKey, setSavingKey] = useState<string | null>(null);

  useEffect(() => {
    if (activeBrandId) fetchContents();
  }, [activeBrandId]);

  const fetchContents = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/cms?brandId=${activeBrandId}`);
      if (res.ok) {
        const data = await res.json();
        setContents(data.contents);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (key: string, value: string) => {
    setSavingKey(key);
    try {
      const res = await fetch('/api/cms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brandId: activeBrandId, key, value })
      });
      if (res.ok) {
        // Refresh or just rely on local state if desired, but refreshing is safer
        await fetchContents();
        if (key === newKey) {
          setNewKey('');
          setNewValue('');
        }
      }
    } catch(e) {
      alert('Failed to save');
    } finally {
      setSavingKey(null);
    }
  };

  const activeBrand = brands.find(b => b.id === activeBrandId);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      
      {/* LEFT COLUMN: Data View */}
      <div className="xl:col-span-2 space-y-6">
        
        {/* Brand Tabs */}
        <div className="flex bg-[#111] p-1 border border-white/10 rounded-lg overflow-x-auto">
          {brands.map(brand => (
            <button
              key={brand.id}
              onClick={() => setActiveBrandId(brand.id)}
              className={`flex-1 min-w-[120px] px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${
                activeBrandId === brand.id 
                  ? 'bg-blue-600 text-white shadow' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {brand.name}
            </button>
          ))}
        </div>

        {/* Content Dictionary */}
        <div className="bg-[#111] border border-white/10 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-white/10 bg-[#0A0A0A]/50 flex justify-between items-center">
            <h3 className="font-bold text-white">Global Variables ({activeBrand?.name})</h3>
            <span className="text-xs text-gray-400">Auto-syncs to edge</span>
          </div>
          
          <div className="p-0">
            {loading ? (
              <div className="p-8 text-center text-gray-500">Loading configurations...</div>
            ) : contents.length === 0 ? (
              <div className="p-8 text-center text-gray-500">No content keys defined yet for {activeBrand?.name}.</div>
            ) : (
              <div className="divide-y divide-white/10">
                {contents.map(item => (
                  <div key={item.id} className="p-4 hover:bg-white/5 transition-colors">
                    <label className="block text-xs font-mono text-emerald-400 mb-2">{item.key}</label>
                    <textarea 
                      defaultValue={item.value}
                      onBlur={(e) => {
                        if (e.target.value !== item.value) {
                          handleSave(item.key, e.target.value);
                        }
                      }}
                      className="w-full bg-[#050505] border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-300 focus:border-blue-500 outline-none resize-y min-h-[60px]"
                    />
                    {savingKey === item.key && <span className="text-xs text-blue-400 mt-1 block">Saving...</span>}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add New Key */}
          <div className="p-4 bg-[#0A0A0A] border-t border-white/10">
            <h4 className="text-xs font-bold text-gray-400 uppercase mb-3">Add New Variable</h4>
            <div className="flex gap-3 items-start">
              <input 
                placeholder="e.g. hero_banner_text" 
                value={newKey} onChange={e => setNewKey(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                className="w-1/3 bg-[#050505] border border-white/10 rounded px-3 py-2 text-sm text-gray-300 focus:border-blue-500 outline-none font-mono"
              />
              <textarea 
                placeholder="Content value..." 
                value={newValue} onChange={e => setNewValue(e.target.value)}
                className="flex-1 bg-[#050505] border border-white/10 rounded px-3 py-2 text-sm text-gray-300 focus:border-blue-500 outline-none resize-y h-[38px]"
              />
              <button 
                onClick={() => handleSave(newKey, newValue)}
                disabled={!newKey || !newValue || savingKey === newKey}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded text-sm font-medium transition-colors"
              >
                Add Key
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* RIGHT COLUMN: AI Assistant */}
      <div className="xl:col-span-1">
        <GenerativeCmsModule />
      </div>

    </div>
  );
}
