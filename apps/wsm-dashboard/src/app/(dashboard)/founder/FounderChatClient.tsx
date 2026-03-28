'use client';

import { useChat } from 'ai/react';
import { useRef, useEffect } from 'react';

export default function FounderChatClient() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/founder/chat'
  });
  
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col flex-1 bg-[#050505] rounded-xl border border-white/5 overflow-hidden mt-4 relative shadow-2xl">
      {/* Background Brain Animation */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none flex items-center justify-center">
        <div className="w-[800px] h-[800px] bg-purple-600 rounded-full blur-[150px] mix-blend-screen animate-pulse"></div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 z-10 relative">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center border border-purple-500/50">
              <span className="text-3xl">🧠</span>
            </div>
            <div>
              <h2 className="text-white font-bold text-lg">Master Brain Online</h2>
              <p className="text-gray-500 text-sm max-w-md mx-auto mt-2">
                Федченко Максим Сергійович, система готова до структурного аналізу. Миттєве дзеркалення Архіву Поведінки та фінансовий контроль L&D активовані.
              </p>
            </div>
          </div>
        )}

        {messages.map((m: any, idx: number) => (
          <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl px-5 py-3 ${
              m.role === 'user' 
                ? 'bg-purple-600 text-white' 
                : 'bg-white/5 border border-white/10 text-gray-200'
            }`}>
              <div className="whitespace-pre-wrap text-sm">{m.content}</div>
              
              {/* Render tool invocations quietly */}
              {m.toolInvocations?.map((toolCall: any) => (
                <div key={toolCall.toolCallId} className="mt-2 p-2 bg-black/40 rounded border border-white/10 text-xs text-gray-400 font-mono">
                  {toolCall.state === 'result' ? (
                    <div className="flex items-center gap-2 text-green-400">
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                      [Tool Executed]: {toolCall.toolName}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-purple-400">
                      <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
                      [Calling Tool]: {toolCall.toolName}...
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="p-4 border-t border-white/10 bg-black/50 backdrop-blur z-10 relative">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
            value={input}
            placeholder="Введіть директиву для Master Brain..."
            onChange={handleInputChange}
            disabled={isLoading}
          />
          <button 
            type="submit" 
            disabled={isLoading || !input.trim()}
            className="bg-purple-600 hover:bg-purple-500 text-white px-6 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            Execute
          </button>
        </form>
      </div>
    </div>
  );
}
