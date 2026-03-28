import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

// 1. Matrix Decode Text (Focus)
export const MatrixDecodeText = ({ text }: { text: string }) => {
  const [displayedText, setDisplayedText] = useState('');
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*';
  
  useEffect(() => {
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayedText(text.split('').map((char, index) => {
        if(index < iteration) return text[index];
        return chars[Math.floor(Math.random() * chars.length)];
      }).join(''));
      if(iteration >= text.length) clearInterval(interval);
      iteration += 1 / 3;
    }, 30);
    return () => clearInterval(interval);
  }, [text]);

  return <span className="font-mono text-[var(--accent)] drop-shadow-[0_0_8px_var(--accent)]">{displayedText}</span>;
};

// 2. Deep Work Mode Toggle (Focus)
export const DeepWorkMode = () => {
  const [active, setActive] = useState(false);
  
  useEffect(() => {
    if (active) {
      document.body.style.backgroundColor = '#000000';
      document.body.style.color = '#ffffff';
      // Mute all non-essential UI via a global class
      document.body.classList.add('deep-work-active');
    } else {
      document.body.style.backgroundColor = '';
      document.body.style.color = '';
      document.body.classList.remove('deep-work-active');
    }
  }, [active]);

  return (
    <div className={`p-8 rounded-2xl border transition-all duration-1000 ${active ? 'border-[var(--accent)] bg-black/90 scale-105' : 'border-white/10 glass'}`}>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-black uppercase tracking-widest font-mono">Deep Work Mode</h3>
        <button 
          onClick={() => setActive(!active)}
          className={`w-16 h-8 rounded-full p-1 transition-colors ${active ? 'bg-[var(--accent)]' : 'bg-white/20'}`}
        >
          <motion.div 
            className="w-6 h-6 bg-white rounded-full shadow-md"
            animate={{ x: active ? 32 : 0 }}
          />
        </button>
      </div>
      <p className="text-white/60 font-mono text-sm leading-relaxed mb-4">
        Увімкніть для блокування зайвих подразників. Частота 40Hz (Binaural Beats) активується. Зайвий UI приховано.
      </p>
      {active && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-1 bg-[var(--accent)] w-full overflow-hidden rounded-full">
          <motion.div 
            className="h-full bg-white/50 w-1/4"
            animate={{ x: ['-100%', '400%'] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
          />
        </motion.div>
      )}
    </div>
  );
};

// 3. Reverse Timer Task (Time Perception)
export const ReverseTimerTask = () => {
  const [ms, setMs] = useState(15000);
  
  useEffect(() => {
    if (ms <= 0) return;
    const interval = setInterval(() => setMs(m => m - 10), 10);
    return () => clearInterval(interval);
  }, [ms]);

  return (
    <div className="flex flex-col items-center justify-center p-12 glass rounded-3xl border border-[var(--accent)]/30">
      <h3 className="text-xl mb-4 text-[var(--text-secondary)] font-mono text-center">Швидкість реакції та рутини</h3>
      <div className="text-7xl sm:text-9xl font-black tabular-nums text-transparent bg-clip-text bg-gradient-to-b from-[var(--accent)] to-[var(--secondary)]">
        {(ms / 1000).toFixed(2)}s
      </div>
      <p className="mt-6 text-xl tracking-widest uppercase font-bold text-white/50">
        Заварюй пуер швидше, ніж згорає час.
      </p>
    </div>
  );
};

// 4. Parallax Tunnel (Immersion)
export const FocusTunnel = () => {
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 1], [1, 5]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.5, 0]);

  return (
    <div className="relative h-96 overflow-hidden rounded-3xl border border-white/10 flex items-center justify-center my-12 bg-black">
      <motion.div 
        style={{ scale, opacity }}
        className="absolute inset-0 border-[40px] border-[var(--accent)]/10 rounded-full"
      />
      <motion.div 
        style={{ scale: useTransform(scrollYProgress, [0, 1], [1, 3]) }}
        className="absolute inset-20 border-[20px] border-[var(--secondary)]/10 rounded-full"
      />
      <div className="relative z-10 text-center pointer-events-none">
        <h3 className="text-4xl font-black tracking-[0.5em] text-white mix-blend-difference">FOCUS</h3>
      </div>
    </div>
  );
};
