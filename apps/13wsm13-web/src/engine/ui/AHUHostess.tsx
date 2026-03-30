import React, { useState, useRef, useEffect } from 'react';
import { useAHU } from '../hooks/useAHU';

export function AHUHostess({ setGlobalHighlight }: { setGlobalHighlight: (topic: string | null) => void }) {
    const { messages, isThinking, sendMessage, highlightedTopic } = useAHU();
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const endRef = useRef<HTMLDivElement>(null);

    // Sync the highlighted topic with the Master Canvas
    useEffect(() => {
        setGlobalHighlight(highlightedTopic);
    }, [highlightedTopic, setGlobalHighlight]);

    useEffect(() => {
        if (isOpen) {
            endRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isOpen, isThinking]);

    const handleSend = () => {
        if (!input.trim() || isThinking) return;
        sendMessage(input);
        setInput('');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSend();
    };

    if (!isOpen) {
        return (
            <div className="fixed bottom-6 right-6 z-40 pointer-events-auto flex flex-col items-center">
                <div className="text-white/50 font-mono text-xs mb-2 tracking-widest">[ SYSTEM AHU ]</div>
                <button 
                    onClick={() => setIsOpen(true)}
                    className="w-16 h-16 rounded-full bg-black/60 border border-[#0ff] shadow-[0_0_20px_rgba(0,255,255,0.4)] flex items-center justify-center hover:scale-110 transition-transform overflow-hidden group"
                >
                    <div className="absolute inset-0 bg-[#0ff] opacity-0 group-hover:opacity-20 transition-opacity"></div>
                    <span className="text-2xl">👁‍🗨</span>
                </button>
            </div>
        );
    }

    return (
        <div className="fixed bottom-6 right-6 w-96 max-w-[calc(100vw-3rem)] z-50 pointer-events-auto bg-black/80 backdrop-blur-xl border border-[#0ff] shadow-[0_0_30px_rgba(0,255,255,0.2)] flex flex-col rounded-md overflow-hidden transition-all">
            
            {/* Header */}
            <div className="flex justify-between items-center p-3 border-b border-[#0ff]/30 bg-[#0ff]/5">
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full border border-[#0ff] flex items-center justify-center bg-black">
                        <span className={`text-sm ${isThinking ? 'animate-pulse' : ''}`}>👁‍🗨</span>
                    </div>
                    <div>
                        <div className="font-mono text-[#0ff] text-sm tracking-widest font-bold">AHU</div>
                        <div className="font-mono text-[#0ff]/50 text-[10px]">AI HOSTESS UNIT (V.2)</div>
                    </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-[#0ff]/50 hover:text-[#0ff] font-mono p-2">
                    [X]
                </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 p-4 h-80 overflow-y-auto font-mono text-sm space-y-4">
                {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] p-3 border ${
                            msg.role === 'user' 
                                ? 'bg-white/10 border-white/30 text-white rounded-tl-xl rounded-tr-xl rounded-bl-xl' 
                                : 'bg-[#0ff]/10 border-[#0ff]/30 text-[#0ff] rounded-tr-xl rounded-br-xl rounded-bl-xl shadow-[0_0_10px_rgba(0,255,255,0.1)]'
                        }`}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                {isThinking && (
                    <div className="flex justify-start">
                        <div className="p-3 bg-[#0ff]/5 border border-[#0ff]/20 text-[#0ff]/50 rounded-tr-xl rounded-br-xl rounded-bl-xl flex space-x-1">
                            <span className="animate-bounce">.</span>
                            <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>.</span>
                            <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>.</span>
                        </div>
                    </div>
                )}
                <div ref={endRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-[#0ff]/30 bg-black flex space-x-2">
                <input 
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isThinking}
                    placeholder="Ask AHU about the Fort..."
                    className="flex-1 bg-transparent border border-[#0ff]/50 px-3 py-2 text-[#0ff] font-mono text-sm outline-none focus:border-[#0ff]"
                />
                <button 
                    onClick={handleSend}
                    disabled={isThinking || !input.trim()}
                    className="px-4 py-2 bg-[#0ff]/20 border border-[#0ff] hover:bg-[#0ff] hover:text-black text-[#0ff] font-mono text-sm transition-colors"
                >
                    &gt;
                </button>
            </div>
        </div>
    );
}
