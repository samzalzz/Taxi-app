import type { Metadata } from 'next';
import { Footer } from '@/components/layout/Footer';
import { HomeHeader } from '@/components/layout/HomeHeader';

export const metadata: Metadata = {
  title: 'Conditions d\'Utilisation | Taxi Leblanc',
  description: 'Conditions générales d\'utilisation du service Taxi Leblanc',
  robots: 'noindex',
};

export default function ConditionsPage() {
  return (
    <div className="min-h-screen bg-background">
      <HomeHeader />

      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-5xl font-serif font-bold text-on-surface mb-12">
            Conditions d'Utilisation
          </h1>

          <div className="prose prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-3xl font-bold text-on-surface mt-8 mb-4">1. Introduction</h2>
              <p className="text-on-surface-dim leading-relaxed">
                Ces conditions d'utilisation régissent l'accès et l'utilisation du site web et des services de Taxi Leblanc.
                En utilisant notre plateforme, vous acceptez ces conditions dans leur intégralité.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-on-surface mt-8 mb-4">2. Description du Service</h2>
              <p className="text-on-surface-dim leading-relaxed">
                Taxi Leblanc propose des services de transport de passagers en Île-de-France, y compris:
              </p>
              <ul className="list-disc list-inside text-on-surface-dim space-y-2 ml-4">
                <li>Transports vers les aéroports (CDG, Orly, Beauvais)</li>
                <li>Transports médicalisés agréés CPAM</li>
                <li>Transports pour occasions personnelles</li>
                <li>Location avec chauffeur</li>
              </ul>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-on-surface mt-8 mb-4">3. Réservations</h2>
              <div className="space-y-4 text-on-surface-dim">
                <p><strong className="text-on-surface">Délai minimum:</strong> Les réservations doivent être effectuées au minimum 2 heures avant la prise en charge.</p>
                <p><strong className="text-on-surface">Annulation:</strong> Les annulations peuvent être effectuées jusqu'à 2 heures avant l'heure convenue sans frais.</p>
                <p><strong className="text-on-surface">Modification:</strong> Les modifications de destination ou d'horaire sont acceptées jusqu'à 2 heures avant le trajet.</p>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-on-surface mt-8 mb-4">4. Tarification</h2>
              <div className="space-y-4 text-on-surface-dim">
                <p>Tous les tarifs affichés incluent la prise en charge. Aucun frais supplémentaire ne sera facturé sauf circonstances exceptionnelles.</p>
                <p>Les tarifs CPAM suivent la tarification officielle de l'Assurance Maladie.</p>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-on-surface mt-8 mb-4">5. Responsabilités</h2>
              <p className="text-on-surface-dim leading-relaxed">
                Taxi Leblanc ne peut être tenu responsable des:
              </p>
              <ul className="list-disc list-inside text-on-surface-dim space-y-2 ml-4">
                <li>Retards dus à des conditions de circulation exceptionnelles</li>
                <li>Objets oubliés dans le véhicule après le trajet</li>
                <li>Dommages mineurs à vos bagages causés par une utilisation normale</li>
              </ul>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-on-surface mt-8 mb-4">6. Comportement des Passagers</h2>
              <p className="text-on-surface-dim leading-relaxed">
                Les passagers acceptent de respecter les règles suivantes:
              </p>
              <ul className="list-disc list-inside text-on-surface-dim space-y-2 ml-4">
                <li>Respecter le chauffeur et les autres passagers</li>
                <li>Ne pas fumer, manger ou boire dans le véhicule sauf eau</li>
                <li>Ne pas consommer de substances illégales</li>
                <li>Respecter les règles de sécurité routière</li>
              </ul>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-on-surface mt-8 mb-4">7. Données Personnelles</h2>
              <p className="text-on-surface-dim leading-relaxed">
                Vos données personnelles sont traitées conformément à notre politique de confidentialité.
                Consultez notre politique complète pour plus de détails.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-on-surface mt-8 mb-4">8. Modifications des Conditions</h2>
              <p className="text-on-surface-dim leading-relaxed">
                Taxi Leblanc se réserve le droit de modifier ces conditions à tout moment.
                Les modifications seront communiquées via ce site web.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-on-surface mt-8 mb-4">9. Contact</h2>
              <p className="text-on-surface-dim leading-relaxed">
                Pour toute question concernant ces conditions:
              </p>
              <div className="space-y-2 text-on-surface-dim">
                <p><strong className="text-on-surface">Email:</strong> TaxiLeblanc@gmail.com</p>
                <p><strong className="text-on-surface">Téléphone:</strong> +33 6 08 55 03 15</p>
                <p><strong className="text-on-surface">Adresse:</strong> 30 Allée des Bergeries, 91210 Draveil, France</p>
              </div>
            </section>

            <section>
              <p className="text-on-surface-dim text-sm mt-12">
                Dernière mise à jour: April 2026
              </p>
            </section>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
