import { useState, useEffect } from 'react';
import WebApp from '@twa-dev/sdk';
import { AI_SCENARIOS } from './ai_scenarios';
import './index.css';

const getRank = (level) => {
  if (level < 2) return "Сплячий Гусь 🦆";
  if (level < 5) return "Стажер-Барига 💼";
  if (level < 10) return "Оперативник 🕵️";
  return "БАТЯ КЕШУ 🤑";
};

const getContextQuote = (level) => {
  let categories = level < 2 ? ["procrastination", "boss_lazy"] : 
                   level < 5 ? ["marketing", "mixology", "engineering"] : 
                   ["success", "boss_finance"];
  
  const filtered = AI_SCENARIOS.filter(s => categories.includes(s.category));
  const random = filtered[Math.floor(Math.random() * filtered.length)];
  return random ? random.text : AI_SCENARIOS[0].text;
};

function useCountUp(endValue, duration = 1000) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * endValue));
      if (progress < 1) window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
  }, [endValue, duration]);

  return count;
}

// Icons (Inline SVG to avoid lucide-react dependency)
const CheckCircle = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;
const Circle = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/></svg>;
const Target = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>;
const UserPlus = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M19 8v6"/><path d="M22 11h-6"/></svg>;
const Zap = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>;

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [glitchTask, setGlitchTask] = useState(null);
  const [activeTab, setActiveTab] = useState('tasks'); // 'tasks' | 'assign'

  // Form states for assignment
  const [assignTarget, setAssignTarget] = useState('mykyta');
  const [assignText, setAssignText] = useState('');
  const [assignLoading, setAssignLoading] = useState(false);

  useEffect(() => {
    const userId = WebApp.initDataUnsafe?.user?.id || '8009046558'; 
    try { WebApp.expand(); WebApp.setHeaderColor('#0a0a0c'); } catch(e) {}
    
    // В v2.0 сервер на тому ж порту 3005 що і бот
    const BACKEND_URL = import.meta.env.VITE_API_URL || '';

    fetch(`${BACKEND_URL}/api/twa/dashboard?userId=${userId}`, {
      headers: { 'Bypass-Tunnel-Reminder': 'true' }
    })
      .then(res => res.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(err => { console.error(err); setLoading(false); });
  }, []);

  const claimCut = data?.xp || 0; // В v2.0 трекаємо XP
  const animatedXP = useCountUp(claimCut, 1500);

  const handleClaim = async (taskId, isAssigned = false) => {
    try { WebApp.HapticFeedback.impactOccurred('heavy'); } catch(e) {}
    setGlitchTask(taskId);

    const userId = WebApp.initDataUnsafe?.user?.id || '8009046558';
    const BACKEND_URL = import.meta.env.VITE_API_URL || '';

    try {
      const res = await fetch(`${BACKEND_URL}/api/twa/done`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Bypass-Tunnel-Reminder': 'true' },
        body: JSON.stringify({ userId, taskId })
      });
      const result = await res.json();
      
      setTimeout(() => {
        setGlitchTask(null);
        setData(prev => {
          if(!prev) return prev;
          let newMy = prev.myTasks;
          let newAssigned = prev.assignedTasks;
          if (isAssigned) {
            newAssigned = prev.assignedTasks.map(t => t.id === taskId ? { ...t, done: true } : t);
          } else {
            newMy = prev.myTasks.map(t => t.id === taskId ? { ...t, done: true } : t);
          }
          return { ...prev, myTasks: newMy, assignedTasks: newAssigned, xp: result.xp, level: result.level };
        });
        
        try {
          if (result.leveledUp) {
            WebApp.showPopup({ title: "LEVEL UP! 🌟", message: `Ти досягнув Рівня ${result.level}!` });
            WebApp.HapticFeedback.notificationOccurred('success');
          }
        } catch(e) {}
      }, 600);
    } catch(err) {
      setGlitchTask(null);
      try { WebApp.showAlert("SYSTEM ERROR: Відсутній зв'язок з сервером"); } catch(e) {}
    }
  };

  const handleAssignSubmit = async (e) => {
    e.preventDefault();
    if (!assignText.trim()) return;
    
    setAssignLoading(true);
    const userId = WebApp.initDataUnsafe?.user?.id || '8009046558';
    const BACKEND_URL = import.meta.env.VITE_API_URL || '';

    try {
      await fetch(`${BACKEND_URL}/api/twa/assign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Bypass-Tunnel-Reminder': 'true' },
        body: JSON.stringify({ userId, targetRole: assignTarget, text: assignText })
      });
      
      try { WebApp.HapticFeedback.notificationOccurred('success'); WebApp.showAlert("Задачу призначено! +5 XP"); } catch(e) { alert("Задачу призначено! +5 XP"); }
      setAssignText('');
      
      // Update local XP optimistic
      setData(prev => ({...prev, xp: prev.xp + 5}));
    } catch(err) {
      try { WebApp.showAlert("ERROR"); } catch(e) {}
    } finally {
      setAssignLoading(false);
    }
  };

  if (loading) return <div className="loading-screen"><div>[ INITIATING CORE... ]</div></div>;
  if (data?.error) return <div className="twa-container"><h3>[ ERROR: {data.error} ]</h3></div>;
  if (!data) return <div className="twa-container"><h3 style={{color: 'var(--neon-red)'}}>[ FATAL ERROR: CONNECTION LOST ]</h3></div>;

  const quote = getContextQuote(data.level);
  
  // Progress bar calculations
  const totalMy = data.myTasks?.length || 0;
  const doneMy = data.myTasks?.filter(t => t.done).length || 0;
  const totalAssigned = data.assignedTasks?.length || 0;
  const doneAssigned = data.assignedTasks?.filter(t => t.done).length || 0;
  
  const allTasksCount = totalMy + totalAssigned;
  const allDoneCount = doneMy + doneAssigned;
  const isPerfect = allTasksCount > 0 && allTasksCount === allDoneCount;

  return (
    <>
      <div className="twa-container">
        {/* HEADER */}
        <header className="twa-header">
          <img src="/avatar.png" alt="Avatar" className="cyber-avatar" />
          <div className="header-info">
            <div className="header-top">
              <div className="role-badge">{data.role}</div>
              <div className="day-badge">DAY {data.day}/14</div>
            </div>
            <div className="rank-badge">LVL {data.level} // {getRank(data.level)}</div>
          </div>
        </header>

        {/* DASHBOARD STATS */}
        <section className="stats-grid">
          <div className="stat-card">
            <Zap />
            <div className="stat-value">{animatedXP}</div>
            <div className="stat-label">TOTAL XP</div>
          </div>
          <div className="stat-card">
            <span style={{fontSize: '24px'}}>🔥</span>
            <div className="stat-value">{data.streak}</div>
            <div className="stat-label">STREAK</div>
          </div>
        </section>
        
        {/* PROGRESS BAR */}
        <div className="progress-container">
          <div className="progress-header">
            <span>Прогрес Дня</span>
            <span>{data.progressPct}%</span>
          </div>
          <div className="progress-bar-bg">
            <div className="progress-bar-fill" style={{width: `${data.progressPct}%`}}></div>
          </div>
        </div>

        {/* NOTION QUICK LINK */}
        <div style={{ marginBottom: '20px', padding: '0 15px' }}>
          <a href="https://www.notion.so/BoosterTea-HQ-Workspace-1111" target="_blank" rel="noreferrer" className="action-btn" style={{ background: '#222', border: '1px solid #444', color: '#fff', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16v16H4z"/><path d="M9 9h6v6H9z"/></svg>
            ВІДКРИТИ NOTION
          </a>
        </div>

        {/* TAB NAVIGATION */}
        <div className="tabs">
          <button className={`tab ${activeTab === 'tasks' ? 'active' : ''}`} onClick={() => setActiveTab('tasks')}>
            <Target /> Мої Задачі
          </button>
          <button className={`tab ${activeTab === 'assign' ? 'active' : ''}`} onClick={() => setActiveTab('assign')}>
            <UserPlus /> Створити
          </button>
        </div>

        {/* TAB CONTENT: TASKS */}
        {activeTab === 'tasks' && (
          <section className="task-list">
            
            {/* PRIMARY TASKS */}
            <div className="section-title"><span className="dot blue"></span> 3 Основні (Моя зона)</div>
            {data.myTasks?.map((task) => (
              <div key={task.id} className={`task-card primary ${task.done ? 'done' : ''}`}>
                <div className="task-header">
                  {task.done ? <CheckCircle /> : <Circle />}
                  <span className="task-type-badge blue">PRIMARY</span>
                </div>
                <div className="task-text">{task.text}</div>
                
                {!task.done && (
                  <button className={`action-btn ${glitchTask === task.id ? 'glitching' : ''}`} onClick={() => handleClaim(task.id, false)}>
                    {glitchTask === task.id ? '[КАЛІБРАЦІЯ УСПІХУ...]' : 'ПІДТВЕРДИТИ ВИКОНАННЯ'}
                  </button>
                )}
              </div>
            ))}
            
            {/* ASSIGNED TASKS */}
            {totalAssigned > 0 && (
              <>
                <div className="section-title" style={{marginTop: '20px'}}><span className="dot orange"></span> 2 Додаткові (Від команди)</div>
                {data.assignedTasks?.map((task) => (
                  <div key={task.id} className={`task-card assigned ${task.done ? 'done' : ''}`}>
                    <div className="task-header">
                      {task.done ? <CheckCircle /> : <Circle />}
                      <span className="task-type-badge orange">ASSIGNED BY {task.assignedBy?.role.toUpperCase()}</span>
                    </div>
                    <div className="task-text">{task.text}</div>
                    
                    {!task.done && (
                      <button className={`action-btn orange ${glitchTask === task.id ? 'glitching' : ''}`} onClick={() => handleClaim(task.id, true)}>
                        {glitchTask === task.id ? '[КАЛІБРАЦІЯ УСПІХУ...]' : 'ПІДТВЕРДИТИ ВИКОНАННЯ'}
                      </button>
                    )}
                  </div>
                ))}
              </>
            )}

            {isPerfect && (
              <div className="dopamine-success-banner pulse-animation">
                <div className="confetti-burst"></div>
                <h3 className="cyber-glitch-text" data-text="[ PERFECT DAY ACHIEVED ]">[ PERFECT DAY ACHIEVED ]</h3>
                <p>⚡ Імовірність провалу проекту знижена на 0.5%</p>
                <div className="unlock-reward">
                  <span>UNLOCKED:</span> Свобода від стресу на залишок дня.
                </div>
              </div>
            )}
          </section>
        )}

        {/* TAB CONTENT: ASSIGN */}
        {activeTab === 'assign' && (
          <section className="assign-section">
            <div className="assign-header">
              <h3>Система 3+2: Перехресний Контроль</h3>
              <p>Признач нову задачу на завтра для іншого члена команди.</p>
            </div>
            
            <form className="assign-form" onSubmit={handleAssignSubmit}>
              <div className="form-group">
                <label>Виконавець (Цеглинка):</label>
                <div className="role-selector">
                  {['taras', 'mykyta', 'nazar'].filter(r => r !== data.role.toLowerCase()).map(r => (
                    <button 
                      type="button" 
                      key={r} 
                      className={`role-btn ${assignTarget === r ? 'active' : ''}`}
                      onClick={() => setAssignTarget(r)}
                    >
                      {r.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="form-group">
                <label>Суть задачі (Будь конкретним):</label>
                <textarea 
                  value={assignText}
                  onChange={(e) => setAssignText(e.target.value)}
                  placeholder="Наприклад: Знайди 3 постачальника картону і збери КП в таблицю..."
                  required
                />
              </div>
              
              <button type="submit" className="submit-btn" disabled={assignLoading || !assignText.trim()}>
                {assignLoading ? 'АВТОРИЗАЦІЯ...' : 'ПРИЗНАЧИТИ ЗАДАЧУ [ +5 XP ]'}
              </button>
            </form>
          </section>
        )}
      </div>

      <div className="ticker-wrap"><div className="ticker">[ VALERA AI ] {quote}</div></div>
    </>
  );
}

export default App;
