import { getSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import { DriverCalendarView } from '@/components/features/driver/DriverCalendarView';

export const metadata = {
  title: 'Calendrier des courses | Taxi Leblanc',
};

export default async function DriverCalendarPage() {
  const session = await getSession();

  if (!session || session.role !== 'DRIVER') {
    redirect('/dashboard');
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-on-surface mb-2">Calendrier des courses</h1>
        <p className="text-on-surface-dim">Vos courses assignées et les courses publiques disponibles</p>
      </div>

      <DriverCalendarView />
    </div>
  );
}
