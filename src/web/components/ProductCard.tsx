import { useRef, useEffect, useState, useCallback } from 'react';
import { Link } from 'wouter';
import { Product, useStore } from '../lib/store';
import { useTranslation } from '../lib/i18n';

interface ProductCardProps {
  product: Product;
  index?: number;
}

// Spring physics constants
const STIFFNESS = 0.08;
const DAMPING   = 0.72;
const MAX_TILT  = 18;

const ProductCard = ({ product, index = 0 }: ProductCardProps) => {
  const { addToCart } = useStore();
  const cardRef     = useRef<HTMLDivElement>(null);
  const specularRef = useRef<HTMLDivElement>(null);
  const rafRef      = useRef<number | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const { t, language } = useTranslation();

  // Spring state (mutable, not React state to avoid re-renders)
  const spring = useRef({ rotX: 0, rotY: 0, vX: 0, vY: 0 });

  const applyTransform = useCallback((rotX: number, rotY: number) => {
    const card = cardRef.current;
    if (!card) return;
    // Shadow shifts opposite to tilt direction for depth realism
    const shadowX = rotY * 1.2;
    const shadowY = -rotX * 1.2;
    card.style.transform = `perspective(1200px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.04)`;
    card.style.boxShadow = `${shadowX}px ${shadowY + 20}px 60px rgba(0,0,0,0.45), 0 4px 24px rgba(0,0,0,0.25)`;
  }, []);

  // Spring loop: runs when mouse leaves, animates back to 0,0
  const springLoop = useCallback(() => {
    const s = spring.current;
    s.vX += (0 - s.rotX) * STIFFNESS;
    s.vY += (0 - s.rotY) * STIFFNESS;
    s.vX *= DAMPING;
    s.vY *= DAMPING;
    s.rotX += s.vX;
    s.rotY += s.vY;

    applyTransform(s.rotX, s.rotY);

    if (Math.abs(s.rotX) > 0.05 || Math.abs(s.rotY) > 0.05 ||
        Math.abs(s.vX) > 0.05  || Math.abs(s.vY) > 0.05) {
      rafRef.current = requestAnimationFrame(springLoop);
    } else {
      // Settled — clean up
      s.rotX = 0; s.rotY = 0; s.vX = 0; s.vY = 0;
      const card = cardRef.current;
      if (card) {
        card.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) scale(1)';
        card.style.boxShadow = '';
      }
    }
  }, [applyTransform]);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;

      const rotX = ((y - cy) / cy) * -MAX_TILT;
      const rotY = ((x - cx) / cx) *  MAX_TILT;

      spring.current.rotX = rotX;
      spring.current.rotY = rotY;
      applyTransform(rotX, rotY);

      // Specular highlight: radial gradient at mouse position
      const gx = (x / rect.width)  * 100;
      const gy = (y / rect.height) * 100;
      if (specularRef.current) {
        specularRef.current.style.background =
          `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.05) 40%, transparent 65%)`;
        specularRef.current.style.opacity = '1';
      }
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
      if (specularRef.current) specularRef.current.style.opacity = '0';
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(springLoop);
    };

    const handleMouseEnter = () => setIsHovered(true);

    card.addEventListener('mousemove', handleMouseMove, { passive: true });
    card.addEventListener('mouseleave', handleMouseLeave);
    card.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
      card.removeEventListener('mouseenter', handleMouseEnter);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [applyTransform, springLoop]);

  const productName        = language === 'uk' ? product.nameUk        : product.name;
  const productDescription = language === 'uk' ? product.descriptionUk  : product.description;
  const productEffects     = language === 'uk' ? product.effectsUk      : product.effects;

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'energy':     return t('products.filters.energy');
      case 'classic':    return t('products.filters.classic');
      case 'relaxation': return t('products.filters.relaxation');
      default:           return category;
    }
  };

  return (
    <div
      ref={cardRef}
      className="group relative rounded-2xl overflow-hidden border border-[var(--card-border)] hover:border-[var(--border-accent)] card-shimmer"
      style={{
        animationDelay: `${index * 100}ms`,
        transformStyle: 'preserve-3d',
        transition: 'border-color 0.3s ease',
        background: 'var(--gradient-card)',
        willChange: 'transform',
      }}
    >
      {/* Specular / gloss highlight — tracks mouse */}
      <div
        ref={specularRef}
        className="absolute inset-0 pointer-events-none z-20 rounded-2xl"
        style={{
          opacity: 0,
          transition: 'opacity 0.3s ease',
          mixBlendMode: 'screen',
        }}
      />

      {/* Ambient glow layer (behind) */}
      <div
        className={`absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
        style={{
          background: 'radial-gradient(ellipse at 50% 110%, var(--accent-subtle) 0%, transparent 65%)',
          transform: 'translateZ(-10px)',
        }}
      />

      {/* Product Image */}
      <Link href={`/products/${product.slug}`}>
        <div className="relative aspect-square p-6 bg-gradient-to-br from-[var(--theme-toggle-bg)] to-transparent overflow-hidden">
          <img
            src={product.image}
            alt={productName}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-contain"
            style={{
              transform: isHovered ? 'translateZ(40px) scale(1.08)' : 'translateZ(0) scale(1)',
              transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          />

          {/* Category badge — closer to viewer */}
          <div className="absolute top-4 left-4" style={{ transform: 'translateZ(28px)' }}>
            <span className="px-3 py-1 bg-[var(--accent-muted)] text-[var(--accent)] text-xs font-medium rounded-full backdrop-blur-sm border border-[var(--accent)]/20">
              {getCategoryLabel(product.category)}
            </span>
          </div>

          {/* NEW/BESTSELLER badge */}
          {product.isBundle && (
            <div className="absolute top-4 right-4" style={{ transform: 'translateZ(28px)' }}>
              <span className="px-2 py-1 bg-[var(--accent)] text-[var(--bg-primary)] text-xs font-bold rounded-full">
                −30%
              </span>
            </div>
          )}
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-6 pt-0" style={{ transform: 'translateZ(14px)' }}>
        <Link href={`/products/${product.slug}`}>
          <h3
            className="text-2xl text-[var(--text-primary)] mb-2 group-hover:text-[var(--accent)] transition-colors duration-300"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {productName}
          </h3>
        </Link>

        <p className="text-[var(--text-muted)] text-sm mb-4 line-clamp-2">
          {productDescription}
        </p>

        {/* Effects */}
        <div className="flex flex-wrap gap-2 mb-4">
          {productEffects.slice(0, 2).map((effect, i) => (
            <span
              key={i}
              className="text-xs text-[var(--secondary)] bg-[var(--secondary-muted)] px-2 py-1 rounded"
            >
              {effect}
            </span>
          ))}
        </div>

        {/* Bundle badge */}
        {product.isBundle && (
          <div className="mb-3 px-3 py-1.5 bg-[var(--accent)]/15 border border-[var(--accent)]/30 rounded-lg text-center">
            <span className="text-[var(--accent)] text-xs font-semibold">
              Пуер + Да Хун Пао + ГАБА — економія 30%
            </span>
          </div>
        )}

        {/* Price and CTA */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[var(--text-subtle)] text-xs mb-1">{t('products.from')}</p>
            {product.isBundle ? (
              <p className="text-[var(--accent)] text-2xl font-bold">
                {product.price025L}₴
                <span className="text-sm text-[var(--text-subtle)] font-normal ml-1">/3× 0.25л</span>
              </p>
            ) : (
              <p className="text-[var(--accent)] text-2xl font-bold">
                {Math.min(product.price025L, product.priceSticks ?? product.price025L)}₴
                <span className="text-sm text-[var(--text-subtle)] font-normal ml-1">
                  {(product.priceSticks ?? 0) < product.price025L ? '/стіки' : '/0.25л'}
                </span>
              </p>
            )}
          </div>

          <button
            onClick={(e) => {
              e.preventDefault();
              addToCart(product, '1L', 1);
            }}
            className="relative px-4 py-2 bg-[var(--accent)] text-[var(--bg-primary)] text-sm font-semibold rounded-lg hover:bg-[var(--accent-hover)] active:scale-95 overflow-hidden group/btn"
            style={{ transition: 'background 0.2s, transform 0.1s' }}
          >
            <span className="relative z-10">{t('products.addToCart')}</span>
            <div className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-500 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          </button>
        </div>
      </div>

      {/* Bottom accent line — animates in */}
      <div
        className={`absolute bottom-0 left-0 right-0 h-[2px] transition-all duration-500 ${isHovered ? 'opacity-80 scale-x-100' : 'opacity-0 scale-x-0'}`}
        style={{ background: 'linear-gradient(90deg, transparent, var(--accent) 30%, var(--accent) 70%, transparent)' }}
      />
    </div>
  );
};

export default ProductCard;
