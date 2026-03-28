"use client";
import { useRef, useState, memo } from 'react';
import { motion, useInView } from 'framer-motion';
import { UserPlus, TrendingUp, Award, Lock, Star, Zap, Target, Sparkles } from 'lucide-react';
import { trainees } from '@myth/data/comics';
import { Button } from '@myth/components/ui/button';

interface TraineeCardProps {
  trainee: typeof trainees[0];
  index: number;
}

const TraineeCard = memo(function TraineeCard({ trainee, index }: TraineeCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  const statusColors = {
    'recruit': 'bg-gray-400',
    'in-training': 'bg-[#00D9C0]',
    'graduate': 'bg-[#C9A227]'
  };
  
  const statusLabels = {
    'recruit': 'Recruit',
    'in-training': 'In Training',
    'graduate': 'Graduate'
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative group"
    >
      <motion.div
        animate={{ 
          scale: isHovered ? 1.03 : 1,
          y: isHovered ? -5 : 0 
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="relative"
      >
        <div className="relative overflow-hidden rounded-2xl bg-white border-2 border-[#1B2E1B]/10 p-6">
          {/* Status Badge */}
          <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-white text-xs font-medium ${statusColors[trainee.status]}`}>
            {statusLabels[trainee.status]}
          </div>
          
          {/* Header */}
          <div className="flex items-start gap-4 mb-4">
            <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gradient-to-br from-[#00D9C0]/20 to-[#00D9C0]/5 flex items-center justify-center">
              <UserPlus className="w-10 h-10 text-[#00D9C0]" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-[#0D0D0D]">{trainee.name}</h3>
              <p className="text-[#00D9C0] font-medium text-sm">{trainee.role}</p>
              <p className="text-[#0D0D0D]/50 text-xs mt-1">Mentor: {trainee.mentor}</p>
            </div>
          </div>
          
          {/* Specialty */}
          <div className="mb-4">
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#00D9C0]/10 text-[#00D9C0] rounded-full text-sm font-medium">
              <Star className="w-3 h-3" />
              {trainee.specialty}
            </span>
          </div>
          
          {/* Quote */}
          <p className="text-[#0D0D0D]/70 text-sm italic mb-4">
            "{trainee.quote}"
          </p>
          
          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-xs text-[#0D0D0D]/60 mb-1">
              <span>Training Progress</span>
              <span>{trainee.progress}%</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-[#00D9C0] to-[#00B4A0] rounded-full"
                initial={{ width: 0 }}
                whileInView={{ width: `${trainee.progress}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
          </div>
          
          {/* Description */}
          <p className="text-[#0D0D0D]/60 text-xs leading-relaxed">
            {trainee.description}
          </p>
        </div>
        
        {/* Glow Effect */}
        <div 
          className={`
            absolute -inset-1 rounded-2xl blur-xl transition-opacity duration-500 -z-10 bg-[#00D9C0]/20
            ${isHovered ? 'opacity-100' : 'opacity-0'}
          `}
        />
      </motion.div>
    </motion.div>
  );
});

export default function Trainees() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const [isApplicationOpen, setIsApplicationOpen] = useState(false);
  
  return (
    <section 
      id="trainees"
      ref={sectionRef}
      className="relative py-20 sm:py-32 bg-gradient-to-b from-[#F5F0E8] to-[#E8F4F0] overflow-hidden"
    >
      {/* Background Decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 right-10 w-96 h-96 bg-[#00D9C0]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-64 h-64 bg-[#C9A227]/10 rounded-full blur-3xl" />
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 bg-[#00D9C0]/10 border border-[#00D9C0]/20 rounded-full text-[#00D9C0] text-sm font-medium mb-4">
            <UserPlus className="w-4 h-4 inline mr-1" />
            Join the Team
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-[#0D0D0D] mb-4">
            BECOME A <span className="text-[#00D9C0]">MYTHBUSTER</span>
          </h2>
          <p className="text-lg text-[#0D0D0D]/60 max-w-2xl mx-auto">
            Starting Series 7, we're recruiting new heroes to join our mission. 
            Train under Mykyta and Nazar, bust your own myths, and become part of the legend.
          </p>
        </motion.div>
        
        {/* Recruitment Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16 p-8 bg-gradient-to-r from-[#00D9C0] to-[#00B4A0] rounded-2xl text-white relative overflow-hidden"
        >
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl md:text-3xl font-black mb-2">Series 7: Recruitment Open!</h3>
              <p className="text-white/80">Applications now accepted for the next generation of MythBusters</p>
            </div>
            <Button
              onClick={() => setIsApplicationOpen(true)}
              className="px-8 py-6 bg-white text-[#00D9C0] hover:bg-white/90 font-bold rounded-xl shadow-lg transition-all hover:scale-105"
            >
              <UserPlus className="w-5 h-5 mr-2" />
              Apply Now
            </Button>
          </div>
          
          {/* Decorative */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl" />
        </motion.div>
        
        {/* Current Trainees */}
        <div className="mb-12">
          <h3 className="text-xl font-bold text-[#0D0D0D] mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#00D9C0]" />
            Current Trainees
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {trainees.map((trainee, index) => (
              <TraineeCard key={trainee.id} trainee={trainee} index={index} />
            ))}
          </div>
        </div>
        
        {/* Training Path */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 p-8 bg-white rounded-2xl shadow-lg"
        >
          <h3 className="text-xl font-bold text-[#0D0D0D] mb-6 flex items-center gap-2">
            <Award className="w-5 h-5 text-[#C9A227]" />
            Training Path
          </h3>
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { step: 1, title: 'Recruit', desc: 'Apply and get accepted', icon: UserPlus, status: 'available' },
              { step: 2, title: 'Apprentice', desc: 'Learn from the masters', icon: Target, status: 'available' },
              { step: 3, title: 'MythBuster', desc: 'Bust your first myth', icon: Zap, status: 'locked' },
              { step: 4, title: 'Master', desc: 'Lead your own team', icon: Award, status: 'locked' },
            ].map((item, index) => (
              <div key={index} className={`relative p-4 rounded-xl border-2 ${item.status === 'available' ? 'border-[#00D9C0] bg-[#00D9C0]/5' : 'border-gray-200 bg-gray-50'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${item.status === 'available' ? 'bg-[#00D9C0] text-white' : 'bg-gray-300 text-white'}`}>
                    {item.status === 'locked' ? <Lock className="w-4 h-4" /> : <item.icon className="w-4 h-4" />}
                  </div>
                  <span className="font-bold text-[#0D0D0D]">{item.title}</span>
                </div>
                <p className="text-sm text-[#0D0D0D]/60">{item.desc}</p>
                {index < 3 && (
                  <div className="hidden md:block absolute -right-2 top-1/2 transform -translate-y-1/2 z-10">
                    <div className="w-4 h-4 border-t-2 border-r-2 border-[#00D9C0] transform rotate-45" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
        
        {/* Application Modal Placeholder */}
        {isApplicationOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setIsApplicationOpen(false)}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-[#00D9C0]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-[#00D9C0]" />
                </div>
                <h3 className="text-2xl font-bold text-[#0D0D0D] mb-2">Coming Soon!</h3>
                <p className="text-[#0D0D0D]/60 mb-6">Applications for Series 7 will open soon. Follow us on social media to be the first to know!</p>
                <Button 
                  onClick={() => setIsApplicationOpen(false)}
                  className="w-full bg-[#00D9C0] hover:bg-[#00B4A0] text-white"
                >
                  Got it!
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
}
