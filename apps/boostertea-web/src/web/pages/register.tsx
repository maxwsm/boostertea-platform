import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../lib/auth';
import Header from '../components/Header';
import Footer from '../components/Footer';
import TelegramButton from '../components/TelegramButton';
import { useTranslation } from '../lib/i18n';
import { SEO, useSEOConfig } from '../components/SEO';

const Register = () => {
  const [, setLocation] = useLocation();
  const { register, isAuthenticated, isLoading: authLoading } = useAuth();
  const { t, language } = useTranslation();
  const seoConfig = useSEOConfig('register');
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      setLocation('/account');
    }
  }, [isAuthenticated, authLoading, setLocation]);

  const getPasswordStrengthLabel = (strength: number) => {
    if (language === 'uk') {
      if (strength <= 1) return 'Слабкий';
      if (strength === 2) return 'Середній';
      return 'Сильний';
    }
    if (language === 'es') {
      if (strength <= 1) return 'Débil';
      if (strength === 2) return 'Medio';
      return 'Fuerte';
    }
    if (strength <= 1) return 'Weak';
    if (strength === 2) return 'Medium';
    return 'Strong';
  };

  const passwordStrength = () => {
    if (!password) return { strength: 0, label: '', color: '' };
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    const level = strength <= 2 ? 1 : strength <= 3 ? 2 : 3;
    const colors = { 1: 'bg-red-500', 2: 'bg-yellow-500', 3: 'bg-[var(--accent)]' };
    
    return { strength: level, label: getPasswordStrengthLabel(level), color: colors[level as keyof typeof colors] };
  };

  const { strength, label, color } = passwordStrength();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError(language === 'uk' ? 'Паролі не співпадають' : language === 'es' ? 'Las contraseñas no coinciden' : 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError(t('register.passwordHint'));
      return;
    }

    if (!acceptTerms) {
      setError(language === 'uk' ? 'Прийміть умови використання' : language === 'es' ? 'Acepta los términos de uso' : 'Accept terms of use');
      return;
    }

    setIsLoading(true);

    const result = await register({ name, email, phone, password });
    
    if (result.success) {
      setLocation('/account');
    } else {
      setError(result.error || t('register.error'));
    }
    
    setIsLoading(false);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#9FD356]/20 border-t-[#9FD356] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <SEO 
        title={seoConfig.title}
        description={seoConfig.description}
        noIndex={true}
      />
      <Header />
      
      <main className="pt-24 pb-16 min-h-screen flex items-center">
        <div className="max-w-md mx-auto px-4 w-full py-8">
          {/* Decorative elements */}
          <div className="absolute top-32 right-1/4 w-64 h-64 bg-[var(--accent)]/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-32 left-1/4 w-48 h-48 bg-[#8B7355]/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative">
            {/* Welcome icon */}
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#9FD356] to-[#7FB030] flex items-center justify-center shadow-lg shadow-[#9FD356]/20 animate-bounce-slow">
                <span className="text-4xl">🌱</span>
              </div>
            </div>

            <h1 
              className="text-3xl sm:text-4xl text-center text-[var(--text-primary)] mb-2"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {t('register.title')}
            </h1>
            <p className="text-center text-[var(--text-muted)] mb-8">
              {t('register.subtitle')}
            </p>
            <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl p-8 mb-8 text-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-[#0088cc]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-16 h-16 bg-[#0088cc] rounded-full flex items-center justify-center mb-6 shadow-lg shadow-[#0088cc]/30 animate-float">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                  </svg>
                </div>
                
                <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">Швидка Реєстрація</h2>
                <p className="text-[var(--text-primary)]/var(--text-muted) text-sm mb-6 max-w-xs mx-auto">
                  Ми повністю відмовились від паролів. Підключіть Telegram, щоб миттєво створити акаунт та отримувати кешбек 10%.
                </p>

                {/* Telegram Widget Container */}
                <div id="telegram-login-container" className="min-h-[40px] flex items-center justify-center w-full">
                  <a href="https://t.me/boostertea_bot" target="_blank" rel="noreferrer" className="w-full sm:w-auto px-8 py-3.5 bg-[#0088cc] text-white font-medium rounded-xl hover:bg-[#0077b5] transition-colors shadow-lg shadow-[#0088cc]/20 flex items-center justify-center gap-3">
                    Авторизуватись через Telegram
                  </a>
                </div>
              </div>
            </div>

            {/* Back to Home link */}
            <p className="mt-8 text-center text-[var(--text-primary)]/var(--text-muted)">
              <Link href="/" className="text-[var(--accent)] font-semibold hover:underline flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                Повернутись на головну
              </Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
      <TelegramButton />
      
      <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default Register;
