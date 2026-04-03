'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { pushGTMEvent } from '../../../lib/blog/types';

// --- Generic Building Blocks ---

function ScienceSliderMechanic({ slug, title, subtitle, min, max, unit, baseValue, effectLabel, color }: any) {
  const [value, setValue] = useState(baseValue);
  const percentage = ((value - min) / (max - min)) * 100;

  const handleInteractionComplete = () => {
    pushGTMEvent({
      event: 'blog_mechanic_interaction',
      article_slug: slug,
      mechanic_type: 'slider',
      mechanic_value: value
    });
  };

  return (
    <div className="bento-card p-8 bg-[#0a0a0c] my-12 border-l-4 border-l-[#C4956A]">
      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1">
          <h4 className="archival-heading text-2xl text-white mb-2">{title}</h4>
          <p className="text-[#A89880] text-sm leading-relaxed mb-6">{subtitle}</p>
          
          <div className="relative h-2 bg-white/10 rounded-full mt-8">
            <div className="absolute top-0 left-0 h-full rounded-full transition-all duration-300 pointer-events-none" style={{ width: `${percentage}%`, backgroundColor: color }} />
            <input 
              type="range" 
              min={min} 
              max={max} 
              value={value} 
              onChange={(e) => setValue(Number(e.target.value))}
              onMouseUp={handleInteractionComplete}
              onTouchEnd={handleInteractionComplete}
              className="absolute inset-0 w-full opacity-0 cursor-pointer"
            />
            <div 
              className="absolute top-1/2 -translate-y-1/2 w-6 h-6 rounded-full border-2 border-black shadow-[0_0_15px_rgba(0,0,0,0.5)] transition-all pointer-events-none flex items-center justify-center"
              style={{ left: `calc(${percentage}% - 12px)`, backgroundColor: color }}
            >
               <div className="w-1.5 h-1.5 bg-black rounded-full" />
            </div>
          </div>
          <div className="flex justify-between mt-3 text-xs font-mono text-white/40 font-bold uppercase">
             <span>{min}{unit}</span>
             <span>{max}{unit}</span>
          </div>
        </div>

        <div className="w-full md:w-48 aspect-square rounded-2xl bg-black/50 border border-white/5 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute bottom-0 w-full transition-all duration-500 ease-out opacity-20" style={{ height: `${percentage}%`, backgroundColor: color }} />
          <span className="text-[#A89880] text-xs uppercase tracking-widest mb-1 z-10">{effectLabel}</span>
          <span className="archival-heading text-4xl text-white z-10">{value}{unit}</span>
        </div>
      </div>
    </div>
  );
}

