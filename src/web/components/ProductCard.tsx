import { useRef, useEffect, useState } from 'react';
import { Link } from 'wouter';
import { Product, useStore } from '../lib/store';
import { useTranslation } from '../lib/i18n';

interface ProductCardProps {
  product: Product;
  index?: number;
}

const ProductCard = ({ product, index = 0 }: ProductCardProps) => {
  const { addToCart } = useStore();
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const { t, language } = useTranslation();

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;
      
      card.style.transform = `
        perspective(1000px) 
        rotateX(${rotateX}deg) 
        rotateY(${rotateY}deg) 
        translateY(-8px)
      `;
    };

    const handleMouseLeave = () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Get localized product data
  const productName = language === 'uk' ? product.nameUk : product.name;
  const productDescription = language === 'uk' ? product.descriptionUk : product.description;
  const productEffects = language === 'uk' ? product.effectsUk : product.effects;

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'energy': return t('products.filters.energy');
      case 'classic': return t('products.filters.classic');
      case 'relaxation': return t('products.filters.relaxation');
      default: return category;
    }
  };

  return (
    <div 
      ref={cardRef}
      className="group relative bg-[var(--gradient-card)] rounded-2xl overflow-hidden border border-[var(--card-border)] hover:border-[var(--border-accent)] transition-all duration-300 card-shimmer"
      style={{ 
        animationDelay: `${index * 100}ms`,
        transformStyle: 'preserve-3d',
        transition: 'transform 0.15s ease-out, border-color 0.3s ease, box-shadow 0.3s ease',
        background: 'var(--gradient-card)'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Glow effect on hover */}
      <div 
        className={`absolute inset-0 bg-gradient-to-br from-[var(--accent-subtle)] via-transparent to-[var(--secondary-muted)] opacity-0 transition-opacity duration-500 rounded-2xl ${isHovered ? 'opacity-100' : ''}`}
        style={{ transform: 'translateZ(-10px)' }}
      />

      {/* Product Image */}
      <Link href={`/products/${product.slug}`}>
        <div className="relative aspect-square p-6 bg-gradient-to-br from-[var(--theme-toggle-bg)] to-transparent overflow-hidden">
          <img 
            src={product.image} 
            alt={productName}
            loading="lazy"
            decoding="async"
            className={`w-full h-full object-contain transition-all duration-500 ${isHovered ? 'scale-110' : 'scale-100'}`}
            style={{ transform: isHovered ? 'translateZ(30px) scale(1.1)' : 'translateZ(0) scale(1)' }}
          />
          
          {/* Category badge */}
          <div className="absolute top-4 left-4" style={{ transform: 'translateZ(20px)' }}>
            <span className="px-3 py-1 bg-[var(--accent-muted)] text-[var(--accent)] text-xs font-medium rounded-full backdrop-blur-sm">
              {getCategoryLabel(product.category)}
            </span>
          </div>

          {/* Hover shine effect */}
          <div 
            className={`absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
          />
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-6 pt-0" style={{ transform: 'translateZ(10px)' }}>
        <Link href={`/products/${product.slug}`}>
          <h3 
            className="text-2xl text-[var(--text-primary)] mb-2 group-hover:text-[var(--accent)] transition-colors"
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
            className="relative px-4 py-2 bg-[var(--accent)] text-[var(--bg-primary)] text-sm font-semibold rounded-lg hover:bg-[var(--accent-hover)] transition-all active:scale-95 overflow-hidden group/btn"
          >
            <span className="relative z-10">{t('products.addToCart')}</span>
            {/* Button shine on hover */}
            <div className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-500 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          </button>
        </div>
      </div>

      {/* Bottom glow line */}
      <div 
        className={`absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent transition-opacity duration-300 ${isHovered ? 'opacity-50' : 'opacity-0'}`}
      />
    </div>
  );
};

export default ProductCard;
