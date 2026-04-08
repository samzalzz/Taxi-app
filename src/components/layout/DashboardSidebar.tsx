'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

interface DashboardSidebarProps {
  session: any;
}

export function DashboardSidebar({ session }: DashboardSidebarProps) {
  const [isOpen, setIsOpen] = useState(true);
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  const NavLink = ({
    href,
    label,
    isAdmin = false,
  }: {
    href: string;
    label: string;
    isAdmin?: boolean;
  }) => {
    const active = isActive(href);
    return (
      <Link
        href={href}
        className={`block px-4 py-3 rounded-lg transition-all duration-200 font-medium text-sm ${
          active
            ? 'bg-primary text-background shadow-lg'
            : `text-on-surface hover:bg-surface-light ${isAdmin ? 'text-yellow-400 hover:text-yellow-300' : ''}`
        }`}
      >
        {label}
      </Link>
    );
  };

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
        <nav className="space-y-1">
          {session?.role !== 'DRIVER' && (
            <>
              <div className="mb-2">
                <p className="text-xs font-semibold uppercase text-on-surface-dim px-4 mb-3">
                  Client
                </p>
                <div className="space-y-1">
                  <NavLink
                    href="/dashboard"
                    label="Tableau de bord"
                  />
                  <NavLink
                    href="/dashboard/reserver"
                    label="Réserver un trajet"
                  />
                  <NavLink
                    href="/dashboard/reservations"
                    label="Mes réservations"
                  />
                </div>
              </div>
            </>
          )}

          {session?.role === 'DRIVER' && (
            <>
              <div className="mb-2">
                <p className="text-xs font-semibold uppercase text-on-surface-dim px-4 mb-3">
                  Chauffeur
                </p>
                <div className="space-y-1">
                  <NavLink
                    href="/dashboard/chauffeur"
                    label="Vue d'ensemble"
                  />
                  <NavLink
                    href="/dashboard/chauffeur/courses"
                    label="Courses disponibles"
                  />
                  <NavLink
                    href="/dashboard/chauffeur/historique"
                    label="Historique"
                  />
                  <NavLink
                    href="/dashboard/chauffeur/calendrier"
                    label="Calendrier"
                  />
                  <NavLink
                    href="/dashboard/chauffeur/messages"
                    label="Messages"
                  />
                </div>
              </div>
            </>
          )}

          {session?.role !== 'DRIVER' && (
            <div className="mb-2">
              <div className="space-y-1">
                <NavLink
                  href="/dashboard/messages"
                  label="Mes messages"
                />
              </div>
            </div>
          )}

          <div className="border-t border-on-surface/10 pt-3 mt-3">
            <NavLink
              href="/dashboard/profil"
              label="Mon profil"
            />
          </div>

          {session?.role === 'ADMIN' && (
            <div className="border-t border-on-surface/10 pt-3 mt-3">
              <p className="text-xs font-semibold uppercase text-on-surface-dim px-4 mb-3">
                Admin
              </p>
              <NavLink
                href="/admin"
                label="Panel admin"
                isAdmin={true}
              />
            </div>
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
