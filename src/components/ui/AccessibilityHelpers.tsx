/**
 * Accessibility helpers and utilities
 * Ensures WCAG 2.1 AA compliance
 */

/**
 * Generate accessible button attributes
 */
export function getButtonA11yAttrs(options: {
  disabled?: boolean;
  ariaLabel?: string;
  ariaPressed?: boolean;
  ariaExpanded?: boolean;
  role?: string;
} = {}) {
  return {
    'aria-label': options.ariaLabel,
    'aria-pressed': options.ariaPressed,
    'aria-expanded': options.ariaExpanded,
    role: options.role || 'button',
    disabled: options.disabled,
  };
}

/**
 * Generate accessible form field attributes
 */
export function getInputA11yAttrs(options: {
  label: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
  hint?: string;
} = { label: '' }) {
  const id = `input-${Math.random().toString(36).substr(2, 9)}`;

  return {
    id,
    'aria-label': options.label,
    'aria-required': options.required,
    'aria-invalid': !!options.error,
    'aria-describedby': options.error || options.hint ? `${id}-desc` : undefined,
    disabled: options.disabled,
  };
}

/**
 * Color contrast checker (returns true if contrast is >= 4.5:1)
 * Used to ensure text is readable for people with visual impairments
 */
export function hasGoodContrast(fgColor: string, bgColor: string): boolean {
  const getLuminance = (color: string): number => {
    const rgb = parseInt(color.replace('#', ''), 16);
    const r = (rgb >> 16) & 255;
    const g = (rgb >> 8) & 255;
    const b = rgb & 255;

    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance < 0.5 ? luminance : 1 - (1 - luminance);
  };

  const fgLum = getLuminance(fgColor);
  const bgLum = getLuminance(bgColor);

  const contrast = (Math.max(fgLum, bgLum) + 0.05) / (Math.min(fgLum, bgLum) + 0.05);
  return contrast >= 4.5; // WCAG AA standard
}

/**
 * Accessible focus management
 */
export function focusElement(element: HTMLElement | null, options: { smooth?: boolean } = {}) {
  if (!element) return;

  if (options.smooth) {
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  element.focus();

  // Add visible focus indicator
  element.classList.add('focus-visible');
}

/**
 * Trap focus within a modal or menu
 * Prevents keyboard navigation from escaping the component
 */
export function trapFocus(containerElement: HTMLElement, onEscape?: () => void): () => void {
  const focusableElements = Array.from(
    containerElement.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
  ) as HTMLElement[];

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onEscape?.();
      return;
    }

    if (e.key !== 'Tab') return;

    if (e.shiftKey) {
      // Shift+Tab
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement?.focus();
      }
    } else {
      // Tab
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement?.focus();
      }
    }
  };

  containerElement.addEventListener('keydown', handleKeyDown);

  // Set focus to first element
  firstElement?.focus();

  // Return cleanup function
  return () => {
    containerElement.removeEventListener('keydown', handleKeyDown);
  };
}

/**
 * Announce messages to screen readers
 */
export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite') {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only'; // Screen reader only class
  announcement.textContent = message;

  document.body.appendChild(announcement);

  // Remove after announcement is read (typically 1 second)
  setTimeout(() => announcement.remove(), 1000);
}

/**
 * Skip link component for keyboard navigation
 * Allows users to skip to main content
 */
export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:p-2 focus:bg-gold focus:text-black"
    >
      Aller au contenu principal
    </a>
  );
}
