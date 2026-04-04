import { useState } from 'react';
import WebApp from '@twa-dev/sdk';

/**
 * CyberTourEngine - a universal widget for guided tours, excursions, and onboarding.
 *
 * Props:
 * - title: string, the global title of the tour
 * - themeColor: string (e.g. 'var(--neon-green)')
 * - focusOptions: array of { id, label, relatedStepId }
 * - steps: array of { id, title, content, icon }
 * - onComplete: function()
 */
export default function CyberTourEngine({ title, themeColor, focusOptions, steps, onComplete }) {
  const [phase, setPhase] = useState('focus'); // 'focus' | 'tour'
  const [activeSteps, setActiveSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const startTour = (focusId) => {
    try { WebApp.HapticFeedback.impactOccurred('medium'); } catch(e){}
    let sortedSteps = [...steps];
    
    // Select the option that user chose
    const selectedFocus = focusOptions.find(opt => opt.id === focusId);
    
    // Sort array: the designated step first, then the rest
    if (selectedFocus && selectedFocus.relatedStepId) {
      const priorityStepIndex = sortedSteps.findIndex(s => s.id === selectedFocus.relatedStepId);
      if (priorityStepIndex > -1) {
        const priorityStep = sortedSteps.splice(priorityStepIndex, 1)[0];
        sortedSteps.unshift(priorityStep);
      }
    }
    
    setActiveSteps(sortedSteps);
    setPhase('tour');
    setCurrentStepIndex(0);
  };

  const handleNext = () => {
    try { WebApp.HapticFeedback.selectionChanged(); } catch(e){}
    if (currentStepIndex < activeSteps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    try { WebApp.HapticFeedback.impactOccurred('light'); } catch(e){}
    onComplete();
  };

  if (phase === 'focus') {
    return (
      <div className="fade-in" style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(5, 5, 5, 0.95)', zIndex: 9999,
        display: 'flex', flexDirection: 'column',
        padding: '20px', color: '#fff', fontFamily: "'Courier New', Courier, monospace"
      }}>
        <div style={{
          marginTop: '10vh', flex: 1, 
          border: `1px solid ${themeColor}`, 
          borderRadius: '8px', padding: '20px',
          boxShadow: `0 0 20px ${themeColor}33 inset`,
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          overflowY: 'auto'
        }}>
          <h2 style={{ color: themeColor, marginBottom: '10px', textShadow: `0 0 10px ${themeColor}88`, textAlign: 'center' }}>
            {title}
          </h2>
          <p style={{ color: '#ccc', marginBottom: '30px', textAlign: 'center', fontSize: '0.9rem' }}>
            Щоб дати максимум користі одразу, вкажи свій головний інтерес (фокус):
          </p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', width: '100%' }}>
            {focusOptions.map(opt => (
              <button 
                key={opt.id}
                onClick={() => startTour(opt.id)}
                style={{
                  padding: '15px', background: '#111',
                  border: '1px solid #333', color: '#fff',
                  borderRadius: '4px', cursor: 'pointer',
                  textAlign: 'left', transition: '0.2s',
                  fontSize: '0.95rem'
                }}
                onMouseOver={(e) => { e.currentTarget.style.borderColor = themeColor; e.currentTarget.style.background = '#222'; }}
                onMouseOut={(e) => { e.currentTarget.style.borderColor = '#333'; e.currentTarget.style.background = '#111'; }}
              >
                {'>'} {opt.label}
              </button>
            ))}
          </div>

          <button onClick={handleSkip} style={{ background: 'none', border: 'none', color: '#555', marginTop: 'auto', width: '100%', fontSize: '0.8rem', cursor: 'pointer', paddingTop: '20px' }}>
            [ ПРОПУСТИТИ ЕКСКУРСІЮ ]
          </button>
        </div>
      </div>
    );
  }

  const currentStep = activeSteps[currentStepIndex];

  return (
    <div className="fade-in" style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(5, 5, 5, 0.95)', zIndex: 9999,
      display: 'flex', flexDirection: 'column',
      padding: '20px', color: '#fff', fontFamily: "'Courier New', Courier, monospace"
    }}>
      <div style={{
        marginTop: '10vh', flex: 1, 
        border: `1px solid ${themeColor}`, 
        borderRadius: '8px', padding: '20px',
        boxShadow: `0 0 20px ${themeColor}33 inset`,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        overflowY: 'auto'
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '20px' }}>{currentStep.icon}</div>
        <h2 style={{ 
          color: themeColor, 
          textShadow: `0 0 10px ${themeColor}88`,
          marginBottom: '20px', textAlign: 'center', fontSize: '1.4rem'
        }}>
          {'>'} {currentStep.title}_
        </h2>
        
        <p style={{ 
          color: '#ccc', lineHeight: '1.6', fontSize: '0.95rem', 
          textAlign: 'justify', whiteSpace: 'pre-wrap'
        }}>
          {currentStep.content}
        </p>

        <div style={{ marginTop: 'auto', width: '100%', paddingTop: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
            <span style={{color: '#555'}}>{currentStepIndex + 1} / {activeSteps.length}</span>
            <span style={{color: themeColor}}>SYSTEM.EXEC()</span>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              onClick={handleNext}
              style={{
                flex: 1, padding: '15px', background: 'rgba(0,0,0,0.5)',
                border: `1px solid ${themeColor}`, color: themeColor,
                fontWeight: 'bold', borderRadius: '4px', cursor: 'pointer',
                boxShadow: `0 0 10px ${themeColor}44`
              }}
            >
              {currentStepIndex < activeSteps.length - 1 ? 'ПРОДОВЖИТИ (NEXT)' : 'ЗАВЕРШИТИ РЕВІЗІЮ'}
            </button>
          </div>
          <button onClick={handleSkip} style={{ background: 'none', border: 'none', color: '#555', marginTop: '15px', width: '100%', fontSize: '0.8rem', cursor: 'pointer' }}>
            [ SKIP TOUR ]
          </button>
        </div>
      </div>
    </div>
  );
}
