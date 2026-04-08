'use client';

import { Logo } from '@/components/ui/Logo';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="glass p-8 rounded-2xl">
          <div className="mb-8 text-center">
            <div className="mb-2">
              <Logo href="/" className="h-16 w-auto mx-auto" />
            </div>
            <p className="text-on-surface-dim text-sm">
              Votre taxi de route en Île-de-France
            </p>
          </div>

          {children}
        </div>

        <p className="text-center text-on-surface-dim text-xs mt-6">
          © 2024 Taxi Leblanc. Tous droits réservés.
        </p>
      </div>
    </div>
  );
}
