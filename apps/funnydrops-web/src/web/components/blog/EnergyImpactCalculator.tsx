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
    <div className="my-12 p-8 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-2xl relative overflow-hidden">
      {/* Background glow */}
      <div className={`absolute -top-24 -right-24 w-64 h-64 rounded-full blur-[100px] opacity-20 ${currentStats.color}`} />
      
      <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h3 className="text-2xl font-bold text-white mb-2 font-serif">Калькулятор Ефекту</h3>
          <p className="text-zinc-400 mb-6 text-sm">Дізнайтеся, як 1 порція концентрату BoosterTea вплине на ваш організм.</p>
          
          <div className="space-y-6">
            <div>
              <label className="block text-zinc-300 text-sm mb-2 flex justify-between">
                <span>Ваша вага</span>
                <span className="font-mono text-[#C4956A]">{weight} кг</span>
              </label>
              <input 
                type="range" 
                min="40" 
                max="120" 
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#C4956A]"
              />
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(stats) as Array<keyof typeof stats>).map((type) => (
                <button
                  key={type}
                  onClick={() => setTeaType(type)}
                  className={`py-2 px-1 text-xs font-medium rounded-lg transition-all ${
                    teaType === type 
                      ? 'bg-[#C4956A] text-black shadow-lg shadow-[#C4956A]/20' 
                      : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                  }`}
                >
                  {stats[type].name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-black/50 p-6 border border-zinc-800 rounded-2xl">
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-end mb-2">
                <span className="text-zinc-400 text-sm uppercase tracking-wider">Енергія (як кава)</span>
                <motion.span 
                  key={cupsOfCoffeeEquivalent}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-3xl font-mono text-white"
                >
                  {cupsOfCoffeeEquivalent}x
                </motion.span>
              </div>
              <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, Number(cupsOfCoffeeEquivalent) * 30)}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="bg-gradient-to-r from-red-500 to-orange-400 h-2 rounded-full"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-end mb-2">
                <span className="text-zinc-400 text-sm uppercase tracking-wider">Фокус / Спокій</span>
                <motion.span 
                  key={focusMultiplier}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-3xl font-mono text-emerald-400"
                >
                  {focusMultiplier}x
                </motion.span>
              </div>
              <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, Number(focusMultiplier) * 30)}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="bg-gradient-to-r from-emerald-500 to-teal-400 h-2 rounded-full"
                />
              </div>
            </div>
            
            <p className="text-xs text-zinc-500 italic mt-4">
              * Розрахунок є приблизним і базується на середній чутливості до L-теаніну та кофеїну.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
