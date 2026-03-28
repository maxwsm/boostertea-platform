import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { useAuth } from '../lib/auth';
import Header from '../components/Header';
import Footer from '../components/Footer';
import TelegramButton from '../components/TelegramButton';
import { SEO, useSEOConfig } from '../components/SEO';
import { Copy, Gift, MapPin, Package, Settings, Sparkles, Star, TrendingUp, User as UserIcon, Zap, CheckCircle2, Target, Heart, Wallet, ShieldCheck, MessageSquare, Plus, X, User } from 'lucide-react';

const HoloTiltCard = ({ children, className }: any) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  const rotateX = useTransform(y, [0, 1], [15, -15]);
  const rotateY = useTransform(x, [0, 1], [-15, 15]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width);
    y.set((e.clientY - rect.top) / rect.height);
  };

  const handleMouseLeave = () => { x.set(0.5); y.set(0.5); };

  return (
    <motion.div ref={ref} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} style={{ rotateX, rotateY, transformStyle: "preserve-3d" }} className={`relative transition-all duration-200 ease-out hover:shadow-[0_0_40px_rgba(159,211,86,0.2)] ${className}`}>
      {children}
    </motion.div>
  );
};

function AnimatedCount({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { damping: 50, stiffness: 100 });
  useEffect(() => { motionValue.set(value); }, [motionValue, value]);
  useEffect(() => { return springValue.on("change", (latest) => { if (ref.current) ref.current.textContent = Math.round(latest).toString(); }); }, [springValue]);
  return <span ref={ref}>0</span>;
}

