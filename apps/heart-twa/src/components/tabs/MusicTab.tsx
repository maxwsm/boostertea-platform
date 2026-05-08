"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, Pause, Waves, Wind, Zap } from "lucide-react";

type AudioState = {
  name: string;
  frequency: number;
  lfoRate: number; // Base rate
  color: string;
  icon: any;
  desc: string;
};

const THERAPY_STATES: AudioState[] = [
  { name: "Робочий Фокус", frequency: 432, lfoRate: 4, color: "text-sage bg-sage/20", icon: Zap, desc: "Гармонія 432Hz + Бета-ритм (Концентрація)" },
  { name: "Звільнення від Страху", frequency: 396, lfoRate: 1, color: "text-amber bg-amber/20", icon: Wind, desc: "Solfeggio 396Hz + Дельта-ритм (Глибокий спокій)" },
  { name: "Регенерація", frequency: 528, lfoRate: 2, color: "text-ocean bg-ocean/20", icon: Waves, desc: "Miracle 528Hz + Тета-ритм (Відновлення)" }
];

// Helper to create Pink or Brown noise
function createNoiseBuffer(ctx: AudioContext, type: 'pink' | 'brown'): AudioBuffer {
  const bufferSize = 2 * ctx.sampleRate; // 2 seconds
  const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const output = noiseBuffer.getChannelData(0);
  
  let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
  let lastOut = 0;

  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;
    if (type === 'pink') {
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      output[i] *= 0.11; // compensate gain
      b6 = white * 0.115926;
    } else {
      // Brown noise
      output[i] = (lastOut + (0.02 * white)) / 1.02;
      lastOut = output[i];
      output[i] *= 3.5; // compensate gain
    }
  }
  return noiseBuffer;
}

