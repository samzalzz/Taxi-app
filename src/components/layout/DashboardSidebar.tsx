'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

interface DashboardSidebarProps {
  session: any;
}

export function DashboardSidebar({ session }: DashboardSidebarProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-20 left-4 z-50 p-2 rounded-lg bg-surface border border-on-surface/10 hover:bg-surface-light transition-colors lg:hidden"
        aria-label={isOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
      >
        {isOpen ? (
          <X className="w-5 h-5 text-on-surface" />
        ) : (
          <Menu className="w-5 h-5 text-on-surface" />
        )}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-surface border-r border-on-surface/10 p-6 z-40 transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ paddingTop: '6rem' }}
      >
        <nav className="space-y-2">
          {session?.role !== 'DRIVER' && (
            <>
              <h3 className="text-xs font-semibold uppercase text-on-surface-dim mb-4">
                Navigation
              </h3>
              <Link
                href="/dashboard"
                className="block px-4 py-2 rounded-lg text-on-surface hover:bg-surface-light transition-smooth"
              >
                Tableau de bord
              </Link>
              <Link
                href="/dashboard/reserver"
                className="block px-4 py-2 rounded-lg text-on-surface hover:bg-surface-light transition-smooth"
              >
                Réserver un trajet
              </Link>
              <Link
                href="/dashboard/reservations"
                className="block px-4 py-2 rounded-lg text-on-surface hover:bg-surface-light transition-smooth"
              >
                Mes réservations
              </Link>
            </>
          )}

          {session?.role === 'DRIVER' && (
            <>
              <h3 className="text-xs font-semibold uppercase text-on-surface-dim mb-4">
                Espace chauffeur
              </h3>
              <Link
                href="/dashboard/chauffeur"
                className="block px-4 py-2 rounded-lg text-on-surface hover:bg-surface-light transition-smooth"
              >
                Vue d'ensemble
              </Link>
              <Link
                href="/dashboard/chauffeur/courses"
                className="block px-4 py-2 rounded-lg text-on-surface hover:bg-surface-light transition-smooth"
              >
                Courses disponibles
              </Link>
              <Link
                href="/dashboard/chauffeur/historique"
                className="block px-4 py-2 rounded-lg text-on-surface hover:bg-surface-light transition-smooth"
              >
                Historique
              </Link>
              <Link
                href="/dashboard/chauffeur/calendrier"
                className="block px-4 py-2 rounded-lg text-on-surface hover:bg-surface-light transition-smooth"
              >
                Calendrier
              </Link>
              <Link
                href="/dashboard/chauffeur/messages"
                className="block px-4 py-2 rounded-lg text-on-surface hover:bg-surface-light transition-smooth"
              >
                Messages
              </Link>
            </>
          )}

          {session?.role !== 'DRIVER' && (
            <Link
              href="/dashboard/messages"
              className="block px-4 py-2 rounded-lg text-on-surface hover:bg-surface-light transition-smooth"
            >
              Mes messages
            </Link>
          )}

          <Link
            href="/dashboard/profil"
            className="block px-4 py-2 rounded-lg text-on-surface hover:bg-surface-light transition-smooth"
          >
            Mon profil
          </Link>

          {session?.role === 'ADMIN' && (
            <>
              <h3 className="text-xs font-semibold uppercase text-on-surface-dim mb-4 mt-6">
                Administration
              </h3>
              <Link
                href="/admin"
                className="block px-4 py-2 rounded-lg text-on-surface hover:bg-surface-light transition-smooth text-yellow-400"
              >
                Panel admin
              </Link>
            </>
          )}
        </nav>
      </aside>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
