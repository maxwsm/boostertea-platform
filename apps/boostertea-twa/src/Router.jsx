import { useState, useEffect } from 'react';
import App from './App';
import AcademyRouter from './pages/academy/AcademyRouter';
import ContactsCRM from './pages/ContactsCRM';
import SyndicateDashboard from './pages/Syndicate';
import ValeraGPT from './pages/ValeraGPT';
import AdminDashboard from './pages/AdminDashboard';
import Onboarding from './components/Onboarding';
import './index.css';
import './academy.css';
import './crm.css';

// SVG Icons
const Crosshair = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="22" y1="12" x2="18" y2="12"/><line x1="6" y1="12" x2="2" y2="12"/><line x1="12" y1="6" x2="12" y2="2"/><line x1="12" y1="22" x2="12" y2="18"/></svg>;
const BookOpen = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>;
const Hexagon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>;
const ValeraIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" y1="16" x2="8" y2="16"/><line x1="16" y1="16" x2="16" y2="16"/></svg>;
const Shield = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;

export default function MainRouter() {
  const [currentPage, setCurrentPage] = useState('mission');
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('wsm_onboarded_v2')) {
      setShowOnboarding(true);
    }
  }, []);

  // For styling the TWA container differently if in ValeraGPT
  const containerStyle = currentPage === 'valera' ? { height: '100vh', display: 'flex', flexDirection: 'column' } : { paddingBottom: '70px' };

  return (
    <div style={containerStyle}>
      {showOnboarding && <Onboarding onComplete={() => setShowOnboarding(false)} />}
      {currentPage === 'valera' ? (
        <ValeraGPT />
      ) : (
        <div style={{ paddingBottom: '70px' }}>
          {currentPage === 'mission' && <App />}
          {currentPage === 'academy' && <div className="twa-container"><AcademyRouter /></div>}
          {currentPage === 'syndicate' && <div className="twa-container" style={{padding:'20px 10px'}}><SyndicateDashboard /></div>}
          {currentPage === 'crm' && <div className="twa-container" style={{padding:'20px 10px'}}><ContactsCRM /></div>}
          {currentPage === 'admin' && <div className="twa-container"><AdminDashboard /></div>}
        </div>
      )}

      {/* TWA Navigation Bar (Bottom) */}
      <nav className="bottom-nav">
        <button className={`nav-item ${currentPage === 'mission' ? 'active' : ''}`} onClick={() => setCurrentPage('mission')}>
          <Crosshair /><span>Mission</span>
        </button>
        <button className={`nav-item ${currentPage === 'academy' ? 'active' : ''}`} onClick={() => setCurrentPage('academy')}>
          <BookOpen /><span>Academy</span>
        </button>
        <button className={`nav-item ${currentPage === 'valera' ? 'active' : ''}`} onClick={() => setCurrentPage('valera')}>
          <ValeraIcon /><span>Валєра</span>
        </button>
        <button className={`nav-item ${currentPage === 'syndicate' ? 'active' : ''}`} onClick={() => setCurrentPage('syndicate')}>
          <Hexagon /><span>Capital</span>
        </button>
        <button className={`nav-item ${currentPage === 'admin' ? 'active' : ''}`} onClick={() => setCurrentPage('admin')}>
          <Shield /><span>Command</span>
        </button>
      </nav>
    </div>
  );
}
