'use client';

import { useState } from 'react';
import { Box, Plus, Save, ArrowRight, CheckCircle } from 'lucide-react';

export default function InventoryClient({ initialMoves, products, partners }: { initialMoves: any[], products: any[], partners: any[] }) {
  const [moves, setMoves] = useState(initialMoves);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    productId: '',
    sourceLocId: 'WH/Stock',
    destLocId: 'Partner Locations/Customers',
    qty: 1,
    partnerId: ''
  });

  const handleCreate = async () => {
    if (!formData.productId) return alert('Оберіть товар');
    if (formData.qty <= 0) return alert('Кількість має бути більше 0');

    try {
      const res = await fetch('/api/erp/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        const newMove = await res.json();
        setMoves([newMove, ...moves]);
        setIsCreating(false);
      }
    } catch(e) {}
  };

  const confirmMove = async (id: string) => {
    try {
      const res = await fetch(`/api/erp/inventory`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, state: 'DONE' })
      });
      if (res.ok) {
        setMoves(moves.map(m => m.id === id ? { ...m, state: 'DONE' } : m));
      }
    } catch(e) {}
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-4">
          <div className="bg-[#111] border border-white/10 p-4 rounded-xl">
            <p className="text-xs text-gray-500 uppercase">Всі переміщення</p>
            <p className="text-xl font-bold text-white">{moves.length}</p>
          </div>
          <div className="bg-[#111] border border-blue-500/20 p-4 rounded-xl">
            <p className="text-xs text-gray-500 uppercase">Очікують (DRAFT)</p>
            <p className="text-xl font-bold text-blue-400">{moves.filter(m => m.state === 'DRAFT').length}</p>
          </div>
        </div>
        <button 
          onClick={() => setIsCreating(true)}
          className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
        >
          <Plus size={16} /> Створити Переміщення
        </button>
      </div>

      {isCreating && (
        <div className="bg-[#111] border border-purple-500/30 rounded-xl p-5 mb-6">
          <h3 className="text-purple-400 font-bold mb-4 flex items-center gap-2"><Box size={18}/> Draft: Stock Move</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="lg:col-span-2">
              <label className="text-xs text-gray-400">Товар (Product)</label>
              <select 
                value={formData.productId} onChange={e => setFormData({...formData, productId: e.target.value})}
                className="w-full bg-[#050505] border border-white/10 rounded px-3 py-2 text-sm text-gray-300 outline-none mt-1"
              >
                <option value="">-- Оберіть Товар --</option>
                {products.map(p => <option key={p.id} value={p.id}>{p.nameUk} (SKU: {p.sku || p.id.slice(0,5)})</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-400">Кількість (Qty)</label>
              <input 
                type="number" min="1"
                value={formData.qty} onChange={e => setFormData({...formData, qty: Number(e.target.value)})}
                className="w-full bg-[#050505] border border-white/10 rounded px-3 py-2 text-sm text-gray-300 outline-none mt-1"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400">Одержувач (Partner)</label>
              <select 
                value={formData.partnerId} onChange={e => setFormData({...formData, partnerId: e.target.value})}
                className="w-full bg-[#050505] border border-white/10 rounded px-3 py-2 text-sm text-gray-300 outline-none mt-1"
              >
                <option value="">-- Внутрішнє переміщення --</option>
                {partners.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-[#050505] p-4 rounded-lg border border-white/5 mb-6">
            <div className="flex-1">
               <label className="text-xs text-gray-500">Звідки (Source Location)</label>
               <input value={formData.sourceLocId} onChange={e => setFormData({...formData, sourceLocId: e.target.value})} className="w-full bg-transparent border-b border-white/10 px-1 py-1 text-sm text-gray-300 focus:border-purple-500 outline-none mt-1" />
            </div>
            <ArrowRight size={20} className="text-gray-600 mt-4" />
            <div className="flex-1">
               <label className="text-xs text-gray-500">Куди (Dest Location)</label>
               <input value={formData.destLocId} onChange={e => setFormData({...formData, destLocId: e.target.value})} className="w-full bg-transparent border-b border-white/10 px-1 py-1 text-sm text-gray-300 focus:border-purple-500 outline-none mt-1" />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button onClick={() => setIsCreating(false)} className="px-4 py-2 text-sm text-gray-400 hover:text-white">Скасувати</button>
            <button onClick={handleCreate} className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-2 rounded text-sm font-bold flex items-center gap-2">
              <Save size={16} /> Зберегти як Чернетку (DRAFT)
            </button>
          </div>
        </div>
      )}

      <div className="bg-[#111] border border-white/10 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm text-gray-300">
          <thead className="bg-[#1A1D24] border-b border-white/10 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-5 py-3">Date</th>
              <th className="px-5 py-3">Product</th>
              <th className="px-5 py-3">From {"->"} To</th>
              <th className="px-5 py-3">Qty</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {moves.map(m => {
              const product = products.find(p => p.id === m.productId);
              return (
                <tr key={m.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-5 py-4">{new Date(m.createdAt).toLocaleDateString()}</td>
                  <td className="px-5 py-4 font-medium text-purple-300">{product?.nameUk || 'Unknown Product'}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="bg-gray-800 px-2 py-1 rounded">{m.sourceLocId}</span>
                      <ArrowRight size={12} className="text-gray-500"/>
                      <span className="bg-gray-800 px-2 py-1 rounded">{m.destLocId}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 font-bold">{m.qty}</td>
                  <td className="px-5 py-4">
                    <span className={`px-2 py-1 text-[10px] font-bold rounded-md ${m.state === 'DONE' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'}`}>
                      {m.state}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    {m.state === 'DRAFT' && (
                      <button onClick={() => confirmMove(m.id)} className="text-indigo-400 hover:text-indigo-300 text-xs flex items-center gap-1 justify-end w-full">
                        <CheckCircle size={14}/> Підтвердити (DONE)
                      </button>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
