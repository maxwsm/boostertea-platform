import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../lib/auth';
import Header from '../components/Header';
import Footer from '../components/Footer';
import TelegramButton from '../components/TelegramButton';
import { SEO, useSEOConfig } from '../components/SEO';
import { Copy, Gift, MapPin, Package, Settings, Sparkles, Star, TrendingUp, User as UserIcon, Zap, CheckCircle2, Target } from 'lucide-react';

const Account = () => {
  const [, setLocation] = useLocation();
  const seoConfig = useSEOConfig('account');
  const { 
    user, isAuthenticated, isLoading: authLoading, logout, orders, 
    updateUser, addAddress, removeAddress, setDefaultAddress
  } = useAuth();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [copiedReferral, setCopiedReferral] = useState(false);

  // Profile Form State
  const [profileForm, setProfileForm] = useState({ name: '', phone: '', email: '' });
  const [newAddress, setNewAddress] = useState({ city: '', warehouse: '' });
  const [toastMessage, setToastMessage] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);

  // B2B Hunter Form State
  const [b2bForm, setB2bForm] = useState({ cafeName: '', city: '', address: '', notes: '' });
  const [isB2bSubmitting, setIsB2bSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) setLocation('/login');
    if (user) setProfileForm({ name: user.name, phone: user.phone, email: user.email });
  }, [isAuthenticated, authLoading, setLocation, user]);

  if (authLoading || !user) return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
      <div className="relative w-24 h-24">
        <div className="absolute inset-0 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin"></div>
        <div className="absolute inset-2 border-4 border-[#7FB030] border-b-transparent rounded-full animate-spin animation-delay-200"></div>
      </div>
    </div>
  );

  const copyReferralLink = () => {
    navigator.clipboard.writeText(`https://boostertea.com.ua/ref/${user.referralCode}`);
    setCopiedReferral(true);
    setTimeout(() => setCopiedReferral(false), 2000);
  };

  const shareReferral = (platform: string) => {
    const text = `Бро, спробуй BoosterTea! Отримуй бонус 50 грн по моєму посиланню: https://boostertea.com.ua/ref/${user.referralCode}`;
    const urls: Record<string, string> = {
      telegram: `https://t.me/share/url?url=https://boostertea.com.ua/ref/${user.referralCode}&text=${encodeURIComponent(text)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text)}`
    };
    if (urls[platform]) window.open(urls[platform], '_blank');
  };

  const showToast = (msg: string) => { setToastMessage(msg); setTimeout(() => setToastMessage(''), 3000); };

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({ ...user, ...profileForm });
    showToast('Профіль успішно оновлено! ✅');
  };

  const handleB2bSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!b2bForm.cafeName) return;
    setIsB2bSubmitting(true);
    try {
      const res = await fetch('/api/b2b/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, ...b2bForm })
      });
      if (res.ok) {
        showToast('Ціль взята в розробку! Очікуй бонуси. 🎯');
        setB2bForm({ cafeName: '', city: '', address: '', notes: '' });
      } else {
        showToast('Помилка передачі координат.');
      }
    } catch(err) {
      showToast('Помилка з\'єднання.');
    } finally {
      setIsB2bSubmitting(false);
    }
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (newAddress.city && newAddress.warehouse) {
      addAddress({
        label: 'Нова адреса',
        fullName: profileForm.name,
        phone: profileForm.phone,
        city: newAddress.city,
        address: `Відділення НП: ${newAddress.warehouse}`,
        isDefault: user.addresses.length === 0
      });
      setNewAddress({ city: '', warehouse: '' });
      showToast('Нову адресу збережено 📦');
    }
  };

  // Gamification Logic
  const profileCompletion = () => {
    let score = 0;
    if (user.name) score += 25;
    if (user.email) score += 25;
    if (user.phone) score += 25;
    if (user.addresses && user.addresses.length > 0) score += 25;
    return score; // Max 100
  };

  const currentScore = profileCompletion();
  const isProfileFull = currentScore >= 100;

  const claimProfileBonus = () => {
    if (isProfileFull && !user.hasClaimedProfileBonus) {
      updateUser({ 
        bonusPoints: user.bonusPoints + 80, 
        hasClaimedProfileBonus: true 
      });
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4000);
      showToast('Вітаємо! Ти отримав +80 балів! 🚀');
    }
  };

  const nextStatusGoal = user.totalLiters < 5 ? 5 : user.totalLiters < 15 ? 15 : 50;
  const progress = (user.totalLiters / nextStatusGoal) * 100;
  const statusName = user.totalLiters < 5 ? 'Новачок' : user.totalLiters < 15 ? 'Tea Lover' : 'Energy Master';

  // Abstract Tabs
  const tabs = [
    { id: 'profile', label: 'Командний Центр', icon: UserIcon },
    { id: 'journey', label: 'Територія Енергії', icon: Zap },
    { id: 'orders', label: 'Скриня Замовлень', icon: Package },
    { id: 'referral', label: 'Арсенал (Бонуси)', icon: Gift },
    { id: 'b2b-hunter', label: 'C2B2B Хант', icon: Target }
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] relative overflow-hidden">
      <SEO title={seoConfig.title} description={seoConfig.description} noIndex={true} />
      <Header />
      
      {/* 3D Abstract Background Elements */}
      <div className="absolute top-[-10%] right-[-5%] w-[40vw] h-[40vw] rounded-full bg-[var(--accent)] opacity-[0.03] blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#7FB030] opacity-[0.02] blur-[120px] pointer-events-none" />
      
      {/* Confetti Overlay */}
      <AnimatePresence>
        {showConfetti && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center overflow-hidden"
          >
            {[...Array(50)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ y: -100, x: 0, opacity: 1, rotate: 0 }}
                animate={{ 
                  y: window.innerHeight, 
                  x: Math.random() * window.innerWidth - window.innerWidth/2,
                  opacity: 0,
                  rotate: Math.random() * 720
                }}
                transition={{ duration: Math.random() * 2 + 1, ease: "easeOut" }}
                className="absolute text-3xl"
                style={{ left: '50%', top: '-5%' }}
              >
                {['🎁','💰','🚀','✨','🍵'][i % 5]}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <main className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Onboarding Guide Overlays (Minimalist execution) */}
        {!user.hasCompletedOnboarding && (
           <div className="mb-12 bg-gradient-to-r from-[var(--bg-secondary)] to-[var(--bg-tertiary)] border border-[var(--accent)]/30 p-6 rounded-3xl shadow-xl shadow-[var(--accent)]/5 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden group">
             <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay"></div>
             <div className="relative z-10 flex-1">
               <div className="flex items-center gap-3 mb-2">
                 <Sparkles className="text-[var(--accent)] animate-pulse" />
                 <h3 className="font-bold text-xl tracking-tight">Вітаємо у BoosterTea Club!</h3>
               </div>
               <p className="text-[var(--text-secondary)]">Ви пройшли реєстрацію та отримали 20 стартових балів. Заповніть свій Командний Центр повністю, щоб зібрати всі 100 балів! Використовуй їх при оплаті крутих фірмових аксесуарів.</p>
             </div>
             <button 
               onClick={() => updateUser({ hasCompletedOnboarding: true })} 
               className="relative z-10 whitespace-nowrap px-8 py-3 bg-[var(--accent)] text-black font-bold rounded-xl hover:scale-105 transition-transform shadow-lg shadow-[var(--accent)]/20"
             >
               Поїхали! 🚀
             </button>
           </div>
        )}

        <AnimatePresence>
          {toastMessage && (
            <motion.div 
              initial={{ opacity: 0, y: -20, x: '-50%' }} animate={{ opacity: 1, y: 0, x: '-50%' }} exit={{ opacity: 0, y: -20, x: '-50%' }}
              className="fixed top-24 left-1/2 z-50 bg-[#7FB030] text-black font-bold px-6 py-3 rounded-2xl shadow-[0_10px_40px_rgba(127,176,48,0.3)] flex items-center gap-3 backdrop-blur-md"
            >
              <CheckCircle2 className="w-5 h-5" />
              {toastMessage}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Glassmorphic Sidebar */}
          <div className="lg:col-span-3 space-y-6">
            <div className="glass rounded-3xl p-6 border-white/5 relative overflow-hidden backdrop-blur-2xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent)]/10 rounded-full blur-[40px] -mr-10 -mt-10" />
              <div className="relative z-10 text-center">
                <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-[var(--bg-tertiary)] to-[var(--bg-primary)] p-1 rounded-full border border-white/10 shadow-2xl relative">
                  <div className="w-full h-full rounded-full bg-gradient-to-b from-[var(--accent)] to-[#7FB030] flex items-center justify-center text-black text-3xl font-extrabold pb-1">
                    {user.name.charAt(0)}
                  </div>
                  {isProfileFull && <div className="absolute -bottom-2 -right-2 bg-black text-xs p-1.5 rounded-full border-2 border-[var(--accent)]" title="VIP Account">⭐</div>}
                </div>
                <h2 className="font-bold text-xl mb-1 tracking-tight">{user.name}</h2>
                <p className="text-xs text-[var(--text-subtle)] mb-5">{user.email}</p>
                <div className="px-5 py-2.5 bg-gradient-to-r from-[var(--accent)]/10 to-transparent rounded-2xl inline-flex flex-col items-center border border-[var(--accent)]/20 w-full hover:border-[var(--accent)]/50 transition-colors">
                  <span className="text-[10px] uppercase font-bold text-[var(--text-subtle)] tracking-wider">Баланс емоцій</span>
                  <span className="text-[var(--accent)] font-extrabold text-2xl drop-shadow-[0_0_8px_rgba(159,211,86,0.3)]">{user.bonusPoints} <span className="text-sm">₴</span></span>
                </div>
              </div>
            </div>
            
            <nav className="glass rounded-3xl p-3 border-white/5 flex flex-col gap-2 backdrop-blur-xl">
              {tabs.map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)} 
                    className={`w-full text-left px-5 py-3.5 rounded-2xl transition-all duration-300 flex items-center gap-4 font-bold relative overflow-hidden group ${isActive ? 'bg-gradient-to-r from-[var(--accent)] to-[#7FB030] text-black shadow-lg shadow-[var(--accent)]/20 scale-[1.02]' : 'hover:bg-white/5 text-[var(--text-secondary)]'}`}>
                    <Icon className={`w-5 h-5 ${isActive ? 'text-black' : 'text-[var(--text-subtle)] group-hover:text-[var(--text-primary)]'} transition-colors`} />
                    <span className="relative z-10">{tab.label}</span>
                    {isActive && <motion.div layoutId="nav-pill" className="absolute inset-0 rounded-2xl border-2 border-white/20" />}
                  </button>
                )
              })}
              <div className="pt-2 mt-2 border-t border-white/5">
                <button onClick={logout} className="w-full text-left px-5 py-3.5 rounded-2xl text-red-400 opacity-60 hover:bg-red-500/10 hover:opacity-100 transition-all font-bold flex items-center gap-4">
                  <Settings className="w-5 h-5" /> Вийти з системи
                </button>
              </div>
            </nav>
          </div>

          {/* Interactive Banners Area & Dynamic Content */}
          <div className="lg:col-span-9 min-h-[60vh]">
            <AnimatePresence mode="wait">
              {activeTab === 'profile' && (
                <motion.div key="profile" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
                  
                  {/* Profile Completion Widget */}
                  {!user.hasClaimedProfileBonus && (
                    <div className="bg-gradient-to-r from-[#1A1A1A] to-[var(--bg-secondary)] p-6 rounded-3xl border border-[var(--border)] relative overflow-hidden flex flex-col md:flex-row items-center gap-6 justify-between shadow-xl">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-bold flex items-center gap-2"><TargetIcon /> Готовність профілю</h3>
                          <span className="text-[var(--accent)] font-extrabold">{currentScore}%</span>
                        </div>
                        <div className="w-full bg-[var(--bg-primary)] h-3 rounded-full overflow-hidden mb-2">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${currentScore}%` }} className="h-full bg-[var(--accent)] rounded-full" />
                        </div>
                        <p className="text-xs text-[var(--text-subtle)]">
                          {isProfileFull ? "Чудово! Профіль заповнений на всі 100%." : "Дозаповни ПІБ, Телефон, Email та додай адресу доставки, щоб забрати винагороду."}
                        </p>
                      </div>
                      <div className="shrink-0 text-center">
                        <button 
                          onClick={claimProfileBonus}
                          disabled={!isProfileFull}
                          className={`px-6 py-3 rounded-2xl font-bold uppercase tracking-wide text-xs transition-all shadow-lg ${isProfileFull ? 'bg-[var(--accent)] text-black hover:scale-105 active:scale-95 shadow-[var(--accent)]/30 animate-pulse-glow' : 'bg-[var(--bg-primary)] text-[var(--text-muted)] cursor-not-allowed border border-[var(--border)]'}`}
                        >
                          Отримати +80 балів
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="grid lg:grid-cols-2 gap-6">
                    {/* Data Form */}
                    <div className="glass p-8 rounded-3xl border-white/5 shadow-xl relative overflow-hidden">
                      <div className="absolute top-0 -left-10 w-20 h-20 bg-[var(--accent)]/5 rounded-full blur-[30px]"></div>
                      <h3 className="text-xl font-bold mb-6 flex items-center gap-3">Особисті дані</h3>
                      <form onSubmit={handleProfileUpdate} className="space-y-5">
                        <div className="relative group">
                          <label className="absolute -top-2.5 left-3 bg-[#1A1A1A] px-2 text-[10px] font-bold uppercase tracking-wider text-[var(--text-subtle)] group-focus-within:text-[var(--accent)] transition-colors z-10 rounded">Ім'я</label>
                          <input type="text" value={profileForm.name} onChange={e => setProfileForm({...profileForm, name: e.target.value})} className="w-full bg-[var(--bg-primary)]/50 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-[var(--accent)] focus:bg-[var(--bg-primary)] transition-all relative z-0" />
                        </div>
                        <div className="relative group">
                          <label className="absolute -top-2.5 left-3 bg-[#1A1A1A] px-2 text-[10px] font-bold uppercase tracking-wider text-[var(--text-subtle)] group-focus-within:text-[var(--accent)] transition-colors z-10 rounded">Телефон</label>
                          <input type="tel" value={profileForm.phone} onChange={e => setProfileForm({...profileForm, phone: e.target.value})} className="w-full bg-[var(--bg-primary)]/50 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-[var(--accent)] focus:bg-[var(--bg-primary)] transition-all relative z-0" />
                        </div>
                        <div className="relative group">
                          <label className="absolute -top-2.5 left-3 bg-[#1A1A1A] px-2 text-[10px] font-bold uppercase tracking-wider text-[var(--text-subtle)] group-focus-within:text-[var(--accent)] transition-colors z-10 rounded">Електронна пошта</label>
                          <input type="email" value={profileForm.email} onChange={e => setProfileForm({...profileForm, email: e.target.value})} className="w-full bg-[var(--bg-primary)]/50 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-[var(--accent)] focus:bg-[var(--bg-primary)] transition-all relative z-0" />
                        </div>
                        <div className="pt-2">
                          <button type="submit" className="w-full bg-[var(--bg-secondary)] border border-white/10 hover:border-[var(--accent)] hover:text-[var(--accent)] text-white px-8 py-4 rounded-2xl font-bold uppercase tracking-wider text-xs transition-all shadow-lg active:scale-[0.98]">Синхронізувати</button>
                        </div>
                      </form>
                    </div>

                    {/* Address Book */}
                    <div className="glass p-8 rounded-3xl border-white/5 shadow-xl flex flex-col">
                      <h3 className="text-xl font-bold mb-6 flex items-center gap-3">База Логістики</h3>
                      <div className="flex-1 overflow-y-auto pr-2 space-y-4 max-h-[300px] custom-scrollbar">
                        {user.addresses.map((addr, i) => (
                          <motion.div initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} transition={{delay:i*0.1}} key={addr.id} className="bg-[var(--bg-primary)]/50 border border-white/5 rounded-2xl p-5 group hover:border-[var(--accent)]/30 transition-colors relative">
                            {addr.isDefault && <div className="absolute top-0 right-0 bg-[var(--accent)] text-black text-[10px] font-bold uppercase px-3 py-1 rounded-bl-xl rounded-tr-2xl">Main</div>}
                            <p className="font-bold">{addr.city}</p>
                            <p className="text-sm text-[var(--text-muted)] mt-1">{addr.address}</p>
                            <div className="flex gap-3 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                              {!addr.isDefault && <button onClick={() => setDefaultAddress(addr.id)} className="text-xs text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors font-medium">Зробити головною</button>}
                              <button onClick={() => {removeAddress(addr.id); showToast('Адресу видалено');}} className="text-xs text-red-400 hover:text-red-300 font-medium">Видалити</button>
                            </div>
                          </motion.div>
                        ))}
                        {user.addresses.length === 0 && (
                          <div className="h-full flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-white/5 rounded-2xl">
                            <MapPin className="w-8 h-8 text-[var(--text-subtle)] mb-3" />
                            <p className="text-sm text-[var(--text-muted)]">Немає збережених точок доставки.<br/>Матриця порожня.</p>
                          </div>
                        )}
                      </div>
                      <form onSubmit={handleAddAddress} className="mt-6 pt-6 border-t border-white/5">
                        <div className="flex gap-3">
                          <input type="text" placeholder="Місто" value={newAddress.city} onChange={e => setNewAddress({...newAddress, city: e.target.value})} className="flex-1 min-w-0 bg-[var(--bg-primary)] border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[var(--accent)] text-sm" required />
                          <input type="text" placeholder="№ Відділення НП" value={newAddress.warehouse} onChange={e => setNewAddress({...newAddress, warehouse: e.target.value})} className="flex-[1.5] min-w-0 bg-[var(--bg-primary)] border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[var(--accent)] text-sm" required />
                        </div>
                        <button type="submit" className="mt-3 w-full border border-[var(--accent)]/50 text-[var(--accent)] px-4 py-3 rounded-xl font-bold uppercase tracking-wider text-xs hover:bg-[var(--accent)] hover:text-black transition-all">Додати Координати</button>
                      </form>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'journey' && (
                <motion.div key="journey" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="space-y-6">
                  {/* Hero Gamification Banner */}
                  <div className="bg-[url('/path-bg-placeholder.jpg')] bg-cover relative p-10 rounded-[2rem] border border-[var(--border)] overflow-hidden shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg-secondary)] via-[var(--bg-tertiary)]/80 to-transparent"></div>
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,var(--accent)_0%,transparent_60%)] opacity-20 mix-blend-screen"></div>
                    
                    <div className="relative z-10 max-w-lg">
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-black/50 backdrop-blur-md rounded-lg border border-white/10 text-xs font-bold uppercase tracking-wider mb-4">
                        <Star className="w-3 h-3 text-[var(--accent)]" /> Рівень Досягнень
                      </div>
                      <h3 className="text-4xl font-extrabold mb-2 tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-white to-white/60">
                        {statusName}
                      </h3>
                      <p className="text-[var(--text-secondary)] mb-8 leading-relaxed">
                        Твій енергетичний потенціал зростає! До еволюції в {user.totalLiters < 5 ? 'Tea Lover' : user.totalLiters < 15 ? 'Energy Master' : 'Grand Master'} залишилось {(nextStatusGoal - user.totalLiters).toFixed(1)} літрів чистої енергії ПУЕРУ.
                      </p>
                      
                      <div className="relative">
                        <div className="flex justify-between text-xs font-bold text-[var(--text-subtle)] mb-2">
                          <span>{user.totalLiters}л Завершено</span>
                          <span>Мета: {nextStatusGoal}л</span>
                        </div>
                        <div className="w-full bg-[#111] h-6 rounded-full overflow-hidden p-1 shadow-inner border border-white/5">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 1.5, ease: "easeOut" }} className="h-full bg-gradient-to-r from-[var(--accent)] to-[var(--tea-gold)] rounded-full relative">
                            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay"></div>
                            <div className="absolute top-0 right-0 w-10 h-full bg-gradient-to-l from-white/30 to-transparent"></div>
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="glass p-6 rounded-3xl border-white/5 flex flex-col justify-center items-center text-center group hover:border-[var(--accent)]/30 transition-all">
                      <TrendingUp className="w-8 h-8 text-[#7FB030] mb-3 group-hover:scale-110 transition-transform" />
                      <p className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50">{Math.round(user.totalLiters * 10)}</p>
                      <p className="text-[10px] uppercase tracking-widest font-bold text-[var(--text-subtle)] mt-2">Днів Енергії</p>
                    </div>
                    <div className="glass p-6 rounded-3xl border-white/5 flex flex-col justify-center items-center text-center group hover:border-[var(--accent)]/30 transition-all">
                      <Package className="w-8 h-8 text-[var(--accent)] mb-3 group-hover:scale-110 transition-transform" />
                      <p className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50">{user.totalLiters}л</p>
                      <p className="text-[10px] uppercase tracking-widest font-bold text-[var(--text-subtle)] mt-2">Випито Концентрату</p>
                    </div>
                    <div className="glass p-6 rounded-3xl border-white/5 flex flex-col justify-center items-center text-center relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-tr from-[var(--tea-gold)]/10 to-transparent"></div>
                      <Sparkles className="w-8 h-8 text-[var(--tea-gold)] mb-3 group-hover:rotate-12 transition-transform relative z-10" />
                      <p className="text-2xl font-black text-white relative z-10">{user.favoriteTea || 'Пуер Озон'}</p>
                      <p className="text-[10px] uppercase tracking-widest font-bold text-[var(--text-subtle)] mt-2 relative z-10">Абсолютний Фаворит</p>
                      <div className="absolute inset-x-0 bottom-0 top-auto h-0 bg-gradient-to-t from-[var(--tea-gold)]/20 to-transparent group-hover:h-full transition-all duration-500"></div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'referral' && (
                <motion.div key="referral" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  {/* Glassmorphic Referral Hub */}
                  <div className="relative rounded-[2.5rem] bg-gradient-to-b from-[#141414] to-[#0A0A0A] p-10 border border-white/5 shadow-2xl overflow-hidden text-center">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[radial-gradient(circle_at_center,var(--tea-gold)_0%,transparent_50%)] opacity-5 pointer-events-none rotate-45"></div>
                    
                    <div className="relative z-10">
                      <div className="inline-flex justify-center items-center w-20 h-20 rounded-full bg-[var(--bg-secondary)] border border-[var(--tea-gold)]/20 shadow-[0_0_30px_rgba(201,165,92,0.2)] mb-6">
                        <Gift className="w-10 h-10 text-[var(--tea-gold)]" />
                      </div>
                      <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-4">Втягни бро у гру</h2>
                      <p className="text-[var(--text-secondary)] text-lg max-w-lg mx-auto mb-10">Даруй їм <span className="text-white font-bold">знижку 50₴</span> на перший чек, та забирай <span className="text-[var(--accent)] font-bold opacity-100">100₴ на свій баланс</span> як тільки вони оплатять покупку.</p>
                    </div>

                    <div className="max-w-2xl mx-auto p-4 bg-black/50 border border-white/10 rounded-2xl flex flex-col md:flex-row items-center gap-4 relative z-10 backdrop-blur-xl">
                      <div className="flex-1 text-center md:text-left px-4">
                        <div className="text-[10px] uppercase font-bold text-[var(--text-subtle)] tracking-wider mb-1">Свій персональний код:</div>
                        <code className="text-2xl font-mono font-bold text-[var(--tea-gold)] tracking-widest select-all">{user.referralCode}</code>
                      </div>
                      <button onClick={copyReferralLink} className="w-full md:w-auto flex items-center justify-center gap-2 bg-[var(--bg-secondary)] hover:bg-[var(--tea-gold)] hover:text-black text-white px-8 py-4 rounded-xl font-bold uppercase tracking-wider text-[10px] sm:text-xs transition-all active:scale-95 group">
                        <Copy className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        {copiedReferral ? 'Скопійовано!' : 'Скопіювати реферальне посилання'}
                      </button>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8 relative z-10">
                      <button onClick={() => shareReferral('telegram')} className="px-8 py-4 bg-[#2AABEE]/10 border border-[#2AABEE]/30 text-[#2AABEE] hover:bg-[#2AABEE] hover:text-white rounded-xl font-bold uppercase tracking-wider text-xs transition-all flex items-center justify-center gap-3">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.223-.535.223l.188-2.85 5.18-4.686c.223-.195-.054-.306-.346-.118l-6.4 4.024-2.76-.86c-.6-.188-.61-.595.125-.898l10.77-4.148c.5-.187.94.103.78.891z"/></svg> 
                        Відправити в TG
                      </button>
                      <button onClick={() => shareReferral('whatsapp')} className="px-8 py-4 bg-[#25D366]/10 border border-[#25D366]/30 text-[#25D366] hover:bg-[#25D366] hover:text-white rounded-xl font-bold uppercase tracking-wider text-xs transition-all flex items-center justify-center gap-3">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.891-4.444 9.893-9.892.001-5.447-4.443-9.89-9.893-9.89-5.448 0-9.891 4.444-9.893 9.892-.001 2.247.616 4.318 1.777 6.136l-1.011 3.693 3.735-.989z"/></svg>
                        Поділитися в WA
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'orders' && (
                <motion.div key="orders" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-2xl font-bold px-2">Скриня Замовлень</h3>
                    <div className="text-sm font-bold text-[var(--accent)] bg-[var(--accent)]/10 px-3 py-1 rounded-lg">Всього: {orders.length}</div>
                  </div>
                  
                  {orders.length === 0 ? (
                    <div className="glass p-16 rounded-[2rem] text-center border-white/5 border-dashed">
                      <div className="w-20 h-20 bg-black/50 rounded-full mx-auto flex items-center justify-center mb-6">
                        <Package className="w-8 h-8 text-[var(--text-subtle)]" />
                      </div>
                      <h4 className="text-xl font-bold mb-2">Твоя скриня поки порожня</h4>
                      <p className="text-[var(--text-muted)] mb-8 max-w-md mx-auto">Зроби перше замовлення преміального чайного концентрату та отримай шалений буст енергії.</p>
                      <Link href="/products" className="inline-block bg-white text-black px-8 py-4 rounded-xl font-bold uppercase tracking-wider text-xs hover:scale-105 active:scale-95 transition-all shadow-xl">Каталог Товарів</Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order, i) => (
                        <motion.div initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}} transition={{delay:i*0.1}} key={order.id} className="glass p-6 md:p-8 rounded-3xl border-white/5 shadow-lg group hover:border-[var(--accent)]/20 transition-all hover:bg-white/[0.02]">
                          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
                            <div>
                              <div className="text-[10px] uppercase font-bold tracking-widest text-[var(--text-subtle)] mb-1">{order.date}</div>
                              <h4 className="font-bold text-lg text-white">Замовлення #{order.id}</h4>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="px-4 py-1.5 bg-[#7FB030]/20 border border-[#7FB030]/30 text-[#7FB030] rounded-full text-xs font-bold uppercase tracking-wider">{order.currentStatus}</span>
                              <span className="text-2xl font-black">{order.total}₴</span>
                            </div>
                          </div>
                          <div className="bg-black/30 rounded-2xl p-4 border border-white/5 space-y-2 mb-6">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex justify-between text-sm items-center py-1">
                                <span className="font-medium text-[var(--text-secondary)]">{item.name} <span className="opacity-50 ml-1">({item.volume})</span></span>
                                <span className="font-bold bg-white/5 border border-white/10 px-3 py-1 rounded-lg">x{item.quantity}</span>
                              </div>
                            ))}
                          </div>
                          <div className="flex justify-end">
                            <Link href="/products" className="text-xs font-bold uppercase tracking-wider bg-transparent border border-white/20 text-white px-6 py-3 rounded-xl hover:bg-white hover:text-black hover:border-white transition-all">Повторити</Link>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'b2b-hunter' && (
                <motion.div key="b2b-hunter" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
                  {/* Hero C2B2B Banner */}
                  <div className="bg-[url('/path-bg-placeholder.jpg')] bg-cover relative p-10 rounded-[2rem] border border-[var(--border)] overflow-hidden shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-to-r from-red-900/40 via-black to-[#111]"></div>
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,var(--accent)_0%,transparent_60%)] opacity-20 mix-blend-screen"></div>
                    
                    <div className="relative z-10 max-w-xl">
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-black/50 backdrop-blur-md rounded-lg border border-red-500/30 text-xs font-bold uppercase tracking-wider mb-4 text-red-500">
                        <Target className="w-3 h-3" /> Спецоперація: Захоплення Кав'ярень
                      </div>
                      <h3 className="text-4xl font-extrabold mb-4 tracking-tight text-white uppercase">
                        Здай Улюблену Кав'ярню <br/><span className="text-[var(--accent)]">Отримай Безлімітний Чай</span>
                      </h3>
                      <p className="text-zinc-400 mb-6 leading-relaxed">
                        Твій улюблений заклад досі готує хімозні чаї? Здай нам їх координати. Ми підключимо їх до C2B2B Синдикату (Dark Room Portal), а ти отримаєш фіксований <strong className="text-white">+500₴ бонус</strong> на баланс за кожну успішну 1L інтеграцію.
                      </p>
                    </div>
                  </div>

                  {/* Submission Form */}
                  <div className="glass p-8 rounded-3xl border border-red-500/10 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-[40px]"></div>
                    <form onSubmit={handleB2bSubmit} className="space-y-5 relative z-10">
                      <div className="grid md:grid-cols-2 gap-5">
                        <div className="relative group">
                          <label className="absolute -top-2.5 left-3 bg-[#1A1A1A] px-2 text-[10px] font-bold uppercase tracking-wider text-zinc-500 group-focus-within:text-red-500 transition-colors z-10 rounded">Назва Кав'ярні / Закладу *</label>
                          <input type="text" required value={b2bForm.cafeName} onChange={e => setB2bForm({...b2bForm, cafeName: e.target.value})} className="w-full bg-[var(--bg-primary)]/50 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-red-500 focus:bg-[var(--bg-primary)] transition-all" />
                        </div>
                        <div className="relative group">
                          <label className="absolute -top-2.5 left-3 bg-[#1A1A1A] px-2 text-[10px] font-bold uppercase tracking-wider text-zinc-500 group-focus-within:text-red-500 transition-colors z-10 rounded">Місто</label>
                          <input type="text" value={b2bForm.city} onChange={e => setB2bForm({...b2bForm, city: e.target.value})} className="w-full bg-[var(--bg-primary)]/50 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-red-500 focus:bg-[var(--bg-primary)] transition-all" />
                        </div>
                      </div>

                      <div className="relative group">
                        <label className="absolute -top-2.5 left-3 bg-[#1A1A1A] px-2 text-[10px] font-bold uppercase tracking-wider text-zinc-500 group-focus-within:text-red-500 transition-colors z-10 rounded">Адреса (або посилання на Instagram)</label>
                        <input type="text" value={b2bForm.address} onChange={e => setB2bForm({...b2bForm, address: e.target.value})} className="w-full bg-[var(--bg-primary)]/50 border border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:border-red-500 focus:bg-[var(--bg-primary)] transition-all" />
                      </div>

                      <div className="relative group">
                        <label className="absolute -top-2.5 left-3 bg-[#1A1A1A] px-2 text-[10px] font-bold uppercase tracking-wider text-zinc-500 group-focus-within:text-red-500 transition-colors z-10 rounded">Коментар розвідника (хто власник, що п'ють)</label>
                        <textarea rows={3} value={b2bForm.notes} onChange={e => setB2bForm({...b2bForm, notes: e.target.value})} className="w-full bg-[var(--bg-primary)]/50 border border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:border-red-500 focus:bg-[var(--bg-primary)] transition-all resize-none"></textarea>
                      </div>

                      <div className="pt-4 text-right">
                        <button disabled={isB2bSubmitting} type="submit" className="w-full md:w-auto bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-10 py-4 rounded-xl font-black uppercase tracking-widest text-sm transition-all shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:shadow-[0_0_30px_rgba(220,38,38,0.5)]">
                          {isB2bSubmitting ? 'Передача...' : 'Передати координати у Штаб'}
                        </button>
                      </div>
                    </form>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
      <Footer /><TelegramButton />
    </div>
  );
};

// Simple Icon component for the target icon in profile checking
const TargetIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--accent)]">
    <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
  </svg>
);

export default Account;
