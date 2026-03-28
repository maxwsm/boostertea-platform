import React from 'react';
import TenantSwitcher from '@/components/layout/TenantSwitcher';
import UniversalAuthForm from '@/components/auth/UniversalAuthForm';
import DynamicFopRouter from '@/components/commerce/DynamicFopRouter';
import UniversalSubscriptionsTable from '@/components/commerce/UniversalSubscriptionsTable';
import GenerativeCmsModule from '@/components/cms/GenerativeCmsModule';
import SlaSupportHub from '@/components/operations/SlaSupportHub';

export default function SandboxDashboard() {
  return (
    <div className="min-h-screen p-8 text-neutral-100 font-sans" style={{ backgroundColor: '#0D0F14' }}>
      <header className="mb-12 border-b pb-6 flex justify-between items-start" style={{ borderColor: '#252A3A' }}>
        <div>
          <h1 className="text-4xl tracking-tight font-bold" style={{ color: '#00D4FF', fontFamily: 'Syne, sans-serif' }}>
            EcosystemOS <span className="text-white">Laboratory</span>
          </h1>
          <p className="mt-2" style={{ color: '#6B7280' }}>
            Ізольоване "Пісочниця-середовище" для розробки нових PLG-модулів (Tri-Model AI, Business Temperature 36.6°, Checkout FOMO) без ризику для основної платформи.
          </p>
        </div>
        <div className="pt-2">
          <TenantSwitcher />
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Widget 1: Business Temperature */}
        <div className="p-6 rounded-xl border backdrop-blur-md" style={{ backgroundColor: '#141720', borderColor: '#252A3A' }}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white">Температура Бізнесу</h3>
            <span className="px-2 py-1 text-xs font-bold rounded" style={{ backgroundColor: 'rgba(244, 63, 94, 0.2)', color: '#F43F5E' }}>
              Критично
            </span>
          </div>
          <div className="text-5xl mb-2" style={{ color: '#F43F5E', fontFamily: 'JetBrains Mono, monospace' }}>
            37.8°
          </div>
          <p className="text-xs" style={{ color: '#6B7280' }}>
            Розрив ланцюга: 12 рахунків без Актів. Висока загроза по ПДВ. Увімкніть Document Discipline.
          </p>
          <button className="mt-4 w-full py-2 rounded text-sm font-semibold transition-colors" style={{ backgroundColor: 'rgba(244, 63, 94, 0.1)', color: '#F43F5E', border: '1px solid #F43F5E' }}>
            Ескалювати в ClickUp
          </button>
        </div>

        {/* Widget 2: Checkout FOMO Demo */}
        <div className="p-6 rounded-xl border backdrop-blur-md" style={{ backgroundColor: '#141720', borderColor: '#252A3A' }}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">FOMO Checkout (D2C)</h3>
              <span className="px-2 py-1 text-xs font-bold rounded" style={{ backgroundColor: 'rgba(0, 212, 255, 0.2)', color: '#00D4FF' }}>
                Активно
              </span>
            </div>
            <div className="text-5xl mb-2" style={{ color: '#00D4FF', fontFamily: 'JetBrains Mono, monospace' }}>
              14:59
            </div>
            <p className="text-xs" style={{ color: '#6B7280' }}>
              Симуляція таймеру утримання кошика. Модуль впливає на Average Order Value та конверсію.
            </p>
             <button className="mt-4 w-full py-2 rounded text-sm text-black font-semibold transition-colors" style={{ backgroundColor: '#00D4FF' }}>
              Симуляція купівлі
            </button>
        </div>

        {/* AI Copilot Placeholder */}
        <GenerativeCmsModule />
        <SlaSupportHub />
      </div>

      {/* Universal Auth Demo Area */}
      <div className="mt-12 flex justify-center">
        <UniversalAuthForm />
      </div>

      <div className="mt-12 pt-8 border-t" style={{ borderColor: '#252A3A' }}>
         <h2 className="text-2xl tracking-tight font-bold mb-6 text-white" style={{ fontFamily: 'Syne, sans-serif' }}>
            Фаза 2: D2C Commerce & Logistics
         </h2>
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DynamicFopRouter />
            <UniversalSubscriptionsTable />
         </div>
      </div>
    </div>
  );
}
