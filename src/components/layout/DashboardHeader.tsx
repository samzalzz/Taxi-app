'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { NotificationBell } from '@/components/features/notifications/NotificationBell';

interface DashboardHeaderProps {
  title?: string;
  logoHref?: string;
}

/**
 * Dashboard top navigation header with NotificationBell.
 * This is a client component to support the interactive bell icon.
 */
export function DashboardHeader({
  title = 'Taxi Leblanc',
  logoHref = '/dashboard'
}: DashboardHeaderProps = {}) {
  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-on-surface/10">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link
          href={logoHref}
          className="text-2xl font-serif font-bold text-primary hover:text-primary-light transition-smooth"
        >
          {title}
        </Link>
        <div className="flex items-center gap-4">
          <NotificationBell />
          <form action="/api/auth/logout" method="POST">
            <Button type="submit" variant="ghost" size="sm">
              Déconnexion
            </Button>
          </form>
        </div>
      </div>
      <div className="h-0.5 bg-gradient-to-r from-primary via-primary-light to-primary/0"></div>
    </nav>
  );
}
