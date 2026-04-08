import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        'primary-dark': 'var(--color-primary-dark)',
        'primary-light': 'var(--color-primary-light)',
        background: 'var(--color-background)',
        'background-darker': 'var(--color-background-darker)',
        surface: 'var(--color-surface)',
        'surface-light': 'var(--color-surface-light)',
        'on-surface': 'var(--color-on-surface)',
        'on-surface-dim': 'var(--color-on-surface-dim)',
        error: 'var(--color-error)',
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        info: 'var(--color-info)',
      },
      fontFamily: {
        serif: ['Noto Serif', 'serif'],
        sans: ['Manrope', 'sans-serif'],
      },
      fontSize: {
        xs: ['12px', '16px'],
        sm: ['14px', '20px'],
        base: ['16px', '24px'],
        lg: ['18px', '28px'],
        xl: ['20px', '28px'],
        '2xl': ['24px', '32px'],
        '3xl': ['30px', '36px'],
        '4xl': ['36px', '44px'],
        '5xl': ['48px', '52px'],
      },
      backdropBlur: {
        xs: '2px',
        sm: '4px',
      },
      opacity: {
        12: '0.12',
        16: '0.16',
        24: '0.24',
      },
      boxShadow: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        'glass': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.1)',
        'card': '0 4px 12px rgba(0, 0, 0, 0.15)',
        'card-hover': '0 8px 24px rgba(212, 175, 55, 0.15)',
        'gold': '0 0 20px rgba(212, 175, 55, 0.2)',
      },
      spacing: {
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};

export default config;
