import { useState, useEffect } from 'react';
import WebApp from '@twa-dev/sdk';

export default function QuizFlow({ selectedSkillIds, onComplete }) {
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({}); // { skillId: { scored: number, total: number } }
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const userId = WebApp.initDataUnsafe?.user?.id || '8009046558';
  const BACKEND_URL = import.meta.env.VITE_API_URL || '';

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/twa/assessment/questions?skillIds=${selectedSkillIds.join(',')}`)
      .then(r => r.json())
      .then(data => {
        setQuestions(data);
        // Initialize scores
        const initA = {};
        selectedSkillIds.forEach(id => {
          initA[id] = { scored: 0, total: 100 }; // base max points per skill can vary, using 100 as default
        });
        setAnswers(initA);
        setLoading(false);
      })
      .catch(e => {
        console.error(e);
        setLoading(false);
      });
  }, [selectedSkillIds, BACKEND_URL]);

  const handleAnswer = (optionIdx) => {
    if (processing) return;
    try { WebApp.HapticFeedback.selectionChanged(); } catch(e){}
    setProcessing(true);
    setSelectedOption(optionIdx);
    
    const q = questions[currentIdx];
    const isCorrect = q.isFallback ? true : (optionIdx === q.correct);
    
    setAnswers(prev => {
      const copy = { ...prev };
      if (!copy[q.skillId]) copy[q.skillId] = { scored: 0, MathTotal: 100 };
      
      if (q.isFallback) {
        let level = optionIdx === 0 ? 5 : optionIdx === 1 ? 30 : optionIdx === 2 ? 60 : 90;
        copy[q.skillId].scored = level;
      } else if (isCorrect) {
        copy[q.skillId].scored += (q.points || 25);
      }
      return copy;
    });

    setTimeout(() => {
      setProcessing(false);
      setSelectedOption(null);
      if (currentIdx + 1 < questions.length) {
        setCurrentIdx(currentIdx + 1);
      } else {
        finishQuiz();
      }
    }, 600);
  };

  const finishQuiz = async () => {
    setLoading(true);
    try { WebApp.HapticFeedback.notificationOccurred('success'); } catch(e){}

    // Format results
    const results = Object.keys(answers).map(skillId => {
      let level = answers[skillId].scored;
      if (level > 100) level = 100;
      return { skillId, level };
    });

    // Submitting Assessment results
    try {
      await fetch(`${BACKEND_URL}/api/twa/assessment/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, results })
      });
      onComplete(); // callback to return to map
    } catch(e) {
      console.error(e);
      setLoading(false);
    }
  };

  if (loading) return <div style={{textAlign: 'center', marginTop: '40px'}}>LOADING ASSESSMENT MATRICES...</div>;

  if (questions.length === 0) {
    return (
      <div style={{textAlign: 'center', marginTop: '40px'}}>
        <p style={{color: 'red'}}>ERROR: No questions found for selected skills.</p>
        <button className="action-btn" onClick={() => onComplete()}>Skip</button>
      </div>
    );
  }

  const q = questions[currentIdx];
  const progress = questions.length > 0 ? Math.round((currentIdx / questions.length) * 100) : 0;

  return (
    <div className="quiz-flow" style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column' }}>
      
      {/* Progress */}
      <div className="progress-container" style={{marginBottom: '20px'}}>
        <div className="progress-header">
          <span style={{color: 'var(--neon-green)'}}>{'>'} {q.skillName}_</span>
          <span>{currentIdx + 1} / {questions.length}</span>
        </div>
        <div className="progress-bar-bg" style={{height: '4px'}}>
          <div className="progress-bar-fill" style={{width: `${progress}%`, background: 'var(--neon-green)'}}></div>
        </div>
      </div>

      <div className="quiz-card" style={{
        background: 'rgba(0,0,0,0.6)', border: '1px solid var(--border-dark)', 
        borderRadius: '8px', padding: '20px', flex: 1, display: 'flex', flexDirection: 'column'
      }}>
        <h3 style={{marginBottom: '25px', lineHeight: '1.4', fontSize: '18px'}}>{q.question}</h3>
        
        <div style={{display: 'flex', flexDirection: 'column', gap: '12px', marginTop: 'auto', pointerEvents: processing ? 'none' : 'auto'}}>
          {q.options.map((opt, i) => (
            <button 
              key={i} 
              className={`option-btn ${selectedOption === i ? 'processing' : ''}`}
              onClick={() => handleAnswer(i)}
              style={{
                textAlign: 'left', padding: '15px', 
                background: selectedOption === i ? 'rgba(57, 255, 20, 0.2)' : '#111', 
                border: `1px solid ${selectedOption === i ? 'var(--neon-green)' : '#333'}`, 
                borderRadius: '6px', color: '#fff',
                fontSize: '15px', cursor: 'pointer', transition: '0.2s',
                boxShadow: selectedOption === i ? '0 0 10px var(--neon-green-glow)' : 'none'
              }}
            >
              <span style={{color: 'var(--neon-green)', marginRight: '10px'}}>[{i+1}]</span> {opt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
