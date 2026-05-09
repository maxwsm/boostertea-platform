"use client";

/**
 * INFLUENCE MATRIX — N×N grid showing who affects whom
 * 
 * Visual heatmap of influence between negotiation participants.
 * Each cell = influence type + strength with color intensity.
 * Tap cell = shows mechanism explanation.
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GitBranch } from "lucide-react";
import type { InfluenceEdge, InfluenceType } from "@/data/game-simulator/shadowProbability";

interface InfluenceMatrixProps {
  participants: string[];
  edges: InfluenceEdge[];
  isAdhdMode: boolean;
}

const TYPE_COLORS: Record<InfluenceType, string> = {
  "ДОМІНУВАННЯ": "bg-red-500",
  "МАНІПУЛЯЦІЯ": "bg-amber",
  "КОАЛІЦІЯ": "bg-ocean",
  "КОНФЛІКТ": "bg-red-400",
  "ПІДПОРЯДКУВАННЯ": "bg-slate-400",
  "ІГНОРУВАННЯ": "bg-slate-600",
  "КОДЕПЕНДЕНЦІЯ": "bg-purple-400",
};

const TYPE_SHORT: Record<InfluenceType, string> = {
  "ДОМІНУВАННЯ": "ДОМ",
  "МАНІПУЛЯЦІЯ": "МНП",
  "КОАЛІЦІЯ": "КОА",
  "КОНФЛІКТ": "КНФ",
  "ПІДПОРЯДКУВАННЯ": "ПДП",
  "ІГНОРУВАННЯ": "ІГН",
  "КОДЕПЕНДЕНЦІЯ": "КДП",
};

export function InfluenceMatrix({ participants, edges, isAdhdMode }: InfluenceMatrixProps) {
  const [selectedEdge, setSelectedEdge] = useState<InfluenceEdge | null>(null);

  const getEdge = (from: string, to: string): InfluenceEdge | undefined => {
    return edges.find((e) => e.from === from && e.to === to);
  };

  const allNames = participants;

  return (
    <div className="w-full rounded-[20px] bg-oatmeal/3 border border-oatmeal/8 p-4 mt-4">
      <h3 className="text-[10px] font-mono text-oatmeal/40 uppercase tracking-widest mb-4 flex items-center gap-2">
        <GitBranch size={12} /> Матриця Впливу
      </h3>

      {/* Matrix Grid */}
      <div className="overflow-x-auto">
        <table className="w-full text-center">
          <thead>
            <tr>
              <th className="text-[8px] font-mono text-oatmeal/30 p-1"></th>
              {allNames.map((name) => (
                <th key={name} className="text-[8px] font-mono text-oatmeal/50 p-1 max-w-[60px] truncate">
                  {name.split(" ")[0]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {allNames.map((from) => (
              <tr key={from}>
                <td className="text-[8px] font-mono text-oatmeal/50 p-1 text-right pr-2 max-w-[60px] truncate">
                  {from.split(" ")[0]}
                </td>
                {allNames.map((to) => {
                  if (from === to) {
                    return (
                      <td key={to} className="p-0.5">
                        <div className="w-full aspect-square rounded-[6px] bg-oatmeal/5 flex items-center justify-center">
                          <span className="text-[7px] text-oatmeal/20">—</span>
                        </div>
                      </td>
                    );
                  }

                  const edge = getEdge(from, to);
                  if (!edge) {
                    return (
                      <td key={to} className="p-0.5">
                        <div className="w-full aspect-square rounded-[6px] bg-oatmeal/3" />
                      </td>
                    );
                  }

                  const bgColor = TYPE_COLORS[edge.type] || "bg-oatmeal/20";
                  const opacity = Math.round((edge.strength / 100) * 80 + 20);

                  return (
                    <td key={to} className="p-0.5">
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setSelectedEdge(edge)}
                        className={`w-full aspect-square rounded-[6px] ${bgColor} flex items-center justify-center cursor-pointer`}
                        style={{ opacity: opacity / 100 }}
                      >
                        <span className="text-[7px] font-mono font-bold text-white/90">
                          {edge.strength}
                        </span>
                      </motion.button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-1.5 mt-3">
        {(Object.entries(TYPE_COLORS) as [InfluenceType, string][]).map(([type, color]) => (
          <div key={type} className="flex items-center gap-1">
            <div className={`w-2 h-2 rounded-sm ${color}`} />
            <span className="text-[7px] font-mono text-oatmeal/40">
              {TYPE_SHORT[type]}
            </span>
          </div>
        ))}
      </div>

      {/* Selected Edge Detail */}
      <AnimatePresence>
        {selectedEdge && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 overflow-hidden"
          >
            <div className="p-3 rounded-[12px] bg-oatmeal/5 border border-oatmeal/10">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-mono text-oatmeal/50">
                  {selectedEdge.from} → {selectedEdge.to}
                </span>
                <button
                  onClick={() => setSelectedEdge(null)}
                  className="text-[9px] text-oatmeal/30 hover:text-oatmeal/60"
                >
                  ✕
                </button>
              </div>
              <p className={`font-mono font-bold mb-1 ${
                selectedEdge.type === "ДОМІНУВАННЯ" || selectedEdge.type === "МАНІПУЛЯЦІЯ"
                  ? "text-red-400"
                  : selectedEdge.type === "КОАЛІЦІЯ"
                  ? "text-ocean"
                  : "text-oatmeal/60"
              } ${isAdhdMode ? "text-sm" : "text-[11px]"}`}>
                {selectedEdge.type} ({selectedEdge.strength}%)
              </p>
              <p className="text-[10px] text-oatmeal/50 leading-relaxed">
                {selectedEdge.mechanism}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
