import { useState, useEffect } from 'react';
import WebApp from '@twa-dev/sdk';

const Lock = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>;

export default function SkillAcademy() {
  const [skillsData, setSkillsData] = useState([]);
  const [mySkills, setMySkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('map'); // 'map' | 'assessment'

  const userId = WebApp.initDataUnsafe?.user?.id || '8009046558';
  const BACKEND_URL = import.meta.env.VITE_API_URL || '';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const p1 = fetch(`${BACKEND_URL}/api/twa/skills/categories`).then(r => r.json());
      const p2 = fetch(`${BACKEND_URL}/api/twa/skills/my?userId=${userId}`).then(r => r.json());
      
      const [cats, my] = await Promise.all([p1, p2]);
      setSkillsData(cats);
      setMySkills(my);
      
      // If no skills selected, force assessment
      if (my.filter(s => s.selected).length === 0) setView('assessment');
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAssessmentSubmit = async (selectedSkillIds) => {
    try {
      WebApp.HapticFeedback.impactOccurred('medium');
      await fetch(`${BACKEND_URL}/api/twa/skills/select`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, skillIds: selectedSkillIds })
      });
      await fetchData();
      setView('map');
      WebApp.showAlert("Скіли обрано! +25 XP за ініціативність.");
    } catch(e) {}
  };

  if (loading) return <div style={{textAlign:'center', marginTop:'50px'}}>...SYSTEM SCAN...</div>;

  if (view === 'assessment') {
    return <AssessmentFlow skillsData={skillsData} onSubmit={handleAssessmentSubmit} />;
  }

  const selectedSkills = mySkills.filter(s => s.selected);

  return (
    <div className="academy-container" style={{paddingBottom: '20px'}}>
      <div className="section-title" style={{marginBottom: '15px'}}><span className="dot blue"></span> МОЇ УЛЬТРА СКІЛИ</div>
      
      {selectedSkills.length === 0 && (
        <button className="action-btn" onClick={() => setView('assessment')}>ПРОЙТИ АСЕСМЕНТ</button>
      )}

      {selectedSkills.map(us => (
        <div key={us.id} className="skill-card">
          <div className="skill-header">
            <span>{us.skill.name}</span>
            <span className="skill-level">LVL {us.currentLevel}/100</span>
          </div>
          <div className="progress-bar-bg" style={{marginBottom: '5px'}}>
            <div className="progress-bar-fill" style={{width: `${us.currentLevel}%`, background: 'var(--neon-blue)'}}></div>
          </div>
          <div style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>
            {us.skill.description.substring(0, 60)}...
          </div>
        </div>
      ))}

      <div className="section-title" style={{marginTop: '30px', marginBottom: '15px'}}><span className="dot orange"></span> ВСІ КАТЕГОРІЇ (ДЕРЕВО)</div>
      <div className="skill-categories">
        {skillsData.map(cat => (
          <div key={cat.id} className="category-block">
            <h4>{cat.icon} {cat.name}</h4>
            <div className="category-skills">
              {cat.skills.map(skill => {
                const isMine = selectedSkills.find(s => s.skillId === skill.id);
                return (
                  <div key={skill.id} className={`tree-skill ${isMine ? 'active' : 'locked'}`}>
                    {skill.name} {!isMine && <Lock />}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

// Internal Assessment Component
function AssessmentFlow({ skillsData, onSubmit }) {
  const [selected, setSelected] = useState([]);

  const toggleSelect = (id) => {
    if (selected.includes(id)) setSelected(selected.filter(i => i !== id));
    else if (selected.length < 3) setSelected([...selected, id]);
  };

  const allSkills = skillsData.flatMap(c => c.skills);

  return (
    <div className="assessment-flow">
      <h3 style={{color: 'var(--neon-green)', marginBottom: '10px'}}>INITIATION SEQUENCE</h3>
      <p style={{color: 'var(--text-muted)', marginBottom: '20px'}}>
        Обери 3 ключові навички для розвитку на найближчі 14 днів. Вони впливатимуть на твої daily-задачі та ресурси.
      </p>

      <div style={{marginBottom: '20px'}}>
        Обрано: <span style={{color: 'var(--neon-blue)'}}>{selected.length}/3</span>
      </div>

      <div className="skill-grid" style={{display: 'flex', flexDirection: 'column', gap: '10px', height: '50vh', overflowY: 'auto'}}>
        {allSkills.map(s => (
          <div 
            key={s.id} 
            className={`select-card ${selected.includes(s.id) ? 'selected' : ''}`}
            onClick={() => toggleSelect(s.id)}
            style={{
              padding: '12px', border: `1px solid ${selected.includes(s.id) ? 'var(--neon-green)' : 'var(--border-dark)'}`,
              background: selected.includes(s.id) ? 'rgba(57,255,20,0.1)' : 'rgba(0,0,0,0.5)', cursor: 'pointer'
            }}
          >
            <strong>{s.name}</strong>
            <div style={{fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px'}}>{s.description}</div>
          </div>
        ))}
      </div>

      <button 
        className="action-btn" 
        style={{marginTop: '20px'}}
        disabled={selected.length < 1}
        onClick={() => onSubmit(selected)}
      >
        ЗАФІКСУВАТИ СКІЛИ
      </button>
    </div>
  );
}
