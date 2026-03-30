// @ts-nocheck
import React, { useEffect } from 'react';

declare global {
  interface Window {
    fbq: any;
    _fbq: any;
    dataLayer: any[];
  }
}

// GTM ID - To be injected via .env in absolute Production
const GTM_ID = (import.meta as any).env?.VITE_GTM_ID || 'GTM-XXXXXXX';
const PIXEL_ID = (import.meta as any).env?.VITE_META_PIXEL_ID || '1234567890';

export const TelemetryTracker = () => {
  useEffect(() => {
    // 1. Google Tag Manager Injector
    if (!(window as any).dataLayer) {
      (window as any).dataLayer = (window as any).dataLayer || [];
      (window as any).dataLayer.push({'gtm.start': new Date().getTime(), event:'gtm.js'});
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;
      document.head.appendChild(script);
      console.log('📈 [Telemetry] GTM Injected');
    }

    // 2. Meta Pixel Injector
    if (typeof window.fbq === 'undefined') {
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      window.fbq('init', PIXEL_ID);
      window.fbq('track', 'PageView');
      console.log('👁 [Telemetry] Meta Pixel Injected & PageView fired');
    }
  }, []);

  return null;
};

// Global Tracking Helper Functions
export const trackEvent = (eventName: string, data?: any) => {
  if ((window as any).dataLayer) {
    (window as any).dataLayer.push({ event: eventName, ...data });
  }
  if ((window as any).fbq && (eventName === 'Purchase' || eventName === 'AddToCart' || eventName === 'InitiateCheckout')) {
    (window as any).fbq('track', eventName, data);
  }
  console.log(`📊 [Telemetry] Event: ${eventName}`, data || '');
};
