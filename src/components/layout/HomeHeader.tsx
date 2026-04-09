'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/ui/Logo';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Phone } from 'lucide-react';

export function HomeHeader() {
  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-on-surface/10">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Logo href="/" className="h-10 w-auto" />
        <div className="flex gap-4 items-center">
          <ThemeToggle />
          <a href="tel:+33608550315">
            <Button variant="ghost" className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Appeler
            </Button>
          </a>
          <Link href="/connexion">
            <Button variant="ghost">Connexion</Button>
          </Link>
          <Link href="/inscription">
            <Button>S'inscrire</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