function HoldToExtractMechanic({ slug, title, subtitle, targetValue, targetUnit, actionLabel, color }: any) {
  const [progress, setProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const [hasFired, setHasFired] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleStart = () => setIsHolding(true);
  const handleEnd = () => setIsHolding(false);

  useEffect(() => {
    if (isHolding && progress < 100) {
      intervalRef.current = setInterval(() => setProgress(p => Math.min(p + 2, 100)), 50);
    } else if (!isHolding && progress > 0 && progress < 100) {
      intervalRef.current = setInterval(() => setProgress(p => Math.max(p - 3, 0)), 50);
    }

    if (progress === 100 && !hasFired) {
      setHasFired(true);
      pushGTMEvent({
        event: 'blog_mechanic_interaction',
        article_slug: slug,
        mechanic_type: 'hold_extractor',
        mechanic_value: 100
      });
    }

    return () => clearInterval(intervalRef.current!);
  }, [isHolding, progress, hasFired, slug]);

  const currentYield = Math.floor((progress / 100) * targetValue);

  return (
    <div className="bento-card p-8 bg-[#0a0a0c] my-12 border border-white/5 flex flex-col items-center text-center">
      <h4 className="archival-heading text-2xl text-white mb-2">{title}</h4>
      <p className="text-[#A89880] text-sm mb-6 max-w-md">{subtitle}</p>

      <div className="relative w-48 h-48 mb-8">
        {/* Ring Background */}
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
          <circle 
            cx="50" 
            cy="50" 
            r="45" 
            fill="none" 
            stroke={color} 
            strokeWidth="4" 
            strokeDasharray="283"
            strokeDashoffset={283 - (progress / 100) * 283}
            className="transition-all duration-75"
            style={{ filter: `drop-shadow(0 0 8px ${color}80)` }}
          />
        </svg>
        
        {/* Inner Context */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="archival-heading text-4xl text-white">{currentYield}</span>
          <span className="text-white/40 text-xs font-mono uppercase tracking-widest">{targetUnit}</span>
        </div>
      </div>

      <button
        onMouseDown={handleStart}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={handleStart}
        onTouchEnd={handleEnd}
        className={`px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-sm transition-all select-none ${
          progress === 100 
            ? 'bg-white/10 text-white/50 cursor-not-allowed border border-white/5' 
            : 'bg-[#C4956A] text-[#0F0B08] hover:bg-[#D4A57A] shadow-[0_0_20px_rgba(196,149,106,0.3)] active:scale-95'
        }`}
        style={{ backgroundColor: progress < 100 ? color : undefined }}
      >
        {progress === 100 ? 'Екстракція Завершена' : actionLabel}
      </button>
    </div>
  );
}

// --- Dispatcher ---

export function BlogMechanics({ slug }: { slug: string }) {
  
  switch (slug) {
    case '5-sposobiv-prygotuvaty-holodnyi-da-hong-pao-vlitku':
      return (
        <ScienceSliderMechanic 
          slug={slug}
          title="Температурний Екстрактор"
          subtitle="Відрегулюйте температуру заварювання, щоб побачити, як змінюється рівень виділення кофеїну та солодкої глюкози в чаї."
          min={5} max={100} unit="°C" baseValue={20} effectLabel="Гіркота" color="#00D4FF"
        />
      );

    case 'chainyi-smuzi-pu-erh-z-bananom-ta-korytseiu':
      return (
        <HoldToExtractMechanic 
          slug={slug}
          title="Біо-Блендер"
          subtitle="Затисніть кнопку, щоб запустити блендер. Якщо відпустити занадто рано, ви не досягнете потрібної гомогенізації!"
          targetValue={100} targetUnit="ШУМ" actionLabel="Затисни і Тримай" color="#9FD356"
        />
      );

    case 'gaba-latte-retsept-idealnoho-vechirnoho-napoiu':
      return (
        <ScienceSliderMechanic 
          slug={slug}
          title="Синтезатор ГАМК (Рівень Спокою)"
          subtitle="Налаштуйте рівень релаксації, змінюючи пропорцію молока до GABA-концентрату. Більше молока — м'якший ефект."
          min={10} max={250} unit="МЛ" baseValue={150} effectLabel="Спокій" color="#9872E6"
        />
      );

    case 'chainyi-kokteil-da-hong-pao-z-imbyrom-ta-medom':
      return (
        <HoldToExtractMechanic 
          slug={slug}
          title="Генератор Імунітету"
          subtitle="Екстрагуйте максимум гінгеролу з імбиру. Тисніть, щоб зарядити коктейль біоактивними речовинами."
          targetValue={500} targetUnit="МГ Віт.С" actionLabel="Вичавити Імбир" color="#FFB800"
        />
      );

    case 'vid-lystka-do-kontsentratu-yak-vyrobliaiut-chaini-ekstrakty':
      return (
        <HoldToExtractMechanic 
          slug={slug}
          title="Промисловий Прес (Екстрактор)"
          subtitle="Симулятор тиску. Утримання запускає тиск у 100 Бар, щоб отримати найвищу концентрацію чаю 10:1."
          targetValue={10} targetUnit="Л ВИТЯЖКИ" actionLabel="Запустити Тиск" color="#FF3366"
        />
      );

    case 'yak-zmina-klimatu-vplyvaie-na-chaini-plantatsii-kytayu':
      return (
        <ScienceSliderMechanic 
          slug={slug}
          title="Глобальна Температура"
          subtitle="Посуньте слайдер, щоб побачити, як підвищення температури у світі вбиває тонкі амінокислоти у чаї."
          min={0} max={5} unit="+°C" baseValue={0} effectLabel="Стрес Листа" color="#FF0044"
        />
      );

    case 'vytrymka-pu-erh-chomu-chai-staie-krashchym-z-rokamy':
      return (
        <ScienceSliderMechanic 
          slug={slug}
          title="Машина Часу Пуеру"
          subtitle="Подорожуйте у часі. Що старший пуер, то темніший настій і глибший метаболічний вплив на організм."
          min={2000} max={2026} unit=" РІК" baseValue={2026} effectLabel="Ферментація" color="#5C3A21"
        />
      );

    case 'terruar-chaiu-yak-grunt-i-vysota-vyznachaiut-smak':
      return (
        <ScienceSliderMechanic 
          slug={slug}
          title="Висота Плантації над Рівнем Моря"
          subtitle="Чим вище росте чай, тим менше кисню і довше росте лист, накопичуючи неймовірну дозу ефірних олій."
          min={500} max={2500} unit="М" baseValue={800} effectLabel="Якість Олій" color="#4CAF50"
        />
      );

    case 'yak-pravylno-zberihaty-chainyi-kontsentrat':
      return (
        <ScienceSliderMechanic 
          slug={slug}
          title="Температура Зберігання"
          subtitle="Відрегулюйте температуру зберігання концентрату (від холодильника до кімнати на сонці), щоб побачити вплив на свіжість."
          min={-5} max={35} unit="°C" baseValue={20} effectLabel="Окислення" color="#00D4FF"
        />
      );

    default:
      // Fallback for articles without a specific mapped component yet.
      // E.g. "EnergyCalculator" or subtle background glow.
      return null;
  }
}
