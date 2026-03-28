'use client';

import React from 'react';
import { Printer, PackageOpen, Award, TrendingUp } from 'lucide-react';

export function PhysicalProductionPanel() {
  return (
    <div className="bg-zinc-50 text-zinc-900 rounded-2xl border border-zinc-200 p-6 shadow-xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />
      
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <PackageOpen className="text-emerald-500" />
          Фізичне Виробництво (ERP)
        </h3>
        <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Склад №1 (Київ) — ACTIVE
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-zinc-200 rounded-xl p-4 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-center mb-3">
            <span className="text-zinc-500 text-sm font-medium">Черга mPrinter (POS)</span>
            <Printer className="w-4 h-4 text-zinc-400" />
          </div>
          <p className="text-3xl font-black mb-1 text-zinc-800">4 <span className="text-sm font-normal text-zinc-500">чеки</span></p>
          <div className="flex items-center gap-2 mt-2">
            <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
            <p className="text-xs font-medium text-green-600">Термальний принтер онлайн</p>
          </div>
          <button className="mt-4 w-full py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-sm font-semibold rounded-lg transition-colors border border-zinc-200">
            Зупинити друк
          </button>
        </div>

        <div className="bg-white border border-zinc-200 rounded-xl p-4 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-center mb-3">
            <span className="text-zinc-500 text-sm font-medium">Karma Points (Збирачі)</span>
            <Award className="w-4 h-4 text-yellow-500" />
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center bg-zinc-50 p-2 rounded border border-zinc-100">
              <span className="text-xs font-bold text-zinc-700">1. Іван М.</span>
              <div className="flex items-center gap-2">
                <div className="w-16 h-1.5 bg-zinc-200 rounded-full overflow-hidden"><div className="w-full h-full bg-yellow-400"></div></div>
                <span className="text-xs font-black text-yellow-600">840 KP</span>
              </div>
            </div>
            <div className="flex justify-between items-center bg-zinc-50 p-2 rounded border border-zinc-100">
              <span className="text-xs font-bold text-zinc-700">2. Оля К.</span>
              <div className="flex items-center gap-2">
                <div className="w-16 h-1.5 bg-zinc-200 rounded-full overflow-hidden"><div className="w-[60%] h-full bg-yellow-400"></div></div>
                <span className="text-xs font-bold text-zinc-500">620 KP</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-4 bg-blue-50/50 rounded-xl p-4 border border-blue-100 flex items-center justify-between">
        <div>
          <p className="text-sm text-blue-900 font-bold flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-500" /> 
            AI Прогноз HR (BullMQ)
          </p>
          <p className="text-xs text-blue-700 mt-1">Згідно ROAS Meta Ads, післязавтра очікується +45% замовлень. <b>Потрібна додаткова зміна пакувальників!</b></p>
        </div>
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow whitespace-nowrap ml-4 transition-colors">
          Сповістити HR
        </button>
      </div>
    </div>
  );
}
