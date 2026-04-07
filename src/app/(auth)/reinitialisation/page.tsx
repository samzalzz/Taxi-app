import { Suspense } from 'react';
import { ResetPasswordForm } from '@/components/features/auth/ResetPasswordForm';

export const metadata = {
  title: 'Réinitialisation du mot de passe — Taxi Leblanc',
  description: 'Choisir un nouveau mot de passe pour votre compte Taxi Leblanc',
};

export default function ResetPasswordPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-on-surface mb-2">
          Nouveau mot de passe
        </h1>
        <p className="text-on-surface-dim text-sm">
          Choisissez un nouveau mot de passe pour votre compte.
        </p>
      </div>

      <Suspense fallback={
        <div className="text-on-surface-dim text-sm text-center py-4">Chargement...</div>
      }>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
