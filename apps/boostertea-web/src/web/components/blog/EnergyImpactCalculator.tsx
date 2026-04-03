import React, { useState } from 'react';
import { motion } from 'framer-motion';

export const EnergyImpactCalculator = () => {
  const [weight, setWeight] = useState<number>(70);
  const [teaType, setTeaType] = useState<'dahongpao' | 'puerh' | 'gaba'>('dahongpao');

  const stats = {
    dahongpao: { name: 'Da Hong Pao', color: 'bg-[#FF3333]', shadow: 'shadow-[0_0_30px_rgba(255,51,51,0.5)]', border: 'border-[#FF3333]', text: 'text-[#FF3333]', energy: 1.8, focus: 2.2 },
    puerh: { name: 'Pu-Erh', color: 'bg-[#FF9900]', shadow: 'shadow-[0_0_30px_rgba(255,153,0,0.5)]', border: 'border-[#FF9900]', text: 'text-[#FF9900]', energy: 2.5, focus: 1.5 },
    gaba: { name: 'GABA', color: 'bg-[#00FFAA]', shadow: 'shadow-[0_0_30px_rgba(0,255,170,0.5)]', border: 'border-[#00FFAA]', text: 'text-[#00FFAA]', energy: 0.5, focus: 3.0 },
  };

  const currentStats = stats[teaType];
  const cupsOfCoffeeEquivalent = ((currentStats.energy * weight) / 70).toFixed(1);
  const focusMultiplier = ((currentStats.focus * weight) / 70).toFixed(1);

  return (
    <div className="my-16 relative w-full group">
      {/* Brutalist / Neon Background Glow */}
      <div className={`absolute -inset-1 rounded-[2.5rem] blur-xl opacity-30 transition-all duration-1000 ${currentStats.color}`} />
      
      {/* Main Glassmorphism Container */}
      <div className="relative p-8 md:p-12 rounded-[2rem] bg-black/40 backdrop-blur-3xl border border-white/10 overflow-hidden">
        {/* Animated matrix background effect */}
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] pointer-events-none mix-blend-overlay" />
        <div className={`absolute top-0 right-0 w-96 h-96 blur-[120px] rounded-full pointer-events-none transition-all duration-1000 opacity-20 ${currentStats.color}`} />

        <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
          
          {/* Left Column: Inputs */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6">
              <span className={`w-2 h-2 rounded-full animate-pulse ${currentStats.color}`} />
              <span className="text-[10px] font-mono text-white/70 uppercase tracking-widest">Біо-аналізатор</span>
            </div>
            
            <h3 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tighter" style={{ fontFamily: '"Syne", sans-serif' }}>
              Ефект <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50">Метрика</span>
            </h3>
            <p className="text-white/50 mb-10 text-sm leading-relaxed font-light">
              Симуляція впливу екстракту BoosterTea на ваш організм. Оберіть тип чаю та вкажіть вашу вагу для калібрування нейро-ефекту.
            </p>
            
            <div className="space-y-8">
              {/* Weight Slider */}
              <div className="bg-white/[0.02] p-6 rounded-2xl border border-white/5">
                <label className="block text-white/50 text-xs font-mono uppercase tracking-widest mb-6 flex justify-between items-end">
                  <span>Ваша маса тіла</span>
                  <span className="text-3xl font-black text-white">{weight} <span className="text-sm font-normal text-white/30">кг</span></span>
                </label>
                <div className="relative">
                  <input 
                    type="range" 
                    min="40" 
                    max="120" 
                    value={weight}
                    onChange={(e) => setWeight(Number(e.target.value))}
                    className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer z-10 relative custom-range"
                  />
                  {/* Slider Glow */}
                  <div 
                    className={`absolute top-1/2 left-0 h-1.5 -translate-y-1/2 rounded-l-lg pointer-events-none transition-all duration-300 ${currentStats.color} ${currentStats.shadow}`}
                    style={{ width: `${((weight - 40) / 80) * 100}%` }}
                  />
                </div>
              </div>
              
              {/* Tea Type Selector */}
              <div className="grid grid-cols-3 gap-3 p-2 bg-white/[0.02] rounded-2xl border border-white/5">
                {(Object.keys(stats) as Array<keyof typeof stats>).map((type) => {
                  const isActive = teaType === type;
                  const itemStats = stats[type];
                  return (
                    <button
                      key={type}
                      onClick={() => setTeaType(type)}
                      className={`relative py-4 px-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-500 overflow-hidden ${
                        isActive 
                          ? `bg-black/50 text-white border ${itemStats.border}` 
                          : 'bg-transparent text-white/40 border border-transparent hover:bg-white/5 hover:text-white/80'
                      }`}
                    >
                      {isActive && (
                        <motion.div 
                          layoutId="activeTab"
                          className={`absolute inset-0 opacity-20 ${itemStats.color}`}
                          transition={{ duration: 0.3 }}
                        />
                      )}
                      <span className="relative z-10">{itemStats.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Output Stats */}
          <div className="bg-black/60 p-8 md:p-10 border border-white/10 rounded-[2rem] relative overflow-hidden backdrop-blur-md shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
            
            <div className="space-y-10">
              {/* Energy Output */}
              <div className="relative">
                <div className="flex justify-between items-end mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-4 bg-[#FF3333] rounded-full" />
                    <span className="text-white/40 text-xs font-mono uppercase tracking-widest">Енергія (Еквівалент Кави)</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <motion.span 
                      key={`energy-${cupsOfCoffeeEquivalent}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-5xl font-black text-white"
                      style={{ fontFamily: '"Syne", sans-serif' }}
                    >
                      {cupsOfCoffeeEquivalent}
                    </motion.span>
                    <span className="text-white/30 text-lg font-mono">x</span>
                  </div>
                </div>
                <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden relative">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, Number(cupsOfCoffeeEquivalent) * 30)}%` }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#FF3333]/50 to-[#FF3333] shadow-[0_0_15px_#FF3333]"
                  />
                </div>
              </div>

              {/* Focus Output */}
              <div className="relative">
                <div className="flex justify-between items-end mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-4 bg-[#00FFAA] rounded-full" />
                    <span className="text-white/40 text-xs font-mono uppercase tracking-widest">Фокус / Спокій (L-Теанін)</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <motion.span 
                      key={`focus-${focusMultiplier}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-5xl font-black text-white"
                      style={{ fontFamily: '"Syne", sans-serif' }}
                    >
                      {focusMultiplier}
                    </motion.span>
                    <span className="text-white/30 text-lg font-mono">x</span>
                  </div>
                </div>
                <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden relative">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, Number(focusMultiplier) * 30)}%` }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#00FFAA]/50 to-[#00FFAA] shadow-[0_0_15px_#00FFAA]"
                  />
                </div>
              </div>
              
              {/* Disclaimer Terminal */}
              <div className="bg-black/50 border border-white/5 rounded-xl p-4 mt-8 flex gap-3 items-start">
                <svg className="w-5 h-5 text-white/30 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-[10px] text-white/40 font-mono tracking-wide leading-relaxed">
                  * Візуалізація є математичною симуляцією. Режим "{currentStats.name}" базується на еталонному вмісті {teaType === 'gaba' ? 'Гамма-аміномасляної кислоти' : (teaType === 'dahongpao' ? 'L-теаніну та кофеїну' : 'теїну та пуеролів')} у 30мл концентрату.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .custom-range::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          border: 4px solid black;
          box-shadow: 0 0 10px rgba(255,255,255,0.5);
          transition: all 0.2s;
        }
        .custom-range::-webkit-slider-thumb:hover {
          transform: scale(1.1);
        }
        .custom-range::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          border: 4px solid black;
          box-shadow: 0 0 10px rgba(255,255,255,0.5);
          transition: all 0.2s;
        }
      `}</style>
    </div>
  );
};
