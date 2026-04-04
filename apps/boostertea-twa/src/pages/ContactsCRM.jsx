import { useState, useEffect } from 'react';
import WebApp from '@twa-dev/sdk';

const SearchIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const PhoneIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>;
const UserPlus = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>;

// Categories color mapping
const getCatColor = (cat) => {
  const map = {
    'packaging': 'var(--neon-orange)',
    'ingredients': 'var(--neon-green)',
    'logistics': 'var(--neon-blue)',
    'legal': 'var(--text-muted)',
    'printing': 'var(--neon-red)',
    'production': 'var(--neon-purple, #9d00ff)',
    'other': 'gray'
  };
  return map[cat] || 'gray';
};

const getCatLabel = (cat) => {
  const map = {
    'packaging': 'ПАКУВАННЯ', 'ingredients': 'СИРОВИНА', 'logistics': 'ЛОГІСТИКА',
    'legal': 'ЮР.ПИТАННЯ', 'printing': 'ПОЛІГРАФІЯ', 'production': 'ВИРОБНИЦТВО', 'other': 'ІНШЕ'
  };
  return map[cat] || cat.toUpperCase();
};

export default function ContactsCRM() {
  const [contacts, setContacts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
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

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!newContact.name) return;
    try {
      WebApp.HapticFeedback.impactOccurred('light');
      const payload = { ...newContact, userId };
      
      await fetch(`${BACKEND_URL}/api/twa/contacts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      setShowAddForm(false);
      setNewContact({ name: '', phone: '', category: 'other', description: '' });
      await fetchContacts();
      WebApp.showAlert("Контакт занесено до реєстру. +3 XP");
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

  if (loading) return <div style={{textAlign:'center', marginTop:'50px'}}>...LOADING CRM...</div>;

  return (
    <div className="crm-container">
      <div className="crm-header-row">
        <div className="section-title" style={{marginBottom: 0}}>
          <span className="dot orange"></span> CONTACTS
        </div>
        <button className="icon-btn" onClick={() => setShowAddForm(!showAddForm)}>
          <UserPlus />
        </button>
      </div>

      {showAddForm && (
        <form className="add-contact-form" onSubmit={handleAddSubmit}>
          <div className="form-title">АВТОРИЗАЦІЯ ПІДРЯДНИКА</div>
          <input 
            type="text" placeholder="Ім'я / Назва" required
            value={newContact.name} onChange={e => setNewContact({...newContact, name: e.target.value})}
          />
          <input 
            type="tel" placeholder="Телефон (+380...)"
            value={newContact.phone} onChange={e => setNewContact({...newContact, phone: e.target.value})}
          />
          <select value={newContact.category} onChange={e => setNewContact({...newContact, category: e.target.value})}>
            <option value="packaging">Пакування</option>
            <option value="ingredients">Сировина</option>
            <option value="production">Виробництво</option>
            <option value="printing">Поліграфія</option>
            <option value="logistics">Логістика</option>
            <option value="legal">Юр. Питання</option>
            <option value="other">Інше</option>
          </select>
          <textarea 
            placeholder="Деталі (що робить, ціни, статус...)"
            value={newContact.description} onChange={e => setNewContact({...newContact, description: e.target.value})}
          />
          <button type="submit" className="action-btn orange" style={{marginTop:'5px'}}>ЗБЕРЕГТИ ДАНІ</button>
        </form>
      )}

      <div className="search-box">
        <SearchIcon />
        <input 
          type="text" 
          placeholder="Пошук по підрядниках..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="contact-list">
        {filtered.length === 0 && <div className="no-data">// NO ENTITIES FOUND //</div>}
        
        {filtered.map(contact => (
          <div key={contact.id} className="contact-card">
            <div className="contact-cat-badge" style={{color: getCatColor(contact.category), borderColor: getCatColor(contact.category)}}>
              {getCatLabel(contact.category)}
            </div>
            
            <div className="contact-name">{contact.name}</div>
            
            {contact.description && (
              <div className="contact-desc">{contact.description}</div>
            )}
            
            <div className="contact-footer">
              {contact.phone ? (
                <button className="call-btn" onClick={() => handleCall(contact.phone)}>
                  <PhoneIcon /> Зателефонувати
                </button>
              ) : (
                <span className="no-phone">ТЕЛЕФОН ВІДСУТНІЙ</span>
              )}
              
              {contact.createdBy && (
                <div className="added-by">Додав: {contact.createdBy.name || contact.createdBy.role}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
