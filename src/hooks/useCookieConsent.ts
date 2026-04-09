'use client';

import { useState, useEffect, useCallback } from 'react';

export type CookieCategory = 'essential' | 'analytics' | 'marketing' | 'preferences';

export interface CookieConsentState {
  hasResponded: boolean;
  essential: boolean;       // Always true — cannot be refused
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
  respondedAt: string | null;
  version: string;
}

export interface UseCookieConsentReturn {
  consentState: CookieConsentState | null;
  hasResponded: boolean;
  isLoading: boolean;
  acceptAll: () => void;
  rejectAll: () => void;
  saveCustom: (choices: Partial<Pick<CookieConsentState, 'analytics' | 'marketing' | 'preferences'>>) => void;
  resetConsent: () => void;
  hasConsentFor: (category: CookieCategory) => boolean;
}

// Bump this version when cookie policy changes — forces users to re-consent
const CONSENT_VERSION = '1.0';
const STORAGE_KEY = 'taxi_leblanc_cookie_consent';

const DEFAULT_STATE: CookieConsentState = {
  hasResponded: false,
  essential: true,
  analytics: false,
  marketing: false,
  preferences: false,
  respondedAt: null,
  version: CONSENT_VERSION,
};

function readFromStorage(): CookieConsentState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: CookieConsentState = JSON.parse(raw);
    // If policy version changed, treat as fresh visit
    if (parsed.version !== CONSENT_VERSION) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeToStorage(state: CookieConsentState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // localStorage may be blocked in private browsing — fail silently
  }
}

export function useCookieConsent(): UseCookieConsentReturn {
  const [consentState, setConsentState] = useState<CookieConsentState | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = readFromStorage();
    setConsentState(stored ?? { ...DEFAULT_STATE });
    setIsLoading(false);
  }, []);

  const persist = useCallback((state: CookieConsentState) => {
    setConsentState(state);
    writeToStorage(state);
  }, []);

  const acceptAll = useCallback(() => {
    persist({
      hasResponded: true,
      essential: true,
      analytics: true,
      marketing: true,
      preferences: true,
      respondedAt: new Date().toISOString(),
      version: CONSENT_VERSION,
    });
  }, [persist]);

  const rejectAll = useCallback(() => {
    persist({
      hasResponded: true,
      essential: true,
      analytics: false,
      marketing: false,
      preferences: false,
      respondedAt: new Date().toISOString(),
      version: CONSENT_VERSION,
    });
  }, [persist]);

  const saveCustom = useCallback(
    (choices: Partial<Pick<CookieConsentState, 'analytics' | 'marketing' | 'preferences'>>) => {
      persist({
        hasResponded: true,
        essential: true,
        analytics: choices.analytics ?? false,
        marketing: choices.marketing ?? false,
        preferences: choices.preferences ?? false,
        respondedAt: new Date().toISOString(),
        version: CONSENT_VERSION,
      });
    },
    [persist]
  );

  const resetConsent = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    setConsentState({ ...DEFAULT_STATE });
  }, []);

  const hasConsentFor = useCallback(
    (category: CookieCategory): boolean => {
      if (!consentState) return category === 'essential';
      return consentState[category] === true;
    },
    [consentState]
  );

  return {
    consentState,
    hasResponded: consentState?.hasResponded ?? false,
    isLoading,
    acceptAll,
    rejectAll,
    saveCustom,
    resetConsent,
    hasConsentFor,
  };
}
