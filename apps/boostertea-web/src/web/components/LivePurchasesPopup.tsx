'use client'

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CITIES = ['Київ', 'Львів', 'Одеса', 'Дніпро', 'Івано-Франківськ', 'Тернопіль', 'Харків', 'Вінниця', 'Чернівці', 'Ужгород', 'Рівне', 'Полтава', 'Варшава', 'Берлін'];
const NAMES = ['Олександр', 'Марія', 'Максим', 'Ірина', 'Андрій', 'Юлія', 'Дмитро', 'Анастасія', 'Тарас', 'Олена', 'Богдан', 'Катерина', 'Артем', 'Софія', 'Денис'];
const VOLUMES = ['1L концентрат', '0.25L концентрат', 'Дегустаційний Мікс'];
const FLAVORS = ['Mango', 'Classic', 'Berries', 'GABA', 'Da Hong Pao', 'Те Гуань Інь'];

const SCENARIOS = [
  "щойно замовив(ла)",
  "взяв(ла) на пробу перший раз",
  "поповнив(ла) свої запаси енергії",
  "готується до дедлайнів, замовив(ла)",
  "не витримав(ла) і замовив(ла)",
  "кинув(ла) пити каву, перейшов(ла) на",
  "зробив(ла) подарунок бро, взявши",
  "замовив(ла) на весь офіс",
  "затестив(ла) новий смак",
  "готується до рейду в WoW, взяв(ла)",
  "після важкого тижня відновлюється через",
  "вирішив(ла) перейти на темну сторону з",
  "забрав(ла) останню пляшку з попередньої партії",
  "оформлює підписку на щомісячний",
  "перейшов(ла) на новий рівень біохакінгу з",
  "взяв(ла) з собою в гори",
  "відправив(ла) мамі, щоб та спробувала",
  "замовив(ла) перед довгою дорогою",
  "зрозумів(ла), що однієї пляшки мало, взяв(ла) ще",
  "для суботньої вечірки замовив(ла)",
  "прокидається тільки завдяки",
  "замінив(ла) ранковий еспресо на",
  "готується до марафону з",
  "подарував(ла) шефу на днюху",
  "тестує концентрацію перед іспитом з",
  "відмовився(лася) від хімозних енергетиків заради",
  "для геймерських нічних сесій вибрав(ла)",
  "замість походу в кав'ярню інвестує в",
  "вже 5-й раз за місяць бере",
  "зробив(ла) імпульсивну, але правильну покупку",
  "готується писати код всю ніч з",
  "забрав(ла) додому для чілу",
  "підсадив(ла) всіх друзів на"
];

const EASTER_EGGS = [
  "🤫 хтось з Адміністрації Президента щойно замовив 10L Пуеру",
  "👀 Назар таємно відлив собі трохи Габи на складі",
  "🦅 СБУ замовила партію Da Hong Pao для нічних допитів",
  "👾 Хакер з Даркнету обміняв 0.001 BTC на річний запас Mango",
  "👽 Інопланетний розум просканував сайт і вибрав Малиновий мікс",
  "🚗 Кур'єр Нової Пошти випив ваш Пуер по дорозі (жарт, він ще їде)",
  "🧙‍♂️ Мольфар з Карпат замовив Класику для своїх ритуалів",
  "⚡️ Ілон Маск твітнув про нас і замовив всю партію Габи"
];

interface Purchase {
  id: string;
  name?: string;
  city?: string;
  product?: string;
  scenario?: string;
  isEasterEgg?: boolean;
  easterEggText?: string;
  timeAgo: number; // minutes
}

export const LivePurchasesPopup = () => {
  const [purchase, setPurchase] = useState<Purchase | null>(null);

  useEffect(() => {
    // Show one immediately after a delay
    const initialTimer = setTimeout(() => {
      generatePurchase();
    }, 8000);

    // Then show one periodically every 30-90 seconds (Reduced Frequency 50%)
    const interval = setInterval(() => {
      generatePurchase();
    }, Math.random() * 60000 + 30000);

    // Emergency close if stuck
    const escapeListener = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPurchase(null);
    };
    window.addEventListener('keydown', escapeListener);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
      window.removeEventListener('keydown', escapeListener);
    };
  }, []);

  const generatePurchase = () => {
    const isEasterEgg = Math.random() < 0.08; // 8% chance for 8 eggs
    
    let newPurchase: Purchase;
    
    if (isEasterEgg) {
      newPurchase = {
        id: Math.random().toString(36).substring(7),
        isEasterEgg: true,
        easterEggText: EASTER_EGGS[Math.floor(Math.random() * EASTER_EGGS.length)],
        timeAgo: Math.floor(Math.random() * 5) + 1
      };
    } else {
      newPurchase = {
        id: Math.random().toString(36).substring(7),
        name: NAMES[Math.floor(Math.random() * NAMES.length)],
        city: CITIES[Math.floor(Math.random() * CITIES.length)],
        product: `${FLAVORS[Math.floor(Math.random() * FLAVORS.length)]} ${VOLUMES[Math.floor(Math.random() * VOLUMES.length)]}`,
        scenario: SCENARIOS[Math.floor(Math.random() * SCENARIOS.length)],
        timeAgo: Math.floor(Math.random() * 59) + 1,
        isEasterEgg: false
      };
    }
    
    setPurchase(newPurchase);

    // Hide after 8 seconds (slightly longer to read scenarios)
    setTimeout(() => {
      setPurchase(null);
    }, 8000);
  };

  return (
    <AnimatePresence>
      {purchase && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9, rotateX: 20 }}
          animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
          exit={{ opacity: 0, y: 30, scale: 0.8, filter: 'blur(10px)' }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="fixed bottom-6 left-6 z-50 max-w-sm glass border border-[var(--accent)]/30 p-4 rounded-3xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] flex items-start gap-4 pointer-events-none"
        >
          <div className={`w-10 h-10 rounded-full flex flex-shrink-0 items-center justify-center shadow-inner ${purchase.isEasterEgg ? 'bg-gradient-to-tr from-purple-600 to-pink-500 animate-pulse' : 'bg-[var(--accent)]'}`}>
            {purchase.isEasterEgg ? (
              <span className="text-white text-lg">💡</span>
            ) : (
              <svg className="w-5 h-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            )}
          </div>
          <div className="flex-1 pr-2">
            {purchase.isEasterEgg ? (
              <p className="text-[var(--text-primary)] text-sm mb-1 leading-snug font-medium italic">
                {purchase.easterEggText}
              </p>
            ) : (
              <p className="text-[var(--text-primary)] text-sm mb-1 leading-snug">
                <span className="font-bold">{purchase.name}</span> з м. {purchase.city} <span className="opacity-80">{purchase.scenario}</span> <br/>
                <span className="text-[var(--accent)] font-black text-sm drop-shadow-md">{purchase.product}</span>
              </p>
            )}
            <p className="text-[var(--text-primary)]/40 text-[10px] font-bold mt-1 uppercase tracking-widest">
              {purchase.timeAgo} хв тому
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