export function MusicTab({ isAdhdMode }: { isAdhdMode: boolean }) {
  const [activeStateIdx, setActiveStateIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isNightMode, setIsNightMode] = useState(false);
  
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const lfoRef = useRef<OscillatorNode | null>(null);
  const noiseNodeRef = useRef<AudioBufferSourceNode | null>(null);
  
  // Mixers and Filters
  const filterRef = useRef<BiquadFilterNode | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const noiseGainRef = useRef<GainNode | null>(null);
  const noiseFilterRef = useRef<BiquadFilterNode | null>(null);
  const reverbInputRef = useRef<GainNode | null>(null);
  
  const arpeggioIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Check geo/time on mount
  useEffect(() => {
    const hour = new Date().getHours();
    setIsNightMode(hour >= 18 || hour <= 6);
  }, []);

  useEffect(() => {
    return () => {
      if (arpeggioIntervalRef.current) clearInterval(arpeggioIntervalRef.current);
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
         if (masterGainRef.current) {
            // Quick fade out before closing to avoid popping
            masterGainRef.current.gain.setTargetAtTime(0, audioCtxRef.current.currentTime, 0.1);
         }
         setTimeout(() => {
           if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
              audioCtxRef.current.close().catch(console.error);
           }
         }, 150);
      }
    };
  }, []);

  const playPentatonicNote = () => {
    if (!audioCtxRef.current || !isPlaying || !reverbInputRef.current) return;
    
    const ctx = audioCtxRef.current;
    const baseFreq = THERAPY_STATES[activeStateIdx].frequency;
    const pentatonicRatios = [1, 9/8, 5/4, 3/2, 5/3]; // Major pentatonic
    const octave = Math.random() > 0.5 ? 2 : 1;
    const ratio = pentatonicRatios[Math.floor(Math.random() * pentatonicRatios.length)];
    const freq = baseFreq * ratio * octave;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    // Triangle gives a warmer, bell-like tone compared to pure sine
    osc.type = 'triangle';
    osc.frequency.value = freq;
    
    osc.connect(gain);
    // Send to reverb for massive space
    gain.connect(reverbInputRef.current);
    if (filterRef.current) gain.connect(filterRef.current);

    const now = ctx.currentTime;
    gain.gain.setValueAtTime(0, now);
    
    // Smooth ADSR Envelope
    gain.gain.linearRampToValueAtTime(0.02, now + 1.5); // Attack
    gain.gain.exponentialRampToValueAtTime(0.001, now + 7); // Long Release

    osc.start(now);
    osc.stop(now + 7);
  };

  const toggleAudio = () => {
    if (isPlaying) {
      if (masterGainRef.current && audioCtxRef.current) {
        masterGainRef.current.gain.setTargetAtTime(0, audioCtxRef.current.currentTime, 0.5);
        if (arpeggioIntervalRef.current) clearInterval(arpeggioIntervalRef.current);
        setTimeout(() => {
          audioCtxRef.current?.suspend();
          setIsPlaying(false);
        }, 500);
      }
    } else {
      if (!audioCtxRef.current) {
        if (typeof window === 'undefined') return;
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContextClass) return;
        const ctx = new AudioContextClass();
        audioCtxRef.current = ctx;
        
        // Nodes
        const osc = ctx.createOscillator();
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        const noiseGain = ctx.createGain();
        const noiseFilter = ctx.createBiquadFilter();
        const masterGain = ctx.createGain();
        const filter = ctx.createBiquadFilter();
        const reverbIn = ctx.createGain();
        
        // Massive Algorithmic Reverb (Cathedral Effect)
        const delay1 = ctx.createDelay(5.0);
        const delay2 = ctx.createDelay(5.0);
        const fbGain1 = ctx.createGain();
        const fbGain2 = ctx.createGain();
        const dampFilter = ctx.createBiquadFilter();
        
        delay1.delayTime.value = 0.43; // 430ms
        delay2.delayTime.value = 0.57; // 570ms
        fbGain1.gain.value = 0.5; // 50% feedback
        fbGain2.gain.value = 0.4;
        dampFilter.type = 'lowpass';
        dampFilter.frequency.value = 1500;
        
        // Reverb Routing Loop
        reverbIn.connect(delay1);
        reverbIn.connect(delay2);
        delay1.connect(dampFilter);
        delay2.connect(dampFilter);
        dampFilter.connect(fbGain1);
        dampFilter.connect(fbGain2);
        fbGain1.connect(delay2);
        fbGain2.connect(delay1);
        
        // Reverb Output to master
        delay1.connect(masterGain);
        delay2.connect(masterGain);
        reverbIn.connect(masterGain); // dry signal

        // Main Filters
        filter.type = 'lowpass';
        filter.frequency.value = isNightMode ? 800 : 2500; // Softer high end
        
        // Noise Filter (Ocean-like smoothing)
        noiseFilter.type = 'lowpass';
        noiseFilter.frequency.value = isAdhdMode ? 400 : 800; // Brown noise needs deeper cut

        // Base Osc
        osc.type = 'triangle'; // Warmer base tone
        osc.frequency.value = THERAPY_STATES[activeStateIdx].frequency;

        // LFO
        lfo.type = 'sine';
        lfo.frequency.value = isAdhdMode ? THERAPY_STATES[activeStateIdx].lfoRate * 1.5 : THERAPY_STATES[activeStateIdx].lfoRate;
        
        // Noise Node
        const noiseBuffer = createNoiseBuffer(ctx, isAdhdMode ? 'brown' : 'pink');
        const noiseNode = ctx.createBufferSource();
        noiseNode.buffer = noiseBuffer;
        noiseNode.loop = true;
        
        noiseNode.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.gain.value = isAdhdMode ? 0.4 : 0.2;

        // Routing
        lfo.connect(lfoGain);
        lfoGain.connect(masterGain.gain); // Amplitude modulation
        
        osc.connect(filter);
        noiseGain.connect(filter);
        filter.connect(reverbIn); // Send base and noise through reverb
        masterGain.connect(ctx.destination);

        masterGain.gain.value = 0;
        lfoGain.gain.value = 0.5;

        osc.start();
        lfo.start();
        noiseNode.start();

        oscRef.current = osc;
        lfoRef.current = lfo;
        noiseNodeRef.current = noiseNode;
        filterRef.current = filter;
        masterGainRef.current = masterGain;
        noiseGainRef.current = noiseGain;
        noiseFilterRef.current = noiseFilter;
        reverbInputRef.current = reverbIn;
      } else {
        if (oscRef.current) oscRef.current.frequency.value = THERAPY_STATES[activeStateIdx].frequency;
        if (lfoRef.current) lfoRef.current.frequency.value = isAdhdMode ? THERAPY_STATES[activeStateIdx].lfoRate * 1.5 : THERAPY_STATES[activeStateIdx].lfoRate;
      }
      
      audioCtxRef.current.resume();
      masterGainRef.current?.gain.setTargetAtTime(0.5, audioCtxRef.current.currentTime, 2); // 2 second fade in
      setIsPlaying(true);
      
      // Start Pentatonic Arpeggiator (fires note every 3-8 seconds)
      const fireArp = () => {
        playPentatonicNote();
        arpeggioIntervalRef.current = setTimeout(fireArp, 3000 + Math.random() * 5000);
      };
      fireArp();
    }
  };

  // Switch state while playing
  useEffect(() => {
    if (oscRef.current && lfoRef.current && audioCtxRef.current) {
      const state = THERAPY_STATES[activeStateIdx];
      oscRef.current.frequency.setTargetAtTime(state.frequency, audioCtxRef.current.currentTime, 0.5);
      lfoRef.current.frequency.setTargetAtTime(isAdhdMode ? state.lfoRate * 1.5 : state.lfoRate, audioCtxRef.current.currentTime, 0.5);
    }
  }, [activeStateIdx, isAdhdMode]);

  // Handle ADHD Mode switch specifically for Noise Buffer & Filters
  useEffect(() => {
    if (audioCtxRef.current && noiseNodeRef.current && noiseGainRef.current && noiseFilterRef.current) {
      const ctx = audioCtxRef.current;
      // Fade out old noise
      noiseGainRef.current.gain.setTargetAtTime(0, ctx.currentTime, 0.5);
      
      setTimeout(() => {
        if (noiseNodeRef.current) noiseNodeRef.current.stop();
        // Create new noise
        const newNoise = ctx.createBufferSource();
        newNoise.buffer = createNoiseBuffer(ctx, isAdhdMode ? 'brown' : 'pink');
        newNoise.loop = true;
        newNoise.connect(noiseFilterRef.current!);
        newNoise.start();
        noiseNodeRef.current = newNoise;
        
        // Adjust filter for noise
        noiseFilterRef.current!.frequency.setTargetAtTime(isAdhdMode ? 400 : 800, ctx.currentTime, 0.5);
        
        // Fade in new noise
        noiseGainRef.current!.gain.setTargetAtTime(isAdhdMode ? 0.4 : 0.2, ctx.currentTime, 0.5);
      }, 600);
    }
  }, [isAdhdMode]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 pb-32">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-2 mb-12"
      >
        <h1 className="text-3xl font-sans font-light tracking-tight text-oatmeal">Музика для Мозку</h1>
        <p className="text-oatmeal/50 font-mono text-xs uppercase tracking-widest">[ Просторовий Нейро-Движок ]</p>
        {isNightMode && <p className="text-ocean/80 font-mono text-[10px] uppercase">Увімкнено нічний Low-Pass фільтр</p>}
      </motion.div>

      {/* Selectors with Glassmorphism */}
      <div className="w-full max-w-sm space-y-4 mb-12">
        {THERAPY_STATES.map((state, idx) => {
          const Icon = state.icon;
          const isActive = idx === activeStateIdx;
          return (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              key={idx}
              onClick={() => setActiveStateIdx(idx)}
              className={`relative w-full flex items-center p-4 rounded-[24px] border overflow-hidden transition-all duration-500 ${isActive ? 'bg-oatmeal/10 border-oatmeal/30 shadow-[0_10px_30px_rgba(0,0,0,0.3)] backdrop-blur-xl' : 'bg-oatmeal/5 border-oatmeal/10 hover:bg-oatmeal/10 backdrop-blur-md'}`}
            >
              {isActive && (
                <motion.div 
                  layoutId="activeGlow"
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-oatmeal/5 to-transparent z-0" 
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                />
              )}
              <div className={`w-12 h-12 rounded-[16px] flex items-center justify-center mr-4 z-10 transition-colors duration-500 ${isActive ? state.color : 'bg-graphite text-oatmeal/40'}`}>
                <Icon size={20} />
              </div>
              <div className="text-left flex-1 z-10">
                <p className={`font-sans text-lg transition-colors duration-500 ${isActive ? 'text-oatmeal font-medium' : 'text-oatmeal/60'}`}>{state.name}</p>
                <p className={`text-xs font-mono mt-1 transition-colors duration-500 ${isActive ? 'text-oatmeal/80' : 'text-oatmeal/40'}`}>{state.desc}</p>
              </div>
            </motion.button>
          )
        })}
      </div>

      {/* Player Controls */}
      <div className="relative">
        <motion.button
          onClick={toggleAudio}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          animate={{
            boxShadow: isPlaying 
              ? ["0px 0px 0px rgba(247,245,240,0)", "0px 0px 80px rgba(247,245,240,0.15)", "0px 0px 0px rgba(247,245,240,0)"]
              : "0px 10px 40px rgba(0,0,0,0.2)"
          }}
          transition={{ repeat: isPlaying ? Infinity : 0, duration: 4, ease: "easeInOut" }}
          className={`w-28 h-28 rounded-full border flex items-center justify-center z-10 relative backdrop-blur-xl transition-colors duration-700 ${isAdhdMode ? 'bg-amber/10 border-amber/50 text-amber' : 'bg-oatmeal/10 border-oatmeal/30 text-oatmeal shadow-inner'}`}
        >
          {isPlaying ? <Pause size={36} /> : <Play size={36} className="ml-2" />}
        </motion.button>
        
        {isPlaying && (
          <motion.div
            className={`absolute inset-0 rounded-full border ${isAdhdMode ? 'border-amber/40' : 'border-oatmeal/20'}`}
            animate={{ scale: [1, 2.5], opacity: [0.6, 0] }}
            transition={{ repeat: Infinity, duration: (isAdhdMode ? THERAPY_STATES[activeStateIdx].lfoRate * 1.5 : THERAPY_STATES[activeStateIdx].lfoRate) > 2 ? 1.5 : 3, ease: "easeOut" }}
          />
        )}
      </div>
      
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mt-12 text-[10px] text-oatmeal/30 font-mono tracking-widest uppercase"
      >
        {isPlaying ? `Синтез: ${THERAPY_STATES[activeStateIdx].frequency} Hz | Простір: Собор | Фільтр: ${isAdhdMode ? 'Brown' : 'Pink'}` : 'Очікування активації простору'}
      </motion.p>
    </div>
  );
}
