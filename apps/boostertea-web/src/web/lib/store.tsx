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
  role?: string;
  isB2B?: boolean;
  referralCode?: string;
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
  mergeCarts: (payload: any) => void;
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
  isCartDrawerOpen: boolean;
  setCartDrawerOpen: (open: boolean) => void;
  isSubscription: boolean;
  setSubscription: (active: boolean) => void;
  usedCoins: number;
  setUsedCoins: (coins: number) => void;
}

export const products = configProducts.filter(p => ['puerh-classic-001', 'dahongpao-oolong-002', '6bf02c5d-7949-4254-9943-acf1bd62f288'].includes(p.id));
export const accessoryProducts: Accessory[] = []; // Disabled per MVP requirement

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
  const [isCartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [isSubscription, setSubscription] = useState(false);
  const [usedCoins, setUsedCoins] = useState(0);

  // Load from localStorage only after mount
  useEffect(() => {
    setMounted(true);
    try {
      const savedCart = localStorage.getItem('boostertea-cart');
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
      localStorage.setItem('boostertea-cart', JSON.stringify(cart));
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

  const mergeCarts = (payload: any) => {
    if (!payload || !Array.isArray(payload.items)) return;
    
    setCart(prev => {
      const incomingCart: CartItem[] = payload.items;
      const newCart = [...prev];
      
      incomingCart.forEach(incItem => {
        const existingIndex = newCart.findIndex(
          i => i.product.id === incItem.product.id && i.volume === incItem.volume
        );
        if (existingIndex >= 0) {
          // Smart Merge: take the max quantity to maximize user value and avoid losing data
          newCart[existingIndex].quantity = Math.max(newCart[existingIndex].quantity, incItem.quantity);
        } else {
          newCart.push(incItem);
        }
      });
      
      // TWA Mini-Boss #3 Resolution: Server state (external link) overwrites local promo code
      if (payload.promoCode) {
        setPromoCode(payload.promoCode);
      }
      
      return newCart;
    });
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
    
    // Always show cart drawer for MVP (disable Upsell blockers)
    showToast('toast.addedToCart');
    setCartDrawerOpen(true);
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
    setCartDrawerOpen(true);
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
    if (quantity === 0) {
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
      mergeCarts,
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
      setUpsellActive,
      isCartDrawerOpen,
      setCartDrawerOpen,
      isSubscription,
      setSubscription,
      usedCoins,
      setUsedCoins
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
