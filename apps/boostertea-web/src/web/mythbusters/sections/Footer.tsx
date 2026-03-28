"use client";
import { motion } from 'framer-motion';
import { Heart, MapPin, Mail, Phone } from 'lucide-react';
import { useTranslation } from '@myth/hooks/useTranslation';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { t } = useTranslation();
  
  return (
    <footer className="relative bg-[#0D0D0D] text-white overflow-hidden">
      {/* Top Border Gradient */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#8B1A1A] via-[#C9A227] to-[#1B2E1B]" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-2xl sm:text-3xl font-black mb-4">
                <span className="text-gradient">BOOSTERTEA</span>
              </h3>
              <p className="text-white/60 mb-6 max-w-md">
                {t('footer.description')}
              </p>
              
              {/* Contact Info */}
              <div className="space-y-3">
                <a 
                  href="mailto:hello@boostertea.com.ua"
                  className="flex items-center gap-3 text-white/60 hover:text-[#C9A227] transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  hello@boostertea.com.ua
                </a>
                <a 
                  href="tel:+380961234567"
                  className="flex items-center gap-3 text-white/60 hover:text-[#C9A227] transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  +38 (096) 123-45-67
                </a>
                <div className="flex items-center gap-3 text-white/60">
                  <MapPin className="w-4 h-4" />
                  Lviv, Ukraine
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 className="text-lg font-bold mb-4 text-white">{t('footer.quickLinks')}</h4>
            <ul className="space-y-3">
              {[
                { label: t('nav.home'), href: '#' },
                { label: t('nav.heroes'), href: '#ambassadors' },
                { label: t('nav.comics'), href: '#comics' },
                { label: t('nav.joinTeam'), href: '#trainees' },
                { label: t('nav.merch'), href: '#merch' },
                { label: t('nav.shop'), href: 'https://boostertea.com.ua' },
              ].map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href}
                    className="text-white/60 hover:text-[#C9A227] transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
          
          {/* Legal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h4 className="text-lg font-bold mb-4 text-white">{t('footer.legal')}</h4>
            <ul className="space-y-3">
              {[
                { label: 'Privacy Policy', href: '#' },
                { label: 'Terms of Use', href: '#' },
                { label: 'Shipping & Payment', href: '#' },
                { label: 'Returns', href: '#' },
              ].map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href}
                    className="text-white/60 hover:text-[#C9A227] transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
        
        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 pt-8 border-t border-white/10"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-white/40 text-sm text-center sm:text-left">
              © {currentYear} BoosterTea. {t('footer.copyright')}
            </p>
            
            <p className="flex items-center gap-2 text-white/40 text-sm">
              {t('footer.madeIn')} <Heart className="w-4 h-4 text-[#E74C3C] fill-current" /> {t('footer.inUkraine')}
            </p>
          </div>
        </motion.div>
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#8B1A1A]/5 rounded-full blur-3xl" />
      <div className="absolute top-20 right-0 w-48 h-48 bg-[#C9A227]/5 rounded-full blur-3xl" />
    </footer>
  );
}
