import { useState, useEffect } from 'react';
import WebApp from '@twa-dev/sdk';

export default function AcademyDashboard({ nav }) {
  const [xp, setXp] = useState(0);
  const [loading, setLoading] = useState(true);

  const userId = WebApp.initDataUnsafe?.user?.id || '8009046558';
  const BACKEND_URL = import.meta.env.VITE_API_URL || '';

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/twa/dashboard?userId=${userId}`)
      .then(r => r.json())
      .then(data => {
        setXp(data.xp || 0);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [userId, BACKEND_URL]);

  const handleCashOut = async (item, cost) => {
    if (xp < cost) {
      try { WebApp.showAlert('Недостатньо XP для цієї операції.'); } catch(e){}
      return;
    }
    try { WebApp.HapticFeedback.impactOccurred('medium'); } catch(e){}
    try {
      const res = await fetch(`${BACKEND_URL}/api/twa/dopamine/cashout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, item, cost })
      });
      const data = await res.json();
      if (data.success) {
        setXp(data.newXP);
        try { WebApp.showAlert(`УСПІХ! ${item} придбано. Витрачено ${cost} XP.`); } catch(e){}
      } else {
        try { WebApp.showAlert(`Помилка: ${data.error}`); } catch(e){}
      }
    } catch(e) {
      console.error(e);
    }
  };

  if (loading) return <div style={{textAlign: 'center', marginTop: '20px'}}>SYNCING DOPAMINE DB...</div>;

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
        
        <div className={`shop-item ${xp >= 500 ? 'afford' : 'locked'}`}>
          <div className="shop-info">
            <strong>💆‍♂️ Похід в SPA / Релакс</strong>
            <span className="shop-cost">500 XP</span>
          </div>
          {xp >= 500 ? (
            <button className="action-btn" onClick={() => handleCashOut('SPA / Релакс', 500)}>ДІСТАТИ (CASH OUT)</button>
          ) : (
            <>
              <div className="progress-bar-bg" style={{marginTop:'5px', height:'8px'}}>
                <div className="progress-bar-fill" style={{width: `${Math.min((xp/500)*100, 100)}%`}}></div>
              </div>
              <div style={{fontSize:'0.7rem', color:'var(--text-muted)', marginTop:'3px'}}>Залишилось: {500 - xp} XP</div>
            </>
          )}
        </div>

        <div className={`shop-item ${xp >= 2000 ? 'afford' : 'locked'}`}>
          <div className="shop-info">
            <strong>🎮 Нова гра (Steam/PS)</strong>
            <span className="shop-cost">2000 XP</span>
          </div>
          {xp >= 2000 ? (
            <button className="action-btn" onClick={() => handleCashOut('Нова гра (Steam/PS)', 2000)}>ДІСТАТИ (CASH OUT)</button>
          ) : (
            <>
              <div className="progress-bar-bg" style={{marginTop:'5px', height:'8px'}}>
                <div className="progress-bar-fill" style={{width: `${Math.min((xp/2000)*100, 100)}%`}}></div>
              </div>
              <div style={{fontSize:'0.7rem', color:'var(--text-muted)', marginTop:'3px'}}>Залишилось: {2000 - xp} XP</div>
            </>
          )}
        </div>

        <div className={`shop-item ${xp >= 5000 ? 'afford' : 'locked'}`}>
          <div className="shop-info">
            <strong>🏖️ Повноцінний DAY OFF (Без зв'язку)</strong>
            <span className="shop-cost">5000 XP</span>
          </div>
          {xp >= 5000 ? (
            <button className="action-btn" onClick={() => handleCashOut('Повноцінний DAY OFF', 5000)}>ДІСТАТИ (CASH OUT)</button>
          ) : (
            <>
              <div className="progress-bar-bg" style={{marginTop:'5px', height:'8px'}}>
                <div className="progress-bar-fill" style={{width: `${Math.min((xp/5000)*100, 100)}%`}}></div>
              </div>
              <div style={{fontSize:'0.7rem', color:'var(--text-muted)', marginTop:'3px'}}>Залишилось: {5000 - xp} XP</div>
            </>
          )}
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
