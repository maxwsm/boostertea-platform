import React from 'react';

export default function AmbassadorFunnel() {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-indigo-100">
      <h3 className="text-lg font-bold text-indigo-900 mb-4">Конверсія: Руйнівники Міфів → Герої Району</h3>
      <div className="space-y-4">
        <div className="flex justify-between text-sm">
          <span>Читають комікс (Еп. 1-5)</span>
          <span className="font-mono font-bold">1,240</span>
        </div>
        <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
          <div className="bg-indigo-400 h-full w-[80%]"></div>
        </div>
        <div className="flex justify-between text-sm">
          <span>Дійшли до Еп. 6 (Амбасадори)</span>
          <span className="font-mono font-bold text-indigo-600">156</span>
        </div>
        <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
          <div className="bg-indigo-600 h-full w-[12%]"></div>
        </div>
      </div>
      <p className="mt-4 text-xs text-gray-500 italic">* Дані оновлюються автоматично через Lore Tracking API</p>
    </div>
  );
}
