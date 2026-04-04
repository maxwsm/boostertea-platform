import { useState } from 'react';
import WebApp from '@twa-dev/sdk';

export default function AcademyDashboard({ nav }) {
  const [xp] = useState(1450); // MOCKED XP FOR NOW, will fetch from backend
  const mykytaADHD = true; 

  const handleCashOut = () => {
    WebApp.HapticFeedback.notificationOccurred('success');
    WebApp.showAlert('CASH OUT INITIATED! Ваша нагорода: 1 Вихідний. XP списано.');
  };

  return (
    <div className="acad-dash-container">
      <div className="acad-greeting">
        13WSM13 // ACADEMY MATRIX
      </div>
      
      <div className="xp-wallet">
        <span className="xp-label">DOPAMINE WALLET</span>
        <div className="xp-amount glitch-text" data-text={`${xp} XP`}>{xp} XP</div>
      </div>

      <div className="dopamine-shop">
        <h3 style={{color:'var(--neon-orange)', marginBottom: '10px'}}>DOPAMINE SHOP (Що я дозволяю собі)</h3>
        
        <div className="shop-item afford">
          <div className="shop-info">
            <strong>💆‍♂️ Похід в SPA / Релакс</strong>
            <span className="shop-cost">500 XP</span>
          </div>
          <button className="action-btn" onClick={handleCashOut}>ДІСТАТИ (CASH OUT)</button>
        </div>

        <div className="shop-item locked">
          <div className="shop-info">
            <strong>🎮 Нова гра (Steam/PS)</strong>
            <span className="shop-cost">2000 XP</span>
          </div>
          <div className="progress-bar-bg" style={{marginTop:'5px', height:'8px'}}>
            <div className="progress-bar-fill" style={{width: `${(xp/2000)*100}%`}}></div>
          </div>
          <div style={{fontSize:'0.7rem', color:'var(--text-muted)', marginTop:'3px'}}>Залишилось: {2000 - xp} XP</div>
        </div>

        <div className="shop-item locked">
          <div className="shop-info">
            <strong>🏖️ Повноцінний DAY OFF (Без зв'язку)</strong>
            <span className="shop-cost">5000 XP</span>
          </div>
          <div className="progress-bar-bg" style={{marginTop:'5px', height:'8px'}}>
            <div className="progress-bar-fill" style={{width: `${(xp/5000)*100}%`}}></div>
          </div>
        </div>
      </div>

      <div className="acad-quick-links">
        <div className="ql-card stoic-card" onClick={() => nav('stoic')}>
          <h3>🏛️ STOICISM</h3>
          <p>Повернути контроль над емоціями.</p>
        </div>
        <div className="ql-card flow-card" onClick={() => nav('meditate')}>
          <h3>🧘 FLOW</h3>
          <p>Вимкнути Time Blindness. Фокус.</p>
        </div>
      </div>
    </div>
  );
}