const RadarSonar = () => (
  <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none overflow-hidden mix-blend-screen isolate">
     <div className="absolute w-[800px] h-[800px] border border-red-500/10 rounded-full animate-[ping_4s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
     <div className="absolute w-[600px] h-[600px] border border-red-500/20 rounded-full animate-[ping_4s_cubic-bezier(0,0,0.2,1)_infinite_1s]"></div>
     <div className="absolute w-[400px] h-[400px] border border-red-500/30 rounded-full animate-[ping_4s_cubic-bezier(0,0,0.2,1)_infinite_2s]"></div>
     <div className="absolute w-[400px] h-[400px] top-1/2 left-1/2 -mt-[200px] -ml-[200px] origin-center animate-[spin_4s_linear_infinite] rounded-full overflow-hidden">
        <div className="w-full h-1/2 bg-gradient-to-t from-red-500/40 to-transparent transform origin-bottom -skew-x-[30deg]"></div>
     </div>
  </div>
);

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
            <HoloTiltCard className="glass rounded-3xl p-6 border-black/5 dark:border-white/5 relative overflow-hidden backdrop-blur-2xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent)]/10 rounded-full blur-[40px] -mr-10 -mt-10" />
              <div className="relative z-10 text-center" style={{ transform: "translateZ(30px)" }}>
                <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-[var(--bg-tertiary)] to-[var(--bg-primary)] p-1 rounded-full border border-black/10 dark:border-white/10 shadow-2xl relative">
                  {/* Circular Progress Ring */}
                  <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 100 100">
                     <circle cx="50" cy="50" r="46" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
                     <motion.circle initial={{ strokeDashoffset: 289 }} animate={{ strokeDashoffset: 289 - (289 * currentScore) / 100 }} cx="50" cy="50" r="46" fill="transparent" stroke="var(--accent)" strokeWidth="4" strokeDasharray="289" strokeLinecap="round" className="drop-shadow-[0_0_8px_rgba(159,211,86,0.6)]" transition={{ duration: 1.5, ease: "easeOut" }} />
                  </svg>
                  <div className="w-full h-full rounded-full bg-gradient-to-b from-[var(--accent)] to-[#7FB030] flex items-center justify-center text-black text-3xl font-extrabold pb-1 shadow-[inset_0_2px_10px_rgba(255,255,255,0.4)]">
                    {user.name.charAt(0)}
                  </div>
                  {isProfileFull && <div className="absolute -bottom-2 -right-2 bg-black text-xs p-1.5 rounded-full border-2 border-[var(--accent)] shadow-[0_0_15px_var(--accent)] animate-pulse" title="VIP Account">⭐</div>}
                </div>
                <h2 className="font-bold text-xl mb-1 tracking-tight">{user.name}</h2>
                <p className="text-xs text-[var(--text-subtle)] mb-5">{user.email}</p>
                <div className="px-5 py-2.5 bg-gradient-to-r from-[var(--accent)]/10 to-transparent rounded-2xl inline-flex flex-col items-center border border-[var(--accent)]/20 w-full group hover:border-[var(--accent)] hover:shadow-[0_0_20px_rgba(159,211,86,0.2)] transition-all">
                  <span className="text-[10px] uppercase font-bold text-[var(--accent)] tracking-wider">Баланс емоцій</span>
                  <span className="text-[var(--accent)] font-extrabold text-3xl drop-shadow-[0_0_15px_rgba(159,211,86,0.5)]">
                     <AnimatedCount value={user.bonusPoints} /> <span className="text-sm">₴</span>
                  </span>
                </div>
              </div>
            </HoloTiltCard>
            
            <nav className="glass rounded-3xl p-3 border-black/5 dark:border-white/5 flex flex-col gap-2 backdrop-blur-xl">
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
              <div className="pt-2 mt-2 border-t border-black/5 dark:border-white/5">
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

                  <div className="grid lg:grid-cols-3 gap-6">
                    {/* KPI & Comms */}
                    <div className="glass p-6 rounded-3xl border-black/5 dark:border-white/5 shadow-xl flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-500 flex items-center justify-center">
                            <ShieldCheck className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-xs uppercase font-bold tracking-widest text-[var(--text-subtle)]">Статус пілота</p>
                            <p className="font-bold text-lg text-black dark:text-white">Активний</p>
                          </div>
                        </div>
                        
                        <div className="space-y-4 mb-6">
                          <div className="bg-[var(--bg-primary)]/50 rounded-2xl p-4 border border-black/5 dark:border-white/5 flex items-center justify-between">
                             <span className="text-sm font-medium">Біометрія профілю</span>
                             <span className={`w-2 h-2 rounded-full ${isProfileFull ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
                          </div>
                          <div className="bg-[var(--bg-primary)]/50 rounded-2xl p-4 border border-black/5 dark:border-white/5 flex items-center justify-between">
                             <span className="text-sm font-medium">Логістичний модуль</span>
                             <span className={`w-2 h-2 rounded-full ${user.addresses.length > 0 ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`}></span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Messenger Comms */}
                      <div className="pt-4 border-t border-black/5 dark:border-white/5">
                        <p className="text-[10px] uppercase font-bold text-[var(--text-subtle)] mb-3 text-center">Прямий зв'язок зі Штабом</p>
                        <a href="https://t.me/boostertea_bot" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full py-4 bg-[#2AABEE]/10 hover:bg-[#2AABEE]/20 border border-[#2AABEE]/30 text-[#2AABEE] rounded-2xl font-bold transition-all">
                          <MessageSquare className="w-5 h-5" /> Відкрити Telegram Comms
                        </a>
                      </div>
                    </div>

                    {/* Logistic Map */}
                    <div className="lg:col-span-2 glass p-1 rounded-3xl border-black/5 dark:border-white/5 shadow-xl relative overflow-hidden flex flex-col">
                      <div className="h-40 w-full bg-[var(--bg-primary)] rounded-t-[1.3rem] relative border-b border-black/5 dark:border-white/5 overflow-hidden">
                         <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay"></div>
                         <div className="absolute inset-0 flex items-center justify-center opacity-20">
                           <div className="w-[200%] h-[200%] border-[0.5px] border-[var(--accent)] rounded-full animate-[spin_60s_linear_infinite]" style={{ borderStyle: 'dashed' }}></div>
                           <div className="w-[150%] h-[150%] border-[0.5px] border-[var(--text-muted)] rounded-full animate-[spin_40s_linear_infinite_reverse] absolute" style={{ borderStyle: 'dashed' }}></div>
                         </div>
                         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,var(--bg-secondary)_100%)]"></div>
                         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                            <div className="w-4 h-4 bg-[var(--accent)] rounded-full animate-ping absolute"></div>
                            <div className="w-3 h-3 bg-[var(--accent)] rounded-full relative z-10"></div>
                         </div>
                         <div className="absolute top-4 left-6 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-[10px] font-mono font-bold text-[var(--accent)] uppercase tracking-widest shadow-lg">
                            SYS.LOC // {user.addresses[0]?.city || 'UNKNOWN'}
                         </div>
                      </div>
                      <div className="p-6 flex-1 flex flex-col">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><MapPin className="w-5 h-5 text-[var(--accent)]" /> База Логістики</h3>
                        <div className="flex-1 overflow-y-auto pr-2 space-y-3 max-h-[150px] custom-scrollbar">
                          {user.addresses.map((addr) => (
                            <div key={addr.id} className="bg-[var(--bg-primary)]/50 border border-black/5 dark:border-white/5 rounded-2xl p-4 flex justify-between items-center group">
                              <div>
                                <p className="font-bold flex items-center gap-2 text-sm">{addr.city} {addr.isDefault && <span className="px-2 py-0.5 bg-[var(--accent)]/20 text-[var(--accent)] text-[10px] rounded uppercase tracking-wider font-bold">Main</span>}</p>
                                <p className="text-xs text-[var(--text-muted)] mt-1">{addr.address} ({addr.warehouse})</p>
                              </div>
                              <div className="flex gap-2">
                                <button onClick={() => {removeAddress(addr.id); showToast('Локацію видалено з матриці');}} className="p-2 text-red-500/70 hover:bg-red-500/10 hover:text-red-500 rounded-xl transition-all"><X className="w-4 h-4" /></button>
                              </div>
                            </div>
                          ))}
                          {user.addresses.length === 0 && (
                            <div className="text-center py-4 border border-dashed border-black/10 dark:border-white/10 rounded-xl">
                              <p className="text-xs font-medium text-[var(--text-muted)]">Система не виявила збережених точок.<br/>Введіть координати нижче.</p>
                            </div>
                          )}
                        </div>
                        
                        <form onSubmit={handleAddAddress} className="mt-4 pt-4 border-t border-black/5 dark:border-white/5 flex gap-2">
                          <input type="text" placeholder="Координати: Місто" value={newAddress.city} onChange={e => setNewAddress({...newAddress, city: e.target.value})} className="flex-1 min-w-[30%] bg-[var(--bg-primary)] border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[var(--accent)] text-xs font-medium" required />
                          <input type="text" placeholder="Відділення НП" value={newAddress.warehouse} onChange={e => setNewAddress({...newAddress, warehouse: e.target.value})} className="flex-1 min-w-[30%] bg-[var(--bg-primary)] border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[var(--accent)] text-xs font-medium" required />
                          <button type="submit" className="bg-[var(--accent)] text-black px-4 sm:px-6 py-3 rounded-xl font-bold hover:scale-105 transition-all w-12 sm:w-auto flex justify-center items-center"><Plus className="w-5 h-5 sm:hidden" /><span className="hidden sm:inline text-xs uppercase tracking-wider">Знайти</span></button>
                        </form>
                      </div>
                    </div>
                  </div>

                  {/* Identity Data Form */}
                  <div className="glass p-6 rounded-3xl border-black/5 dark:border-white/5 mt-6 flex flex-col md:flex-row items-center gap-6 shadow-lg relative overflow-hidden">
                    <div className="absolute right-0 top-0 w-32 h-full bg-[radial-gradient(ellipse_at_right,var(--accent)_0%,transparent_70%)] opacity-5 pointer-events-none"></div>
                    <div className="flex-shrink-0">
                       <div className="w-16 h-16 rounded-2xl bg-[var(--bg-primary)] border border-black/10 dark:border-white/10 flex items-center justify-center shadow-inner relative overflow-hidden">
                          <User className="w-8 h-8 text-[var(--text-subtle)] relative z-10" />
                          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-secondary)] to-transparent opacity-50"></div>
                       </div>
                    </div>
                    <form onSubmit={handleProfileUpdate} className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4 w-full">
                        <input type="text" placeholder="Позивний (Ім'я)" value={profileForm.name} onChange={e => setProfileForm({...profileForm, name: e.target.value})} className="bg-[var(--bg-primary)] border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] outline-none text-sm w-full font-medium" />
                        <input type="tel" placeholder="Канал зв'язку (+380)" value={profileForm.phone} onChange={e => setProfileForm({...profileForm, phone: e.target.value})} className="bg-[var(--bg-primary)] border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] outline-none text-sm w-full font-medium" />
                        <input type="email" placeholder="Секретна пошта" value={profileForm.email} onChange={e => setProfileForm({...profileForm, email: e.target.value})} className="bg-[var(--bg-primary)] border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] outline-none text-sm w-full font-medium" />
                        <button type="submit" className="bg-[var(--bg-secondary)] border border-black/10 dark:border-white/10 hover:border-[var(--accent)] text-black dark:text-white px-4 py-3 rounded-xl font-bold text-[10px] sm:text-xs uppercase tracking-widest transition-all w-full md:col-span-1 whitespace-nowrap overflow-hidden text-ellipsis shadow-md active:scale-95">Синхронізувати</button>
                    </form>
                  </div>
                </motion.div>
              )}

              {activeTab === 'journey' && (
                <motion.div key="journey" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="space-y-6">
                  {/* Hero Gamification Banner */}
                  <div className="bg-[url('/path-bg-placeholder.jpg')] bg-cover relative p-6 md:p-8 rounded-[2rem] border border-[var(--border)] overflow-hidden shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg-secondary)] via-[var(--bg-tertiary)]/90 to-transparent"></div>
                    <div className="absolute right-0 top-0 w-1/2 h-full bg-[radial-gradient(ellipse_at_center,var(--accent)_0%,transparent_60%)] opacity-20 mix-blend-screen animate-pulse"></div>
                    
                    <div className="relative z-10 max-w-xl">
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/50 dark:bg-black/50 backdrop-blur-md rounded-lg border border-black/10 dark:border-white/10 text-[10px] font-bold uppercase tracking-widest mb-4">
                        <Star className="w-3 h-3 text-[var(--accent)]" /> {statusName}
                      </div>
                      <h3 className="text-3xl md:text-4xl font-extrabold mb-3 tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-[var(--text-primary)] to-[var(--text-primary)]/50">
                        Еволюція Енергії
                      </h3>
                      <p className="text-[var(--text-secondary)] mb-6 leading-relaxed text-sm md:text-base">
                        Твій енергетичний потенціал зростає! До переходу в {user.totalLiters < 5 ? 'Tea Lover' : user.totalLiters < 15 ? 'Energy Master' : 'Grand Master'} залишилось {(nextStatusGoal - user.totalLiters).toFixed(1)} літрів чистого ПУЕРУ.
                      </p>
                      
                      <div className="relative">
                        <div className="flex justify-between text-[10px] uppercase font-bold text-[var(--text-subtle)] mb-2 tracking-widest">
                          <span>{Math.round(user.totalLiters * 10)} чашок випито</span>
                          <span>Еволюція: {nextStatusGoal * 10} чашок</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-[#111] h-4 rounded-full overflow-hidden p-[2px] shadow-inner border border-black/5 dark:border-white/5">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 1.5, ease: "easeOut" }} className="h-full bg-gradient-to-r from-[var(--accent)] to-[#C9A962] rounded-full relative">
                            <div className="absolute top-0 right-0 w-10 h-full bg-gradient-to-l from-white/40 to-transparent"></div>
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Fun Analytics Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="glass p-4 md:p-5 rounded-3xl border-black/5 dark:border-white/5 flex flex-col justify-center items-center text-center group hover:-translate-y-1 transition-all shadow-sm hover:shadow-md">
                      <div className="w-10 h-10 rounded-full bg-[#7FB030]/20 text-[#7FB030] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform"><TrendingUp className="w-5 h-5" /></div>
                      <p className="text-2xl md:text-3xl font-black text-[var(--text-primary)]">{Math.round(user.totalLiters * 10)}</p>
                      <p className="text-[9px] uppercase tracking-widest font-bold text-[var(--text-subtle)] mt-1">Випито Чашок</p>
                    </div>
                    <div className="glass p-4 md:p-5 rounded-3xl border-black/5 dark:border-white/5 flex flex-col justify-center items-center text-center group hover:-translate-y-1 transition-all shadow-sm hover:shadow-md">
                      <div className="w-10 h-10 rounded-full bg-yellow-500/20 text-yellow-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform"><Wallet className="w-5 h-5" /></div>
                      <p className="text-2xl md:text-3xl font-black text-[var(--text-primary)]">{Math.round(user.totalLiters * 10 * 75)}₴</p>
                      <p className="text-[9px] uppercase tracking-widest font-bold text-[var(--text-subtle)] mt-1">Зекономлено</p>
                    </div>
                    <div className="glass p-4 md:p-5 rounded-3xl border-black/5 dark:border-white/5 flex flex-col justify-center items-center text-center group hover:-translate-y-1 transition-all shadow-sm hover:shadow-md">
                      <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform"><Zap className="w-5 h-5" /></div>
                      <p className="text-2xl md:text-3xl font-black text-[var(--text-primary)]">{Math.round(user.totalLiters * 10 * 4)}</p>
                      <p className="text-[9px] uppercase tracking-widest font-bold text-[var(--text-subtle)] mt-1">Годин Енергії</p>
                    </div>
                    <div className="glass p-4 md:p-5 rounded-3xl border-black/5 dark:border-white/5 flex flex-col justify-center items-center text-center group hover:-translate-y-1 transition-all shadow-sm hover:shadow-md">
                      <div className="w-10 h-10 rounded-full bg-purple-500/20 text-purple-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform"><MapPin className="w-5 h-5" /></div>
                      <p className="text-2xl md:text-3xl font-black text-[var(--text-primary)]">{Math.round(user.totalLiters * 1.5)}<span className="text-sm">км</span></p>
                      <p className="text-[9px] uppercase tracking-widest font-bold text-[var(--text-subtle)] mt-1">Довжина посилок</p>
                    </div>
                  </div>

                  {/* Health Progress Bars & Easter Egg Grid */}
                  <div className="grid lg:grid-cols-5 gap-6">
                    <div className="lg:col-span-3 glass p-6 rounded-3xl border-black/5 dark:border-white/5 shadow-lg flex flex-col justify-center">
                       <h4 className="text-sm font-bold uppercase tracking-widest mb-6 flex items-center gap-2"><Heart className="w-4 h-4 text-red-500" /> Біохакінг Організму</h4>
                       <div className="space-y-6">
                         <div>
                           <div className="flex justify-between text-xs font-bold mb-2">
                             <span className="text-[var(--text-secondary)]">Збережене Серце (vs Кава)</span>
                             <span className="text-red-500">{(user.totalLiters * 10 * 12).toFixed(0)} ударів/хв</span>
                           </div>
                           <div className="h-2 w-full bg-gray-200 dark:bg-[#1A1A1A] rounded-full overflow-hidden">
                             <div className="h-full bg-red-500 w-[75%] rounded-full opacity-80 mix-blend-screen"></div>
                           </div>
                         </div>
                         <div>
                           <div className="flex justify-between text-xs font-bold mb-2">
                             <span className="text-[var(--text-secondary)]">Профілактика Діабету (vs Енергетики)</span>
                             <span className="text-blue-500">{Math.round(user.totalLiters * 10 * 27)}г цукру уникнуто</span>
                           </div>
                           <div className="h-2 w-full bg-gray-200 dark:bg-[#1A1A1A] rounded-full overflow-hidden">
                             <div className="h-full bg-blue-500 w-[90%] rounded-full opacity-80 mix-blend-screen"></div>
                           </div>
                         </div>
                         <div>
                           <div className="flex justify-between text-xs font-bold mb-2">
                             <span className="text-[var(--text-secondary)]">Метаболізм & Травлення</span>
                             <span className="text-green-500">+{Math.round(user.totalLiters * 1.2)}% прискорення</span>
                           </div>
                           <div className="h-2 w-full bg-gray-200 dark:bg-[#1A1A1A] rounded-full overflow-hidden">
                             <div className="h-full bg-green-500 w-[60%] rounded-full opacity-80 mix-blend-screen"></div>
                           </div>
                         </div>
                       </div>
                    </div>

                    <div className="lg:col-span-2 glass p-6 rounded-3xl border-black/5 dark:border-white/5 shadow-lg relative overflow-hidden flex flex-col justify-center items-center text-center group cursor-pointer">
                      <div className="absolute inset-0 bg-gradient-to-tr from-[var(--tea-gold)]/5 to-transparent"></div>
                      <div className="w-24 h-24 perspective-[1000px] group-hover:scale-110 transition-transform duration-500 mb-6 relative z-10">
                        <div className="w-full h-full bg-[var(--accent)] rounded-2xl rotate-45 flex items-center justify-center shadow-[0_0_40px_rgba(107,142,78,0.4)] border-2 border-[var(--tea-gold)]/40 animate-[spin_10s_linear_infinite]">
                          <div className="-rotate-45 font-black text-3xl text-black">?</div>
                        </div>
                      </div>
                      <h4 className="font-bold text-lg mb-1 relative z-10 text-[var(--accent)] drop-shadow-lg">Секретний Дроп</h4>
                      <p className="text-[10px] text-[var(--text-primary)]/80 max-w-[200px] relative z-10 uppercase tracking-widest font-bold">Тисни для активації 3D голограми та секретних пасхалок</p>
                      
                      {/* Hidden interactive egg background */}
                      <div className="absolute inset-x-0 bottom-0 h-0 bg-gradient-to-t from-[var(--tea-gold)]/20 to-transparent group-hover:h-full transition-all duration-300"></div>
                    </div>
                  </div>
                </motion.div>
              )}

{activeTab === 'referral' && (
                <motion.div key="referral" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  {/* Glassmorphic Referral Hub */}
                  <div className="relative rounded-[2.5rem] bg-gradient-to-b from-[#141414] to-[#0A0A0A] p-10 border border-black/5 dark:border-white/5 shadow-2xl overflow-hidden text-center">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[radial-gradient(circle_at_center,var(--tea-gold)_0%,transparent_50%)] opacity-5 pointer-events-none rotate-45"></div>
                    
                    <div className="relative z-10">
                      <div className="inline-flex justify-center items-center w-20 h-20 rounded-full bg-[var(--bg-secondary)] border border-[var(--tea-gold)]/20 shadow-[0_0_30px_rgba(201,165,92,0.2)] mb-6">
                        <Gift className="w-10 h-10 text-[var(--tea-gold)]" />
                      </div>
                      <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-4">Втягни бро у гру</h2>
                      <p className="text-[var(--text-secondary)] text-lg max-w-lg mx-auto mb-10">Даруй їм <span className="text-white font-bold">знижку 50₴</span> на перший чек, та забирай <span className="text-[var(--accent)] font-bold opacity-100">100₴ на свій баланс</span> як тільки вони оплатять покупку.</p>
                    </div>

                    <div className="max-w-2xl mx-auto p-4 bg-white/50 dark:bg-black/50 border border-black/10 dark:border-white/10 rounded-2xl flex flex-col md:flex-row items-center gap-4 relative z-10 backdrop-blur-xl">
                      <div className="flex-1 text-center md:text-left px-4">
                        <div className="text-[10px] uppercase font-bold text-[var(--text-subtle)] tracking-wider mb-1">Свій персональний код:</div>
                        <code className="text-2xl font-mono font-bold text-[var(--tea-gold)] tracking-widest select-all">{user.referralCode}</code>
                      </div>
                      <button onClick={copyReferralLink} className="w-full md:w-auto flex items-center justify-center gap-2 bg-[var(--bg-secondary)] hover:bg-[var(--tea-gold)] hover:text-blacktext-black dark:text-white px-8 py-4 rounded-xl font-bold uppercase tracking-wider text-[10px] sm:text-xs transition-all active:scale-95 group">
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
                    <div className="glass p-16 rounded-[2rem] text-center border-black/5 dark:border-white/5 border-dashed">
                      <div className="w-20 h-20 bg-white/50 dark:bg-black/50 rounded-full mx-auto flex items-center justify-center mb-6">
                        <Package className="w-8 h-8 text-[var(--text-subtle)]" />
                      </div>
                      <h4 className="text-xl font-bold mb-2">Твоя скриня поки порожня</h4>
                      <p className="text-[var(--text-muted)] mb-8 max-w-md mx-auto">Зроби перше замовлення преміального чайного концентрату та отримай шалений буст енергії.</p>
                      <Link href="/products" className="inline-block bg-white text-black px-8 py-4 rounded-xl font-bold uppercase tracking-wider text-xs hover:scale-105 active:scale-95 transition-all shadow-xl">Каталог Товарів</Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order, i) => (
                        <motion.div initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}} transition={{delay:i*0.1}} key={order.id} className="glass p-6 md:p-8 rounded-3xl border-black/5 dark:border-white/5 shadow-lg group hover:border-[var(--accent)]/20 transition-all hover:bg-white/[0.02]">
                          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
                            <div>
                              <div className="text-[10px] uppercase font-bold tracking-widest text-[var(--text-subtle)] mb-1">{order.date}</div>
                              <h4 className="font-bold text-lgtext-black dark:text-white">Замовлення #{order.id}</h4>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="px-4 py-1.5 bg-[#7FB030]/20 border border-[#7FB030]/30 text-[#7FB030] rounded-full text-xs font-bold uppercase tracking-wider">{order.currentStatus}</span>
                              <span className="text-2xl font-black">{order.total}₴</span>
                            </div>
                          </div>
                          <div className="bg-black/30 rounded-2xl p-4 border border-black/5 dark:border-white/5 space-y-2 mb-6">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex justify-between text-sm items-center py-1">
                                <span className="font-medium text-[var(--text-secondary)]">{item.name} <span className="opacity-50 ml-1">({item.volume})</span></span>
                                <span className="font-bold bg-white/5 border border-black/10 dark:border-white/10 px-3 py-1 rounded-lg">x{item.quantity}</span>
                              </div>
                            ))}
                          </div>
                          <div className="flex justify-end">
                            <Link href="/products" className="text-xs font-bold uppercase tracking-wider bg-transparent border border-white/20 text-black dark:text-white px-6 py-3 rounded-xl hover:bg-white hover:text-black hover:border-white transition-all">Повторити</Link>
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
                  <div className="bg-[url('/path-bg-placeholder.jpg')] bg-cover relative p-6 md:p-8 rounded-[2rem] border border-[var(--border)] overflow-hidden shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg-secondary)] via-[var(--bg-tertiary)]/90 to-transparent"></div>
                    <div className="absolute right-0 top-0 w-1/2 h-full bg-[radial-gradient(ellipse_at_center,var(--accent)_0%,transparent_60%)] opacity-20 mix-blend-screen animate-pulse"></div>
                    
                    <div className="relative z-10 max-w-xl">
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/50 dark:bg-black/50 backdrop-blur-md rounded-lg border border-red-500/30 text-[10px] font-bold uppercase tracking-widest mb-4 text-red-500">
                        <Target className="w-3 h-3" /> C2B2B Hunt
                      </div>
                      <h3 className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight text-black dark:text-white uppercase leading-tight">
                        Здай Свою Кав'ярню <br/><span className="text-[var(--accent)] font-black text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent)] to-[#7FB030]">Отримай Чай</span>
                      </h3>
                      <p className="text-gray-600 dark:text-zinc-400 mb-6 leading-relaxed text-sm md:text-base">
                        Кав'ярня на твоєму районі досі готує хімозні чаї? Здай нам їх назву та місто. Ми підключимо їх до Синдикату, а ти отримаєш фіксований <strong className="text-black dark:text-white font-bold bg-[var(--accent)]/20 px-2 py-0.5 rounded">+500₴ бонус</strong> на баланс за кожну успішну 1L інтеграцію.
                      </p>
                    </div>
                  </div>

                  {/* Submission Form */}
                  <div className="glass p-8 rounded-3xl border border-red-500/20 shadow-[0_20px_60px_rgba(239,68,68,0.1)] relative overflow-hidden group/form">
                    <RadarSonar />
                    <div className="absolute top-0 right-0 w-40 h-40 bg-red-500/10 rounded-full blur-[50px] mix-blend-screen group-hover/form:bg-red-500/20 transition-all duration-700"></div>
                    <form onSubmit={handleB2bSubmit} className="space-y-6 relative z-10 backdrop-blur-md">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="relative group">
                          <label className="absolute -top-2.5 left-4 bg-[#111] px-2 text-[10px] font-bold uppercase tracking-wider text-red-500/70 group-focus-within:text-red-500 transition-colors z-10 rounded">Назва Кав'ярні *</label>
                          <input type="text" required value={b2bForm.cafeName} onChange={e => setB2bForm({...b2bForm, cafeName: e.target.value})} className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 focus:outline-none focus:border-red-500 focus:bg-black/80 transition-all font-medium text-sm focus:shadow-[0_0_15px_rgba(239,68,68,0.3)] hover:border-white/10" />
                        </div>
                        <div className="relative group">
                          <label className="absolute -top-2.5 left-4 bg-[#111] px-2 text-[10px] font-bold uppercase tracking-wider text-red-500/70 group-focus-within:text-red-500 transition-colors z-10 rounded">Місто</label>
                          <input type="text" value={b2bForm.city} onChange={e => setB2bForm({...b2bForm, city: e.target.value})} className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 focus:outline-none focus:border-red-500 focus:bg-black/80 transition-all font-medium text-sm focus:shadow-[0_0_15px_rgba(239,68,68,0.3)] hover:border-white/10" />
                        </div>
                      </div>

                      <div className="relative group">
                        <label className="absolute -top-2.5 left-4 bg-[#111] px-2 text-[10px] font-bold uppercase tracking-wider text-red-500/70 group-focus-within:text-red-500 transition-colors z-10 rounded">Адреса або Instagram</label>
                        <input type="text" value={b2bForm.address} onChange={e => setB2bForm({...b2bForm, address: e.target.value})} className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 focus:outline-none focus:border-red-500 focus:bg-black/80 transition-all font-medium text-sm focus:shadow-[0_0_15px_rgba(239,68,68,0.3)] hover:border-white/10" />
                      </div>

                      <div className="relative group">
                        <label className="absolute -top-2.5 left-4 bg-[#111] px-2 text-[10px] font-bold uppercase tracking-wider text-red-500/70 group-focus-within:text-red-500 transition-colors z-10 rounded">Розвіддані (Коментар)</label>
                        <textarea rows={3} value={b2bForm.notes} onChange={e => setB2bForm({...b2bForm, notes: e.target.value})} className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 focus:outline-none focus:border-red-500 focus:bg-black/80 transition-all resize-none font-medium text-sm focus:shadow-[0_0_15px_rgba(239,68,68,0.3)] hover:border-white/10"></textarea>
                      </div>

                      <div className="pt-4 relative overflow-hidden rounded-xl">
                        <button disabled={isB2bSubmitting} type="submit" className="w-full bg-red-500 text-black px-6 py-4 rounded-xl font-black uppercase tracking-widest text-[11px] sm:text-xs transition-all flex items-center justify-center gap-3 relative z-10 hover:shadow-[0_0_30px_rgba(239,68,68,0.6)] hover:scale-[1.02] active:scale-95 group">
                          <Target className={`w-5 h-5 ${isB2bSubmitting ? 'animate-spin' : 'group-hover:scale-125 transition-transform'}`} />
                          {isB2bSubmitting ? (
                             <span className="font-mono tracking-widest">DECODING_COORDINATES... ▰▰▰▱▱</span>
                          ) : 'Передати координати у Штаб'}
                        </button>
                        {isB2bSubmitting && (
                           <motion.div initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: 1.5 }} className="absolute bottom-0 left-0 h-1 bg-white z-20"></motion.div>
                        )}
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
