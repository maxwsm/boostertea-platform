import { useEffect, useState } from 'react';

interface ConfettiProps {
  active: boolean;
  onComplete?: () => void;
}

const Confetti = ({ active, onComplete }: ConfettiProps) => {
  const [pieces, setPieces] = useState<Array<{
    id: number;
    x: number;
    color: string;
    delay: number;
    duration: number;
    rotation: number;
    type: 'leaf' | 'circle' | 'rect';
  }>>([]);

  useEffect(() => {
    if (!active) {
      setPieces([]);
      return;
    }

    const colors = ['#9FD356', '#8B7355', '#C9A55C', '#7FB030', '#F5F0E8'];
    const types: ('leaf' | 'circle' | 'rect')[] = ['leaf', 'leaf', 'leaf', 'circle', 'rect'];
    
    const newPieces = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 0.5,
      duration: 2.5 + Math.random() * 1.5,
      rotation: Math.random() * 360,
      type: types[Math.floor(Math.random() * types.length)]
    }));

    setPieces(newPieces);

    const timer = setTimeout(() => {
      setPieces([]);
      onComplete?.();
    }, 4000);

    return () => clearTimeout(timer);
  }, [active, onComplete]);

  if (!active || pieces.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="confetti-piece"
          style={{
            left: `${piece.x}%`,
            '--fall-duration': `${piece.duration}s`,
            animationDelay: `${piece.delay}s`,
            transform: `rotate(${piece.rotation}deg)`,
          } as React.CSSProperties}
        >
          {piece.type === 'leaf' ? (
            <svg 
              width="16" 
              height="20" 
              viewBox="0 0 16 20" 
              fill={piece.color}
              style={{ transform: `scale(${0.6 + Math.random() * 0.6})` }}
            >
              <path d="M8 0C8 0 2 4 2 10C2 14 4 18 8 20C12 18 14 14 14 10C14 4 8 0 8 0ZM8 16C6 14 5 12 5 10C5 7 8 3 8 3C8 3 11 7 11 10C11 12 10 14 8 16Z" />
            </svg>
          ) : piece.type === 'circle' ? (
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: piece.color }}
            />
          ) : (
            <div 
              className="w-2 h-4 rounded-sm"
              style={{ backgroundColor: piece.color }}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default Confetti;
