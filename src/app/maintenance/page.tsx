import { Logo } from '@/components/ui/Logo';

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        {/* Logo */}
        <div className="mb-12">
          <Logo href="/" className="h-16 w-auto mx-auto" />
        </div>

        {/* Maintenance Content */}
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-5xl font-bold text-on-surface mb-4">
              Maintenance en cours
            </h1>
            <p className="text-xl text-on-surface-dim mb-8">
              Nous effectuons des améliorations importantes pour vous offrir un meilleur service.
            </p>
          </div>

          {/* Illustration */}
          <div className="py-12">
            <div className="text-7xl">🔧</div>
          </div>

          {/* Status Info */}
          <div className="bg-surface border border-on-surface/10 rounded-lg p-8 space-y-4">
            <h2 className="text-lg font-semibold text-on-surface">
              Nous serons bientôt de retour
            </h2>
            <p className="text-on-surface-dim">
              Notre équipe travaille activement pour restaurer les services. Nous nous excusons pour le désagrément causé.
            </p>
            <div className="pt-4 space-y-2">
              <p className="text-sm text-on-surface-dim">
                ✓ Amélioration des performances
              </p>
              <p className="text-sm text-on-surface-dim">
                ✓ Nouvelles fonctionnalités
              </p>
              <p className="text-sm text-on-surface-dim">
                ✓ Sécurité renforcée
              </p>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <p className="text-on-surface-dim">
              Vous avez besoin d'aide ? Contactez-nous :
            </p>
            <div className="space-y-2">
              <a
                href="tel:+33608550315"
                className="block text-primary hover:text-primary-light transition-colors font-semibold"
              >
                📞 +33 6 08 55 03 15
              </a>
              <a
                href="mailto:TaxiLeblanc@gmail.com"
                className="block text-primary hover:text-primary-light transition-colors font-semibold"
              >
                📧 TaxiLeblanc@gmail.com
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-on-surface/10 text-sm text-on-surface-dim">
          <p>© 2026 Taxi Leblanc. Tous droits réservés.</p>
        </div>
      </div>
    </div>
  );
}
