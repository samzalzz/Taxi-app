import { HomeHeader } from '@/components/layout/HomeHeader';
import { Footer } from '@/components/layout/Footer';
import { Logo } from '@/components/ui/Logo';
import { CookieConsentGate } from '@/components/common/CookieConsentGate';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <HomeHeader />

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="glass p-8 rounded-2xl border border-on-surface/10">
            <div className="mb-8 text-center">
              <div className="mb-2">
                <Logo href="/" className="h-16 w-auto mx-auto" />
              </div>
              <p className="text-on-surface-dim text-sm">
                Votre taxi de route en Île-de-France
              </p>
            </div>

            <CookieConsentGate pageLabel="Espace membre">
              {children}
            </CookieConsentGate>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
