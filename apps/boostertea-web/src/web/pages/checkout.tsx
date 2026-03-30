import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Toast from '../components/Toast';
import TelegramButton from '../components/TelegramButton';
import NovaPoshtaSelector from '../components/NovaPoshtaSelector';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { useStore } from '../lib/store';
import { useAuth } from '../lib/auth';
import { useTranslation } from '../lib/i18n';
import { SEO, useSEOConfig } from '../components/SEO';
import { TeaLoader } from '../components/animations';
import { useShadowCapture } from '../hooks/useShadowCapture';

type CheckoutStep = 'contact' | 'delivery' | 'payment';

interface ContactInfo {
  firstName: string;
  lastName: string;
  phone: string;
  email?: string; // Optional for marketing
}

interface DeliveryInfo {
  method: 'nova_poshta' | 'pickup';
  city: string;
  cityRef: string;
  warehouse: string;
  warehouseRef: string;
  warehouseAddress: string;
  fullAddress: string;
}

// Marketing gifts calculation
const getMarketingGifts = (cart: any[]) => {
  let totalCups = 0;
  let has1L = false;
  let has025L = false;
  
  cart.forEach(item => {
    if (item.volume === '1L') {
      has1L = true;
      totalCups += item.quantity * 5; // 5 cups per 1L
    } else {
      has025L = true;
      totalCups += item.quantity * 3; // 3 cups per 0.25L (minimum order 12 pcs = 36 cups)
    }
  });
  
  return { totalCups, has1L, has025L };
};

