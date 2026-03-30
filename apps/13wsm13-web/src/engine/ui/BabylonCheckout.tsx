import { useState } from 'react';
import GlitchText from "../../components/ui/GlitchText";

interface CheckoutProps {
    isOpen: boolean;
    onClose: () => void;
}

export function BabylonCheckout({ isOpen, onClose }: CheckoutProps) {
    const [quantity, setQuantity] = useState(1);
    
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl p-4">
            <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, transparent, #000 70%)' }}/>
            
            <div className="relative w-full max-w-3xl bg-black border border-white/20 shadow-2xl overflow-hidden flex flex-col md:flex-row">
                
                {/* Visual / Branding Side */}
                <div className="w-full md:w-1/2 p-8 border-b md:border-b-0 md:border-r border-white/10 flex flex-col justify-between bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]">
                    <div>
                        <span className="font-mono text-[10px] text-white/40 tracking-[0.3em] uppercase">Sector 4 Trade Node</span>
                        <h2 className="text-3xl font-light text-white mt-2 mb-4 tracking-widest"><GlitchText text="BOOSTER TEA" /></h2>
                        <p className="font-mono text-xs text-white/50 leading-relaxed mb-6">
                            Hyper-kinetic liquid formula. Tokenized asset. Neural up-link initiated. Consume to elevate performance.
                        </p>
                    </div>

                    <div className="flex justify-center py-10 opacity-60">
                         <div className="w-32 h-64 border-2 border-white/20 rounded-md relative flex items-center justify-center">
                             <div className="absolute top-2 w-full border-t border-white/40"></div>
                             <div className="absolute bottom-2 w-full border-t border-white/40"></div>
                             <span className="transform -rotate-90 tracking-[0.5em] font-mono text-white/30 text-2xl font-bold">13WSM13</span>
                         </div>
                    </div>
                </div>

                {/* Checkout Ledger Side */}
                <div className="w-full md:w-1/2 p-8 flex flex-col justify-between">
                    <div>
                        <div className="flex justify-between items-center mb-8">
                           <span className="font-mono text-sm text-white tracking-[0.2em]">LEDGER ENTRY</span>
                           <button onClick={onClose} className="text-white/40 hover:text-red-500 font-mono text-sm transition-colors">[ X ]</button>
                        </div>
                        
                        <div className="space-y-6">
                            <div className="flex justify-between items-center border-b border-white/10 pb-4">
                                <span className="font-mono text-xs text-white/60">Price per unit:</span>
                                <span className="font-mono text-sm text-white">$4.20 USDT</span>
                            </div>

                            <div className="flex justify-between items-center bg-white/5 p-4 rounded-sm">
                                <span className="font-mono text-xs text-white/60">Quantity:</span>
                                <div className="flex items-center gap-4">
                                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-white/60 hover:text-white px-2 py-1 bg-black border border-white/20">-</button>
                                    <span className="font-mono text-lg text-white font-bold">{quantity}</span>
                                    <button onClick={() => setQuantity(quantity + 1)} className="text-white/60 hover:text-white px-2 py-1 bg-black border border-white/20">+</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-dashed border-white/20">
                        <div className="flex justify-between items-end mb-6">
                            <span className="font-mono text-[10px] text-white/40 tracking-widest">TOTAL VALUE:</span>
                            <span className="font-mono text-3xl text-green-400 font-bold">${(4.20 * quantity).toFixed(2)}</span>
                        </div>
                        <button 
                            className="w-full py-4 bg-white text-black hover:bg-green-500 hover:text-black font-mono tracking-[0.3em] font-bold transition-all"
                            onClick={() => {
                                alert("Transaction Hash initiated. (Mock)");
                                onClose();
                            }}
                        >
                            EXECUTE CONTRACT
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
