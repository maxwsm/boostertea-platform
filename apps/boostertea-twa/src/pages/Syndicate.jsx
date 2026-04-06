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
        <h3 style={{ color: '#fff', marginBottom: '10px' }}>КАПІТАЛІЗАЦІЯ НЕТВОРКУ</h3>
        <p style={{ fontSize: '0.9rem', color: '#a0aec0', lineHeight: 1.5 }}>
          Твої соціальні зв'язки, підписники та Telegram-контакти — це заморожений капітал. Настав час його монетизувати. 
          Залучай інвесторів у робочий бізнес або продавай B2B-інфраструктуру 13WSMEI. Твій нетворк має приносити дивіденди.
        </p>
      </div>

      <div className="contact-card" style={{ borderLeft: '4px solid var(--neon-blue)', marginBottom: '15px' }}>
        <h3 className="neon-text" style={{ marginBottom: '10px' }}>GLOBAL ROADMAP 🌍</h3>
        <ul style={{ color: '#a0aec0', fontSize: '0.9rem', paddingLeft: '15px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <li><strong style={{color:'#fff'}}>ЕТАП 1 ($60k Seed Round):</strong> Релокація в медіа-студію, автоматизована лінія сатурації, інтеграція Aqua 360/Dinosludge.</li>
          <li><strong style={{color:'#fff'}}>ЕТАП 2 (Traction):</strong> Вихід на об'єм <strong>5 ТОНН/міс</strong> (BoosterTea). Projected MRR Growth: <strong>$40,000/міс</strong> чистого прибутку.</li>
          <li><strong style={{color:'#fff'}}>ЕТАП 3 (Compliance):</strong> Імплементація міжнародних стандартів ISO/HACCP. Інтеграція 20 Тір-1 Інфлюенсерів у наш TWA-hub.</li>
          <li><strong style={{color:'#fff'}}>ЕТАП 4 (Expansion):</strong> Експорт у європейські хаби (Series A+).</li>
        </ul>
      </div>

      <div className="contact-card" style={{ borderLeft: '4px solid #00ff88', marginBottom: '15px' }}>
        <h3 style={{ color: '#00ff88', marginBottom: '10px' }}>АБСОЛЮТНА ГАРАНТІЯ КОМПАНІЇ 🛡</h3>
        <p style={{ fontSize: '0.9rem', color: '#a0aec0', lineHeight: 1.5 }}>
          СЕО (Максим) закладає <strong>10% власної частки ТОВ "Тай Дрінк"</strong> як залізобетонну юридичну гарантію. У разі форс-мажору інвестор захищений активами реального бізнесу. Ми не торгуємо повітрям — ми масштабуємо діюче підприємство.
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
          <strong>Суть продукту:</strong> Налаштування повноцінної SaaS-інфраструктури (сервери, TWA-боти, дашборди) для бізнесу. Ми замінюємо 2-3 співробітників кодом, оптимізуємо P&L замовника та зменшуємо його CAC (Customer Acquisition Cost) у 2 рази.<br/>
          <strong>Модель монетизації:</strong> B2B Рекурент (MRR). Інфраструктура належить нам, клієнт бере її в оренду. Monthly Recurring Revenue дає капіталізацію X10.<br/>
          <strong>Підтверджений Кейс:</strong> B2B маркетплейс Aqua 360. Нульовий Churn Rate (відтік), клієнт стабільно приносить <strong>$900 MRR</strong>.<br/>
          <strong>Ціна входу:</strong> Від $5,000 + % Support<br/>
          <strong>Твій Бонус:</strong> 10% ($500)
        </div>
      </div>

      <div className="contact-card" style={{ marginBottom: '15px' }}>
        <h3 style={{ color: 'var(--neon-blue)', marginBottom: '5px' }}>ГЛИБИННИЙ АУДИТ МАРКЕТИНГУ</h3>
        <div style={{ fontSize: '0.85rem', color: '#a0aec0' }}>
          <strong>Суть продукту:</strong> Аналітика рівня Єдинорогів. Прорахунок LTV / CAC Ratio, інтеграція Server-Side Predictive Analytics для знищення неефективних кабінетів Meta Ads.<br/>
          <strong>Ціна:</strong> Від $500 (Base Audit) до $2000 (Deep P&L Audit)<br/>
          <strong>Твій Бонус:</strong> 20%
        </div>
      </div>

      <div className="contact-card" style={{ marginBottom: '15px' }}>
        <h3 style={{ color: 'var(--neon-blue)', marginBottom: '5px' }}>АВТОМАТИЗАЦІЯ (B2B Bots / TWA)</h3>
        <div style={{ fontSize: '0.85rem', color: '#a0aec0' }}>
          <strong>Суть продукту:</strong> Індивідуальна розробка Telegram Web Apps та AI-інтеграцій для оптимізації процесів компанії (як наш 13WSMEI Bot).<br/>
          <strong>Ціна:</strong> Від $2,000<br/>
          <strong>Бонус за ліда:</strong> 15% ($300)
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
      title: "Що, якщо ми прогоримо і я втрачу гроші інвестора?",
      breakdown: "ЦЕ ВЖЕ ДІЮЧИЙ БІЗНЕС, А НЕ СТАРТАП. ТОВ 'Тай Дрінк' щодня генерує кеш. У нас є матеріальні активи (обладнання, товар). Як фінальна гарантія: СЕО використовує 10% власної мажоритарної частки як юридичну заставу за борговими зобов'язаннями. Ризик втрати тіла кредиту — нульовий.",
      color: "var(--neon-red)"
    },
    {
      id: 2,
      title: "Що, якщо B2B клієнт (Пакет Колізей) не буде платити щомісячний рекурент?",
      breakdown: "МІНІМІЗАЦІЯ ДЕБІТОРКИ. Вся технічна інфраструктура (сервери, код, Telegram-боти, БД) формується на наших AWS акаунтах. Ми здаємо її В ОРЕНДУ (SaaS-модель). Якщо транзакція не проходить 1-го числа, API доступи клієнта автоматично заморожуються 2-го. Його бізнес зупиняється. Клієнту життєво необхідно платити нам вчасно.",
      color: "var(--neon-orange)"
    },
    {
      id: 3,
      title: "Синдром самозванця: чи є у нас експертиза на чек $5,000+?",
      breakdown: "ФАКТИЧНІ КЕЙСИ. Ми не продаємо 'сайт на конструкторі'. Ми розгортаємо цифрову екосистему корпоративного рівня (Terminal App, Telegram CRM, автоматизований облік), яка оптимізує фонди заробітної плати клієнта. Експертиза підтверджена роками практики СЕО та діючим кейсом Aqua 360, де така інфраструктура стабільно продається за $900/міс.",
      color: "var(--neon-blue)"
    },
    {
      id: 4,
      title: "Як відповідати інвесторам на питання про прозорість та звітність?",
      breakdown: "ЛЕГАЛІЗАЦІЯ ФІНАНСІВ. Всі транзакції від $10k оформлюються через офіційні контракти (договір позики / інвестиційний договір) з нотаріальним посвідченням. Компанія веде строгий P&L (Profit and Loss) облік. Жодних сірих схем — виключно 'біла' податкова модель ТОВ/ФОП, розроблена нашим CEO та Legal-консультантами.",
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
