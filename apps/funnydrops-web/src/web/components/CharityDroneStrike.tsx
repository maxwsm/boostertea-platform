import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ORC_SCENARIOS = [
  { id: 1, name: 'Піхотинець', emoji: '🧟‍♂️', points: 100 },
  { id: 2, name: 'БМП', emoji: '🪖', points: 500 },
  { id: 3, name: 'Танк', emoji: '🚜', points: 1000 },
  { id: 4, name: 'Тигр', emoji: '🚙', points: 250 },
  { id: 5, name: 'Склад БК', emoji: '💥', points: 5000 },
];

export const CharityDroneStrike = () => {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'idle' | 'aiming' | 'striking' | 'hit' | 'donate'>('idle');
  const [target, setTarget] = useState(ORC_SCENARIOS[0]);

  // Hook to randomly trigger the event (for demo, trigger closely after mount)
  useEffect(() => {
    // In production, this would be tied to `is_charity_active` from the API or a randomized timer.
    const timer = setTimeout(() => {
      setTarget(ORC_SCENARIOS[Math.floor(Math.random() * ORC_SCENARIOS.length)]);
      setIsActive(true);
      setPhase('aiming');
    }, 15000); // Trigger after 15 seconds of browsing

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (phase === 'aiming') {
      setTimeout(() => setPhase('striking'), 2000);
    } else if (phase === 'striking') {
      setTimeout(() => setPhase('hit'), 1500);
    } else if (phase === 'hit') {
      setTimeout(() => setPhase('donate'), 2000);
    }
  }, [phase]);

  if (!isActive) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] pointer-events-none flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      >
        <div className="relative w-full max-w-lg h-[600px] pointer-events-auto flex flex-col items-center justify-center">
          
          {/* TOP: Target (Orc) */}
          <motion.div
            initial={{ scale: 0, y: -200 }}
            animate={{ scale: phase === 'hit' ? 2 : 1, y: phase === 'hit' ? 0 : -150 }}
            className="absolute top-10 text-8xl"
          >
            {phase === 'hit' || phase === 'donate' ? '🔥💀🔥' : target.emoji}
          </motion.div>

          {/* MIDDLE: Drone / FPV */}
          {phase === 'striking' && (
            <motion.div
              initial={{ y: 300, scale: 2 }}
              animate={{ y: -150, scale: 0.2 }}
              transition={{ duration: 1.5, ease: "easeIn" }}
              className="absolute text-6xl"
            >
              🛸
            </motion.div>
          )}

          {/* BOTTOM: Nazar / Pilot */}
          {(phase === 'aiming' || phase === 'striking') && (
            <motion.div
              initial={{ y: 200, opacity: 0 }}
              animate={{ y: 150, opacity: 1 }}
              exit={{ y: 200, opacity: 0 }}
              className="absolute bottom-10 flex flex-col items-center"
            >
              <div className="text-6xl mb-2">🧑‍💻🎮</div>
              <div className="bg-black/80 text-green-400 font-mono text-sm px-4 py-1 rounded border border-green-500/50">
                {phase === 'aiming' ? 'TARGET LOCKED...' : 'FPV DEPLOYED!'}
              </div>
            </motion.div>
          )}

          {/* DONATE POPUP */}
          <AnimatePresence>
            {phase === 'donate' && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl shadow-green-900/20 max-w-sm text-center relative pointer-events-auto"
              >
                <button 
                  onClick={() => setIsActive(false)}
                  className="absolute top-4 right-4 text-zinc-500 hover:text-white"
                >
                  ✕
                </button>
                <h3 className="text-2xl font-bold text-white mb-2">Мінус {target.name}!</h3>
                <p className="text-zinc-400 mb-6 text-sm">
                  Наші пташки працюють завдяки вам. Долучайся до збору на новий дрон для підрозділу Назара!
                </p>
                
                <div className="bg-white p-4 rounded-xl mb-6 inline-block">
                  {/* Placeholder for QR Code */}
                  <div className="w-32 h-32 bg-zinc-200 border-2 border-dashed border-zinc-400 flex items-center justify-center rounded-lg">
                    <span className="text-zinc-500 text-xs font-mono">QR Monobank</span>
                  </div>
                </div>

                <div className="w-full bg-zinc-800 rounded-full h-3 mb-2 overflow-hidden">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-400 h-3 rounded-full w-[65%] shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                </div>
                <div className="flex justify-between text-xs text-zinc-500 font-mono mb-6">
                  <span>Зібрано: 65,000 ₴</span>
                  <span>Ціль: 100,000 ₴</span>
                </div>

                <a 
                  href="https://send.monobank.ua/"
                  target="_blank"
                  rel="noreferrer"
                  className="block w-full py-3 px-4 bg-white text-black font-bold rounded-xl hover:bg-green-400 hover:text-white transition-all transform hover:scale-105"
                >
                  Задонатити
                </a>
              </motion.div>
            )}
          </AnimatePresence>
          
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
