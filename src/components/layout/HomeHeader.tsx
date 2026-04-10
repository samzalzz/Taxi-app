'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/ui/Logo';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Phone, Menu, X } from 'lucide-react';

export function HomeHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-on-surface/10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between h-16">
          <Logo href="/" className="h-10 w-auto" />
          <div className="flex gap-4 items-center">
            <ThemeToggle />
            <a href="tel:+33608550315">
              <Button variant="ghost" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span className="hidden sm:inline">Appeler</span>
              </Button>
            </a>
            {/* Desktop menu: show on md and above */}
            <div className="hidden md:flex gap-3">
              <Link href="/connexion">
                <Button variant="ghost">Connexion</Button>
              </Link>
              <Link href="/inscription">
                <Button>S&apos;inscrire</Button>
              </Link>
            </div>
            {/* Mobile menu button: show on md and below */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex md:hidden p-2 rounded-lg hover:bg-surface-light transition-colors"
              aria-label="Menu"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5 text-on-surface" />
              ) : (
                <Menu className="w-5 h-5 text-on-surface" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile dropdown menu — fixed under navbar so it follows scroll */}
      {isMenuOpen && (
        <div className="fixed top-16 left-0 right-0 z-40 bg-background border-b border-on-surface/10 md:hidden">
          <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-2">
            <Link href="/connexion" onClick={() => setIsMenuOpen(false)} className="w-full">
              <Button variant="ghost" className="w-full justify-start">
                Connexion
              </Button>
            </Link>
            <Link href="/inscription" onClick={() => setIsMenuOpen(false)} className="w-full">
              <Button className="w-full">
                S&apos;inscrire
              </Button>
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
