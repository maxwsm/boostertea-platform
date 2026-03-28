"use client";
import { useRef, useState, memo } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Sticker, Shirt, Coffee, Gift, ExternalLink, Check, Sparkles } from 'lucide-react';
import { Button } from '@myth/components/ui/button';
import { useTranslation } from '@myth/hooks/useTranslation';
import { useStore } from '../../lib/store';
import { toast } from 'sonner';

interface MerchItemProps {
  item: {
    id: string;
    name: string;
    nameUa: string;
    description: string;
    descriptionUa: string;
    price: string;
    image: string;
    category: string;
    badge?: string;
    features: string[];
  };
  index: number;
}

const MerchItem = memo(function MerchItem({ item, index }: MerchItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { t, language } = useTranslation();
  const { addAccessoryToCart, setCartDrawerOpen } = useStore();

  const getBadgeText = (badge: string) => {
    const badges: Record<string, { en: string; ua: string }> = {
      'Bestseller': { en: 'Bestseller', ua: 'Хіт' },
      'New': { en: 'New', ua: 'Новинка' },
      'Limited': { en: 'Limited', ua: 'Лімітка' },
      'Hot!': { en: 'Hot!', ua: 'Гаряче!' },
    };
    return badges[badge]?.[language] || badge;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative group"
    >
      <motion.div
        animate={{ 
          scale: isHovered ? 1.02 : 1,
          y: isHovered ? -8 : 0 
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="relative"
      >
        <div className="relative overflow-hidden rounded-3xl bg-white border border-[#1B2E1B]/10 shadow-lg shadow-black/5">
          {/* Badge */}
          {item.badge && (
            <motion.div 
              className="absolute top-4 left-4 z-10 px-4 py-1.5 bg-gradient-to-r from-[#C9A227] to-[#8B1A1A] text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-lg"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring' }}
            >
              {getBadgeText(item.badge)}
            </motion.div>
          )}

          {/* Image */}
          <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-[#F5F0E8] to-[#E8E4DC]">
            <motion.img
              src={item.image}
              alt={language === 'ua' ? item.nameUa : item.name}
              className="w-full h-full object-cover"
              animate={{ scale: isHovered ? 1.1 : 1 }}
              transition={{ duration: 0.5 }}
              loading="lazy"
              decoding="async"
            />
            
            {/* Overlay on hover */}
            <motion.div 
              className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-end justify-center pb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: isHovered ? 0 : 20, opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <Button 
                  onClick={() => {
                    if (item.originalProduct) {
                       addAccessoryToCart(item.originalProduct as any, 1);
                    }
                    toast.success(language === 'ua' ? 'Додано до кошика!' : 'Added to cart!');
                    setCartDrawerOpen(true);
                  }}
                  className="bg-white text-[#0D0D0D] hover:bg-white/90 font-bold shadow-xl"
                >
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  {t('merch.cta')}
                </Button>
              </motion.div>
            </motion.div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="text-xs text-[#8B1A1A] font-bold uppercase tracking-widest mb-2">
              {item.category}
            </div>
            <h3 className="text-lg font-bold text-[#0D0D0D] mb-2">
              {language === 'ua' ? item.nameUa : item.name}
            </h3>
            <p className="text-sm text-[#0D0D0D]/50 mb-4 line-clamp-2">
              {language === 'ua' ? item.descriptionUa : item.description}
            </p>
            
            {/* Features */}
            <div className="flex flex-wrap gap-2 mb-4">
              {item.features.map((feature, i) => (
                <span key={i} className="inline-flex items-center gap-1 text-xs text-[#0D0D0D]/40 bg-[#F5F0E8] px-2 py-1 rounded-full">
                  <Check className="w-3 h-3 text-[#27AE60]" />
                  {feature}
                </span>
              ))}
            </div>

            {/* Price */}
            <div className="flex items-center justify-between">
              <span className="text-2xl font-black text-[#8B1A1A]">{item.price}</span>
              <span className="text-xs text-[#0D0D0D]/40 font-medium">{t('merch.comingSoon')}</span>
            </div>
          </div>
        </div>

        {/* Glow Effect */}
        <motion.div 
          className="absolute -inset-2 rounded-3xl blur-xl bg-[#C9A227]/20 -z-10"
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>
    </motion.div>
  );
});

export default function Merch() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const { t, language } = useTranslation();
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', label: t('merch.categories.all'), icon: ShoppingBag },
    { id: 'dry_tea', label: 'Преміальний Чай', icon: Sparkles },
    { id: 'apparel', label: t('merch.categories.apparel'), icon: Shirt },
    { id: 'stickers', label: t('merch.categories.stickers'), icon: Sticker },
  ];

  const merchItems = accessoryProducts
    .filter(p => p.subcategory === 'dry_tea' || p.subcategory === 'apparel' || p.subcategory === 'stickers')
    .map(p => ({
      id: p.id,
      name: p.nameEn || p.nameUk,
      nameUa: p.nameUk,
      description: p.descriptionEn || p.descriptionUk,
      descriptionUa: p.descriptionUk,
      price: `${p.price} ₴`,
      image: p.image || '/images/products/merch-hoodie-8k.png',
      category: p.subcategory,
      badge: p.subcategory === 'dry_tea' ? 'Дзен' : p.subcategory === 'stickers' ? 'Хіт' : 'Лімітка',
      features: p.subcategory === 'dry_tea' 
        ? ['Стародавні традиції', 'Чиста енергія Ці'] 
        : p.subcategory === 'apparel' 
          ? ['Преміум бавовна', 'Вишивка'] 
          : ['Вініл', 'Водотривкі'],
      originalProduct: p
    }));

  const filteredItems = activeCategory === 'all' 
    ? merchItems 
    : merchItems.filter(item => item.category === activeCategory);

  return (
    <section 
      id="merch"
      ref={sectionRef}
      className="relative py-24 sm:py-32 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#F5F0E8] via-[#FAF8F5] to-[#F5F0E8]" />
      
      {/* Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          className="absolute w-[500px] h-[500px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(201, 162, 39, 0.1) 0%, transparent 70%)',
            right: '-10%',
            top: '20%',
          }}
          animate={{ scale: [1, 1.2, 1], rotate: [0, 10, 0] }}
          transition={{ duration: 15, repeat: Infinity }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.span 
            className="inline-flex items-center gap-2 px-5 py-2 bg-[#C9A227]/10 border border-[#C9A227]/20 rounded-full text-[#C9A227] text-sm font-bold uppercase tracking-widest mb-6"
            whileHover={{ scale: 1.05 }}
          >
            <Gift className="w-4 h-4" />
            {t('merch.badge')}
          </motion.span>
          <h2 className="text-5xl sm:text-6xl md:text-7xl font-black text-[#0D0D0D] mb-6 tracking-tight">
            {t('merch.title1')} <span className="text-gradient">{t('merch.title2')}</span>
          </h2>
          <p className="text-xl text-[#0D0D0D]/60 max-w-2xl mx-auto">
            {t('merch.description')}
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-14"
        >
          {categories.map((cat) => (
            <motion.button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`
                flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all duration-300
                ${activeCategory === cat.id
                  ? 'bg-gradient-to-r from-[#8B1A1A] to-[#6d1515] text-white shadow-lg shadow-[#8B1A1A]/30'
                  : 'bg-white text-[#0D0D0D]/70 hover:bg-[#8B1A1A]/5 border border-[#1B2E1B]/10'}
              `}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <cat.icon className="w-4 h-4" />
              {cat.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Merch Grid */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={activeCategory}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {filteredItems.map((item, index) => (
              <MerchItem key={item.id} item={item} index={index} />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* CTA Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-20 p-10 bg-gradient-to-r from-[#8B1A1A] via-[#1B2E1B] to-[#8B1A1A] rounded-3xl text-white text-center relative overflow-hidden"
        >
          {/* Animated Background */}
          <div className="absolute inset-0 opacity-20">
            <div 
              className="absolute inset-0"
              style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.3) 1px, transparent 0)`,
                backgroundSize: '40px 40px',
              }}
            />
          </div>
          
          <div className="relative z-10">
            <motion.div
              className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6"
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
            >
              <Sparkles className="w-8 h-8 text-[#C9A227]" />
            </motion.div>
            
            <h3 className="text-3xl md:text-4xl font-black mb-4">
              {language === 'ua' ? 'Скоро в магазині!' : 'Coming to store soon!'}
            </h3>
            <p className="text-white/70 mb-8 max-w-lg mx-auto text-lg">
              {language === 'ua' 
                ? 'Офіційний мерч BoosterTea скоро буде доступний. Слідкуй за нами, щоб дізнатися першим!'
                : 'Official BoosterTea merchandise will be available soon. Follow us to be the first to know!'}
            </p>
            <motion.a 
              href="https://boostertea.com.ua"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button className="bg-white text-[#8B1A1A] hover:bg-white/90 font-bold px-10 py-6 rounded-xl text-lg shadow-xl">
                <ExternalLink className="w-5 h-5 mr-2" />
                {language === 'ua' ? 'Відвідати магазин' : 'Visit Store'}
              </Button>
            </motion.a>
          </div>
          
          {/* Decorative Orbs */}
          <motion.div 
            className="absolute -top-20 -right-20 w-64 h-64 bg-[#C9A227]/20 rounded-full blur-3xl"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 5, repeat: Infinity }}
          />
          <motion.div 
            className="absolute -bottom-20 -left-20 w-64 h-64 bg-[#8B1A1A]/20 rounded-full blur-3xl"
            animate={{ scale: [1.3, 1, 1.3] }}
            transition={{ duration: 5, repeat: Infinity }}
          />
        </motion.div>
      </div>
    </section>
  );
}
