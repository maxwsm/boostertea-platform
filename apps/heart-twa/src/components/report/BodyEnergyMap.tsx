import { motion } from "framer-motion";
import { Zap } from "lucide-react";

const BODY_ZONES = [
  { id: "Очі", cx: 50, cy: 15, label: "Очі / Фокус" },
  { id: "Голова", cx: 50, cy: 22, label: "Голова / Розум" },
  { id: "Горло", cx: 50, cy: 35, label: "Горло / Вираз" },
  { id: "Груди", cx: 50, cy: 55, label: "Груди / RSD" },
  { id: "Живіт", cx: 50, cy: 80, label: "Живіт / Енергія" },
  { id: "Таз", cx: 50, cy: 105, label: "Таз / База" },
  { id: "Ноги", cx: 50, cy: 140, label: "Ноги / Заземлення", isDual: true }
];

export function BodyEnergyMap({ somaticMap }: { somaticMap: { blockedZones: string[], targetZones: string[] } }) {
  if (!somaticMap) return null;

  const { blockedZones, targetZones } = somaticMap;

  return (
    <div className="w-full relative overflow-hidden rounded-[24px] p-5 bg-graphite/40 border border-oatmeal/10 mt-6 flex flex-col items-center">
      <h3 className="text-xs font-mono uppercase tracking-widest text-oatmeal/60 mb-6 flex items-center gap-2">
        <Zap size={14} className="text-amber" /> Соматична Карта
      </h3>

      <div className="relative w-[150px] h-[220px]">
        {/* SVG Spine / Outline */}
        <svg viewBox="0 0 100 160" className="w-full h-full absolute inset-0 opacity-20">
          <path d="M50 10 L50 110" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" className="text-oatmeal" />
          {/* Arms abstract */}
          <path d="M50 45 Q 20 50 20 80" stroke="currentColor" strokeWidth="1" fill="none" className="text-oatmeal" />
          <path d="M50 45 Q 80 50 80 80" stroke="currentColor" strokeWidth="1" fill="none" className="text-oatmeal" />
          {/* Legs abstract */}
          <path d="M50 105 L 35 150" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" className="text-oatmeal" />
          <path d="M50 105 L 65 150" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" className="text-oatmeal" />
          {/* Head circle */}
          <circle cx="50" cy="20" r="12" stroke="currentColor" strokeWidth="1" fill="none" className="text-oatmeal" />
        </svg>

        {/* Nodes */}
        {BODY_ZONES.map((zone) => {
          const isBlocked = blockedZones.includes(zone.id);
          const isTarget = targetZones.includes(zone.id);
          
          if (!isBlocked && !isTarget) return null;

          const colorClass = isBlocked ? "bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.8)]" : "bg-ocean shadow-[0_0_15px_rgba(45,156,219,0.8)]";
          
          const Node = ({ x, y }: { x: number, y: number }) => (
            <div 
              className="absolute flex flex-col items-center"
              style={{ left: `${x}%`, top: `${(y / 160) * 100}%`, transform: 'translate(-50%, -50%)' }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ repeat: Infinity, duration: isBlocked ? 1.5 : 3, ease: "easeInOut" }}
                className={`w-3 h-3 rounded-full ${colorClass}`}
              />
              <span className={`absolute left-4 w-[80px] text-[8px] font-mono uppercase tracking-widest ${isBlocked ? 'text-red-400' : 'text-ocean'}`}>
                {zone.label}
              </span>
            </div>
          );

          if (zone.isDual) {
            return (
              <div key={zone.id}>
                <Node x={35} y={zone.cy} />
                <Node x={65} y={zone.cy} />
              </div>
            );
          }

          return <Node key={zone.id} x={zone.cx} y={zone.cy} />;
        })}
      </div>

      <div className="w-full flex justify-between mt-6 px-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)] animate-pulse" />
          <span className="text-[10px] text-oatmeal/60 font-mono uppercase">Блок (Напруга)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-ocean shadow-[0_0_8px_rgba(45,156,219,0.8)]" />
          <span className="text-[10px] text-oatmeal/60 font-mono uppercase">Вектор (Ціль)</span>
        </div>
      </div>

    </div>
  );
}
