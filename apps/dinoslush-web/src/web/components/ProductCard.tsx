import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Product, useStore } from '../lib/store';
import { useTranslation } from '../lib/i18n';
import { useIntentPrefetch } from '../hooks/useIntentPrefetch';

interface ProductCardProps {
  product: Product;
  index?: number;
  defaultVolume?: string;
}

const ProductCard = ({ product, index = 0, defaultVolume = 'all' }: ProductCardProps) => {
  const { addToCart } = useStore();
  const { t, language } = useTranslation();
  
  // Start with 1L or 0.25L depending on what's available
  const initialVolume = (defaultVolume === '1L' || defaultVolume === '0.25L') ? defaultVolume as '1L' | '0.25L' : '1L';
  const [volume, setVolume] = useState<'1L' | '0.25L' | 'sticks'>(initialVolume);
  const [quantity, setQuantity] = useState(1);

  // Sync with prop changes from products filter
  useEffect(() => {
    if (defaultVolume === '1L' || defaultVolume === '0.25L') {
      setVolume(defaultVolume as '1L' | '0.25L');
    }
  }, [defaultVolume]);

  const productName        = language === 'uk' ? product.nameUk       : product.name;
  const productDescription = language === 'uk' ? product.descriptionUk : product.description;
  const productEffects     = language === 'uk' ? product.effectsUk     : product.effects;

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'energy':     return t('products.filters.energy');
      case 'classic':    return t('products.filters.classic');
      case 'relaxation': return t('products.filters.relaxation');
      default:           return category;
    }
  };

  const currentPrice = volume === '1L' ? product.price1L : volume === 'sticks' ? (product.priceSticks || product.price025L) : product.price025L;
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product, volume, quantity);
  };

  const getPortions = () => {
    switch(volume) {
      case '1L': return 33;
      case '0.25L': return 8;
      case 'sticks': return 12;
      default: return 33;
    }
  };
  const portionsCount = getPortions() * quantity;
  const costPerPortion = Math.round((currentPrice * quantity) / portionsCount);

  const isPreRelease = product.name.includes('BoosterShot') || product.name.includes('BoosterMix');
  const launchDate = new Date('2026-04-13T00:00:00Z');
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!isPreRelease) return;
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = launchDate.getTime() - now;
      if (distance < 0) return clearInterval(interval);
      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isPreRelease]);

  const hoverProps = useIntentPrefetch(`/products/${product.slug}`);

  return (
    <article
      itemScope itemType="https://schema.org/Product"
      className="group relative rounded-2xl overflow-hidden border border-[var(--card-border)] hover:border-[var(--border-accent)] bg-gradient-to-b from-[#1A1A1A] to-[#0D0D0D] transition-all duration-300 hover:shadow-xl flex flex-col h-full"
      style={{ animationDelay: `${index * 100}ms` }}
      {...hoverProps}
    >
      <meta itemProp="name" content={productName} />
      <meta itemProp="description" content={productDescription} />
      {/* Product Image */}
      <Link href={`/catalog/${product.slug}`}>
        <figure className="relative aspect-square p-6 bg-[var(--theme-toggle-bg)] overflow-hidden m-0">
          <img
            itemProp="image"
            src={product.image}
            alt={productName}
            width="400"
            height="400"
            loading="lazy"
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 bg-[var(--accent-muted)] text-[var(--accent)] text-xs font-medium rounded-full border border-[var(--accent)]/20">
              {getCategoryLabel(product.category)}
            </span>
          </div>
          {isPreRelease && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center pointer-events-none">
               <span className="text-[var(--accent)] uppercase font-bold tracking-[0.2em] text-sm mb-2 drop-shadow-lg">Дроп через</span>
               <div className="flex gap-2 text-white font-mono text-xl drop-shadow-md">
                 <div className="flex flex-col items-center"><span className="text-2xl font-black">{timeLeft.days}</span><span className="text-[10px] text-zinc-400">ДНІВ</span></div><span className="text-[var(--accent)] text-2xl">:</span>
                 <div className="flex flex-col items-center"><span className="text-2xl font-black">{timeLeft.hours.toString().padStart(2, '0')}</span><span className="text-[10px] text-zinc-400">ГОД</span></div><span className="text-[var(--accent)] text-2xl">:</span>
                 <div className="flex flex-col items-center"><span className="text-2xl font-black">{timeLeft.minutes.toString().padStart(2, '0')}</span><span className="text-[10px] text-zinc-400">ХВ</span></div><span className="text-[var(--accent)] text-2xl">:</span>
                 <div className="flex flex-col items-center"><span className="text-2xl font-black">{timeLeft.seconds.toString().padStart(2, '0')}</span><span className="text-[10px] text-zinc-400">СЕК</span></div>
               </div>
            </div>
          )}
          {product.isBundle && !isPreRelease && (
            <div className="absolute top-4 right-4">
              <span className="px-2 py-1 bg-[var(--accent)] text-[var(--bg-primary)] text-xs font-bold rounded-full">
                −30%
              </span>
            </div>
          )}
        </figure>
      </Link>

      {/* Product Info */}
      <div className="p-6 flex flex-col flex-grow">
        <Link href={`/products/${product.slug}`}>
          <h3 className="text-2xl text-[var(--text-primary)] mb-2 group-hover:text-[var(--accent)] transition-colors duration-300" style={{ fontFamily: 'var(--font-heading)' }}>
            {productName}
          </h3>
        </Link>
        <p className="text-[var(--text-muted)] text-sm mb-4 line-clamp-2">
          {productDescription}
        </p>
        <div className="flex flex-wrap gap-2 mb-3">
          {productEffects.slice(0, 2).map((effect, i) => (
            <span key={i} className="text-xs text-[var(--secondary)] bg-[var(--secondary-muted)] px-2 py-1 rounded">
              {effect}
            </span>
          ))}
        </div>

        {/* 360° UX: Ice Retro Prehistoric Metrics */}
        <div className="mb-4 space-y-3 p-3 rounded-xl bg-white/5 border border-[#00F0FF]/30 backdrop-blur-[20px] shadow-[inset_0_0_20px_rgba(255,255,255,0.05)]">
          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-[11px] uppercase text-[#00F0FF] font-black tracking-widest drop-shadow-[0_0_5px_rgba(0,240,255,0.5)]">
              <span>Freeze Level 🧊</span>
              <span>{product.category === 'energy' ? 'ABSOLUTE ZERO' : product.category === 'classic' ? 'SUB-ZERO' : 'CHILL'}</span>
            </div>
            <div className="h-2 w-full bg-[#050510] rounded-sm overflow-hidden border border-[#00F0FF]/20 relative">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-[#00F0FF] shadow-[0_0_15px_#00F0FF]" 
                style={{ width: product.category === 'energy' ? '100%' : product.category === 'classic' ? '70%' : '40%' }}
              />
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScxMCcgaGVpZ2h0PScxMCc+PGNpcmNsZSBjeD0nNScgY3k9JzUnIHI9JzInIGZpbGw9J3JnYmEoMjU1LDI1NSwyNTUsMC4yKScvPjwvc3ZnPg==')] opacity-50"></div>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-[11px] uppercase text-[#FF007F] font-black tracking-widest drop-shadow-[0_0_5px_rgba(255,0,127,0.5)]">
               <span>Dino Power 🦖</span>
               <span>MAX</span>
            </div>
            <div className="h-2 w-full bg-[#050510] rounded-sm overflow-hidden border border-[#FF007F]/20 relative">
               <div className="h-full bg-gradient-to-r from-[#FF007F] to-[#FF8811]" style={{ width: '100%' }} />
               <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScxMCcgaGVpZ2h0PScxMCc+PGNpcmNsZSBjeD0nNScgY3k9JzUnIHI9JzInIGZpbGw9J3JnYmEoMjU1LDI1NSwyNTUsMC4yKScvPjwvc3ZnPg==')] opacity-50"></div>
            </div>
          </div>
        </div>

        {/* Volume & Quantity Selector */}
        <div className={`mt-5 flex flex-col gap-3 ${isPreRelease ? 'opacity-50 pointer-events-none grayscale' : ''}`}>
          <div className="flex gap-2 text-sm">
            <button 
              onClick={(e) => { e.preventDefault(); setVolume('1L'); }}
              className={`flex-1 py-1.5 rounded-md border transition-colors ${volume === '1L' ? 'bg-[var(--accent)]/10 border-[var(--accent)] text-[var(--accent)]' : 'border-[var(--card-border)] text-[var(--text-muted)] hover:border-[var(--border-accent)]'}`}
            >
              1 Л
            </button>
            <button 
              onClick={(e) => { e.preventDefault(); setVolume('0.25L'); }}
              className={`flex-1 py-1.5 rounded-md border transition-colors ${volume === '0.25L' ? 'bg-[var(--accent)]/10 border-[var(--accent)] text-[var(--accent)]' : 'border-[var(--card-border)] text-[var(--text-muted)] hover:border-[var(--border-accent)]'}`}
            >
              0.25 Л
            </button>
            {product.priceSticks && (
              <button 
                onClick={(e) => { e.preventDefault(); setVolume('sticks'); }}
                className={`flex-1 py-1.5 rounded-md border transition-colors ${volume === 'sticks' ? 'bg-[var(--accent)]/10 border-[var(--accent)] text-[var(--accent)]' : 'border-[var(--card-border)] text-[var(--text-muted)] hover:border-[var(--border-accent)]'}`}
              >
                Стіки
              </button>
            )}
          </div>
          
          <div className="flex items-center gap-4 mt-2">
             <div className="flex items-center bg-[var(--bg-secondary)] border border-[var(--card-border)] rounded-lg overflow-hidden">
               <button onClick={(e) => { e.preventDefault(); setQuantity(Math.max(1, quantity - 1)); }} className="px-3 py-1.5 hover:bg-[var(--theme-toggle-bg)] text-[var(--text-primary)] transition-colors">-</button>
               <span className="px-4 py-1.5 text-[var(--text-primary)] font-medium min-w-[3rem] text-center border-x border-[var(--card-border)]">{quantity}</span>
               <button onClick={(e) => { e.preventDefault(); setQuantity(quantity + 1); }} className="px-3 py-1.5 hover:bg-[var(--theme-toggle-bg)] text-[var(--text-primary)] transition-colors">+</button>
             </div>
             <p className="text-[var(--accent)] text-2xl font-bold ml-auto tabular-nums">{currentPrice * quantity}₴</p>
          </div>
          
          {/* Summer Ice Point-of-Sale Calculator */}
          <div className="mt-2 p-3 rounded-xl bg-gradient-to-br from-[#00F0FF]/10 to-[#FF007F]/10 border border-white/10 backdrop-blur-[10px] flex flex-col gap-1.5 relative overflow-hidden">
            <div className="absolute -top-4 -right-4 text-6xl opacity-10">🧊</div>
            <div className="flex justify-between items-center text-xs sm:text-sm font-bold z-10 w-full">
              <span className="text-white/70">Вихід Слашів:</span>
              <span className="text-[#00F0FF] drop-shadow-[0_0_8px_rgba(0,240,255,0.6)] font-black text-lg tabular-nums">{portionsCount} ст</span>
            </div>
            <div className="flex justify-between items-center text-xs sm:text-sm border-t border-white/10 pt-1.5 mt-0.5 z-10 w-full font-bold">
              <span className="text-white/70">Собівартість:</span>
              <span className="text-[#FF007F] font-black text-sm">≈ {costPerPortion} ₴ / стакан</span>
            </div>
          </div>
        </div>

        {isPreRelease ? (
          <button
            disabled
            className="mt-4 w-full relative px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--card-border)] text-[var(--text-muted)] text-sm font-bold rounded-lg cursor-not-allowed text-center uppercase tracking-widest flex items-center justify-center"
          >
            Скоро у продажу
          </button>
        ) : (
          <div className="mt-4">
            <button
              onClick={handleAddToCart}
              className="w-full relative px-4 py-3.5 bg-gradient-to-r from-[var(--accent)] to-[#D4A57A] text-[var(--bg-primary)] text-sm font-bold rounded-xl hover:shadow-[0_0_20px_rgba(196,149,106,0.3)] active:scale-95 transition-all flex items-center justify-center gap-2 group"
            >
              <span>Спробувати сорт</span>
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
            <div className="mt-3 flex items-center justify-center gap-3 text-[var(--text-muted)] text-[10px] sm:text-[11px] opacity-80">
              <span className="flex items-center gap-1"><span className="text-[#9FD356]">✓</span> 100% Натурально</span>
              <span className="flex items-center gap-1"><span className="text-[#9FD356]">✓</span> Готово за 15с</span>
            </div>
          </div>
        )}
      </div>
    </article>
  );
};

export default ProductCard;
