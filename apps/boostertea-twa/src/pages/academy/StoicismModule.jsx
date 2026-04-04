import WebApp from '@twa-dev/sdk';

export default function StoicismModule() {
  const triggerHaptic = () => {
    try { WebApp.HapticFeedback.impactOccurred('medium'); } catch(e) {}
  };

  return (
    <div className="stoic-container">
      <div className="stoic-hero">
        <h2 className="stoic-title">ПРАКТИЧНИЙ СТОЇЦИЗМ</h2>
        <p className="stoic-subtitle">"100% нашого страждання — реакція на хаос. Прийми хаос."</p>
      </div>

      <div className="dichotomy-board">
        <h3 className="section-title"><span className="dot blue"></span> ДИХОТОМІЯ КОНТРОЛЮ</h3>
        <div className="control-grid">
          <div className="control-card inner" onClick={triggerHaptic}>
            <h4>🔵 В МОЄМУ КОНТРОЛІ</h4>
            <ul>
              <li>Моя реакція на факап</li>
              <li>Мої щоденні 13WSM13 спринти</li>
              <li>Дотримання обіцянок перед командою</li>
              <li>Час, коли я закриваю ноут</li>
            </ul>
          </div>
          
          <div className="control-card outer" onClick={triggerHaptic}>
            <h4>🔴 ПОЗА МОЇМ КОНТРОЛЕМ</h4>
            <ul>
              <li>Затримка сировини підрядником</li>
              <li>Баг на продакшені</li>
              <li>Поганий настрій клієнта</li>
              <li>Курс валют / блокування реклами</li>
            </ul>
            <div className="reject-btn">ВІДПУСТИТИ (IGNORE)</div>
          </div>
        </div>
      </div>

      <div className="theory-block" style={{marginTop:'30px'}}>
        <h3 className="section-title"><span className="dot orange"></span> АУДІО/РЕСУРСИ (Notion Sync)</h3>
        <a href="https://youtu.be/5897dMWJiSM" target="_blank" rel="noreferrer" className="resource-link">
          <div className="res-icon">🎧</div>
          <div className="res-text">
            <strong>Марк Аврелій. Роздуми.</strong>
            <div>Фундаментальна аудіокнига імператора.</div>
          </div>
        </a>
      </div>
    </div>
  );
}
