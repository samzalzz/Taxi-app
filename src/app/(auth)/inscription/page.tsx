import Link from 'next/link';
import { SignupForm } from '@/components/features/auth/SignupForm';

export const metadata = {
  title: 'Inscription - Taxi Leblanc',
  description: 'Créer un compte Taxi Leblanc',
};

export default function SignupPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-on-surface mb-2">
          S&apos;inscrire
        </h1>
        <p className="text-on-surface-dim text-sm">
          Créez un compte pour réserver vos trajets
        </p>
      </div>

      <SignupForm />

      <div className="text-center">
        <p className="text-on-surface-dim text-sm">
          Vous avez déjà un compte?{' '}
          <Link
            href="/connexion"
            className="text-primary hover:text-primary-light transition-smooth"
          >
            Se connecter
          </Link>
        </p>
      </div>

      <div className="pt-4 border-t border-on-surface/10 space-y-2">
        <p className="text-on-surface-dim text-sm text-center">
          Vous êtes chauffeur?{' '}
          <Link
            href="/inscription/chauffeur"
            className="text-primary hover:text-primary-light transition-smooth font-medium"
          >
            Créer un compte chauffeur
          </Link>
        </p>
        <Link
          href="/"
          className="text-primary hover:text-primary-light text-sm transition-smooth flex items-center justify-center gap-2"
        >
          ← Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  );
}
