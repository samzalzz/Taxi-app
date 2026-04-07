'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

interface BadgeProps {
  variant?: 'success' | 'error' | 'warning' | 'info' | 'gold';
  children: ReactNode;
  className?: string;
}

const variantStyles = {
  success: 'bg-success/20 text-success border border-success/30',
  error: 'bg-error/20 text-error border border-error/30',
  warning: 'bg-warning/20 text-warning border border-warning/30',
  info: 'bg-info/20 text-info border border-info/30',
  gold: 'bg-primary/20 text-primary border border-primary/30',
};

export function Badge({ variant = 'gold', children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
