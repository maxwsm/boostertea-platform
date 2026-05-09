import React, { useEffect, useState } from "react";
import { motion, animate } from "framer-motion";
import { PlayerState, calculateCurrentNetworth } from "@/data/game-simulator/rules";
import { DollarSign, Heart, Shield } from "lucide-react";

interface Props {
  player: PlayerState;
  isNeuroMode: boolean;
}

// Animated counter for numbers
const AnimatedNumber: React.FC<{ value: number; prefix?: string }> = ({ value, prefix = "" }) => {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    const controls = animate(displayValue, value, {
      duration: 0.8,
      ease: "easeOut",
      onUpdate: (v) => setDisplayValue(Math.round(v))
    });
    return controls.stop;
  }, [value]);

  return <span>{prefix}{displayValue}</span>;
};

export const HUD: React.FC<Props> = ({ player, isNeuroMode }) => {
  const mental = player.banks.MENTAL.balance;
  const cash = player.banks.FINANCIAL.balance;
  const social = player.banks.SOCIAL.balance;

  const mentalColor = mental > 60 ? "#00FF88" : mental > 30 ? "#FF9500" : "#FF4444";

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-3 gap-2 mb-6 sticky top-0 z-50 pt-2 pb-4 bg-[#0D0F12]/80 backdrop-blur-xl border-b border-white/5"
    >
      <div className="p-3 rounded-xl bg-white/5 border border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)] backdrop-blur-md">
        <div className="text-[9px] text-white/40 uppercase font-mono flex items-center gap-1">
          <DollarSign size={10}/> Фінанси
        </div>
        <div className="text-lg font-black mt-1">
          <AnimatedNumber value={cash} prefix="$" />
        </div>
      </div>

      <div className="p-3 rounded-xl bg-white/5 border border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)] backdrop-blur-md">
        <div className="text-[9px] text-white/40 uppercase font-mono flex items-center gap-1">
          <Heart size={10} style={{ color: mentalColor }} className="transition-colors duration-500"/> Менталка
        </div>
        <div className="w-full bg-black/40 rounded-full h-1.5 mt-2 overflow-hidden">
          <motion.div 
            className="h-full rounded-full" 
            animate={{ width: `${mental}%`, backgroundColor: mentalColor }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
        <div className="text-[10px] mt-1 font-mono transition-colors duration-500" style={{ color: mentalColor }}>
          <AnimatedNumber value={mental} />%
        </div>
      </div>

      <div className="p-3 rounded-xl bg-white/5 border border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)] backdrop-blur-md">
        <div className="text-[9px] text-white/40 uppercase font-mono flex items-center gap-1">
          <Shield size={10} className="text-blue-400"/> Соціальний
        </div>
        <div className="text-lg font-black mt-1">
          <AnimatedNumber value={social} />
        </div>
      </div>
    </motion.div>
  );
};
