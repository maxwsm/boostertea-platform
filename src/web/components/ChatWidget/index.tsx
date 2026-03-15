import { useState, useEffect, useRef, useCallback } from 'react';
import ChatMessage from './ChatMessage';
import type { Message } from './types';

const SESSION_KEY = 'bt_chat_session_id';
const API_URL = '/api/ai-chat';

const getOrCreateSessionId = (): string => {
  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
};

const GREETING: Message = {
  id: 'greeting',
  role: 'assistant',
  text: 'Привіт! Я допоможу підібрати чай під твій настрій 🍵 Що шукаєш?',
};

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Message = { id: crypto.randomUUID(), role: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, sessionId: getOrCreateSessionId() }),
      });

      if (!res.ok) throw new Error('network');
      const data = await res.json();

      setMessages(prev => [
        ...prev,
        { id: crypto.randomUUID(), role: 'assistant', text: data.message },
      ]);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          text: 'Вибач, зараз не можу відповісти. Спробуй ще раз 🙏',
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, [input, loading]);

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(o => !o)}
        aria-label="Чат з AI помічником"
        className="fixed bottom-24 right-4 md:bottom-6 md:right-6 z-50 w-14 h-14 rounded-full bg-[var(--accent)] text-[var(--bg-primary)] shadow-lg hover:bg-[var(--accent-hover)] active:scale-95 transition-all flex items-center justify-center text-2xl"
        style={{ boxShadow: '0 4px 24px rgba(159, 211, 86, 0.4)' }}
      >
        {open ? '✕' : '☕'}
      </button>

      {/* Chat window */}
      {open && (
        <div
          className="fixed bottom-44 right-4 md:bottom-24 md:right-6 z-50 w-[calc(100vw-2rem)] max-w-xs sm:max-w-sm flex flex-col rounded-2xl border border-[var(--border)] overflow-hidden"
          style={{
            height: '420px',
            background: 'var(--bg-secondary)',
            boxShadow: '0 8px 40px rgba(0,0,0,0.4)',
          }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 bg-[var(--bg-primary)] border-b border-[var(--border)]">
            <span className="text-xl">🍵</span>
            <div>
              <p className="text-[var(--text-primary)] text-sm font-semibold leading-none">BoosterTea AI</p>
              <p className="text-[var(--text-muted)] text-xs mt-0.5">Помічник з вибору чаю</p>
            </div>
            <div className="ml-auto w-2 h-2 rounded-full bg-[var(--accent)]" title="Online" />
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
            {messages.map(msg => (
              <ChatMessage key={msg.id} message={msg} />
            ))}

            {/* Typing indicator */}
            {loading && (
              <div className="flex items-end gap-2">
                <div className="px-3 py-2 rounded-2xl rounded-bl-sm bg-[var(--bg-primary)] max-w-[70%]">
                  <div className="flex gap-1 items-center h-5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-muted)] animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-muted)] animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-muted)] animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="px-3 py-3 bg-[var(--bg-primary)] border-t border-[var(--border)] flex gap-2">
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Напишіть питання…"
              disabled={loading}
              className="flex-1 bg-[var(--bg-secondary)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] text-sm rounded-xl px-3 py-2 outline-none border border-[var(--border)] focus:border-[var(--accent)] transition-colors disabled:opacity-50"
            />
            <button
              onClick={send}
              disabled={!input.trim() || loading}
              className="w-9 h-9 rounded-xl bg-[var(--accent)] text-[var(--bg-primary)] flex items-center justify-center hover:bg-[var(--accent-hover)] active:scale-95 transition-all disabled:opacity-40 flex-shrink-0"
            >
              <svg className="w-4 h-4 rotate-90" fill="currentColor" viewBox="0 0 24 24">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
