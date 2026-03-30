import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface MeadowProps {
    onRewind: () => void;
}

export function MeadowScene({ onRewind }: MeadowProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isRewinding, setIsRewinding] = useState(false);
    const timeRef = useRef(0);
    const [isDark, setIsDark] = useState(true);

    useEffect(() => {
        const obs = new MutationObserver(() => setIsDark(document.documentElement.classList.contains("dark")));
        obs.observe(document.documentElement, { attributes: true });
        setIsDark(document.documentElement.classList.contains("dark"));
        return () => obs.disconnect();
    }, []);
    
    // Synth audio for rewind and ambient
    const playAudio = (type: 'ambient' | 'rewind') => {
        const Ctx = window.AudioContext || (window as any).webkitAudioContext;
        if (!Ctx) return;
        const audioCtx = new Ctx();
        
        if (type === 'ambient') {
            // Low drone hum (Earthly campfire vibes)
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.frequency.value = 55; // Low A
            osc.type = 'sine';
            gain.gain.setValueAtTime(0, audioCtx.currentTime);
            gain.gain.linearRampToValueAtTime(0.1, audioCtx.currentTime + 2);
            osc.start();
        } else if (type === 'rewind') {
            // VHS rewind tear
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.frequency.setValueAtTime(200, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.5);
            osc.type = 'sawtooth';
            gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.5);
        }
    };

    useEffect(() => {
        playAudio('ambient');
    }, []);

    const handleRewind = () => {
        playAudio('rewind');
        setIsRewinding(true);
        setTimeout(() => {
            onRewind();
        }, 500); // 0.5s glitch transition
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`fixed inset-0 z-[100] ${isDark ? 'bg-[#020205]' : 'bg-gray-900'} overflow-hidden ${isRewinding ? 'animate-glitch-tear' : ''}`}
        >
            <div className="absolute inset-0 w-full h-full mix-blend-screen pointer-events-none" />

            {/* THE ONLY FULL-COLOR OBJECT: 8K MATERIALIZATION SPHERE */}
            <div className="absolute top-[10%] drop-shadow-2xl left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none">
                <motion.div 
                    initial={{ scale: 0, filter: 'blur(20px)' }}
                    animate={{ scale: 1, filter: 'blur(0px)' }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="relative w-48 h-48 md:w-80 md:h-80"
                >
                    <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_30%,_rgba(255,255,255,1),_rgba(255,0,200,0.8)_20%,_rgba(0,255,204,0.6)_50%,_rgba(0,0,0,1)_90%)] shadow-[0_0_120px_rgba(255,0,200,0.5),_inset_0_0_60px_rgba(255,255,255,0.6)] animate-spin-slow"></div>
                </motion.div>
                
                <motion.h1 
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="mt-8 text-6xl md:text-8xl font-sans font-black text-transparent bg-clip-text bg-gradient-to-br from-[#00ffcc] to-[#ff00ff] tracking-tight drop-shadow-[0_0_20px_rgba(0,255,204,0.6)] uppercase"
                >
                    COMING SOON
                </motion.h1>
            </div>

            {/* DAO RECRUITMENT TEXT & TG CTA */}
            <motion.div 
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1, duration: 0.8 }}
                className="absolute bottom-28 left-1/2 -translate-x-1/2 flex flex-col items-center text-center w-[90%] lg:w-[600px] pointer-events-auto"
            >
                <div className="border border-white/10 bg-black/50 backdrop-blur-xl p-8 rounded-3xl flex flex-col items-center text-center shadow-[0_0_40px_rgba(0,255,204,0.15)] w-full">
                    <p className="font-mono text-sm md:text-md mb-8 uppercase tracking-widest leading-relaxed text-[#00ffcc]">
                        Якщо хочеш стати частиною ДАО, заходь в ТГ, знайомся з правилами і будемо знайомитись.
                    </p>
                    <a 
                        href="https://t.me/neuralnomad_13wsm13"
                        target="_blank"
                        rel="noreferrer"
                        className="group relative px-10 py-4 font-mono font-bold text-lg overflow-hidden flex items-center justify-center border border-[#ff00ff]/50 bg-black text-[#ff00ff] transition-all hover:bg-[#ff00ff] hover:text-white shadow-[0_0_20px_rgba(255,0,255,0.3)] hover:shadow-[0_0_40px_rgba(255,0,255,0.8)] rounded-xl w-full"
                    >
                        <span className="relative z-10 tracking-[0.2em] uppercase">[ TELEGRAM DAO ]</span>
                    </a>
                </div>
            </motion.div>

            {/* FAST REWIND BUTTON TO RETURN TO FLOW */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 1 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-auto"
            >
                <button 
                    onClick={handleRewind}
                    className="px-6 py-2 border border-white/20 bg-black/40 backdrop-blur-md rounded-full font-mono uppercase tracking-widest text-xs text-white/50 hover:text-white hover:border-white/60 hover:bg-white/10 transition-all"
                >
                    &lt;&lt; РЕВЕРС ДО ЯДРА (ФОРТ)
                </button>
            </motion.div>

            <style>{`
                .animate-spin-slow {
                    animation: spinBlob 15s linear infinite;
                }
                @keyframes spinBlob {
                    0% { transform: rotate(0deg) scale(1); filter: hue-rotate(0deg); }
                    50% { transform: rotate(180deg) scale(1.05); filter: hue-rotate(45deg); }
                    100% { transform: rotate(360deg) scale(1); filter: hue-rotate(0deg); }
                }
                .animate-glitch-tear {
                    animation: glitchTear 0.5s linear forwards;
                }
                @keyframes glitchTear {
                    0% { filter: hue-rotate(0deg) blur(0px) contrast(1); transform: scale(1) translateX(0); }
                    25% { filter: hue-rotate(90deg) blur(5px) contrast(2); transform: scale(1.05) translateX(10px); }
                    50% { filter: hue-rotate(-90deg) blur(10px) contrast(3); transform: scale(1.1) translateX(-20px) skewX(10deg); }
                    100% { filter: hue-rotate(180deg) blur(50px) contrast(0); transform: scale(1.5) translateX(50px) opacity(0); }
                }
            `}</style>
        </motion.div>
    );
}
