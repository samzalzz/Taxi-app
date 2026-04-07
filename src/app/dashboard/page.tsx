import { getSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import { ClientDashboard } from '@/components/features/client/ClientDashboard';

export default async function DashboardPage() {
  const session = await getSession();

  if (!session) {
    redirect('/connexion');
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-serif font-bold text-on-surface mb-2">
          Tableau de bord
        </h1>
        <p className="text-on-surface-dim">
          Bienvenue sur votre espace client, {session.email}
        </p>
      </div>

      <ClientDashboard />
    </div>
  );
}
