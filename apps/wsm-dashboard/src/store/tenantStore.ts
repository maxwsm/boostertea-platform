import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type TenantID = 'boostertea' | 'funnydrops' | 'dinoslush' | 'tlab';

interface TenantState {
  activeTenant: TenantID;
  setActiveTenant: (tenant: TenantID) => void;
}

export const useTenantStore = create<TenantState>()(
  persist(
    (set) => ({
      activeTenant: 'boostertea',
      setActiveTenant: (tenant) => set({ activeTenant: tenant }),
    }),
    {
      name: 'wsm-tenant-storage', // Syncs the chosen active site via localStorage out-of-the-box
    }
  )
);
