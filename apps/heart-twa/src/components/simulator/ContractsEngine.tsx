"use client";

import React, { useState } from "react";
import { clsx } from "clsx";
import { ShieldAlert, FileText, CheckCircle2 } from "lucide-react";

export interface ContractDetails {
  title: string;
  terms: string[];
  hiddenRisks: string[]; // Risks the player needs to spot
  cost: number;
}

export function ContractsEngine({ contract, onSign, onReject }: { contract: ContractDetails, onSign: () => void, onReject: () => void }) {
  const [readCarefully, setReadCarefully] = useState(false);

  return (
    <div className="glass-panel p-6 border-white/10 rounded-xl relative overflow-hidden bg-black/60">
      <div className="flex items-center gap-3 mb-6">
        <FileText className="text-[#00FF88]" size={28} />
        <h2 className="text-2xl font-black text-white">{contract.title}</h2>
      </div>

      <div className="space-y-4 mb-6">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Основні умови:</h3>
        <ul className="space-y-2">
          {contract.terms.map((term, i) => (
            <li key={i} className="flex gap-2 items-start text-sm text-gray-300">
              <span className="text-[#00FF88] mt-1">✓</span>
              {term}
            </li>
          ))}
        </ul>
      </div>

      <div className="p-4 bg-[#FF9500]/10 border border-[#FF9500]/30 rounded-lg mb-6">
        <div className="flex gap-2 items-center mb-2 cursor-pointer" onClick={() => setReadCarefully(!readCarefully)}>
          <ShieldAlert className="text-[#FF9500]" size={16} />
          <span className="text-xs font-bold text-[#FF9500] uppercase tracking-wider">Дрібний шрифт (Натисніть щоб прочитати)</span>
        </div>
        {readCarefully && (
          <ul className="space-y-2 mt-3 pl-6 border-l border-[#FF9500]/50">
            {contract.hiddenRisks.map((risk, i) => (
              <li key={i} className="text-xs text-gray-400">
                ⚠️ {risk}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex gap-4">
        <button 
          onClick={onSign}
          className="flex-1 py-3 bg-[#00FF88] hover:bg-[#00FF88]/90 text-black font-black text-sm uppercase rounded-lg transition-all"
        >
          Підписати
        </button>
        <button 
          onClick={onReject}
          className="flex-1 py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold text-sm uppercase rounded-lg transition-all"
        >
          Відхилити
        </button>
      </div>
    </div>
  );
}
