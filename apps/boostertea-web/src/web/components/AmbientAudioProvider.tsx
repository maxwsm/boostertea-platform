'use client';

import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

type AudioTrack = 'none' | 'zen' | 'lofi' | 'fireplace';

interface AudioContextType {
  currentTrack: AudioTrack;
  playTrack: (track: AudioTrack) => void;
  volume: number;
  setVolume: (val: number) => void;
}

const AudioContext = createContext<AudioContextType>({
  currentTrack: 'none',
  playTrack: () => {},
  volume: 0.5,
  setVolume: () => {},
});

export const useAmbientAudio = () => useContext(AudioContext);

export const AmbientAudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrackState] = useState<AudioTrack>('none');
  const [volume, setVolumeState] = useState<number>(0.5);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize from LocalStorage
  useEffect(() => {
    const savedTrack = localStorage.getItem('wsm_ambient_track') as AudioTrack;
    const savedVol = localStorage.getItem('wsm_ambient_vol');
    
    if (savedTrack) setCurrentTrackState(savedTrack);
    if (savedVol) setVolumeState(parseFloat(savedVol));

    // Create the global audio element once
    audioRef.current = new Audio();
    audioRef.current.loop = true;
  }, []);

  const getAudioSource = (track: AudioTrack) => {
    switch (track) {
      case 'zen': return '/audio/zen-loop.mp3';
      case 'lofi': return '/audio/lofi-cyberpunk.mp3';
      case 'fireplace': return '/audio/fireplace-crackling.mp3';
      default: return '';
    }
  };

  const playTrack = (track: AudioTrack) => {
    if (!audioRef.current) return;
    
    setCurrentTrackState(track);
    localStorage.setItem('wsm_ambient_track', track);

    if (track === 'none') {
      audioRef.current.pause();
      return;
    }

    const src = getAudioSource(track);
    if (audioRef.current.src !== window.location.origin + src) {
      audioRef.current.src = src;
    }
    
    audioRef.current.volume = volume;
    audioRef.current.play().catch(e => console.log('Autoplay blocked by browser:', e));
  };

  const setVolume = (val: number) => {
    setVolumeState(val);
    localStorage.setItem('wsm_ambient_vol', val.toString());
    if (audioRef.current) {
      audioRef.current.volume = val;
    }
  };

  // Sync volume if changed rapidly
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  return (
    <AudioContext.Provider value={{ currentTrack, playTrack, volume, setVolume }}>
      {children}
      {/* Mini Audio Controller UI mapped globally across the app */}
      <AudioControllerWidget />
    </AudioContext.Provider>
  );
};

const AudioControllerWidget = () => {
  const { currentTrack, playTrack, volume, setVolume } = useAmbientAudio();
  const [isOpen, setIsOpen] = useState(false);

  // Hide entirely if "none" and not open? No, let user open it to turn it ON.
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="mb-3 p-4 bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl text-white/90 text-sm shadow-2xl w-48 animate-fade-in-up">
          <p className="font-bold mb-3 uppercase tracking-wider text-xstext-white/50">Супровід (Ambient)</p>
          <div className="flex flex-col gap-2 mb-4">
            <button onClick={() => playTrack('zen')} className={`text-left px-2 py-1 rounded ${currentTrack === 'zen' ? 'bg-white/20' : 'hover:bg-white/10'}`}>🎋 Китайський Дзен</button>
            <button onClick={() => playTrack('lofi')} className={`text-left px-2 py-1 rounded ${currentTrack === 'lofi' ? 'bg-white/20' : 'hover:bg-white/10'}`}>🎧 Кіберпанк Focus</button>
            <button onClick={() => playTrack('fireplace')} className={`text-left px-2 py-1 rounded ${currentTrack === 'fireplace' ? 'bg-white/20' : 'hover:bg-white/10'}`}>🔥 Камін (Зима)</button>
            <button onClick={() => playTrack('none')} className={`text-left px-2 py-1 rounded text-red-400 ${currentTrack === 'none' ? 'bg-white/20' : 'hover:bg-white/10'}`}>⏹ Вимкнути</button>
          </div>
          <input 
            type="range" 
            min="0" max="1" step="0.05" 
            value={volume} 
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      )}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white text-xl hover:bg-white/20 transition-all"
        title="Audio Engine"
      >
        {currentTrack !== 'none' ? '🔊' : '🔇'}
      </button>
    </div>
  );
};
