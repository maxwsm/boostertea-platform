import { useState, useEffect } from 'react';
import WebApp from '@twa-dev/sdk';

export default function MeditationRoom() {
  const [breathing, setBreathing] = useState(false);
  const [phase, setPhase] = useState('ІНГАЛЯЦІЯ (4с)'); // Inhale, Hold, Exhale, Hold
  
  useEffect(() => {
    let interval;
    if (breathing) {
      let step = 0;
      const phases = ['ІНГАЛЯЦІЯ (4с)', 'ЗАТРИМКА (4с)', 'ЕКСГАЛЯЦІЯ (4с)', 'ЗАТРИМКА (4с)'];
      
      try { WebApp.HapticFeedback.notificationOccurred('success'); } catch(e) {}
      
      interval = setInterval(() => {
        step = (step + 1) % 4;
        setPhase(phases[step]);
        if(step === 0 || step === 2) {
          try { WebApp.HapticFeedback.impactOccurred('heavy'); } catch(e) {}
        } else {
          try { WebApp.HapticFeedback.impactOccurred('light'); } catch(e) {}
        }
      }, 4000); // 4 seconds per phase
    } else {
      setPhase('ОЧІКУВАННЯ');
    }
    return () => clearInterval(interval);
  }, [breathing]);

  return (
    <div className="meditation-container">
      <div className="med-header">
        <h2 className="glitch-text" data-text="BOX BREATHING">BOX BREATHING</h2>
        <p>13WSM13 Protocol: Скидання білого шуму. 4x4x4x4.</p>
      </div>

      <div className="breathing-circle-wrapper">
        <div className={`breathing-circle ${breathing ? 'active' : ''}`}>
          <div className="phase-text">{phase}</div>
        </div>
      </div>

      <button className={`action-btn ${breathing ? 'orange' : ''}`} onClick={() => setBreathing(!breathing)}>
        {breathing ? 'ЗУПИНИТИ (ABORT)' : 'ІНІЦІЮВАТИ ФОКУС'}
      </button>

      <div className="ADHD-disclaimer" style={{marginTop:'30px', fontSize:'0.85rem', color:'var(--text-muted)'}}>
        <strong>Чому це працює для СДУГ?</strong><br/>
        Гіперфокус часто супроводжується затримкою дихання або поверхневим диханням, що підвищує кортизол. Ця техніка (Navy SEALs) скидає стресову реакцію та повертає Executive Functions за 1 хвилину.
      </div>
    </div>
  );
}
