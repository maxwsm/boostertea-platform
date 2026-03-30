import { useRef, useEffect, ReactNode } from 'react';

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  /** Max shift in px (default 12) */
  strength?: number;
  /** Radius in px within which magnetism activates (default: 80) */
  radius?: number;
  onClick?: (e: React.MouseEvent) => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

/**
 * Button that subtly shifts toward the cursor when it enters the activation radius.
 * Spring-returns to origin on mouse leave.
 * Zero external deps — pure CSS transitions + JS.
 */
const MagneticButton = ({
  children,
  className = '',
  strength = 12,
  radius = 80,
  onClick,
  disabled,
  type = 'button',
}: MagneticButtonProps) => {
  const btnRef     = useRef<HTMLButtonElement>(null);
  const innerRef   = useRef<HTMLSpanElement>(null);
  const rafRef     = useRef<number | null>(null);
  const state      = useRef({ tx: 0, ty: 0, vx: 0, vy: 0 });

  useEffect(() => {
    const btn   = btnRef.current;
    const inner = innerRef.current;
    if (!btn || !inner) return;

    // Spring settle animation
    const settle = () => {
      const s = state.current;
      s.vx += (0 - s.tx) * 0.14;
      s.vy += (0 - s.ty) * 0.14;
      s.vx *= 0.68;
      s.vy *= 0.68;
      s.tx += s.vx;
      s.ty += s.vy;

      btn.style.transform   = `translate(${s.tx}px, ${s.ty}px)`;
      inner.style.transform = `translate(${s.tx * 0.4}px, ${s.ty * 0.4}px)`;

      if (Math.abs(s.tx) > 0.3 || Math.abs(s.ty) > 0.3) {
        rafRef.current = requestAnimationFrame(settle);
      } else {
        s.tx = 0; s.ty = 0; s.vx = 0; s.vy = 0;
        btn.style.transform   = '';
        inner.style.transform = '';
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = btn.getBoundingClientRect();
      const cx   = rect.left + rect.width  / 2;
      const cy   = rect.top  + rect.height / 2;
      const dx   = e.clientX - cx;
      const dy   = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < radius) {
        // Magnetic pull — stronger when closer
        const factor = (1 - dist / radius) * strength;
        state.current.tx = (dx / dist || 0) * factor;
        state.current.ty = (dy / dist || 0) * factor;
        btn.style.transition   = 'none';
        inner.style.transition = 'none';
        btn.style.transform    = `translate(${state.current.tx}px, ${state.current.ty}px)`;
        inner.style.transform  = `translate(${state.current.tx * 0.4}px, ${state.current.ty * 0.4}px)`;
      }
    };

    const handleMouseLeave = () => {
      btn.style.transition   = 'transform 0.1s';
      inner.style.transition = 'transform 0.1s';
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(settle);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    btn.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      btn.removeEventListener('mouseleave', handleMouseLeave);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [strength, radius]);

  return (
    <button
      ref={btnRef}
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`magnetic-btn ${className}`}
      style={{ display: 'inline-block', willChange: 'transform' }}
    >
      <span ref={innerRef} style={{ display: 'block', willChange: 'transform' }}>
        {children}
      </span>
    </button>
  );
};

export default MagneticButton;
