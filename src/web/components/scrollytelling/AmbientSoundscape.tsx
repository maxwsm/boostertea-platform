'use client'

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SOUNDSCAPES = [
  { id: 'cafe', name: "Кав'ярня (FunnyDrops)", src: 'https://cdn.freesound.org/previews/233/233026_4019029-lq.mp3', icon: '☕' },
  { id: 'lab', name: 'Лабораторія (T-Lab)', src: 'https://cdn.freesound.org/previews/169/169985_2437358-lq.mp3', icon: '🔬' },
  { id: 'nature', name: 'Дзен (BoosterTea)', src: 'https://cdn.freesound.org/previews/175/175396_321967-lq.mp3', icon: '🍃' }
];

export const AmbientSoundscape = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.loop = true;
    }
    audioRef.current.volume = volume;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const toggleSound = (id: string, src: string) => {
    if (!audioRef.current) return;

    if (activeId === id) {
      // Pause
      audioRef.current.pause();
      setActiveId(null);
    } else {
      // Play new
      audioRef.current.src = src;
      audioRef.current.play().catch(e => console.error("Audio playback failed:", e));
      setActiveId(id);
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-50 flex items-end gap-4">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="glass rounded-2xl p-4 border border-[var(--accent)]/20 shadow-2xl flex flex-col gap-3 min-w-[220px]"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-widest">Ambient Vibe</span>
              {activeId && (
                <div className="flex gap-1 h-3 items-end">
                  {[1, 2, 3, 4].map(i => (
                    <motion.div
                      key={i}
                      className="w-1 bg-[var(--accent)] rounded-t-sm"
                      animate={{ height: ['20%', '100%', '40%', '80%', '20%'] }}
                      transition={{ duration: 1 + i * 0.2, repeat: Infinity, ease: 'linear' }}
                    />
                  ))}
                </div>
              )}
            </div>

            {SOUNDSCAPES.map(scape => (
              <button
                key={scape.id}
                onClick={() => toggleSound(scape.id, scape.src)}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all ${
                  activeId === scape.id 
                    ? 'bg-[var(--accent)]/20 text-white' 
                    : 'hover:bg-white/5 text-[var(--text-secondary)]'
                }`}
              >
                <span className="text-xl">{scape.icon}</span>
                <span className="text-sm font-medium">{scape.name}</span>
              </button>
            ))}

            <div className="mt-2 pt-3 border-t border-white/5 flex items-center gap-3">
              <span className="text-xs opacity-50">🔈</span>
              <input 
                type="range" 
                min="0" max="1" step="0.05"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-full h-1 bg-white/10 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-[var(--accent)] [&::-webkit-slider-thumb]:rounded-full cursor-pointer"
              />
              <span className="text-xs opacity-50">🔊</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-xl backdrop-blur-md ${
          activeId 
            ? 'bg-[var(--accent)] text-black animate-pulse-slow border border-transparent' 
            : 'bg-black/80 text-[var(--accent)] border border-[var(--accent)]/30 hover:bg-[var(--accent)]/10'
        }`}
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
        </svg>
      </button>
    </div>
  );
};
