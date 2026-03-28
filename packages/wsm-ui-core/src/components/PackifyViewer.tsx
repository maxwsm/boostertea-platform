import React from 'react';

export interface PackifyViewerProps {
  projectId: string;
  autoRotate?: boolean;
  className?: string;
}

export const PackifyViewer = ({ projectId, autoRotate = true, className = '' }: PackifyViewerProps) => {
  // Використовуємо Packify Embed SDK (Iframe fallback)
  const embedUrl = `https://www.packify.ai/embed/${projectId}?autorotate=${autoRotate}&ui=false&transparent=true`;

  return (
    <div className={`relative aspect-square group ${className}`}>
      <iframe 
        src={embedUrl}
        className="w-full h-full border-none pointer-events-none group-hover:pointer-events-auto transition-all"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      />
      {/* Накладаємо наш Glassmorphism шар поверх для стилізації */}
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_40px_rgba(0,0,0,0.5)] rounded-3xl" />
      
      {/* Індикатор сканування для артефакту */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-[var(--accent)] opacity-0 group-hover:opacity-50 group-hover:animate-scanline pointer-events-none drop-shadow-[0_0_10px_var(--accent)]" />
    </div>
  );
};
