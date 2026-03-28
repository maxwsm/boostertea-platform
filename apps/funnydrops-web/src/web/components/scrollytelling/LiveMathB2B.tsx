'use client'

"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface LiveMathB2BProps {
  initialValue: number;
  step: number;
  min: number;
  max: number;
  multiplier: number; // E.g., multiplier per cold cocktail
  textBefore: string;
  textAfter: string;
}

export const LiveMathB2B: React.FC<LiveMathB2BProps> = ({ 
  initialValue = 50, 
  step = 10, 
  min = 10, 
  max = 500,
  multiplier = 500, // 500 UAH lost per cocktail per year
  textBefore = "Якщо ваш заклад продає",
  textAfter = "холодних коктейлів на день, ви втрачаєте"
}) => {
  const [value, setValue] = useState(initialValue);

  // Dynamic graph data generated based on the Slider value
  const data = Array.from({ length: 6 }).map((_, i) => ({
    month: `Місяць ${i + 1}`,
    втрати: (value * multiplier * (i + 1)) / 12,
    економія: (value * multiplier * (i + 1)) / 12 * 0.8 // 80% saved with the product
  }));

  const totalLoss = (value * multiplier).toLocaleString('uk-UA');

  return (
    <div className="my-16 p-8 glass rounded-2xl border border-[var(--accent)]/30 shadow-[0_0_40px_rgba(var(--accent-rgb),0.1)]">
      <div className="text-2xl md:text-3xl font-bold leading-relaxed mb-12">
        <span className="text-[var(--text-secondary)]">{textBefore}</span>
        
        {/* The Live Mutating Number Input */}
        <span className="mx-4 relative inline-block">
          <input 
            type="number"
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
            className="w-24 bg-transparent border-b-2 border-[var(--accent)] text-[var(--accent)] font-mono text-center focus:outline-none focus:border-white transition-colors"
            min={min}
            max={max}
            step={step}
          />
          <motion.p 
            className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-[var(--accent)] whitespace-nowrap opacity-50 font-mono"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            &#8597; Змініть цифру
          </motion.p>
        </span>
        
        <span className="text-[var(--text-secondary)]">{textAfter}</span>
        
        <motion.span 
          key={value}
          initial={{ scale: 1.2, color: '#ff0055' }}
          animate={{ scale: 1, color: '#ff0033' }}
          className="mx-4 font-mono underline decoration-wavy decoration-[#ff0033]/50 inline-block text-4xl"
        >
          {totalLoss}
        </motion.span>
        
        <span className="text-[var(--text-secondary)]">грн на рік.</span>
      </div>

      {/* Dynamic Graph updating instantly */}
      <div className="h-80 w-full mt-8">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorLoss" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ff0033" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#ff0033" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorSave" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="var(--accent)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="month" stroke="var(--text-muted)" />
            <YAxis stroke="var(--text-muted)" />
            <Tooltip 
              contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', borderColor: 'var(--border)' }}
              itemStyle={{ color: 'var(--text-primary)' }}
            />
            <Area type="monotone" dataKey="втрати" stroke="#ff0033" fillOpacity={1} fill="url(#colorLoss)" />
            <Area type="monotone" dataKey="економія" stroke="var(--accent)" fillOpacity={1} fill="url(#colorSave)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <p className="text-center text-sm text-[var(--text-muted)] mt-4 font-mono uppercase tracking-widest">
        * Графік калькулюється в реальному часі
      </p>
    </div>
  );
};
