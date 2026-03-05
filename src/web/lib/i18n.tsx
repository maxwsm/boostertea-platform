import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'uk' | 'en' | 'es';

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

// Translations will be imported
import ukTranslations from '../locales/uk.json';
import enTranslations from '../locales/en.json';
import esTranslations from '../locales/es.json';

const translations: Record<Language, Record<string, string>> = {
  uk: ukTranslations,
  en: enTranslations,
  es: esTranslations,
};

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

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('boostertea-language');
      if (saved && (saved === 'uk' || saved === 'en' || saved === 'es')) {
        return saved as Language;
      }
    }
    return 'uk';
  });

  useEffect(() => {
    localStorage.setItem('boostertea-language', language);
    document.documentElement.lang = language;
    
    // Update hreflang meta tags
    const existingHreflangs = document.querySelectorAll('link[hreflang]');
    existingHreflangs.forEach(el => el.remove());
    
    const languages: Language[] = ['uk', 'en', 'es'];
    languages.forEach(lang => {
      const link = document.createElement('link');
      link.rel = 'alternate';
      link.hreflang = lang;
      link.href = window.location.href.replace(/\?.*$/, '') + (lang !== 'uk' ? `?lang=${lang}` : '');
      document.head.appendChild(link);
    });
    
    // x-default
    const defaultLink = document.createElement('link');
    defaultLink.rel = 'alternate';
    defaultLink.hreflang = 'x-default';
    defaultLink.href = window.location.href.replace(/\?.*$/, '');
    document.head.appendChild(defaultLink);
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string, params?: Record<string, string | number>): string => {
    const translation = getNestedValue(translations[language] as unknown as Record<string, unknown>, key);
    
    if (!translation) {
      // Fallback to Ukrainian if translation not found
      const fallback = getNestedValue(translations.uk as unknown as Record<string, unknown>, key);
      if (!fallback) {
        console.warn(`Translation missing for key: ${key}`);
        return key;
      }
      return interpolate(fallback, params);
    }
    
    return interpolate(translation, params);
  };

  const interpolate = (text: string, params?: Record<string, string | number>): string => {
    if (!params) return text;
    
    return text.replace(/\{\{(\w+)\}\}/g, (_, key) => {
      return params[key]?.toString() || `{{${key}}}`;
    });
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

// Convenient shorthand for just the translation function
export const useTranslation = () => {
  const { t, language } = useI18n();
  return { t, language };
};
