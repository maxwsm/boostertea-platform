'use client';

import React, { useState } from 'react';
import { useTenantStore } from '../../store/tenantStore';
import { Sparkles, Image as ImageIcon, Database, CheckSquare, BrainCircuit } from 'lucide-react';

export default function GenerativeCmsModule() {
  const { activeTenant } = useTenantStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [content, setContent] = useState('');
  
  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setContent(activeTenant === 'funnydrops' 
        ? 'Зустрічайте новий вибуховий смак FunnyDrops: Neon Grape! 🍇 Спеціально для нашої School of Influencers: 100% гідратації, 0% цукру. Поширюйте свої промокоди!' 
        : `Ексклюзивно для D2C-клієнтів: новий осінній пуер від ${activeTenant}. Оформіть підписку сьогодні та розблокуйте лімітований термос у подарунок.`);
      setIsGenerating(false);
    }, 2000);
  }

  return (
    <div className="p-6 rounded-2xl border backdrop-blur-md h-full transition-all" 
         style={{ backgroundColor: '#141720', borderColor: '#252A3A' }}>
         
      <div className="flex justify-between items-center mb-6">
         <h3 className="text-xl font-bold text-white flex items-center gap-2" style={{ fontFamily: 'Syne, sans-serif' }}>
           <BrainCircuit size={20} style={{ color: '#00D4FF' }} />
           Generative CMS
         </h3>
         <span className="text-xs px-2 py-1 rounded font-bold" 
               style={{ backgroundColor: 'rgba(168, 85, 247, 0.1)', color: '#A855F7', textTransform: 'uppercase' }}>
           Tri-Model AI
         </span>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Тема або новий Продукт ({activeTenant})</label>
          <input type="text" placeholder="Напр: Літній смак маракуї, орієнтація на Z-Gen..."
                 className="w-full bg-black/50 border rounded-lg px-3 py-3 text-sm text-white focus:outline-none transition-colors"
                 style={{ borderColor: '#252A3A' }} />
        </div>

        <div className="flex gap-2">
          <button onClick={handleGenerate} disabled={isGenerating}
                  className="flex-1 flex items-center justify-center gap-2 py-2 rounded text-sm transition-all font-semibold"
                  style={{ backgroundColor: isGenerating ? '#1C2030' : 'rgba(0, 212, 255, 0.1)', color: isGenerating ? '#6B7280' : '#00D4FF' }}>
            <Sparkles size={16} className={isGenerating ? 'animate-spin' : ''} /> 
            {isGenerating ? 'AI Генерує...' : 'Згенерувати SEO-Текст'}
          </button>
          
          <button className="flex items-center justify-center gap-2 px-4 py-2 rounded text-sm transition-all font-semibold"
                  style={{ backgroundColor: 'rgba(168, 85, 247, 0.1)', color: '#A855F7' }}>
            <ImageIcon size={16} /> Midjourney
          </button>
        </div>

        {content && (
          <div className="mt-4 p-4 rounded-xl border text-sm text-gray-300 leading-relaxed animate-in fade-in" 
               style={{ backgroundColor: '#0D0F14', borderColor: '#252A3A' }}>
            {content}
            <div className="mt-3 text-right">
               <button className="text-xs font-bold underline transition-colors" style={{ color: '#22D3A5' }}>
                 Опублікувати на Сайт
               </button>
            </div>
          </div>
        )}

        {/* S3 Vault Mock */}
        <div className="mt-6 pt-4 border-t flex justify-between items-center" style={{ borderColor: '#252A3A' }}>
           <div className="flex items-center gap-2 text-xs" style={{ color: '#9CA3AF' }}>
             <Database size={14} /> S3 Media Vault (Cloudflare R2)
           </div>
           
           <button className="flex items-center gap-1 text-xs px-2 py-1 rounded transition-colors" 
                   style={{ backgroundColor: 'rgba(34, 211, 165, 0.1)', color: '#22D3A5' }}>
             <CheckSquare size={12} /> Auto-Sync AWS
           </button>
        </div>
      </div>
    </div>
  );
}
