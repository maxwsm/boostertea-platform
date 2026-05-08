"use client";

import { motion } from "framer-motion";
import { Play, Pause, Waves } from "lucide-react";
import { useState } from "react";

interface AudioPillProps {
  frequency: number;
  description: string;
}

export function AudioPill({ frequency, description }: AudioPillProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <motion.div 
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center bg-graphite/80 backdrop-blur-xl border-none shadow-[0_8px_32px_rgba(0,0,0,0.3)] px-4 py-3 rounded-[32px] w-[90%] max-w-[320px]"
    >
      <button 
        onClick={() => setIsPlaying(!isPlaying)}
        className="w-12 h-12 flex items-center justify-center rounded-full bg-oatmeal/10 hover:bg-oatmeal/20 transition-colors text-oatmeal shrink-0"
      >
        {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
      </button>

      <div className="flex-1 ml-4 flex flex-col justify-center">
        <div className="flex items-center gap-2">
          <span className="text-oatmeal font-medium text-lg tracking-tight">{frequency} Hz</span>
          {isPlaying && (
            <motion.div 
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <Waves size={16} className="text-sage" />
            </motion.div>
          )}
        </div>
        <span className="text-oatmeal/50 text-sm">{description}</span>
      </div>
    </motion.div>
  );
}
