'use client';

import { useState, useEffect } from 'react';

export type DeviceOS = 'ios' | 'macos' | 'android' | 'desktop' | 'social-webview' | 'unknown';
export type DeviceTier = 'low-end-mobile' | 'mobile-sequence' | 'cinematic-3d' | 'twa-minimal';

export function useDevice() {
  const [os, setOs] = useState<DeviceOS>('unknown');
  const [tier, setTier] = useState<DeviceTier>('cinematic-3d');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Read Edge Middleware flags injected into <body> by layout.tsx
    if (typeof document !== 'undefined') {
      const bodyOs = document.body.getAttribute('data-device-os') as DeviceOS;
      const bodyTier = document.body.getAttribute('data-device-tier') as DeviceTier;
      
      if (bodyOs) setOs(bodyOs);
      if (bodyTier) setTier(bodyTier);
    }
  }, []);

  return {
    os,
    tier,
    isClient,
    isCinematic: tier === 'cinematic-3d',
    isMobileVideo: tier === 'mobile-sequence',
    isTwa: tier === 'twa-minimal'
  };
}
