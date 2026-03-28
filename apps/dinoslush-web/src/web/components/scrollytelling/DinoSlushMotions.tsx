import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';

// 1. Slush Cannon Cursor Replacement
export const SlushCannonGame = () => {
  const [splats, setSplats] = useState<{x: number, y: number, color: string}[]>([]);
  const ref = React.useRef<HTMLDivElement>(null);

  const handleClick = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const colors = ['#00ff00', '#ff00ff', '#00ffff', '#ffff00'];
    setSplats([...splats, {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      color: colors[Math.floor(Math.random() * colors.length)]
    }]);
  };

  return (
    <div 
      ref={ref}
      onClick={handleClick}
      className="relative h-96 w-full bg-zinc-900 rounded-3xl overflow-hidden cursor-crosshair border-4 border-dashed border-[#00ff00]/50"
    >
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <h3 className="text-4xl font-black text-white/20 select-none text-center">
          РОЗСТРІЛЯЙ НУДЬГУ!<br/><span className="text-xl">Клікай по зоні</span>
        </h3>
      </div>
      
      {splats.map((splat, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: [1, 1.2, 1], opacity: [1, 0.8] }}
          className="absolute w-16 h-16 rounded-full mix-blend-screen pointer-events-none blur-sm"
          style={{
            left: splat.x - 32,
            top: splat.y - 32,
            backgroundColor: splat.color,
            boxShadow: `0 0 30px ${splat.color}`
          }}
        />
      ))}
    </div>
  );
};

// 2. Bouncy Gel Text
export const BouncyGelText = ({ text = "DINO SLUSH" }) => {
  return (
    <div className="flex space-x-2 my-8 justify-center">
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          whileHover={{ y: -20, scale: 1.2, rotate: Math.random() * 20 - 10 }}
          className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-t from-pink-500 to-yellow-400 cursor-pointer drop-shadow-lg inline-block"
          style={{ WebkitTextStroke: '2px black' }}
          transition={{ type: 'spring', stiffness: 300, damping: 10 }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </div>
  );
};

// 3. WebAR Preview Mock
export const WebARPreviewMock = () => {
  const [active, setActive] = useState(false);

  return (
    <div className="p-8 border-4 border-[#00ffff] bg-black rounded-3xl flex flex-col items-center">
      <h3 className="text-3xl font-black text-[#00ffff] mb-6 uppercase">Приміряти Вайб</h3>
      
      <div className="w-full max-w-sm aspect-video bg-zinc-800 rounded-xl overflow-hidden relative mb-6 border-2 border-[#ff00ff]">
        {active ? (
          <div className="absolute inset-0 flex items-center justify-center bg-zinc-700">
            {/* Fake Camera Feed */}
            <motion.div 
              animate={{ rotate: 360 }} 
              transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"
            />
            {/* Fake AR Element */}
            <motion.div 
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: 'spring' }}
              className="relative z-10 text-6xl drop-shadow-[0_0_20px_rgba(0,255,0,1)]"
            >
              🕶️ 🥤
            </motion.div>
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-12 h-12 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          </div>
        )}
      </div>

      <button 
        onClick={() => setActive(!active)}
        className="px-8 py-4 bg-[#ff00ff] hover:bg-[#00ffff] hover:text-black font-black text-white text-xl rounded-full transition-colors w-full sm:w-auto uppercase shadow-[4px_4px_0px_#00ff00]"
      >
        {active ? 'Вимкнути Камеру' : 'Активувати WebAR'}
      </button>
    </div>
  );
};
