"use client";
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Zap, BookOpen, Users, UserPlus, ShoppingBag, Gift, HelpCircle } from 'lucide-react';
import { Toaster } from 'sonner';
import { LanguageProvider, useTranslation } from '@myth/hooks/useTranslation';
import LanguageSwitcher from '@myth/components/LanguageSwitcher';
import PremiumBackground from '@myth/components/PremiumBackground';
import Hero from '@myth/sections/Hero';
import Ambassadors from '@myth/sections/Ambassadors';
import ComicGallery from '@myth/sections/ComicGallery';
import Trainees from '@myth/sections/Trainees';
import Quiz from '@myth/sections/Quiz';
import Merch from '@myth/sections/Merch';
import CTASection from '@myth/sections/CTASection';
import Footer from '@myth/sections/Footer';
import { MagneticButton } from '../components/scrollytelling/MagneticButton';

function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t } = useTranslation();
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const navLinks = [
    { label: t('nav.home'), href: '#', icon: Zap },
    { label: t('nav.heroes'), href: '#ambassadors', icon: Users },
    { label: t('nav.comics'), href: '#comics', icon: BookOpen },
    { label: t('nav.joinTeam'), href: '#trainees', icon: UserPlus },
    { label: t('nav.quiz'), href: '#quiz', icon: HelpCircle },
    { label: t('nav.merch'), href: '#merch', icon: Gift },
    { label: t('nav.shop'), href: 'https://boostertea.com.ua', external: true, icon: ShoppingBag },
  ];
  
  const scrollToSection = (href: string) => {
    if (href === '#') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (href.startsWith('#')) {
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };
  
  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: isScrolled ? 0 : -100 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-[#8B1A1A]/10"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <motion.a 
              href="#"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('#');
              }}
              className="text-xl font-black"
              whileHover={{ scale: 1.05 }}
            >
              <span className="bg-gradient-to-r from-[#8B1A1A] to-[#C9A227] bg-clip-text text-transparent">
                BOOSTERTEA
              </span>
            </motion.a>
            
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link, index) => (
                <MagneticButton key={index} pullStrength={15}>
                  <motion.a
                    href={link.href}
                    onClick={(e) => {
                      if (!link.external) {
                        e.preventDefault();
                        scrollToSection(link.href);
                      }
                    }}
                    target={link.external ? '_blank' : undefined}
                    rel={link.external ? 'noopener noreferrer' : undefined}
                    className="px-4 py-2 text-[#0D0D0D]/70 hover:text-[#8B1A1A] font-medium transition-colors rounded-lg hover:bg-[#8B1A1A]/5 text-sm flex items-center gap-1.5 block"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <link.icon className="w-4 h-4" />
                    {link.label}
                  </motion.a>
                </MagneticButton>
              ))}
              
              {/* Language Switcher */}
              <div className="ml-4 pl-4 border-l border-[#8B1A1A]/10">
                <LanguageSwitcher />
              </div>
            </div>
            
            {/* Mobile Menu Button */}
            <div className="flex items-center gap-2 lg:hidden">
              <LanguageSwitcher />
              <motion.button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 hover:bg-[#8B1A1A]/10 rounded-lg transition-colors"
                whileTap={{ scale: 0.95 }}
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6 text-[#0D0D0D]" />
                ) : (
                  <Menu className="w-6 h-6 text-[#0D0D0D]" />
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-white/95 backdrop-blur-xl pt-20 lg:hidden"
          >
            <div className="flex flex-col items-center gap-4 p-8">
              {navLinks.map((link, index) => (
                <motion.a
                  key={index}
                  href={link.href}
                  onClick={(e) => {
                    if (!link.external) {
                      e.preventDefault();
                      scrollToSection(link.href);
                    } else {
                      setIsMobileMenuOpen(false);
                    }
                  }}
                  target={link.external ? '_blank' : undefined}
                  rel={link.external ? 'noopener noreferrer' : undefined}
                  className="text-2xl font-bold text-[#0D0D0D] hover:text-[#8B1A1A] transition-colors flex items-center gap-3 py-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <link.icon className="w-6 h-6" />
                  {link.label}
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function AppContent() {
  return (
    <div className="min-h-screen bg-[#F5F0E8] relative">
      {/* Premium Animated Background */}
      <PremiumBackground />
      
      <Navigation />
      
      <main className="relative z-10">
        <Hero />
        <Ambassadors />
        <ComicGallery />
        <Trainees />
        <Quiz />
        <Merch />
        <CTASection />
      </main>
      
      <Footer />
      
      {/* Toast Notifications */}
      <Toaster 
        position="top-center"
        toastOptions={{
          style: {
            background: '#1a1a1a',
            color: '#fff',
            border: '1px solid rgba(201, 162, 39, 0.3)',
          },
        }}
      />
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

export default App;
