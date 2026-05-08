import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

type VectorAnalysisProps = {
  vectors: {
    dopamine: number;
    cognitiveLoad: number;
    rsdSafety: number;
    financial: number;
    spiritual: number;
  };
};

export function VectorAnalysis({ vectors }: VectorAnalysisProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Use raw values (no weird offsets). The graph will scale from -100 to +100
    // Wait, cognitiveLoad is 0 to 100, but lower is better. We can invert it for display.
    // Actually let's just normalize everything to 0..100 scale for drawing (radius)
    // -100 -> 0 radius
    // +100 -> full radius
    const norm = (val: number, isCognitiveLoad = false) => {
      // If it's cognitive load, higher means worse (closer to center)
      if (isCognitiveLoad) {
        return Math.max(0.1, 1 - (val / 100)); // 100 -> 0.1, 0 -> 1
      }
      // For others, range is mostly -100 to 100 or 0 to 100
      // Let's assume standard values come in as -100 to 100, normalize to 0..1
      return Math.max(0.1, (val + 100) / 200); 
    };

    const data = [
      norm(vectors.dopamine),
      norm(vectors.cognitiveLoad, true), // Invert
      norm(vectors.rsdSafety),
      norm(vectors.financial),
      norm(vectors.spiritual)
    ];

    const labels = ['Dopamine', 'Low Cog. Load', 'RSD Safety', 'Financial', 'Spiritual'];
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const maxRadius = Math.min(centerX, centerY) - 20;

    let animationFrameId: number;
    let time = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.02;

      // Draw grid
      ctx.strokeStyle = 'rgba(247, 245, 240, 0.1)';
      ctx.lineWidth = 1;
      for (let i = 1; i <= 3; i++) {
        ctx.beginPath();
        for (let j = 0; j < 5; j++) {
          const angle = (j * 2 * Math.PI) / 5 - Math.PI / 2;
          const r = maxRadius * (i / 3);
          const x = centerX + Math.cos(angle) * r;
          const y = centerY + Math.sin(angle) * r;
          if (j === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.stroke();
      }

      // Draw axes and labels
      ctx.fillStyle = 'rgba(247, 245, 240, 0.4)';
      ctx.font = '10px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      for (let i = 0; i < 5; i++) {
        const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
        
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(centerX + Math.cos(angle) * maxRadius, centerY + Math.sin(angle) * maxRadius);
        ctx.stroke();

        const labelX = centerX + Math.cos(angle) * (maxRadius + 15);
        const labelY = centerY + Math.sin(angle) * (maxRadius + 15);
        ctx.fillText(labels[i], labelX, labelY);
      }

      // Draw data polygon
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
        // Add subtle organic liquid breathing
        const organicPulse = Math.sin(time + i) * 0.05; 
        const r = maxRadius * Math.max(0.1, Math.min(1, data[i] + organicPulse));
        const x = centerX + Math.cos(angle) * r;
        const y = centerY + Math.sin(angle) * r;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();

      // Determine color based on overall "proficit" (if mostly expanded)
      const avg = data.reduce((a,b)=>a+b,0)/5;
      const isProficit = avg > 0.5;
      
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, maxRadius);
      if (isProficit) {
        gradient.addColorStop(0, 'rgba(106, 156, 187, 0.4)'); // Ocean
        gradient.addColorStop(1, 'rgba(159, 178, 159, 0.2)'); // Sage
        ctx.strokeStyle = 'rgba(159, 178, 159, 0.8)';
      } else {
        gradient.addColorStop(0, 'rgba(255, 191, 0, 0.2)'); // Amber
        gradient.addColorStop(1, 'rgba(194, 142, 121, 0.1)'); // Clay
        ctx.strokeStyle = 'rgba(255, 191, 0, 0.6)';
      }

      ctx.fillStyle = gradient;
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.stroke();

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => cancelAnimationFrame(animationFrameId);
  }, [vectors]);

  return (
    <div className="w-full bg-graphite/40 rounded-[32px] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.2)] border border-oatmeal/5 flex flex-col items-center">
      <h3 className="text-xs text-oatmeal/40 font-mono tracking-widest uppercase mb-4">Нейро-Матриця П'ю</h3>
      <motion.canvas
        ref={canvasRef}
        width={280}
        height={280}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, type: 'spring' }}
        className="w-full max-w-[280px]"
      />
    </div>
  );
}
