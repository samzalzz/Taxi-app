import { getSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { DriverSignupForm } from '@/components/features/auth/DriverSignupForm';

export const metadata = {
  title: 'Inscription Chauffeur | Taxi Leblanc',
};

export default async function DriverSignupPage() {
  const session = await getSession();

  if (session) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-surface flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-serif font-bold text-primary mb-2">
            Taxi Leblanc
          </h1>
          <h2 className="text-2xl font-bold text-on-surface mb-2">
            Inscription Chauffeur
          </h2>
          <p className="text-on-surface-dim">
            Rejoignez notre réseau de chauffeurs professionnels
          </p>
        </div>

        {/* Form */}
        <DriverSignupForm />

        {/* Footer */}
        <div className="mt-8 text-center space-y-4">
          <p className="text-sm text-on-surface-dim">
            Vous êtes un client?{' '}
            <Link
              href="/inscription"
              className="text-primary hover:underline font-medium"
            >
              Créer un compte client
            </Link>
          </p>
          <p className="text-sm text-on-surface-dim">
            Vous avez déjà un compte?{' '}
            <Link
              href="/connexion"
              className="text-primary hover:underline font-medium"
            >
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
