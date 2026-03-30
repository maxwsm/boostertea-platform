"use client";
import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';
import { useTranslation } from '@myth/hooks/useTranslation';
import type { Language } from '@myth/data/translations';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useTranslation();

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'en', label: 'EN', flag: '🇬🇧' },
    { code: 'ua', label: 'UA', flag: '🇺🇦' },
  ];

  return (
    <div className="flex items-center gap-1 bg-white/10 backdrop-blur-sm rounded-full p-1 border border-white/20">
      <Globe className="w-4 h-4 text-white/60 ml-2" />
      {languages.map((lang) => (
        <motion.button
          key={lang.code}
          onClick={() => setLanguage(lang.code)}
          className={`
            relative px-3 py-1 rounded-full text-sm font-medium transition-all duration-300
            ${language === lang.code 
              ? 'bg-white text-[#8B1A1A]' 
              : 'text-white/60 hover:text-white hover:bg-white/10'}
          `}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="mr-1">{lang.flag}</span>
          {lang.label}
        </motion.button>
      ))}
    </div>
  );
}
