import { useStore } from '../lib/store';
import { useTranslation } from '../lib/i18n';

const Toast = () => {
  const { toastKey } = useStore();
  const { t } = useTranslation();

  if (!toastKey) return null;

  const message = t(toastKey);
  const isCartMessage = toastKey.includes('Cart') || toastKey.includes('cart');

  return (
    <div className="fixed bottom-6 right-6 z-50 toast-slide-in">
      <div className="bg-[var(--toast-bg)] border border-[var(--toast-border)] rounded-2xl px-5 py-4 shadow-2xl shadow-black/30 flex items-center gap-3 max-w-sm">
        {/* Tea cup icon */}
        <div className="w-10 h-10 bg-[var(--accent-muted)] rounded-xl flex items-center justify-center shrink-0">
          {isCartMessage ? (
            <svg className="w-5 h-5 text-[var(--accent)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z" />
              <path d="M6 1v3M10 1v3M14 1v3" strokeLinecap="round" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-[var(--accent)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="text-[var(--text-primary)] text-sm font-medium">
            {message}
          </p>
        </div>

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-[var(--bg-primary)] rounded-b-2xl overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-hover)]"
            style={{
              animation: 'shrink-width 3s linear forwards'
            }}
          />
        </div>
      </div>
      
      <style>{`
        @keyframes shrink-width {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
};

export default Toast;
