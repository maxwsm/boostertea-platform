import React from 'react';
import { useStore, accessoryProducts } from '../lib/store';

export function UpsellModal() {
  const { isUpsellActive, setUpsellActive, addAccessoryToCart, showToast } = useStore();

  if (!isUpsellActive) return null;

  const thermoses = accessoryProducts.filter(p => p.id.includes('thermos') || p.nameUk.toLowerCase().includes('термос') || p.nameUk.toLowerCase().includes('thermos'));
  const tLabThermos = thermoses.length > 0 ? thermoses[0] : accessoryProducts[0];

  const handleAcceptSet = () => {
    if (tLabThermos) {
      addAccessoryToCart(tLabThermos, 1);
    }
    showToast('toast.addedToCart');
    setUpsellActive(false);
  };

  const handleDecline = () => {
    showToast('toast.addedToCart');
    setUpsellActive(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl animate-in zoom-in-95 duration-500">
        <div className="p-8 text-center flex flex-col items-center">
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mb-6">
            <span className="text-4xl">⚡</span>
          </div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tight mb-4">
            Стій! Ти забув інструмент.
          </h2>
          <p className="text-zinc-400 mb-8 leading-relaxed">
            Пуер розкривається на 100% лише у правильному посуді. Отримай фірмовий термокухоль <span className="text-white font-bold">T-LAB</span> зі 
            <span className="text-red-500 font-bold uppercase"> знижкою 30%</span> та забери сет "Офісний Самурай" просто зараз.
          </p>
          
          <div className="bg-zinc-800/50 rounded-2xl w-full p-4 mb-8 border border-zinc-700/50 flex flex-col items-center gap-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">SET</div>
            <span className="text-5xl mt-2 mb-2">🦇 + 🫖</span>
            <div className="text-lg font-bold text-white">Сет "Офісний Самурай"</div>
          </div>

          <div className="flex flex-col gap-3 w-full mt-2">
            <button 
              onClick={handleAcceptSet}
              className="w-full bg-red-600 text-white py-4 rounded-xl font-black uppercase tracking-wide hover:bg-red-700 transition-colors shadow-[0_0_30px_rgba(220,38,38,0.3)]"
            >
              Додати в кошик (-30%)
            </button>
            <button 
              onClick={handleDecline}
              className="w-full text-zinc-500 py-3 font-medium hover:text-white transition-colors"
            >
              Ні, я буду пити з пластику
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
