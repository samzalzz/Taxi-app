import Link from 'next/link';
import { LoginForm } from '@/components/features/auth/LoginForm';

export const metadata = {
  title: 'Connexion - Taxi Leblanc',
  description: 'Se connecter à votre compte Taxi Leblanc',
};

export default async function LoginPage(
  props: {
    searchParams?: Promise<{ reset?: string }>;
  }
) {
  const searchParams = await props.searchParams;
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-on-surface mb-2">
          Connexion
        </h1>
        <p className="text-on-surface-dim text-sm">
          Entrez vos identifiants pour accéder à votre compte
        </p>
      </div>

      {searchParams?.reset === 'success' && (
        <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 text-primary text-sm text-center">
          ✓ Mot de passe réinitialisé avec succès. Vous pouvez vous connecter.
        </div>
      )}

      <LoginForm />

      <div className="text-center">
        <p className="text-on-surface-dim text-sm">
          Vous n'avez pas de compte?{' '}
          <Link
            href="/inscription"
            className="text-primary hover:text-primary-light transition-smooth"
          >
            S'inscrire
          </Link>
        </p>
      </div>

      <div className="pt-4 border-t border-on-surface/10">
        <Link
          href="/"
          className="text-primary hover:text-primary-light text-sm transition-smooth flex items-center justify-center gap-2"
        >
          ← Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}
