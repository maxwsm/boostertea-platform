import { useState, useEffect } from 'react';
import WebApp from '@twa-dev/sdk';

const SearchIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const PhoneIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>;
const UserPlus = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>;
const RefreshIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.59-10.7l1.75 2.13"/></svg>;

// Categories color mapping
const getCatColor = (cat) => {
  const map = {
    'packaging': 'var(--neon-orange)',
    'ingredients': 'var(--neon-green)',
    'logistics': 'var(--neon-blue)',
    'legal': 'var(--text-muted)',
    'printing': 'var(--neon-red)',
    'production': 'var(--neon-purple, #9d00ff)',
    'other': 'gray',
    'influencer': '#ff007f', // Pink for infl
    'b2b': 'var(--neon-orange)'
  };
  return map[cat] || 'gray';
};

const getCatLabel = (cat) => {
  const map = {
    'packaging': 'ПАКУВАННЯ', 'ingredients': 'СИРОВИНА', 'logistics': 'ЛОГІСТИКА',
    'legal': 'ЮР.ПИТАННЯ', 'printing': 'ПОЛІГРАФІЯ', 'production': 'ВИРОБНИЦТВО', 
    'influencer': 'INFLUENCER', 'b2b': 'B2B LEAD', 'other': 'ІНШЕ'
  };
  return map[cat] || cat.toUpperCase();
};

