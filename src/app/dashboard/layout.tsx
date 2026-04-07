import Link from 'next/link';
import { getSession } from '@/lib/auth/session';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { PageTransition } from '@/components/ui/PageTransition';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <DashboardHeader />

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-surface border-r border-on-surface/10 min-h-screen p-6">
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

        {/* Main Content */}
        <main className="flex-1 p-8">
          <PageTransition>
            {children}
          </PageTransition>
        </main>
      </div>
    </div>
  );
}
