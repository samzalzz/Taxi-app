'use client';

import { useState, useEffect, useCallback } from 'react';

export interface CGUConsentState {
  hasResponded: boolean;
  accepted: boolean;
  respondedAt: string | null;
  version: string;
}

export interface UseCGUConsentReturn {
  consentState: CGUConsentState | null;
  hasResponded: boolean;
  isLoading: boolean;
  accept: () => void;
  resetConsent: () => void;
}

// Bump this version when CGU changes — forces users to re-consent
const CONSENT_VERSION = '1.0';
const STORAGE_KEY = 'taxi_leblanc_cgu_consent';

const DEFAULT_STATE: CGUConsentState = {
  hasResponded: false,
  accepted: false,
  respondedAt: null,
  version: CONSENT_VERSION,
};

function readFromStorage(): CGUConsentState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: CGUConsentState = JSON.parse(raw);
    // If policy version changed, treat as fresh visit
    if (parsed.version !== CONSENT_VERSION) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeToStorage(state: CGUConsentState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // localStorage may be blocked in private browsing — fail silently
  }
}

export function useCGUConsent(): UseCGUConsentReturn {
  const [consentState, setConsentState] = useState<CGUConsentState | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = readFromStorage();
    setConsentState(stored ?? { ...DEFAULT_STATE });
    setIsLoading(false);
  }, []);

  const persist = useCallback((state: CGUConsentState) => {
    setConsentState(state);
    writeToStorage(state);
  }, []);

  const accept = useCallback(() => {
    persist({
      hasResponded: true,
      accepted: true,
      respondedAt: new Date().toISOString(),
      version: CONSENT_VERSION,
    });
  }, [persist]);

  const resetConsent = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    setConsentState({ ...DEFAULT_STATE });
  }, []);

  return {
    consentState,
    hasResponded: consentState?.hasResponded ?? false,
    isLoading,
    accept,
    resetConsent,
  };
}
