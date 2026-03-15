import { useEffect, useRef, ReactNode, CSSProperties } from 'react';

type RevealType =
  | 'up'        // fade + rise (default)
  | 'down'      // fade + drop
  | 'left'      // fade + slide from left
  | 'right'     // fade + slide from right
  | 'scale'     // scale 0.85 → 1 + fade
  | 'blur'      // blur(12px) → clear + fade (best for headlines)
  | 'clip'      // clip-path inset reveal (theatrical)
  | 'flip'      // rotateX 60deg → 0 (3D page flip)
  | 'rise'      // up + blur combined (premium feel)

interface ScrollRevealProps {
  children: ReactNode;
  /** Animation variant */
  type?: RevealType;
  /** Backward-compat alias for type */
  direction?: 'up' | 'left' | 'right' | 'scale';
  delay?: number;
  /** Duration in ms (default 700) */
  duration?: number;
  className?: string;
  /** Intersection threshold 0–1 (default 0.1) */
  threshold?: number;
  /** Run every time element enters viewport (default: once) */
  repeat?: boolean;
}

// Expo-out easing — modern spring feel without a library
const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';

const initialStyles: Record<RevealType, CSSProperties> = {
  up:    { opacity: 0, transform: 'translateY(48px)' },
  down:  { opacity: 0, transform: 'translateY(-32px)' },
  left:  { opacity: 0, transform: 'translateX(-56px)' },
  right: { opacity: 0, transform: 'translateX(56px)' },
  scale: { opacity: 0, transform: 'scale(0.85)' },
  blur:  { opacity: 0, filter: 'blur(14px)', transform: 'translateY(12px)' },
  clip:  { opacity: 1, clipPath: 'inset(0 0 100% 0)', transform: 'translateY(8px)' },
  flip:  { opacity: 0, transform: 'perspective(600px) rotateX(60deg)', transformOrigin: 'top center' },
  rise:  { opacity: 0, filter: 'blur(8px)', transform: 'translateY(36px)' },
};

const revealedStyles: Record<RevealType, CSSProperties> = {
  up:    { opacity: 1, transform: 'translateY(0)' },
  down:  { opacity: 1, transform: 'translateY(0)' },
  left:  { opacity: 1, transform: 'translateX(0)' },
  right: { opacity: 1, transform: 'translateX(0)' },
  scale: { opacity: 1, transform: 'scale(1)' },
  blur:  { opacity: 1, filter: 'blur(0px)', transform: 'translateY(0)' },
  clip:  { opacity: 1, clipPath: 'inset(0 0 0% 0)', transform: 'translateY(0)' },
  flip:  { opacity: 1, transform: 'perspective(600px) rotateX(0deg)', transformOrigin: 'top center' },
  rise:  { opacity: 1, filter: 'blur(0px)', transform: 'translateY(0)' },
};

const directionToType: Record<string, RevealType> = {
  up: 'up', left: 'left', right: 'right', scale: 'scale',
};

const ScrollReveal = ({
  children,
  type,
  direction,
  delay = 0,
  duration = 700,
  className = '',
  threshold = 0.1,
  repeat = false,
}: ScrollRevealProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const resolvedType: RevealType = type ?? (direction ? directionToType[direction] ?? 'up' : 'up');

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Set initial hidden state
    const init = initialStyles[resolvedType];
    Object.assign(el.style, init);

    const reveal = () => {
      setTimeout(() => {
        if (!el) return;
        el.style.transition = `all ${duration}ms ${EASE}`;
        Object.assign(el.style, revealedStyles[resolvedType]);
      }, delay);
    };

    const hide = () => {
      el.style.transition = 'none';
      Object.assign(el.style, initialStyles[resolvedType]);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            reveal();
            if (!repeat) observer.unobserve(entry.target);
          } else if (repeat) {
            hide();
          }
        });
      },
      { threshold, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [resolvedType, delay, duration, threshold, repeat]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
};

export default ScrollReveal;
