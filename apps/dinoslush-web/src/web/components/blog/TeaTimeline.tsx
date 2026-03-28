"use client";
import { useState } from 'react';
import type { TeaTimelineProps } from '../../lib/blog/types';

export function TeaTimeline({ stages }: TeaTimelineProps) {
  const [activeStage, setActiveStage] = useState<number | null>(null);

  return (
    <div className="my-8 bg-[#1A1410] rounded-2xl border border-[#3A2E22] p-6 overflow-hidden">
      <h4 className="text-[#C4956A] font-semibold mb-6 flex items-center gap-2">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Етапи ферментації
      </h4>
      
      {/* Horizontal Timeline */}
      <div className="relative">
        {/* Progress line */}
        <div className="absolute top-6 left-0 right-0 h-1 bg-[#3A2E22] rounded-full" />
        
        {/* Stages */}
        <div className="relative flex justify-between">
          {stages.map((stage, idx) => (
            <div 
              key={idx}
              className="flex flex-col items-center cursor-pointer group"
              onMouseEnter={() => setActiveStage(idx)}
              onMouseLeave={() => setActiveStage(null)}
            >
              {/* Dot */}
              <div 
                className={`
                  w-12 h-12 rounded-full border-4 flex items-center justify-center transition-all duration-300 z-10
                  ${activeStage === idx 
                    ? 'border-[#C4956A] scale-125 shadow-lg shadow-[#C4956A]/30' 
                    : 'border-[#1A1410]'
                  }
                `}
                style={{ backgroundColor: stage.color }}
              >
                <span className="text-xs font-bold text-white/90">
                  {idx + 1}
                </span>
              </div>
              
              {/* Time label */}
              <span className="mt-3 text-xs text-[#A89880] font-mono whitespace-nowrap">
                {stage.time}
              </span>
              
              {/* Stage label */}
              <span className={`
                mt-1 text-sm font-medium text-center whitespace-nowrap transition-colors
                ${activeStage === idx ? 'text-[#C4956A]' : 'text-[#E8DDD0]'}
              `}>
                {stage.label}
              </span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Active stage description */}
      {activeStage !== null && (
        <div 
          className="mt-6 p-4 rounded-xl bg-[#221C14] border border-[#3A2E22] animate-in fade-in slide-in-from-bottom-2 duration-200"
          style={{ borderLeftColor: stages[activeStage].color, borderLeftWidth: '4px' }}
        >
          <div className="flex items-start gap-3">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: `${stages[activeStage].color}20` }}
            >
              <span 
                className="text-lg"
                style={{ color: stages[activeStage].color }}
              >
                {activeStage + 1}
              </span>
            </div>
            <div>
              <h5 className="text-[#E8DDD0] font-medium mb-1">
                {stages[activeStage].label}
              </h5>
              <p className="text-[#A89880] text-sm">
                {stages[activeStage].description}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
