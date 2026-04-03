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
import { pushGTMEvent } from '../lib/blog/types';
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
    pushGTMEvent({ event: 'cabinet_referral_shared', platform: 'clipboard' });
    setTimeout(() => setCopiedReferral(false), 2000);
  };

  const shareReferral = (platform: string) => {
    const text = `Бро, спробуй BoosterTea! Отримуй бонус 50 грн по моєму посиланню: https://boostertea.com.ua/ref/${user.referralCode}`;
    const urls: Record<string, string> = {
      telegram: `https://t.me/share/url?url=https://boostertea.com.ua/ref/${user.referralCode}&text=${encodeURIComponent(text)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text)}`
    };
    if (urls[platform]) {
      pushGTMEvent({ event: 'cabinet_referral_shared', platform });
      window.open(urls[platform], '_blank');
    }
  };

  const showToast = (msg: string) => { setToastMessage(msg); setTimeout(() => setToastMessage(''), 3000); };

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({ ...user, ...profileForm });
    
    // Calculate new current score after state applies for the event metric
    let score = 0;
    if (profileForm.name) score += 25;
    if (profileForm.email) score += 25;
    if (profileForm.phone) score += 25;
    if (user.addresses && user.addresses.length > 0) score += 25;
    
    pushGTMEvent({ event: 'cabinet_profile_sync', completion_score: score });
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
        pushGTMEvent({ event: 'cabinet_c2b2b_lead', cafe_name: b2bForm.cafeName });
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
      pushGTMEvent({ event: 'cabinet_bonus_claimed', points: 80 });
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
    <div className="min-h-screen bg-[#050505] text-[#E8DDD0] relative overflow-hidden border-t border-white/5 font-mono">
      <div className="absolute inset-0 noise-overlay opacity-30 mix-blend-overlay pointer-events-none z-0" />
      <SEO title={seoConfig.title} description={seoConfig.description} noIndex={true} />
      <div className="relative z-50">
        <Header />
      </div>
      
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
          
          {/* Bento Matrix Sidebar */}
          <div className="lg:col-span-3 space-y-6">
            <HoloTiltCard className="bento-card bg-black/60 rounded-2xl p-6 border border-white/5 relative overflow-hidden text-center shadow-[0_0_30px_rgba(196,149,106,0.05)]">
              <div className="absolute inset-0 noise-overlay opacity-20 pointer-events-none" />
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#C4956A]/10 rounded-full blur-[40px] -mr-10 -mt-10 pointer-events-none" />
              
              <div className="relative z-10" style={{ transform: "translateZ(30px)" }}>
                <div className="w-24 h-24 mx-auto mb-5 bg-black p-1 rounded-full border border-white/10 shadow-xl relative flex items-center justify-center">
                  {/* Circular Progress Ring */}
                  <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 100 100">
                     <circle cx="50" cy="50" r="46" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="2" />
                     <motion.circle initial={{ strokeDashoffset: 289 }} animate={{ strokeDashoffset: 289 - (289 * currentScore) / 100 }} cx="50" cy="50" r="46" fill="transparent" stroke="#C4956A" strokeWidth="2" strokeDasharray="289" strokeLinecap="round" className="drop-shadow-[0_0_5px_rgba(196,149,106,0.5)]" transition={{ duration: 1.5, ease: "easeOut" }} />
                  </svg>
                  <div className="w-[88%] h-[88%] rounded-full bg-black border border-white/5 flex items-center justify-center text-white text-3xl font-bold archival-heading">
                    {user.name.charAt(0)}
                  </div>
                  {isProfileFull && <div className="absolute -bottom-1 -right-1 bg-black text-[10px] p-2 rounded-full border border-[#C4956A] shadow-[0_0_15px_rgba(196,149,106,0.5)] animate-pulse font-bold text-[#C4956A] tracking-wider" title="VIP Account">ACTV</div>}
                </div>
                
                <h2 className="archival-heading text-xl mb-1 uppercase tracking-tight text-white">{user.name}</h2>
                <p className="text-[10px] uppercase font-mono tracking-widest text-[#A89880] mb-6 whitespace-nowrap overflow-hidden text-ellipsis">{user.email}</p>
                
                <div className="px-5 py-4 bg-[#C4956A]/5 rounded-xl border border-[#C4956A]/20 flex flex-col items-center group transition-all hover:bg-[#C4956A]/10 hover:border-[#C4956A]/40">
                  <span className="text-[10px] uppercase font-bold text-[#A89880] tracking-widest mb-1 group-hover:text-[#C4956A] transition-colors">Баланс активів</span>
                  <span className="text-[#C4956A] font-black text-3xl font-mono tracking-tighter">
                     <AnimatedCount value={user.bonusPoints} /> <span className="text-sm opacity-50 font-sans">₴</span>
                  </span>
                </div>
              </div>
            </HoloTiltCard>
            
            <nav className="bento-card bg-black/60 rounded-2xl p-3 border border-white/5 flex flex-col gap-2 relative overflow-hidden">
               <div className="absolute inset-0 noise-overlay opacity-20 pointer-events-none" />
              {tabs.map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)} 
                    className={`w-full text-left px-5 py-4 rounded-xl transition-all duration-300 flex items-center gap-4 font-mono text-[10px] uppercase tracking-widest relative z-10 ${isActive ? 'bg-[#C4956A] text-black font-black shadow-[0_0_20px_rgba(196,149,106,0.2)]' : 'hover:bg-white/5 text-[#A89880] hover:text-white'}`}>
                    <Icon className={`w-4 h-4 ${isActive ? 'text-black' : 'opacity-70 group-hover:opacity-100'} transition-opacity`} />
                    <span className="relative z-10">{tab.label}</span>
                  </button>
                )
              })}
              <div className="pt-2 mt-2 border-t border-white/5 relative z-10">
                <button onClick={logout} className="w-full text-left px-5 py-4 rounded-xl text-red-500 hover:bg-red-500/10 transition-all text-[10px] font-mono uppercase tracking-widest font-bold flex items-center gap-4 opacity-70 hover:opacity-100">
                  <Settings className="w-4 h-4" /> Вимкнути систему
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
                    <div className="bento-card bg-[#0A0A0A] p-6 rounded-2xl border border-white/5 relative overflow-hidden flex flex-col md:flex-row items-center gap-6 justify-between shadow-[0_0_20px_rgba(196,149,106,0.1)]">
                      <div className="absolute inset-0 noise-overlay opacity-20 pointer-events-none" />
                      <div className="relative z-10 flex-1 w-full">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-bold font-mono uppercase tracking-widest text-xs flex items-center gap-2"><TargetIcon /> Готовність профілю</h3>
                          <span className="text-[#C4956A] font-black text-xl">{currentScore}%</span>
                        </div>
                        <div className="w-full bg-black h-2 rounded-none overflow-hidden mb-3 border border-white/10">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${currentScore}%` }} className="h-full bg-[#C4956A] rounded-none shadow-[0_0_10px_#C4956A]" />
                        </div>
                        <p className="text-[10px] uppercase font-mono tracking-widest text-[#A89880]">
                          {isProfileFull ? "Чудово! Профіль заповнений на всі 100%." : "Дозаповни ПІБ, Телефон, Email та додай адресу доставки, щоб забрати винагороду."}
                        </p>
                      </div>
                      <div className="relative z-10 shrink-0 text-center w-full md:w-auto">
                        <button 
                          onClick={claimProfileBonus}
                          disabled={!isProfileFull}
                          className={`w-full md:w-auto px-6 py-4 rounded-xl font-bold font-mono tracking-widest text-[10px] transition-all shadow-lg uppercase ${isProfileFull ? 'bg-[#C4956A] text-black hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(196,149,106,0.3)] animate-pulse' : 'bg-black text-white/30 cursor-not-allowed border border-white/10'}`}
                        >
                          Отримати +80 балів
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="grid lg:grid-cols-3 gap-6">
                    {/* KPI & Comms */}
                    <div className="bento-card bg-black/60 p-6 rounded-2xl border border-white/5 shadow-[0_0_20px_rgba(0,0,0,0.5)] flex flex-col justify-between relative overflow-hidden">
                      <div className="absolute inset-0 noise-overlay opacity-20 pointer-events-none" />
                      <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-10 h-10 rounded-xl bg-[#C4956A]/10 text-[#C4956A] flex items-center justify-center border border-[#C4956A]/30">
                            <ShieldCheck className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-[10px] uppercase font-mono font-bold tracking-widest text-[#A89880]">Статус пілота</p>
                            <p className="font-bold text-lg text-[#C4956A] uppercase tracking-wider">Активний</p>
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
                    <div className="lg:col-span-2 bento-card bg-black/60 p-1 rounded-2xl border border-white/5 shadow-xl relative overflow-hidden flex flex-col">
                      <div className="h-40 w-full bg-[#030303] rounded-t-[0.9rem] relative border-b border-white/5 overflow-hidden">
                         <div className="absolute inset-0 noise-overlay opacity-30 mix-blend-overlay"></div>
                         <div className="absolute inset-0 flex items-center justify-center opacity-40">
                           <div className="w-[200%] h-[200%] border border-[#C4956A]/20 rounded-full animate-[spin_60s_linear_infinite]" style={{ borderStyle: 'dashed' }}></div>
                           <div className="w-[150%] h-[150%] border border-white/10 rounded-full animate-[spin_40s_linear_infinite_reverse] absolute" style={{ borderStyle: 'dashed' }}></div>
                         </div>
                         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                            <div className="w-4 h-4 bg-[#C4956A] rounded-full animate-ping absolute shadow-[0_0_15px_#C4956A]"></div>
                            <div className="w-3 h-3 bg-[#C4956A] rounded-full relative z-10"></div>
                         </div>
                         <div className="absolute top-4 left-6 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded border border-[#C4956A]/30 text-[10px] font-mono font-bold text-[#C4956A] uppercase tracking-widest">
                            SYS.LOC // {user.addresses[0]?.city || 'UNKNOWN'}
                         </div>
                      </div>
                      <div className="p-6 flex-1 flex flex-col relative z-10 bg-black/40">
                        <div className="absolute inset-0 noise-overlay opacity-20 pointer-events-none" />
                        <h3 className="text-sm font-mono uppercase tracking-widest font-bold mb-4 flex items-center gap-2"><MapPin className="w-4 h-4 text-[#C4956A]" /> База Логістики</h3>
                        <div className="flex-1 overflow-y-auto pr-2 space-y-3 max-h-[150px] relative z-10">
                          {user.addresses.map((addr) => (
                            <div key={addr.id} className="bg-black border border-white/10 rounded-xl p-4 flex justify-between items-center group transition-colors hover:border-[#C4956A]/40">
                              <div>
                                <p className="font-bold flex items-center gap-2 text-sm text-white">{addr.city} {addr.isDefault && <span className="px-2 py-1 bg-[#C4956A]/20 text-[#C4956A] text-[9px] rounded uppercase tracking-widest font-bold">Main</span>}</p>
                                <p className="text-[10px] font-mono uppercase tracking-widest text-[#A89880] mt-1">{addr.address} {(addr as any).warehouse && `(${(addr as any).warehouse})`}</p>
                              </div>
                              <div className="flex gap-2">
                                <button onClick={() => {removeAddress(addr.id); showToast('Локацію видалено з матриці');}} className="p-2 text-red-500/50 hover:bg-red-500/10 hover:text-red-500 rounded transition-all"><X className="w-4 h-4" /></button>
                              </div>
                            </div>
                          ))}
                          {user.addresses.length === 0 && (
                            <div className="text-center py-6 border border-dashed border-white/10 rounded-xl">
                              <p className="text-[10px] font-mono uppercase tracking-widest font-bold text-white/30">Система не виявила збережених точок.<br/>Введіть координати нижче.</p>
                            </div>
                          )}
                        </div>
                        
                        <form onSubmit={handleAddAddress} className="mt-4 pt-4 border-t border-white/10 flex gap-2 relative z-10">
                          <input type="text" placeholder="Координати: Місто" value={newAddress.city} onChange={e => setNewAddress({...newAddress, city: e.target.value})} className="flex-1 min-w-[30%] bg-black/60 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-[#C4956A] text-[10px] uppercase font-mono tracking-widest font-bold text-white transition-colors" required />
                          <input type="text" placeholder="Відділення НП" value={newAddress.warehouse} onChange={e => setNewAddress({...newAddress, warehouse: e.target.value})} className="flex-1 min-w-[30%] bg-black/60 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-[#C4956A] text-[10px] uppercase font-mono tracking-widest font-bold text-white transition-colors" required />
                          <button type="submit" className="bg-[#C4956A] text-black px-4 sm:px-6 py-3 rounded-lg font-bold hover:bg-[#A67B53] transition-all w-12 sm:w-auto flex justify-center items-center shadow-[0_0_15px_rgba(196,149,106,0.2)]"><Plus className="w-4 h-4 sm:hidden" /><span className="hidden sm:inline text-[10px] uppercase font-mono tracking-widest">Знайти</span></button>
                        </form>
                      </div>
                    </div>
                  </div>

                  {/* Identity Data Form */}
                  <div className="bento-card bg-black p-6 rounded-2xl border border-white/5 mt-6 flex flex-col md:flex-row items-center gap-6 shadow-[0_0_20px_rgba(0,0,0,0.5)] relative overflow-hidden">
                    <div className="absolute inset-0 noise-overlay opacity-20 pointer-events-none" />
                    <div className="absolute right-0 top-0 w-32 h-full bg-[radial-gradient(ellipse_at_right,#C4956A_0%,transparent_70%)] opacity-10 pointer-events-none"></div>
                    <div className="flex-shrink-0 relative z-10">
                       <div className="w-16 h-16 rounded-xl bg-[#0A0A0A] border border-white/10 flex items-center justify-center relative overflow-hidden group">
                          <User className="w-6 h-6 text-[#A89880] relative z-10 group-hover:text-[#C4956A] transition-colors" />
                       </div>
                    </div>
                    <form onSubmit={handleProfileUpdate} className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4 w-full relative z-10">
                        <input type="text" placeholder="Позивний (Ім'я)" value={profileForm.name} onChange={e => setProfileForm({...profileForm, name: e.target.value})} className="bg-black/60 border border-white/10 rounded-lg px-4 py-4 focus:border-[#C4956A] outline-none text-[10px] font-mono uppercase tracking-widest w-full text-white transition-colors" />
                        <input type="tel" placeholder="Канал зв'язку (+380)" value={profileForm.phone} onChange={e => setProfileForm({...profileForm, phone: e.target.value})} className="bg-black/60 border border-white/10 rounded-lg px-4 py-4 focus:border-[#C4956A] outline-none text-[10px] font-mono uppercase tracking-widest w-full text-white transition-colors" />
                        <input type="email" placeholder="Секретна пошта" value={profileForm.email} onChange={e => setProfileForm({...profileForm, email: e.target.value})} className="bg-black/60 border border-white/10 rounded-lg px-4 py-4 focus:border-[#C4956A] outline-none text-[10px] font-mono uppercase tracking-widest w-full text-white transition-colors" />
                        <button type="submit" className="bg-[#111] hover:bg-[#1A1A1A] border border-white/10 hover:border-[#C4956A]/50 text-[#C4956A] px-4 py-4 rounded-lg font-bold text-[10px] font-mono uppercase tracking-widest transition-all w-full md:col-span-1 shadow-md active:scale-95">Синхронізувати</button>
                    </form>
                  </div>
                </motion.div>
              )}

              {activeTab === 'journey' && (
                <motion.div key="journey" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="space-y-6">
                  {/* Hero Gamification Banner */}
                  <div className="bento-card bg-[#0A0A0A] relative p-6 md:p-8 rounded-[1.5rem] border border-white/5 overflow-hidden shadow-[0_0_30px_rgba(196,149,106,0.15)]">
                    <div className="absolute inset-0 noise-overlay opacity-30 mix-blend-overlay"></div>
                    <div className="absolute right-0 top-0 w-1/2 h-full bg-[radial-gradient(ellipse_at_center,#C4956A_0%,transparent_60%)] opacity-10 mix-blend-screen animate-pulse"></div>
                    
                    <div className="relative z-10 max-w-xl">
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-black rounded border border-[#C4956A]/30 text-[10px] font-mono tracking-widest text-[#C4956A] mb-4 uppercase shadow-[0_0_10px_rgba(196,149,106,0.2)]">
                        <Star className="w-3 h-3 text-[#C4956A]" /> {statusName}
                      </div>
                      <h3 className="text-3xl md:text-4xl archival-heading mb-3 tracking-tight text-white uppercase">
                        Еволюція Енергії
                      </h3>
                      <p className="text-[#A89880] mb-6 font-mono text-[10px] tracking-widest uppercase md:text-xs">
                        Твій енергетичний потенціал зростає! До переходу в <span className="text-[#C4956A]">{user.totalLiters < 5 ? 'Tea Lover' : user.totalLiters < 15 ? 'Energy Master' : 'Grand Master'}</span> залишилось {(nextStatusGoal - user.totalLiters).toFixed(1)} літрів чистого ПУЕРУ.
                      </p>
                      
                      <div className="relative">
                        <div className="flex justify-between text-[10px] uppercase font-mono font-bold text-[#A89880] mb-2 tracking-widest">
                          <span>{Math.round(user.totalLiters * 10)} чашок випито</span>
                          <span>Еволюція: {nextStatusGoal * 10} чашок</span>
                        </div>
                        <div className="w-full bg-[#050505] h-3 rounded-none overflow-hidden p-[2px] border border-white/10">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 1.5, ease: "easeOut" }} className="h-full bg-[#C4956A] relative shadow-[0_0_10px_#C4956A]">
                            <div className="absolute top-0 right-0 w-10 h-full bg-gradient-to-l from-white/40 to-transparent"></div>
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Fun Analytics Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bento-card bg-black/60 p-4 md:p-6 rounded-2xl border border-white/5 flex flex-col justify-center items-center text-center group hover:border-[#C4956A]/30 transition-all shadow-lg relative overflow-hidden">
                      <div className="absolute inset-0 noise-overlay opacity-20 pointer-events-none" />
                      <div className="w-10 h-10 rounded-xl bg-white/5 text-white/50 flex items-center justify-center mb-4 group-hover:text-[#C4956A] group-hover:bg-[#C4956A]/10 transition-colors border border-white/5"><TrendingUp className="w-5 h-5" /></div>
                      <p className="text-2xl md:text-3xl font-black font-mono tracking-tighter text-white relative z-10">{Math.round(user.totalLiters * 10)}</p>
                      <p className="text-[9px] uppercase font-mono tracking-widest font-bold text-[#A89880] mt-1 relative z-10 w-full whitespace-nowrap">Випито Чашок</p>
                    </div>
                    <div className="bento-card bg-black/60 p-4 md:p-6 rounded-2xl border border-white/5 flex flex-col justify-center items-center text-center group hover:border-[#C4956A]/30 transition-all shadow-lg relative overflow-hidden">
                      <div className="absolute inset-0 noise-overlay opacity-20 pointer-events-none" />
                      <div className="w-10 h-10 rounded-xl bg-white/5 text-white/50 flex items-center justify-center mb-4 group-hover:text-[#C4956A] group-hover:bg-[#C4956A]/10 transition-colors border border-white/5"><Wallet className="w-5 h-5" /></div>
                      <p className="text-2xl md:text-3xl font-black font-mono tracking-tighter text-white relative z-10">{Math.round(user.totalLiters * 10 * 75)}<span className="text-sm opacity-50">₴</span></p>
                      <p className="text-[9px] uppercase font-mono tracking-widest font-bold text-[#A89880] mt-1 relative z-10 w-full whitespace-nowrap">Зекономлено</p>
                    </div>
                    <div className="bento-card bg-black/60 p-4 md:p-6 rounded-2xl border border-white/5 flex flex-col justify-center items-center text-center group hover:border-[#C4956A]/30 transition-all shadow-lg relative overflow-hidden">
                      <div className="absolute inset-0 noise-overlay opacity-20 pointer-events-none" />
                      <div className="w-10 h-10 rounded-xl bg-white/5 text-white/50 flex items-center justify-center mb-4 group-hover:text-[#C4956A] group-hover:bg-[#C4956A]/10 transition-colors border border-white/5"><Zap className="w-5 h-5" /></div>
                      <p className="text-2xl md:text-3xl font-black font-mono tracking-tighter text-white relative z-10">{Math.round(user.totalLiters * 10 * 4)}</p>
                      <p className="text-[9px] uppercase font-mono tracking-widest font-bold text-[#A89880] mt-1 relative z-10 w-full whitespace-nowrap">Годин Енергії</p>
                    </div>
                    <div className="bento-card bg-black/60 p-4 md:p-6 rounded-2xl border border-white/5 flex flex-col justify-center items-center text-center group hover:border-[#C4956A]/30 transition-all shadow-lg relative overflow-hidden">
                      <div className="absolute inset-0 noise-overlay opacity-20 pointer-events-none" />
                      <div className="w-10 h-10 rounded-xl bg-white/5 text-white/50 flex items-center justify-center mb-4 group-hover:text-[#C4956A] group-hover:bg-[#C4956A]/10 transition-colors border border-white/5"><MapPin className="w-5 h-5" /></div>
                      <p className="text-2xl md:text-3xl font-black font-mono tracking-tighter text-white relative z-10">{Math.round(user.totalLiters * 1.5)}<span className="text-sm opacity-50">км</span></p>
                      <p className="text-[9px] uppercase font-mono tracking-widest font-bold text-[#A89880] mt-1 relative z-10 w-full whitespace-nowrap">Довжини посилок</p>
                    </div>
                  </div>

                  {/* Health Progress Bars & Easter Egg Grid */}
                  <div className="grid lg:grid-cols-5 gap-6">
                    <div className="lg:col-span-3 bento-card bg-black/60 p-6 rounded-2xl border border-white/5 shadow-lg flex flex-col justify-center relative overflow-hidden">
                       <div className="absolute inset-0 noise-overlay opacity-20 pointer-events-none" />
                       <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest mb-6 flex items-center gap-2 relative z-10"><Heart className="w-4 h-4 text-[#C4956A]" /> Біохакінг Організму</h4>
                       <div className="space-y-6 relative z-10">
                         <div>
                           <div className="flex justify-between font-mono text-[10px] tracking-widest uppercase font-bold mb-2">
                             <span className="text-[#A89880]">Збережене Серце (vs Кава)</span>
                             <span className="text-[#C4956A]">{(user.totalLiters * 10 * 12).toFixed(0)} ударів/хв</span>
                           </div>
                           <div className="h-1 w-full bg-[#111] rounded-none overflow-hidden border border-white/5">
                             <div className="h-full bg-[#C4956A] w-[75%] rounded-none shadow-[0_0_10px_#C4956A]"></div>
                           </div>
                         </div>
                         <div>
                           <div className="flex justify-between font-mono text-[10px] tracking-widest uppercase font-bold mb-2">
                             <span className="text-[#A89880]">Діабет (vs Енергетики)</span>
                             <span className="text-[#C4956A]">{Math.round(user.totalLiters * 10 * 27)}г цукру</span>
                           </div>
                           <div className="h-1 w-full bg-[#111] rounded-none overflow-hidden border border-white/5">
                             <div className="h-full bg-[#C4956A] w-[90%] rounded-none shadow-[0_0_10px_#C4956A]"></div>
                           </div>
                         </div>
                         <div>
                           <div className="flex justify-between font-mono text-[10px] tracking-widest uppercase font-bold mb-2">
                             <span className="text-[#A89880]">Травлення</span>
                             <span className="text-[#C4956A]">+{Math.round(user.totalLiters * 1.2)}%</span>
                           </div>
                           <div className="h-1 w-full bg-[#111] rounded-none overflow-hidden border border-white/5">
                             <div className="h-full bg-[#C4956A] w-[60%] rounded-none shadow-[0_0_10px_#C4956A]"></div>
                           </div>
                         </div>
                       </div>
                    </div>

                    <div className="lg:col-span-2 bento-card bg-black/60 p-6 rounded-2xl border border-white/5 shadow-lg relative overflow-hidden flex flex-col justify-center items-center text-center group cursor-pointer">
                      <div className="absolute inset-0 noise-overlay opacity-20 pointer-events-none" />
                      <div className="absolute inset-0 bg-gradient-to-tr from-[#C4956A]/5 to-transparent"></div>
                      <div className="w-24 h-24 perspective-[1000px] group-hover:scale-110 transition-transform duration-500 mb-6 relative z-10">
                        <div className="w-full h-full bg-[#111] rounded-2xl rotate-45 flex items-center justify-center shadow-[0_0_40px_rgba(196,149,106,0.1)] border border-[#C4956A]/40 animate-[spin_10s_linear_infinite]">
                          <div className="-rotate-45 font-black text-3xl text-[#C4956A]">?</div>
                        </div>
                      </div>
                      <h4 className="font-bold text-lg mb-1 relative z-10 text-[#C4956A] drop-shadow-lg uppercase tracking-wider">Секретний Дроп</h4>
                      <p className="text-[10px] text-[#A89880] max-w-[200px] relative z-10 uppercase tracking-widest font-mono">Тисни для активації 3D голограми та секретних пасхалок</p>
                      
                      {/* Hidden interactive egg background */}
                      <div className="absolute inset-x-0 bottom-0 h-0 bg-gradient-to-t from-[#C4956A]/10 to-transparent group-hover:h-full transition-all duration-300"></div>
                    </div>
                  </div>
                </motion.div>
              )}

{activeTab === 'referral' && (
                <motion.div key="referral" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  {/* Bento Referral Hub */}
                  <div className="bento-card relative rounded-2xl bg-[#0A0A0A] p-10 border border-white/5 shadow-[0_0_40px_rgba(196,149,106,0.1)] overflow-hidden text-center">
                    <div className="absolute inset-0 noise-overlay opacity-30 pointer-events-none" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[radial-gradient(circle_at_center,#C4956A_0%,transparent_50%)] opacity-5 pointer-events-none rotate-45"></div>
                    
                    <div className="relative z-10">
                      <div className="inline-flex justify-center items-center w-20 h-20 rounded-xl bg-black border border-[#C4956A]/20 shadow-[0_0_30px_rgba(196,149,106,0.2)] mb-6">
                        <Gift className="w-10 h-10 text-[#C4956A]" />
                      </div>
                      <h2 className="text-3xl md:text-5xl archival-heading tracking-tight mb-4 uppercase text-white">Втягни бро у гру</h2>
                      <p className="text-[#A89880] text-sm md:text-base font-mono tracking-wider max-w-lg mx-auto mb-10">Даруй їм <span className="text-white font-bold">знижку 50₴</span> на перший чек, та забирай <span className="text-[#C4956A] font-bold">100₴ на свій баланс</span> як тільки вони оплатять покупку.</p>
                    </div>

                    <div className="max-w-2xl mx-auto p-4 bg-black/60 border border-white/10 rounded-xl flex flex-col md:flex-row items-center gap-4 relative z-10">
                      <div className="flex-1 text-center md:text-left px-4">
                        <div className="text-[10px] uppercase font-mono tracking-widest font-bold text-[#A89880] mb-1">Твій персональний код:</div>
                        <code className="text-2xl font-mono font-bold text-[#C4956A] tracking-widest select-all">{user.referralCode}</code>
                      </div>
                      <button onClick={copyReferralLink} className="w-full md:w-auto flex items-center justify-center gap-2 bg-[#C4956A] hover:bg-[#A67B53] text-black px-8 py-4 rounded-lg font-bold uppercase tracking-wider font-mono text-[10px] sm:text-xs transition-all active:scale-95 group shadow-[0_0_20px_rgba(196,149,106,0.3)]">
                        <Copy className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        {copiedReferral ? 'Скопійовано!' : 'Копіювати Лінк'}
                      </button>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8 relative z-10">
                      <button onClick={() => shareReferral('telegram')} className="px-8 py-4 bg-[#2AABEE]/10 border border-[#2AABEE]/30 text-[#2AABEE] hover:bg-[#2AABEE]/20 hover:border-[#2AABEE]/60 rounded-lg font-bold font-mono uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-3">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.223-.535.223l.188-2.85 5.18-4.686c.223-.195-.054-.306-.346-.118l-6.4 4.024-2.76-.86c-.6-.188-.61-.595.125-.898l10.77-4.148c.5-.187.94.103.78.891z"/></svg> 
                        Відправити в TG
                      </button>
                      <button onClick={() => shareReferral('whatsapp')} className="px-8 py-4 bg-[#25D366]/10 border border-[#25D366]/30 text-[#25D366] hover:bg-[#25D366]/20 hover:border-[#25D366]/60 rounded-lg font-bold font-mono uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-3">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.891-4.444 9.893-9.892.001-5.447-4.443-9.89-9.893-9.89-5.448 0-9.891 4.444-9.893 9.892-.001 2.247.616 4.318 1.777 6.136l-1.011 3.693 3.735-.989z"/></svg>
                        Поділитися в WA
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'orders' && (
                <motion.div key="orders" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-2xl archival-heading uppercase px-2">Скриня Замовлень</h3>
                    <div className="text-[10px] font-mono font-bold text-[#C4956A] border border-[#C4956A]/20 bg-[#C4956A]/10 px-3 py-1.5 rounded-lg uppercase tracking-widest">Всього: {orders.length}</div>
                  </div>
                  
                  {orders.length === 0 ? (
                    <div className="bento-card bg-black/60 p-16 rounded-[2rem] text-center border border-dashed border-white/10 relative overflow-hidden">
                      <div className="absolute inset-0 noise-overlay opacity-20 pointer-events-none" />
                      <div className="w-20 h-20 bg-black border border-white/5 shadow-xl rounded-2xl mx-auto flex items-center justify-center mb-6 relative z-10">
                        <Package className="w-8 h-8 text-[#555]" />
                      </div>
                      <h4 className="text-xl archival-heading uppercase mb-2 relative z-10">Твоя матриця замовлень порожня</h4>
                      <p className="text-[10px] uppercase font-mono tracking-widest text-[#888] mb-8 max-w-md mx-auto relative z-10">Ініціюй першу поставку преміального чайного концентрату для активації статусу Пілота.</p>
                      <Link href="/products" className="inline-block bg-[#C4956A] text-black px-8 py-4 rounded-xl font-bold font-mono tracking-widest uppercase text-[10px] hover:bg-[#A67B53] active:scale-95 transition-all shadow-[0_0_20px_rgba(196,149,106,0.3)] relative z-10">Синхронізувати Каталог</Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order, i) => (
                        <motion.div initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}} transition={{delay:i*0.1}} key={order.id} className="bento-card bg-black p-6 md:p-8 rounded-2xl border border-white/5 shadow-lg group hover:border-[#C4956A]/30 transition-all relative overflow-hidden">
                          <div className="absolute inset-0 noise-overlay opacity-20 pointer-events-none" />
                          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6 relative z-10">
                            <div>
                              <div className="text-[10px] font-mono tracking-widest uppercase font-bold text-[#A89880] mb-1">{order.date}</div>
                              <h4 className="archival-heading text-lg text-white uppercase">Замовлення #{order.id}</h4>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="px-4 py-1.5 bg-[#C4956A]/10 border border-[#C4956A]/30 text-[#C4956A] rounded-lg text-[10px] font-mono font-bold uppercase tracking-widest shadow-[0_0_10px_rgba(196,149,106,0.1)]">{order.currentStatus}</span>
                              <span className="text-2xl font-black font-mono tracking-tighter text-white">{order.total}<span className="text-sm opacity-50">₴</span></span>
                            </div>
                          </div>
                          <div className="bg-[#0A0A0A] rounded-xl p-4 border border-white/5 space-y-2 mb-6 relative z-10">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex justify-between text-sm items-center py-1 border-b border-white/5 last:border-0">
                                <span className="font-mono text-[10px] uppercase tracking-widest font-bold text-[#A89880]">{item.name} <span className="opacity-50 ml-1">({item.volume})</span></span>
                                <span className="font-bold text-[#C4956A] bg-[#111] border border-[#C4956A]/20 px-3 py-1.5 rounded text-[10px] font-mono">x{item.quantity}</span>
                              </div>
                            ))}
                          </div>
                          <div className="flex justify-end relative z-10">
                            <Link href="/products" className="text-[10px] font-mono font-bold uppercase tracking-widest bg-transparent border border-white/20 text-[#A89880] px-6 py-3 rounded-lg hover:text-[#C4956A] hover:border-[#C4956A] transition-all">Повторити Матрицю</Link>
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
                  <div className="bento-card bg-[#0A0A0A] relative p-6 md:p-8 rounded-[1.5rem] border border-white/5 overflow-hidden shadow-[0_0_30px_rgba(239,68,68,0.1)]">
                    <div className="absolute inset-0 noise-overlay opacity-30 mix-blend-overlay"></div>
                    <div className="absolute right-0 top-0 w-1/2 h-full bg-[radial-gradient(ellipse_at_center,rgba(239,68,68,1)_0%,transparent_60%)] opacity-10 mix-blend-screen animate-pulse"></div>
                    
                    <div className="relative z-10 max-w-xl">
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-black rounded shadow-[0_0_10px_rgba(239,68,68,0.2)] border border-red-500/30 text-[10px] font-mono tracking-widest font-bold uppercase mb-4 text-red-500">
                        <Target className="w-3 h-3" /> C2B2B Hunt
                      </div>
                      <h3 className="text-3xl md:text-5xl archival-heading mb-4 tracking-tight text-white uppercase leading-tight">
                        Здай Свою Кав'ярню <br/><span className="text-red-500">Отримай Чай</span>
                      </h3>
                      <p className="text-[#A89880] mb-6 font-mono text-[10px] tracking-widest uppercase md:text-xs">
                        Кав'ярня на твоєму районі досі готує хімозні чаї? Здай нам їх назву та місто. Ми підключимо їх до Синдикату, а ти отримаєш фіксований <strong className="text-red-500 bg-red-500/10 border border-red-500/20 px-2 py-1 rounded">+500₴ бонус</strong> на баланс за кожну успішну 1L інтеграцію.
                      </p>
                    </div>
                  </div>

                  {/* Submission Form */}
                  <div className="bento-card bg-black/80 p-8 rounded-2xl border border-red-500/20 shadow-[0_20px_60px_rgba(239,68,68,0.1)] relative overflow-hidden group/form">
                    <div className="absolute inset-0 noise-overlay opacity-30 pointer-events-none" />
                    <RadarSonar />
                    <div className="absolute top-0 right-0 w-40 h-40 bg-red-500/10 rounded-full blur-[50px] mix-blend-screen group-hover/form:bg-red-500/20 transition-all duration-700 pointer-events-none"></div>
                    <form onSubmit={handleB2bSubmit} className="space-y-6 relative z-10">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="relative group">
                          <label className="absolute -top-2.5 left-4 bg-black border border-white/10 px-2 text-[9px] font-mono font-bold uppercase tracking-widest text-[#555] group-focus-within:text-red-500 group-focus-within:border-red-500/50 transition-colors z-10 rounded">Назва Кав'ярні *</label>
                          <input type="text" required value={b2bForm.cafeName} onChange={e => setB2bForm({...b2bForm, cafeName: e.target.value})} className="w-full bg-[#050505] border border-white/5 rounded-xl px-5 py-4 focus:outline-none focus:border-red-500/50 transition-all font-mono text-[10px] tracking-widest text-white uppercase focus:shadow-[0_0_15px_rgba(239,68,68,0.1)] hover:border-white/10" />
                        </div>
                        <div className="relative group">
                          <label className="absolute -top-2.5 left-4 bg-black border border-white/10 px-2 text-[9px] font-mono font-bold uppercase tracking-widest text-[#555] group-focus-within:text-red-500 group-focus-within:border-red-500/50 transition-colors z-10 rounded">Місто</label>
                          <input type="text" value={b2bForm.city} onChange={e => setB2bForm({...b2bForm, city: e.target.value})} className="w-full bg-[#050505] border border-white/5 rounded-xl px-5 py-4 focus:outline-none focus:border-red-500/50 transition-all font-mono text-[10px] tracking-widest text-white uppercase focus:shadow-[0_0_15px_rgba(239,68,68,0.1)] hover:border-white/10" />
                        </div>
                      </div>

                      <div className="relative group">
                        <label className="absolute -top-2.5 left-4 bg-black border border-white/10 px-2 text-[9px] font-mono font-bold uppercase tracking-widest text-[#555] group-focus-within:text-red-500 group-focus-within:border-red-500/50 transition-colors z-10 rounded">Адреса або Instagram</label>
                        <input type="text" value={b2bForm.address} onChange={e => setB2bForm({...b2bForm, address: e.target.value})} className="w-full bg-[#050505] border border-white/5 rounded-xl px-5 py-4 focus:outline-none focus:border-red-500/50 transition-all font-mono text-[10px] tracking-widest text-white uppercase focus:shadow-[0_0_15px_rgba(239,68,68,0.1)] hover:border-white/10" />
                      </div>

                      <div className="relative group">
                        <label className="absolute -top-2.5 left-4 bg-black border border-white/10 px-2 text-[9px] font-mono font-bold uppercase tracking-widest text-[#555] group-focus-within:text-red-500 group-focus-within:border-red-500/50 transition-colors z-10 rounded">Розвіддані (Коментар)</label>
                        <textarea rows={3} value={b2bForm.notes} onChange={e => setB2bForm({...b2bForm, notes: e.target.value})} className="w-full bg-[#050505] border border-white/5 rounded-xl px-5 py-4 focus:outline-none focus:border-red-500/50 transition-all resize-none font-mono text-[10px] tracking-widest text-white uppercase focus:shadow-[0_0_15px_rgba(239,68,68,0.1)] hover:border-white/10"></textarea>
                      </div>

                      <div className="pt-4 relative overflow-hidden rounded-xl">
                        <button disabled={isB2bSubmitting} type="submit" className="w-full bg-red-500 text-black px-6 py-4 rounded-xl font-black uppercase font-mono tracking-widest text-[10px] sm:text-[11px] transition-all flex items-center justify-center gap-3 relative z-10 hover:shadow-[0_0_30px_rgba(239,68,68,0.4)] hover:scale-[1.02] active:scale-95 group">
                          <Target className={`w-4 h-4 ${isB2bSubmitting ? 'animate-spin' : 'group-hover:scale-125 transition-transform'}`} />
                          {isB2bSubmitting ? (
                             <span className="opacity-80">DECODING_COORDINATES... ▰▰▰▱▱</span>
                          ) : 'Передати координати у Штаб'}
                        </button>
                        {isB2bSubmitting && (
                           <motion.div initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: 1.5 }} className="absolute bottom-0 left-0 h-1 bg-white z-20 shadow-[0_0_10px_white]"></motion.div>
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
