'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  Home,
  Calendar,
  MessageSquare,
  User,
  Plus,
  Package,
  BarChart3,
  Settings,
  Lock,
} from 'lucide-react';

interface DashboardSidebarProps {
  session: any;
}

export function DashboardSidebar({ session }: DashboardSidebarProps) {
  const [isOpen, setIsOpen] = useState(true);
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  const NavLink = ({
    href,
    icon: Icon,
    label,
    isAdmin = false,
  }: {
    href: string;
    icon: React.ReactNode;
    label: string;
    isAdmin?: boolean;
  }) => {
    const active = isActive(href);
    return (
      <Link
        href={href}
        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
          active
            ? 'bg-primary text-background shadow-lg'
            : `text-on-surface hover:bg-surface-light ${isAdmin ? 'text-yellow-400 hover:text-yellow-300' : ''}`
        }`}
      >
        <span className="flex-shrink-0">{Icon}</span>
        <span className="font-medium text-sm">{label}</span>
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
                    icon={<Home className="w-5 h-5" />}
                    label="Tableau de bord"
                  />
                  <NavLink
                    href="/dashboard/reserver"
                    icon={<Plus className="w-5 h-5" />}
                    label="Réserver un trajet"
                  />
                  <NavLink
                    href="/dashboard/reservations"
                    icon={<Package className="w-5 h-5" />}
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
                    icon={<Home className="w-5 h-5" />}
                    label="Vue d'ensemble"
                  />
                  <NavLink
                    href="/dashboard/chauffeur/courses"
                    icon={<BarChart3 className="w-5 h-5" />}
                    label="Courses disponibles"
                  />
                  <NavLink
                    href="/dashboard/chauffeur/historique"
                    icon={<Calendar className="w-5 h-5" />}
                    label="Historique"
                  />
                  <NavLink
                    href="/dashboard/chauffeur/calendrier"
                    icon={<Package className="w-5 h-5" />}
                    label="Calendrier"
                  />
                  <NavLink
                    href="/dashboard/chauffeur/messages"
                    icon={<MessageSquare className="w-5 h-5" />}
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
                  icon={<MessageSquare className="w-5 h-5" />}
                  label="Mes messages"
                />
              </div>
            </div>
          )}

          <div className="border-t border-on-surface/10 pt-3 mt-3">
            <NavLink
              href="/dashboard/profil"
              icon={<User className="w-5 h-5" />}
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
                icon={<Lock className="w-5 h-5" />}
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
