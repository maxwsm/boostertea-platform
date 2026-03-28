import { useState, useEffect, useCallback, useRef } from 'react';
import { X, Cookie, Settings, Check } from 'lucide-react';
import { useStore } from '../lib/store';

interface CookieConsentState {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp: string;
}

const STORAGE_KEY = 'bt_cookie_consent';

export function CookieConsent() {
  const { isCookieSettingsOpen, setCookieSettingsOpen } = useStore();
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [consent, setConsent] = useState<CookieConsentState>({
    necessary: true,
    analytics: false,
    marketing: false,
    timestamp: '',
  });
  
  const bannerRef = useRef<HTMLDivElement>(null);
  const firstFocusableRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      setIsVisible(true);
    } else {
      const parsed = JSON.parse(stored) as CookieConsentState;
      setConsent(parsed);
      loadScripts(parsed);
    }
  }, []);

  useEffect(() => {
    if (isVisible && firstFocusableRef.current) {
      firstFocusableRef.current.focus();
    }
  }, [isVisible]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isVisible) {
        handleRejectAll();
      }
    };
    
    if (isVisible) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isVisible]);

  const loadScripts = (consentState: CookieConsentState) => {
    // Load GA4/GTM only if analytics consent given
    if (consentState.analytics) {
      // GA4 script would be loaded here
      console.log('Analytics scripts enabled');
    }
    
    // Load Facebook/TikTok Pixel only if marketing consent given
    if (consentState.marketing) {
      // Marketing scripts would be loaded here
      console.log('Marketing scripts enabled');
    }
  };

  const saveConsent = (consentState: CookieConsentState) => {
    const newConsent = {
      ...consentState,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newConsent));
    setConsent(newConsent);
    loadScripts(newConsent);
    setIsVisible(false);
    setCookieSettingsOpen(false);
    document.body.style.overflow = '';
  };

  const handleAcceptAll = () => {
    saveConsent({
      necessary: true,
      analytics: true,
      marketing: true,
      timestamp: '',
    });
  };

  const handleRejectAll = () => {
    saveConsent({
      necessary: true,
      analytics: false,
      marketing: false,
      timestamp: '',
    });
  };

  const handleSaveSettings = () => {
    saveConsent(consent);
  };

  const openSettings = useCallback(() => {
    setIsVisible(true);
    setShowSettings(true);
    setCookieSettingsOpen(true);
  }, [setCookieSettingsOpen]);

  useEffect(() => {
    if (isCookieSettingsOpen) openSettings();
  }, [isCookieSettingsOpen, openSettings]);

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-end justify-center bg-black/50 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cookie-consent-title"
    >
      <div
        ref={bannerRef}
        className="w-full max-w-4xl mx-4 mb-4 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-2xl shadow-2xl animate-slide-up"
        style={{
          animation: 'slideUp 300ms ease-out',
        }}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[var(--color-primary)]/10 rounded-lg">
                <Cookie className="w-6 h-6 text-[var(--color-primary)]" />
              </div>
              <h2 id="cookie-consent-title" className="text-xl font-bold text-[var(--text-primary)]">
                Налаштування cookie
              </h2>
            </div>
            <button
              onClick={() => {
                handleRejectAll();
                setCookieSettingsOpen(false);
              }}
              className="p-2 hover:bg-[var(--bg-secondary)] rounded-lg transition-colors"
              aria-label="Закрити"
            >
              <X className="w-5 h-5 text-[var(--text-secondary)]" />
            </button>
          </div>

          {/* Description */}
          <p className="text-[var(--text-secondary)] mb-6">
            Ми використовуємо cookie для покращення вашого досвіду на сайті. 
            Ви можете налаштувати, які типи cookie ви дозволяєте.
          </p>

          {/* Settings Panel */}
          {showSettings ? (
            <div className="space-y-4 mb-6">
              {/* Necessary - Always On */}
              <div className="flex items-center justify-between p-4 bg-[var(--bg-secondary)] rounded-xl">
                <div>
                  <h3 className="font-semibold text-[var(--text-primary)]">Необхідні</h3>
                  <p className="text-sm text-[var(--text-secondary)]">
                    Ці cookie необхідні для роботи сайту
                  </p>
                </div>
                <div className="flex items-center gap-2 text-[var(--color-primary)]">
                  <Check className="w-5 h-5" />
                  <span className="text-sm font-medium">Завжди увімкнено</span>
                </div>
              </div>

              {/* Analytics */}
              <label className="flex items-center justify-between p-4 bg-[var(--bg-secondary)] rounded-xl cursor-pointer hover:bg-[var(--bg-secondary)]/80 transition-colors">
                <div>
                  <h3 className="font-semibold text-[var(--text-primary)]">Аналітика</h3>
                  <p className="text-sm text-[var(--text-secondary)]">
                    Допомагають нам розуміти, як ви використовуєте сайт
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={consent.analytics}
                  onChange={(e) => setConsent(prev => ({ ...prev, analytics: e.target.checked }))}
                  className="w-6 h-6 accent-[var(--color-primary)] rounded cursor-pointer"
                />
              </label>

              {/* Marketing */}
              <label className="flex items-center justify-between p-4 bg-[var(--bg-secondary)] rounded-xl cursor-pointer hover:bg-[var(--bg-secondary)]/80 transition-colors">
                <div>
                  <h3 className="font-semibold text-[var(--text-primary)]">Маркетинг</h3>
                  <p className="text-sm text-[var(--text-secondary)]">
                    Використовуються для показу релевантної реклами
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={consent.marketing}
                  onChange={(e) => setConsent(prev => ({ ...prev, marketing: e.target.checked }))}
                  className="w-6 h-6 accent-[var(--color-primary)] rounded cursor-pointer"
                />
              </label>
            </div>
          ) : null}

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            {showSettings ? (
              <>
                <button
                  onClick={() => setShowSettings(false)}
                  className="flex-1 px-6 py-3 border border-[var(--border-color)] text-[var(--text-primary)] rounded-xl font-medium hover:bg-[var(--bg-secondary)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2"
                >
                  Назад
                </button>
                <button
                  onClick={handleSaveSettings}
                  className="flex-1 px-6 py-3 bg-[var(--color-primary)] text-black rounded-xl font-medium hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2"
                >
                  Зберегти налаштування
                </button>
              </>
            ) : (
              <>
                <button
                  ref={firstFocusableRef}
                  onClick={handleRejectAll}
                  className="flex-1 px-6 py-3 border border-[var(--border-color)] text-[var(--text-primary)] rounded-xl font-medium hover:bg-[var(--bg-secondary)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2"
                >
                  Відхилити все
                </button>
                <button
                  onClick={() => setShowSettings(true)}
                  className="flex-1 px-6 py-3 border border-[var(--border-color)] text-[var(--text-primary)] rounded-xl font-medium hover:bg-[var(--bg-secondary)] transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2"
                >
                  <Settings className="w-4 h-4" />
                  Налаштувати
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="flex-1 px-6 py-3 bg-[var(--color-primary)] text-black rounded-xl font-medium hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2"
                >
                  Прийняти все
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(100%);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

export default CookieConsent;
