import { useState } from 'react';
import WebApp from '@twa-dev/sdk';

export default function NeuralNomadTour({ onComplete }) {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: "SYSTEM OVERVIEW",
      content: "Вітаю, архітекторе (Андрію).\nЦя екосистема (13WSMEI) побудована на фундаменті твоїх знань Neural Nomad. Я проведу для тебе архітектурний Tour, щоб показати, як ми автоматизували та гейміфікували кожен процес.",
      icon: "🌐"
    },
    {
      title: "1. COMMAND & BOTS",
      content: "Логіка управління командою (Taras, Nazar, Mykyta) переведена в '3+2 спринти' (14 днів). Щоб виключити мікроменеджмент, бот щодня автоматично розсилає 3 первинні та 2 крос-задачі, контролює статус та карає XP-штрафами за провал дедлайнів.",
      icon: "🤖"
    },
    {
      title: "2. ЗНАННЯ (ОФЛАЙН)",
      content: "Ми відмовились від нестабільних запитів до Gemini для тестування. Натомість створено Global Skill Tree (Офлайн Термінал). Всі навички доступні одразу. Кожен клік ініціює 'хардкодний' Quiz, що математично рахує рівень (Goal: 80+ LVL).",
      icon: "🌳"
    },
    {
      title: "3. DOPAMINE SHOP",
      content: "У магазині 'Дофаміну' юзери можуть обмінювати зароблені XP на Day Off або Spa. Також ми зашили 'Пасхалку': якщо людина робить 5+ додаткових задач за день, їй прилітає 1000 бонусних XP, а керівникам іде ALARM про премію.",
      icon: "🛒"
    },
    {
      title: "4. SYNDICATE BLOCK",
      content: "Розроблено фінансовий фреймворк для B2B продажу. Є вбудований калькулятор інвестицій та інтерактивний модуль 'БАР'ЄРИ', де розбираються топові страхи клієнтів/інвесторів.\n\nТвій профіль налаштовано як Super-Admin. Welcome.",
      icon: "⚖️"
    }
  ];

  const handleNext = () => {
    try { WebApp.HapticFeedback.selectionChanged(); } catch(e){}
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      localStorage.setItem('andryuha_tour_seen', 'true');
      onComplete();
    }
  };

  const handleSkip = () => {
    try { WebApp.HapticFeedback.impactOccurred('medium'); } catch(e){}
    localStorage.setItem('andryuha_tour_seen', 'true');
    onComplete();
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(5, 5, 5, 0.95)', zIndex: 9999,
      display: 'flex', flexDirection: 'column',
      padding: '20px', color: '#fff', fontFamily: "'Courier New', Courier, monospace"
    }}>
      <div style={{
        marginTop: '10vh', flex: 1, 
        border: '1px solid var(--neon-green)', 
        borderRadius: '8px', padding: '20px',
        boxShadow: '0 0 20px rgba(57, 255, 20, 0.1) inset',
        display: 'flex', flexDirection: 'column', alignItems: 'center'
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '20px' }}>{steps[step].icon}</div>
        <h2 style={{ 
          color: 'var(--neon-green)', 
          textShadow: '0 0 10px rgba(57,255,20,0.5)',
          marginBottom: '20px', textAlign: 'center' 
        }}>
          {'>'} {steps[step].title}_
        </h2>
        
        <p style={{ 
          color: '#ccc', lineHeight: '1.6', fontSize: '1rem', 
          textAlign: 'justify', whiteSpace: 'pre-wrap'
        }}>
          {steps[step].content}
        </p>

        <div style={{ marginTop: 'auto', width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
            <span style={{color: '#555'}}>{step + 1} / {steps.length}</span>
            <span style={{color: 'var(--neon-green)'}}>SYSTEM.EXEC()</span>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              onClick={handleNext}
              style={{
                flex: 1, padding: '15px', background: 'rgba(57,255,20,0.1)',
                border: '1px solid var(--neon-green)', color: 'var(--neon-green)',
                fontWeight: 'bold', borderRadius: '4px', cursor: 'pointer',
                boxShadow: '0 0 10px rgba(57,255,20,0.2)'
              }}
            >
              {step < steps.length - 1 ? 'ПРОДОВЖИТИ (NEXT)' : 'ЗАВЕРШИТИ РЕВІЗІЮ'}
            </button>
          </div>
          <button onClick={handleSkip} style={{ background: 'none', border: 'none', color: '#555', marginTop: '15px', width: '100%', fontSize: '0.8rem', cursor: 'pointer' }}>
            [ SKIP TOUR ]
          </button>
        </div>
      </div>
    </div>
  );
}
