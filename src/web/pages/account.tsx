import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth, Order, Address, ReferralFriend } from '../lib/auth';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Toast from '../components/Toast';
import TelegramButton from '../components/TelegramButton';
import { SEO, useSEOConfig } from '../components/SEO';

const Account = () => {
  const [, setLocation] = useLocation();
  const seoConfig = useSEOConfig('account');
  const { 
    user, 
    isAuthenticated, 
    isLoading: authLoading, 
    logout, 
    orders, 
    updateUser,
    addAddress,
    removeAddress,
    setDefaultAddress,
    addPromoCode,
    removePromoCode,
    updateNotifications,
  } = useAuth();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [newPromoCode, setNewPromoCode] = useState('');
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [copiedReferral, setCopiedReferral] = useState(false);

  // New address form state
  const [newAddress, setNewAddress] = useState<Omit<Address, 'id'>>({
    label: '',
    fullName: '',
    phone: '',
    city: '',
    address: '',
    isDefault: false,
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      setLocation('/login');
    }
  }, [isAuthenticated, authLoading, setLocation]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#9FD356]/20 border-t-[#9FD356] rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  const handleLogout = () => {
    logout();
    setLocation('/');
  };

  const copyReferralLink = () => {
    navigator.clipboard.writeText(`https://boostertea.com.ua/ref/${user.referralCode}`);
    setCopiedReferral(true);
    setTimeout(() => setCopiedReferral(false), 2000);
  };

  const handleAddPromoCode = () => {
    if (newPromoCode.trim()) {
      addPromoCode(newPromoCode.trim());
      setNewPromoCode('');
    }
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    addAddress(newAddress);
    setShowAddressModal(false);
    setNewAddress({ label: '', fullName: '', phone: '', city: '', address: '', isDefault: false });
  };

  const getStatusStepLabel = (step: string) => {
    switch (step) {
      case 'created': return 'Оформлено';
      case 'processing': return 'Обробляється';
      case 'shipped': return 'Відправлено';
      case 'delivered': return 'Доставлено';
      default: return step;
    }
  };

  const getReferralStatusLabel = (status: ReferralFriend['status']) => {
    switch (status) {
      case 'pending': return { label: 'Очікує', color: 'text-[var(--text-primary)]/var(--text-muted)' };
      case 'registered': return { label: 'Зареєстрований', color: 'text-[#C9A55C]' };
      case 'first_order': return { label: 'Перше замовлення', color: 'text-[var(--accent)]' };
    }
  };

  // Tea journey stats calculations
  const cupsSaved = Math.round(user.totalLiters * 10); // ~10 cups per liter
  const minutesSaved = user.totalLiters * 15 * 10; // 15 sec per cup * 10 cups = 150 seconds saved per liter vs traditional
  const hoursSaved = Math.round(minutesSaved / 60);
  const daysWithUs = Math.round((Date.now() - new Date(user.registrationDate.split('.').reverse().join('-')).getTime()) / (1000 * 60 * 60 * 24));

  const teaFacts = [
    'Чай — другий за популярністю напій у світі після води.',
    'Всі види чаю походять з одної рослини — Camellia sinensis.',
    'Середній житель Туреччини випиває понад 3 кг чаю на рік.',
    'Чай містить L-теанін, який покращує концентрацію без нервозності.',
    'Перші чайні пакетики з\'явились випадково у 1908 році.',
    'Пуер може зберігатися десятиліттями і ставати кращим з роками.',
    'ГАБА-чай був винайдений у Японії в 1987 році.',
    'Да Хун Пао — один з найдорожчих чаїв у світі.',
  ];

  const randomFact = teaFacts[Math.floor(Math.random() * teaFacts.length)];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <SEO 
        title={seoConfig.title}
        description={seoConfig.description}
        noIndex={true}
      />
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-[var(--text-primary)]/var(--text-muted) mb-8">
            <Link href="/" className="hover:text-[var(--accent)] transition-colors">Головна</Link>
            <span>/</span>
            <span className="text-[var(--accent)]">Мій акаунт</span>
          </nav>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-[var(--bg-secondary)] rounded-2xl p-6 border border-[var(--card-border)] sticky top-24">
                {/* User info */}
                <div className="text-center mb-8">
                  <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-[#9FD356] to-[#7FB030] rounded-full flex items-center justify-center shadow-lg shadow-[#9FD356]/20">
                    <span className="text-[#0D0D0D] text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
                      {user.name.charAt(0)}
                    </span>
                  </div>
                  <h2 className="text-[var(--text-primary)] font-semibold">{user.name}</h2>
                  <p className="text-[var(--text-primary)]/var(--text-muted) text-sm">{user.email}</p>
                  <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-[var(--accent)]/10 rounded-full">
                    <span className="text-[var(--accent)] text-sm font-medium">{user.bonusPoints}</span>
                    <span className="text-[var(--accent)]/var(--text-secondary) text-xs">бонусів</span>
                  </div>
                </div>

                {/* Navigation */}
                <nav className="space-y-2">
                  {[
                    { id: 'profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', label: 'Профіль' },
                    { id: 'orders', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2', label: 'Замовлення' },
                    { id: 'journey', icon: 'M13 10V3L4 14h7v7l9-11h-7z', label: 'Моя подорож' },
                    { id: 'referral', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z', label: 'Реферали' },
                    { id: 'promo', icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z', label: 'Промокоди' },
                    { id: 'addresses', icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z', label: 'Адреси' },
                    { id: 'notifications', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9', label: 'Сповіщення' },
                  ].map(item => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors ${
                        activeTab === item.id 
                          ? 'bg-[var(--accent)]/20 text-[var(--accent)]' 
                          : 'text-[var(--text-primary)]/var(--text-muted) hover:bg-[#F5F0E8]/10'
                      }`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                      </svg>
                      {item.label}
                    </button>
                  ))}
                </nav>

                <hr className="border-[var(--border)] my-6" />

                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[var(--text-primary)]/var(--text-subtle) hover:text-red-400 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Вийти
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="lg:col-span-3">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="space-y-6 animate-fadeIn">
                  <h1 
                    className="text-3xl text-[var(--text-primary)]"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    Мій профіль
                  </h1>

                  <div className="bg-[var(--bg-secondary)] rounded-2xl p-8 border border-[var(--card-border)]">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-[var(--text-primary)]/var(--text-muted) text-sm mb-2">Ім'я</label>
                        <input 
                          type="text"
                          defaultValue={user.name}
                          onChange={(e) => updateUser({ name: e.target.value })}
                          className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] focus:border-[#9FD356]/var(--text-muted) focus:outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-[var(--text-primary)]/var(--text-muted) text-sm mb-2">Email</label>
                        <input 
                          type="email"
                          defaultValue={user.email}
                          className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] focus:border-[#9FD356]/var(--text-muted) focus:outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-[var(--text-primary)]/var(--text-muted) text-sm mb-2">Телефон</label>
                        <input 
                          type="tel"
                          defaultValue={user.phone}
                          onChange={(e) => updateUser({ phone: e.target.value })}
                          className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] focus:border-[#9FD356]/var(--text-muted) focus:outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-[var(--text-primary)]/var(--text-muted) text-sm mb-2">Дата реєстрації</label>
                        <div className="w-full px-4 py-3 bg-[var(--bg-primary)]/var(--text-muted) border border-[var(--card-border)] rounded-xl text-[var(--text-primary)]/var(--text-muted)">
                          {user.registrationDate}
                        </div>
                      </div>
                    </div>

                    <button className="mt-6 px-6 py-3 bg-[var(--accent)] text-[#0D0D0D] font-semibold rounded-xl hover:bg-[var(--accent-hover)] transition-all hover:scale-105 active:scale-95">
                      Зберегти зміни
                    </button>
                  </div>

                  {/* Fun fact */}
                  <div className="bg-gradient-to-br from-[#8B7355]/20 to-[#8B7355]/5 rounded-2xl p-6 border border-[#8B7355]/20">
                    <p className="text-[#C9A55C] text-sm font-medium mb-2">🍵 Цікавий факт про чай</p>
                    <p className="text-[var(--text-primary)]/80">{randomFact}</p>
                  </div>
                </div>
              )}

              {/* Orders Tab with Timeline */}
              {activeTab === 'orders' && (
                <div className="space-y-6 animate-fadeIn">
                  <h1 
                    className="text-3xl text-[var(--text-primary)]"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    Мої замовлення
                  </h1>

                  {orders.length === 0 ? (
                    <div className="bg-[var(--bg-secondary)] rounded-2xl p-12 border border-[var(--card-border)] text-center">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#F5F0E8]/5 flex items-center justify-center">
                        <svg className="w-8 h-8 text-[var(--text-primary)]/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </div>
                      <p className="text-[var(--text-primary)]/var(--text-muted) mb-4">Тут поки порожньо. Час замовити свій перший чай! 🍵</p>
                      <Link href="/products" className="inline-flex items-center gap-2 text-[var(--accent)] hover:underline">
                        Перейти до каталогу
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div 
                          key={order.id}
                          className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--card-border)] overflow-hidden"
                        >
                          {/* Order header */}
                          <button
                            onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                            className="w-full flex flex-wrap items-center justify-between gap-4 p-6 hover:bg-[#F5F0E8]/5 transition-colors text-left"
                          >
                            <div className="flex items-center gap-4">
                              <div>
                                <p className="text-[var(--text-primary)] font-semibold">{order.id}</p>
                                <p className="text-[var(--text-primary)]/var(--text-muted) text-sm">{order.date}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="text-[var(--accent)] font-bold">{order.total.toLocaleString()}₴</span>
                              <svg 
                                className={`w-5 h-5 text-[var(--text-primary)]/var(--text-muted) transition-transform ${expandedOrder === order.id ? 'rotate-180' : ''}`} 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </div>
                          </button>

                          {/* Expanded content */}
                          {expandedOrder === order.id && (
                            <div className="px-6 pb-6 border-t border-[var(--card-border)] animate-slideDown">
                              {/* Order Timeline */}
                              <div className="py-6">
                                <h3 className="text-[var(--text-primary)]/var(--text-secondary) text-sm font-medium mb-4">Статус замовлення</h3>
                                <div className="relative">
                                  {/* Progress line */}
                                  <div className="absolute top-5 left-5 right-5 h-0.5 bg-[#F5F0E8]/10">
                                    <div 
                                      className="h-full bg-gradient-to-r from-[#9FD356] to-[#9FD356] transition-all duration-500"
                                      style={{ 
                                        width: `${(order.statuses.filter(s => s.completed).length - 1) / (order.statuses.length - 1) * 100}%` 
                                      }}
                                    />
                                  </div>
                                  
                                  {/* Steps */}
                                  <div className="relative flex justify-between">
                                    {order.statuses.map((status, index) => (
                                      <div key={status.step} className="flex flex-col items-center">
                                        <div 
                                          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                                            status.completed 
                                              ? 'bg-[var(--accent)] text-[#0D0D0D]' 
                                              : 'bg-[var(--bg-secondary)] border-2 border-[#F5F0E8]/20 text-[var(--text-primary)]/var(--text-subtle)'
                                          }`}
                                        >
                                          {status.completed ? (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                          ) : (
                                            <span className="text-sm font-medium">{index + 1}</span>
                                          )}
                                        </div>
                                        <span className={`mt-2 text-xs font-medium ${status.completed ? 'text-[var(--text-primary)]' : 'text-[var(--text-primary)]/var(--text-subtle)'}`}>
                                          {getStatusStepLabel(status.step)}
                                        </span>
                                        {status.date && (
                                          <span className="text-[10px] text-[var(--text-primary)]/var(--text-subtle) mt-0.5">
                                            {status.date} {status.time}
                                          </span>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>

                              {/* Tracking number */}
                              {order.trackingNumber && (
                                <div className="bg-[var(--bg-primary)] rounded-xl p-4 mb-4 flex items-center justify-between">
                                  <div>
                                    <p className="text-[var(--text-primary)]/var(--text-muted) text-xs mb-1">Номер відстеження</p>
                                    <p className="text-[var(--text-primary)] font-mono">{order.trackingNumber}</p>
                                  </div>
                                  <button 
                                    onClick={() => navigator.clipboard.writeText(order.trackingNumber!)}
                                    className="px-3 py-1.5 bg-[#F5F0E8]/10 hover:bg-[#F5F0E8]/20 rounded-lg text-[var(--text-primary)] text-sm transition-colors"
                                  >
                                    Копіювати
                                  </button>
                                </div>
                              )}

                              {/* Order items */}
                              <div className="space-y-2">
                                {order.items.map((item, i) => (
                                  <div key={i} className="flex justify-between text-sm py-2 border-b border-[var(--card-border)] last:border-0">
                                    <span className="text-[var(--text-primary)]/var(--text-secondary)">
                                      {item.name} <span className="text-[var(--text-primary)]/var(--text-subtle)">{item.volume}</span> × {item.quantity}
                                    </span>
                                    <span className="text-[var(--text-primary)]">{(item.price * item.quantity).toLocaleString()}₴</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Tea Journey Tab */}
              {activeTab === 'journey' && (
                <div className="space-y-6 animate-fadeIn">
                  <h1 
                    className="text-3xl text-[var(--text-primary)]"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    Моя чайна подорож
                  </h1>

                  {/* Journey stats */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-[#9FD356]/20 to-[#9FD356]/5 rounded-2xl p-6 border border-[#9FD356]/20">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-[var(--accent)]/20 flex items-center justify-center">
                          <span className="text-xl">☕</span>
                        </div>
                        <span className="text-[var(--text-primary)]/var(--text-muted) text-sm">Ви випили еквівалент</span>
                      </div>
                      <p className="text-[var(--accent)] text-4xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
                        {cupsSaved}
                      </p>
                      <p className="text-[var(--text-primary)]/var(--text-muted) text-sm">чашок чаю</p>
                    </div>

                    <div className="bg-gradient-to-br from-[#8B7355]/20 to-[#8B7355]/5 rounded-2xl p-6 border border-[#8B7355]/20">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-[#8B7355]/20 flex items-center justify-center">
                          <span className="text-xl">🫖</span>
                        </div>
                        <span className="text-[var(--text-primary)]/var(--text-muted) text-sm">Це цілих</span>
                      </div>
                      <p className="text-[#C9A55C] text-4xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
                        {user.totalLiters}
                      </p>
                      <p className="text-[var(--text-primary)]/var(--text-muted) text-sm">літрів преміум чаю</p>
                    </div>

                    <div className="bg-gradient-to-br from-blue-500/20 to-blue-500/5 rounded-2xl p-6 border border-blue-500/20">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                          <span className="text-xl">⏱️</span>
                        </div>
                        <span className="text-[var(--text-primary)]/var(--text-muted) text-sm">Ви заощадили</span>
                      </div>
                      <p className="text-blue-400 text-4xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
                        {hoursSaved > 0 ? hoursSaved : minutesSaved}
                      </p>
                      <p className="text-[var(--text-primary)]/var(--text-muted) text-sm">{hoursSaved > 0 ? 'годин' : 'хвилин'} vs традиційного заварювання</p>
                    </div>

                    <div className="bg-gradient-to-br from-purple-500/20 to-purple-500/5 rounded-2xl p-6 border border-purple-500/20">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                          <span className="text-xl">💜</span>
                        </div>
                        <span className="text-[var(--text-primary)]/var(--text-muted) text-sm">Ваш улюблений чай</span>
                      </div>
                      <p className="text-purple-400 text-4xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
                        {user.favoriteTea || '—'}
                      </p>
                      <p className="text-[var(--text-primary)]/var(--text-muted) text-sm">{user.favoriteTea ? 'замовляли найчастіше' : 'ще не визначено'}</p>
                    </div>
                  </div>

                  {/* Membership badge */}
                  <div className="bg-[var(--bg-secondary)] rounded-2xl p-8 border border-[var(--card-border)] text-center">
                    <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#9FD356] via-[#C9A55C] to-[#9FD356] p-1 animate-pulse-slow">
                      <div className="w-full h-full bg-[var(--bg-secondary)] rounded-full flex items-center justify-center">
                        <span className="text-4xl">🏆</span>
                      </div>
                    </div>
                    <h3 className="text-[var(--text-primary)] text-xl font-semibold mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                      Ви з нами вже {daysWithUs} днів!
                    </h3>
                    <p className="text-[var(--text-primary)]/var(--text-muted)">
                      Дякуємо, що обираєте BoosterTea. Ви — частина нашої чайної родини! 💚
                    </p>
                  </div>

                  {/* Achievement badges */}
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
                    {[
                      { emoji: '🌱', label: 'Новачок', earned: true },
                      { emoji: '🍵', label: '10 чашок', earned: cupsSaved >= 10 },
                      { emoji: '🔥', label: '50 чашок', earned: cupsSaved >= 50 },
                      { emoji: '⭐', label: '100 чашок', earned: cupsSaved >= 100 },
                      { emoji: '👑', label: '500 чашок', earned: cupsSaved >= 500 },
                    ].map((badge, i) => (
                      <div 
                        key={i}
                        className={`aspect-square rounded-2xl flex flex-col items-center justify-center transition-all ${
                          badge.earned 
                            ? 'bg-[var(--accent)]/10 border border-[var(--border-accent)]' 
                            : 'bg-[var(--bg-secondary)] border border-[var(--card-border)] opacity-40'
                        }`}
                      >
                        <span className="text-3xl mb-1">{badge.emoji}</span>
                        <span className={`text-xs ${badge.earned ? 'text-[var(--text-primary)]' : 'text-[var(--text-primary)]/var(--text-subtle)'}`}>
                          {badge.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Referral Tab */}
              {activeTab === 'referral' && (
                <div className="space-y-6 animate-fadeIn">
                  <h1 
                    className="text-3xl text-[var(--text-primary)]"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    Реферальна програма
                  </h1>

                  {/* Referral link card */}
                  <div className="bg-gradient-to-br from-[#9FD356]/20 to-[#7FB030]/10 rounded-2xl p-8 border border-[var(--border-accent)]">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-[var(--accent)] flex items-center justify-center">
                        <span className="text-2xl">🎁</span>
                      </div>
                      <div>
                        <h3 className="text-[var(--text-primary)] font-semibold">Запрошуй друзів — отримуй бонуси!</h3>
                        <p className="text-[var(--text-primary)]/var(--text-muted) text-sm">200 бонусів за кожного друга, який зробить перше замовлення</p>
                      </div>
                    </div>

                    <div className="bg-[var(--bg-primary)]/var(--text-muted) rounded-xl p-4 mb-4">
                      <p className="text-[var(--text-primary)]/var(--text-muted) text-xs mb-2">Ваш реферальний код</p>
                      <div className="flex items-center gap-3">
                        <code className="flex-1 text-[var(--accent)] text-xl font-mono">{user.referralCode}</code>
                        <button
                          onClick={() => navigator.clipboard.writeText(user.referralCode)}
                          className="px-3 py-2 bg-[#F5F0E8]/10 hover:bg-[#F5F0E8]/20 rounded-lg text-[var(--text-primary)] text-sm transition-colors"
                        >
                          Копіювати
                        </button>
                      </div>
                    </div>

                    <div className="bg-[var(--bg-primary)]/var(--text-muted) rounded-xl p-4 mb-4">
                      <p className="text-[var(--text-primary)]/var(--text-muted) text-xs mb-2">Ваше реферальне посилання</p>
                      <div className="flex items-center gap-3">
                        <code className="flex-1 text-[var(--text-primary)]/var(--text-secondary) text-sm truncate">
                          boostertea.com.ua/ref/{user.referralCode}
                        </code>
                        <button
                          onClick={copyReferralLink}
                          className={`px-3 py-2 rounded-lg text-sm transition-all ${
                            copiedReferral 
                              ? 'bg-[var(--accent)] text-[#0D0D0D]' 
                              : 'bg-[#F5F0E8]/10 hover:bg-[#F5F0E8]/20 text-[var(--text-primary)]'
                          }`}
                        >
                          {copiedReferral ? 'Скопійовано!' : 'Копіювати'}
                        </button>
                      </div>
                    </div>

                    {/* Share buttons */}
                    <div className="flex flex-wrap gap-3">
                      <button className="flex-1 min-w-[140px] flex items-center justify-center gap-2 py-3 bg-[#0088cc] hover:bg-[#0088cc]/80 rounded-xl text-white transition-colors">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                        </svg>
                        Telegram
                      </button>
                      <button className="flex-1 min-w-[140px] flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-[#405DE6] via-[#C13584] to-[#F77737] hover:opacity-90 rounded-xl text-white transition-colors">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                        Instagram
                      </button>
                      <button className="flex-1 min-w-[140px] flex items-center justify-center gap-2 py-3 bg-[#1877F2] hover:bg-[#1877F2]/80 rounded-xl text-white transition-colors">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                        Facebook
                      </button>
                    </div>
                  </div>

                  {/* Referred friends list */}
                  <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--card-border)]">
                    <div className="p-6 border-b border-[var(--card-border)]">
                      <h3 className="text-[var(--text-primary)] font-semibold">Ваші запрошені друзі</h3>
                    </div>
                    
                    {user.referredFriends.length === 0 ? (
                      <div className="p-8 text-center">
                        <p className="text-[var(--text-primary)]/var(--text-muted)">Поки нікого не запросили. Час поділитися чаєм! 🍵</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-[#F5F0E8]/5">
                        {user.referredFriends.map((friend) => {
                          const statusInfo = getReferralStatusLabel(friend.status);
                          return (
                            <div key={friend.id} className="p-4 flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-[#F5F0E8]/10 flex items-center justify-center">
                                  <span className="text-[var(--text-primary)] font-medium">{friend.name.charAt(0)}</span>
                                </div>
                                <div>
                                  <p className="text-[var(--text-primary)]">{friend.name}</p>
                                  <p className="text-[var(--text-primary)]/var(--text-subtle) text-xs">{friend.date}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className={`text-sm font-medium ${statusInfo.color}`}>{statusInfo.label}</p>
                                {friend.bonusEarned > 0 && (
                                  <p className="text-[var(--accent)] text-xs">+{friend.bonusEarned} бонусів</p>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* How it works */}
                  <div className="bg-[var(--bg-secondary)] rounded-2xl p-8 border border-[var(--card-border)]">
                    <h3 className="text-[var(--text-primary)] font-semibold mb-6">Як це працює?</h3>
                    <div className="grid sm:grid-cols-3 gap-6">
                      {[
                        { step: '1', title: 'Поділіться кодом', desc: 'Надішліть друзям ваш унікальний код або посилання' },
                        { step: '2', title: 'Друг реєструється', desc: 'Він отримує 50 бонусів, ви — 50 за реєстрацію' },
                        { step: '3', title: 'Перше замовлення', desc: 'Коли друг зробить перше замовлення — ще +150 бонусів вам!' },
                      ].map((item) => (
                        <div key={item.step} className="text-center">
                          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[var(--accent)]/20 text-[var(--accent)] flex items-center justify-center font-bold">
                            {item.step}
                          </div>
                          <h4 className="text-[var(--text-primary)] font-medium mb-1">{item.title}</h4>
                          <p className="text-[var(--text-primary)]/var(--text-muted) text-sm">{item.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Promo Codes Tab */}
              {activeTab === 'promo' && (
                <div className="space-y-6 animate-fadeIn">
                  <h1 
                    className="text-3xl text-[var(--text-primary)]"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    Збережені промокоди
                  </h1>

                  {/* Add promo code */}
                  <div className="bg-[var(--bg-secondary)] rounded-2xl p-6 border border-[var(--card-border)]">
                    <label className="block text-[var(--text-primary)]/var(--text-secondary) text-sm mb-3">Додати новий промокод</label>
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={newPromoCode}
                        onChange={(e) => setNewPromoCode(e.target.value.toUpperCase())}
                        placeholder="Введіть промокод"
                        className="flex-1 px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] placeholder-[#F5F0E8]/30 focus:border-[#9FD356]/var(--text-muted) focus:outline-none uppercase"
                      />
                      <button
                        onClick={handleAddPromoCode}
                        disabled={!newPromoCode.trim()}
                        className="px-6 py-3 bg-[var(--accent)] text-[#0D0D0D] font-semibold rounded-xl hover:bg-[var(--accent-hover)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Зберегти
                      </button>
                    </div>
                  </div>

                  {/* Saved codes */}
                  {user.savedPromoCodes.length === 0 ? (
                    <div className="bg-[var(--bg-secondary)] rounded-2xl p-12 border border-[var(--card-border)] text-center">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#F5F0E8]/5 flex items-center justify-center">
                        <span className="text-3xl">🏷️</span>
                      </div>
                      <p className="text-[var(--text-primary)]/var(--text-muted)">Тут поки порожньо. Збережіть улюблені промокоди!</p>
                    </div>
                  ) : (
                    <div className="grid sm:grid-cols-2 gap-4">
                      {user.savedPromoCodes.map((code) => (
                        <div 
                          key={code}
                          className="bg-[var(--bg-secondary)] rounded-2xl p-5 border border-[var(--card-border)] flex items-center justify-between group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-[var(--accent)]/20 flex items-center justify-center">
                              <span className="text-[var(--accent)]">%</span>
                            </div>
                            <code className="text-[var(--text-primary)] font-mono text-lg">{code}</code>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => navigator.clipboard.writeText(code)}
                              className="p-2 hover:bg-[#F5F0E8]/10 rounded-lg transition-colors"
                            >
                              <svg className="w-5 h-5 text-[var(--text-primary)]/var(--text-muted)" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => removePromoCode(code)}
                              className="p-2 hover:bg-red-500/10 rounded-lg transition-colors group/btn"
                            >
                              <svg className="w-5 h-5 text-[var(--text-primary)]/var(--text-muted) group-hover/btn:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Info */}
                  <div className="bg-[#8B7355]/10 rounded-2xl p-5 border border-[#8B7355]/20">
                    <p className="text-[#C9A55C] text-sm">
                      💡 Збережіть свої улюблені промокоди тут, щоб не забути про них при наступному замовленні!
                    </p>
                  </div>
                </div>
              )}

              {/* Addresses Tab */}
              {activeTab === 'addresses' && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <h1 
                      className="text-3xl text-[var(--text-primary)]"
                      style={{ fontFamily: 'var(--font-heading)' }}
                    >
                      Адресна книга
                    </h1>
                    <button
                      onClick={() => setShowAddressModal(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-[var(--accent)] text-[#0D0D0D] font-semibold rounded-xl hover:bg-[var(--accent-hover)] transition-all"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Додати адресу
                    </button>
                  </div>

                  {user.addresses.length === 0 ? (
                    <div className="bg-[var(--bg-secondary)] rounded-2xl p-12 border border-[var(--card-border)] text-center">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#F5F0E8]/5 flex items-center justify-center">
                        <svg className="w-8 h-8 text-[var(--text-primary)]/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                      </div>
                      <p className="text-[var(--text-primary)]/var(--text-muted) mb-4">Ви ще не додали жодної адреси</p>
                      <button
                        onClick={() => setShowAddressModal(true)}
                        className="text-[var(--accent)] hover:underline"
                      >
                        Додати першу адресу →
                      </button>
                    </div>
                  ) : (
                    <div className="grid sm:grid-cols-2 gap-4">
                      {user.addresses.map((address) => (
                        <div 
                          key={address.id}
                          className={`bg-[var(--bg-secondary)] rounded-2xl p-5 border transition-colors ${
                            address.isDefault ? 'border-[var(--border-accent)]' : 'border-[var(--card-border)]'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <span className="text-[var(--text-primary)] font-semibold">{address.label}</span>
                              {address.isDefault && (
                                <span className="px-2 py-0.5 bg-[var(--accent)]/20 text-[var(--accent)] text-xs rounded-full">
                                  За замовчуванням
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-1">
                              {!address.isDefault && (
                                <button
                                  onClick={() => setDefaultAddress(address.id)}
                                  className="p-1.5 hover:bg-[#F5F0E8]/10 rounded-lg transition-colors"
                                  title="Зробити за замовчуванням"
                                >
                                  <svg className="w-4 h-4 text-[var(--text-primary)]/var(--text-muted)" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                  </svg>
                                </button>
                              )}
                              <button
                                onClick={() => removeAddress(address.id)}
                                className="p-1.5 hover:bg-red-500/10 rounded-lg transition-colors group"
                              >
                                <svg className="w-4 h-4 text-[var(--text-primary)]/var(--text-muted) group-hover:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </div>
                          <p className="text-[var(--text-primary)]/var(--text-secondary) text-sm">{address.fullName}</p>
                          <p className="text-[var(--text-primary)]/var(--text-secondary) text-sm">{address.phone}</p>
                          <p className="text-[var(--text-primary)]/var(--text-muted) text-sm mt-2">{address.city}, {address.address}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div className="space-y-6 animate-fadeIn">
                  <h1 
                    className="text-3xl text-[var(--text-primary)]"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    Налаштування сповіщень
                  </h1>

                  {/* Notification channels */}
                  <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--card-border)]">
                    <div className="p-6 border-b border-[var(--card-border)]">
                      <h3 className="text-[var(--text-primary)] font-semibold">Канали сповіщень</h3>
                      <p className="text-[var(--text-primary)]/var(--text-muted) text-sm mt-1">Оберіть, як ви хочете отримувати сповіщення</p>
                    </div>
                    <div className="p-6 space-y-4">
                      {[
                        { key: 'email' as const, label: 'Email', desc: user.email, icon: '📧' },
                        { key: 'sms' as const, label: 'SMS', desc: user.phone, icon: '📱' },
                        { key: 'telegram' as const, label: 'Telegram', desc: 'Підключити бота @booster_tea_bot', icon: '✈️' },
                      ].map((channel) => (
                        <div key={channel.key} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-xl">{channel.icon}</span>
                            <div>
                              <p className="text-[var(--text-primary)]">{channel.label}</p>
                              <p className="text-[var(--text-primary)]/var(--text-subtle) text-sm">{channel.desc}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => updateNotifications({ [channel.key]: !user.notifications[channel.key] })}
                            className={`w-12 h-6 rounded-full transition-colors relative ${
                              user.notifications[channel.key] ? 'bg-[var(--accent)]' : 'bg-[#F5F0E8]/20'
                            }`}
                          >
                            <div 
                              className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                                user.notifications[channel.key] ? 'translate-x-6' : 'translate-x-0.5'
                              }`}
                            />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Notification types */}
                  <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--card-border)]">
                    <div className="p-6 border-b border-[var(--card-border)]">
                      <h3 className="text-[var(--text-primary)] font-semibold">Типи сповіщень</h3>
                      <p className="text-[var(--text-primary)]/var(--text-muted) text-sm mt-1">Що саме вас цікавить?</p>
                    </div>
                    <div className="p-6 space-y-4">
                      {[
                        { key: 'orderUpdates' as const, label: 'Статус замовлення', desc: 'Оновлення про обробку та доставку' },
                        { key: 'promotions' as const, label: 'Акції та знижки', desc: 'Спеціальні пропозиції тільки для вас' },
                        { key: 'newProducts' as const, label: 'Нові продукти', desc: 'Першими дізнайтесь про новинки' },
                      ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between">
                          <div>
                            <p className="text-[var(--text-primary)]">{item.label}</p>
                            <p className="text-[var(--text-primary)]/var(--text-subtle) text-sm">{item.desc}</p>
                          </div>
                          <button
                            onClick={() => updateNotifications({ [item.key]: !user.notifications[item.key] })}
                            className={`w-12 h-6 rounded-full transition-colors relative ${
                              user.notifications[item.key] ? 'bg-[var(--accent)]' : 'bg-[#F5F0E8]/20'
                            }`}
                          >
                            <div 
                              className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                                user.notifications[item.key] ? 'translate-x-6' : 'translate-x-0.5'
                              }`}
                            />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Add Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowAddressModal(false)}
          />
          <div className="relative bg-[var(--bg-secondary)] rounded-2xl p-6 w-full max-w-md border border-[var(--border)] animate-scaleIn">
            <h3 className="text-xl text-[var(--text-primary)] mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
              Нова адреса
            </h3>
            <form onSubmit={handleAddAddress} className="space-y-4">
              <div>
                <label className="block text-[var(--text-primary)]/var(--text-muted) text-sm mb-2">Назва (Дім, Робота, тощо)</label>
                <input
                  type="text"
                  value={newAddress.label}
                  onChange={(e) => setNewAddress(prev => ({ ...prev, label: e.target.value }))}
                  className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] focus:border-[#9FD356]/var(--text-muted) focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-[var(--text-primary)]/var(--text-muted) text-sm mb-2">Ім'я отримувача</label>
                <input
                  type="text"
                  value={newAddress.fullName}
                  onChange={(e) => setNewAddress(prev => ({ ...prev, fullName: e.target.value }))}
                  className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] focus:border-[#9FD356]/var(--text-muted) focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-[var(--text-primary)]/var(--text-muted) text-sm mb-2">Телефон</label>
                <input
                  type="tel"
                  value={newAddress.phone}
                  onChange={(e) => setNewAddress(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] focus:border-[#9FD356]/var(--text-muted) focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-[var(--text-primary)]/var(--text-muted) text-sm mb-2">Місто</label>
                <input
                  type="text"
                  value={newAddress.city}
                  onChange={(e) => setNewAddress(prev => ({ ...prev, city: e.target.value }))}
                  className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] focus:border-[#9FD356]/var(--text-muted) focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-[var(--text-primary)]/var(--text-muted) text-sm mb-2">Адреса</label>
                <input
                  type="text"
                  value={newAddress.address}
                  onChange={(e) => setNewAddress(prev => ({ ...prev, address: e.target.value }))}
                  className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] focus:border-[#9FD356]/var(--text-muted) focus:outline-none"
                  placeholder="вул., буд., кв."
                  required
                />
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newAddress.isDefault}
                  onChange={(e) => setNewAddress(prev => ({ ...prev, isDefault: e.target.checked }))}
                  className="sr-only"
                />
                <div className={`w-5 h-5 rounded border-2 transition-all ${newAddress.isDefault ? 'bg-[var(--accent)] border-[#9FD356]' : 'border-[#F5F0E8]/30'}`}>
                  {newAddress.isDefault && (
                    <svg className="w-full h-full text-[#0D0D0D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className="text-[var(--text-primary)]/var(--text-muted) text-sm">Зробити адресою за замовчуванням</span>
              </label>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddressModal(false)}
                  className="flex-1 py-3 border border-[#F5F0E8]/20 text-[var(--text-primary)] rounded-xl hover:bg-[#F5F0E8]/5 transition-colors"
                >
                  Скасувати
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[var(--accent)] text-[#0D0D0D] font-semibold rounded-xl hover:bg-[var(--accent-hover)] transition-colors"
                >
                  Зберегти
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
      <TelegramButton />
      <Toast />
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        @keyframes slideDown {
          from { opacity: 0; max-height: 0; }
          to { opacity: 1; max-height: 500px; }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-scaleIn {
          animation: scaleIn 0.2s ease-out;
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Account;
