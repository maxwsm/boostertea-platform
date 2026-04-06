import { useState, useEffect } from 'react';
import WebApp from '@twa-dev/sdk';

export default function AcademyDashboard({ nav }) {
  const [xp, setXp] = useState(0);
  const [loading, setLoading] = useState(true);
  const [skills, setSkills] = useState([]);
  const [resources, setResources] = useState([]);

  // Калькулятор ROI
  const [adSpend, setAdSpend] = useState('');
  const [revenue, setRevenue] = useState('');

  const userId = WebApp.initDataUnsafe?.user?.id || '8009046558';
  const BACKEND_URL = import.meta.env.VITE_API_URL || '';

  useEffect(() => {
    Promise.all([
      fetch(`${BACKEND_URL}/api/twa/dashboard?userId=${userId}`).then(r => r.json()),
      fetch(`${BACKEND_URL}/api/twa/skills/my?userId=${userId}`).then(r => r.json()),
      fetch(`${BACKEND_URL}/api/twa/resources?userId=${userId}`).then(r => r.json()),
    ])
      .then(([dash, sk, res]) => {
        setXp(dash.xp || 0);
        setSkills(sk || []);
        setResources(res || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [userId, BACKEND_URL]);

  const handleCashOut = async (item, cost) => {
    if (xp < cost) {
      try { WebApp.showAlert('Недостатньо XP.'); } catch(e){}
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
        try { WebApp.showAlert(`${item} придбано. -${cost} XP.`); } catch(e){}
      } else {
        try { WebApp.showAlert(`Помилка: ${data.error}`); } catch(e){}
      }
    } catch(e) { console.error(e); }
  };

  if (loading) return <div style={{textAlign: 'center', marginTop: '20px'}}>Завантаження даних...</div>;

  // Обчислення прогресу навчання
  const totalRes = resources.length;
  const doneRes = resources.filter(r => r.status === 'done').length;
  const resPct = totalRes > 0 ? Math.round((doneRes / totalRes) * 100) : 0;

  const testedSkills = skills.filter(s => s.currentLevel > 0).length;
  const totalSkills = skills.length || 1;
  const skillPct = Math.round((testedSkills / totalSkills) * 100);

  // Калькулятор
  const roiVal = adSpend && revenue ? Math.round(((revenue - adSpend) / adSpend) * 100) : null;
  const roasVal = adSpend && revenue ? (revenue / adSpend).toFixed(1) : null;

  return (
    <div className="acad-dash-container">
      <div className="acad-greeting">ВІТАЮ В АКАДЕМІЇ</div>
      
      {/* XP Wallet */}
      <div className="xp-wallet">
        <span className="xp-label">ГАМАНЕЦЬ XP</span>
        <div className="xp-amount glitch-text" data-text={`${xp} XP`}>{xp} XP</div>
      </div>

      {/* Прогрес навчання */}
      <div style={{marginBottom: '25px'}}>
        <div className="section-title" style={{marginBottom: '12px'}}><span className="dot blue"></span> ПРОГРЕС НАВЧАННЯ</div>
        
        <div style={{background: 'var(--bg-card)', border: '1px solid var(--border-dark)', padding: '15px', marginBottom: '10px'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px'}}>
            <span>Навчальні модулі</span>
            <span style={{color: 'var(--neon-green)'}}>{doneRes}/{totalRes}</span>
          </div>
          <div className="progress-bar-bg" style={{height: '10px'}}>
            <div className="progress-bar-fill" style={{width: `${resPct}%`}}></div>
          </div>
          <div style={{fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px'}}>Пройдено {resPct}% матеріалів</div>
        </div>
        
        <div style={{background: 'var(--bg-card)', border: '1px solid var(--border-dark)', padding: '15px'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px'}}>
            <span>Тести пройдено</span>
            <span style={{color: 'var(--neon-blue)'}}>{testedSkills}/{skills.length || 0}</span>
          </div>
          <div className="progress-bar-bg" style={{height: '10px'}}>
            <div className="progress-bar-fill" style={{width: `${skillPct}%`, background: 'var(--neon-blue)'}}></div>
          </div>
          <div style={{fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px'}}>
            {skillPct >= 100 ? 'Всі тести пройдені!' : `Пройди тести в SKILL MAP`}
          </div>
        </div>
      </div>

      {/* Калькулятор ROI */}
      <div style={{marginBottom: '25px'}}>
        <div className="section-title" style={{marginBottom: '12px'}}><span className="dot orange"></span> КАЛЬКУЛЯТОР ROI</div>
        <div style={{background: 'var(--bg-card)', border: '1px solid var(--border-dark)', padding: '15px'}}>
          <div style={{display: 'flex', gap: '10px', marginBottom: '10px'}}>
            <div style={{flex: 1}}>
              <label style={{fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px'}}>Витрати на рекламу (€)</label>
              <input 
                type="number" placeholder="500" value={adSpend} onChange={e => setAdSpend(e.target.value)}
                style={{width: '100%', background: '#111', border: '1px solid #333', color: '#fff', padding: '10px', fontFamily: 'inherit', fontSize: '1rem'}}
              />
            </div>
            <div style={{flex: 1}}>
              <label style={{fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px'}}>Дохід (€)</label>
              <input 
                type="number" placeholder="2000" value={revenue} onChange={e => setRevenue(e.target.value)}
                style={{width: '100%', background: '#111', border: '1px solid #333', color: '#fff', padding: '10px', fontFamily: 'inherit', fontSize: '1rem'}}
              />
            </div>
          </div>
          {roiVal !== null && (
            <div style={{display: 'flex', gap: '10px', marginTop: '10px'}}>
              <div style={{flex: 1, background: roiVal >= 0 ? 'rgba(57,255,20,0.1)' : 'rgba(255,42,42,0.1)', border: `1px solid ${roiVal >= 0 ? 'var(--neon-green)' : 'var(--neon-red)'}`, padding: '12px', textAlign: 'center'}}>
                <div style={{fontSize: '0.7rem', color: 'var(--text-muted)'}}>ROI</div>
                <div style={{fontSize: '1.5rem', fontWeight: 'bold', color: roiVal >= 0 ? 'var(--neon-green)' : 'var(--neon-red)'}}>{roiVal}%</div>
              </div>
              <div style={{flex: 1, background: 'rgba(0,204,255,0.1)', border: '1px solid var(--neon-blue)', padding: '12px', textAlign: 'center'}}>
                <div style={{fontSize: '0.7rem', color: 'var(--text-muted)'}}>ROAS</div>
                <div style={{fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--neon-blue)'}}>{roasVal}x</div>
              </div>
            </div>
          )}
          <div style={{fontSize: '0.65rem', color: '#555', marginTop: '8px'}}>
            ROI = (Дохід - Витрати) / Витрати × 100%. ROAS = Дохід / Витрати.
          </div>
        </div>
      </div>

      {/* Dopamine Shop */}
      <div className="dopamine-shop">
        <h3 style={{color:'var(--neon-orange)', marginBottom: '10px'}}>МАГАЗИН НАГОРОД</h3>
        
        {[
          { name: '💆‍♂️ SPA / Релакс', cost: 500 },
          { name: '🎮 Нова гра (Steam/PS)', cost: 2000 },
          { name: '🏖️ DAY OFF (Без зв\'язку)', cost: 5000 },
        ].map(item => (
          <div key={item.name} className={`shop-item ${xp >= item.cost ? 'afford' : 'locked'}`}>
            <div className="shop-info">
              <strong>{item.name}</strong>
              <span className="shop-cost">{item.cost} XP</span>
            </div>
            {xp >= item.cost ? (
              <button className="action-btn" onClick={() => handleCashOut(item.name, item.cost)}>ЗАБРАТИ</button>
            ) : (
              <>
                <div className="progress-bar-bg" style={{marginTop:'5px', height:'8px'}}>
                  <div className="progress-bar-fill" style={{width: `${Math.min((xp/item.cost)*100, 100)}%`}}></div>
                </div>
                <div style={{fontSize:'0.7rem', color:'var(--text-muted)', marginTop:'3px'}}>Ще {item.cost - xp} XP</div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Quick Links */}
      <div className="acad-quick-links">
        <div className="ql-card stoic-card" onClick={() => nav('stoic')}>
          <h3>🏛️ СТОЇЦИЗМ</h3>
          <p>Контроль емоцій.</p>
        </div>
        <div className="ql-card flow-card" onClick={() => nav('meditate')}>
          <h3>🧘 ФОКУС</h3>
          <p>Дихання і концентрація.</p>
        </div>
      </div>
    </div>
  );
}
