'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

export function AdminSidebar() {
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
        className={`fixed left-0 top-0 h-screen w-64 bg-surface border-r border-on-surface/10 p-6 z-40 transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 overflow-y-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ paddingTop: '6rem' }}
      >
        <nav className="space-y-2">
          <h3 className="text-xs font-semibold uppercase text-on-surface-dim mb-4">
            Navigation
          </h3>
          <Link
            href="/admin"
            className="block px-4 py-2 rounded-lg text-on-surface hover:bg-surface-light transition-smooth"
          >
            Tableau de bord
          </Link>
          <Link
            href="/admin/utilisateurs"
            className="block px-4 py-2 rounded-lg text-on-surface hover:bg-surface-light transition-smooth"
          >
            Utilisateurs
          </Link>
          <Link
            href="/admin/reservations"
            className="block px-4 py-2 rounded-lg text-on-surface hover:bg-surface-light transition-smooth"
          >
            Réservations
          </Link>
          <Link
            href="/admin/calendrier"
            className="block px-4 py-2 rounded-lg text-on-surface hover:bg-surface-light transition-smooth"
          >
            Calendrier
          </Link>
          <Link
            href="/admin/visibilite"
            className="block px-4 py-2 rounded-lg text-on-surface hover:bg-surface-light transition-smooth"
          >
            Visibilité
          </Link>
          <Link
            href="/admin/tarifs"
            className="block px-4 py-2 rounded-lg text-on-surface hover:bg-surface-light transition-smooth"
          >
            Tarifs
          </Link>
          <Link
            href="/admin/parametres"
            className="block px-4 py-2 rounded-lg text-on-surface hover:bg-surface-light transition-smooth"
          >
            Paramètres
          </Link>
          <Link
            href="/admin/reclamations"
            className="block px-4 py-2 rounded-lg text-on-surface hover:bg-surface-light transition-smooth"
          >
            Réclamations
          </Link>

          <h3 className="text-xs font-semibold uppercase text-on-surface-dim mb-4 mt-6">
            Gestion des features
          </h3>
          <Link
            href="/admin/notifications"
            className="block px-4 py-2 rounded-lg text-on-surface hover:bg-surface-light transition-smooth"
          >
            Notifications
          </Link>
          <Link
            href="/admin/conversations"
            className="block px-4 py-2 rounded-lg text-on-surface hover:bg-surface-light transition-smooth"
          >
            Conversations
          </Link>
          <Link
            href="/admin/avis"
            className="block px-4 py-2 rounded-lg text-on-surface hover:bg-surface-light transition-smooth"
          >
            Avis & Évaluations
          </Link>
          <Link
            href="/admin/api-usage"
            className="block px-4 py-2 rounded-lg text-on-surface hover:bg-surface-light transition-smooth"
          >
            Utilisation des APIs
          </Link>

          <Link
            href="/dashboard"
            className="block px-4 py-2 rounded-lg text-on-surface-dim hover:bg-surface-light hover:text-on-surface transition-smooth mt-6"
          >
            ← Retour au dashboard
          </Link>
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
