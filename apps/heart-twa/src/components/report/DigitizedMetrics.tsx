import { motion } from "framer-motion";

function DeltaBar({ label, current, projected, color }: { label: string, current: number, projected: number, color: string }) {
  const isDecrease = projected < current;
  const deltaColor = isDecrease ? 'bg-sage' : 'bg-red-400';

  return (
    <div className="w-full text-xs font-mono">
      <div className="flex justify-between mb-1 text-oatmeal/60 uppercase tracking-widest">
        <span>{label}</span>
        <div className="flex gap-2">
          <span className={current > 80 && color.includes('red') ? 'text-red-400 font-bold animate-pulse' : ''}>{current}%</span>
          <span className="text-oatmeal/30">➔</span>
          <span className="text-sage font-bold">{projected}%</span>
        </div>
      </div>
      <div className="w-full h-2 bg-oatmeal/10 rounded-full overflow-hidden relative flex">
        {/* Current State Bar */}
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${current}%` }}
          transition={{ duration: 1.0, ease: "easeOut" }}
          className={`absolute top-0 left-0 h-full ${color} opacity-50`}
        />
        {/* Projected State Bar (overlapping or showing delta) */}
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${projected}%` }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
          className={`absolute top-0 left-0 h-full ${color} shadow-[0_0_10px_currentColor] z-10`}
        />
      </div>
    </div>
  );
}

export function DigitizedMetrics({ biometrics, isAdhdMode }: { biometrics: any, isAdhdMode: boolean }) {
  if (!biometrics) return null;
  
  // Backwards compatibility with old biometrics format
  const current = biometrics.current || biometrics;
  const projected = biometrics.projected || biometrics;

  return (
    <div className={`w-full flex flex-col gap-4 p-5 rounded-[24px] border ${isAdhdMode ? 'bg-graphite/80 border-oatmeal/20' : 'bg-graphite/40 border-oatmeal/10'}`}>
      <DeltaBar label="Cortisol (Stress)" current={current.cortisolLevel || 0} projected={projected.cortisolLevel || 0} color="bg-red-500" />
      <DeltaBar label="Vagal Tone (Calm)" current={current.vagalTone || 0} projected={projected.vagalTone || 0} color="bg-ocean" />
      <DeltaBar label="Cognitive Load" current={current.cognitiveExhaustion || 0} projected={projected.cognitiveExhaustion || 0} color="bg-amber" />
    </div>
  );
}
