import { useState, useEffect } from 'react';
import WebApp from '@twa-dev/sdk';

import QuizFlow from './academy/QuizFlow';

const Lock = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>;

export default function SkillAcademy() {
  const [skillsData, setSkillsData] = useState([]);
  const [mySkills, setMySkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('map'); // 'map' | 'quiz'
  const [quizSkillId, setQuizSkillId] = useState(null);

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
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleStartQuiz = (skillId) => {
    try { WebApp.HapticFeedback.impactOccurred('medium'); } catch(e){}
    setQuizSkillId(skillId);
    setView('quiz');
  };

  if (loading) return <div style={{textAlign:'center', marginTop:'50px'}}>Завантаження навичок...</div>;

  if (view === 'quiz' && quizSkillId) {
    return (
      <QuizFlow 
        selectedSkillIds={[quizSkillId]} 
        onComplete={async () => {
          await fetchData();
          setView('map');
          setQuizSkillId(null);
          try { WebApp.showAlert("Рівень визначено!"); } catch(e){}
        }} 
      />
    );
  }

  return (
    <div className="academy-container" style={{paddingBottom: '20px'}}>
      
      <div className="section-title" style={{marginBottom: '15px'}}><span className="dot blue"></span> ДЕРЕВО НАВИЧОК</div>
      <p style={{color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '20px', lineHeight: '1.4'}}>
        Сірі — ще не перевірені (пройди тест). Мета — досягти рівня <span style={{color: 'var(--neon-orange)'}}>80+</span> в ключових сферах.
      </p>

      <div className="skill-categories">
        {skillsData.map(cat => (
          <div key={cat.id} className="category-block" style={{marginBottom: '25px'}}>
            <h4 style={{borderBottom: '1px solid #333', paddingBottom: '5px', marginBottom: '15px', color: '#fff'}}>{cat.icon} {cat.name}</h4>
            <div className="category-skills-grid" style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
              {cat.skills.map(skill => {
                const myState = mySkills.find(s => s.skillId === skill.id) || { currentLevel: 0 };
                const isTested = myState.currentLevel > 0;
                
                return (
                  <div 
                    key={skill.id} 
                    className={`skill-card ${isTested ? 'active' : 'locked-skill'}`}
                    onClick={() => !isTested && handleStartQuiz(skill.id)}
                    style={{
                      cursor: isTested ? 'default' : 'pointer',
                      border: `1px solid ${isTested ? 'var(--neon-blue)' : '#444'}`,
                      background: isTested ? 'rgba(0,0,0,0.8)' : '#050505',
                      padding: '12px',
                      borderRadius: '6px'
                    }}
                  >
                    <div className="skill-header" style={{display: 'flex', justifyContent: 'space-between', marginBottom: '5px'}}>
                      <span style={{fontWeight: 'bold', color: isTested ? '#fff' : '#888'}}>{skill.name}</span>
                      {isTested ? (
                        <span className="skill-level" style={{color: myState.currentLevel >= 80 ? 'var(--neon-green)' : 'var(--neon-blue)'}}>
                          {myState.currentLevel}/100
                        </span>
                      ) : (
                        <span style={{fontSize: '0.7rem', color: 'var(--neon-orange)', border: '1px solid var(--neon-orange)', padding: '2px 4px', borderRadius: '4px'}}>
                          ПРОЙТИ
                        </span>
                      )}
                    </div>
                    {isTested && (
                      <div className="progress-bar-bg" style={{height: '6px', background: '#333'}}>
                        <div className="progress-bar-fill" style={{width: `${myState.currentLevel}%`, background: myState.currentLevel >= 80 ? 'var(--neon-green)' : 'var(--neon-blue)'}}></div>
                      </div>
                    )}
                    <div style={{fontSize: '0.75rem', color: isTested ? '#aaa' : '#555', marginTop: '6px', lineHeight: '1.3'}}>
                      {skill.description}
                    </div>
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

// AssessmentFlow removed entirely as tests are now per-skill.
