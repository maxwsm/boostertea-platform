(function(){
  const API = '/api/funnel/event';
  const BATCH_API = '/api/funnel/events';
  
  function getSessionId(){
    let sid = sessionStorage.getItem('bt_sid');
    if(!sid){ sid='web_'+Date.now()+'_'+Math.random().toString(36).substr(2,9); sessionStorage.setItem('bt_sid',sid); }
    return sid;
  }
  
  function getUTM(){
    const p = new URLSearchParams(window.location.search);
    return {
      source: p.get('utm_source') || detectSource(),
      medium: p.get('utm_medium') || null,
      campaign: p.get('utm_campaign') || null,
      content: p.get('utm_content') || null,
      term: p.get('utm_term') || null
    };
  }
  
  function detectSource(){
    const r = document.referrer;
    if(!r) return 'direct';
    if(r.includes('instagram.com')) return 'instagram';
    if(r.includes('t.me') || r.includes('telegram')) return 'telegram';
    if(r.includes('tiktok.com')) return 'tiktok';
    if(r.includes('youtube.com') || r.includes('youtu.be')) return 'youtube';
    if(r.includes('facebook.com') || r.includes('fb.com')) return 'facebook';
    if(r.includes('google.')) return 'google';
    if(r.includes('viber')) return 'viber';
    return 'referral';
  }
  
  function track(event, extra){
    const utm = getUTM();
    const data = {
      sessionId: getSessionId(),
      source: utm.source,
      medium: utm.medium,
      campaign: utm.campaign,
      content: utm.content,
      term: utm.term,
      event: event,
      referrerUrl: document.referrer || null,
      ...extra
    };
    if(navigator.sendBeacon){
      navigator.sendBeacon(API, JSON.stringify(data));
    } else {
      fetch(API,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data),keepalive:true}).catch(()=>{});
    }
  }
  
  // Save UTM to sessionStorage for order creation
  function saveUTM(){
    const utm = getUTM();
    sessionStorage.setItem('bt_utm', JSON.stringify(utm));
  }
  
  window.BoosterFunnel = {
    track: track,
    trackPageView: function(){ track('page_view'); },
    trackProductView: function(slug){ track('product_view', {productSlug:slug}); },
    trackAddToCart: function(slug){ track('add_to_cart', {productSlug:slug}); },
    trackCheckoutStart: function(){ track('checkout_start'); },
    trackOrderCreated: function(orderNum){ track('order_created', {orderNumber:orderNum}); },
    getOrderSource: function(){
      const utm = getUTM();
      return {
        source: utm.source || 'site',
        utmSource: utm.source,
        utmMedium: utm.medium,
        utmCampaign: utm.campaign,
        utmContent: utm.content,
        utmTerm: utm.term,
        sessionId: getSessionId(),
        referrerUrl: document.referrer || null
      };
    }
  };
  
  // Auto-track page view
  saveUTM();
  window.BoosterFunnel.trackPageView();
})();
