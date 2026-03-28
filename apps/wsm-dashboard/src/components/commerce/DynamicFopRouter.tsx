'use client';

import React, { useState } from 'react';
import { useTenantStore } from '../../store/tenantStore';
import { CreditCard, Truck, AlertTriangle } from 'lucide-react';

export default function DynamicFopRouter() {
  const { activeTenant } = useTenantStore();
  
  const [fop, setFop] = useState('mono-era');
  const [limit] = useState(82);

  return (
    <div className="p-6 rounded-2xl border backdrop-blur-md h-full transition-all" 
         style={{ backgroundColor: '#141720', borderColor: limit > 80 ? 'rgba(244, 63, 94, 0.4)' : '#252A3A' }}>
         
      <div className="flex justify-between items-center mb-6">
         <h3 className="text-xl font-bold text-white flex items-center gap-2" style={{ fontFamily: 'Syne, sans-serif' }}>
           <CreditCard size={20} style={{ color: '#00D4FF' }} />
           Шлюзи та ФОП 
         </h3>
         <span className="text-xs px-2 py-1 rounded font-bold" 
               style={{ backgroundColor: 'rgba(0, 212, 255, 0.1)', color: '#00D4FF', textTransform: 'uppercase' }}>
           {activeTenant}
         </span>
      </div>

      <div className="space-y-5">
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Задіяний Еквайринг (Checkout Endpoint)</label>
          <select 
            className="w-full bg-black/50 border rounded-lg px-3 py-3 text-sm text-white focus:outline-none transition-colors"
            style={{ borderColor: '#252A3A' }} 
            value={fop} 
            onChange={(e) => setFop(e.target.value)}
          >
             <option value="mono-era">💳 Монобанк — ТОВ "Нью-Ера"</option>
             <option value="liqpay-ivanov">💳 LiqPay — ФОП "Іванов О.П."</option>
             <option value="stripe-global">🌍 Stripe USD — Global LLC</option>
          </select>
        </div>

        <div>
          <label className="text-xs text-gray-400 mb-1 flex justify-between font-mono">
            <span>ПОДАТКОВИЙ ЛІМІТ</span>
            <span style={{ color: limit > 80 ? '#F43F5E' : '#22D3A5' }}>{limit}% / 100%</span>
          </label>
          <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#1C2030' }}>
            <div className="h-full transition-all duration-1000" style={{ width: `${limit}%`, backgroundColor: limit > 80 ? '#F43F5E' : '#22D3A5' }}></div>
          </div>
          
          {limit > 80 && (
            <div className="mt-3 flex gap-2 items-start p-2 rounded bg-opacity-10" style={{ backgroundColor: 'rgba(244, 63, 94, 0.1)' }}>
               <AlertTriangle size={14} style={{ color: '#F43F5E', marginTop: '2px' }} />
               <p className="text-xs" style={{ color: '#F43F5E' }}>
                 Критичний ліміт ФОПа. Рекомендується змінити шлюз для прийому платежів, щоб уникнути блокування податковою.
               </p>
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-3 mt-4 border-t" style={{ borderColor: '#252A3A' }}>
          <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded text-sm transition-all"
                  style={{ backgroundColor: '#22D3A5', color: '#000', fontWeight: 'bold' }}>
            <Truck size={16} /> Синхронізувати ТТН
          </button>
        </div>
      </div>
    </div>
  );
}
