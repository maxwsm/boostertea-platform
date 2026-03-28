'use client';

import React, { useState } from 'react';
import { useTenantStore } from '../../store/tenantStore';
import { MessageCircle, Clock, CheckCircle } from 'lucide-react';

export default function SlaSupportHub() {
  const { activeTenant } = useTenantStore();
  const [status, setStatus] = useState<'working' | 'resting'>('working');

  return (
    <div className="p-6 rounded-2xl border backdrop-blur-md h-full transition-all" 
         style={{ backgroundColor: '#141720', borderColor: '#252A3A' }}>
         
      <div className="flex justify-between items-center mb-6">
         <div>
           <h3 className="text-xl font-bold text-white flex items-center gap-2" style={{ fontFamily: 'Syne, sans-serif' }}>
             <MessageCircle size={20} style={{ color: '#F43F5E' }} />
             Omni-Channel Hub
           </h3>
           <p className="text-xs text-gray-500 mt-1 uppercase">WhatsApp / Telegram ({activeTenant})</p>
         </div>
         <button onClick={() => setStatus(status === 'working' ? 'resting' : 'working')}
                 className="px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 hover:scale-105"
                 style={{ 
                   backgroundColor: status === 'working' ? 'rgba(34, 211, 165, 0.1)' : 'rgba(244, 63, 94, 0.1)',
                   color: status === 'working' ? '#22D3A5' : '#F43F5E',
                   border: `1px solid ${status === 'working' ? 'rgba(34, 211, 165, 0.3)' : 'rgba(244, 63, 94, 0.3)'}`
                 }}>
            {status === 'working' ? <><CheckCircle size={14}/> Працюю</> : <><Clock size={14}/> Відпочиваю</>}
         </button>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center text-sm border-b pb-3" style={{ borderColor: '#252A3A' }}>
           <span style={{ color: '#9CA3AF' }}>Активні невідповідені діалоги:</span>
           <span className="font-mono text-white font-bold text-lg">12</span>
        </div>
        
        <div className="flex justify-between items-center text-sm border-b pb-3" style={{ borderColor: '#252A3A' }}>
           <span style={{ color: '#9CA3AF' }}>Показник SLA (Середній час):</span>
           <span className="font-mono font-bold" style={{ color: '#22D3A5' }}>1хв 24с</span>
        </div>

        <div className="mt-4 p-4 rounded-xl border text-xs leading-relaxed transition-all" 
             style={{ 
               backgroundColor: status === 'working' ? 'rgba(34, 211, 165, 0.05)' : 'rgba(244, 63, 94, 0.05)', 
               borderColor: status === 'working' ? 'rgba(34, 211, 165, 0.2)' : 'rgba(244, 63, 94, 0.2)', 
               color: status === 'working' ? '#22D3A5' : '#F43F5E' 
             }}>
          {status === 'working' ? (
            <>
              <b className="block mb-1 text-sm">✓ Канали Активні</b>
              Повідомлення відправляються напряму менеджерам. SLA трекер записує час відповіді. 
            </>
          ) : (
            <>
              <b className="block mb-1 text-sm">⏸ SLA Захист Активовано</b>
              Усі нові запити у WhatsApp/TG отримують автовідповідь із розрахованим <b>ETA (Час очікування: 15хв)</b>. Метрики SLA заморожено.
            </>
          )}
        </div>
      </div>
    </div>
  );
}
