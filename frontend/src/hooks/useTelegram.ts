import { useEffect, useState } from 'react';

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
}

interface TelegramMainButton {
  text: string;
  color: string;
  textColor: string;
  isVisible: boolean;
  isActive: boolean;
  isProgressVisible: boolean;
  setText: (text: string) => void;
  onClick: (callback: () => void) => void;
  offClick: (callback: () => void) => void;
  show: () => void;
  hide: () => void;
  enable: () => void;
  disable: () => void;
  showProgress: (leaveActive?: boolean) => void;
  hideProgress: () => void;
}

interface TelegramBackButton {
  isVisible: boolean;
  onClick: (callback: () => void) => void;
  offClick: (callback: () => void) => void;
  show: () => void;
  hide: () => void;
}

interface TelegramWebApp {
  initData: string;
  initDataUnsafe: {
    user?: TelegramUser;
    query_id?: string;
    auth_date?: number;
    hash?: string;
  };
  version: string;
  platform: string;
  colorScheme: 'light' | 'dark';
  themeParams: {
    bg_color?: string;
    text_color?: string;
    hint_color?: string;
    link_color?: string;
    button_color?: string;
    button_text_color?: string;
    secondary_bg_color?: string;
  };
  isExpanded: boolean;
  viewportHeight: number;
  viewportStableHeight: number;
  headerColor: string;
  backgroundColor: string;
  isClosingConfirmationEnabled: boolean;
  MainButton: TelegramMainButton;
  BackButton: TelegramBackButton;
  ready: () => void;
  expand: () => void;
  close: () => void;
  enableClosingConfirmation: () => void;
  disableClosingConfirmation: () => void;
  onEvent: (eventType: string, callback: () => void) => void;
  offEvent: (eventType: string, callback: () => void) => void;
  sendData: (data: string) => void;
  switchInlineQuery: (query: string, choose_chat_types?: string[]) => void;
  openLink: (url: string, options?: { try_instant_view?: boolean }) => void;
  openTelegramLink: (url: string) => void;
  openInvoice: (url: string, callback?: (status: string) => void) => void;
  showPopup: (params: {
    title?: string;
    message: string;
    buttons?: Array<{
      id?: string;
      type?: 'default' | 'ok' | 'close' | 'cancel' | 'destructive';
      text?: string;
    }>;
  }, callback?: (button_id: string) => void) => void;
  showAlert: (message: string, callback?: () => void) => void;
  showConfirm: (message: string, callback?: (confirmed: boolean) => void) => void;
  showScanQrPopup: (params?: { text?: string }, callback?: (data: string) => void) => void;
  closeScanQrPopup: () => void;
  readTextFromClipboard: (callback?: (text: string) => void) => void;
  requestWriteAccess: (callback?: (granted: boolean) => void) => void;
  requestContact: (callback?: (sent: boolean) => void) => void;
  HapticFeedback: {
    impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
    notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
    selectionChanged: () => void;
  };
  CloudStorage: {
    setItem: (key: string, value: string, callback?: (error: string | null, result?: boolean) => void) => void;
    getItem: (key: string, callback?: (error: string | null, result?: string) => void) => void;
    getItems: (keys: string[], callback?: (error: string | null, result?: Record<string, string>) => void) => void;
    removeItem: (key: string, callback?: (error: string | null, result?: boolean) => void) => void;
    removeItems: (keys: string[], callback?: (error: string | null, result?: boolean) => void) => void;
    getKeys: (callback?: (error: string | null, result?: string[]) => void) => void;
  };
  BiometricManager: {
    isInited: boolean;
    isBiometricAvailable: boolean;
    biometricType: 'finger' | 'face' | 'unknown';
    isAccessRequested: boolean;
    isAccessGranted: boolean;
    isBiometricTokenSaved: boolean;
    deviceId: string;
    init: (callback?: () => void) => void;
    requestAccess: (params: { reason?: string }, callback?: (granted: boolean) => void) => void;
    authenticate: (params: { reason?: string }, callback?: (success: boolean, token?: string) => void) => void;
    updateBiometricToken: (token: string, callback?: (updated: boolean) => void) => void;
    openSettings: () => void;
  };
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
}

export const useTelegram = () => {
  const [telegram, setTelegram] = useState<TelegramWebApp | null>(null);
  const [user, setUser] = useState<TelegramUser | null>(null);
  
  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    
    if (tg) {
      setTelegram(tg);
      setUser(tg.initDataUnsafe.user || null);
      
      // Set theme
      document.documentElement.style.setProperty('--tg-theme-bg-color', tg.themeParams.bg_color || '#1a1a1a');
      document.documentElement.style.setProperty('--tg-theme-text-color', tg.themeParams.text_color || '#ffffff');
      document.documentElement.style.setProperty('--tg-theme-hint-color', tg.themeParams.hint_color || '#9CA3AF');
      document.documentElement.style.setProperty('--tg-theme-link-color', tg.themeParams.link_color || '#8B5CF6');
      document.documentElement.style.setProperty('--tg-theme-button-color', tg.themeParams.button_color || '#8B5CF6');
      document.documentElement.style.setProperty('--tg-theme-button-text-color', tg.themeParams.button_text_color || '#ffffff');
    }
  }, []);
  
  const ready = () => {
    if (telegram) {
      telegram.ready();
    }
  };
  
  const expand = () => {
    if (telegram) {
      telegram.expand();
    }
  };
  
  const close = () => {
    if (telegram) {
      telegram.close();
    }
  };
  
  const sendData = (data: string) => {
    if (telegram) {
      telegram.sendData(data);
    }
  };
  
  const showMainButton = (text: string, onClick: () => void) => {
    if (telegram?.MainButton) {
      telegram.MainButton.setText(text);
      telegram.MainButton.onClick(onClick);
      telegram.MainButton.show();
      telegram.MainButton.enable();
    }
  };
  
  const hideMainButton = () => {
    if (telegram?.MainButton) {
      telegram.MainButton.hide();
    }
  };
  
  const showBackButton = (onClick: () => void) => {
    if (telegram?.BackButton) {
      telegram.BackButton.onClick(onClick);
      telegram.BackButton.show();
    }
  };
  
  const hideBackButton = () => {
    if (telegram?.BackButton) {
      telegram.BackButton.hide();
    }
  };
  
  const hapticFeedback = (type: 'impact' | 'notification' | 'selection', style?: string) => {
    if (telegram?.HapticFeedback) {
      switch (type) {
        case 'impact':
          telegram.HapticFeedback.impactOccurred((style as any) || 'medium');
          break;
        case 'notification':
          telegram.HapticFeedback.notificationOccurred((style as any) || 'success');
          break;
        case 'selection':
          telegram.HapticFeedback.selectionChanged();
          break;
      }
    }
  };
  
  return {
    telegram,
    user,
    ready,
    expand,
    close,
    sendData,
    showMainButton,
    hideMainButton,
    showBackButton,
    hideBackButton,
    hapticFeedback,
  };
};