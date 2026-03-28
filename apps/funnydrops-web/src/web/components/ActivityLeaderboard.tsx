import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CafeNominationModal } from './CafeNominationModal';

export function ActivityLeaderboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [leaderboard, setLeaderboard] = useState([
    { city: 'Київ', requests: 1450 },
    { city: 'Львів', requests: 980 },
    { city: 'Дніпро', requests: 420 },
    { city: 'Одеса', requests: 315 },
    { city: 'Харків', requests: 180 },
  ]);

  const loadLeaderboard = () => {
    const localNominations = JSON.parse(localStorage.getItem('bt_nominations') || '[]');
    
    // Create base leaderboard map
    const baseBoard = {
      'Київ': 1450,
      'Львів': 980,
      'Дніпро': 420,
      'Одеса': 315,
      'Харків': 180,
    };

    const counts: Record<string, number> = { ...baseBoard };
    
    localNominations.forEach((n: any) => {
      // Find case insensitive match or add new
      const key = Object.keys(counts).find(k => k.toLowerCase() === n.city.toLowerCase());
      if (key) {
        counts[key] += 1;
      } else {
        counts[n.city] = 1;
      }
    });

    const sortedArray = Object.entries(counts)
      .map(([city, requests]) => ({ city, requests }))
      .sort((a, b) => b.requests - a.requests)
      .slice(0, 5); // Keep top 5

    setLeaderboard(sortedArray);
  };

  useEffect(() => {
    loadLeaderboard();
  }, []);

  return (
    <div className="relative">
      <div className="flex flex-col md:flex-row gap-8 lg:gap-16 items-center">
        {/* Left info */}
        <div className="flex-1 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C4956A]/10 border border-[#C4956A]/20 mb-6">
            <span className="text-xl">🚀</span>
            <span className="text-xs font-semibold text-[#C4956A] uppercase tracking-wider">Приведи нас у своє місто</span>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#E8DDD0] mb-6 leading-tight" style={{ fontFamily: '"Playfair Display", serif' }}>
            Хочеш BoosterTea <br/>
            у своїй <span className="text-[#C4956A]">улюбленій кав'ярні</span>?
          </h2>

          <p className="text-[#A89880] text-lg mb-8 leading-relaxed max-w-xl mx-auto md:mx-0">
            Залишай заявку, і ми самі домовимось з закладом. За кожну корисну рекомендацію ти отримаєш бонусні бали у своєму кабінеті. Разом ми покриємо всю Україну!
          </p>

          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-8 py-4 bg-gradient-to-r from-[#C4956A] to-[#D4A57A] text-[#0F0B08] font-bold rounded-xl hover:shadow-[0_0_20px_rgba(196,149,106,0.3)] transition-all transform hover:-translate-y-1 w-full sm:w-auto text-lg"
          >
            Номінувати кав'ярню
          </button>
        </div>

        {/* Right Leaderboard Card */}
        <div className="flex-1 w-full max-w-md">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-[#1A1410] border border-[#3A2E22] rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl"
          >
            {/* background blur */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-[var(--accent)]/10 blur-[80px]" />
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-[#E8DDD0]">Топ активних міст</h3>
                <span className="text-2xl">🏆</span>
              </div>

              <div className="space-y-4 relative">
                {leaderboard.map((item, index) => (
                  <motion.div 
                    layout
                    key={item.city}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-4 bg-[#0F0B08] p-3 pl-4 rounded-xl border border-[#3A2E22] group hover:border-[#C4956A]/50 transition-colors"
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm bg-[#1A1410] border ${index === 0 ? 'border-[#FFD700] text-[#FFD700]' : index === 1 ? 'border-[#C0C0C0] text-[#C0C0C0]' : index === 2 ? 'border-[#CD7F32] text-[#CD7F32]' : 'border-[#3A2E22] text-[#A89880]'}`}>
                      #{index + 1}
                    </div>
                    
                    <div className="flex-1">
                      <p className="text-[#E8DDD0] font-medium">{item.city}</p>
                    </div>

                    <div className="flex items-center gap-1.5 px-3 py-1 bg-[#1A1410] rounded-lg">
                      <span className="text-[#C4956A] font-bold">{item.requests}</span>
                      <span className="text-[#A89880] text-xs">заявок</span>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-[#3A2E22] text-center">
                <p className="text-[#A89880] text-sm">Твоє місто може стати першим!</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      <CafeNominationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={loadLeaderboard} 
      />
    </div>
  );
}
