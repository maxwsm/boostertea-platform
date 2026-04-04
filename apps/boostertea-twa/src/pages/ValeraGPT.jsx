import { useState, useEffect, useRef } from 'react';
import WebApp from '@twa-dev/sdk';

export default function ValeraGPT() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionActive, setSessionActive] = useState(false);
  const chatEndRef = useRef(null);

  const rawUserId = WebApp.initDataUnsafe?.user?.id;
  const userId = rawUserId ? rawUserId.toString() : '8374356466';

  // Categorized Topics & Fear prompt
  const suggestions = [
    { text: "А ЩО ЯКЩО: Що буде за рік, якщо я зроблю всі задачі? (Страхи і Висоти)", type: "highlight" },
    { text: "Маркетинг (GTM, UGC, Воронки)", type: "normal" },
    { text: "Інженерія (Vite, Prisma, Боти)", type: "normal" },
    { text: "Міксологія (Сатурація, Шолуха)", type: "normal" },
    { text: "Юридичний відділ (ХАСП, ТМ)", type: "normal" },
    { text: "Стратегія (6 місячний план)", type: "normal" }
  ];

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const startNewChat = () => {
    // Optionally clear chat memory on backend, but let's just push a clear context
    // fetch('/api/twa/chat/clear', { method: 'DELETE', body: JSON.stringify({ userId }) });
    setMessages([
      { role: 'assistant', text: "Шо ти, жалуйся. Що знову не так?" }
    ]);
    setSessionActive(true);
  };

  useEffect(() => {
    // Attempt to load current active session
    fetch(`/api/twa/chat/sessions?userId=${userId}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          const recentSessionId = data[0].sessionId;
          fetch(`/api/twa/chat/session/${recentSessionId}`)
            .then(res => res.json())
            .then(msgs => {
              if (msgs.length > 0) {
                setMessages(msgs.map(m => ({
                  role: m.msgRole,
                  text: m.content
                })));
                setSessionActive(true);
              } else {
                startNewChat();
              }
            });
        } else {
          startNewChat();
        }
      });
  }, [userId]);

  const sendMessage = async (textToSend) => {
    const text = textToSend || input;
    if (!text.trim() || loading) return;

    setMessages(prev => [...prev, { role: 'user', text }]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/twa/chat/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, text }),
      });
      const data = await res.json();
      
      setMessages(prev => [...prev, { role: 'assistant', text: data.answer || "Не розчув, повтори." }]);
      WebApp.HapticFeedback.impactOccurred('medium');
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', text: "Помилка зв'язку з матрицею." }]);
    }
    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="valera-gpt-container fade-in">
      {/* Header */}
      <div className="vgpt-header">
        <div className="vgpt-brand">
          <div className="bot-avatar vgpt-avatar">🤖</div>
          <div className="vgpt-title">
            Валєра Turbo 
            <span className="vgpt-version">v2.0</span>
          </div>
        </div>
        <button className="clear-btn" onClick={() => {
          if (confirm("Точно забути поточну розмову?")) {
            fetch('/api/twa/chat/clear', {
              method: 'DELETE',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ userId })
            }).then(() => startNewChat());
          }
        }}>🗑️ Новий діалог</button>
      </div>

      {/* Chat Area */}
      <div className="vgpt-chat-board">
        {messages.map((m, idx) => (
          <div key={idx} className={`vgpt-bubble-wrapper ${m.role}`}>
            {m.role === 'assistant' && <div className="bot-avatar-small">🤖</div>}
            <div className={`vgpt-bubble ${m.role}`}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="vgpt-bubble-wrapper assistant">
            <div className="bot-avatar-small">🤖</div>
            <div className="vgpt-bubble assistant typing-indicator">
              <span>.</span><span>.</span><span>.</span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Suggestions (only if chat is somewhat empty or fresh) */}
      {messages.length <= 2 && (
        <div className="vgpt-suggestions">
          {suggestions.map((s, idx) => (
            <button 
              key={idx} 
              className={`vgpt-suggest-btn ${s.type === 'highlight' ? 'highlighted-fear-btn' : ''}`} 
              onClick={() => sendMessage(s.text)}
            >
              {s.text}
            </button>
          ))}
        </div>
      )}

      {/* Input Area */}
      <div className="vgpt-input-area">
        <textarea
          className="vgpt-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Напиши запит або жалуйся..."
          rows="1"
        />
        <button className="vgpt-send-btn" onClick={() => sendMessage()} disabled={!input.trim() || loading}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
        </button>
      </div>
    </div>
  );
}
