import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const bases = [
  { id: 'coffee', name: 'Кава', color: '#3E2723', icon: '☕' },
  { id: 'milk', name: 'Молоко', color: '#F5F5F5', icon: '🥛' },
  { id: 'sparkling', name: 'Газована вода', color: '#E0F7FA', icon: '🫧' }
];

const syrups = [
  { id: 'strawberry', name: 'Полуниця', color: '#FF1053', description: 'Ягідний вибух' },
  { id: 'coconut', name: 'Кокос', color: '#00F0FF', description: 'Тропічний чіл' },
  { id: 'mango', name: 'Манго', color: '#FF8811', description: 'Сонячний вайб' },
  { id: 'caramel', name: 'Карамель', color: '#D4AF37', description: 'Класична насолода' }
];

export const RecipeBuilder = () => {
  const [selectedBase, setSelectedBase] = useState(bases[0]);
  const [selectedSyrup1, setSelectedSyrup1] = useState(syrups[0]);
  const [selectedSyrup2, setSelectedSyrup2] = useState<typeof syrups[0] | null>(null);
  const [isMixing, setIsMixing] = useState(false);

  const handleMix = () => {
    setIsMixing(true);
    setTimeout(() => setIsMixing(false), 2000);
  };

  return (
    <section className="py-24 relative overflow-hidden bg-[var(--bg-primary)]">
      {/* Neon background glows */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-[var(--accent)]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-96 h-96 bg-[var(--secondary)]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-5xl font-black mb-4"
          >
            Створи Свій <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent)] to-[var(--secondary)]">Мікс</span>
          </motion.h2>
          <p className="text-[var(--text-muted)] text-lg">Експериментуй зі смаками. Без цукру, без кордонів.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Controls */}
          <div className="space-y-8 bg-[var(--bg-secondary)]/50 border border-[var(--border)] p-8 rounded-3xl backdrop-blur-md">
            
            {/* Base Selection */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-[var(--text-primary)]">1. Обери основу</h3>
              <div className="flex gap-4">
                {bases.map(base => (
                  <button
                    key={base.id}
                    onClick={() => setSelectedBase(base)}
                    className={`flex-1 py-4 flex flex-col items-center gap-2 rounded-2xl transition-all border-2 ${
                      selectedBase.id === base.id 
                        ? 'bg-[var(--bg-elevated)] border-[var(--accent)] shadow-[0_0_15px_rgba(255,16,83,0.3)]' 
                        : 'border-[var(--border)] hover:border-[var(--border-hover)]'
                    }`}
                  >
                    <span className="text-3xl">{base.icon}</span>
                    <span className="font-medium text-sm">{base.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Syrups Selection */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-[var(--text-primary)]">2. Додай сиропи (до двох)</h3>
              <div className="grid grid-cols-2 gap-4">
                {syrups.map(syrup => {
                  const isSelected1 = selectedSyrup1?.id === syrup.id;
                  const isSelected2 = selectedSyrup2?.id === syrup.id;
                  const isSelected = isSelected1 || isSelected2;

                  return (
                    <button
                      key={syrup.id}
                      onClick={() => {
                        if (isSelected1) {
                          setSelectedSyrup1(selectedSyrup2 || syrups[0]);
                          setSelectedSyrup2(null);
                        } else if (isSelected2) {
                          setSelectedSyrup2(null);
                        } else if (!selectedSyrup1) {
                          setSelectedSyrup1(syrup);
                        } else if (!selectedSyrup2) {
                          setSelectedSyrup2(syrup);
                        } else {
                          setSelectedSyrup2(syrup);
                        }
                      }}
                      className={`p-4 flex flex-col items-start gap-2 rounded-2xl transition-all border-2 ${
                        isSelected 
                          ? 'bg-[var(--bg-elevated)] shadow-lg' 
                          : 'border-[var(--border)] hover:border-[var(--border-hover)] bg-transparent'
                      }`}
                      style={{ 
                        borderColor: isSelected ? syrup.color : '',
                        boxShadow: isSelected ? `0 0 15px ${syrup.color}40` : ''
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: syrup.color, boxShadow: `0 0 10px ${syrup.color}` }} />
                        <span className="font-bold">{syrup.name}</span>
                      </div>
                      <span className="text-xs text-[var(--text-muted)] text-left">{syrup.description}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <button 
              onClick={handleMix}
              className="w-full py-4 bg-[var(--accent)] text-white font-bold rounded-2xl hover:scale-[1.02] transition-transform active:scale-95 text-lg"
              style={{
                background: `linear-gradient(90deg, ${selectedSyrup1.color}, ${selectedSyrup2 ? selectedSyrup2.color : selectedSyrup1.color})`,
                boxShadow: `0 10px 30px ${selectedSyrup1.color}50`
              }}
            >
              Змішати
            </button>
          </div>

          {/* Visualization Glass */}
          <div className="relative flex justify-center items-center h-[500px]">
            <div className="relative w-64 h-80 rounded-b-[40px] border-4 border-white/10 glass overflow-hidden shadow-2xl">
              
              {/* The Liquid Base */}
              <motion.div 
                className="absolute bottom-0 w-full"
                animate={{ 
                  height: '80%',
                  backgroundColor: selectedBase.color
                }}
                transition={{ duration: 0.5 }}
              />

              {/* Syrup 1 Liquid Pour / Mix */}
              <AnimatePresence>
                {selectedSyrup1 && (
                  <motion.div
                    key="syrup1"
                    className="absolute bottom-0 w-full opacity-60 mix-blend-overlay"
                    initial={{ height: '0%' }}
                    animate={{ 
                      height: '80%', 
                      backgroundColor: selectedSyrup1.color,
                      filter: isMixing ? 'blur(15px)' : 'blur(5px)'
                    }}
                    transition={{ duration: 1 }}
                  />
                )}
              </AnimatePresence>

              {/* Syrup 2 Liquid Pour / Mix */}
              <AnimatePresence>
                {selectedSyrup2 && (
                  <motion.div
                    key="syrup2"
                    className="absolute bottom-0 w-full opacity-60 mix-blend-color-dodge"
                    initial={{ height: '0%' }}
                    animate={{ 
                      height: '50%', 
                      backgroundColor: selectedSyrup2.color,
                      filter: isMixing ? 'blur(25px)' : 'blur(10px)'
                    }}
                    transition={{ duration: 1.2 }}
                  />
                )}
              </AnimatePresence>

              {/* Surface bubbles / ice effect */}
              <motion.div 
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[20%] w-full h-8 bg-white/20 blur-md rounded-full"
              />

              {/* Mix animation swirl */}
              {isMixing && (
                <motion.div 
                  initial={{ rotate: 0, opacity: 0 }}
                  animate={{ rotate: 720, opacity: [0, 0.5, 0] }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                  className="absolute inset-x-0 bottom-10 h-32 w-full rounded-full border-t-4 border-white/30"
                />
              )}

              {/* Glass reflection */}
              <div className="absolute inset-y-0 left-4 w-4 bg-gradient-to-r from-white/30 to-transparent blur-sm rotate-3 rounded-full" />
            </div>

            {/* Dynamic Ambient Glow behind the glass based on selected syrups */}
            <motion.div 
              className="absolute w-[120%] h-[120%] -z-10 rounded-full blur-[80px] opacity-40 mix-blend-screen"
              animate={{
                background: `radial-gradient(circle, ${selectedSyrup1.color} 0%, ${selectedSyrup2 ? selectedSyrup2.color : 'transparent'} 50%, transparent 70%)`
              }}
              transition={{ duration: 1 }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
