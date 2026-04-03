import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Product, useStore } from '../lib/store';
import { useTranslation } from '../lib/i18n';
import { useIntentPrefetch } from '../hooks/useIntentPrefetch';
import { trackEvent } from './TelemetryTracker';

import { pushGTMEvent } from '../lib/blog/types';

interface ProductCardProps {
  product: Product;
  index?: number;
  defaultVolume?: string;
  isHero?: boolean;
}

const ProductCard = ({ product, index = 0, defaultVolume = 'all', isHero = false }: ProductCardProps) => {
  const { addToCart } = useStore();
  const { t, language } = useTranslation();
  
  // Default to 1L
  const initialVolume = (defaultVolume === '1L' || defaultVolume === '0.25L') ? defaultVolume as '1L' | '0.25L' : '1L';
  const [volume, setVolume] = useState<'1L' | '0.25L' | 'sticks'>(initialVolume);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (defaultVolume === '1L' || defaultVolume === '0.25L') {
      setVolume(defaultVolume as '1L' | '0.25L');
    }
  }, [defaultVolume]);

  const productName        = language === 'uk' ? product.nameUk       : product.name;
  const productDescription = language === 'uk' ? product.descriptionUk : product.description;
  const productEffects     = language === 'uk' ? product.effectsUk     : product.effects;

  const isEnergy = product.category === 'energy';
  const isClassic = product.category === 'classic';
  const themeColor = isEnergy ? '#9FD356' : isClassic ? '#C9A55C' : '#8B7355';
  
  const intensity = isEnergy ? 95 : isClassic ? 75 : 40;
  const focusIntensity = 100;

  const currentPrice = volume === '1L' ? product.price1L : volume === 'sticks' ? (product.priceSticks || product.price025L) : product.price025L;
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product, volume, quantity);
    trackEvent('AddToCart', {
      content_name: productName,
      content_ids: [product.id],
      content_type: 'product',
      value: currentPrice * quantity,
      currency: 'UAH'
    });
    
    // Also track the Bio-Interaction completion
    pushGTMEvent({
      event: 'blog_mechanic_interaction',
      article_slug: product.slug,
      mechanic_type: 'add_to_cart_extractor',
      mechanic_value: quantity
    });
  };

  const handleVolumeChange = (v: '1L' | '0.25L' | 'sticks') => {
    setVolume(v);
    pushGTMEvent({
      event: 'blog_mechanic_interaction',
      article_slug: product.slug,
      mechanic_type: 'volume_slider',
      mechanic_value: v
    });
  };

  const getPortions = () => {
    switch(volume) {
      case '1L': return 33;
      case '0.25L': return 8;
      case 'sticks': return 12;
      default: return 33;
    }
  };
  const portionsCount = getPortions();
  const costPerPortion = Math.round(currentPrice / portionsCount);

  const hoverProps = useIntentPrefetch(`/products/${product.slug}`);

  return (
    <article
      itemScope itemType="https://schema.org/Product"
      className={`bento-card group relative overflow-hidden transition-all duration-500 shadow-2xl flex flex-col h-full bg-[#0a0a0c] ${
        isHero ? 'md:flex-row' : ''
      }`}
      style={{ animationDelay: `${index * 50}ms` }}
      {...hoverProps}
    >
      <div className="absolute inset-0 noise-overlay opacity-30 mix-blend-overlay pointer-events-none" />
      <meta itemProp="name" content={productName} />
      <meta itemProp="description" content={productDescription} />
      
      {/* Product Image */}
      <Link href={`/products/${product.slug}`} className={isHero ? 'md:w-1/2 relative' : 'relative'}>
        <figure className={`relative bg-[#050505] overflow-hidden m-0 ${isHero ? 'h-full aspect-auto min-h-[400px]' : 'aspect-[4/3]'}`}>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-transparent to-transparent z-10 opacity-90 pointer-events-none" />
          <div className="absolute inset-0 flex items-center justify-center p-8 z-0">
            <img
              itemProp="image"
              src={product.image}
              alt={productName}
              loading="lazy"
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700 ease-out drop-shadow-[0_20px_20px_rgba(0,0,0,1)] relative z-10"
            />
          </div>
          {/* Subtle glow behind bottle */}
          <div 
             className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full blur-[80px] opacity-20 pointer-events-none"
             style={{ backgroundColor: themeColor }}
          />
        </figure>
      </Link>

      {/* Product Info */}
      <div className={`p-6 sm:p-8 flex flex-col flex-grow relative z-20 ${isHero ? 'md:w-1/2 justify-center' : '-mt-6 bg-transparent'}`}>
        <Link href={`/products/${product.slug}`}>
          <h3 className={`archival-heading text-white mb-3 hover:opacity-80 transition-opacity ${isHero ? 'text-4xl sm:text-5xl' : 'text-3xl'}`}>
            {productName}
          </h3>
        </Link>
        <p className={`text-[#A89880] mb-5 leading-relaxed ${isHero ? 'text-base line-clamp-none' : 'text-sm line-clamp-3'}`}>
          {productDescription}
        </p>

        {/* Benefits Badges */}
        <div className="flex flex-wrap gap-2 mb-6">
          {productEffects.slice(0, 2).map((effect, i) => (
            <span key={i} className="text-xs font-medium bg-[#1A1A1A] text-[#E8DDD0] border border-[#F5F0E8]/5 px-3 py-1.5 rounded-md">
              {effect}
            </span>
          ))}
        </div>

        {/* Neural Metrics */}
        <div className="space-y-4 mb-6">
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] uppercase font-black tracking-widest" style={{ color: themeColor }}>
              <span>Energy Qi Output</span>
              <span>{intensity}%</span>
            </div>
            <div className="h-1 bg-[#1A1A1A] border border-[#F5F0E8]/5 overflow-hidden">
              <div 
                className="h-full transition-all duration-1000 ease-out" 
                style={{ width: `${intensity}%`, backgroundColor: themeColor, boxShadow: `0 0 10px ${themeColor}80` }} 
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] uppercase font-black tracking-widest text-[#C9A55C]">
              <span>Absolute Focus</span>
              <span>{focusIntensity}%</span>
            </div>
            <div className="h-1 bg-[#1A1A1A] border border-[#F5F0E8]/5 overflow-hidden">
              <div 
                className="h-full bg-[#C9A55C] shadow-[0_0_10px_rgba(201,165,92,0.5)] transition-all duration-1000 ease-out" 
                style={{ width: `${focusIntensity}%` }} 
              />
            </div>
          </div>
        </div>

        {/* Cost Matrix Block */}
        <div className="mb-6 p-4 rounded-xl border border-white/5 bg-black/40 flex flex-col gap-3 relative overflow-hidden backdrop-blur-md shadow-inner">
           <div className="absolute inset-0 noise-overlay opacity-20" />
           <div className="absolute top-0 right-0 w-32 h-32 blur-[40px] opacity-10 pointer-events-none" style={{ backgroundColor: themeColor }} />
           
           <div className="flex justify-between items-center text-sm">
             <span className="text-[#A89880] font-medium">Вихід порцій:</span>
             <span className="text-[#E8DDD0] text-lg font-black">{portionsCount} шт</span>
           </div>
           <div className="w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
           <div className="flex justify-between items-center text-sm">
             <span className="text-[#A89880] font-medium">Собівартість:</span>
             <span className="data-heavy text-[#E8DDD0] text-xl tracking-tight" style={{ textShadow: `0 0 10px ${themeColor}40` }}>
               ≈ {costPerPortion} ₴ <span className="text-xs uppercase text-[#A89880]">/ порція</span>
             </span>
           </div>
        </div>

        <div className="mt-auto relative z-20">
          {/* Action Interface (Neo-Brutalism) */}
          <div className="flex flex-col gap-3 mb-6 p-4 bg-black/60 border border-white/5 rounded-2xl shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]">
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#A89880] ml-1">Volume Protocol / Об'єм</span>
            <div className="flex gap-2">
              {['1L', '0.25L'].map((v) => (
                <button 
                  key={v}
                  onClick={(e) => { e.preventDefault(); handleVolumeChange(v as any); }}
                  className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest transition-all rounded-xl border ${
                    volume === v 
                      ? 'border-white/20 bg-white/10 shadow-[0_0_15px_rgba(255,255,255,0.05)]' 
                      : 'border-white/5 bg-transparent text-[#A89880] hover:bg-white/5'
                  }`}
                  style={volume === v ? { color: themeColor } : {}}
                >
                  {v === '1L' ? '1 ЛІТР' : '0.25 ЛІТРА'}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4 mb-5">
             <div className="flex items-center bg-black border border-white/10 rounded-xl overflow-hidden h-14 w-32 shadow-inner">
               <button onClick={(e) => { e.preventDefault(); setQuantity(Math.max(1, quantity - 1)); }} className="w-10 h-full hover:bg-white/5 text-[#E8DDD0] text-xl transition-colors flex items-center justify-center">-</button>
               <span className="flex-1 text-center data-heavy text-[#E8DDD0] text-xl">{quantity}</span>
               <button onClick={(e) => { e.preventDefault(); setQuantity(Math.min(10, quantity + 1)); }} className="w-10 h-full hover:bg-white/5 text-[#E8DDD0] text-xl transition-colors flex items-center justify-center">+</button>
             </div>
             <div className="flex-1 flex flex-col items-end justify-center">
               <span className="text-[10px] uppercase font-mono tracking-widest text-[#A89880] mb-1">TOTAL / Сума</span>
               <p className="data-heavy text-4xl" style={{ color: themeColor, textShadow: `0 0 20px ${themeColor}40` }}>
                 {currentPrice * quantity}₴
               </p>
             </div>
          </div>

          <button
            onClick={handleAddToCart}
            className="w-full relative py-5 bg-[#C4956A] hover:bg-[#D4A57A] text-black text-xs font-black uppercase tracking-[0.3em] rounded-xl transition-all duration-300 flex items-center justify-center gap-3 group active:scale-[0.98] shadow-[0_0_30px_rgba(196,149,106,0.3)]"
          >
            <span>До кошика</span>
            <div className="w-6 h-6 rounded-full border border-black/20 flex items-center justify-center group-hover:bg-black/10 transition-colors">
              <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
          </button>
          
          <div className="mt-4 flex items-center justify-center gap-4 text-[10px] sm:text-xs text-[#A89880] font-medium tracking-wide">
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" style={{ color: themeColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg>
              100% Натурально
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" style={{ color: themeColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg>
              Готово за 15с
            </span>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
