import { Pill, Activity } from "lucide-react";

export function SomaticProtocol({ interventions }: { interventions: any }) {
  if (!interventions) return null;

  return (
    <div className="w-full relative overflow-hidden rounded-[24px] p-5 bg-graphite/60 border border-sage/20 mt-6">
      <h3 className="text-xs font-mono uppercase tracking-widest text-sage mb-4 flex items-center gap-2">
        <Activity size={16} /> Хімічний Баланс Тіла
      </h3>
      
      {/* Supplements */}
      {interventions.supplements && interventions.supplements.length > 0 && (
        <div className="mb-4">
          <p className="text-[10px] text-oatmeal/50 font-mono uppercase tracking-widest mb-2">БАДи (Симптоматично)</p>
          <div className="flex flex-wrap gap-2">
            {interventions.supplements.map((sup: string, idx: number) => (
              <span key={idx} className="flex items-center gap-1 bg-sage/10 text-sage px-3 py-1.5 rounded-full text-xs font-medium border border-sage/20">
                <Pill size={12} /> {sup}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Exercises */}
      {interventions.exercises && interventions.exercises.length > 0 && (
        <div>
          <p className="text-[10px] text-oatmeal/50 font-mono uppercase tracking-widest mb-2">Фізичні втручання</p>
          <ul className="space-y-2">
            {interventions.exercises.map((ex: string, idx: number) => (
              <li key={idx} className="flex items-center gap-2 text-sm text-oatmeal/80">
                <span className="w-1.5 h-1.5 rounded-full bg-ocean/70" />
                {ex}
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="text-[8px] text-oatmeal/30 uppercase mt-4 text-center">
        * Не є медичним діагнозом чи рецептом.
      </p>
    </div>
  );
}
