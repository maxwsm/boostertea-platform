import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, Accessory, products as configProducts, accessoryProducts as configAccessoryProducts } from '@wsm/config';

export type { Product, Accessory };

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
export const BONUS_EARN_RATE = 0.10;
export const BONUS_POINT_VALUE = 0.50;
export const BONUS_ONLY_ON_ACCESSORIES = true;

export const getBonusPointsForPrice = (price: number) => Math.ceil(price / BONUS_POINT_VALUE);
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
  calculateBonusEarned: (orderTotal: number) => number;
  getMarketingGifts: () => { totalCups: number; has1L: boolean; has025L: boolean };
  isSearchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  isCookieSettingsOpen: boolean;
  setCookieSettingsOpen: (open: boolean) => void;
  isUpsellActive: boolean;
  setUpsellActive: (open: boolean) => void;
}

export const products: Product[] = [
  {
    id: 'fd-strawberry',
    name: 'Полуничний Сироп Zero',
    slug: 'strawberry-zero',
    description: 'Яскравий полуничний смак без цукру для кави та коктейлів',
    price1L: 350,
    price025L: 120,
    priceSticks: 15,
    images: ['/assets/funny drops black.png'],
    category: 'tea', // keeping category to avoid type errors
    stats: { energy: 0, concentration: 5, relaxation: 0 },
    benefits: ['Без цукру', 'Для кави', 'Яскравий смак'],
    tastingNotes: ['Свіжа полуниця', 'Вершкові ноти'],
    color: '#FF1053',
    ingredients: ['Вода', 'Еритритол', 'Натуральний ароматизатор'],
    preparation: 'Додайте 15мл в каву або чай'
  },
  {
    id: 'fd-coconut',
    name: 'Кокос Zero',
    slug: 'coconut-zero',
    description: 'Ніжний кокосовий крем-сироп без цукру',
    price1L: 350,
    price025L: 120,
    priceSticks: 15,
    images: ['/assets/funny drops black.png'],
    category: 'tea',
    stats: { energy: 0, concentration: 5, relaxation: 0 },
    benefits: ['Для лате', 'Тропічний', 'Веган'],
    tastingNotes: ['Вершковий кокос', 'Ваніль'],
    color: '#00F0FF',
    ingredients: ['Вода', 'Еритритол', 'Кокосовий екстракт'],
    preparation: 'Ідеально для матчі або холодних напоїв'
  },
  {
    id: 'fd-mango',
    name: 'Манго-Маракуйя Zero',
    slug: 'mango-zero',
    description: 'Тропічний мікс без калорій',
    price1L: 350,
    price025L: 120,
    priceSticks: 15,
    images: ['/assets/funny drops black.png'],
    category: 'tea',
    stats: { energy: 0, concentration: 5, relaxation: 4 },
    benefits: ['Соковитий', 'Освіжаючий', 'Для літа'],
    tastingNotes: ['Стигле манго', 'Кислинка маракуї'],
    color: '#FF8811',
    ingredients: ['Вода', 'Еритритол', 'Натуральні екстракти'],
    preparation: 'Для лимонадів та смузі'
  }
];
export const accessoryProducts: Accessory[] = [];

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  // Start with empty arrays for SSR (consistent between server and client)
  const [cart, setCart] = useState<CartItem[]>([]);
  const [accessoryCart, setAccessoryCart] = useState<AccessoryCartItem[]>([]);
  const [mounted, setMounted] = useState(false);
  
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [user, setUser] = useState<User | null>(null);
  const [toastKey, setToastKey] = useState<string | null>(null);
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [isCookieSettingsOpen, setCookieSettingsOpen] = useState(false);
  const [isUpsellActive, setUpsellActive] = useState(false);

  // Load from localStorage only after mount
  useEffect(() => {
    setMounted(true);
    try {
      const savedCart = localStorage.getItem('funnydrops-cart');
      const savedAccessoryCart = localStorage.getItem('boostertea-accessory-cart');
      if (savedCart) setCart(JSON.parse(savedCart));
      if (savedAccessoryCart) setAccessoryCart(JSON.parse(savedAccessoryCart));
    } catch (e) {
      console.error('Failed to load cart:', e);
    }
  }, []);

  // Save to localStorage when cart changes (only after mount)
  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem('funnydrops-cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart:', e);
    }
  }, [cart, mounted]);

  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem('boostertea-accessory-cart', JSON.stringify(accessoryCart));
    } catch (e) {
      console.error('Failed to save accessory cart:', e);
    }
  }, [accessoryCart, mounted]);

  useEffect(() => {
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
    
    // Taidrink Syndicate Doctrine: Programmable Consumption Upsell (-30% Set Offer)
    if (volume === '1L') {
      // Trigger the block screen offer instead of just adding to cart quietly
      setUpsellActive(true);
    } else {
      showToast('toast.addedToCart');
    }
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

  const addAccessoryWithBonus = (accessory: Accessory, quantity: number, useBonus: boolean, availableBonus: number) => {
    const totalPrice = accessory.price * quantity;
    const pointsNeeded = getBonusPointsForPrice(totalPrice);
    
    if (useBonus && availableBonus >= pointsNeeded) {
      addAccessoryToCart(accessory, quantity);
      return { success: true, pointsUsed: pointsNeeded };
    } else if (useBonus && availableBonus > 0) {
      addAccessoryToCart(accessory, quantity);
      return { success: true, pointsUsed: availableBonus };
    } else {
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

  const calculateBonusEarned = (orderTotal: number) => {
    return Math.round(orderTotal * BONUS_EARN_RATE);
  };

  const getMarketingGifts = () => {
    let totalCups = 0;
    let has1L = false;
    let has025L = false;
    
    cart.forEach(item => {
      if (item.volume === '1L') {
        has1L = true;
      } else if (item.volume === '0.25L') {
        has025L = true;
      }
    });
    
    return { totalCups: 0, has1L, has025L };
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
      getMarketingGifts,
      isSearchOpen,
      setSearchOpen,
      isCookieSettingsOpen,
      setCookieSettingsOpen,
      isUpsellActive,
      setUpsellActive
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
