"use client";

import React from "react";
import { Brain, Heart, TrendingUp, TrendingDown } from "lucide-react";
import { clsx } from "clsx";

export interface DecisionVectorProps {
  mentalDelta: number;
  financialDelta: number;
  description: string;
}

export function DecisionVector({ mentalDelta, financialDelta, description }: DecisionVectorProps) {
  const isProficit = mentalDelta > 0 && financialDelta >= 0;
  const isDeficit = mentalDelta < 0 && financialDelta < 0;

  return (
    <div className={clsx(
      "glass-panel p-5 rounded-xl border relative overflow-hidden transition-all",
      isProficit ? "border-[#00FF88]/50 bg-[#00FF88]/5" : 
      isDeficit ? "border-red-500/50 bg-red-500/5" : "border-[#FF9500]/50 bg-[#FF9500]/5"
    )}>
      <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-widest flex items-center gap-2">
        {isProficit ? "Мислення Профіциту" : isDeficit ? "Мислення Дефіциту" : "Компроміс"}
      </h3>
      
      <p className="text-xs text-gray-300 leading-relaxed mb-5">
        {description}
      </p>

      <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-4">
        <div>
          <div className="text-[10px] text-gray-500 uppercase font-bold mb-1 flex items-center gap-1">
            <Heart size={12} /> Ментальний Вектор
          </div>
          <div className={clsx(
            "text-lg font-black flex items-center gap-1",
            mentalDelta > 0 ? "text-[#00FF88]" : "text-red-500"
          )}>
            {mentalDelta > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            {mentalDelta > 0 ? "+" : ""}{mentalDelta}
          </div>
        </div>

        <div>
          <div className="text-[10px] text-gray-500 uppercase font-bold mb-1 flex items-center gap-1">
            <Brain size={12} /> Фінансовий Вектор
          </div>
          <div className={clsx(
            "text-lg font-black flex items-center gap-1",
            financialDelta > 0 ? "text-[#00FF88]" : "text-red-500"
          )}>
            {financialDelta > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            {financialDelta > 0 ? "+" : ""}{financialDelta} $
          </div>
        </div>
      </div>
    </div>
  );
}
