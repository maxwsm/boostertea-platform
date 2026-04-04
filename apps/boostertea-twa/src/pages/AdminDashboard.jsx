import { useState, useEffect } from 'react';
import WebApp from '@twa-dev/sdk';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Manual XP XP
  const [targetId, setTargetId] = useState('');
  const [xpAmount, setXpAmount] = useState(50);
  const [xpReason, setXpReason] = useState('');

  const rawUserId = WebApp.initDataUnsafe?.user?.id;
  const userId = rawUserId ? rawUserId.toString() : '8374356466';

  const loadData = () => {
    fetch(`/api/twa/admin/overview?userId=${userId}`)
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  const forgivePenalty = (id) => {
    if (!confirm('Амністувати штраф і повернути XP?')) return;
    fetch(`/api/twa/admin/penalties/${id}/forgive`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    }).then(res => res.json()).then(r => {
      if(r.success) loadData();
    });
  };

  const grantXP = () => {
    if(!targetId || !xpAmount) return;
    fetch('/api/twa/admin/xp/grant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, targetId, amount: Number(xpAmount), reason: xpReason })
    }).then(res => res.json()).then(r => {
      if(r.success) {
        setTargetId(''); setXpAmount(50); setXpReason('');
        loadData();
        WebApp.HapticFeedback.notificationOccurred('success');
      }
    });
  };

  if (loading) return <div className="loading-state glitch-text" data-text="ACCESS_SYSTEM...">ACCESS_SYSTEM...</div>;

  return (
    <div className="admin-container fade-in">
      {/* ─── LEADERBOARD (Available to everyone) ─── */}
      <h2 className="section-title">
        <span className="dot blue"></span> ТАБЛИЦЯ ЛІДЕРІВ (ДЕНЬ {data.day})
      </h2>
      <div className="leaderboard">
        {data.leaderboard.map((u, i) => (
          <div key={u.id} className="leaderboard-card">
            <div className="lb-rank">#{i + 1}</div>
            <div className="lb-info">
              <div className="lb-name">{u.name} <span className="lb-streak">🔥{u.streak}</span></div>
              <div className="lb-stats">LVL {u.level} • {u.xp} XP</div>
            </div>
          </div>
        ))}
      </div>

      {/* ─── ADMIN DETAILED CONTROLS ─── */}
      {data.isAdmin && (
        <div className="admin-zone">
          <div className="warning-banner">
            <span className="alert-icon">⚠️</span>
            COMMAND POST: ТІЛЬКИ ДЛЯ ШЕФІВ
          </div>

          <h3>ОПЕРАТИВНА ОБСТАНОВКА (КРОС-ЗАДАЧІ)</h3>
          <div className="assignments-matrix">
            {data.assignments?.length === 0 ? <p className="muted">Призначень немає.</p> : (
              data.assignments.map(a => (
                <div key={a.id} className={`assign-row ${a.done ? 'done' : 'pending'}`}>
                  <div className="assign-path">[{a.from}] &rarr; [{a.to}]</div>
                  <div className="assign-text">{a.text}</div>
                  <div className="assign-status">{a.done ? '✅' : '⏳'}</div>
                </div>
              ))
            )}
          </div>

          <h3 style={{color: 'var(--alert-red)', marginTop:'30px'}}>🔴 АКТИВНІ ШТРАФИ (PENALTIES)</h3>
          <div className="penalties-list">
            {data.openPenalties?.length === 0 ? <p className="muted">Всі чисті.</p> : (
              data.openPenalties.map(p => (
                <div key={p.id} className="penalty-card">
                  <div><strong>{p.userName}</strong>: {p.desc}</div>
                  <div className="penalty-xp">-{p.xpPenalty} XP</div>
                  <button className="amnesty-btn" onClick={() => forgivePenalty(p.id)}>AMNESTY</button>
                </div>
              ))
            )}
          </div>

          <h3 style={{marginTop:'30px'}}>⚡ MANUAL XP INJECTOR</h3>
          <div className="xp-injector">
            <select value={targetId} onChange={e => setTargetId(e.target.value)} className="form-input">
              <option value="">Оберіть бійця...</option>
              {data.leaderboard.map(u => <option key={u.id} value={u.id}>{u.name} (LVL {u.level})</option>)}
            </select>
            <input type="number" className="form-input" value={xpAmount} onChange={e => setXpAmount(e.target.value)} placeholder="Кількість XP" />
            <input type="text" className="form-input" value={xpReason} onChange={e => setXpReason(e.target.value)} placeholder="Причина (опціонально)" />
            <button className="grant-btn" onClick={grantXP} disabled={!targetId}>ДОКИНУТИ XP</button>
          </div>
        </div>
      )}
    </div>
  );
}
