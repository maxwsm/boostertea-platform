import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Product {
  id: string;
  slug: string;
  name: string;
  nameUk: string;
  description: string;
  descriptionUk: string;
  effects: string[];
  effectsUk: string[];
  price1L: number;
  price025L: number;
  priceSticks?: number;
  image: string;
  category: string;
  brewingTime: string;
  temperature: string;
  origin: string;
  isBundle?: boolean;
  bundleIncludes?: string[];
}

export interface Accessory {
  id: string;
  slug: string;
  nameUk: string;
  nameEn?: string;
  nameEs?: string;
  descriptionUk: string;
  descriptionEn?: string;
  descriptionEs?: string;
  subcategory: 'thermos' | 'mug' | 'cup' | 'piala' | 'dry_tea';
  price: number;
  image?: string;
  inStock: boolean;
}

export interface CartItem {
  product: Product;
  volume: '1L' | '0.25L' | 'sticks';
  quantity: number;
}

export interface AccessoryCartItem {
  accessory: Accessory;
  quantity: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  bonusPoints: number;
  orders: Order[];
}

interface Order {
  id: string;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  items: CartItem[];
  total: number;
}

// Bonus system constants
export const BONUS_EARN_RATE = 0.10; // 10% of order value
export const BONUS_POINT_VALUE = 0.50; // 1 point = 0.50₴
export const BONUS_ONLY_ON_ACCESSORIES = true; // Can only spend on accessories

// Calculate bonus points needed for accessory price
export const getBonusPointsForPrice = (price: number) => Math.ceil(price / BONUS_POINT_VALUE);

// Calculate how much ₴ bonus points are worth
export const getBonusPointsValue = (points: number) => points * BONUS_POINT_VALUE;

