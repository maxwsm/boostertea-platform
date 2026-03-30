import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../lib/auth';

interface CafeNominationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CafeNominationModal({ isOpen, onClose, onSuccess }: CafeNominationModalProps) {
  const { user, updateUser } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    instagram: '',
    city: '',
    reason: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Custom framer-motion confetti to avoid external dependency issues
  const CustomConfetti = () => (
    <div className="fixed inset-0 pointer-events-none z-[60] overflow-hidden flex justify-center">
      {[...Array(60)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ y: -50, x: 0, opacity: 1, scale: 0 }}
          animate={{ 
            y: window.innerHeight, 
            x: (Math.random() - 0.5) * window.innerWidth,
            rotate: Math.random() * 720,
            scale: Math.random() * 1 + 0.5,
            opacity: [1, 1, 0]
          }}
          transition={{ 
            duration: Math.random() * 2 + 2, 
            ease: "circOut",
            delay: Math.random() * 0.2
          }}
          className={`absolute w-3 h-3 ${['bg-[#C4956A]', 'bg-[#9FD356]', 'bg-[#E8DDD0]', 'bg-[#FFD700]'][Math.floor(Math.random() * 4)]}`}
          style={{ borderRadius: Math.random() > 0.5 ? '50%' : '2px' }}
        />
      ))}
    </div>
  );

  const cities = ['Київ', 'Львів', 'Дніпро', 'Одеса', 'Харків', 'Інше'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.instagram || !formData.city) return;

    setIsSubmitting(true);
    
    // Mock API call
    await new Promise(res => setTimeout(res, 1200));
    
    // Add bonus points to user if logged in
    if (user) {
      updateUser({ bonusPoints: user.bonusPoints + 50 });
    }
    
    // Save nomination request to local storage to update leaderboard dynamically
    const nominations = JSON.parse(localStorage.getItem('bt_nominations') || '[]');
    nominations.push({ city: formData.city, date: new Date().toISOString() });
    localStorage.setItem('bt_nominations', JSON.stringify(nominations));

    setIsSubmitting(false);
    setShowConfetti(true);
    setStep(2);
    
    // Trigger callback
    onSuccess();
    
    // Turn off confetti after 4s
    setTimeout(() => {
      setShowConfetti(false);
    }, 4000);
  };

  const resetAndClose = () => {
    onClose();
    setTimeout(() => {
      setStep(1);
      setFormData({ instagram: '', city: '', reason: '' });
      setShowConfetti(false);
    }, 300);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={resetAndClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          {showConfetti && <CustomConfetti />}

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-[#1A1410] rounded-3xl overflow-hidden shadow-2xl border border-[#3A2E22] z-[55]"
          >
            {/* Glowing accents */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-[#C4956A]/20 blur-[60px] rounded-full pointer-events-none" />
            
            <div className="relative p-6 sm:p-8">
              <button
                onClick={resetAndClose}
                className="absolute top-4 right-4 text-[#A89880] hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {step === 1 ? (
                <div key="step1">
                  <div className="text-center mb-6">
                    <span className="text-4xl mb-3 block">📍</span>
                    <h2 className="text-2xl font-bold text-[#E8DDD0] mb-2" style={{ fontFamily: '"Playfair Display", serif' }}>
                      Хочеш бачити нас <br/><span className="text-[#C4956A]">в улюбленій кав'ярні?</span>
                    </h2>
                    <p className="text-[#A89880] text-sm leading-relaxed">
                      Залиши Instagram закладу — ми запропонуємо їм наш преміальний чай. А ти отримаєш <strong className="text-[#E8DDD0]">+50 балів</strong> за кожну заявку!
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-[#E8DDD0] mb-2">Instagram кав'ярні *</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A89880]">@</span>
                        <input
                          type="text"
                          required
                          value={formData.instagram}
                          onChange={e => setFormData({ ...formData, instagram: e.target.value })}
                          className="w-full pl-9 pr-4 py-3 bg-[#0F0B08] border border-[#3A2E22] rounded-xl text-[#E8DDD0] focus:ring-2 focus:ring-[#C4956A] focus:border-transparent outline-none transition-all placeholder:text-[#A89880]/50"
                          placeholder="cafe_name"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#E8DDD0] mb-2">Місто *</label>
                      <select
                        required
                        value={formData.city}
                        onChange={e => setFormData({ ...formData, city: e.target.value })}
                        className="w-full px-4 py-3 bg-[#0F0B08] border border-[#3A2E22] rounded-xl text-[#E8DDD0] focus:ring-2 focus:ring-[#C4956A] focus:border-transparent outline-none transition-all appearance-none"
                      >
                        <option value="" disabled>Оберіть місто</option>
                        {cities.map(city => (
                          <option key={city} value={city}>{city}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#E8DDD0] mb-2">Чому ми маємо бути там? <span className="text-[#A89880] font-normal">(Необов'язково)</span></label>
                      <textarea
                        value={formData.reason}
                        onChange={e => setFormData({ ...formData, reason: e.target.value })}
                        className="w-full px-4 py-3 bg-[#0F0B08] border border-[#3A2E22] rounded-xl text-[#E8DDD0] focus:ring-2 focus:ring-[#C4956A] focus:border-transparent outline-none transition-all placeholder:text-[#A89880]/50 min-h-[80px] resize-none"
                        placeholder="Наприклад: 'Класний інтер'єр, але чай не дуже...'"
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isSubmitting || !formData.instagram || !formData.city}
                        className="w-full py-3.5 bg-gradient-to-r from-[#C4956A] to-[#D4A57A] text-[#0F0B08] font-bold rounded-xl hover:shadow-[0_0_20px_rgba(196,149,106,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {isSubmitting ? (
                          <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                        ) : (
                          'Надіслати заявку'
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <div key="step2" className="text-center py-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", bounce: 0.5 }}
                    className="w-24 h-24 bg-gradient-to-br from-[#1ea24a]/20 to-[#9FD356]/20 rounded-full flex items-center justify-center mx-auto mb-6"
                  >
                    <span className="text-4xl text-[#9FD356]">✓</span>
                  </motion.div>
                  <h3 className="text-2xl font-bold text-[#E8DDD0] mb-4">Дякуємо!</h3>
                  <p className="text-[#A89880] mb-6">
                    Ми вже зв'язуємось із закладом. Ваше місто піднялось у рейтингу, а ви отримали <strong className="text-[#C4956A] font-bold">+50 бонусних балів</strong>!
                  </p>
                  <button
                    onClick={resetAndClose}
                    className="w-full py-3.5 bg-[#0F0B08] text-[#E8DDD0] border border-[#3A2E22] font-semibold rounded-xl hover:border-[#C4956A] transition-all"
                  >
                    Закрити
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
