'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

interface CardProps {
  variant?: 'default' | 'elevated' | 'glass' | 'stat';
  children: ReactNode;
  className?: string;
}

const variantStyles = {
  default: 'bg-surface border border-on-surface/10 rounded-lg',
  elevated: 'bg-surface-light shadow-lg rounded-lg border border-on-surface/10',
  glass: 'bg-white/5 backdrop-blur-md border border-white/10 rounded-lg',
  stat: 'bg-surface border border-primary/20 rounded-lg',
};

export function Card({ variant = 'default', children, className }: CardProps) {
  return (
    <div className={cn('p-4', variantStyles[variant], className)}>
      {children}
    </div>
  );
}
