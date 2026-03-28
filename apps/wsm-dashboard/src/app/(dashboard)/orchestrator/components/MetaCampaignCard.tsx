"use client";

import { useState } from 'react';
import { Rocket, Loader2, CheckCircle, AlertTriangle } from 'lucide-react';

interface Suggestion {
  id: string;
  targetAudience: string;
  headline: string;
  primaryText: string;
  cta: string;
}

interface MetaCampaignCardProps {
  suggestion: Suggestion;
}

export function MetaCampaignCard({ suggestion }: MetaCampaignCardProps) {
  const [headline, setHeadline] = useState(suggestion.headline);
  const [primaryText, setPrimaryText] = useState(suggestion.primaryText);
  const [dailyBudget, setDailyBudget] = useState('20'); // Бюджет у USD
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const handleLaunch = async () => {
    setStatus('loading');
    try {
      const response = await fetch('/api/orchestrator/meta/launch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          headline,
          primaryText,
          dailyBudget: parseInt(dailyBudget, 10) * 100, // Надсилаємо в центах
          audience: suggestion.targetAudience, // В реальності тут буде ID аудиторії
          cta: suggestion.cta,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Невідома помилка сервера');
      }

      setStatus('success');
      alert(`✅ Кампанію успішно поставлено в чергу! ID: ${result.jobId}`);
    } catch (error) {
      setStatus('error');
      alert(`❌ Помилка запуску кампанії: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  return (
    <div className="flex flex-col bg-[#111] border border-white/10 rounded-xl p-4">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-white">AI Креатив: Meta</h3>
        <p className="text-sm text-gray-400">Аудиторія: {suggestion.targetAudience}</p>
      </div>
      <div className="flex-grow space-y-4">
        <div>
          <label htmlFor={`headline-${suggestion.id}`} className="text-sm text-gray-300 block mb-1">Заголовок</label>
          <textarea id={`headline-${suggestion.id}`} value={headline} onChange={(e: any) => setHeadline(e.target.value)} className="w-full bg-[#050505] border border-white/10 rounded px-3 py-2 text-sm text-white" />
        </div>
        <div>
          <label htmlFor={`primaryText-${suggestion.id}`} className="text-sm text-gray-300 block mb-1">Основний текст</label>
          <textarea id={`primaryText-${suggestion.id}`} value={primaryText} onChange={(e: any) => setPrimaryText(e.target.value)} rows={5} className="w-full bg-[#050505] border border-white/10 rounded px-3 py-2 text-sm text-white" />
        </div>
        <div>
          <label htmlFor={`budget-${suggestion.id}`} className="text-sm text-gray-300 block mb-1">Денний бюджет ($)</label>
          <input id={`budget-${suggestion.id}`} type="number" value={dailyBudget} onChange={(e: any) => setDailyBudget(e.target.value)} className="w-full bg-[#050505] border border-white/10 rounded px-3 py-2 text-sm text-white" />
        </div>
      </div>
      <div className="mt-6">
        <button onClick={handleLaunch} disabled={status === 'loading'} className="flex items-center justify-center w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded transition-colors">
          {status === 'loading' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {status === 'success' && <CheckCircle className="mr-2 h-4 w-4" />}
          {status === 'error' && <AlertTriangle className="mr-2 h-4 w-4" />}
          {status === 'loading' ? 'Запускаємо...' : status === 'success' ? 'В черзі' : '🚀 Запустити Кампанію'}
        </button>
      </div>
    </div>
  );
}
