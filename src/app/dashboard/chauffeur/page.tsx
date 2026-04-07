import { getSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import { DriverDashboard } from '@/components/features/driver/DriverDashboard';
import { PageTransition } from '@/components/ui/PageTransition';

export const metadata = {
  title: 'Tableau de bord chauffeur | Taxi Leblanc',
};

export default async function DriverDashboardPage() {
  const session = await getSession();

  if (!session || session.role !== 'DRIVER') {
    redirect('/dashboard');
  }

  return (
    <PageTransition>
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-serif font-bold text-on-surface mb-2">Tableau de bord chauffeur</h1>
          <p className="text-on-surface-dim">Gérez votre activité et vos courses</p>
        </div>

        <DriverDashboard userId={session.userId} />
      </div>
    </PageTransition>
  );
}
