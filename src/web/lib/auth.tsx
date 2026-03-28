import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Address {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  city: string;
  address: string;
  isDefault: boolean;
}

export interface ReferralFriend {
  id: string;
  name: string;
  email: string;
  status: 'pending' | 'registered' | 'first_order';
  bonusEarned: number;
  date: string;
}

export interface OrderStatus {
  step: 'created' | 'processing' | 'shipped' | 'delivered';
  date: string;
  time: string;
  completed: boolean;
}

export interface Order {
  id: string;
  date: string;
  statuses: OrderStatus[];
  currentStatus: 'created' | 'processing' | 'shipped' | 'delivered';
  trackingNumber?: string;
  items: {
    name: string;
    quantity: number;
    price: number;
    volume: string;
  }[];
  total: number;
}

export interface NotificationPrefs {
  email: boolean;
  sms: boolean;
  telegram: boolean;
  orderUpdates: boolean;
  promotions: boolean;
  newProducts: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  bonusPoints: number;
  referralCode: string;
  savedPromoCodes: string[];
  addresses: Address[];
  referredFriends: ReferralFriend[];
  notifications: NotificationPrefs;
  registrationDate: string;
  totalOrders: number;
  totalSpent: number;
  totalLiters: number;
  favoriteTea: string;
  hasClaimedProfileBonus?: boolean;
  hasCompletedOnboarding?: boolean;
  isAdmin?: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: { name: string; email: string; phone: string; password: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
  orders: Order[];
  addAddress: (address: Omit<Address, 'id'>) => void;
  removeAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  addPromoCode: (code: string) => void;
  removePromoCode: (code: string) => void;
  updateNotifications: (prefs: Partial<NotificationPrefs>) => void;
}

// Mock orders with full status timeline
const mockOrders: Order[] = [
  {
    id: 'BT-2025-001',
    date: '15 січня 2025',
    currentStatus: 'delivered',
    trackingNumber: '20450078901234',
    statuses: [
      { step: 'created', date: '15.01.2025', time: '10:32', completed: true },
      { step: 'processing', date: '15.01.2025', time: '14:15', completed: true },
      { step: 'shipped', date: '16.01.2025', time: '09:00', completed: true },
      { step: 'delivered', date: '17.01.2025', time: '15:45', completed: true },
    ],
    items: [
      { name: 'Пуер', quantity: 6, price: 975, volume: '1л' },
      { name: 'ГАБА', quantity: 6, price: 1200, volume: '1л' },
    ],
    total: 13050,
  },
  {
    id: 'BT-2025-002',
    date: '22 січня 2025',
    currentStatus: 'shipped',
    trackingNumber: '20450078901567',
    statuses: [
      { step: 'created', date: '22.01.2025', time: '16:20', completed: true },
      { step: 'processing', date: '22.01.2025', time: '18:00', completed: true },
      { step: 'shipped', date: '23.01.2025', time: '10:30', completed: true },
      { step: 'delivered', date: '', time: '', completed: false },
    ],
    items: [
      { name: 'Да Хун Пао', quantity: 12, price: 1020, volume: '1л' },
    ],
    total: 12240,
  },
  {
    id: 'BT-2025-003',
    date: '28 січня 2025',
    currentStatus: 'processing',
    statuses: [
      { step: 'created', date: '28.01.2025', time: '11:45', completed: true },
      { step: 'processing', date: '28.01.2025', time: '14:00', completed: true },
      { step: 'shipped', date: '', time: '', completed: false },
      { step: 'delivered', date: '', time: '', completed: false },
    ],
    items: [
      { name: 'Пуер', quantity: 6, price: 975, volume: '1л' },
      { name: 'Да Хун Пао', quantity: 6, price: 1020, volume: '1л' },
      { name: 'ГАБА', quantity: 6, price: 1200, volume: '1л' },
    ],
    total: 19170,
  },
];

const mockUser: User = {
  id: 'user-001',
  name: 'Олена Коваленко',
  email: 'olena@example.com',
  phone: '+380 96 123 45 67',
  bonusPoints: 1450,
  referralCode: 'OLENA2025',
  savedPromoCodes: ['FIRST10', 'TEA20'],
  addresses: [
    {
      id: 'addr-1',
      label: 'Дім',
      fullName: 'Олена Коваленко',
      phone: '+380 96 123 45 67',
      city: 'Львів',
      address: 'вул. Шевченка, 15, кв. 42',
      isDefault: true,
    },
    {
      id: 'addr-2',
      label: 'Робота',
      fullName: 'Олена Коваленко',
      phone: '+380 96 123 45 67',
      city: 'Львів',
      address: 'вул. Січових Стрільців, 8, офіс 305',
      isDefault: false,
    },
  ],
  referredFriends: [
    {
      id: 'ref-1',
      name: 'Марія',
      email: 'maria@example.com',
      status: 'first_order',
      bonusEarned: 200,
      date: '10.01.2025',
    },
    {
      id: 'ref-2',
      name: 'Андрій',
      email: 'andriy@example.com',
      status: 'registered',
      bonusEarned: 50,
      date: '18.01.2025',
    },
    {
      id: 'ref-3',
      name: 'Юлія',
      email: 'julia@example.com',
      status: 'pending',
      bonusEarned: 0,
      date: '25.01.2025',
    },
  ],
  notifications: {
    email: true,
    sms: false,
    telegram: true,
    orderUpdates: true,
    promotions: true,
    newProducts: false,
  },
  registrationDate: '15.11.2024',
  totalOrders: 8,
  totalSpent: 44460,
  totalLiters: 48,
  favoriteTea: 'Пуер',
  hasClaimedProfileBonus: false,
  hasCompletedOnboarding: false,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [orders] = useState<Order[]>(mockOrders);

  useEffect(() => {
    // Check localStorage for existing auth
    const savedAuth = localStorage.getItem('boostertea-auth');
    if (savedAuth) {
      try {
        const parsed = JSON.parse(savedAuth);
        if (parsed.isAuthenticated) {
          setUser(parsed.user || mockUser);
        }
      } catch (e) {
        console.error('Failed to parse auth data');
      }
    }
    setIsLoading(false);
  }, []);

  const saveAuth = (userData: User | null) => {
    if (userData) {
      localStorage.setItem('boostertea-auth', JSON.stringify({
        isAuthenticated: true,
        user: userData,
      }));
    } else {
      localStorage.removeItem('boostertea-auth');
    }
  };

  const login = async (email: string, password: string) => {
    try {
      // Step 1: Attempt to contact the Global WSM Auth Engine
      const res = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await res.json();
      
      if (data.success) {
        localStorage.setItem('wsm-token', data.token); // Store Global JWT
        
        const userData = {
          ...mockUser,
          ...data.user,
          bonusPoints: data.user.bonusPoints,
        };
        setUser(userData);
        saveAuth(userData);
        return { success: true };
      }
      
      return { success: false, error: data.error || 'Помилка авторизації' };
    } catch (e) {
      // Fallback for incubator mode if backend is off
      if (email && password.length >= 6) {
        // MEGA-AUDIT: Replaced hardcoded admin@boostertea.com.ua privilege escalation vulnerability
        const isAdmin = false; // Strictly enforced: No offline admin access
        const userData = { 
          ...mockUser, 
          email,
          isAdmin,
          name: mockUser.name,
        };
        setUser(userData);
        saveAuth(userData);
        return { success: true };
      }
      return { success: false, error: 'Невірний email або пароль' };
    }
  };

  const register = async (data: { name: string; email?: string; phone: string; password: string }) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Phone is required, email is optional
    if (data.phone && data.password.length >= 6 && data.name) {
      const newUser: User = {
        ...mockUser,
        id: `user-${Date.now()}`,
        name: data.name,
        email: data.email || '',
        phone: data.phone,
        bonusPoints: 20, // Welcome bonus
        referralCode: data.name.toUpperCase().slice(0, 6) + Math.floor(Math.random() * 1000),
        savedPromoCodes: [],
        addresses: [],
        referredFriends: [],
        registrationDate: new Date().toLocaleDateString('uk-UA'),
        totalOrders: 0,
        totalSpent: 0,
        totalLiters: 0,
        favoriteTea: '',
        hasClaimedProfileBonus: false,
        hasCompletedOnboarding: false,
      };
      setUser(newUser);
      saveAuth(newUser);
      return { success: true };
    }
    
    return { success: false, error: 'Будь ласка, заповніть всі поля коректно' };
  };

