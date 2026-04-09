import { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

interface SectionProps {
  children: ReactNode;
  variant?: 'default' | 'light' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const variantStyles = {
  default: 'bg-background',
  light: 'bg-surface',
  accent: 'bg-gradient-to-br from-primary/10 via-background to-background',
};

const sizeStyles = {
  sm: 'py-12 px-4',
  md: 'py-20 px-4',
  lg: 'py-24 px-4',
};

export function Section({
  children,
  variant = 'default',
  size = 'md',
  className,
}: SectionProps) {
  return (
    <section className={cn(variantStyles[variant], sizeStyles[size], className)}>
      <div className="container-wide">
        {children}
      </div>
    </section>
  );
}
