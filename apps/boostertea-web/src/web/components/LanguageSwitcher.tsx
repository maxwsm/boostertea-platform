import { useState, useRef, useEffect } from 'react';
import { useI18n, Language, languageNames, languageFlags } from '../lib/i18n';

const LanguageSwitcher = () => {
  const { language, setLanguage } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages: Language[] = ['uk', 'en', 'es'];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-full bg-[var(--theme-toggle-bg)] hover:bg-[var(--theme-toggle-hover)] transition-colors text-sm"
        aria-label="Select language"
      >
        <span className="text-lg">{languageFlags[language]}</span>
        <span className="text-[var(--text-primary)] font-medium hidden sm:inline">{language === 'uk' ? 'UA' : language.toUpperCase()}</span>
        <svg 
          className={`w-4 h-4 text-[var(--text-muted)] transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-44 bg-[var(--dropdown-bg)] border border-[var(--dropdown-border)] rounded-xl shadow-xl overflow-hidden z-50 animate-fade-in-up">
          {languages.map((lang) => (
            <button
              key={lang}
              onClick={() => {
                setLanguage(lang);
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                language === lang 
                  ? 'bg-[var(--dropdown-active-bg)] text-[var(--dropdown-active-text)]' 
                  : 'text-[var(--dropdown-text)] hover:bg-[var(--dropdown-hover-bg)]'
              }`}
            >
              <span className="text-xl">{languageFlags[lang]}</span>
              <span className="font-medium">{languageNames[lang]}</span>
              {language === lang && (
                <svg className="w-4 h-4 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
