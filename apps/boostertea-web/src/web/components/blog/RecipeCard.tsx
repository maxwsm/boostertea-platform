"use client";
import { useState, useCallback } from 'react';
import Link from 'next/link';
import type { RecipeCardProps } from '../../lib/blog/types';
import { pushGTMEvent } from '../../lib/blog/types';

export function RecipeCard({ 
  title, 
  prepTime, 
  servings: initialServings, 
  difficulty, 
  calories,
  ingredients, 
  steps 
}: RecipeCardProps) {
  const [servings, setServings] = useState(initialServings);
  const [checkedSteps, setCheckedSteps] = useState<Set<number>>(new Set());
  const [isPrinting, setIsPrinting] = useState(false);

  const multiplier = servings / initialServings;

  const handleServingsChange = (newServings: number) => {
    if (newServings >= 1 && newServings <= 12) {
      setServings(newServings);
    }
  };

  const toggleStep = (index: number) => {
    setCheckedSteps(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const adjustAmount = (amount: string, mult: number): string => {
    // Try to extract number from amount string
    const match = amount.match(/(\d+(?:\.\d+)?)\s*(.+)/);
    if (match) {
      const num = parseFloat(match[1]);
      const unit = match[2];
      const adjusted = Math.round(num * mult * 10) / 10;
      return `${adjusted} ${unit}`;
    }
    return amount;
  };

  const handlePrint = useCallback(() => {
    setIsPrinting(true);
    pushGTMEvent({
      event: 'blog_recipe_print',
      article_slug: window.location.pathname.split('/').pop() || '',
      recipe_name: title
    });
    
    // Small delay to ensure GTM event is sent
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 100);
  }, [title]);

  const difficultyColor = {
    'легко': '#7CB342',
    'середня': '#FFB300',
    'складно': '#E53935'
  }[difficulty];

  return (
    <div className="bg-[#1A1410] rounded-2xl border border-[#3A2E22] overflow-hidden my-8 print:shadow-none print:border-gray-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#2D1810] to-[#1A1410] p-6 border-b border-[#3A2E22]">
        <h3 className="text-xl font-semibold text-[#E8DDD0] mb-4" style={{ fontFamily: '"Playfair Display", serif' }}>
          {title}
        </h3>
        
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2 text-[#A89880]">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {prepTime}
          </div>
          
          <div className="flex items-center gap-2 text-[#A89880]">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {servings} {servings === 1 ? 'порція' : servings < 5 ? 'порції' : 'порцій'}
          </div>
          
          <div 
            className="flex items-center gap-2 px-2.5 py-0.5 rounded-full text-xs font-medium"
            style={{ backgroundColor: `${difficultyColor}20`, color: difficultyColor }}
          >
            {difficulty}
          </div>
          
          {calories && (
            <div className="flex items-center gap-2 text-[#A89880]">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
              </svg>
              ~{Math.round(calories * multiplier)} ккал
            </div>
          )}
        </div>
      </div>
      
      {/* Servings Control */}
      <div className="px-6 py-4 border-b border-[#3A2E22] bg-[#221C14]">
        <div className="flex items-center justify-between">
          <span className="text-sm text-[#A89880]">Кількість порцій:</span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleServingsChange(servings - 1)}
              disabled={servings <= 1}
              className="w-8 h-8 rounded-lg bg-[#3A2E22] text-[#E8DDD0] hover:bg-[#C4956A] hover:text-[#0F0B08] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              −
            </button>
            <span className="text-[#E8DDD0] font-medium w-8 text-center">{servings}</span>
            <button
              onClick={() => handleServingsChange(servings + 1)}
              disabled={servings >= 12}
              className="w-8 h-8 rounded-lg bg-[#3A2E22] text-[#E8DDD0] hover:bg-[#C4956A] hover:text-[#0F0B08] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              +
            </button>
          </div>
        </div>
      </div>
      
      {/* Ingredients */}
      <div className="p-6 border-b border-[#3A2E22]">
        <h4 className="text-[#C4956A] font-semibold mb-4 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          Інгредієнти
        </h4>
        <ul className="space-y-2">
          {ingredients.map((ing, idx) => (
            <li key={idx} className="flex items-center justify-between py-2 border-b border-[#3A2E22]/50 last:border-0">
              <span className="text-[#E8DDD0]">
                {ing.link ? (
                  <Link href={ing.link} className="hover:text-[#C4956A] transition-colors underline decoration-[#C4956A]/30">
                    {ing.name}
                  </Link>
                ) : ing.name}
              </span>
              <span className="text-[#A89880] text-sm font-mono">
                {adjustAmount(ing.amount, multiplier)}
              </span>
            </li>
          ))}
        </ul>
      </div>
      
      {/* Steps */}
      <div className="p-6">
        <h4 className="text-[#C4956A] font-semibold mb-4 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
          Приготування
        </h4>
        <ol className="space-y-3">
          {steps.map((step, idx) => (
            <li 
              key={idx}
              onClick={() => toggleStep(idx)}
              className={`
                flex gap-4 p-3 rounded-lg cursor-pointer transition-all
                ${checkedSteps.has(idx) 
                  ? 'bg-[#C4956A]/10 opacity-60' 
                  : 'bg-[#221C14] hover:bg-[#2D1810]'
                }
              `}
            >
              <div className={`
                w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0
                ${checkedSteps.has(idx)
                  ? 'bg-[#C4956A] text-[#0F0B08]'
                  : 'bg-[#3A2E22] text-[#C4956A]'
                }
              `}>
                {checkedSteps.has(idx) ? '✓' : idx + 1}
              </div>
              <span className={`text-[#E8DDD0] ${checkedSteps.has(idx) ? 'line-through text-[#A89880]' : ''}`}>
                {step}
              </span>
            </li>
          ))}
        </ol>
      </div>
      
      {/* Footer actions */}
      <div className="px-6 py-4 bg-[#221C14] border-t border-[#3A2E22] flex flex-wrap gap-3 print:hidden">
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 bg-[#3A2E22] text-[#E8DDD0] rounded-lg hover:bg-[#C4956A] hover:text-[#0F0B08] transition-colors text-sm font-medium"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Друк
        </button>
        
        <Link
          href="/products"
          className="flex items-center gap-2 px-4 py-2 bg-[#C4956A] text-[#0F0B08] rounded-lg hover:bg-[#D4A57A] transition-colors text-sm font-medium ml-auto"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          Замовити продукти
        </Link>
      </div>
    </div>
  );
}
