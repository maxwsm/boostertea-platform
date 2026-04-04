import { useState } from 'react';
import '../crm.css'; // Reusing some base styles

export default function SyndicateDashboard() {
  const [activeTab, setActiveTab] = useState('vision'); // vision, legal, services, calculator

  return (
    <div className="crm-container">
      <div className="crm-header" style={{ borderBottom: '1px solid var(--neon-blue)', marginBottom: '15px' }}>
        <h1 className="neon-text" style={{ fontSize: '1.8rem' }}>[ SYNDICATE ]</h1>
        <p style={{ color: '#8b9bb4', fontSize: '0.9rem' }}>МАШИНА ГЕНЕРАЦІЇ ПАСИВНОГО КАПІТАЛУ</p>
      </div>

      <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', marginBottom: '20px', paddingBottom: '5px' }}>
        <button className={`cyber-button ${activeTab === 'vision' ? '' : 'disabled'}`} onClick={() => setActiveTab('vision')} style={{fontSize: '0.8rem', padding: '8px', opacity: activeTab === 'vision'?1:0.5}}>👁 VISION</button>
        <button className={`cyber-button ${activeTab === 'legal' ? '' : 'disabled'}`} onClick={() => setActiveTab('legal')} style={{fontSize: '0.8rem', padding: '8px', opacity: activeTab === 'legal'?1:0.5}}>⚖️ РЕГЛАМЕНТ</button>
        <button className={`cyber-button ${activeTab === 'services' ? '' : 'disabled'}`} onClick={() => setActiveTab('services')} style={{fontSize: '0.8rem', padding: '8px', opacity: activeTab === 'services'?1:0.5}}>🏛 СИНДИКАТ</button>
        <button className={`cyber-button ${activeTab === 'barriers' ? '' : 'disabled'}`} onClick={() => setActiveTab('barriers')} style={{fontSize: '0.8rem', padding: '8px', opacity: activeTab === 'barriers'?1:0.5}}>🚧 БАР'ЄРИ</button>
        <button className={`cyber-button ${activeTab === 'calc' ? '' : 'disabled'}`} onClick={() => setActiveTab('calc')} style={{fontSize: '0.8rem', padding: '8px', opacity: activeTab === 'calc'?1:0.5}}>📈 КАЛЬКУЛЯТОР</button>
      </div>

      {activeTab === 'vision' && <VisionBlock />}
      {activeTab === 'legal' && <LegalBlock />}
      {activeTab === 'services' && <ServicesBlock />}
      {activeTab === 'barriers' && <BarriersBlock />}
      {activeTab === 'calc' && <CalculatorBlock />}
    </div>
  );
}

