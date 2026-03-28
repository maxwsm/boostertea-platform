'use client';
import { useRef, useEffect } from 'react';
import { useStore } from '../lib/store';

export function StoreInitializer({ preloadedCart }: { preloadedCart: any }) {
  const store = useStore();
  const initialized = useRef(false);
  
  useEffect(() => {
    if (!initialized.current && preloadedCart) {
      // Smart merge the payload into the browser cart
      store.mergeCarts(preloadedCart);
      initialized.current = true;
      
      // Open drawer nicely and redirect to home without full page reload
      store.setCartDrawerOpen(true);
      if (window.location.pathname !== '/') {
        window.location.href = '/';
      }
    }
  }, [preloadedCart, store]);

  return null;
}

