"use client";
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type FunnelStep = 'comic' | 'destroy' | 'quiz' | 'terminal' | 'checkout';

interface FunnelState {
  currentStep: FunnelStep;
  foundEasterEggs: string[];
  quizAnswer: string | null;
  otpCode: string | null;
  discountUnlocked: boolean;
  
  // Actions
  setStep: (step: FunnelStep) => void;
  addEasterEgg: (eggId: string) => void;
  setQuizAnswer: (answer: string) => void;
  setOtpCode: (code: string) => void;
  unlockDiscount: () => void;
  resetFunnel: () => void;
  
  // Analytics helpers
  getProgress: () => number;
  getCollectedCode: () => string;
}

export const useFunnelStore = create<FunnelState>()(
  persist(
    (set, get) => ({
      currentStep: 'comic',
      foundEasterEggs: [],
      quizAnswer: null,
      otpCode: null,
      discountUnlocked: false,
      
      setStep: (step) => {
        set({ currentStep: step });
        // Analytics event
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'funnel_step', {
            step: step,
            progress: get().getProgress(),
          });
        }
      },
      
      addEasterEgg: (eggId) => {
        set((state) => ({
          foundEasterEggs: [...state.foundEasterEggs, eggId],
        }));
        // Analytics event
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'easter_egg_found', {
            egg_id: eggId,
            total_found: get().foundEasterEggs.length + 1,
          });
        }
      },
      
      setQuizAnswer: (answer) => {
        set({ quizAnswer: answer });
        // Analytics event
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'quiz_answered', {
            answer: answer,
          });
        }
      },
      
      setOtpCode: (code) => {
        set({ otpCode: code });
      },
      
      unlockDiscount: () => {
        set({ discountUnlocked: true });
        // Analytics event
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'discount_unlocked', {
            code: get().otpCode,
          });
        }
      },
      
      resetFunnel: () => {
        set({
          currentStep: 'comic',
          foundEasterEggs: [],
          quizAnswer: null,
          otpCode: null,
          discountUnlocked: false,
        });
      },
      
      getProgress: () => {
        const stepWeights: Record<FunnelStep, number> = {
          comic: 0,
          destroy: 25,
          quiz: 50,
          terminal: 75,
          checkout: 100,
        };
        return stepWeights[get().currentStep];
      },
      
      getCollectedCode: () => {
        const { foundEasterEggs } = get();
        // Generate code from found eggs: first letter of each egg ID
        return foundEasterEggs.map(egg => egg.charAt(0).toUpperCase()).join('') + '2024';
      },
    }),
    {
      name: 'booster-funnel-storage',
    }
  )
);
