'use client';

import React from 'react';
import { Video, Image as ImageIcon, Box, RefreshCw } from 'lucide-react';

export function ContentProductionPanel() {
  return (
    <div className="bg-zinc-950 text-white rounded-2xl border border-zinc-800 p-6 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500" />
      
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <ImageIcon className="text-purple-400" />
          Виробництво Контенту (AI Factory)
        </h3>
        <span className="px-3 py-1 bg-purple-500/10 text-purple-400 text-xs font-bold rounded-full border border-purple-500/20 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
          2x RTX 4090 ONLINE
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="flex justify-between items-center mb-3">
            <span className="text-zinc-400 text-sm font-medium">Packify.ai 3D</span>
            <Box className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold mb-1">12 <span className="text-sm font-normal text-zinc-500">мокапів</span></p>
          <p className="text-xs text-zinc-500">Останній ген: BoosterTea 1L</p>
          <button className="mt-4 w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-sm font-semibold rounded-lg transition-colors">
            Відкрити 3D Студію
          </button>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="flex justify-between items-center mb-3">
            <span className="text-zinc-400 text-sm font-medium">ComfyUI (Локал)</span>
            <Video className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-2xl font-bold mb-1">Q: 14 <span className="text-sm font-normal text-zinc-500">у черзі</span></p>
          <p className="text-xs text-zinc-500">Темп: 2.1 сек / кадр</p>
          <button className="mt-4 w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-sm font-semibold rounded-lg transition-colors flex justify-center items-center gap-2">
            <RefreshCw className="w-3 h-3" /> Переглянути чергу
          </button>
        </div>
      </div>
      
      <div className="mt-4 bg-zinc-900/50 rounded-xl p-4 border border-zinc-800/50">
        <p className="text-sm text-zinc-300 font-medium mb-2">Статус Adobe API</p>
        <div className="flex bg-zinc-800 rounded-full h-1.5 overflow-hidden">
          <div className="bg-gradient-to-r from-green-400 to-green-500 w-[14%]" />
        </div>
        <p className="text-xs text-zinc-500 mt-2">Витрачено: $140 / $1000 (Commitment)</p>
      </div>
    </div>
  );
}
