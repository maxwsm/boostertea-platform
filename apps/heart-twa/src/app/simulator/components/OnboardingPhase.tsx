import React from "react";
import { motion } from "framer-motion";
import { Gamepad2, Users } from "lucide-react";
import { OnboardingForm } from "@/data/game-simulator/gameFlow";
import { slideUp, staggerContainer, tapScale } from "./animations";

interface Props {
  form: OnboardingForm & { teamSize?: number };
  setForm: React.Dispatch<React.SetStateAction<OnboardingForm & { teamSize?: number }>>;
  onStart: () => void;
  isNeuroMode: boolean;
}

export const OnboardingPhase: React.FC<Props> = ({ form, setForm, onStart, isNeuroMode }) => {
  const cls = (base: string) => `${base} ${isNeuroMode ? "text-lg leading-relaxed" : "text-sm"}`;

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" exit="exit" className="space-y-6">
      <motion.div variants={slideUp} className="text-center mb-8">
        <Gamepad2 size={48} className="mx-auto text-[#FF9500] mb-4" />
        <p className={cls("text-white/60")}>Визнач свій вектор перед стартом. Відповіді формують індивідуальну лінію подій.</p>
      </motion.div>
      
      <div className="space-y-4">
        <motion.label variants={slideUp} className="block">
          <span className="text-xs text-white/50 uppercase font-mono">1. Напрямок</span>
          <div className="flex gap-2 mt-2">
            {(["PRODUCTION","SERVICES","RETAIL"] as const).map(d => (
              <motion.button 
                {...tapScale}
                key={d} 
                onClick={() => setForm(f => ({...f, direction: d}))} 
                className={`flex-1 py-3 rounded-xl text-xs font-bold border transition-all backdrop-blur-md ${form.direction === d ? "bg-[#00FF88]/15 border-[#00FF88]/50 text-[#00FF88] shadow-[0_0_15px_rgba(0,255,136,0.1)]" : "bg-white/5 border-white/10 text-white/50"}`}
              >
                {d === "PRODUCTION" ? "🏭 Виробництво" : d === "SERVICES" ? "💼 Послуги" : "🛒 Рітейл"}
              </motion.button>
            ))}
          </div>
        </motion.label>
        
        <motion.label variants={slideUp} className="block">
          <span className="text-xs text-white/50 uppercase font-mono">2. Ніша</span>
          <input 
            value={form.niche} 
            onChange={e => setForm(f => ({...f, niche: e.target.value}))} 
            placeholder="Наприклад: чайні концентрати для HoReCa" 
            className="w-full mt-1 p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/20 focus:outline-none focus:border-[#00FF88]/50 backdrop-blur-md transition-all" 
          />
        </motion.label>
        
        <motion.label variants={slideUp} className="block">
          <span className="text-xs text-white/50 uppercase font-mono">3. Мотивація (чому саме це?)</span>
          <textarea 
            value={form.motivation} 
            onChange={e => setForm(f => ({...f, motivation: e.target.value}))} 
            placeholder="Що рухає тобою?" 
            className="w-full mt-1 p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/20 focus:outline-none focus:border-[#00FF88]/50 h-20 resize-none backdrop-blur-md transition-all" 
          />
        </motion.label>
        
        <motion.label variants={slideUp} className="block">
          <span className="text-xs text-white/50 uppercase font-mono">5. Фінансова мета ($)</span>
          <input 
            type="number" 
            value={form.financialGoal} 
            onChange={e => setForm(f => ({...f, financialGoal: +e.target.value}))} 
            className="w-full mt-1 p-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#FF9500]/50 backdrop-blur-md transition-all" 
          />
        </motion.label>
        
        <motion.label variants={slideUp} className="block">
          <span className="text-xs text-white/50 uppercase font-mono">6. Особиста мета</span>
          <input 
            value={form.personalGoal} 
            onChange={e => setForm(f => ({...f, personalGoal: e.target.value}))} 
            placeholder="Що ти хочеш відчувати?" 
            className="w-full mt-1 p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/20 focus:outline-none backdrop-blur-md transition-all" 
          />
        </motion.label>

        <motion.label variants={slideUp} className="block">
          <span className="text-xs text-white/50 uppercase font-mono flex items-center gap-1"><Users size={12}/> 7. Команда (Партнери)</span>
          <div className="flex gap-2 mt-2">
            {([1, 2, 3, 4, 5]).map(n => (
              <motion.button 
                {...tapScale}
                key={n} 
                onClick={() => setForm(f => ({...f, teamSize: n}))} 
                className={`flex-1 py-3 rounded-xl text-xs font-bold border transition-all backdrop-blur-md ${form.teamSize === n || (n === 1 && !form.teamSize) ? "bg-indigo-500/20 border-indigo-500/50 text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.2)]" : "bg-white/5 border-white/10 text-white/50"}`}
              >
                {n === 1 ? "Соло" : `${n} людей`}
              </motion.button>
            ))}
          </div>
          <p className="text-[9px] text-white/30 mt-1">Виберіть соло-гру або додайте від 1 до 4 партнерів з прихованими мотиваціями.</p>
        </motion.label>
      </div>

      <motion.button 
        variants={slideUp}
        whileHover={{ scale: form.direction && form.niche ? 1.02 : 1 }}
        whileTap={{ scale: form.direction && form.niche ? 0.98 : 1 }}
        onClick={onStart} 
        disabled={!form.direction || !form.niche} 
        className="w-full py-4 bg-[#00FF88] text-black font-black uppercase tracking-widest rounded-xl disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:shadow-[0_0_30px_rgba(0,255,136,0.4)]"
      >
        Почати Гру →
      </motion.button>
    </motion.div>
  );
};