export default function ContactsCRM() {
  const [contacts, setContacts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeTab, setActiveTab] = useState('b2b'); // 'ops', 'b2b', 'influencer'
  const [newContact, setNewContact] = useState({ name: '', phone: '', category: 'other', description: '' });

  const BACKEND_URL = import.meta.env.VITE_API_URL || '';
  const userId = WebApp.initDataUnsafe?.user?.id || '8009046558';

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BACKEND_URL}/api/twa/contacts`);
      const data = await res.json();
      setContacts(data);
    } catch(e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSyncNotion = async () => {
    try {
      setSyncing(true);
      WebApp.HapticFeedback.impactOccurred('medium');
      const res = await fetch(`${BACKEND_URL}/api/twa/contacts/sync`, { method: 'POST' });
      const data = await res.json();
      if(data.success) {
        WebApp.showAlert(`Синхронізовано статусів: ${data.updated}`);
        await fetchContacts();
      } else {
        WebApp.showAlert("Помилка синхронізації з Notion.");
      }
    } catch(e) {
      WebApp.showAlert("Помилка підключення до API.");
    } finally {
      setSyncing(false);
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!newContact.name) return;
    try {
      WebApp.HapticFeedback.impactOccurred('light');
      
      // Auto-assign category for influencers/b2b if not explicitly set
      let finalCategory = newContact.category;
      let finalContactRole = 'partner';
      
      if(activeTab === 'influencer') { finalCategory = 'influencer'; finalContactRole = 'influencer'; }
      if(activeTab === 'b2b') { finalCategory = 'b2b'; finalContactRole = 'client'; }

      const payload = { ...newContact, category: finalCategory, contactRole: finalContactRole, userId };
      
      await fetch(`${BACKEND_URL}/api/twa/contacts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      setShowAddForm(false);
      setNewContact({ name: '', phone: '', category: 'other', description: '' });
      await fetchContacts();
      WebApp.showAlert(`Контакт збережено та відправлено в Notion. +3 XP`);
    } catch(e) {}
  };

  const handleCall = (phone) => {
    if(!phone) return;
    try { WebApp.HapticFeedback.selectionChanged(); } catch(e) {}
    window.location.href = `tel:${phone}`;
  };

  const filtered = contacts.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    (c.description && c.description.toLowerCase().includes(search.toLowerCase()))
  );

  const getFilteredByTab = (tab) => {
    if (tab === 'ops') return filtered.filter(c => c.category !== 'influencer' && c.category !== 'b2b');
    if (tab === 'influencer') return filtered.filter(c => c.category === 'influencer' || c.contactRole === 'influencer');
    if (tab === 'b2b') return filtered.filter(c => c.category === 'b2b' || (!['influencer', 'packaging', 'ingredients', 'logistics', 'legal', 'printing', 'production'].includes(c.category)));
    return filtered;
  };

  const currentContacts = getFilteredByTab(activeTab);

  if (loading && contacts.length === 0) return <div style={{textAlign:'center', marginTop:'50px', color:'var(--neon-orange)'}}>INITIALIZING PIPELINES...</div>;

  return (
    <div className="crm-container">
      <div className="crm-header-row" style={{marginBottom: "15px"}}>
        <div className="section-title" style={{marginBottom: 0}}>
          <span className="dot orange"></span> PIPELINE & CRM
        </div>
        <div style={{display:'flex', gap:'10px'}}>
          <button className="icon-btn" onClick={handleSyncNotion} disabled={syncing}>
            <RefreshIcon />
          </button>
          <button className="icon-btn orange" onClick={() => setShowAddForm(!showAddForm)}>
            <UserPlus />
          </button>
        </div>
      </div>

      <div className="tabs-container" style={{display:'flex', gap:'5px', marginBottom:'15px'}}>
        <button className={`tab-btn ${activeTab==='ops'?'active':''}`} onClick={()=>setActiveTab('ops')}>ОПЕРАЦІЙКА</button>
        <button className={`tab-btn ${activeTab==='influencer'?'active':''}`} onClick={()=>setActiveTab('influencer')}>INFLUENCERS</button>
        <button className={`tab-btn ${activeTab==='b2b'?'active':''}`} onClick={()=>setActiveTab('b2b')}>B2B ВОРОНКА</button>
      </div>

      {showAddForm && (
        <form className="add-contact-form" onSubmit={handleAddSubmit} style={{borderLeft: `4px solid ${activeTab==='influencer'?'#ff007f':'var(--neon-orange)'}`}}>
          <div className="form-title">АВТОРИЗАЦІЯ ({activeTab.toUpperCase()})</div>
          <input 
            type="text" placeholder="Ім'я / Назва" required
            value={newContact.name} onChange={e => setNewContact({...newContact, name: e.target.value})}
          />
          <input 
            type="tel" placeholder="Телефон (+380...)"
            value={newContact.phone} onChange={e => setNewContact({...newContact, phone: e.target.value})}
          />
          {activeTab === 'ops' && (
            <select value={newContact.category} onChange={e => setNewContact({...newContact, category: e.target.value})}>
              <option value="packaging">Пакування</option>
              <option value="ingredients">Сировина</option>
              <option value="production">Виробництво</option>
              <option value="printing">Поліграфія</option>
              <option value="logistics">Логістика</option>
              <option value="legal">Юр. Питання</option>
              <option value="other">Інше</option>
            </select>
          )}
          <textarea 
            placeholder={activeTab==='ops'?"Що робить, ціни, статус...":"Деталі, посилання на соц.мережі, інфо про B2B..."}
            value={newContact.description} onChange={e => setNewContact({...newContact, description: e.target.value})}
          />
          <button type="submit" className="action-btn orange" style={{marginTop:'5px'}}>ЗБЕРЕГТИ & ПУШНУТИ В NOTION</button>
        </form>
      )}

      <div className="search-box" style={{marginBottom: '15px'}}>
        <SearchIcon />
        <input 
          type="text" 
          placeholder="Пошук бази..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="contact-list">
        {currentContacts.length === 0 && <div className="no-data">// ВОРОНКА ПОРОЖНЯ //</div>}
        
        {currentContacts.map(contact => (
          <div key={contact.id} className="contact-card" style={{borderRight: (activeTab !== 'ops' && contact.progressPct === 100) ? '3px solid var(--neon-green)' : 'none'}}>
            
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start'}}>
                <div className="contact-cat-badge" style={{color: getCatColor(contact.category), borderColor: getCatColor(contact.category)}}>
                  {getCatLabel(contact.category)}
                </div>
                {(activeTab === 'influencer' || activeTab === 'b2b') && (
                  <div className="contact-status-badge" style={{fontSize:'10px', padding:'3px 6px', background:'rgba(255,255,255,0.1)', borderRadius:'4px'}}>
                    {contact.status}
                  </div>
                )}
            </div>

            <div className="contact-name">{contact.name}</div>
            
            {contact.description && (
              <div className="contact-desc">{contact.description}</div>
            )}

            {/* Pipeline Progress Bar */}
            {(activeTab === 'influencer' || activeTab === 'b2b') && (
              <div className="pipeline-bar-wrapper" style={{marginTop:'10px', marginBottom:'5px'}}>
                <div className="p-bar-bg" style={{background:'#222', height:'6px', borderRadius:'10px', width:'100%', overflow:'hidden'}}>
                  <div className="p-bar-fill" style={{
                    width: `${contact.progressPct}%`, 
                    height:'100%', 
                    background: contact.progressPct === 100 ? 'var(--neon-green)' : (activeTab==='influencer' ? '#ff007f' : 'var(--neon-orange)'),
                    transition: 'width 0.5s ease-in-out'
                  }}></div>
                </div>
                <div style={{fontSize:'10px', color:'gray', marginTop:'4px', display:'flex', justifyContent:'space-between'}}>
                  <span>Новий</span>
                  <span style={{color: contact.progressPct === 100 ? 'var(--neon-green)' : 'white'}}>{contact.progressPct}%</span>
                </div>
              </div>
            )}
            
            <div className="contact-footer" style={{marginTop: '10px'}}>
              {contact.phone ? (
                <button className="call-btn" onClick={() => handleCall(contact.phone)}>
                  <PhoneIcon /> Дзвінок
                </button>
              ) : (
                <span className="no-phone">ТЕЛЕФОН ВІДСУТНІЙ</span>
              )}
              
              {contact.notionId && (
                <div className="added-by" style={{color: '#fff', fontSize:'10px'}}>🔄 Linked</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
