import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface GatekeeperProps {
  onAccept: () => void;
}

export default function Gatekeeper({ onAccept }: GatekeeperProps) {
  const [isAccepted, setIsAccepted] = useState(false);
  const [subBassPlayed, setSubBassPlayed] = useState(false);

  // Play a deep sub-bass generator when the page opens
  useEffect(() => {
    if (subBassPlayed) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(45, audioCtx.currentTime); // 45Hz Deep Bass
      osc.frequency.exponentialRampToValueAtTime(20, audioCtx.currentTime + 3);
      
      gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.3, audioCtx.currentTime + 0.5);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 3);

      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 3);
      
      setSubBassPlayed(true);
    } catch (e) {
      console.log("AudioContext blocked by auto-play policy until interaction");
    }
  }, [subBassPlayed]);

  const handleAgreed = () => {
    // Play heavy mechanical impact sound and vibrate
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(100, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(20, audioCtx.currentTime + 0.2);
      gainNode.gain.setValueAtTime(0.8, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.2);

      if (navigator.vibrate) {
        navigator.vibrate(50); // Hard Haptic Feedback
      }
    } catch (e) {
      // Ignore audio failure
    }

    setIsAccepted(true);
    setTimeout(() => {
      onAccept();
    }, 100); // 0.1s delay to let the click sound play before shattering
  };

  return (
    <AnimatePresence>
      {!isAccepted && (
        <motion.div 
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }} // Jump-Cut out styling
          transition={{ duration: 0.1 }}
          className="fixed inset-0 z-[9999] bg-[#020202] text-white flex flex-col items-center justify-center p-6 md:p-12"
          style={{ fontFamily: "'Courier New', Courier, monospace" }}
        >
          {/* Static Noise Overlay */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-5 mix-blend-screen"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }}
          />

          <div className="max-w-2xl w-full text-left space-y-8 relative z-10">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tighter text-red-600 mb-8 uppercase">
              ATTENTION.
            </h1>
            
            <div className="space-y-4 text-xs md:text-sm tracking-widest text-neutral-400">
              <p>THIS PROJECT IS A MULTILINGUAL AND MULTI-CONTINENTAL ECOSYSTEM.</p>
              <p>OUR TEAM UNITES SPECIALISTS FROM DIFFERENT COUNTRIES AND BACKGROUNDS.</p>
              <p className="text-white bg-red-900/40 p-2 inline-block font-bold">
                HOWEVER, WE CATEGORICALLY REFUSE ANY COOPERATION WITH RUSSIA OR ITS CITIZENS.
              </p>
              <p>RUSSIA IS A TERRORIST STATE. BY PROCEEDING FURTHER, YOU AUTOMATICALLY SIGN AND AGREE THAT RUSSIA IS A TERRORIST ENTITY AND A ROT ON THIS PLANET.</p>
              <p>IF YOU DO NOT AGREE, CLOSE THIS TAB IMMEDIATELY. THERE IS NOTHING FOR YOU HERE.</p>
            </div>

            <div className="pt-12">
              <button 
                onClick={handleAgreed}
                className="group relative px-8 py-4 bg-transparent border border-neutral-700 hover:border-red-600 transition-colors w-full md:w-auto overflow-hidden cursor-none"
              >
                {/* Glitch Hover Effect */}
                <span className="absolute inset-0 bg-red-600 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-200 ease-out" />
                <span className="relative z-10 font-bold tracking-[0.2em] text-sm group-hover:text-black transition-colors duration-200">
                  [ I AGREE WITH THIS. INITIALIZE SYSTEM. ]
                </span>
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
