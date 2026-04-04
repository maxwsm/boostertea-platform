import { useState, useEffect } from 'react';
import WebApp from '@twa-dev/sdk';

export default function TrainingModules() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = WebApp.initDataUnsafe?.user?.id || '8009046558';
  const BACKEND_URL = import.meta.env.VITE_API_URL || '';

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/twa/resources?userId=${userId}`);
      const data = await res.json();
      setResources(data);
      setLoading(false);
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  const handleMarkDone = async (resourceId) => {
    try { WebApp.HapticFeedback.impactOccurred('heavy'); } catch(e){}
    try {
      await fetch(`${BACKEND_URL}/api/twa/resources/check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, resourceId, status: 'done' })
      });
      // update locally
      setResources(prev => prev.map(r => r.id === resourceId ? { ...r, status: 'done' } : r));
      try { WebApp.showAlert("Модуль пройдено! + XP нараховано."); } catch(e){}
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <div style={{textAlign:'center', marginTop:'50px'}}>LOADING TRAINING MATRIX...</div>;

  const pending = resources.filter(r => r.status !== 'done');
  const completed = resources.filter(r => r.status === 'done');

  return (
    <div className="training-modules-container fade-in" style={{paddingBottom: '20px'}}>
      
      <div className="section-title" style={{marginBottom: '15px'}}><span className="dot blue"></span> АКТУАЛЬНІ МОДУЛІ</div>
      
      {pending.length === 0 && (
        <div style={{color: 'var(--text-muted)', textAlign: 'center', padding: '20px', border: '1px solid #333', background: '#111'}}>
          Наразі немає відкритих навчальних матеріалів для вашої ролі.
        </div>
      )}

      {pending.map(res => (
        <div key={res.id} className="resource-card" style={{
          background: 'rgba(0,0,0,0.6)', border: '1px solid var(--border-dark)', 
          borderRadius: '8px', padding: '15px', marginBottom: '15px'
        }}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
            <h4 style={{margin: '0 0 5px 0', color: 'var(--neon-blue)'}}>{res.name}</h4>
            <span style={{fontSize: '10px', background: '#333', padding: '2px 6px', borderRadius: '4px'}}>
              PRIORITY: {res.priority}
            </span>
          </div>
          
          <div style={{fontSize: '12px', color: '#aaa', margin: '5px 0 10px 0'}}>
            [{res.type.toUpperCase()}] {res.description}
          </div>
          
          <div style={{display: 'flex', gap: '10px', marginTop: '15px'}}>
            <a 
              href={res.url} 
              target="_blank" 
              rel="noreferrer" 
              className="action-btn" 
              style={{flex: 1, textAlign: 'center', textDecoration: 'none', background: '#222', border: '1px solid #444', color: '#fff'}}
            >
              ВІДКРИТИ
            </a>
            <button 
              className="action-btn" 
              style={{flex: 1}}
              onClick={() => handleMarkDone(res.id)}
            >
              ВИТРАТИВ ЦЕ
            </button>
          </div>
        </div>
      ))}

      {completed.length > 0 && (
        <>
          <div className="section-title" style={{marginTop: '30px', marginBottom: '15px'}}><span className="dot green"></span> ПРОЙДЕНІ МОДУЛІ</div>
          {completed.map(res => (
            <div key={res.id} style={{
              background: '#0a0a0c', border: '1px solid #222', 
              borderRadius: '8px', padding: '10px', marginBottom: '10px', display: 'flex',
              alignItems: 'center', justifyContent: 'space-between'
            }}>
              <span style={{color: '#666', textDecoration: 'line-through'}}>{res.name}</span>
              <span style={{color: 'var(--neon-green)', fontSize: '14px'}}>✅ DONE</span>
            </div>
          ))}
        </>
      )}

    </div>
  );
}
