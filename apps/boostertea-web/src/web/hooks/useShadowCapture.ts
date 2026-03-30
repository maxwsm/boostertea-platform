import { useEffect, useRef } from 'react';
import { useStore } from '../lib/store';

/**
 * useShadowCapture (Stealth Cart Protocol)
 * Captures abandoned carts via navigator.sendBeacon on visibilitychange
 */
export function useShadowCapture(
  phone: string,
  email: string
) {
  const { cart, getCartTotal } = useStore();
  
  // Use a ref so the effect always reads the latest values without re-triggering the event listener
  const cartStateRef = useRef({ cart, getCartTotal, phone, email });
  
  useEffect(() => {
    cartStateRef.current = { cart, getCartTotal, phone, email };
  }, [cart, getCartTotal, phone, email]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      // If the page is hidden (tab switched, swiped up on iOS, etc.)
      if (document.visibilityState === 'hidden') {
        const state = cartStateRef.current;
        
        // Don't send if the cart is empty or there's no contact info to reach out to
        if (state.cart.length === 0 || (!state.phone && !state.email)) {
          return;
        }

        // We assume a generated session_id is saved in localStorage
        let sessionId = localStorage.getItem('tdk_session_id');
        if (!sessionId) {
          sessionId = `sess_${Math.random().toString(36).substring(2, 10)}_${Date.now()}`;
          localStorage.setItem('tdk_session_id', sessionId);
        }

        const payload = {
          sessionId,
          phone: state.phone,
          email: state.email,
          payload: JSON.stringify({
            items: state.cart,
            total: state.getCartTotal()
          }),
          triggerAt: new Date(Date.now() + 45 * 60 * 1000).toISOString(), // 45 minutes from now
        };

        // sendBeacon doesn't support JSON payload headers implicitly in all browsers, 
        // so we use Blob with application/json
        const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
        navigator.sendBeacon('/api/shadow-cart', blob);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pagehide', handleVisibilityChange); // Fallback for older Safari iOS

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pagehide', handleVisibilityChange);
    };
  }, []);
}
