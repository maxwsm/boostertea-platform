import { useState } from 'react';
import GlitchText from "../../components/ui/GlitchText";

interface PassportProps {
    discoveredCount: number;
    totalCount: number;
    isAuth: boolean;
    onReset: () => void;
}

export function NomadPassport({ discoveredCount, totalCount, isAuth, onReset }: PassportProps) {
    const [expanded, setExpanded] = useState(false);

    const progressPercent = Math.min((discoveredCount / totalCount) * 100, 100).toFixed(1);

    return (
        <div className="fixed top-20 right-8 z-40 pointer-events-auto">
            {/* Minimal Toggle */}
            <div 
                className={`flex items-center gap-3 cursor-pointer transition-all ${expanded ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'}`}
                onClick={() => setExpanded(true)}
            >
                <div className="w-10 h-10 border border-white/20 rounded-full flex items-center justify-center bg-black/50 backdrop-blur-md">
                    <div className={`w-2 h-2 rounded-full ${isAuth ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-red-500 animate-pulse'}`} />
                </div>
                <div className="hidden md:flex flex-col">
                    <span className="font-mono text-[9px] text-white/40 tracking-widest uppercase">
                        {isAuth ? 'VERIFIED NOMAD' : 'GUEST ENTITY'}
                    </span>
                    <span className="font-mono text-[9px] text-white/80 tracking-widest">
                        [{discoveredCount}/{totalCount}] FILES
                    </span>
                </div>
            </div>

            {/* Expanded Passport Card */}
            <div 
                className={`absolute top-0 right-0 w-72 bg-black/90 border-l border-b border-t border-white/20 backdrop-blur-xl p-5 transition-all duration-500 origin-top-right shadow-2xl ${expanded ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
            >
                <div className="flex justify-between items-center mb-6">
                    <GlitchText text="[ NOMAD PASSPORT ]" className="font-mono text-[10px] tracking-[0.3em] text-white" as="div" />
                    <button onClick={() => setExpanded(false)} className="text-white/40 hover:text-white font-mono text-[10px] tracking-widest px-2">X</button>
                </div>

                <div className="space-y-5">
                    {/* Identity Status */}
                    <div className="flex flex-col gap-1 border-b border-white/10 pb-4">
                        <span className="font-mono text-[8px] text-white/30 tracking-widest uppercase">Identity Status</span>
                        {isAuth ? (
                            <span className="font-mono text-xs text-green-400 tracking-widest uppercase">Verified (L1)</span>
                        ) : (
                            <span className="font-mono text-xs text-red-400 tracking-widest uppercase animate-pulse">Unverified Entity</span>
                        )}
                    </div>

                    {/* Progress Bar */}
                    <div className="flex flex-col gap-2 pb-4">
                        <div className="flex justify-between font-mono text-[8px] text-white/50 tracking-widest uppercase">
                            <span>Knowledge Synced</span>
                            <span>{progressPercent}%</span>
                        </div>
                        <div className="w-full h-[2px] bg-white/10">
                            <div 
                                className="h-full bg-white transition-all duration-1000 ease-out" 
                                style={{ width: `${progressPercent}%` }}
                            />
                        </div>
                        <span className="font-mono text-[8px] text-white/30 tracking-widest text-right mt-1">
                            {discoveredCount} / {totalCount} Neural Matrices
                        </span>
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-2 flex justify-between items-center">
                        <button 
                            onClick={onReset}
                            className="font-mono text-[8px] text-red-500/50 hover:text-red-500 tracking-widest uppercase transition-colors"
                        >
                            [ FORMAT ]
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
