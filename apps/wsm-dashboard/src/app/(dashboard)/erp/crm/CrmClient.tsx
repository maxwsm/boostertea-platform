'use client';

import { useState } from 'react';
import { Building2, UserCircle, ShoppingBag, Plus, Save, Phone, Mail, Link as LinkIcon, Trash } from 'lucide-react';

export default function CrmClient({ initialPartners }: { initialPartners: any[] }) {
  const [partners, setPartners] = useState(initialPartners);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    isCustomer: true,
    isVendor: false,
    isEmployee: false
  });

  const handleSave = async () => {
    try {
      const res = await fetch('/api/erp/crm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        const newPartner = await res.json();
        setPartners([newPartner, ...partners]);
        setIsCreating(false);
        setFormData({ name: '', email: '', phone: '', company: '', isCustomer: true, isVendor: false, isEmployee: false });
      } else {
        alert('Помилка збереження');
      }
    } catch(e) {
      alert('Error saving');
    }
  };

  const deletePartner = async (id: string) => {
    if(!confirm("Видалити партнера?")) return;
    try {
      await fetch(`/api/erp/crm?id=${id}`, { method: 'DELETE' });
      setPartners(partners.filter(p => p.id !== id));
    } catch(e) {}
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium text-gray-200">Всі контакти ({partners.length})</h2>
        <button 
          onClick={() => setIsCreating(true)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
        >
          <Plus size={16} /> Створити Партнера
        </button>
      </div>

      {isCreating && (
        <div className="bg-[#111] border border-indigo-500/30 rounded-xl p-5 mb-6">
          <h3 className="text-indigo-400 font-bold mb-4">Новий Контакт</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-400">Ім'я / Назва</label>
              <input 
                placeholder="Іван Іванов або ТОВ Роги і Копита"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full bg-[#050505] border border-white/10 rounded px-3 py-2 text-sm text-gray-300 focus:border-indigo-500 outline-none mt-1"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400">Компанія (необов'язково)</label>
              <input 
                placeholder="Якщо це B2B контакт"
                value={formData.company}
                onChange={e => setFormData({...formData, company: e.target.value})}
                className="w-full bg-[#050505] border border-white/10 rounded px-3 py-2 text-sm text-gray-300 focus:border-indigo-500 outline-none mt-1"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400">Email</label>
              <input 
                type="email"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                className="w-full bg-[#050505] border border-white/10 rounded px-3 py-2 text-sm text-gray-300 focus:border-indigo-500 outline-none mt-1"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400">Телефон</label>
              <input 
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
                className="w-full bg-[#050505] border border-white/10 rounded px-3 py-2 text-sm text-gray-300 focus:border-indigo-500 outline-none mt-1"
              />
            </div>
          </div>

          <div className="flex gap-6 mt-6 p-4 bg-[#050505] rounded-lg border border-white/5">
            <span className="text-sm text-gray-400">Ролі:</span>
            <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
              <input type="checkbox" checked={formData.isCustomer} onChange={e => setFormData({...formData, isCustomer: e.target.checked})} className="accent-indigo-500" />
              <UserCircle size={16} className="text-emerald-400" /> Клієнт
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
              <input type="checkbox" checked={formData.isVendor} onChange={e => setFormData({...formData, isVendor: e.target.checked})} className="accent-indigo-500" />
              <ShoppingBag size={16} className="text-amber-400" /> Постачальник
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
              <input type="checkbox" checked={formData.isEmployee} onChange={e => setFormData({...formData, isEmployee: e.target.checked})} className="accent-indigo-500" />
              <Building2 size={16} className="text-blue-400" /> Працівник
            </label>
          </div>

          <div className="flex gap-3 justify-end mt-6">
            <button onClick={() => setIsCreating(false)} className="px-4 py-2 text-sm text-gray-400 hover:text-white">Скасувати</button>
            <button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded text-sm font-bold flex items-center gap-2">
              <Save size={16} /> Зберегти
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {partners.map(p => (
          <div key={p.id} className="bg-[#111] border border-white/10 rounded-xl p-5 hover:border-indigo-500/50 transition-colors flex flex-col">
            <div className="flex justify-between items-start mb-3">
              <div className="flex flex-wrap gap-1">
                {p.isCustomer && <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Customer</span>}
                {p.isVendor && <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">Vendor</span>}
                {p.isEmployee && <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">Employee</span>}
              </div>
              <button onClick={() => deletePartner(p.id)} className="text-gray-600 hover:text-red-400 transition-colors"><Trash size={14}/></button>
            </div>
            
            <h3 className="font-bold text-white text-lg">{p.name}</h3>
            {p.company && <p className="text-xs text-gray-500 mt-1 flex items-center gap-1"><Building2 size={12}/> {p.company}</p>}
            
            <div className="space-y-2 mt-4 text-sm text-gray-400">
              {p.email && <div className="flex items-center gap-2"><Mail size={14}/> {p.email}</div>}
              {p.phone && <div className="flex items-center gap-2"><Phone size={14}/> {p.phone}</div>}
            </div>

            <div className="mt-auto pt-4 border-t border-white/5 flex gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1" title="Invoices / Bills">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                {p._count?.accountMoves || 0} Docs
              </div>
              <div className="flex items-center gap-1" title="Deliveries / Receipts">
                <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                {p._count?.stockMoves || 0} Moves
              </div>
              {p.userId && (
                <div className="ml-auto text-indigo-400 flex items-center gap-1" title="Linked to Telegram/Google Auth">
                  <LinkIcon size={12}/> Auth
                </div>
              )}
            </div>
          </div>
        ))}
        {partners.length === 0 && !isCreating && (
          <div className="col-span-full text-center py-12 text-gray-500 border border-white/5 border-dashed rounded-xl">
            Немає контактів. Додайте першого партнера.
          </div>
        )}
      </div>
    </div>
  );
}
