(function() {
  'use strict';
  var fbq = function() { return window.fbq || function() {}; };
  var ttq = function() { return window.ttq || { track: function() {} }; };
  var gtag = function() { return window.gtag || function() {}; };
  var dl = function() { return window.dataLayer || []; };

  function trackProductView(id, name, price, category) {
    try {
      gtag()('event', 'view_item', { currency: 'UAH', value: price, items: [{ item_id: id, item_name: name, item_category: category, price: price }] });
      fbq()('track', 'ViewContent', { content_ids: [id], content_name: name, content_type: 'product', content_category: category, value: price, currency: 'UAH' });
      ttq().track('ViewContent', { content_id: id, content_name: name, content_type: 'product', value: price, currency: 'UAH' });
      dl().push({ event: 'view_item', ecommerce: { currency: 'UAH', value: price, items: [{ item_id: id, item_name: name, item_category: category, price: price }] } });
    } catch(e) {}
  }

  function trackAddToCart(id, name, price, category, qty) {
    var q = qty || 1;
    try {
      gtag()('event', 'add_to_cart', { currency: 'UAH', value: price * q, items: [{ item_id: id, item_name: name, item_category: category, price: price, quantity: q }] });
      fbq()('track', 'AddToBasket', { content_ids: [id], content_name: name, content_type: 'product', value: price * q, currency: 'UAH', num_items: q });
      ttq().track('AddToCart', { content_id: id, content_name: name, content_type: 'product', value: price * q, currency: 'UAH', quantity: q });
      dl().push({ event: 'add_to_cart', ecommerce: { currency: 'UAH', value: price * q, items: [{ item_id: id, item_name: name, price: price, quantity: q }] } });
    } catch(e) {}
  }

  function trackPurchase(orderId, total, items) {
    try {
      var gaItems = (items || []).map(function(i) { return { item_id: i.id, item_name: i.name, price: i.price, quantity: i.quantity || 1 }; });
      gtag()('event', 'purchase', { transaction_id: orderId, currency: 'UAH', value: total, items: gaItems });
      fbq()('track', 'CompleteOrder', { content_ids: (items || []).map(function(i) { return i.id; }), content_type: 'product', value: total, currency: 'UAH', num_items: (items || []).reduce(function(s, i) { return s + (i.quantity || 1); }, 0), order_id: orderId });
      ttq().track('Purchase', { content_type: 'product', contents: (items || []).map(function(i) { return { content_id: i.id, content_name: i.name, quantity: i.quantity || 1, price: i.price }; }), value: total, currency: 'UAH' });
      dl().push({ event: 'purchase', ecommerce: { transaction_id: orderId, currency: 'UAH', value: total, items: gaItems } });
    } catch(e) {}
  }

  function trackCheckoutStart(total, items) {
    try {
      var gaItems = (items || []).map(function(i) { return { item_id: i.id, item_name: i.name, price: i.price, quantity: i.quantity || 1 }; });
      gtag()('event', 'begin_checkout', { currency: 'UAH', value: total, items: gaItems });
      fbq()('track', 'InitiateCheckout', { value: total, currency: 'UAH', num_items: gaItems.length });
      ttq().track('InitiateCheckout', { value: total, currency: 'UAH' });
      dl().push({ event: 'begin_checkout', ecommerce: { currency: 'UAH', value: total, items: gaItems } });
    } catch(e) {}
  }

  function trackLead(source) {
    try {
      gtag()('event', 'generate_lead', { event_category: 'engagement', event_label: source || 'website' });
      fbq()('track', 'Lead', { content_name: source || 'website' });
      ttq().track('SubmitForm', { content_name: source || 'website' });
    } catch(e) {}
  }

  function trackRegister(method) {
    try {
      gtag()('event', 'sign_up', { method: method || 'email' });
      fbq()('track', 'CompleteRegistration', { content_name: method || 'email' });
      ttq().track('CompleteRegistration', { content_name: method || 'email' });
    } catch(e) {}
  }

  function trackPageView(path) {
    var url = path || window.location.pathname;
    try {
      gtag()('event', 'page_view', { page_path: url, page_title: document.title });
      fbq()('track', 'PageView');
    } catch(e) {}
  }

  window.BT_Track = {
    viewProduct: trackProductView,
    addToCart: trackAddToCart,
    purchase: trackPurchase,
    checkoutStart: trackCheckoutStart,
    lead: trackLead,
    register: trackRegister,
    pageView: trackPageView
  };

  var origPush = history.pushState;
  history.pushState = function() { origPush.apply(this, arguments); setTimeout(trackPageView, 100); };
  window.addEventListener('popstate', function() { setTimeout(trackPageView, 100); });
})();
