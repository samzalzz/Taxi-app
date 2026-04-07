import Link from 'next/link';
import { ForgotPasswordForm } from '@/components/features/auth/ForgotPasswordForm';

export const metadata = {
  title: 'Mot de passe oublié — Taxi Leblanc',
  description: 'Réinitialiser votre mot de passe Taxi Leblanc',
};

export default function ForgotPasswordPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-on-surface mb-2">
          Mot de passe oublié ?
        </h1>
        <p className="text-on-surface-dim text-sm">
          Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
        </p>
      </div>

      <ForgotPasswordForm />

      <div className="text-center">
        <Link
          href="/connexion"
          className="text-primary hover:text-primary-light text-sm transition-smooth"
        >
          ← Retour à la connexion
        </Link>
      </div>
    </div>
  );
}
