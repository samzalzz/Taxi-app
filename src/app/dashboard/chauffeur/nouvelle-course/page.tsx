import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth/session';
import { DriverCreateTripForm } from '@/components/features/driver/DriverCreateTripForm';

export const metadata = {
  title: 'Créer une course | Taxi Leblanc',
  description: 'Créez une nouvelle course pour un client',
};

export default async function CreateTripPage() {
  const session = await getSession();

  // Only drivers can access this page
  if (!session) {
    redirect('/connexion');
  }

  if (session.role !== 'DRIVER') {
    redirect('/dashboard');
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <DriverCreateTripForm />
    </div>
  );
}
