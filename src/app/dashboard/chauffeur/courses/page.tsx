import { getSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import { AvailableCoursesView } from '@/components/features/driver/AvailableCoursesView';

export const metadata = {
  title: 'Courses disponibles | Taxi Leblanc',
};

export default async function AvailableCoursesPage() {
  const session = await getSession();

  if (!session || session.role !== 'DRIVER') {
    redirect('/dashboard');
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-on-surface mb-2">Courses disponibles</h1>
        <p className="text-on-surface-dim">Consultez les courses en attente d&apos;assignation</p>
      </div>

      <AvailableCoursesView />
    </div>
  );
}
