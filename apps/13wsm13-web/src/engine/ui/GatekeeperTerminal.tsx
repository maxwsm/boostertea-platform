import React, { useState, useEffect, useRef } from 'react';

interface TerminalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function GatekeeperTerminal({ isOpen, onClose }: TerminalProps) {
    const [input, setInput] = useState('');
    const [logs, setLogs] = useState<{ text: string, type: 'user' | 'system' }[]>([]);
    const endRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen && logs.length === 0) {
            setLogs([
                { text: "> INITIATING LOCAL HANDSHAKE...", type: 'system' },
                { text: "> SYSTEM IDENTITY: [ THE ARCHIVATOR ] V. 3.0.030.2x13", type: 'system' },
                { text: "> STATE: AWAITING COMMAND OR INQUIRY.", type: 'system' }
            ]);
        }
    }, [isOpen]);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [logs]);

    if (!isOpen) return null;

    const handleGenerate = (query: string) => {
        const lowerQ = query.toLowerCase();
        let reply = "UNKNOWN DIRECTIVE. COMMAND LOGGED FOR REVIEW.";
        
        if (lowerQ.includes('hello') || lowerQ.includes('привіт')) {
            reply = "GREETINGS, NOMAD. THE MATRIX IS LISTENING.";
        } else if (lowerQ.includes('13wsm13')) {
            reply = "13WSM13 IS THE ARCHITECTURE OF YOUR NEW REALITY. NOTHING LEFT TO HIDE.";
        } else if (lowerQ.includes('booster') || lowerQ.includes('tea')) {
            reply = "SECTOR 4 ENGAGED. BOOSTER TEA IS AVAILABLE FOR PROCUREMENT.";
        } else if (lowerQ.includes('clear')) {
            setLogs([]); return;
        }

        setTimeout(() => {
            setLogs(prev => [...prev, { text: `> ${reply}`, type: 'system' }]);
        }, 600);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && input.trim() !== '') {
            setLogs(prev => [...prev, { text: `$ ${input}`, type: 'user' }]);
            handleGenerate(input);
            setInput('');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl transition-all duration-500">
            <div className="relative w-full max-w-4xl h-[80vh] bg-black border border-[#0f0] shadow-[0_0_30px_rgba(0,255,0,0.1)] rounded-sm flex flex-col overflow-hidden">
                
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-[#0f0]/30 bg-[#0f0]/5">
                    <div className="font-mono text-[#0f0] tracking-widest text-sm font-bold flex items-center space-x-2">
                        <span className="w-2 h-2 bg-[#0f0] rounded-full animate-pulse"></span>
                        <span>TERMINAL /// AI GATEKEEPER</span>
                    </div>
                    <button 
                        onClick={onClose}
                        className="text-[#0f0] hover:text-white hover:bg-[#0f0] px-3 py-1 font-mono text-sm border border-[#0f0] transition-colors"
                    >
                        [ CLOSE_CONN ]
                    </button>
                </div>

                {/* Console Output */}
                <div className="flex-1 overflow-y-auto p-6 font-mono text-sm md:text-base space-y-2">
                    {logs.map((log, i) => (
                        <div key={i} className={`${log.type === 'user' ? 'text-gray-400' : 'text-[#0f0]'}`}>
                            {log.text}
                        </div>
                    ))}
                    <div ref={endRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-[#0f0]/30 bg-[#0f0]/5 flex items-center">
                    <span className="text-[#0f0] font-mono mr-3 text-xl">$</span>
                    <input 
                        type="text"
                        autoFocus
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="flex-1 bg-transparent border-none outline-none text-[#0f0] font-mono text-lg placeholder-[#0f0]/30"
                        placeholder="AWAITING PROMPT..."
                    />
                </div>
            </div>
            
            {/* Scanline CRT overlay */}
            <div className="absolute inset-0 pointer-events-none bg-[repeating-linear-gradient(transparent,transparent_2px,rgba(0,255,0,0.05)_3px)]"></div>
        </div>
    );
}
