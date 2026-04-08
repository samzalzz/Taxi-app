import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSession } from '@/lib/auth/session';
import { AdminHeader } from '@/components/layout/AdminHeader';

export const metadata = {
  title: 'Admin Panel — Taxi Leblanc',
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  // If no session, redirect to login
  if (!session) {
    redirect('/connexion');
  }

  // If not admin, redirect to appropriate dashboard
  if (session.role !== 'ADMIN') {
    redirect(session.role === 'DRIVER' ? '/dashboard/chauffeur' : '/dashboard');
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <AdminHeader />

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-surface border-r border-on-surface/10 min-h-screen p-6">
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

        {/* Main Content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
