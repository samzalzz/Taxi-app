'use client';

import { AdminDashboard } from '@/components/features/admin/AdminDashboard';
import { PushNotificationToggle } from '@/components/features/admin/PushNotificationToggle';

export default function AdminPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-on-surface mb-2">
          Tableau de bord admin
        </h1>
        <p className="text-lg text-on-surface-dim">
          Vue d&apos;ensemble et gestion de la plateforme
        </p>
      </div>

      <PushNotificationToggle />

      <AdminDashboard />

      {/* Core Management Links */}
      <div>
        <h2 className="text-lg font-semibold text-on-surface mb-4">Gestion Générale</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <a
            href="/admin/utilisateurs"
            className="bg-surface border border-on-surface/10 rounded-lg p-6 hover:border-on-surface/20 transition-colors group"
          >
            <h3 className="text-lg font-semibold text-on-surface mb-2 group-hover:text-primary transition-colors">
              Utilisateurs
            </h3>
            <p className="text-sm text-on-surface-dim">
              Gérer les comptes des clients et chauffeurs
            </p>
          </a>

          <a
            href="/admin/reservations"
            className="bg-surface border border-on-surface/10 rounded-lg p-6 hover:border-on-surface/20 transition-colors group"
          >
            <h3 className="text-lg font-semibold text-on-surface mb-2 group-hover:text-primary transition-colors">
              Réservations
            </h3>
            <p className="text-sm text-on-surface-dim">
              Voir et filtrer les courses par statut
            </p>
          </a>

          <a
            href="/admin/tarifs"
            className="bg-surface border border-on-surface/10 rounded-lg p-6 hover:border-on-surface/20 transition-colors group"
          >
            <h3 className="text-lg font-semibold text-on-surface mb-2 group-hover:text-primary transition-colors">
              Tarifs
            </h3>
            <p className="text-sm text-on-surface-dim">
              Configurer les prix et les frais
            </p>
          </a>
        </div>
      </div>

      {/* Feature Management Links */}
      <div>
        <h2 className="text-lg font-semibold text-on-surface mb-4">Gestion des Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <a
            href="/admin/notifications"
            className="bg-surface border border-on-surface/10 rounded-lg p-6 hover:border-on-surface/20 transition-colors group"
          >
            <h3 className="text-lg font-semibold text-on-surface mb-2 group-hover:text-primary transition-colors">
              🔔 Notifications
            </h3>
            <p className="text-sm text-on-surface-dim">
              Superviser toutes les notifications du système
            </p>
          </a>

          <a
            href="/admin/conversations"
            className="bg-surface border border-on-surface/10 rounded-lg p-6 hover:border-on-surface/20 transition-colors group"
          >
            <h3 className="text-lg font-semibold text-on-surface mb-2 group-hover:text-primary transition-colors">
              💬 Conversations
            </h3>
            <p className="text-sm text-on-surface-dim">
              Gérer les discussions entre utilisateurs
            </p>
          </a>

          <a
            href="/admin/avis"
            className="bg-surface border border-on-surface/10 rounded-lg p-6 hover:border-on-surface/20 transition-colors group"
          >
            <h3 className="text-lg font-semibold text-on-surface mb-2 group-hover:text-primary transition-colors">
              ⭐ Avis & Évaluations
            </h3>
            <p className="text-sm text-on-surface-dim">
              Superviser les avis clients et chauffeurs
            </p>
          </a>

          <a
            href="/admin/reclamations"
            className="bg-surface border border-on-surface/10 rounded-lg p-6 hover:border-on-surface/20 transition-colors group"
          >
            <h3 className="text-lg font-semibold text-on-surface mb-2 group-hover:text-primary transition-colors">
              ⚠️ Réclamations
            </h3>
            <p className="text-sm text-on-surface-dim">
              Traiter et résoudre les plaintes des utilisateurs
            </p>
          </a>
        </div>
      </div>
    </div>
  );
}
