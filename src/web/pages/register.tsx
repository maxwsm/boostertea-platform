import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
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
            <p className="text-center text-[var(--text-primary)]/var(--text-muted) mb-8">
              {t('register.subtitle')}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm animate-shake">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-[var(--text-primary)]/var(--text-secondary) text-sm mb-2 font-medium">
                  {t('register.name')}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t('register.namePlaceholder')}
                    className="w-full px-4 py-3.5 pl-12 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] placeholder-[#F5F0E8]/30 focus:border-[#9FD356]/var(--text-muted) focus:ring-1 focus:ring-[#9FD356]/var(--text-muted) transition-all outline-none"
                    required
                  />
                  <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-primary)]/var(--text-subtle)" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>

              <div>
                <label className="block text-[var(--text-primary)]/var(--text-secondary) text-sm mb-2 font-medium">
                  {t('register.email')} <span className="text-[var(--text-muted)] font-normal">({language === 'uk' ? 'опціонально' : language === 'es' ? 'opcional' : 'optional'})</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('register.emailPlaceholder')}
                    className="w-full px-4 py-3.5 pl-12 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] placeholder-[#F5F0E8]/30 focus:border-[#9FD356]/var(--text-muted) focus:ring-1 focus:ring-[#9FD356]/var(--text-muted) transition-all outline-none"
                  />
                  <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-primary)]/var(--text-subtle)" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>

              <div>
                <label className="block text-[var(--text-primary)]/var(--text-secondary) text-sm mb-2 font-medium">
                  {t('register.phone')} <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={t('register.phonePlaceholder')}
                    className="w-full px-4 py-3.5 pl-12 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] placeholder-[#F5F0E8]/30 focus:border-[#9FD356]/var(--text-muted) focus:ring-1 focus:ring-[#9FD356]/var(--text-muted) transition-all outline-none"
                    required
                  />
                  <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-primary)]/var(--text-subtle)" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
              </div>

              <div>
                <label className="block text-[var(--text-primary)]/var(--text-secondary) text-sm mb-2 font-medium">
                  {t('register.password')}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t('register.passwordPlaceholder')}
                    className="w-full px-4 py-3.5 pl-12 pr-12 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] placeholder-[#F5F0E8]/30 focus:border-[#9FD356]/var(--text-muted) focus:ring-1 focus:ring-[#9FD356]/var(--text-muted) transition-all outline-none"
                    required
                    minLength={6}
                  />
                  <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-primary)]/var(--text-subtle)" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-primary)]/var(--text-subtle) hover:text-[var(--text-primary)]/var(--text-secondary) transition-colors"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                {/* Password strength indicator */}
                {password && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-[#F5F0E8]/10 rounded-full overflow-hidden flex gap-1">
                      {[1, 2, 3].map((i) => (
                        <div 
                          key={i}
                          className={`flex-1 rounded-full transition-all ${i <= strength ? color : 'bg-transparent'}`}
                        />
                      ))}
                    </div>
                    <span className={`text-xs ${strength === 3 ? 'text-[var(--accent)]' : strength === 2 ? 'text-yellow-500' : 'text-red-400'}`}>
                      {label}
                    </span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[var(--text-primary)]/var(--text-secondary) text-sm mb-2 font-medium">
                  {t('register.confirmPassword')}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder={t('register.confirmPlaceholder')}
                    className={`w-full px-4 py-3.5 pl-12 bg-[var(--bg-secondary)] border rounded-xl text-[var(--text-primary)] placeholder-[#F5F0E8]/30 focus:ring-1 transition-all outline-none ${
                      confirmPassword && confirmPassword !== password 
                        ? 'border-red-500/var(--text-muted) focus:border-red-500 focus:ring-red-500/var(--text-muted)' 
                        : confirmPassword && confirmPassword === password
                        ? 'border-[#9FD356]/var(--text-muted) focus:border-[#9FD356] focus:ring-[#9FD356]/var(--text-muted)'
                        : 'border-[var(--border)] focus:border-[#9FD356]/var(--text-muted) focus:ring-[#9FD356]/var(--text-muted)'
                    }`}
                    required
                  />
                  <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-primary)]/var(--text-subtle)" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  {confirmPassword && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      {confirmPassword === password ? (
                        <svg className="w-5 h-5 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative mt-0.5">
                    <input
                      type="checkbox"
                      checked={acceptTerms}
                      onChange={(e) => setAcceptTerms(e.target.checked)}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded border-2 transition-all ${acceptTerms ? 'bg-[var(--accent)] border-[#9FD356]' : 'border-[#F5F0E8]/30 group-hover:border-[var(--card-border)]0'}`}>
                      {acceptTerms && (
                        <svg className="w-full h-full text-[#0D0D0D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <span className="text-[var(--text-primary)]/var(--text-muted) text-sm leading-relaxed">
                    {t('register.terms')}{' '}
                    <button type="button" className="text-[var(--accent)] hover:underline">{t('register.termsLink')}</button>
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-gradient-to-r from-[#9FD356] to-[#7FB030] text-[#0D0D0D] font-semibold rounded-xl hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#9FD356]/20 hover:shadow-[#9FD356]/30 hover:scale-[1.02] active:scale-[0.98]"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    {t('register.loading')}
                  </span>
                ) : t('register.submit')}
              </button>
            </form>

            {/* Social registration */}
            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[var(--border)]" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-[var(--bg-primary)] text-[var(--text-primary)]/var(--text-subtle)">{t('register.or')}</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <button 
                  type="button"
                  className="flex items-center justify-center gap-3 py-3 px-4 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] hover:bg-[#F5F0E8]/5 transition-all"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Google
                </button>
                <button 
                  type="button"
                  className="flex items-center justify-center gap-3 py-3 px-4 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] hover:bg-[#F5F0E8]/5 transition-all"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.09997 22C7.78997 22.05 6.79997 20.68 5.95997 19.47C4.24997 17 2.93997 12.45 4.69997 9.39C5.56997 7.87 7.12997 6.91 8.81997 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z"/>
                  </svg>
                  Apple
                </button>
              </div>
            </div>

            {/* Login link */}
            <p className="mt-8 text-center text-[var(--text-primary)]/var(--text-muted)">
              {t('register.hasAccount')}{' '}
              <Link href="/login" className="text-[var(--accent)] font-semibold hover:underline">
                {t('register.login')}
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
