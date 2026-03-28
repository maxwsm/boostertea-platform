import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'uk' | 'en' | 'es';

export const languageNames: Record<Language, string> = {
  uk: 'Українська',
  en: 'English',
  es: 'Español',
};

export const languageFlags: Record<Language, string> = {
  uk: '🇺🇦',
  en: '🇬🇧',
  es: '🇪🇸',
};

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

// Translations
import ukTranslations from '../locales/uk.json';
import enTranslations from '../locales/en.json';
import esTranslations from '../locales/es.json';

const translations: Record<Language, Record<string, unknown>> = {
  uk: ukTranslations,
  en: enTranslations,
  es: esTranslations,
};

const getNestedValue = (obj: Record<string, unknown>, path: string): string | undefined => {
  const keys = path.split('.');
  let current: unknown = obj;
  
  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = (current as Record<string, unknown>)[key];
    } else {
      return undefined;
    }
  }
  
  return typeof current === 'string' ? current : undefined;
};

const interpolate = (text: string, params?: Record<string, string | number>): string => {
  if (!params) return text;
  return text.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    return params[key]?.toString() || `{{${key}}}`;
  });
};

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  // Default to 'uk' for SSR
  const [language, setLanguageState] = useState<Language>('uk');
  const [mounted, setMounted] = useState(false);

  // Load from localStorage only after mount
  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem('boostertea-language') as Language | null;
      if (saved && (saved === 'uk' || saved === 'en' || saved === 'es')) {
        setLanguageState(saved);
      }
    } catch (e) {
      console.error('Failed to load language:', e);
    }
  }, []);

  // Save to localStorage when language changes
  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem('boostertea-language', language);
      document.documentElement.lang = language;
    } catch (e) {
      console.error('Failed to save language:', e);
    }
  }, [mounted, language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string, params?: Record<string, string | number>): string => {
    const translation = getNestedValue(translations[language] as Record<string, unknown>, key);
    
    if (!translation) {
      const fallback = getNestedValue(translations.uk as Record<string, unknown>, key);
      if (!fallback) {
        console.warn(`Translation missing for key: ${key}`);
        return key;
      }
      return interpolate(fallback, params);
    }
    
    return interpolate(translation, params);
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
};

export const useTranslation = () => {
  const { t, language } = useI18n();
  return { t, language };
};
