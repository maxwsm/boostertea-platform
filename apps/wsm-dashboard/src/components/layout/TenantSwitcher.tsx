'use client';

import React from 'react';
import { useTenantStore, TenantID } from '../../store/tenantStore';
import { ChevronDown, Coffee, Droplet, Ghost, FlaskConical } from 'lucide-react';

const tenants: Record<TenantID, { name: string, icon: React.ReactNode, color: string }> = {
  boostertea: { name: 'BoosterTea', icon: <Coffee size={16} />, color: '#00D4FF' },
  funnydrops: { name: 'Funny Drops', icon: <Droplet size={16} />, color: '#A855F7' },
  dinoslush:  { name: 'Dino Slush', icon: <Ghost size={16} />, color: '#22C55E' },
  tlab:       { name: 'TLab R&D', icon: <FlaskConical size={16} />, color: '#F43F5E' },
};

export default function TenantSwitcher() {
  const { activeTenant, setActiveTenant } = useTenantStore();
  const [isOpen, setIsOpen] = React.useState(false);

  const active = tenants[activeTenant];

  return (
    <div className="relative inline-block text-left font-sans">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg border backdrop-blur-md transition-all duration-300 hover:opacity-80"
        style={{ 
          backgroundColor: '#141720', 
          borderColor: '#252A3A',
          color: active.color 
        }}
      >
        {active.icon}
        <span className="font-bold text-sm" style={{ fontFamily: 'Syne, sans-serif', letterSpacing: '0.5px' }}>
          {active.name}
        </span>
        <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} style={{ color: '#6B7280' }}/>
      </button>

      {isOpen && (
        <div 
          className="absolute left-0 mt-2 w-48 rounded-xl shadow-2xl border z-50 overflow-hidden"
          style={{ backgroundColor: 'rgba(13, 15, 20, 0.98)', borderColor: '#252A3A', backdropFilter: 'blur(20px)' }}
        >
          <div className="p-1">
            {(Object.entries(tenants) as [TenantID, typeof tenants[TenantID]][]).map(([id, data]) => {
              const isActive = activeTenant === id;
              return (
                <button
                  key={id}
                  onClick={() => {
                    setActiveTenant(id);
                    setIsOpen(false);
                  }}
                  className="flex items-center w-full gap-3 px-3 py-2 text-sm transition-all duration-200 rounded-lg"
                  style={{ 
                    color: isActive ? data.color : '#9CA3AF',
                    backgroundColor: isActive ? `${data.color}15` : 'transparent',
                    transform: isActive ? 'scale(1)' : 'scale(0.98)'
                  }}
                >
                  <div style={{ opacity: isActive ? 1 : 0.6 }}>{data.icon}</div>
                  <span className={isActive ? 'font-bold' : 'font-medium'}>{data.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