interface StoreContextType {
  cart: CartItem[];
  accessoryCart: AccessoryCartItem[];
  addToCart: (product: Product, volume: '1L' | '0.25L' | 'sticks', quantity: number) => void;
  addAccessoryToCart: (accessory: Accessory, quantity: number) => void;
  addAccessoryWithBonus: (accessory: Accessory, quantity: number, useBonus: boolean, bonusPoints: number) => { success: boolean; pointsUsed: number };
  removeFromCart: (productId: string, volume: '1L' | '0.25L' | 'sticks') => void;
  removeAccessoryFromCart: (accessoryId: string) => void;
  updateQuantity: (productId: string, volume: '1L' | '0.25L' | 'sticks', quantity: number) => void;
  updateAccessoryQuantity: (accessoryId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemCount: () => number;
  getAccessoryCartTotal: () => number;
  getTeaCartTotal: () => number;
  promoCode: string;
  setPromoCode: (code: string) => void;
  promoDiscount: number;
  user: User | null;
  setUser: (user: User | null) => void;
  products: Product[];
  toastKey: string | null;
  showToast: (key: string) => void;
  // Bonus system
  calculateBonusEarned: (orderTotal: number) => number;
  getMarketingGifts: () => { totalCups: number; has1L: boolean; has025L: boolean };
}

export const products: Product[] = [
  {
    id: '1',
    slug: 'pu-erh',
    name: 'PU-ERH',
    nameUk: 'Пуер',
    description: 'Premium aged tea concentrate with deep earthy notes and natural energy boost. Perfect for morning rituals and focused work sessions.',
    descriptionUk: 'Преміальний витриманий чайний концентрат з глибокими земляними нотами та природним енергетичним зарядом. Ідеальний для ранкових ритуалів та зосередженої роботи.',
    effects: ['Energy boost', 'Focus enhancement', 'Metabolism support'],
    effectsUk: ['Заряд енергії', 'Покращення концентрації', 'Підтримка метаболізму'],
    price1L: 900,
    price025L: 300,
    priceSticks: 720,
    image: './2c48187c-dfae-4491-8a85-29ceb65cf85c.png',
    category: 'energy',
    brewingTime: '15 секунд',
    temperature: '85-95°C',
    origin: 'Юньнань, Китай'
  },
  {
    id: '2',
    slug: 'da-hong-pao',
    name: 'DA HONG PAO',
    nameUk: 'Да Хун Пао',
    description: 'The legendary "Big Red Robe" oolong tea concentrate with rich roasted flavor and warming properties. Known as the king of teas.',
    descriptionUk: 'Легендарний улун "Великий Червоний Халат" з насиченим смаком обсмаження та зігріваючими властивостями. Відомий як король чаїв.',
    effects: ['Warming sensation', 'Stress relief', 'Digestive comfort'],
    effectsUk: ['Зігріваючий ефект', 'Зняття стресу', 'Комфорт травлення'],
    price1L: 936,
    price025L: 312,
    priceSticks: 900,
    image: './e188ef51-7d4a-41dd-87fb-d6756d50f7b1.png',
    category: 'classic',
    brewingTime: '15 секунд',
    temperature: '90-98°C',
    origin: 'Уішань, Китай'
  },
  {
    id: '3',
    slug: 'gaba',
    name: 'GABA',
    nameUk: 'ГАБА',
    description: 'Unique GABA-enriched tea concentrate for relaxation without drowsiness. Perfect for evening unwinding and quality sleep preparation.',
    descriptionUk: 'Унікальний чайний концентрат збагачений ГАМК для розслаблення без сонливості. Ідеальний для вечірнього відпочинку та підготовки до якісного сну.',
    effects: ['Deep relaxation', 'Better sleep', 'Anxiety reduction'],
    effectsUk: ['Глибоке розслаблення', 'Кращий сон', 'Зниження тривожності'],
    price1L: 1068,
    price025L: 360,
    priceSticks: 1008,
    image: './584c19ed-170d-4d1e-b258-5603552bab8d.png',
    category: 'relaxation',
    brewingTime: '15 секунд',
    temperature: '80-90°C',
    origin: 'Тайвань'
  },
  {
    id: '4',
    slug: 'set-all-three',
    name: 'SET — All Three',
    nameUk: 'Сет «Три смаки»',
    description: 'Complete collection: Pu-erh + Da Hong Pao + GABA. Save 30% vs buying separately. Discover your favourite.',
    descriptionUk: 'Повна колекція: Пуер + Да Хун Пао + ГАБА. Економія 30% порівняно з окремою покупкою. Знайдіть свій смак.',
    effects: ['Best value', 'Full collection', 'Perfect gift'],
    effectsUk: ['Найкраща ціна', 'Повна колекція', 'Ідеальний подарунок'],
    // 3× 1L: (900+936+1068)*0.7 = 2033
    price1L: 2033,
    // 3× 0.25L: (300+312+360)*0.7 = 680
    price025L: 680,
    // 3× sticks: (720+900+1008)*0.7 = 1840
    priceSticks: 1840,
    image: './2c48187c-dfae-4491-8a85-29ceb65cf85c.png',
    category: 'energy',
    brewingTime: '15 секунд',
    temperature: '80-98°C',
    origin: 'Китай / Тайвань',
    isBundle: true,
    bundleIncludes: ['pu-erh', 'da-hong-pao', 'gaba'],
  },
];

// Accessory products - thermoses, mugs, cups, pialas, dry tea
export const accessoryProducts: Accessory[] = [
  {
    id: 'acc-1',
    slug: 'thermos-boostertea-500',
    nameUk: 'Термос BoosterTea 500ml',
    nameEn: 'BoosterTea Thermos 500ml',
    nameEs: 'Termo BoosterTea 500ml',
    descriptionUk: 'Преміальний термос з подвійними стінками та вакуумною ізоляцією. Зберігає тепло до 12 годин. Ідеальний для подорожей та офісу.',
    descriptionEn: 'Premium double-walled vacuum insulated thermos. Keeps drinks hot for up to 12 hours. Perfect for travel and office.',
    descriptionEs: 'Termo premium de doble pared con aislamiento al vacío. Mantiene el calor hasta 12 horas. Perfecto para viajes y oficina.',
    subcategory: 'thermos',
    price: 899,
    inStock: true
  },
  {
    id: 'acc-2',
    slug: 'thermal-mug-travel',
    nameUk: 'Термокружка Travel',
    nameEn: 'Travel Thermal Mug',
    nameEs: 'Taza Térmica de Viaje',
    descriptionUk: 'Стильна термокружка для автомобіля та офісу. Антипроливний дизайн, зручна ручка, місткість 350ml.',
    descriptionEn: 'Stylish thermal mug for car and office. Spill-proof design, comfortable handle, 350ml capacity.',
    descriptionEs: 'Elegante taza térmica para coche y oficina. Diseño antiderrame, asa cómoda, capacidad 350ml.',
    subcategory: 'mug',
    price: 549,
    inStock: true
  },
  {
    id: 'acc-3',
    slug: 'ceramic-cup',
    nameUk: 'Чашка Ceramic',
    nameEn: 'Ceramic Cup',
    nameEs: 'Taza de Cerámica',
    descriptionUk: 'Елегантна керамічна чашка ручної роботи з логотипом BoosterTea. Місткість 250ml, ідеальна для чайних церемоній.',
    descriptionEn: 'Elegant handmade ceramic cup with BoosterTea logo. 250ml capacity, perfect for tea ceremonies.',
    descriptionEs: 'Elegante taza de cerámica hecha a mano con logo BoosterTea. Capacidad 250ml, perfecta para ceremonias de té.',
    subcategory: 'cup',
    price: 299,
    inStock: true
  },
  {
    id: 'acc-4',
    slug: 'piala-gongfu',
    nameUk: 'Піала Gongfu',
    nameEn: 'Gongfu Piala',
    nameEs: 'Piala Gongfu',
    descriptionUk: "Традиційна китайська піала для гунфу чаю. Тонкий фарфор, об'єм 50ml, відмінно передає смак та аромат.",
    descriptionEn: 'Traditional Chinese gongfu tea bowl. Fine porcelain, 50ml volume, perfectly conveys taste and aroma.',
    descriptionEs: 'Tazón tradicional chino para té gongfu. Porcelana fina, volumen 50ml, transmite perfectamente sabor y aroma.',
    subcategory: 'piala',
    price: 199,
    inStock: true
  },
  {
    id: 'acc-5',
    slug: 'dry-puerh-100',
    nameUk: 'Сухий чай Пуер 100г',
    nameEn: 'Dry Pu-erh Tea 100g',
    nameEs: 'Té Pu-erh Seco 100g',
    descriptionUk: 'Справжній витриманий пуер з провінції Юньнань. Для тих, хто любить заварювати чай традиційним способом.',
    descriptionEn: 'Authentic aged pu-erh from Yunnan province. For those who love brewing tea the traditional way.',
    descriptionEs: 'Auténtico pu-erh añejo de la provincia de Yunnan. Para quienes aman preparar té de forma tradicional.',
    subcategory: 'dry_tea',
    price: 450,
    inStock: true
  },
  {
    id: 'acc-6',
    slug: 'thermos-boostertea-750',
    nameUk: 'Термос BoosterTea 750ml',
    nameEn: 'BoosterTea Thermos 750ml',
    nameEs: 'Termo BoosterTea 750ml',
    descriptionUk: 'Великий термос для команди або довгих подорожей. Подвійна ізоляція, зберігає температуру до 24 годин.',
    descriptionEn: 'Large thermos for team or long trips. Double insulation, keeps temperature for up to 24 hours.',
    descriptionEs: 'Termo grande para equipo o viajes largos. Doble aislamiento, mantiene la temperatura hasta 24 horas.',
    subcategory: 'thermos',
    price: 1199,
    inStock: true
  },
  {
    id: 'acc-7',
    slug: 'cup-matcha',
    nameUk: 'Чашка для Матча',
    nameEn: 'Matcha Bowl',
    nameEs: 'Tazón para Matcha',
    descriptionUk: 'Широка керамічна чашка в японському стилі. Ідеальна для збивання матча та чайних церемоній.',
    descriptionEn: 'Wide ceramic bowl in Japanese style. Perfect for whisking matcha and tea ceremonies.',
    descriptionEs: 'Tazón de cerámica ancho de estilo japonés. Perfecto para batir matcha y ceremonias de té.',
    subcategory: 'cup',
    price: 399,
    inStock: true
  },
  {
    id: 'acc-8',
    slug: 'dry-dahongpao-100',
    nameUk: 'Сухий чай Да Хун Пао 100г',
    nameEn: 'Dry Da Hong Pao Tea 100g',
    nameEs: 'Té Da Hong Pao Seco 100g',
    descriptionUk: 'Легендарний улун з гір Уі. Насичений смак обсмаження та квіткові ноти.',
    descriptionEn: 'Legendary oolong from Wuyi Mountains. Rich roasted flavor with floral notes.',
    descriptionEs: 'Legendario oolong de las montañas Wuyi. Rico sabor tostado con notas florales.',
    subcategory: 'dry_tea',
    price: 520,
    inStock: true
  },
  {
    id: 'acc-9',
    slug: 'mug-office',
    nameUk: 'Кружка Office',
    nameEn: 'Office Mug',
    nameEs: 'Taza de Oficina',
    descriptionUk: 'Велика кружка з кришкою для офісу. Об\'єм 400ml, силіконова кришка зберігає тепло.',
    descriptionEn: 'Large office mug with lid. 400ml volume, silicone lid keeps drinks warm.',
    descriptionEs: 'Taza grande de oficina con tapa. Volumen 400ml, tapa de silicona mantiene el calor.',
    subcategory: 'mug',
    price: 349,
    inStock: true
  },
  {
    id: 'acc-10',
    slug: 'piala-set-4',
    nameUk: 'Набір піал (4 шт)',
    nameEn: 'Piala Set (4 pcs)',
    nameEs: 'Set de Pialas (4 uds)',
    descriptionUk: 'Набір з 4 традиційних піал для чайної церемонії. Різні кольори, ручна робота.',
    descriptionEn: 'Set of 4 traditional tea ceremony bowls. Different colors, handmade.',
    descriptionEs: 'Set de 4 tazones tradicionales para ceremonia del té. Diferentes colores, hechos a mano.',
    subcategory: 'piala',
    price: 649,
    inStock: true
  }
];

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('boostertea-cart');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const [accessoryCart, setAccessoryCart] = useState<AccessoryCartItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('boostertea-accessory-cart');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [user, setUser] = useState<User | null>(null);
  const [toastKey, setToastKey] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('boostertea-cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('boostertea-accessory-cart', JSON.stringify(accessoryCart));
  }, [accessoryCart]);

  useEffect(() => {
    // Simple promo code validation
    const validCodes: Record<string, number> = {
      'FIRST10': 10,
      'TEA20': 20,
      'BOOST15': 15,
    };
    setPromoDiscount(validCodes[promoCode.toUpperCase()] || 0);
  }, [promoCode]);

  const showToast = (key: string) => {
    setToastKey(key);
    setTimeout(() => setToastKey(null), 3000);
  };

  const addToCart = (product: Product, volume: '1L' | '0.25L' | 'sticks', quantity: number) => {
    setCart(prev => {
      const existingIndex = prev.findIndex(
        item => item.product.id === product.id && item.volume === volume
      );
      
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }
      
      return [...prev, { product, volume, quantity }];
    });
    showToast('toast.addedToCart');
    // Conversion tracking
    try {
      const w = window as any;
      if (w.BT_Track) w.BT_Track.addToCart(product.name || product.slug, product.price1L * quantity, product.slug);
      if (w.BoosterFunnel) w.BoosterFunnel.trackAddToCart(product.slug);
    } catch(e) {}
  };

  const addAccessoryToCart = (accessory: Accessory, quantity: number) => {
    setAccessoryCart(prev => {
      const existingIndex = prev.findIndex(item => item.accessory.id === accessory.id);
      
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }
      
      return [...prev, { accessory, quantity }];
    });
    showToast('toast.addedToCart');
  };

  // Add accessory with bonus points (only for accessories)
  const addAccessoryWithBonus = (accessory: Accessory, quantity: number, useBonus: boolean, availableBonus: number) => {
    const totalPrice = accessory.price * quantity;
    const pointsNeeded = getBonusPointsForPrice(totalPrice);
    
    if (useBonus && availableBonus >= pointsNeeded) {
      // Full bonus payment
      addAccessoryToCart(accessory, quantity);
      return { success: true, pointsUsed: pointsNeeded };
    } else if (useBonus && availableBonus > 0) {
      // Partial bonus - still add to cart, but track points used
      addAccessoryToCart(accessory, quantity);
      return { success: true, pointsUsed: availableBonus };
    } else {
      // Regular purchase
      addAccessoryToCart(accessory, quantity);
      return { success: true, pointsUsed: 0 };
    }
  };

  const removeFromCart = (productId: string, volume: '1L' | '0.25L' | 'sticks') => {
    setCart(prev => prev.filter(
      item => !(item.product.id === productId && item.volume === volume)
    ));
    showToast('toast.removedFromCart');
  };

  const removeAccessoryFromCart = (accessoryId: string) => {
    setAccessoryCart(prev => prev.filter(item => item.accessory.id !== accessoryId));
    showToast('toast.removedFromCart');
  };

  const updateQuantity = (productId: string, volume: '1L' | '0.25L' | 'sticks', quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, volume);
      return;
    }
    
    setCart(prev => prev.map(item => 
      item.product.id === productId && item.volume === volume
        ? { ...item, quantity }
        : item
    ));
  };

  const updateAccessoryQuantity = (accessoryId: string, quantity: number) => {
    if (quantity <= 0) {
      removeAccessoryFromCart(accessoryId);
      return;
    }
    
    setAccessoryCart(prev => prev.map(item =>
      item.accessory.id === accessoryId
        ? { ...item, quantity }
        : item
    ));
  };

  const clearCart = () => {
    setCart([]);
    setAccessoryCart([]);
    showToast('toast.cartCleared');
  };

  const getCartTotal = () => {
    const teaSubtotal = cart.reduce((total, item) => {
      const price = item.volume === '1L' ? item.product.price1L
        : item.volume === 'sticks' ? (item.product.priceSticks ?? item.product.price025L)
        : item.product.price025L;
      return total + price * item.quantity;
    }, 0);

    const accessorySubtotal = accessoryCart.reduce((total, item) => {
      return total + item.accessory.price * item.quantity;
    }, 0);
    
    return (teaSubtotal + accessorySubtotal) * (1 - promoDiscount / 100);
  };

  const getTeaCartTotal = () => {
    return cart.reduce((total, item) => {
      const price = item.volume === '1L' ? item.product.price1L
        : item.volume === 'sticks' ? (item.product.priceSticks ?? item.product.price025L)
        : item.product.price025L;
      return total + price * item.quantity;
    }, 0) * (1 - promoDiscount / 100);
  };

  const getAccessoryCartTotal = () => {
    return accessoryCart.reduce((total, item) => {
      return total + item.accessory.price * item.quantity;
    }, 0);
  };

  const getCartItemCount = () => {
    const teaCount = cart.reduce((count, item) => count + item.quantity, 0);
    const accessoryCount = accessoryCart.reduce((count, item) => count + item.quantity, 0);
    return teaCount + accessoryCount;
  };

  // Calculate bonus points earned from order (10% of tea order total)
  const calculateBonusEarned = (orderTotal: number) => {
    return Math.round(orderTotal * BONUS_EARN_RATE);
  };

  // Calculate marketing gifts (branded cups)
  const getMarketingGifts = () => {
    let totalCups = 0;
    let has1L = false;
    let has025L = false;
    
    cart.forEach(item => {
      if (item.volume === '1L') {
        has1L = true;
        // SET bundle counts as 3 bottles
        totalCups += item.quantity * (item.product.isBundle ? 15 : 5);
      } else if (item.volume === '0.25L') {
        has025L = true;
        totalCups += item.quantity * (item.product.isBundle ? 9 : 3);
      }
      // sticks: no cups gift
    });
    
    return { totalCups, has1L, has025L };
  };

  return (
    <StoreContext.Provider value={{
      cart,
      accessoryCart,
      addToCart,
      addAccessoryToCart,
      addAccessoryWithBonus,
      removeFromCart,
      removeAccessoryFromCart,
      updateQuantity,
      updateAccessoryQuantity,
      clearCart,
      getCartTotal,
      getCartItemCount,
      getTeaCartTotal,
      getAccessoryCartTotal,
      promoCode,
      setPromoCode,
      promoDiscount,
      user,
      setUser,
      products,
      toastKey,
      showToast,
      calculateBonusEarned,
      getMarketingGifts
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within StoreProvider');
  }
  return context;
};
