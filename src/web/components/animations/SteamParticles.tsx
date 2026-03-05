import { useEffect, useRef } from 'react';

interface SteamParticlesProps {
  count?: number;
  className?: string;
}

const SteamParticles = ({ count = 12, className = '' }: SteamParticlesProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const particles: HTMLDivElement[] = [];

    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.className = 'steam-particle';
      
      const drift = (Math.random() - 0.5) * 40;
      const delay = Math.random() * 2;
      const duration = 2 + Math.random() * 2;
      const left = 30 + Math.random() * 40;
      const size = 4 + Math.random() * 8;
      
      particle.style.cssText = `
        --drift: ${drift}px;
        animation-delay: ${delay}s;
        animation-duration: ${duration}s;
        left: ${left}%;
        bottom: 0;
        width: ${size}px;
        height: ${size}px;
      `;
      
      container.appendChild(particle);
      particles.push(particle);
    }

    return () => {
      particles.forEach(p => p.remove());
    };
  }, [count]);

  return (
    <div 
      ref={containerRef} 
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
    />
  );
};

export default SteamParticles;