const Checkout = () => {
  const [, navigate] = useLocation();
  const { cart, accessoryCart, getCartTotal, promoCode, promoDiscount, clearCart, removeFromCart, removeAccessoryFromCart } = useStore();
  const { user, isAuthenticated } = useAuth();
  const { t, language } = useTranslation();
  
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('contact');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [monobankConfigured, setMonobankConfigured] = useState(true);
  
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    firstName: '',
    lastName: '',
    phone: '',
    email: user?.email || ''
  });
  
  const [deliveryInfo, setDeliveryInfo] = useState<DeliveryInfo>({
    method: 'nova_poshta',
    city: '',
    cityRef: '',
    warehouse: '',
    warehouseRef: '',
    warehouseAddress: '',
    fullAddress: ''
  });
  
  const [bonusPointsToUse, setBonusPointsToUse] = useState(0);
  const [showEmailField, setShowEmailField] = useState(false);

  // Stealth Capture for Abandoned Carts
  useShadowCapture(contactInfo.phone, contactInfo.email || '');

  // Load saved state
  useEffect(() => {
    const saved = localStorage.getItem('bt_checkout_state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.contactInfo) setContactInfo(parsed.contactInfo);
        if (parsed.deliveryInfo) setDeliveryInfo(parsed.deliveryInfo);
        if (parsed.currentStep) setCurrentStep(parsed.currentStep);
      } catch (e) {}
    }
  }, []);

  // Save state on change
  useEffect(() => {
    localStorage.setItem('bt_checkout_state', JSON.stringify({
      contactInfo,
      deliveryInfo,
      currentStep
    }));
  }, [contactInfo, deliveryInfo, currentStep]);

  // Handle Multi-Payment Sequence Returns
  useEffect(() => {
    const url = new URL(window.location.href);
    const status = url.searchParams.get('payment');
    const paidMerchant = url.searchParams.get('paidMerchant');
    
    if (status === 'success' && paidMerchant) {
      // Check if this was the last group
      const uniqueMerchants = new Set([
        ...cart.map(i => i.product.merchantId || 'boostertea'),
        ...accessoryCart.map(i => i.accessory.merchantId || 'boostertea')
      ]);
      if (uniqueMerchants.size <= 1 && uniqueMerchants.has(paidMerchant as any)) {
        clearCart();
        window.location.href = `/order-success?demo=true`;
        return;
      }
      
      // Remove paid items
      cart.forEach(item => {
        const mId = item.product.merchantId || 'boostertea';
        if (mId === paidMerchant) removeFromCart(item.product.id, item.volume);
      });
      accessoryCart.forEach(item => {
        const mId = item.accessory.merchantId || 'boostertea';
        if (mId === paidMerchant) removeAccessoryFromCart(item.accessory.id);
      });
      
      // Clean URL, stay on payment step
      setCurrentStep('payment');
      window.history.replaceState({}, '', '/checkout');
    }
  }, []);

  // Split Cart by Merchant
  const groups = React.useMemo(() => {
    const g: Record<string, any[]> = {};
    cart.forEach(item => {
      const mId = item.product.merchantId || 'boostertea';
      if (!g[mId]) g[mId] = [];
      g[mId].push({ type: 'tea', item });
    });
    accessoryCart.forEach(acc => {
      const mId = acc.accessory.merchantId || 'boostertea';
      if (!g[mId]) g[mId] = [];
      g[mId].push({ type: 'accessory', item: acc });
    });
    return Object.values(g);
  }, [cart, accessoryCart]);

  const activeGroup = groups[0] || [];
  const isSequential = groups.length > 1;

  // Calculate totals ONLY FOR ACTIVE GROUP DURING PAYMENT, but subtotal generally
  const subtotal = activeGroup.reduce((total, wrapped) => {
    if (wrapped.type === 'tea') {
      const price = wrapped.item.volume === '1L' ? wrapped.item.product.price1L : wrapped.item.product.price025L;
      return total + price * wrapped.item.quantity;
    } else {
      return total + wrapped.item.accessory.price * wrapped.item.quantity;
    }
  }, 0);
  
  const discountAmount = subtotal * (promoDiscount / 100);
  const total = subtotal - discountAmount;
  
  // NEW BONUS SYSTEM: 1 point = 0.5₴, can only use on accessories (not in checkout)
  // Points earned = 10% of order value
  const bonusPointsToEarn = Math.round(total * 0.1); // 10% earning rate
  const bonusDiscount = 0; // No bonus spending in checkout - only on accessories
  
  const marketingGifts = getMarketingGifts(cart);

  // Redirect if cart is empty AND we are not returning from payment
  useEffect(() => {
    if (cart.length === 0 && accessoryCart.length === 0) {
      const url = new URL(window.location.href);
      if (url.searchParams.get('payment') !== 'success') {
         navigate('/cart');
      }
    }
  }, [cart, accessoryCart, navigate]);

  const getProductName = (product: any) => {
    if (language === 'uk') return product.nameUk;
    return product.name;
  };

  const formatPhone = (value: string) => {
    // Keep only digits and '+'
    return value.replace(/[^\d+]/g, '');
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    
    // Add + at start if typing digits without it
    if (value && /^\d/.test(value)) {
      value = '+' + value;
    }
    
    const formatted = formatPhone(value);
    
    // Ensure only one plus at start
    const clean = formatted.startsWith('+') 
      ? '+' + formatted.substring(1).replace(/\+/g, '')
      : formatted.replace(/\+/g, '');
      
    setContactInfo({ ...contactInfo, phone: clean });
  };

  const validateContactInfo = () => {
    if (!contactInfo.lastName.trim()) {
      setError(language === 'uk' ? 'Введіть прізвище' : 'Enter last name');
      return false;
    }
    if (!contactInfo.firstName.trim()) {
      setError(language === 'uk' ? "Введіть ім'я" : 'Enter first name');
      return false;
    }
    const phoneDigits = contactInfo.phone.replace(/\D/g, '');
    if (phoneDigits.length < 10) {
      setError(language === 'uk' ? 'Введіть коректний номер телефону' : 'Enter valid phone number');
      return false;
    }
    setError(null);
    return true;
  };

  const validateDeliveryInfo = () => {
    if (deliveryInfo.method === 'pickup') {
      setError(null);
      return true;
    }
    if (!deliveryInfo.city.trim()) {
      setError(language === 'uk' ? 'Оберіть місто' : 'Select city');
      return false;
    }
    if (!deliveryInfo.warehouse.trim()) {
      setError(language === 'uk' ? 'Оберіть відділення Нової Пошти' : 'Select Nova Poshta warehouse');
      return false;
    }
    setError(null);
    return true;
  };

  const handleNextStep = () => {
    if (currentStep === 'contact' && validateContactInfo()) {
      setCurrentStep('delivery');
    } else if (currentStep === 'delivery' && validateDeliveryInfo()) {
      setCurrentStep('payment');
    }
  };

  const handlePreviousStep = () => {
    if (currentStep === 'delivery') {
      setCurrentStep('contact');
    } else if (currentStep === 'payment') {
      setCurrentStep('delivery');
    }
  };

  const handlePayment = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const fullName = `${contactInfo.lastName} ${contactInfo.firstName}`;
      
      // Create order via API
      // Track checkout
      try {
        const w = window as any;
        if (w.BT_Track) w.BT_Track.checkoutStart(0);
        if (w.BoosterFunnel) w.BoosterFunnel.trackCheckoutStart();
      } catch(e) {}
      const _src = (window as any).BoosterFunnel ? (window as any).BoosterFunnel.getOrderSource() : {};
      
      // Inject Telegram TMA Guest Auth Data
      const tele = typeof window !== 'undefined' ? (window as any).Telegram : null;
      const tUser = tele?.WebApp?.initDataUnsafe?.user;

      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: isAuthenticated && user ? String(user.id) : undefined,
          telegramId: tUser?.id ? String(tUser.id) : undefined,
          telegramUsername: tUser?.username,
          telegramFirstName: tUser?.first_name,
          items: activeGroup.map(wrapped => {
            if (wrapped.type === 'tea') {
              return {
                productId: wrapped.item.product.id,
                volume: wrapped.item.volume,
                quantity: wrapped.item.quantity
              };
            } else {
              return {
                productId: wrapped.item.accessory.id,
                volume: 'unit',
                quantity: wrapped.item.quantity
              };
            }
          }),
          promoCode: promoCode || undefined,
          deliveryMethod: deliveryInfo.method,
          deliveryCity: deliveryInfo.method === 'nova_poshta' ? deliveryInfo.city : 'Львів',
          deliveryCityRef: deliveryInfo.cityRef || undefined,
          deliveryWarehouse: deliveryInfo.method === 'nova_poshta' ? deliveryInfo.warehouse : undefined,
          deliveryWarehouseRef: deliveryInfo.warehouseRef || undefined,
          deliveryAddress: deliveryInfo.fullAddress || undefined,
          customerName: fullName,
          customerEmail: contactInfo.email || undefined,
          customerPhone: contactInfo.phone,
          marketingGiftCups: marketingGifts.totalCups,
          bonusPointsEarned: bonusPointsToEarn,
          refCode: typeof window !== 'undefined' ? localStorage.getItem('wsm_ref_code') || undefined : undefined,
          merchantId: activeGroup[0]?.type === 'tea' ? (activeGroup[0]?.item.product.merchantId || 'boostertea') : (activeGroup[0]?.item?.accessory?.merchantId || 'boostertea'),
          ..._src
        })
      });

      if (!orderResponse.ok) {
        throw new Error(language === 'uk' ? 'Помилка створення замовлення' : 'Order creation failed');
      }

      const orderData = await orderResponse.json();
      const orderId = orderData.order.id;

      // Track purchase conversion
      try {
        const w = window as any;
        const totalAmount = orderData.transaction?.totalAmount || 0;
        if (w.BT_Track) w.BT_Track.purchase(orderId, totalAmount, []);
      } catch(e) {}

      // Create payment invoice
      const merchantId = activeGroup[0]?.type === 'tea' ? (activeGroup[0]?.item.product.merchantId || 'boostertea') : (activeGroup[0]?.item?.accessory?.merchantId || 'boostertea');
      const paymentResponse = await fetch('/api/payment/create-invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
           transactionId: orderData.transaction.id, 
           merchantId,
           redirectUrl: `${window.location.origin}/checkout?payment=success&paidMerchant=${merchantId}` 
        })
      });

      const paymentData = await paymentResponse.json();

      if (!paymentResponse.ok) {
        if (paymentResponse.status === 503) {
          setMonobankConfigured(false);
          if (!isSequential) clearCart();
          window.location.href = `/order-success?order=${orderId}&demo=true`;
          return;
        }
        throw new Error(paymentData.error || (language === 'uk' ? 'Помилка оплати' : 'Payment failed'));
      }

      // We do NOT clear cart here if sequential. The redirect return will clear the paid group.
      if (!isSequential) {
         clearCart();
         localStorage.removeItem('bt_checkout_state');
      }

      if (paymentData.pageUrl) {
        const tele = (window as any).Telegram;
        if (tele && tele.WebApp && tele.WebApp.initDataUnsafe?.user) {
          // TWA Mini-Boss #1 Escape: Open external browser for Apple Pay support
          tele.WebApp.openLink(paymentData.pageUrl);
        } else {
        window.location.href = paymentData.pageUrl;
        }
      } else {
        if (isSequential) {
           setError('Payment gateway error: no URL generated.');
        } else {
           window.location.href = `/order-success?order=${orderId}`;
        }
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err instanceof Error ? err.message : (language === 'uk' ? 'Сталася помилка' : 'An error occurred'));
    } finally {
      setIsLoading(false);
    }
  };

  const steps: { key: CheckoutStep; label: string }[] = [
    { key: 'contact', label: language === 'uk' ? 'Контакти' : 'Contact' },
    { key: 'delivery', label: language === 'uk' ? 'Доставка' : 'Delivery' },
    { key: 'payment', label: language === 'uk' ? 'Оплата' : 'Payment' }
  ];

  const currentStepIndex = steps.findIndex(s => s.key === currentStep);

  if (cart.length === 0 && accessoryCart.length === 0) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <TeaLoader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <SEO 
        title={language === 'uk' ? 'Оформлення замовлення' : 'Checkout'}
        description={language === 'uk' ? 'Оформлення замовлення BoosterTea' : 'BoosterTea checkout'}
        noIndex={true}
      />
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumbs */}
          <div className="mb-8">
            <Breadcrumbs 
              items={[
                { label: language === 'uk' ? 'Головна' : 'Home', href: '/' },
                { label: language === 'uk' ? 'Кошик' : 'Cart', href: '/cart' },
                { label: language === 'uk' ? 'Оформлення' : 'Checkout' }
              ]} 
            />
          </div>

          <h1 
            className="text-4xl sm:text-5xl text-[var(--text-primary)] mb-8"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {language === 'uk' ? 'Оформлення замовлення' : 'Checkout'}
          </h1>

          {/* Progress Steps */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-start sm:justify-center mb-12 gap-4 sm:gap-0">
            {steps.map((step, index) => (
              <div key={step.key} className="flex items-center w-full sm:w-auto">
                <div 
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all flex-shrink-0 ${
                    index <= currentStepIndex 
                      ? 'bg-[var(--accent)] border-[#6B8E4E] text-[#0D0D0D]' 
                      : 'border-[#F5F0E8]/20 text-[var(--text-primary)]/40'
                  }`}
                >
                  {index < currentStepIndex ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <span className="text-sm font-bold">{index + 1}</span>
                  )}
                </div>
                <span className={`ml-3 sm:ml-2 text-sm font-medium ${
                  index <= currentStepIndex ? 'text-[var(--text-primary)]' : 'text-[var(--text-primary)]/40'
                }`}>
                  {step.label}
                </span>
                {index < steps.length - 1 && (
                  <div className={`hidden sm:block w-12 sm:w-24 h-0.5 mx-2 sm:mx-4 ${
                    index < currentStepIndex ? 'bg-[var(--accent)]' : 'bg-[#F5F0E8]/20'
                  }`} />
                )}
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400">
                  {error}
                </div>
              )}

              {/* Step 1: Contact Information - SIMPLIFIED */}
              {currentStep === 'contact' && (
                <div className="bg-[var(--bg-secondary)] rounded-2xl p-6 sm:p-8 border border-[var(--card-border)]">
                  <h2 
                    className="text-2xl text-[var(--text-primary)] mb-6"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {language === 'uk' ? 'Контактна інформація' : 'Contact Information'}
                  </h2>
                  
                  <div className="space-y-5">
                    {/* Last Name */}
                    <div>
                      <label className="block text-[var(--text-primary)]/70 text-sm mb-2">
                        {language === 'uk' ? 'Прізвище' : 'Last Name'} *
                      </label>
                      <input
                        type="text"
                        value={contactInfo.lastName}
                        onChange={(e) => setContactInfo({ ...contactInfo, lastName: e.target.value })}
                        placeholder={language === 'uk' ? 'Шевченко' : 'Shevchenko'}
                        className="w-full px-4 py-3.5 bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] placeholder-[#F5F0E8]/30 focus:border-[#6B8E4E] focus:outline-none transition-colors text-lg"
                        autoComplete="family-name"
                      />
                    </div>
                    
                    {/* First Name */}
                    <div>
                      <label className="block text-[var(--text-primary)]/70 text-sm mb-2">
                        {language === 'uk' ? "Ім'я" : 'First Name'} *
                      </label>
                      <input
                        type="text"
                        value={contactInfo.firstName}
                        onChange={(e) => setContactInfo({ ...contactInfo, firstName: e.target.value })}
                        placeholder={language === 'uk' ? 'Тарас' : 'Taras'}
                        className="w-full px-4 py-3.5 bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] placeholder-[#F5F0E8]/30 focus:border-[#6B8E4E] focus:outline-none transition-colors text-lg"
                        autoComplete="given-name"
                      />
                    </div>
                    
                    {/* Phone */}
                    <div>
                      <label className="block text-[var(--text-primary)]/70 text-sm mb-2">
                        {language === 'uk' ? 'Телефон' : 'Phone'} *
                      </label>
                      <input
                        type="tel"
                        value={contactInfo.phone}
                        onChange={handlePhoneChange}
                        placeholder="+380XXXXXXXXX"
                        className="w-full px-4 py-3.5 bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] placeholder-[#F5F0E8]/30 focus:border-[#6B8E4E] focus:outline-none transition-colors text-lg"
                        autoComplete="tel"
                      />
                      <p className="text-[var(--text-primary)]/40 text-xs mt-1.5">
                        {language === 'uk' ? 'Для підтвердження замовлення та TTH Нової Пошти' : 'For order confirmation and Nova Poshta tracking'}
                      </p>
                    </div>

                    {/* Optional Email */}
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => setShowEmailField(!showEmailField)}
                        className="text-[var(--accent)] text-sm hover:underline flex items-center gap-2"
                      >
                        <svg className={`w-4 h-4 transition-transform ${showEmailField ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        {language === 'uk' ? 'Додати email (необов\'язково)' : 'Add email (optional)'}
                      </button>
                      
                      {showEmailField && (
                        <div className="mt-3">
                          <input
                            type="email"
                            value={contactInfo.email || ''}
                            onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                            placeholder="email@example.com"
                            className="w-full px-4 py-3.5 bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] placeholder-[#F5F0E8]/30 focus:border-[#6B8E4E] focus:outline-none transition-colors"
                            autoComplete="email"
                          />
                          <p className="text-[var(--text-primary)]/40 text-xs mt-1.5">
                            {language === 'uk' ? 'Для електронного чеку та новин' : 'For digital receipt and news'}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <button
                    onClick={handleNextStep}
                    className="w-full mt-8 py-4 bg-[var(--accent)] text-[#0D0D0D] font-bold rounded-xl hover:bg-[#5a7a42] transition-all text-lg"
                  >
                    {language === 'uk' ? 'Далі — Доставка' : 'Next — Delivery'}
                  </button>
                </div>
              )}

              {/* Step 2: Delivery - SIMPLIFIED to Nova Poshta only + Pickup */}
              {currentStep === 'delivery' && (
                <div className="bg-[var(--bg-secondary)] rounded-2xl p-6 sm:p-8 border border-[var(--card-border)]">
                  <h2 
                    className="text-2xl text-[var(--text-primary)] mb-6"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {language === 'uk' ? 'Спосіб доставки' : 'Delivery Method'}
                  </h2>
                  
                  {/* Delivery Method - Only Nova Poshta + Pickup */}
                  <div className="mb-6">
                    <div className="grid sm:grid-cols-2 gap-3">
                      <button
                        onClick={() => setDeliveryInfo({ 
                          ...deliveryInfo, 
                          method: 'nova_poshta',
                          city: '',
                          cityRef: '',
                          warehouse: '',
                          warehouseRef: '',
                          warehouseAddress: '',
                          fullAddress: ''
                        })}
                        className={`p-5 rounded-xl border-2 transition-all text-left ${
                          deliveryInfo.method === 'nova_poshta'
                            ? 'border-[#6B8E4E] bg-[var(--accent)]/10'
                            : 'border-[var(--border)] hover:border-[#F5F0E8]/30'
                        }`}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-2xl">📦</span>
                          <span className={`font-bold ${
                            deliveryInfo.method === 'nova_poshta' ? 'text-[var(--accent)]' : 'text-[var(--text-primary)]'
                          }`}>
                            {language === 'uk' ? 'Нова Пошта' : 'Nova Poshta'}
                          </span>
                        </div>
                        <p className="text-[var(--text-primary)]/60 text-sm">
                          {language === 'uk' ? 'Доставка у відділення 1-3 дні' : 'Delivery to warehouse 1-3 days'}
                        </p>
                      </button>
                      
                      <button
                        onClick={() => setDeliveryInfo({ 
                          ...deliveryInfo, 
                          method: 'pickup',
                          city: 'Львів',
                          cityRef: '',
                          warehouse: '',
                          warehouseRef: '',
                          warehouseAddress: '',
                          fullAddress: 'м. Львів, вул. Богдана Хмельницького 66а'
                        })}
                        className={`p-5 rounded-xl border-2 transition-all text-left ${
                          deliveryInfo.method === 'pickup'
                            ? 'border-[#6B8E4E] bg-[var(--accent)]/10'
                            : 'border-[var(--border)] hover:border-[#F5F0E8]/30'
                        }`}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-2xl">🏪</span>
                          <span className={`font-bold ${
                            deliveryInfo.method === 'pickup' ? 'text-[var(--accent)]' : 'text-[var(--text-primary)]'
                          }`}>
                            {language === 'uk' ? 'Самовивіз' : 'Pickup'}
                          </span>
                        </div>
                        <p className="text-[var(--text-primary)]/60 text-sm">
                          {language === 'uk' ? 'Львів, безкоштовно' : 'Lviv, free'}
                        </p>
                      </button>
                    </div>
                  </div>
                  
                  {/* Nova Poshta Selector */}
                  {deliveryInfo.method === 'nova_poshta' && (
                    <div className="space-y-4">
                      <NovaPoshtaSelector 
                        onSelect={(data) => {
                          setDeliveryInfo({
                            ...deliveryInfo,
                            city: data.cityName,
                            cityRef: data.cityRef,
                            warehouse: data.warehouseNumber,
                            warehouseRef: data.warehouseRef,
                            warehouseAddress: data.warehouseAddress,
                            fullAddress: data.fullAddress
                          });
                        }}
                        initialCity={deliveryInfo.city}
                        initialWarehouse={deliveryInfo.warehouse}
                      />
                      
                      {/* Selected delivery info */}
                      {deliveryInfo.fullAddress && (
                        <div className="p-4 bg-[var(--accent)]/10 rounded-xl border border-[#6B8E4E]/30">
                          <p className="text-[var(--accent)] font-medium text-sm mb-1">
                            {language === 'uk' ? 'Адреса доставки:' : 'Delivery address:'}
                          </p>
                          <p className="text-[var(--text-primary)]">{deliveryInfo.fullAddress}</p>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Pickup Info */}
                  {deliveryInfo.method === 'pickup' && (
                    <div className="p-5 bg-[var(--accent)]/10 rounded-xl border border-[#6B8E4E]/30">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-[var(--accent)] rounded-xl flex items-center justify-center flex-shrink-0">
                          <span className="text-2xl">📍</span>
                        </div>
                        <div>
                          <p className="text-[var(--accent)] font-bold text-lg">
                            {language === 'uk' ? 'Адреса самовивозу' : 'Pickup Address'}
                          </p>
                          <p className="text-[var(--text-primary)] mt-1 text-lg">
                            м. Львів, вул. Богдана Хмельницького 66а
                          </p>
                          <p className="text-[var(--text-primary)]/60 text-sm mt-2">
                            {language === 'uk' ? 'Пн-Пт: 9:00-18:00, Сб: 10:00-15:00' : 'Mon-Fri: 9:00-18:00, Sat: 10:00-15:00'}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex gap-4 mt-8">
                    <button
                      onClick={handlePreviousStep}
                      className="px-6 py-4 border border-[#F5F0E8]/20 text-[var(--text-primary)] rounded-xl hover:bg-[#F5F0E8]/10 transition-all"
                    >
                      {language === 'uk' ? 'Назад' : 'Back'}
                    </button>
                    <button
                      onClick={handleNextStep}
                      className="flex-1 py-4 bg-[var(--accent)] text-[#0D0D0D] font-bold rounded-xl hover:bg-[#5a7a42] transition-all text-lg"
                    >
                      {language === 'uk' ? 'Далі — Оплата' : 'Next — Payment'}
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Payment */}
              {currentStep === 'payment' && (
                <div className="bg-[var(--bg-secondary)] rounded-2xl p-6 sm:p-8 border border-[var(--card-border)]">
                  <h2 
                    className="text-2xl text-[var(--text-primary)] mb-6"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {language === 'uk' ? 'Підтвердження замовлення' : 'Order Confirmation'}
                  </h2>

                  {/* Multi-Payment Warning Banner */}
                  {isSequential && (
                    <div className="mb-6 p-4 bg-yellow-500/10 rounded-xl border border-yellow-500/30">
                      <div className="flex items-start gap-4">
                        <span className="text-2xl mt-1">⚠️</span>
                        <div>
                          <p className="text-yellow-500 font-bold mb-1">
                            {language === 'uk' ? 'Оплата частинами' : 'Split Payment'}
                          </p>
                          <p className="text-[var(--text-primary)] text-sm">
                            {language === 'uk' 
                              ? `Ваше замовлення складається з товарів різних партнерів. Оплата буде проведена у ${groups.length} етапи. Наразі ви сплачуєте Частину 1.` 
                              : `Your order contains physical goods from different partners. The payment will be split into ${groups.length} steps. You are paying Step 1 now.`}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Order Summary */}
                  <div className="mb-6">
                    <h3 className="text-[var(--text-primary)] font-medium mb-4">
                      {language === 'uk' ? 'Ваше замовлення' : 'Your Order'}
                    </h3>
                    <div className="space-y-3">
                      {activeGroup.map((wrapped) => {
                        if (wrapped.type === 'tea') {
                          const item = wrapped.item;
                          const price = item.volume === '1L' ? item.product.price1L : item.product.price025L;
                          return (
                            <div key={`${item.product.id}-${item.volume}`} className="flex justify-between items-center py-3 border-b border-[var(--border)]">
                              <div className="flex items-center gap-3">
                                <img 
                                  src={item.product.image} 
                                  alt={getProductName(item.product)} 
                                  className="w-12 h-12 object-contain rounded-lg bg-[var(--bg-primary)]"
                                />
                                <div>
                                  <p className="text-[var(--text-primary)] font-medium">{getProductName(item.product)}</p>
                                  <p className="text-[var(--text-primary)]/60 text-sm">{item.volume} × {item.quantity}</p>
                                </div>
                              </div>
                              <span className="text-[var(--text-primary)] font-medium">{(price * item.quantity).toLocaleString()}₴</span>
                            </div>
                          );
                        } else {
                          const item = wrapped.item;
                          const price = item.accessory.price;
                          return (
                            <div key={`acc-${item.accessory.id}`} className="flex justify-between items-center py-3 border-b border-[var(--border)]">
                              <div className="flex items-center gap-3">
                                <img 
                                  src={item.accessory.image} 
                                  alt={getProductName(item.accessory)} 
                                  className="w-12 h-12 object-contain rounded-lg bg-[var(--bg-primary)]"
                                />
                                <div>
                                  <p className="text-[var(--text-primary)] font-medium">{getProductName(item.accessory)}</p>
                                  <p className="text-[var(--text-primary)]/60 text-sm">{language === 'uk' ? 'Одиниць:' : 'Qty:'} {item.quantity}</p>
                                </div>
                              </div>
                              <span className="text-[var(--text-primary)] font-medium">{(price * item.quantity).toLocaleString()}₴</span>
                            </div>
                          );
                        }
                      })}
                    </div>
                  </div>

                  {/* Marketing Gifts Banner */}
                  {marketingGifts.totalCups > 0 && (
                    <div className="mb-6 p-4 bg-[#E07B2D]/10 rounded-xl border border-[#E07B2D]/30">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">🎁</span>
                        <div>
                          <p className="text-[#E07B2D] font-bold">
                            {language === 'uk' ? 'Ваш подарунок!' : 'Your gift!'}
                          </p>
                          <p className="text-[var(--text-primary)]">
                            {language === 'uk' 
                              ? `${marketingGifts.totalCups} брендованих стаканчиків з кришками`
                              : `${marketingGifts.totalCups} branded cups with lids`}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Bonus Points Earning */}
                  <div className="mb-6 p-4 bg-[#C9A962]/10 rounded-xl border border-[#C9A962]/30">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">⭐</span>
                      <div>
                        <p className="text-[#C9A962] font-bold">
                          {language === 'uk' ? 'Ви отримаєте бонуси!' : 'You will earn bonus points!'}
                        </p>
                        <p className="text-[var(--text-primary)]">
                          <span className="font-bold text-[#C9A962]">+{bonusPointsToEarn}</span>{' '}
                          {language === 'uk' 
                            ? 'балів (10% від замовлення)'
                            : 'points (10% of order)'}
                        </p>
                        <p className="text-[var(--text-primary)]/60 text-sm mt-1">
                          {language === 'uk' 
                            ? '1 бал = 0.50₴ на аксесуари та сувеніри'
                            : '1 point = 0.50₴ for accessories and souvenirs'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Contact & Delivery Summary */}
                  <div className="mb-6 p-4 bg-[var(--bg-primary)] rounded-xl space-y-3">
                    <div className="flex justify-between">
                      <span className="text-[var(--text-primary)]/60">{language === 'uk' ? 'Отримувач:' : 'Recipient:'}</span>
                      <span className="text-[var(--text-primary)]">{contactInfo.lastName} {contactInfo.firstName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--text-primary)]/60">{language === 'uk' ? 'Телефон:' : 'Phone:'}</span>
                      <span className="text-[var(--text-primary)]">{contactInfo.phone}</span>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="text-[var(--text-primary)]/60">{language === 'uk' ? 'Доставка:' : 'Delivery:'}</span>
                      <span className="text-[var(--text-primary)] text-right max-w-[60%]">
                        {deliveryInfo.method === 'pickup' 
                          ? (language === 'uk' ? 'Самовивіз — Львів' : 'Pickup — Lviv')
                          : deliveryInfo.fullAddress || deliveryInfo.city
                        }
                      </span>
                    </div>
                  </div>
                  
                  {/* Totals */}
                  <div className="border-t border-[var(--border)] pt-4 space-y-2">
                    <div className="flex justify-between text-[var(--text-primary)]/70">
                      <span>{language === 'uk' ? 'Товари' : 'Products'}</span>
                      <span>{subtotal.toLocaleString()}₴</span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-[var(--accent)]">
                        <span>{language === 'uk' ? 'Знижка' : 'Discount'} ({promoDiscount}%)</span>
                        <span>-{discountAmount.toLocaleString()}₴</span>
                      </div>
                    )}
                    <div className="flex justify-between text-[var(--text-primary)]/70">
                      <span>{language === 'uk' ? 'Доставка' : 'Delivery'}</span>
                      <span>{language === 'uk' ? 'За тарифами перевізника' : 'Per carrier rates'}</span>
                    </div>
                    <div className="flex justify-between text-xl font-bold text-[var(--text-primary)] pt-2 border-t border-[var(--border)]">
                      <span>{language === 'uk' ? 'До сплати' : 'Total'}</span>
                      <span>{total.toLocaleString()}₴</span>
                    </div>
                  </div>

                  {/* Payment Methods */}
                  <div className="mt-6 p-4 bg-[var(--bg-primary)] rounded-xl border border-[var(--border)]">
                    <p className="text-[var(--text-primary)]/60 text-sm mb-3 font-medium">
                      {language === 'uk' ? 'Безпечна оплата:' : 'Secure payment:'}
                    </p>
                    <div className="h-8 flex gap-2 items-center opacity-80 transition-all duration-300">
                      {/* Dark Theme Assets */}
                      <img src="/payments/footer_visa_dark_bg.svg" alt="Visa" className="h-full w-auto hidden dark:block" />
                      <img src="/payments/footer_mc_dark_bg.svg" alt="Mastercard" className="h-full w-auto hidden dark:block" />
                      <img src="/payments/footer_apple_pay_dark_bg.svg" alt="Apple Pay" className="h-full w-auto hidden dark:block" />
                      <img src="/payments/footer_google_pay_dark_bg.svg" alt="Google Pay" className="h-full w-auto hidden dark:block" />
                      <img src="/payments/footer_plata_dark_bg.svg" alt="Mono" className="h-full w-auto hidden dark:block" />
                      
                      {/* Light Theme Assets */}
                      <img src="/payments/footer_visa_light_bg.svg" alt="Visa" className="h-full w-auto block dark:hidden" />
                      <img src="/payments/footer_mc_light_bg.svg" alt="Mastercard" className="h-full w-auto block dark:hidden" />
                      <img src="/payments/footer_apple_pay_light_bg.svg" alt="Apple Pay" className="h-full w-auto block dark:hidden" />
                      <img src="/payments/footer_google_pay_light_bg.svg" alt="Google Pay" className="h-full w-auto block dark:hidden" />
                      <img src="/payments/footer_plata_light_bg.svg" alt="Mono" className="h-full w-auto block dark:hidden" />
                    </div>
                  </div>
                  
                  <div className="flex gap-4 mt-8">
                    <button
                      onClick={handlePreviousStep}
                      className="px-6 py-4 border border-[#F5F0E8]/20 text-[var(--text-primary)] rounded-xl hover:bg-[#F5F0E8]/10 transition-all"
                    >
                      {language === 'uk' ? 'Назад' : 'Back'}
                    </button>
                    <button
                      onClick={handlePayment}
                      disabled={isLoading}
                      className="flex-1 py-4 bg-[var(--accent)] text-[#0D0D0D] font-bold rounded-xl hover:bg-[#5a7a42] transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                    >
                      {isLoading ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          {language === 'uk' ? 'Обробка...' : 'Processing...'}
                        </span>
                      ) : (
                        language === 'uk' ? (isSequential ? `Оплатити Частину 1 (${total.toLocaleString()}₴)` : `Оплатити ${total.toLocaleString()}₴`) : `Pay ${total.toLocaleString()}₴`
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar - Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-[var(--bg-secondary)] rounded-2xl p-6 border border-[var(--card-border)] sticky top-28">
                <h3 
                  className="text-xl text-[var(--text-primary)] mb-4"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {language === 'uk' ? 'Кошик' : 'Cart'}
                </h3>
                
                <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
                  {cart.map((item) => {
                    const price = item.volume === '1L' ? item.product.price1L : item.product.price025L;
                    const isActive = activeGroup.some(active => active.type === 'tea' && active.item.product.id === item.product.id && active.item.volume === item.volume);
                    return (
                      <div key={`${item.product.id}-${item.volume}`} className={`flex gap-3 p-2 rounded-lg transition-colors ${isActive ? 'bg-[var(--accent)]/10 border border-[var(--accent)]/30' : 'opacity-50'}`}>
                        <img 
                          src={item.product.image} 
                          alt={getProductName(item.product)} 
                          className="w-16 h-16 object-contain rounded-lg bg-[var(--bg-primary)]"
                        />
                        <div className="flex-1">
                          <p className="text-[var(--text-primary)] text-sm font-medium">{getProductName(item.product)}</p>
                          <p className="text-[var(--text-primary)]/60 text-xs">{item.volume} × {item.quantity}</p>
                          <p className="text-[var(--accent)] font-medium mt-1">{(price * item.quantity).toLocaleString()}₴</p>
                        </div>
                        {isSequential && !isActive && (
                           <div className="text-[10px] uppercase font-bold text-[var(--text-primary)]/40 self-center tracking-wider">
                             Очікує
                           </div>
                        )}
                      </div>
                    );
                  })}
                  {accessoryCart.map((acc) => {
                    const price = acc.accessory.price;
                    const isActive = activeGroup.some(active => active.type === 'accessory' && active.item.accessory.id === acc.accessory.id);
                    return (
                      <div key={`acc-${acc.accessory.id}`} className={`flex gap-3 p-2 rounded-lg transition-colors ${isActive ? 'bg-[var(--accent)]/10 border border-[var(--accent)]/30' : 'opacity-50'}`}>
                        <img 
                          src={acc.accessory.image} 
                          alt={getProductName(acc.accessory)} 
                          className="w-16 h-16 object-contain rounded-lg bg-[var(--bg-primary)]"
                        />
                        <div className="flex-1">
                          <p className="text-[var(--text-primary)] text-sm font-medium">{getProductName(acc.accessory)}</p>
                          <p className="text-[var(--text-primary)]/60 text-xs">{language === 'uk' ? 'Одиниці:' : 'Qty:'} {acc.quantity}</p>
                          <p className="text-[var(--accent)] font-medium mt-1">{(price * acc.quantity).toLocaleString()}₴</p>
                        </div>
                        {isSequential && !isActive && (
                           <div className="text-[10px] uppercase font-bold text-[var(--text-primary)]/40 self-center tracking-wider">
                             Очікує
                           </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Marketing Gift in Sidebar */}
                {marketingGifts.totalCups > 0 && (
                  <div className="mt-4 pt-4 border-t border-[var(--border)]">
                    <div className="flex items-center gap-2 text-[#E07B2D]">
                      <span>🎁</span>
                      <span className="text-sm font-medium">
                        +{marketingGifts.totalCups} {language === 'uk' ? 'стаканчиків' : 'cups'}
                      </span>
                    </div>
                  </div>
                )}
                
                <div className="mt-4 pt-4 border-t border-[var(--border)] space-y-2">
                  <div className="flex justify-between text-[var(--text-primary)]/70 text-sm">
                    <span>{language === 'uk' ? 'Сума' : 'Subtotal'}</span>
                    <span>{subtotal.toLocaleString()}₴</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-[var(--accent)] text-sm">
                      <span>{language === 'uk' ? 'Знижка' : 'Discount'}</span>
                      <span>-{discountAmount.toLocaleString()}₴</span>
                    </div>
                  )}
                  <div className="flex justify-between text-[var(--text-primary)] font-bold text-lg pt-2">
                    <span>{language === 'uk' ? 'Разом' : 'Total'}</span>
                    <span>{total.toLocaleString()}₴</span>
                  </div>
                </div>

                {/* Bonus Points Preview */}
                <div className="mt-4 p-3 bg-[#C9A962]/10 rounded-lg">
                  <p className="text-[#C9A962] text-sm flex items-center gap-2">
                    <span>⭐</span>
                    <span>+{bonusPointsToEarn} {language === 'uk' ? 'бонусних балів' : 'bonus points'}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
      <TelegramButton />
    </div>
  );
};

export default Checkout;
