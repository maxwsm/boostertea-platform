import { useEffect, useRef } from 'react';

interface SteamParticlesProps {
  count?: number;
  className?: string;
}

/**
 * Organic steam particles.
 * — Soft blurred circles (filter: blur) for cloud-like look
 * — Sinusoidal X-drift via two CSS custom properties (--drift-a, --drift-b)
 * — Varying size, opacity, duration, blur radius
 */
const SteamParticles = ({ count = 10, className = '' }: SteamParticlesProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const particles: HTMLDivElement[] = [];

    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'steam-particle-v2';

      const size      = 6 + Math.random() * 14;           // 6–20px
      const blur      = 3 + Math.random() * 8;            // 3–11px
      const delay     = Math.random() * 3;                // 0–3s stagger
      const duration  = 3 + Math.random() * 2.5;          // 3–5.5s
      const left      = 20 + Math.random() * 60;          // 20–80%
      // Two-phase sinusoidal drift: first half drifts one way, second the other
      const driftA    = (Math.random() - 0.5) * 28;       // ±14px
      const driftB    = (Math.random() - 0.5) * 36;       // ±18px
      const startOpacity = 0.55 + Math.random() * 0.3;    // 0.55–0.85 peak

      p.style.cssText = `
        --drift-a: ${driftA}px;
        --drift-b: ${driftB}px;
        --peak-opacity: ${startOpacity};
        left: ${left}%;
        bottom: 0;
        width: ${size}px;
        height: ${size * (1 + Math.random() * 0.6)}px;
        animation-delay: ${delay}s;
        animation-duration: ${duration}s;
        filter: blur(${blur}px);
      `;

      container.appendChild(p);
      particles.push(p);
    }

    return () => particles.forEach(p => p.remove());
  }, [count]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
    />
  );
};

export default SteamParticles;
