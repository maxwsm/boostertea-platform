import { useState, useEffect } from 'react';
import WebApp from '@twa-dev/sdk';
import { AI_SCENARIOS } from './ai_scenarios';
import './index.css';

const getRank = (doneCount) => {
  if (doneCount === 0) return "Сплячий Гусь 🦆";
  if (doneCount < 5) return "Стажер-Барига 💼";
  return "БАТЯ КЕШУ 🤑";
};

// Вибір релевантної цитати (Season 1 + Season 2 Scale-Up)
const getContextQuote = (doneCount, totalTasks) => {
  let categories = []; 
  
  if (doneCount === 0) {
    categories = ["procrastination", "boss_lazy", "boss_delegation"];
  } else if (doneCount > 0 && doneCount < totalTasks) {
    categories = ["marketing", "contractors", "mixology", "legal", "engineering", "boss_firing", "boss_finance", "boss_production", "boss_espionage"];
  } else {
    categories = ["success", "boss_finance"];
  }
  
  const filtered = AI_SCENARIOS.filter(s => categories.includes(s.category));
  const random = filtered[Math.floor(Math.random() * filtered.length)];
  return random ? random.text : AI_SCENARIOS[0].text;
};

// Count-up Anim hook
function useCountUp(endValue, duration = 1000) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * endValue));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [endValue, duration]);

  return count;
}

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [glitchTask, setGlitchTask] = useState(null);

  useEffect(() => {
    // Fallback ID для локал тесту (Тарас або Микита)
    const userId = WebApp.initDataUnsafe?.user?.id || '8009046558'; 

    try { WebApp.expand(); } catch(e) {}
    try { WebApp.setHeaderColor('#0a0a0c'); } catch(e) {}
    // Головний бекенд (ngrok для локального або VITE_API_URL для прода)
    const BACKEND_URL = import.meta.env.VITE_API_URL || 'https://boostertea-backend-test.ngrok.app';

    fetch(`${BACKEND_URL}/api/twa/dashboard?userId=${userId}`)
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const claimCut = data?.royalCut || 0;
  const animatedCash = useCountUp(claimCut, 1500);

  const handleClaimCash = async (taskId) => {
    try { WebApp.HapticFeedback.impactOccurred('heavy'); } catch(e) {}
    setGlitchTask(taskId);

    const userId = WebApp.initDataUnsafe?.user?.id || '8009046558';

    const BACKEND_URL = import.meta.env.VITE_API_URL || 'https://boostertea-backend-test.ngrok.app';

    try {
      await fetch(`${BACKEND_URL}/api/twa/done`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, taskId })
      });
      
      setTimeout(() => {
        setGlitchTask(null);
        setData(prev => {
          if(!prev) return prev;
          const newTasks = prev.myTasks.map(t => t.id === taskId ? { ...t, done: true } : t);
          return { ...prev, myTasks: newTasks };
        });
        
        try {
          WebApp.showPopup({
            title: "КЕШ В КИШЕНІ 💸",
            message: "Легенда. Ти наблизив нас до мільйона."
          });
        } catch(e) { alert("КЕШ В КИШЕНІ 💸"); }
      }, 600); // 600ms of glitch awesomeness
      
    } catch(err) {
      setGlitchTask(null);
      try { WebApp.showAlert("SYSTEM ERROR: Відсутній зв'язок з сервером"); } catch(e) {}
    }
  };

  if (loading) return (
    <div className="loading-screen">
      <div>[ ЗЛОМ БАЗИ... ]</div>
    </div>
  );
  if (data?.error) return <div className="twa-container"><h3>[ ERROR: {data.error} ]</h3></div>
  if (!data) return (
    <div className="twa-container" style={{display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', color:'red'}}>
      <h3>[ FATAL ERROR: CONNECTION LOST ]<br/><br/>Сервер не відповідає. Якщо ви тестуєте локально, переконайтеся, що ngrok увімкнений на порту 3005.</h3>
    </div>
  );

  // Обчислення рангу та релевантної цитати
  const doneCount = data?.myTasks?.filter(t => t.done).length || 0;
  const totalCount = data?.myTasks?.length || 0;
  const rank = getRank(doneCount);
  const quote = getContextQuote(doneCount, totalCount);

  return (
    <>
      <div className="twa-container">
        <header className="twa-header">
          <img src="/avatar.png" alt="Avatar" className="cyber-avatar" />
          <div style={{ flex: 1 }}>
            <div className="header-top">
              <div className="role-badge">{data.role}</div>
              <div className="day-badge">DAY {data.day}/14</div>
            </div>
            <div className="rank-badge">STATUS // {rank}</div>
          </div>
        </header>

        {/* Dashboard */}
        <section className="cash-dashboard">
          <div className="stat-label">ROYALTY CUT (5%)</div>
          <div className="cash-value">${animatedCash.toLocaleString()}</div>
          <div className="liters-label">Об'єм продажів: {data.totalLiters?.toLocaleString()} L</div>
        </section>

        {/* Contract List */}
        <section className="task-list">
          <div className="stat-label" style={{marginTop: '10px'}}>ДОСТУПНІ КОНТРАКТИ</div>
          {data.myTasks?.map((task) => (
            <div key={task.id} className={`task-card ${task.done ? 'done' : ''}`}>
              <div className="task-text">{task.text}</div>
              
              {task.done ? (
                <div className="btn-done">УЖЕ ЗАБРАВ 🤑</div>
              ) : (
                <button 
                  className={`btn-cash ${glitchTask === task.id ? 'glitching' : ''}`}
                  onClick={() => handleClaimCash(task.id)}
                >
                  {glitchTask === task.id ? 'SYSTEM OVERRIDE...' : 'ЗАБРАТИ КЕШ 💸'}
                </button>
              )}
            </div>
          ))}

          {data.myTasks?.length === 0 && doneCount === 0 && (
            <div style={{color: 'var(--text-muted)', textAlign:'center', marginTop:'20px'}}>
              // NO ACTIVE CONTRACTS //
            </div>
          )}
          {doneCount === totalCount && totalCount > 0 && (
            <div className="success-screen">
              <h2 style={{color: 'var(--neon-green)', margin: '0 0 10px'}}>[ MISSION ACCOMPLISHED ]</h2>
              <p style={{color: '#fff', fontSize: '14px', maxWidth: '80%'}}>Всі контракти закриті. Кеш забезпечено. База в безпеці.</p>
            </div>
          )}
        </section>
      </div>

      {/* AI Ticker */}
      <div className="ticker-wrap">
        <div className="ticker">
          [AI NAZGLYAD] {quote}
        </div>
      </div>
    </>
  );
}

export default App;
