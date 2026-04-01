// @ts-nocheck
'use client';

import { useState, useEffect, useRef } from 'react';
import { useChat } from 'ai/react';
import ChatMessage from './ChatMessage';

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // We connect directly to the Master Dashboard API proxy
  // In production, this would be an environment variable
  const API_PROXY_URL = process.env.NEXT_PUBLIC_AI_PROXY_URL || 'https://boostertea.com.ua/api/chat/gemini';

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: API_PROXY_URL,
    body: {
      brandId: 'boostertea' // Specific to this website
    },
    initialMessages: [
      {
        id: 'greeting',
        role: 'assistant',
        content: 'Привіт! Я Gemini, універсальний помічник BoosterTea 🍵 Що шукаєш?',
      }
    ]
  });

  // Scroll to bottom on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    handleSubmit(e);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onFormSubmit(e as any);
    }
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Чат з AI помічником"
        className="fixed bottom-24 right-4 md:bottom-6 md:right-6 z-[9999] w-14 h-14 rounded-full bg-[var(--accent)] text-[var(--bg-primary)] shadow-lg hover:bg-[var(--accent-hover)] active:scale-95 transition-all flex items-center justify-center text-2xl"
        style={{ boxShadow: '0 4px 24px rgba(159, 211, 86, 0.4)' }}
      >
        {open ? '✕' : '✨'}
      </button>

      {/* Chat window */}
      {open && (
        <div
          className="fixed bottom-44 right-4 md:bottom-24 md:right-6 z-[9999] w-[calc(100vw-2rem)] max-w-xs sm:max-w-sm flex flex-col rounded-2xl border border-[var(--border)] overflow-hidden"
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
              <p className="text-[var(--text-primary)] text-sm font-semibold leading-none">Gemini Omni-Assistant</p>
              <p className="text-[var(--text-muted)] text-xs mt-0.5">Powered by Google AI (BoosterTea)</p>
            </div>
            <div className="ml-auto w-2 h-2 rounded-full bg-[var(--accent)]" title="Online" />
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={{ id: msg.id, role: msg.role as 'user' | 'assistant', text: msg.content }} />
            ))}

            {/* Typing indicator */}
            {isLoading && (
              <div className="flex items-end gap-2">
                <div className="px-3 py-2 rounded-2xl rounded-bl-sm bg-[var(--bg-primary)] max-w-[70%] text-xs text-gray-500">
                  Gemini is thinking...
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
              onChange={handleInputChange}
              onKeyDown={handleKey}
              placeholder="Спитайте Gemini..."
              disabled={isLoading}
              className="flex-1 bg-[var(--bg-secondary)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] text-sm rounded-xl px-3 py-2 outline-none border border-[var(--border)] focus:border-[var(--accent)] transition-colors disabled:opacity-50"
            />
            <button
              onClick={onFormSubmit as any}
              disabled={!input.trim() || isLoading}
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
