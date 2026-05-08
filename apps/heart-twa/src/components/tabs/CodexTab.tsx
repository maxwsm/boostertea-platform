"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Sliders, ChevronDown, ChevronUp } from "lucide-react";

const SHADOWS_DB = [
  {
    id: "escapist",
    name: "Ескапіст (Втеча)",
    phrases: ["Я зроблю це завтра", "Мені треба просто відпочити", "Це зараз не на часі"],
    somatics: "Напруга в ногах (бажання втекти), поверхневе дихання, розфокусований погляд.",
    resolution: "Заземлення. Техніка 5-4-3-2-1. Прямий контакт з реальністю (холодний душ)."
  },
  {
    id: "perfectionist",
    name: "Перфекціоніст (Гіперконтроль)",
    phrases: ["Якщо робити, то ідеально", "Я повинен все перевірити", "Вони не впораються без мене"],
    somatics: "Затиснута щелепа, напруга в плечах та шиї, стиснутий живіт.",
    resolution: "Вагусне дихання. Делегування 1 мікро-задачі. Дозвіл на 'достатньо добре'."
  },
  {
    id: "victim",
    name: "Жертва (Безсилість)",
    phrases: ["Чому це завжди зі мною?", "У мене немає вибору", "Це все через них"],
    somatics: "Опущені плечі (колапс грудної клітини), тихий голос, брак енергії в тазі.",
    resolution: "Випрямлення постави. Визначення 1 речі, яку можна проконтролювати просто зараз."
  }
];

export function CodexTab({ isAdhdMode }: { isAdhdMode: boolean }) {
  const [expandedShadow, setExpandedShadow] = useState<string | null>(null);
  
  // Human Design Simulator State
  const [sacralEnergy, setSacralEnergy] = useState<number>(30);
  const [emotionalWave, setEmotionalWave] = useState<number>(70);

  // Reality Modeling
  const realityState = sacralEnergy > 50 && emotionalWave > 40 && emotionalWave < 80
    ? { title: "Задоволення (Профіцит)", desc: "Енергія тече вільно. Використовується для створення, а не для подолання опору.", color: "text-sage" }
    : sacralEnergy <= 50 
      ? { title: "Фрустрація (Дефіцит)", desc: "Спроба ініціювати без відгуку. Виснаження нервової системи.", color: "text-red-400" }
      : { title: "Емоційний Шторм", desc: "Прийняття рішень на піку/спаді хвилі. Потенціал для конфлікту.", color: "text-amber" };

  return (
    <div className="w-full min-h-full flex flex-col items-center p-6 bg-graphite pb-48">
      <div className="text-center space-y-2 mb-8 z-10 w-full max-w-md">
        <h1 className="text-2xl font-sans font-light tracking-tight text-oatmeal flex items-center justify-center gap-3">
          <BookOpen className="text-ocean" /> Кодекс Системи
        </h1>
        <p className="text-oatmeal/50 font-mono text-xs uppercase tracking-widest">[ База Даних та Симулятор ]</p>
      </div>

      <div className="w-full max-w-md flex flex-col gap-8">
        
        {/* Human Design Simulator */}
        <div className={`w-full p-6 rounded-[24px] border ${isAdhdMode ? 'bg-graphite/80 border-oatmeal/20' : 'bg-graphite/40 border-oatmeal/10'}`}>
          <h3 className="text-xs font-mono uppercase tracking-widest text-oatmeal/60 mb-6 flex items-center gap-2">
            <Sliders size={14} className="text-sage" /> Симулятор Реальності (Human Design)
          </h3>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-mono text-oatmeal/60">
                <span>Сакральна Енергія (Генератор)</span>
                <span>{sacralEnergy}%</span>
              </div>
              <input 
                type="range" min="0" max="100" value={sacralEnergy} 
                onChange={(e) => setSacralEnergy(Number(e.target.value))}
                className="w-full h-1 bg-oatmeal/10 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-mono text-oatmeal/60">
                <span>Емоційна Хвиля (Solar Plexus)</span>
                <span>{emotionalWave}%</span>
              </div>
              <input 
                type="range" min="0" max="100" value={emotionalWave} 
                onChange={(e) => setEmotionalWave(Number(e.target.value))}
                className="w-full h-1 bg-oatmeal/10 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Reality Output */}
            <div className="mt-4 p-4 rounded-[16px] bg-black/20 border border-white/5 transition-all">
              <span className="text-[10px] uppercase font-mono tracking-widest text-oatmeal/40 block mb-2">Наслідок у реальності:</span>
              <motion.div 
                key={realityState.title}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-1"
              >
                <span className={`text-sm font-bold ${realityState.color}`}>{realityState.title}</span>
                <span className="text-xs text-oatmeal/80 leading-relaxed">{realityState.desc}</span>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Shadows DB */}
        <div className="w-full flex flex-col gap-3">
          <h3 className="text-xs font-mono uppercase tracking-widest text-oatmeal/60 mb-2 flex items-center gap-2">
            <BookOpen size={14} className="text-amber" /> Енциклопедія Тіней (Юнг)
          </h3>
          {SHADOWS_DB.map((shadow) => {
            const isExpanded = expandedShadow === shadow.id;

            return (
              <div key={shadow.id} className="w-full flex flex-col bg-graphite/60 border border-oatmeal/10 rounded-[20px] overflow-hidden transition-all">
                <button 
                  onClick={() => setExpandedShadow(isExpanded ? null : shadow.id)}
                  className="w-full p-4 flex items-center justify-between text-left hover:bg-oatmeal/5 transition-colors"
                >
                  <span className={`text-sm text-oatmeal font-bold ${isAdhdMode ? 'text-base' : ''}`}>{shadow.name}</span>
                  {isExpanded ? <ChevronUp size={18} className="text-oatmeal/40" /> : <ChevronDown size={18} className="text-oatmeal/40" />}
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="w-full px-4 pb-4 overflow-hidden"
                    >
                      <div className="pt-3 border-t border-oatmeal/10 flex flex-col gap-4">
                        <div>
                          <span className="text-[10px] text-amber uppercase font-mono tracking-widest">Тригерні фрази</span>
                          <ul className="text-sm text-oatmeal/90 mt-1 list-disc list-inside">
                            {shadow.phrases.map((p, i) => <li key={i} className="text-oatmeal/70 italic">"{p}"</li>)}
                          </ul>
                        </div>
                        <div>
                          <span className="text-[10px] text-ocean uppercase font-mono tracking-widest">Моторика / Тіло</span>
                          <p className="text-sm text-oatmeal/90 mt-1">{shadow.somatics}</p>
                        </div>
                        <div className="bg-sage/10 p-3 rounded-xl border border-sage/20">
                          <span className="text-[10px] text-sage uppercase font-mono tracking-widest">Методологія Виходу</span>
                          <p className={`text-sm text-oatmeal font-medium mt-1 ${isAdhdMode ? 'text-base font-bold' : ''}`}>{shadow.resolution}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
