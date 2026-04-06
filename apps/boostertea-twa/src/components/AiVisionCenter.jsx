import { useState } from 'react';
import WebApp from '@twa-dev/sdk';

const MODULES = [
  { key: 'sprints',     label: '🚀 Спринти',    desc: 'Активні задачі Sprint Board' },
  { key: 'ops',         label: '📦 Операційка', desc: 'Постачальники і контракти' },
  { key: 'content',     label: '🎬 Контент',    desc: 'Content Factory' },
  { key: 'legal',       label: '⚖️ Юристи',     desc: 'Документи, ТМ, ХАСП' },
  { key: 'b2b',         label: '💼 B2B',        desc: 'Партнери та ліди' },
  { key: 'influencers', label: '📱 Блогери',    desc: 'Інфлюєнсери та UGC' },
];

// Determine the best display name for a Notion card
function getCardTitle(item) {
  return (
    item['Task Name'] || item['Name'] || item['Contact Name'] ||
    item['Document Name'] || item['Title'] || item['Company'] ||
    Object.values(item).find(v => typeof v === 'string' && v.length > 2) ||
    'Без назви'
  );
}

export default function AiVisionCenter() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeType, setActiveType] = useState('');

  const rawUserId = WebApp.initDataUnsafe?.user?.id;
  const userId = rawUserId ? rawUserId.toString() : '8374356466';

  const fetchData = async (type) => {
    try { WebApp.HapticFeedback.impactOccurred('medium'); } catch(e){}
    setLoading(true);
    setActiveType(type);
    setData(null);
    try {
      const res = await fetch(`/api/twa/ai/vision-dash?userId=${userId}&type=${type}`);
      const json = await res.json();
      setData(json);
    } catch(err) {
      setData({ error: "Помилка зв'язку з AI Vision модулем." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: '30px', padding: '15px', background: '#0a0a0c', border: '1px solid #333', borderRadius: '12px' }}>
      <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--neon-purple, #9d00ff)', margin: '0 0 8px 0', fontSize: '14px', letterSpacing: '2px' }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
        AI VISION CENTER
      </h3>
      <p style={{ color: '#666', fontSize: '11px', marginBottom: '15px', letterSpacing: '1px' }}>
        LIVE FEED З NOTION-МОЗКУ — ОБЕРИ МОДУЛЬ:
      </p>

      {/* 6-button grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '18px' }}>
        {MODULES.map(m => (
          <button
            key={m.key}
            onClick={() => fetchData(m.key)}
            style={{
              padding: '10px 6px',
              background: activeType === m.key ? 'rgba(157,0,255,0.15)' : '#111',
              border: `1px solid ${activeType === m.key ? 'var(--neon-purple, #9d00ff)' : '#333'}`,
              color: activeType === m.key ? '#fff' : '#999',
              borderRadius: '8px',
              fontSize: '11px',
              cursor: 'pointer',
              textAlign: 'center',
              lineHeight: '1.4',
              transition: 'all 0.2s',
            }}
          >
            <div style={{ fontSize: '18px' }}>{m.label.split(' ')[0]}</div>
            <div style={{ marginTop: '3px' }}>{m.label.split(' ').slice(1).join(' ')}</div>
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: 'center', color: 'var(--neon-purple, #9d00ff)', padding: '20px', letterSpacing: '2px', fontSize: '12px' }}>
          ▋ SCANNING NEURAL NET...
        </div>
      )}

      {/* Results */}
      {data && data.success && (
        <div style={{ animation: 'fadeIn 0.3s ease' }}>
          <div style={{ padding: '10px 12px', background: 'rgba(0,255,100,0.07)', borderLeft: '3px solid var(--neon-green, #00ff66)', color: 'var(--neon-green, #00ff66)', marginBottom: '12px', fontSize: '12px', borderRadius: '0 6px 6px 0' }}>
            {data.analysis}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '350px', overflowY: 'auto' }}>
            {data.data?.length === 0 && (
              <div style={{ color: '#555', textAlign: 'center', padding: '15px', fontSize: '12px' }}>
                // NO RECORDS FOUND //
              </div>
            )}
            {data.data?.map((item, idx) => (
              <div key={item.id || idx} style={{ padding: '10px', background: '#131313', border: '1px solid #1e1e1e', borderRadius: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                  <strong style={{ color: '#ddd', fontSize: '12px', lineHeight: '1.4', flex: 1 }}>
                    {getCardTitle(item)}
                  </strong>
                  {(item.Status || item.status) && (
                    <span style={{
                      fontSize: '10px', padding: '2px 6px',
                      background: '#222', borderRadius: '4px', color: '#aaa',
                      whiteSpace: 'nowrap', flexShrink: 0
                    }}>
                      {item.Status || item.status}
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '11px', color: '#666', marginTop: '5px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  {item.Owner && <span>👤 {item.Owner}</span>}
                  {item.Area && <span>📍 {item.Area}</span>}
                  {item.Type && <span>📂 {item.Type}</span>}
                  {item.Category && <span>🏷 {item.Category}</span>}
                  {item.Phone && <span>📞 {item.Phone}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {data?.error && (
        <div style={{ color: '#ff4444', fontSize: '12px', textAlign: 'center', padding: '10px' }}>
          ⚠️ {data.error}
        </div>
      )}
    </div>
  );
}
