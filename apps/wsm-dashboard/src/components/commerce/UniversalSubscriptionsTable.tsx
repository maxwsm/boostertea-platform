'use client';

import React from 'react';
import { useTenantStore } from '../../store/tenantStore';
import { RefreshCw, Spline, Info } from 'lucide-react';

export default function UniversalSubscriptionsTable() {
  const { activeTenant } = useTenantStore();

  const mockSubscriptions = [
    { id: 'SUB-9021', user: 'Михайло Т.', plan: 'BoosterTea (1.5L) + FunnyDrops (30ml)', status: 'ACTIVE', nextBilling: '2026-04-12', splits: ['boostertea', 'funnydrops'] },
    { id: 'SUB-9022', user: 'Олена К.', plan: 'DinoSlush Box (x2) + TLab R&D Test', status: 'PROCESSING', nextBilling: '2026-03-25', splits: ['dinoslush', 'tlab'] },
    { id: 'SUB-9023', user: 'Андрій В.', plan: 'BoosterTea Only (5L)', status: 'ACTIVE', nextBilling: '2026-04-01', splits: ['boostertea'] },
    { id: 'SUB-9024', user: 'Анна М.', plan: 'FunnyDrops Pro + TLab Shaker', status: 'FROZEN', nextBilling: '-', splits: ['funnydrops', 'tlab'] },
  ];

  // Global Context Filter: Only show subscriptions containing items belonging to the active site
  const filteredSubs = mockSubscriptions.filter(s => s.splits.includes(activeTenant));

  return (
    <div className="p-6 rounded-2xl border backdrop-blur-md transition-all h-full" 
         style={{ backgroundColor: '#141720', borderColor: '#252A3A' }}>
         
      <div className="flex justify-between items-start mb-6">
         <div>
           <h3 className="text-xl font-bold text-white flex items-center gap-2" style={{ fontFamily: 'Syne, sans-serif' }}>
             <RefreshCw size={20} style={{ color: '#A855F7' }} />
             Аудит Спільних Підписок
           </h3>
           <p className="text-xs mt-1" style={{ color: '#9CA3AF' }}>Розщеплення глобальних кошиків для: <b className="text-white uppercase">{activeTenant}</b></p>
         </div>
      </div>

      <div className="overflow-x-auto text-sm">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b" style={{ borderColor: '#252A3A', color: '#6B7280' }}>
              <th className="pb-2 font-medium">Рейс ID</th>
              <th className="pb-2 font-medium">Клієнт</th>
              <th className="pb-2 font-medium">Спліт-Кошик (Route)</th>
              <th className="pb-2 font-medium">Стейт</th>
            </tr>
          </thead>
          <tbody>
            {filteredSubs.map((sub) => (
              <tr key={sub.id} className="border-b transition-colors hover:bg-white/5" style={{ borderColor: '#1C2030' }}>
                <td className="py-3 font-mono font-medium text-white">{sub.id}</td>
                <td className="py-3 text-white">{sub.user}</td>
                <td className="py-3">
                  <div className="flex items-center gap-2">
                    <Spline size={14} style={{ color: sub.splits.length > 1 ? '#A855F7' : '#9CA3AF' }} />
                    <span style={{ color: sub.splits.length > 1 ? '#E9D5FF' : '#9CA3AF' }}>
                      {sub.plan}
                    </span>
                  </div>
                </td>
                <td className="py-3">
                  <span className="px-2 py-1 text-xs rounded font-bold" 
                        style={{ 
                          backgroundColor: sub.status === 'ACTIVE' ? 'rgba(34, 211, 165, 0.1)' : sub.status === 'FROZEN' ? 'rgba(107, 114, 128, 0.2)' : 'rgba(244, 63, 94, 0.1)',
                          color: sub.status === 'ACTIVE' ? '#22D3A5' : sub.status === 'FROZEN' ? '#9CA3AF' : '#F43F5E'
                        }}>
                    {sub.status}
                  </span>
                </td>
              </tr>
            ))}
            {filteredSubs.length === 0 && (
              <tr>
                <td colSpan={4} className="py-8 text-center text-xs" style={{ color: '#6B7280' }}>
                  Для цього ресурсу наразі немає активних розщеплених підписок.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex gap-2 items-center p-3 rounded" style={{ backgroundColor: '#1C2030' }}>
         <Info size={16} style={{ color: '#00D4FF' }} />
         <span className="text-xs leading-tight" style={{ color: '#D1D5DB' }}>
           Цей модуль автоматично маскує товари, що не належать складу {activeTenant}, хоча білінг для клієнта залишається єдиним.
         </span>
      </div>
    </div>
  );
}
