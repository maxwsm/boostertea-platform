import WebApp from '@twa-dev/sdk';
import { useState } from 'react';

export default function UnicornBiohackModule() {
  const [activeTab, setActiveTab] = useState('dopamine');

  const triggerHaptic = (type = 'light') => {
    try { WebApp.HapticFeedback.impactOccurred(type); } catch(e) {}
  };

  return (
    <div className="stoic-container">
      <div className="stoic-hero" style={{ borderBottom: '1px solid var(--neon-blue)', paddingBottom: '15px' }}>
        <h2 className="stoic-title" style={{ fontSize: '1.6rem', color: '#fff', textShadow: '0 0 10px var(--neon-blue)' }}>UNICORN ROUTINE 🦄</h2>
        <p className="stoic-subtitle" style={{ color: '#8b9bb4', fontSize: '0.85rem' }}>
          "Засновники мільярдних компаній не мають більше часу. Вони мають абсолютний фокус та біологічний маніакальний драйв. Це твій протокол."
        </p>
      </div>

      <div style={{ display: 'flex', gap: '5px', overflowX: 'auto', marginBottom: '15px', padding: '10px 0' }}>
        <button className={`cyber-button ${activeTab === 'dopamine' ? '' : 'disabled'}`} onClick={() => { setActiveTab('dopamine'); triggerHaptic(); }} style={{fontSize: '0.8rem', padding: '8px', flexShrink: 0}}>🧠 DOPAMINE DETOX</button>
        <button className={`cyber-button ${activeTab === 'leverage' ? '' : 'disabled'}`} onClick={() => { setActiveTab('leverage'); triggerHaptic(); }} style={{fontSize: '0.8rem', padding: '8px', flexShrink: 0}}>⚙️ NAVAL LEVERAGE</button>
        <button className={`cyber-button ${activeTab === 'biohack' ? '' : 'disabled'}`} onClick={() => { setActiveTab('biohack'); triggerHaptic(); }} style={{fontSize: '0.8rem', padding: '8px', flexShrink: 0}}>🧬 BIOHACKING</button>
      </div>

      {activeTab === 'dopamine' && (
        <div className="fade-in">
          <div className="contact-card" style={{ borderLeft: '4px solid var(--neon-orange)' }}>
            <h3 style={{ color: 'var(--neon-orange)', marginBottom: '10px' }}>ЗНИЩЕННЯ ДЕШЕВОГО ДОФАМІНУ</h3>
            <p style={{ fontSize: '0.85rem', color: '#a0aec0', lineHeight: 1.5, marginBottom: '10px' }}>
              Твій мозок (A. Huberman research) має обмежений пул дофаміну на день. Перегляд Reels, переключення вчат TG чи швидкісне споживання новин спалюють цей пул за 40 хвилин. До кінця дня ти відчуваєш вигорання не від роботи, а від перевантаження рецепторів.
            </p>
            <ul style={{ color: '#fff', fontSize: '0.85rem', paddingLeft: '15px' }}>
              <li><strong>Правило 1:</strong> Телефон в іншу кімнату під час 13WSMEI спринтів (Deep Work).</li>
              <li><strong>Правило 2:</strong> Ніяких соцмереж у першу годину після пробудження.</li>
              <li><strong>Правило 3:</strong> Жодного перемикання контексту. Мультизадачність знижує твій IQ на 10 пунктів (McGill Univ).</li>
            </ul>
          </div>
        </div>
      )}

      {activeTab === 'leverage' && (
        <div className="fade-in">
          <div className="contact-card" style={{ borderLeft: '4px solid var(--neon-blue)' }}>
            <h3 style={{ color: 'var(--neon-blue)', marginBottom: '10px' }}>НАВАЛ РАВІКАНТ: АРХІТЕКТУРА ВАЖЕЛІВ</h3>
            <p style={{ fontSize: '0.85rem', color: '#a0aec0', lineHeight: 1.5, marginBottom: '10px' }}>
              "Зарплата не зробить тебе багатим. Тебе зробить багатим володіння активом (equity) і використання важелів (leverage)."
            </p>
            <div style={{ background: '#0a0a0c', padding: '10px', borderRadius: '4px', border: '1px solid #222', fontSize: '0.8rem', color: '#a0aec0' }}>
              <span style={{ color: '#fff', display: 'block', marginBottom: '5px' }}>🔥 1. Капітал: Важіль минулого. Дають гроші - робиш гроші.</span>
              <span style={{ color: '#fff', display: 'block', marginBottom: '5px' }}>👥 2. Праця: Ти наймаєш людей. Важко масштабувати, високий рівень драми.</span>
              <span style={{ color: 'var(--neon-green)', display: 'block', marginBottom: '5px' }}>💻 3. КОД та МЕДІА: Найвищий рівень магії (Unicorn).</span>
              Ти пишеш код один раз, і він працює на 1,000,000 юзерів без твого сну. Ти знімаєш контент, його бачать десятки тисяч. Ми в 13WSMEI будуємо саме ВАЖІЛЬ 3 рівня.
            </div>
          </div>
        </div>
      )}

      {activeTab === 'biohack' && (
        <div className="fade-in">
          <div className="contact-card" style={{ borderLeft: '4px solid var(--neon-green)' }}>
            <h3 style={{ color: 'var(--neon-green)', marginBottom: '10px' }}>БІОХАКІНГ ДЛЯ ПРОДАКШЕНУ</h3>
            <p style={{ fontSize: '0.85rem', color: '#a0aec0', lineHeight: 1.5, marginBottom: '10px' }}>
              Ти не зможеш збудувати студію, Aqua 360 чи новий чай, якщо твоє тіло не тягне навантаження фаундера-єдинорога. 
            </p>
            <ul style={{ color: '#fff', fontSize: '0.85rem', paddingLeft: '15px' }}>
              <li style={{marginBottom: '5px'}}><span style={{color: 'var(--neon-blue)'}}>Сон 8 годин + Температура 18°C.</span> Недосип руйнує префронтальну кору (прийняття рішень).</li>
              <li style={{marginBottom: '5px'}}><span style={{color: 'var(--neon-blue)'}}>L-Theanine + Кофеїн.</span> Секрет BoosterTea. Кофеїн дає енергію, але підвищує кортизол (джиттери/тремор). L-Theanine вирівнює хвилі і дає лазерний спокійний фокус.</li>
              <li style={{marginBottom: '5px'}}><span style={{color: 'var(--neon-blue)'}}>Box Breathing (Дихання NAVY SEALs).</span> Під час паніки чи високого навантаження — вдих 4с, затримка 4с, видих 4с, затримка 4с. Це скидає стрес до нуля.</li>
            </ul>
          </div>
        </div>
      )}

      <div className="theory-block" style={{marginTop:'30px'}}>
        <h3 className="section-title"><span className="dot orange"></span> UNICORN SOURCE RESOURCES</h3>
        <a href="https://youtu.be/1yT4M1rQYxs" target="_blank" rel="noreferrer" className="resource-link" onClick={() => triggerHaptic('light')}>
          <div className="res-icon">🦄</div>
          <div className="res-text">
            <strong>Y Combinator: How to start a Silicon Valley Startup</strong>
            <div style={{color:'#aaa', fontSize:'10px'}}>Фундамент від Сема Альтмана (CEO OpenAI). Обов'язкова база для мислення єдинорогів.</div>
          </div>
        </a>
      </div>
    </div>
  );
}
