import { useState } from 'react';
import AcademyDashboard from './AcademyDashboard';
import SkillAcademy from '../SkillAcademy'; // Existing skill map
import StoicismModule from './StoicismModule';
import MeditationRoom from './MeditationRoom';

export default function AcademyRouter() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <>
      <div className="academy-header-nav">
        <button className={`acad-tab ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
          概観 (OVERVIEW)
        </button>
        <button className={`acad-tab ${activeTab === 'map' ? 'active' : ''}`} onClick={() => setActiveTab('map')}>
          SKILL MAP
        </button>
        <button className={`acad-tab ${activeTab === 'stoic' ? 'active' : ''}`} onClick={() => setActiveTab('stoic')}>
          STOICISM
        </button>
        <button className={`acad-tab ${activeTab === 'meditate' ? 'active' : ''}`} onClick={() => setActiveTab('meditate')}>
          FLOW
        </button>
      </div>

      <div className="academy-content-area fade-in">
        {activeTab === 'dashboard' && <AcademyDashboard nav={setActiveTab} />}
        {activeTab === 'map' && <SkillAcademy />}
        {activeTab === 'stoic' && <StoicismModule />}
        {activeTab === 'meditate' && <MeditationRoom />}
      </div>
    </>
  );
}
