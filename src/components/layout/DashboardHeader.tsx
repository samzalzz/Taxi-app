'use client';

import { Button } from '@/components/ui/Button';
import { NotificationBell } from '@/components/features/notifications/NotificationBell';
import { Logo } from '@/components/ui/Logo';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Phone } from 'lucide-react';

interface DashboardHeaderProps {
  logoHref?: string;
}

/**
 * Dashboard top navigation header with NotificationBell.
 * This is a client component to support the interactive bell icon.
 */
export function DashboardHeader({
  logoHref = '/dashboard'
}: DashboardHeaderProps = {}) {
  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-on-surface/10">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Logo href={logoHref} className="h-10 w-auto" />
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <a href="tel:+33608550315">
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Appeler
            </Button>
          </a>
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
