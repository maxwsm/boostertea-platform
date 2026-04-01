import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Product, useStore } from '../lib/store';
import { useTranslation } from '../lib/i18n';
import { useIntentPrefetch } from '../hooks/useIntentPrefetch';
import { trackEvent } from './TelemetryTracker';

interface ProductCardProps {
  product: Product;
  index?: number;
  defaultVolume?: string;
}

const ProductCard = ({ product, index = 0, defaultVolume = 'all' }: ProductCardProps) => {
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
      className="group relative rounded-[2rem] overflow-hidden border border-[#F5F0E8]/5 hover:border-[var(--border-accent)] bg-[#0D0D0D] transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.5)] flex flex-col h-full"
      style={{ animationDelay: `${index * 100}ms` }}
      {...hoverProps}
    >
      <meta itemProp="name" content={productName} />
      <meta itemProp="description" content={productDescription} />
      
      {/* Product Image */}
      <Link href={`/products/${product.slug}`}>
        <figure className="relative aspect-[4/3] bg-[#141414] overflow-hidden m-0">
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] to-transparent z-10 opacity-80 pointer-events-none" />
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
      <div className="p-6 sm:p-8 flex flex-col flex-grow relative z-20 -mt-6 bg-[#0D0D0D]">
        <Link href={`/products/${product.slug}`}>
          <h3 className="text-3xl text-white mb-3 hover:opacity-80 transition-opacity" style={{ fontFamily: '"Syne", sans-serif' }}>
            {productName}
          </h3>
        </Link>
        <p className="text-[#A89880] text-sm mb-5 leading-relaxed line-clamp-3">
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
        <div className="mb-6 p-4 rounded-xl border border-[#C9A55C]/20 bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] flex flex-col gap-3 relative overflow-hidden">
           {/* Ambient Glow */}
           <div className="absolute top-0 right-0 w-24 h-24 bg-[#00D4FF]/5 blur-[30px] rounded-full pointer-events-none" />
           
           <div className="flex justify-between items-center text-sm">
             <span className="text-[#A89880] font-medium">Вихід порцій:</span>
             <span className="text-[#E8DDD0] text-lg font-black">{portionsCount} шт</span>
           </div>
           <div className="w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
           <div className="flex justify-between items-center text-sm">
             <span className="text-[#A89880] font-medium">Собівартість:</span>
             <span className="text-[#00D4FF] text-lg font-black tracking-tight" style={{ textShadow: '0 0 10px rgba(0, 212, 255, 0.4)' }}>
               ≈ {costPerPortion} ₴ / чашка
             </span>
           </div>
        </div>

        <div className="mt-auto">
          {/* Volume Filter Header styling */}
          <div className="flex gap-1 mb-4 border border-[#F5F0E8]/10 rounded-lg overflow-hidden">
            {['1L', '0.25L'].map((v) => (
              <button 
                key={v}
                onClick={(e) => { e.preventDefault(); setVolume(v as any); }}
                className={`flex-1 py-2.5 text-sm font-medium transition-all ${
                  volume === v 
                    ? 'text-[#9FD356] bg-white/5' 
                    : 'text-[#A89880] hover:text-[#E8DDD0] hover:bg-white/5'
                }`}
                style={volume === v ? { color: themeColor } : {}}
              >
                {v === '1L' ? '1 Л' : '0.25 Л'}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 mb-6">
             <div className="flex items-center bg-[#1A1A1A] border border-[#F5F0E8]/10 rounded-xl overflow-hidden h-14">
               <button onClick={(e) => { e.preventDefault(); setQuantity(Math.max(1, quantity - 1)); }} className="w-12 h-full hover:bg-white/5 text-[#E8DDD0] text-lg transition-colors flex items-center justify-center">-</button>
               <span className="w-8 text-center text-[#E8DDD0] font-bold text-lg">{quantity}</span>
               <button onClick={(e) => { e.preventDefault(); setQuantity(Math.min(10, quantity + 1)); }} className="w-12 h-full hover:bg-white/5 text-[#E8DDD0] text-lg transition-colors flex items-center justify-center">+</button>
             </div>
             <div className="flex-1 text-right">
               <p className="text-3xl font-black tracking-tighter" style={{ color: themeColor, textShadow: `0 0 15px ${themeColor}40` }}>
                 {currentPrice * quantity}₴
               </p>
             </div>
          </div>

          <button
            onClick={handleAddToCart}
            className="w-full relative px-6 py-4 bg-gradient-to-r text-[#0D0D0D] text-sm font-black uppercase tracking-widest rounded-xl transition-all duration-300 flex items-center justify-center gap-3 group"
            style={{ 
              backgroundImage: `linear-gradient(to right, ${themeColor}, #E8B98A)`,
              boxShadow: `0 0 25px ${themeColor}60`
            }}
          >
            <span>Спробувати сорт</span>
            <svg className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
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
