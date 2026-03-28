'use client';

import { useState } from 'react';
import { Search, Send, User as UserIcon, Bot, Info, Clock } from 'lucide-react';

export default function SupportHubClient({ initialMemories }: { initialMemories: any[] }) {
  const [memories, setMemories] = useState(initialMemories);
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [replyText, setReplyText] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleReply = async () => {
    if (!replyText.trim() || !selectedChat) return;

    try {
      setIsSending(true);
      const res = await fetch('/api/support/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memoryId: selectedChat.id,
          text: replyText
        })
      });

      if (res.ok) {
        const updatedMemory = await res.json();
        const newMemories = memories.map(m => m.id === updatedMemory.id ? updatedMemory : m);
        setMemories(newMemories);
        setSelectedChat(updatedMemory);
        setReplyText('');
      } else {
        alert('Помилка відправки повідомлення');
      }
    } catch(e) {
    } finally {
      setIsSending(false);
    }
  };

  const renderHistory = (contextStr: string) => {
    try {
      const history = JSON.parse(contextStr);
      if (!Array.isArray(history)) throw new Error('Not an array');

      return history.map((msg: any, idx: number) => {
        const isUser = msg.role === 'user';
        return (
          <div key={idx} className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
            <div className={`max-w-[70%] rounded-xl p-3 text-sm ${isUser ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-[#1e1e1e] border border-white/10 text-gray-200 rounded-bl-none'}`}>
              <div className="flex items-center gap-1 mb-1 opacity-50 text-[10px] font-bold uppercase">
                {isUser ? <UserIcon size={12}/> : <Bot size={12}/>}
                {isUser ? 'Client' : 'Agent / Human'}
              </div>
              {msg.parts?.[0]?.text || JSON.stringify(msg)}
            </div>
          </div>
        );
      });
    } catch (e) {
      return (
        <div className="bg-[#1e1e1e] border border-red-500/20 text-red-400 p-3 rounded-xl text-xs font-mono mb-4 overflow-x-auto whitespace-pre-wrap">
          [RAW CONTEXT]
          {contextStr}
        </div>
      );
    }
  };

  return (
    <div className="flex flex-1 overflow-hidden bg-[#050505] rounded-xl border border-white/5">
      
      {/* Left Pane: Inbox List */}
      <div className="w-80 flex flex-col border-r border-white/5 bg-[#0a0a0a]">
        <div className="p-4 border-b border-white/5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input 
              placeholder="Пошук по ID клієнта..."
              className="w-full bg-[#111] border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm text-gray-300 focus:border-indigo-500 outline-none"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {memories.map((m) => (
            <div 
              key={m.id} 
              onClick={() => setSelectedChat(m)}
              className={`p-4 border-b border-white/5 cursor-pointer hover:bg-white/5 transition-colors ${selectedChat?.id === m.id ? 'bg-indigo-500/10 border-l-4 border-l-indigo-500' : 'border-l-4 border-l-transparent'}`}
            >
              <div className="flex justify-between items-start mb-1">
                <span className="text-xs font-bold text-gray-300 block truncate pr-2" title={m.userId}>{m.userId}</span>
                <span className="text-[10px] text-gray-500 whitespace-nowrap"><Clock size={10} className="inline mr-1 mb-0.5"/>{new Date(m.updatedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">{m.agent.brand.name}</span>
                <span className="text-[10px] text-gray-500 truncate">{m.agent.name}</span>
              </div>
            </div>
          ))}
          {memories.length === 0 && (
            <div className="p-6 text-center text-xs text-gray-500">
              Історія пуста.
            </div>
          )}
        </div>
      </div>

      {/* Right Pane: Chat History & Input */}
      <div className="flex-1 flex flex-col bg-[#111]">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 bg-[#161616] border-b border-white/5 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <UserIcon size={16} className="text-gray-400"/> {selectedChat.userId}
                </h3>
                <p className="text-xs text-indigo-400 mt-0.5 flex items-center gap-1">
                  Обслуговує: {selectedChat.agent.name} ({selectedChat.agent.brand.name})
                </p>
              </div>
              <button className="text-gray-500 hover:text-white transition-colors" title="Інформація">
                <Info size={18} />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
              {renderHistory(selectedChat.context)}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-[#0a0a0a] border-t border-white/5">
              <div className="flex gap-2">
                <input 
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleReply()}
                  placeholder="Відповісти ескалованому клієнту напряму (через бота)..."
                  className="flex-1 bg-[#161616] border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-300 focus:border-indigo-500 outline-none"
                />
                <button 
                  onClick={handleReply}
                  disabled={isSending || !replyText.trim()}
                  className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white w-12 rounded-xl flex items-center justify-center transition-colors"
                >
                  <Send size={18} className={isSending ? 'animate-pulse' : ''} />
                </button>
              </div>
              <p className="text-[10px] text-gray-500 mt-2 text-center">
                Відповідь буде надіслана користувачу у його месенджер від імені платформи {selectedChat.agent.brand.name}.
              </p>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-sm text-gray-500">
            Оберіть чат ліворуч для перегляду та відповіді
          </div>
        )}
      </div>

    </div>
  );
}
