// ═══════════════════════════════════════════════════════════════════════
// 13WSM13 :: OVERLAY NEURAL UI
// Holographic React layer floating on top of the MasterCanvas Engine.
// Reacts to the user's focus inside the 3D space.
// ═══════════════════════════════════════════════════════════════════════

import { useEffect, useState } from "react";
import { getNlpText } from "../registry/NLPRegistry";

interface OverlayProps {
    activeNlpId: string | null;
    triggerState: string | null;
    onAuthAction?: () => void;
    onCheckoutAction?: () => void;
    onTerminalAction?: () => void;
}

export function OverlayNeuralUI({ activeNlpId, triggerState, onAuthAction, onCheckoutAction, onTerminalAction }: OverlayProps) {
    const [lang, setLang] = useState<'uk' | 'en'>('uk');
    const [visibleData, setVisibleData] = useState<{ title: string, text: string } | null>(null);

    useEffect(() => {
        if (activeNlpId) {
            const data = getNlpText(activeNlpId, lang);
            if (data) setVisibleData(data);
        } else {
            setVisibleData(null);
        }
    }, [activeNlpId, lang]);

    return (
        <div className="pointer-events-none fixed inset-0 z-50 flex flex-col justify-end p-8 md:p-16">
            
            {/* Language Switcher (Interactive) */}
            <div className="pointer-events-auto absolute top-8 right-8 flex gap-4 text-xs font-mono uppercase tracking-widest text-neutral-400">
                <button 
                  onClick={() => setLang('uk')} 
                  className={lang === 'uk' ? 'text-white' : 'hover:text-white transition-colors'}
                >[ UK ]</button>
                <button 
                  onClick={() => setLang('en')}
                  className={lang === 'en' ? 'text-white' : 'hover:text-white transition-colors'}
                >[ EN ]</button>
            </div>

            {/* Neural Information Panel */}
            <div 
                className={`max-w-xl transition-all duration-700 ease-out transform ${visibleData ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}
            >
                {visibleData && (
                    <div className="backdrop-blur-md bg-black/40 border-l-2 border-white/80 p-6 shadow-2xl">
                        <h2 className="text-2xl md:text-4xl font-light text-white mb-4 tracking-wide uppercase">
                            {visibleData.title}
                        </h2>
                        <p className="text-sm md:text-base text-neutral-300 font-mono leading-relaxed">
                            {visibleData.text}
                        </p>
                    </div>
                )}
            </div>

            {/* Grand Induction Trigger (DAO specific) */}
            {triggerState === 'OPEN_WEB3_AUTH' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm pointer-events-auto transition-opacity duration-1000">
                    <button 
                        onClick={() => {
                            if (onAuthAction) onAuthAction();
                        }}
                        className="px-12 py-6 border border-white text-white font-mono text-xl tracking-widest hover:bg-white hover:text-black transition-all transform hover:scale-105"
                    >
                        {lang === 'uk' ? 'СТАТИ КОЧІВНИКОМ (ПІДКЛЮЧИТИ ГАМАНЕЦЬ)' : 'BECOME A NOMAD (CONNECT WALLET)'}
                    </button>
                </div>
            )}

            {/* Commerce Matrix Trigger (Babylon) */}
            {triggerState === 'OPEN_CHECKOUT' && (
                <div className="absolute inset-0 flex items-center justify-center bg-transparent pointer-events-auto mt-32">
                    <button 
                        onClick={() => {
                            if (onCheckoutAction) onCheckoutAction();
                        }}
                        className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white text-white font-mono text-sm tracking-widest hover:bg-white hover:text-black transition-all transform hover:scale-105"
                    >
                        {lang === 'uk' ? 'ІНІЦІЮВАТИ КУПІВЛЮ (BOOSTER TEA)' : 'INITIATE PURCHASE (BOOSTER TEA)'}
                    </button>
                </div>
            )}

            {(triggerState === 'OPEN_CHECKOUT_DINO' || triggerState === 'OPEN_CHECKOUT_FUNNY' || triggerState === 'OPEN_CHECKOUT_TLAB') && (
                <div className="absolute inset-0 flex items-center justify-center bg-transparent pointer-events-auto mt-32">
                    <button 
                        onClick={() => {
                            if (onCheckoutAction) onCheckoutAction();
                        }}
                        className="px-8 py-4 bg-white/10 backdrop-blur-md border border-blue-400 text-blue-400 font-mono text-sm tracking-widest shadow-[0_0_15px_rgba(59,130,246,0.5)] hover:bg-blue-400 hover:text-white transition-all transform hover:scale-105"
                    >
                        {triggerState.replace('OPEN_CHECKOUT_', 'INITIATE PROCUREMENT (')} )
                    </button>
                </div>
            )}

            {triggerState === 'OPEN_GATEKEEPER' && (
                <div className="absolute inset-0 flex items-center justify-center bg-transparent pointer-events-auto mt-32">
                    <button 
                        onClick={() => {
                            if (onTerminalAction) onTerminalAction();
                        }}
                        className="px-8 py-4 bg-black/60 backdrop-blur-md border border-[#0f0] text-[#0f0] shadow-[0_0_15px_rgba(0,255,0,0.5)] font-mono text-lg tracking-widest hover:bg-[#0f0] hover:text-black transition-all transform hover:scale-105"
                    >
                        [ CONNECT_TO_TERMINAL ]
                    </button>
                </div>
            )}
        </div>
    );
}
