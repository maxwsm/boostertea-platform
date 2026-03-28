import React, { useState } from 'react';
import { motion } from 'framer-motion';

export const EnergyImpactCalculator = () => {
  const [weight, setWeight] = useState<number>(70);
  const [teaType, setTeaType] = useState<'dahongpao' | 'puerh' | 'gaba'>('dahongpao');

  const stats = {
    dahongpao: { name: 'Da Hong Pao', color: 'bg-red-900', energy: 1.8, focus: 2.2 },
    puerh: { name: 'Pu-Erh', color: 'bg-amber-900', energy: 2.5, focus: 1.5 },
    gaba: { name: 'GABA', color: 'bg-emerald-900', energy: 0.5, focus: 3.0 },
  };

  const currentStats = stats[teaType];
  const cupsOfCoffeeEquivalent = ((currentStats.energy * weight) / 70).toFixed(1);
  const focusMultiplier = ((currentStats.focus * weight) / 70).toFixed(1);

  return (
    <div className="my-16 p-8 rounded-3xl bg-white/[0.02] backdrop-blur-xl border border-white/10 shadow-2xl relative overflow-hidden group">
      {/* Background glow */}
      <div className={`absolute -top-24 -right-24 w-64 h-64 rounded-full blur-[100px] opacity-20 ${currentStats.color}`} />
      
      <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h3 className="text-3xl font-black text-white mb-3" style={{ fontFamily: '"Syne", sans-serif' }}>Калькулятор Ефекту</h3>
          <p className="text-white/60 mb-8 text-sm leading-relaxed">Дізнайтеся, як 1 порція концентрату BoosterTea вплине на ваш організм.</p>
          
          <div className="space-y-6">
            <div>
              <label className="block text-white/50 text-xs font-mono uppercase tracking-widest mb-4 flex justify-between">
                <span>Ваша вага</span>
                <span className="text-[#00D4FF] font-bold">{weight} кг</span>
              </label>
              <input 
                type="range" 
                min="40" 
                max="120" 
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#00D4FF]"
              />
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(stats) as Array<keyof typeof stats>).map((type) => (
                <button
                  key={type}
                  onClick={() => setTeaType(type)}
                  className={`py-2 px-1 text-xs font-medium rounded-lg transition-all ${
                    teaType === type 
                      ? 'bg-[#C4956A]/20 text-[#C4956A] border border-[#C4956A]/50 shadow-[0_0_15px_rgba(196,149,106,0.2)]' 
                      : 'bg-white/5 text-white/50 border border-transparent hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {stats[type].name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-[#0D0F14]/50 p-8 border border-white/5 rounded-3xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-end mb-2">
                <span className="text-white/40 text-xs font-mono uppercase tracking-widest">Енергія (як кава)</span>
                <motion.span 
                  key={cupsOfCoffeeEquivalent}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-3xl font-mono text-white"
                >
                  {cupsOfCoffeeEquivalent}x
                </motion.span>
              </div>
              <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, Number(cupsOfCoffeeEquivalent) * 30)}%` }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="bg-gradient-to-r from-red-500 to-[#FF4500] h-1.5 rounded-full shadow-[0_0_10px_#FF4500]"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-end mb-2">
                <span className="text-white/40 text-xs font-mono uppercase tracking-widest">Фокус / Спокій</span>
                <motion.span 
                  key={focusMultiplier}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-3xl font-mono text-emerald-400"
                >
                  {focusMultiplier}x
                </motion.span>
              </div>
              <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, Number(focusMultiplier) * 30)}%` }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="bg-gradient-to-r from-[#00D4FF] to-[#22D3A5] h-1.5 rounded-full shadow-[0_0_10px_#00D4FF]"
                />
              </div>
            </div>
            
            <p className="text-[10px] text-white/30 font-mono tracking-wide mt-6 leading-relaxed relative z-10">
              * Розрахунок є приблизним і базується на середній чутливості до L-теаніну та кофеїну.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
