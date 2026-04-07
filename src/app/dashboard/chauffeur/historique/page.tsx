import { getSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import { TripHistoryView } from '@/components/features/driver/TripHistoryView';

export const metadata = {
  title: 'Historique | Taxi Leblanc',
};

export default async function TripHistoryPage() {
  const session = await getSession();

  if (!session || session.role !== 'DRIVER') {
    redirect('/dashboard');
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-on-surface mb-2">Historique des courses</h1>
        <p className="text-on-surface-dim">Consultez vos courses complétées</p>
      </div>

      <TripHistoryView />
    </div>
  );
}
