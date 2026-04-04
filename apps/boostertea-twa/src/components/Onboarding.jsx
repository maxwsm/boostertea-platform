import { useState, useEffect } from 'react';
import WebApp from '@twa-dev/sdk';
import '../index.css';

// SVG Icons copied from Router for display
const Crosshair = () => <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="22" y1="12" x2="18" y2="12"/><line x1="6" y1="12" x2="2" y2="12"/><line x1="12" y1="6" x2="12" y2="2"/><line x1="12" y1="22" x2="12" y2="18"/></svg>;
const BookOpen = () => <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>;
const ValeraIcon = () => <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" y1="16" x2="8" y2="16"/><line x1="16" y1="16" x2="16" y2="16"/></svg>;
const Users = () => <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const Shield = () => <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;

const STEPS = [
  {
    title: "[ MISSION CONTROL ]",
    icon: <Crosshair />,
    text: "Твій головний екран. Тут індексуються щоденні бойові задачі. Політика проста: виконуєш -> тиснеш галочку -> отримуєш XP та авторитет в команді. Жодної мультизадачності."
  },
  {
    title: "[ SKILL ACADEMY ]",
    icon: <BookOpen />,
    text: "База знань та ментальна дефрагментація. Регламенти BoosterTea, інструкції, а також кімната медитації (Box Breathing). Коли зловив блок — йди сюди."
  },
  {
    title: "[ ВАЛЄРА 🧠 ]",
    icon: <ValeraIcon />,
    text: "Прямий конект з нейро-мозком системи. Валєра жорсткий, але завжди дасть оптимальне рішення. Якщо Google падає — активується його офлайн автономний драйвер."
  },
  {
    title: "[ CAPITAL SYNDICATE ]",
    icon: <Users />,
    text: "Твоя зброя для залучення капіталу. Тут лежить фінансова філософія, калькулятори позик та готові пакети послуг. Використовуй свій соц-капітал, закривай угоди і отримуй відсоток."
  },
  {
    title: "[ COMMAND POST ]",
    icon: <Shield />,
    text: "Адмінський щит. Тут відслідковується прогрес всього екіпажу, лутаються звіти і видаються жорсткі пенальті за прокрастинацію. Доступ тільки для офіцерського складу."
  }
];

export default function Onboarding({ onComplete }) {
  const [step, setStep] = useState(0);

  const handleNext = () => {
    try { WebApp.HapticFeedback.impactOccurred('light'); } catch(e) {}
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      localStorage.setItem('wsm_onboarded_v2', 'true'); // Using _v2 to force it for existing users once
      onComplete();
    }
  };

  return (
    <div className="onboarding-overlay">
      <div className="onboarding-card fade-in">
        <div className="onboarding-step-counter">
          {step + 1} / {STEPS.length}
        </div>
        
        <div className="onboarding-icon glitch-text" style={{ color: 'var(--neon-blue)', marginBottom: '20px' }}>
          {STEPS[step].icon}
        </div>
        
        <h2 className="neon-text" style={{ fontSize: '1.4rem', marginBottom: '15px' }}>
          {STEPS[step].title}
        </h2>
        
        <p style={{ color: '#8b9bb4', lineHeight: '1.6', fontSize: '1rem', minHeight: '100px' }}>
          {STEPS[step].text}
        </p>
        
        <div className="onboarding-dots">
          {STEPS.map((_, i) => (
            <span key={i} className={`onboarding-dot ${i === step ? 'active' : ''}`}></span>
          ))}
        </div>

        <button className="cyber-button" onClick={handleNext} style={{ width: '100%', marginTop: '20px' }}>
          {step === STEPS.length - 1 ? '[ ПОЧАТИ МІСІЮ ]' : 'ДАЛІ >'}
        </button>
      </div>
    </div>
  );
}
