import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Icons for UI
const Volume2 = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5 10.5a.5.5 0 00-.5.5v2a.5.5 0 00.5.5h3.5l4.5 4.5v-12l-4.5 4.5H5z" /></svg>;
const VolumeX = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" /></svg>;

export const ScrollytellingWrapper = ({ 
  children, 
  ambientSoundUrl = '', 
  vibeTone = "dark" 
}: { 
  children: React.ReactNode, 
  ambientSoundUrl?: string,
  vibeTone?: "dark" | "neon" | "bubblegum" 
}) => {
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [isReadingComplete, setIsReadingComplete] = useState(false);
  const [countdown, setCountdown] = useState(5);

  // Sound Management (Conceptual for now as Next.js lacks direct Audio without user interaction)
  useEffect(() => {
    // let audio: HTMLAudioElement;
    if (soundEnabled && ambientSoundUrl) {
      // audio = new Audio(ambientSoundUrl);
      // audio.loop = true;
      // audio.play().catch(e => console.log('Audio autoplay blocked'));
    }
    return () => {
      // if (audio) audio.pause();
    };
  }, [soundEnabled, ambientSoundUrl]);

  // Read Progress logic for Binge-Reading Feature
  useEffect(() => {
    const handleScroll = () => {
      // If user reaches almost the bottom
      const isBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 200;
      if (isBottom && !isReadingComplete) {
        setIsReadingComplete(true);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isReadingComplete]);

  // Binge reading countdown
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isReadingComplete && countdown > 0) {
      timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    }
    if (countdown === 0) {
      // Simulate navigate to next
      console.log('Navigating to next article...');
    }
    return () => clearTimeout(timer);
  }, [isReadingComplete, countdown]);

  return (
    <div className={`relative min-h-screen bg-[var(--bg-primary)] overflow-x-hidden ${soundEnabled ? 'vibe-enabled' : ''}`}>
      
      {/* Absolute Header overlay for Vibe Control */}
      <div className="fixed top-24 right-6 z-50">
        <button 
          onClick={() => setSoundEnabled(!soundEnabled)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all glass ${soundEnabled ? 'border-[var(--accent)] text-[var(--accent)]' : 'border-white/20 text-white/50'}`}
        >
          {soundEnabled ? <Volume2 /> : <VolumeX />}
          <span className="text-xs font-mono uppercase tracking-widest hidden sm:inline">
            {soundEnabled ? 'Вайб увімкнено' : 'Увімкнути вайб'}
          </span>
        </button>
      </div>

      {children}

      {/* Binge-Reading Overlay */}
      <AnimatePresence>
        {isReadingComplete && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-8 backdrop-blur-md"
          >
            <h2 className="text-4xl md:text-6xl font-black text-white mb-8">Наступна доза контенту</h2>
            
            <div className="relative w-48 h-48 flex items-center justify-center mb-12">
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle cx="50%" cy="50%" r="48%" stroke="rgba(255,255,255,0.1)" strokeWidth="4" fill="none" />
                <motion.circle 
                  cx="50%" cy="50%" r="48%" 
                  stroke="var(--accent)" 
                  strokeWidth="4" 
                  strokeLinecap="round" 
                  fill="none"
                  initial={{ pathLength: 1 }}
                  animate={{ pathLength: countdown / 5 }}
                  transition={{ duration: 1, ease: "linear" }}
                  strokeDasharray="100 100"
                />
              </svg>
              <span className="text-6xl font-mono font-black text-[var(--accent)]">{countdown}</span>
            </div>

            <button 
              onClick={() => setIsReadingComplete(false)}
              className="px-8 py-3 rounded border border-white/20 text-white/50 hover:bg-white hover:text-black transition-all hover:scale-105 uppercase tracking-widest font-bold"
            >
              Залишитися тут
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
