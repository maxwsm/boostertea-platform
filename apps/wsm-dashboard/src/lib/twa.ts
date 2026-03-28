'use client';

let WebApp: any = null;

if (typeof window !== 'undefined') {
  WebApp = (window as any).Telegram?.WebApp || {};
} else {
  // Safe mock for Next.js Node.js SSR runtime
  WebApp = {
    ready: () => {},
    expand: () => {},
    close: () => {},
    isExpanded: false,
    viewportHeight: 0,
    viewportStableHeight: 0,
    headerColor: '#000000',
    backgroundColor: '#000000',
    setHeaderColor: () => {},
    setBackgroundColor: () => {},
    enableClosingConfirmation: () => {},
    disableClosingConfirmation: () => {},
    isClosingConfirmationEnabled: false,
    onEvent: () => {},
    offEvent: () => {},
    sendData: () => {},
    switchInlineQuery: () => {},
    openLink: () => {},
    openTelegramLink: () => {},
    openInvoice: () => {},
    showPopup: () => {},
    showAlert: () => {},
    showConfirm: () => {},
    showScanQrPopup: () => {},
    closeScanQrPopup: () => {},
    readTextFromClipboard: () => {},
    requestWriteAccess: () => {},
    requestContact: () => {},
    MainButton: {
      text: '',
      color: '',
      textColor: '',
      isVisible: false,
      isActive: false,
      isProgressVisible: false,
      setText: () => {},
      onClick: () => {},
      offClick: () => {},
      show: () => {},
      hide: () => {},
      enable: () => {},
      disable: () => {},
      showProgress: () => {},
      hideProgress: () => {},
      setParams: () => {}
    },
    BackButton: {
      isVisible: false,
      onClick: () => {},
      offClick: () => {},
      show: () => {},
      hide: () => {}
    },
    HapticFeedback: {
      impactOccurred: () => {},
      notificationOccurred: () => {},
      selectionChanged: () => {}
    },
    initData: '',
    initDataUnsafe: {}
  };
}

export default WebApp;
