'use client';

import { useState } from 'react';
import { FileText, Plus, Save, TrendingUp, TrendingDown, CheckCircle, Trash } from 'lucide-react';

export default function AccountingClient({ initialMoves, partners }: { initialMoves: any[], partners: any[] }) {
  const [moves, setMoves] = useState(initialMoves);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    type: 'ENTRY',
    reference: '',
    partnerId: '',
    lines: [
      { accountId: '1001 Cash', debit: 0, credit: 0, label: '' },
      { accountId: '4000 Sales Revenue', debit: 0, credit: 0, label: '' }
    ]
  });

  const totalDebit = formData.lines.reduce((sum, line) => sum + Number(line.debit), 0);
  const totalCredit = formData.lines.reduce((sum, line) => sum + Number(line.credit), 0);
  const isBalanced = totalDebit === totalCredit && totalDebit > 0;

  const handleCreate = async () => {
    if (!isBalanced) return alert('Журнальний запис не збалансований! Дебет має дорівнювати Кредиту.');
    try {
      const res = await fetch('/api/erp/accounting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        const newMove = await res.json();
        setMoves([newMove, ...moves]);
        setIsCreating(false);
      } else {
        alert('Помилка сервера');
      }
    } catch(e) {}
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-4">
          <div className="bg-[#111] border border-white/10 p-4 rounded-xl">
            <p className="text-xs text-gray-500 uppercase">Всі записи</p>
            <p className="text-xl font-bold text-white">{moves.length}</p>
          </div>
          <div className="bg-[#111] border border-emerald-500/20 p-4 rounded-xl">
            <p className="text-xs text-gray-500 uppercase">Збалансовані (POSTED)</p>
            <p className="text-xl font-bold text-emerald-400">{moves.filter(m => m.state === 'POSTED').length}</p>
          </div>
        </div>
        <button 
          onClick={() => setIsCreating(true)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
        >
          <Plus size={16} /> Новий Журнальний Запис
        </button>
      </div>

      {isCreating && (
        <div className="bg-[#111] border border-indigo-500/30 rounded-xl p-5 mb-6">
          <h3 className="text-indigo-400 font-bold mb-4 flex items-center gap-2"><FileText size={18}/> Draft: Account Move</h3>
          
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div>
              <label className="text-xs text-gray-400">Тип</label>
              <select 
                value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}
                className="w-full bg-[#050505] border border-white/10 rounded px-3 py-2 text-sm text-gray-300 outline-none mt-1"
              >
                <option value="ENTRY">Manual Journal Entry</option>
                <option value="OUT_INVOICE">Customer Invoice</option>
                <option value="IN_INVOICE">Vendor Bill</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-400">Ререфенс (Опціонально)</label>
              <input 
                placeholder="INV-0001"
                value={formData.reference} onChange={e => setFormData({...formData, reference: e.target.value})}
                className="w-full bg-[#050505] border border-white/10 rounded px-3 py-2 text-sm text-gray-300 outline-none mt-1"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400">Партнер</label>
              <select 
                value={formData.partnerId} onChange={e => setFormData({...formData, partnerId: e.target.value})}
                className="w-full bg-[#050505] border border-white/10 rounded px-3 py-2 text-sm text-gray-300 outline-none mt-1"
              >
                <option value="">-- Без Партнера --</option>
                {partners.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-300 mb-2 border-b border-white/10 pb-2">Рядки Проводки (Move Lines)</h4>
            {formData.lines.map((line, idx) => (
              <div key={idx} className="flex gap-4 items-center">
                <input 
                  placeholder="Рахунок (напр. 1001 Cash)"
                  value={line.accountId} onChange={e => {
                    const newLines = [...formData.lines]; newLines[idx].accountId = e.target.value; setFormData({...formData, lines: newLines});
                  }}
                  className="flex-1 bg-[#050505] border border-white/10 rounded px-3 py-2 text-sm text-gray-300"
                />
                <input 
                  placeholder="Опис"
                  value={line.label} onChange={e => {
                    const newLines = [...formData.lines]; newLines[idx].label = e.target.value; setFormData({...formData, lines: newLines});
                  }}
                  className="flex-1 bg-[#050505] border border-white/10 rounded px-3 py-2 text-sm text-gray-300"
                />
                <div className="flex items-center gap-2">
                  <span className="text-blue-400 text-xs font-bold w-4">Dr</span>
                  <input 
                    type="number" value={line.debit} onChange={e => {
                      const newLines = [...formData.lines]; newLines[idx].debit = Number(e.target.value); newLines[idx].credit = 0; setFormData({...formData, lines: newLines});
                    }}
                    className="w-24 bg-[#050505] border border-white/10 rounded px-3 py-2 text-sm text-blue-300"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-red-400 text-xs font-bold w-4">Cr</span>
                  <input 
                    type="number" value={line.credit} onChange={e => {
                      const newLines = [...formData.lines]; newLines[idx].credit = Number(e.target.value); newLines[idx].debit = 0; setFormData({...formData, lines: newLines});
                    }}
                    className="w-24 bg-[#050505] border border-white/10 rounded px-3 py-2 text-sm text-red-300"
                  />
                </div>
              </div>
            ))}
            
            <button 
              onClick={() => setFormData({...formData, lines: [...formData.lines, { accountId: '', debit: 0, credit: 0, label: '' }]})}
              className="mt-2 text-xs text-indigo-400 hover:text-indigo-300"
            >
              + Додати рядок
            </button>
          </div>

          <div className="flex justify-between items-center mt-6 pt-4 border-t border-white/10">
            <div className={`text-sm font-bold flex gap-4 ${isBalanced ? 'text-emerald-400' : 'text-red-400'}`}>
              <span>Total Debit: ₴{totalDebit}</span>
              <span>Total Credit: ₴{totalCredit}</span>
              {!isBalanced && <span className="ml-4 text-xs font-normal">(!) Проводка має бути збалансована</span>}
            </div>
            
            <div className="flex gap-3">
              <button onClick={() => setIsCreating(false)} className="px-4 py-2 text-sm text-gray-400 hover:text-white">Скасувати</button>
              <button disabled={!isBalanced} onClick={handleCreate} className="bg-indigo-600 disabled:opacity-50 hover:bg-indigo-500 text-white px-6 py-2 rounded text-sm font-bold flex items-center gap-2">
                <CheckCircle size={16} /> Опублікувати (POST)
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-[#111] border border-white/10 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm text-gray-300">
          <thead className="bg-[#1A1D24] border-b border-white/10 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-5 py-3">Date</th>
              <th className="px-5 py-3">Number</th>
              <th className="px-5 py-3">Partner</th>
              <th className="px-5 py-3">Debit</th>
              <th className="px-5 py-3">Credit</th>
              <th className="px-5 py-3 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {moves.map(m => {
              const moveTotalDebit = m.lines.reduce((s: number, l: any) => s + l.debit, 0);
              const moveTotalCredit = m.lines.reduce((s: number, l: any) => s + l.credit, 0);
              
              return (
                <tr key={m.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-5 py-4">{new Date(m.date).toLocaleDateString()}</td>
                  <td className="px-5 py-4 font-mono text-indigo-300">{m.reference || m.id.slice(0, 8)}</td>
                  <td className="px-5 py-4">{m.partner?.name || '-'}</td>
                  <td className="px-5 py-4 text-blue-400">₴ {moveTotalDebit}</td>
                  <td className="px-5 py-4 text-red-400">₴ {moveTotalCredit}</td>
                  <td className="px-5 py-4 text-right">
                    <span className={`px-2 py-1 text-[10px] font-bold rounded-md ${m.state === 'POSTED' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                      {m.state}
                    </span>
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
