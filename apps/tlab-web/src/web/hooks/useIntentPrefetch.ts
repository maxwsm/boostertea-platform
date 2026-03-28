import { useRef, useCallback } from 'react';

/**
 * Хук для інтелектуального прелоаду сторінок
 * @param {string} url - URL сторінки або API ендпоінту, який треба підвантажити
 * @param {number} delay - Затримка в мс (захист від випадкових проведень мишкою)
 */
export const useIntentPrefetch = (url: string, delay = 100) => {
  const hoverTimer = useRef<NodeJS.Timeout | null>(null);
  const prefetched = useRef<Set<string>>(new Set()); // Кеш, щоб не качати двічі

  const prefetchData = useCallback(() => {
    // Якщо вже завантажили цю сторінку в цій сесії - ігноруємо
    if (prefetched.current.has(url)) return;

    // Створюємо невидимий тег для попереднього завантаження
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    
    document.head.appendChild(link);
    prefetched.current.add(url);
    console.log(`[SpeedBoost] Prefetched: ${url}`);
  }, [url]);

  const onMouseEnter = () => {
    // Користувач навів мишку. Чекаємо 100мс перед початком завантаження
    hoverTimer.current = setTimeout(() => {
      prefetchData();
    }, delay);
  };

  const onMouseLeave = () => {
    // Користувач прибрав мишку швидше ніж за 100мс - скасовуємо завантаження
    if (hoverTimer.current) {
      clearTimeout(hoverTimer.current);
    }
  };

  return { onMouseEnter, onMouseLeave };
};
