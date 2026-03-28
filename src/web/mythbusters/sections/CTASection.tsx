"use client";
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ExternalLink, MessageCircle, Instagram, Youtube, Send, ShoppingBag, Gift, Truck } from 'lucide-react';
import { Button } from '@myth/components/ui/button';

export default function CTASection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  
  return (
    <section 
      ref={sectionRef}
      className="relative py-20 sm:py-32 overflow-hidden"
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#8B1A1A] via-[#1B2E1B] to-[#8B1A1A]" />
      
      {/* Animated Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")`,
        }} />
      </div>
      
      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-20 h-20 rounded-full bg-white/5"
            style={{
              left: `${10 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
            animate={{
              y: [0, -20, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              delay: i * 0.5,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-full text-white text-sm font-medium">
            <MessageCircle className="w-4 h-4" />
            Join the Movement
          </span>
        </motion.div>
        
        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-6"
        >
          READY TO TRY
          <span className="block text-[#C9A227]">BOOSTERTEA?</span>
        </motion.h2>
        
        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-lg sm:text-xl text-white/80 mb-8 max-w-2xl mx-auto"
        >
          6 hours of stable energy without the crash. 40+ servings in every bottle. 
          Natural ingredients. Ukrainian product.
        </motion.p>
        
        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-wrap justify-center gap-4 mb-8"
        >
          {[
            { icon: ShoppingBag, text: '40+ Servings' },
            { icon: Gift, text: 'Free Shipping from $40' },
            { icon: Truck, text: '1-3 Day Delivery' },
          ].map((feature, index) => (
            <div key={index} className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-white/80 text-sm">
              <feature.icon className="w-4 h-4" />
              {feature.text}
            </div>
          ))}
        </motion.div>
        
        {/* Price */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-8"
        >
          <div className="inline-flex items-baseline gap-2">
            <span className="text-5xl sm:text-6xl font-black text-[#C9A227]">975 ₴</span>
            <span className="text-white/60 text-lg">= 40+ servings</span>
          </div>
          <p className="text-white/50 text-sm mt-2">
            Only 24 ₴ per serving — cheaper than coffee shop coffee!
          </p>
        </motion.div>
        
        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
        >
          <a
            href="https://boostertea.com.ua"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              className="group px-8 py-6 bg-[#C9A227] hover:bg-[#b89420] text-[#0D0D0D] text-lg font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <span className="flex items-center gap-2">
                Order Now
                <ExternalLink className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Button>
          </a>
          
          <a
            href="https://t.me/boostertea_ua"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              variant="outline"
              className="px-8 py-6 border-2 border-white text-white hover:bg-white hover:text-[#8B1A1A] text-lg font-bold rounded-xl transition-all duration-300"
            >
              <span className="flex items-center gap-2">
                Message on Telegram
                <Send className="w-5 h-5" />
              </span>
            </Button>
          </a>
        </motion.div>
        
        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 1 }}
          className="flex justify-center gap-4"
        >
          {[
            { icon: Instagram, href: 'https://instagram.com/boostertea_ua', label: 'Instagram' },
            { icon: Youtube, href: 'https://youtube.com/@boostertea', label: 'YouTube' },
            { icon: Send, href: 'https://t.me/boostertea_ua', label: 'Telegram' },
          ].map((social, index) => (
            <a
              key={index}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
              aria-label={social.label}
            >
              <social.icon className="w-5 h-5" />
            </a>
          ))}
        </motion.div>
        
        {/* QR Code Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="mt-12"
        >
          <div className="inline-block p-4 bg-white rounded-xl">
            <div className="w-32 h-32 bg-[#0D0D0D] rounded-lg flex items-center justify-center">
              <span className="text-white text-xs text-center">
                QR Code<br/>for Ordering
              </span>
            </div>
          </div>
          <p className="text-white/50 text-sm mt-3">
            Scan for instant ordering
          </p>
        </motion.div>
      </div>
    </section>
  );
}
