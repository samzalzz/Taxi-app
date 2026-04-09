'use client';

import { useCookieConsent } from '@/hooks/useCookieConsent';

/**
 * A small footer button that resets consent state so the modal reappears.
 * Required by CNIL guidelines — users must be able to withdraw/modify
 * consent at any time as easily as they gave it.
 */
export function CookieSettingsButton() {
  const { resetConsent } = useCookieConsent();

  return (
    <button
      type="button"
      onClick={resetConsent}
      className="text-xs text-on-surface-dim hover:text-primary transition-colors underline underline-offset-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
    >
      Gérer mes cookies
    </button>
  );
}

export default CookieSettingsButton;
