import React, { useState } from 'react';
import { motion } from 'framer-motion';

export const RoiCalculator = () => {
  const [portionsPerDay, setPortionsPerDay] = useState(20);
  const [pricePerPortion, setPricePerPortion] = useState(60); // 60 UAH

  // Base metrics
  const costPerPortion = 15; // 15 UAH cost
  const workingDays = 30; // 1 month

  // Calculations
  const revenuePerDay = portionsPerDay * pricePerPortion;
  const costPerDay = portionsPerDay * costPerPortion;
  const profitPerDay = revenuePerDay - costPerDay;
  const profitPerMonth = profitPerDay * workingDays;

  return (
    <section className="py-24 bg-[#0B0033] relative overflow-hidden font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
      {/* Background Pixel Grid / Dots pattern */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(var(--secondary) 2px, transparent 2px)',
          backgroundSize: '30px 30px'
        }}
      />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Arcade Cabinet Container */}
        <div className="bg-[#150050] border-8 border-white rounded-[40px] shadow-[15px_15px_0_var(--accent)] p-8 md:p-12 relative">
          
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-6xl text-white uppercase tracking-wider mb-4" style={{ textShadow: '4px 4px 0 var(--accent)' }}>
              ROI Аркада
            </h2>
            <div className="inline-block bg-black text-[#00FFAA] px-6 py-2 border-4 border-[#00FFAA] rounded-full animate-pulse">
              INSERT COIN TO CALCULATE
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 text-white uppercase">
            
            {/* Controls Left side */}
            <div className="space-y-10">
              {/* Slider 1 */}
              <div>
                <div className="flex justify-between items-end mb-4">
                  <span className="text-2xl text-[var(--tea-gold)]" style={{ textShadow: '2px 2px 0 #000' }}>Порцій в день:</span>
                  <span className="text-3xl font-black bg-black px-4 py-1 border-4 border-[var(--tea-gold)] shadow-[4px_4px_0_var(--accent)]">{portionsPerDay}</span>
                </div>
                <input 
                  type="range" 
                  min="5" 
                  max="200" 
                  step="5"
                  value={portionsPerDay}
                  onChange={(e) => setPortionsPerDay(parseInt(e.target.value))}
                  className="w-full h-6 bg-black rounded-full appearance-none outline-none border-2 border-white cursor-pointer"
                  style={{ accentColor: 'var(--accent)' }}
                />
              </div>

              {/* Slider 2 */}
              <div>
                <div className="flex justify-between items-end mb-4">
                  <span className="text-2xl text-[var(--secondary)]" style={{ textShadow: '2px 2px 0 #000' }}>Ціна за порцію (₴):</span>
                  <span className="text-3xl font-black bg-black px-4 py-1 border-4 border-[var(--secondary)] shadow-[4px_4px_0_var(--accent)]">{pricePerPortion}</span>
                </div>
                <input 
                  type="range" 
                  min="30" 
                  max="120" 
                  step="5"
                  value={pricePerPortion}
                  onChange={(e) => setPricePerPortion(parseInt(e.target.value))}
                  className="w-full h-6 bg-black rounded-full appearance-none outline-none border-2 border-white cursor-pointer"
                  style={{ accentColor: 'var(--secondary)' }}
                />
              </div>

              <div className="bg-black/40 p-6 rounded-2xl border-2 border-dashed border-[var(--text-muted)]">
                <p className="text-sm text-[var(--secondary)] mb-2">🎮 Рівень складності: Легкий</p>
                <p className="text-sm text-white">Собівартість 1 порції фіксована ≈ 15 ₴ (сироп, лід, стакан).</p>
              </div>
            </div>

            {/* Scoreboard Right side */}
            <div className="bg-black border-8 border-[var(--tea-gold)] rounded-3xl p-8 flex flex-col justify-center relative overflow-hidden">
              {/* Scanlines effect */}
              <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] pointer-events-none" />
              
              <h3 className="text-xl text-center text-white mb-8 border-b-4 border-[var(--accent)] pb-4">YOUR HIGHSCORE</h3>
              
              <div className="space-y-6 flex-1 flex flex-col justify-center">
                <div className="flex justify-between items-end">
                  <span className="text-gray-400">Виручка (міс):</span>
                  <span className="text-2xl text-white">{(revenuePerDay * workingDays).toLocaleString()} ₴</span>
                </div>
                <div className="flex justify-between items-end">
                  <span className="text-gray-400">Витрати (міс):</span>
                  <span className="text-2xl text-[var(--accent)]">-{(costPerDay * workingDays).toLocaleString()} ₴</span>
                </div>
                
                <div className="pt-6 mt-6 border-t-4 border-white border-dashed flex justify-between items-end">
                  <span className="text-2xl text-[var(--secondary)] animate-pulse">ПРОФІТ:</span>
                  <motion.span 
                    key={profitPerMonth}
                    initial={{ scale: 1.5, color: '#FFFFFF' }}
                    animate={{ scale: 1, color: '#00FFAA' }}
                    className="text-4xl sm:text-5xl font-black"
                  >
                    {profitPerMonth.toLocaleString()} ₴
                  </motion.span>
                </div>
              </div>

              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-10 w-full py-4 bg-[var(--accent)] text-white text-2xl font-black rounded-xl border-4 border-white shadow-[0_6px_0_#CC0066] active:shadow-[0_0px_0_#CC0066] active:translate-y-2 uppercase"
              >
                Start Business
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
