import { useState } from 'react';
import AcademyDashboard from './AcademyDashboard';
import SkillAcademy from '../SkillAcademy';
import StoicismModule from './StoicismModule';
import MeditationRoom from './MeditationRoom';
import TrainingModules from './TrainingModules';

export default function AcademyRouter() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <>
      <div className="academy-header-nav">
        <button className={`acad-tab ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
          ОГЛЯД
        </button>
        <button className={`acad-tab ${activeTab === 'map' ? 'active' : ''}`} onClick={() => setActiveTab('map')}>
          НАВИЧКИ
        </button>
        <button className={`acad-tab ${activeTab === 'library' ? 'active' : ''}`} onClick={() => setActiveTab('library')}>
          МОДУЛІ
        </button>
        <button className={`acad-tab ${activeTab === 'stoic' ? 'active' : ''}`} onClick={() => setActiveTab('stoic')}>
          СТОЇЦИЗМ
        </button>
        <button className={`acad-tab ${activeTab === 'meditate' ? 'active' : ''}`} onClick={() => setActiveTab('meditate')}>
          ФОКУС
        </button>
      </div>

      <div className="academy-content-area fade-in">
        {activeTab === 'dashboard' && <AcademyDashboard nav={setActiveTab} />}
        {activeTab === 'map' && <SkillAcademy />}
        {activeTab === 'library' && <TrainingModules />}
        {activeTab === 'stoic' && <StoicismModule />}
        {activeTab === 'meditate' && <MeditationRoom />}
      </div>
    </>
  );
}
