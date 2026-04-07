import React, { InputHTMLAttributes, useState, ReactNode } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helpText?: string;
  autoComplete?: string;
  leftIcon?: ReactNode;
  prefix?: string;
  suffix?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helpText, autoComplete, type, leftIcon, prefix, suffix, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPasswordField = type === 'password';
    const displayType = isPasswordField && showPassword ? 'text' : type;

    const leftPadding = leftIcon || prefix ? 'pl-10' : 'pl-4';
    const rightPadding = isPasswordField || suffix ? 'pr-10' : 'pr-4';

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-semibold text-on-surface mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {(leftIcon || prefix) && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-on-surface-dim">
              {leftIcon}
              {prefix && <span className="text-sm">{prefix}</span>}
            </div>
          )}
          <input
            ref={ref}
            type={displayType}
            autoComplete={autoComplete}
            className={cn(
              'w-full py-2 rounded-lg bg-surface-light text-on-surface placeholder-on-surface-dim',
              'border border-on-surface/10 transition-smooth',
              'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
              error && 'border-error focus:ring-error',
              leftPadding,
              rightPadding,
              className
            )}
            {...props}
          />
          {suffix && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-on-surface-dim">
              {suffix}
            </span>
          )}
          {isPasswordField && !suffix && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-dim hover:text-on-surface transition-colors"
              aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          )}
        </div>
        {error && <p className="mt-1 text-xs text-error">{error}</p>}
        {helpText && !error && <p className="mt-1 text-xs text-on-surface-dim">{helpText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