  const logout = () => {
    localStorage.removeItem('wsm-token');
    setUser(null);
    saveAuth(null);
  };

  const updateUser = (data: Partial<User>) => {
    if (user) {
      const updated = { ...user, ...data };
      setUser(updated);
      saveAuth(updated);
    }
  };

  const addAddress = (address: Omit<Address, 'id'>) => {
    if (user) {
      const newAddress = { ...address, id: `addr-${Date.now()}` };
      const updated = { 
        ...user, 
        addresses: address.isDefault 
          ? [...user.addresses.map(a => ({ ...a, isDefault: false })), newAddress]
          : [...user.addresses, newAddress] 
      };
      setUser(updated);
      saveAuth(updated);
    }
  };

  const removeAddress = (id: string) => {
    if (user) {
      const updated = { ...user, addresses: user.addresses.filter(a => a.id !== id) };
      setUser(updated);
      saveAuth(updated);
    }
  };

  const setDefaultAddress = (id: string) => {
    if (user) {
      const updated = {
        ...user,
        addresses: user.addresses.map(a => ({ ...a, isDefault: a.id === id })),
      };
      setUser(updated);
      saveAuth(updated);
    }
  };

  const addPromoCode = (code: string) => {
    if (user && !user.savedPromoCodes.includes(code.toUpperCase())) {
      const updated = { ...user, savedPromoCodes: [...user.savedPromoCodes, code.toUpperCase()] };
      setUser(updated);
      saveAuth(updated);
    }
  };

  const removePromoCode = (code: string) => {
    if (user) {
      const updated = { ...user, savedPromoCodes: user.savedPromoCodes.filter(c => c !== code) };
      setUser(updated);
      saveAuth(updated);
    }
  };

  const updateNotifications = (prefs: Partial<NotificationPrefs>) => {
    if (user) {
      const updated = { ...user, notifications: { ...user.notifications, ...prefs } };
      setUser(updated);
      saveAuth(updated);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      register,
      logout,
      updateUser,
      orders,
      addAddress,
      removeAddress,
      setDefaultAddress,
      addPromoCode,
      removePromoCode,
      updateNotifications,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
