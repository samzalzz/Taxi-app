import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        {/* Logo */}
        <div className="mb-12">
          <Logo href="/" className="h-16 w-auto mx-auto" />
        </div>

        {/* 404 Content */}
        <div className="space-y-6">
          <div>
            <h1 className="text-9xl font-bold text-primary mb-2">404</h1>
            <p className="text-4xl font-bold text-on-surface mb-4">
              Page non trouvée
            </p>
            <p className="text-lg text-on-surface-dim mb-8">
              Désolé, la page que vous cherchez n&apos;existe pas ou a été supprimée.
            </p>
          </div>

          {/* Illustration */}
          <div className="py-12">
            <div className="text-6xl">🚕</div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
            <Link href="/">
              <button className="px-8 py-3 bg-primary text-background rounded-lg font-semibold hover:bg-primary-dark transition-colors">
                Retour à l&apos;accueil
              </button>
            </Link>
            <Link href="/reserver">
              <button className="px-8 py-3 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary/10 transition-colors">
                Réserver un trajet
              </button>
            </Link>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-16 pt-8 border-t border-on-surface/10">
          <p className="text-sm text-on-surface-dim mb-4">
            Vous avez un problème ?
          </p>
          <a
            href="mailto:TaxiLeblanc@gmail.com"
            className="text-primary hover:text-primary-light transition-colors font-semibold"
          >
            Contactez-nous
          </a>
        </div>
      </div>
    </div>
  );
}