function VisionBlock() {
  return (
    <div className="fade-in">
      <div className="contact-card" style={{ borderLeft: '4px solid #fff', marginBottom: '15px' }}>
        <h3 style={{ color: '#fff', marginBottom: '10px' }}>РОЗБЛОКУЙ СВІЙ КАПІТАЛ</h3>
        <p style={{ fontSize: '0.9rem', color: '#a0aec0', lineHeight: 1.5 }}>
          У вас є Telegram Premium, Stories, Threads та особисті контакти. Це — ВАШ СОЦІАЛЬНИЙ КАПІТАЛ. 
          Досить тримати його мертвим грузом. Використовуй ці ресурси, щоб залучати інвестиції та B2B клієнтів в екосистему 13WSMEI.
        </p>
      </div>

      <div className="contact-card" style={{ borderLeft: '4px solid var(--neon-blue)', marginBottom: '15px' }}>
        <h3 className="neon-text" style={{ marginBottom: '10px' }}>GLOBAL ROADMAP 🌍</h3>
        <ul style={{ color: '#a0aec0', fontSize: '0.9rem', paddingLeft: '15px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <li><strong style={{color:'#fff'}}>ЕТАП 1:</strong> Залучення $60,000 → Переїзд → Купівля нового професійного обладнання та станка для поклейки стікерів.</li>
          <li><strong style={{color:'#fff'}}>ЕТАП 2:</strong> Масштабування → Об'єм виробництва BoosterTea зростає до <strong>5 ТОНН на місяць</strong> (5,000 пляшок). Це генерує чистими <strong>$40,000 прибутку / міс</strong>.</li>
          <li><strong style={{color:'#fff'}}>ЕТАП 3:</strong> Отримання сертифікації ISO та HACCP.</li>
          <li><strong style={{color:'#fff'}}>ЕТАП 4:</strong> ЕКСПОРТ. Жорстка експансія в інші країни Європи.</li>
        </ul>
      </div>

      <div className="contact-card" style={{ borderLeft: '4px solid #00ff88', marginBottom: '15px' }}>
        <h3 style={{ color: '#00ff88', marginBottom: '10px' }}>АБСОЛЮТНА ГАРАНТІЯ СЕО 🛡</h3>
        <p style={{ fontSize: '0.9rem', color: '#a0aec0', lineHeight: 1.5 }}>
          Щоб інвестори розуміли рівень нашої відповідальності: я віддаю додаткові <strong>10% компанії ТОВ "Тай Дрінк" (TOV Tai Drink)</strong> як фінансову гарантію. Уяви, скільки коштуватимуть ці 10% після запуску всієї цієї машини на Етап 4! Знімайте всі свої блоки в голові і лупіть задачі.
        </p>
      </div>
    </div>
  );
}

function LegalBlock() {
  return (
    <div className="fade-in">
      <h2 style={{ color: '#fff', marginBottom: '15px', fontSize: '1.2rem' }}>ЮРИДИЧНА БАЗА (Igor's Manual)</h2>
      
      <div className="contact-card" style={{ marginBottom: '10px' }}>
        <h3 style={{ color: 'var(--neon-blue)' }}>ТОВ vs ФОП</h3>
        <p style={{ fontSize: '0.85rem', color: '#a0aec0' }}>ТОВ — для системних інвестицій та часток (як TOV Tai Drink). ФОП — для операційної діяльності. Працюємо тільки з розумінням наслідків щодо ПДВ та без ПДВ.</p>
      </div>

      <div className="contact-card" style={{ marginBottom: '10px' }}>
        <h3 style={{ color: '#00ff88' }}>Типи інвесторів та Акцій</h3>
        <p style={{ fontSize: '0.85rem', color: '#a0aec0' }}>Привілейовані акції (отримують фікс дивіденди першими, але без права голосу) vs Звичайні акції. Партнер-Фонд (фонди, кредитування) vs Angel Investor.</p>
      </div>

      <div className="contact-card" style={{ marginBottom: '10px' }}>
        <h3 style={{ color: '#ffb300' }}>Гранти та Кредитування (Микита)</h3>
        <p style={{ fontSize: '0.85rem', color: '#a0aec0' }}>Як ветеран, Микита має пріоритет. Використовуємо державні мікрогранти (єРобота, VeteranFund) на обладнання. Кредитування під договір поруки.</p>
      </div>
      
      <div className="contact-card" style={{ marginBottom: '10px' }}>
        <h3 style={{ color: '#ff0055' }}>Нотаріальні Контракти</h3>
        <p style={{ fontSize: '0.85rem', color: '#a0aec0' }}>Всі транзакції понад $10k фіксуються через нотаріально затверджену угоду позики або інвестиційний договір. Повна прозорість.</p>
      </div>
    </div>
  );
}

function ServicesBlock() {
  return (
    <div className="fade-in">
      <h2 style={{ color: '#fff', marginBottom: '15px', fontSize: '1.2rem' }}>ПРОДАЖ ПОСЛУГ (ЕКСПЕРТИЗА)</h2>
      <p style={{ fontSize: '0.9rem', color: '#a0aec0', marginBottom: '15px' }}>Кожен з команди може продавати ці пакети по B2B нетворку і лутати відсотки.</p>

      <div className="contact-card" style={{ marginBottom: '15px' }}>
        <h3 style={{ color: 'var(--neon-blue)', marginBottom: '5px' }}>ПАКЕТ "КОЛІЗЕЙ" (Екосистема)</h3>
        <div style={{ fontSize: '0.85rem', color: '#a0aec0' }}>
          <strong>Що це:</strong> Повна маркетингово-технічна запаковка бренду. Ми будуємо цілу інфраструктуру, яка замінює штат людей і автоматизує все. Ця екосистема змінює ринок.<br/>
          <strong>Фінансова подушка:</strong> Вона підв'язується під дорогі "Premium" підписки. Це генерує нам постійний рекурентний капітал.<br/>
          <strong>КЕЙС (Aqua 360):</strong> Я вже тестую цю екосистему на B2B проекті біохімії для ставків. Клієнт готовий платити <strong>$900 щомісяця</strong>. Ви завжди підстраховані моїм бекграундом.<br/>
          <strong>Ціна:</strong> Від $5,000<br/>
          <strong>Твій %:</strong> 10% ($500)
        </div>
      </div>

      <div className="contact-card" style={{ marginBottom: '15px' }}>
        <h3 style={{ color: 'var(--neon-blue)', marginBottom: '5px' }}>МАРКЕТИНГОВИЙ АУДИТ</h3>
        <div style={{ fontSize: '0.85rem', color: '#a0aec0' }}>
          <strong>Що це:</strong> Жорсткий аналіз Pixel, CPA, лійдів конкурента.<br/>
          <strong>Ціна:</strong> Від $500<br/>
          <strong>Твій %:</strong> 20% ($100)
        </div>
      </div>

      <div className="contact-card" style={{ marginBottom: '15px' }}>
        <h3 style={{ color: 'var(--neon-blue)', marginBottom: '5px' }}>АВТОМАТИЗАЦІЯ (Telegram Bots / TWA)</h3>
        <div style={{ fontSize: '0.85rem', color: '#a0aec0' }}>
          <strong>Що це:</strong> Розробка TWA-системи та AI-бота (подібного до цього).<br/>
          <strong>Ціна:</strong> Від $2,000<br/>
          <strong>Твій %:</strong> 15% ($300)
        </div>
      </div>
    </div>
  );
}

function CalculatorBlock() {
  const [loan, setLoan] = useState(10000);
  const [rate, setRate] = useState(2); // 1.5, 2, 3

  const monthlyPayout = (loan * (rate / 100)).toFixed(0);
  const yearlyPayout = (monthlyPayout * 12).toFixed(0);

  return (
    <div className="fade-in">
      <h2 style={{ color: '#fff', marginBottom: '15px', fontSize: '1.2rem' }}>КАЛЬКУЛЯТОР ПОЗИКИ</h2>
      <p style={{ fontSize: '0.85rem', color: '#a0aec0', marginBottom: '20px' }}>Короткі гроші (до 6 міс) vs Довгі гроші (від 1 року). Рахуй виплати інвесторам.</p>

      <div className="contact-card">
        <label style={{ color: '#fff', display: 'block', marginBottom: '10px' }}>Сума Інвестиції ($):</label>
        <input 
          type="range" min="1000" max="60000" step="1000" 
          value={loan} onChange={e => setLoan(Number(e.target.value))}
          style={{ width: '100%', marginBottom: '10px' }}
        />
        <div style={{ color: 'var(--neon-blue)', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '20px' }}>${loan.toLocaleString()}</div>

        <label style={{ color: '#fff', display: 'block', marginBottom: '10px' }}>Відсоткова Ставка (місяць):</label>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          {[1.5, 2, 3].map(r => (
            <button 
              key={r}
              className="cyber-button" 
              style={{ flex: 1, opacity: rate === r ? 1 : 0.4, padding: '10px' }} 
              onClick={() => setRate(r)}
            >
              {r}%
            </button>
          ))}
        </div>

        <div style={{ background: '#0a0a0c', padding: '15px', borderRadius: '8px', border: '1px solid #333' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ color: '#a0aec0' }}>Виплата в Місяць:</span>
            <span style={{ color: '#00ff88', fontWeight: 'bold' }}>${monthlyPayout}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#a0aec0' }}>Виплата в Рік:</span>
            <span style={{ color: '#00ff88', fontWeight: 'bold' }}>${yearlyPayout}</span>
          </div>
        </div>
        
        <p style={{ fontSize: '0.8rem', color: '#5d6d87', marginTop: '15px', textAlign: 'center' }}>
          Ця сума генерує нам можливість зробити $40,000 чистого прибутку щомісяця. 
          {rate === 3 ? " 3% - це дуже дорогі короткі гроші. Тільки для швидких х2 операцій." : " Довгі гроші під низький відсоток — наш ключ."}
        </p>
      </div>
    </div>
  );
}

function BarriersBlock() {
  const [selectedBarrier, setSelectedBarrier] = useState(null);

  const BARRIERS = [
    {
      id: 1,
      title: "Що, якщо компанія прогорить і я втрачу гроші інвестора?",
      breakdown: "МИ НЕ СТАРТАП В ІДЕЇ. Ми вже генеруємо кеш і маємо обладнання, яке можна продати. Крім того, СЕО надає особисту гарантію у вигляді додаткових 10% частки ТОВ 'Тай Дрінк'. Підкріплюємо це юридично нотаріальним договором.",
      color: "var(--neon-red)"
    },
    {
      id: 2,
      title: "Що, якщо B2B клієнт (на Колізей) не буде платити рекурент?",
      breakdown: "Ми здаємо інфраструктуру В ОРЕНДУ. Всі сервери, Telegram-боти, та бази даних належать нам. Якщо клієнт не платить 1-го числа, код вимикається 2-го числа автоматично кнопкою в нашій адмінці. Клієнту вигідно платити.",
      color: "var(--neon-orange)"
    },
    {
      id: 3,
      title: "Я відчуваю синдром самозванця: чи маємо ми експертизу на $5,000+?",
      breakdown: "Так. Ти продаєш не просто розробку, ти продаєш СИСТЕМУ і ЕКОСИСТЕМУ, яку СЕО тестував на Aqua 360, отримуючи $900/місяць. Їм потрібен результат, а наш Terminal/Bot підхід — це те, чого немає у 95% конкурентів. Їх відділи продажів — це динозаври.",
      color: "var(--neon-blue)"
    },
    {
      id: 4,
      title: "Що, якщо інвестор запитає про документацію та звітність?",
      breakdown: "У нас є фінансова модель в Excel + щомісячні звіти P&L (Profit and Loss). Усі транзакції від $10k проходять виключно у білу через перекази на ФОП/ТОВ за юридично затвердженими договорами з урахуванням податків. Повна прозорість.",
      color: "var(--neon-green)"
    }
  ];

  return (
    <div className="fade-in">
      <h2 style={{ color: '#fff', marginBottom: '15px', fontSize: '1.2rem' }}>РОЗБІР 'ЩО ЯКЩО...'</h2>
      <p style={{ fontSize: '0.85rem', color: '#a0aec0', marginBottom: '20px' }}>
        Які страхи заважають тобі системно качати капітал для команди через свій нетворк? Натисни на свій бар'єр, і я дам відповідь.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {BARRIERS.map(b => (
          <div key={b.id} style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <button 
              className="cyber-button" 
              style={{ 
                textAlign: 'left', 
                padding: '15px', 
                fontSize: '0.9rem', 
                whiteSpace: 'normal', 
                height: 'auto',
                borderLeft: `3px solid ${b.color}`,
                background: selectedBarrier === b.id ? 'rgba(255,255,255,0.05)' : '#050505'
              }}
              onClick={() => setSelectedBarrier(selectedBarrier === b.id ? null : b.id)}
            >
              {b.title}
            </button>
            {selectedBarrier === b.id && (
              <div 
                className="fade-in" 
                style={{ 
                  background: 'rgba(0,0,0,0.8)', 
                  border: `1px solid ${b.color}`, 
                  color: '#fff', 
                  padding: '15px', 
                  borderRadius: '4px',
                  fontSize: '0.85rem',
                  lineHeight: '1.5',
                  boxShadow: `0 0 10px ${b.color}33 inset`
                }}
              >
                <strong>{'>'} SOLUTION FOUND:</strong><br/><br/>
                {b.breakdown}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
