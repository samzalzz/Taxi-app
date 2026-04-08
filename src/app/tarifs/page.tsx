import type { Metadata } from 'next';
import { Footer } from '@/components/layout/Footer';
import { HomeHeader } from '@/components/layout/HomeHeader';
import { Button } from '@/components/ui/Button';
import { Check } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Tarifs Taxi | Taxi Leblanc',
  description: 'Découvrez nos tarifs transparents pour transports aéroport, trajets médicalisés CPAM et occasions. Pas de frais cachés.',
  keywords: ['tarifs taxi', 'prix taxi', 'transport aéroport tarif', 'taxi CPAM'],
};

const rates = [
  {
    title: 'Transport Aéroport CDG',
    price: 'À partir de 55€',
    description: 'Prise en charge vers Charles de Gaulle',
    features: [
      'Prise en charge directe',
      'Bagages inclus',
      'Disponibilité 24h/24',
      'Ponctualité garantie',
      'Minimum 2 heures à l\'avance',
    ],
  },
  {
    title: 'Transport Aéroport Orly',
    price: 'À partir de 45€',
    description: 'Prise en charge vers Aéroport d\'Orly',
    features: [
      'Prise en charge directe',
      'Bagages inclus',
      'Disponibilité 24h/24',
      'Ponctualité garantie',
      'Minimum 2 heures à l\'avance',
    ],
  },
  {
    title: 'Transport Aéroport Beauvais',
    price: 'À partir de 65€',
    description: 'Prise en charge vers Aéroport de Beauvais',
    features: [
      'Prise en charge directe',
      'Bagages inclus',
      'Disponibilité 24h/24',
      'Ponctualité garantie',
      'Minimum 2 heures à l\'avance',
    ],
  },
  {
    title: 'Transport Médical CPAM',
    price: 'Remboursé',
    description: 'Trajets médicalisés avec ordonnance',
    features: [
      'Remboursement CPAM',
      'Véhicules adaptés',
      'Chauffeurs formés',
      'Personnes à mobilité réduite',
      'Ordonnance requise',
    ],
    highlight: true,
  },
  {
    title: 'Occasions Personnelles',
    price: 'À partir de 50€',
    description: 'Mariages, anniversaires, événements',
    features: [
      'Service premium',
      'Chauffeur professionnel',
      'Ponctualité absolue',
      'Service personnalisé',
      'Tarif sur devis pour gros événements',
    ],
  },
  {
    title: 'Location avec Chauffeur',
    price: 'À partir de 60€/h',
    description: 'Chauffeur pour la journée ou demi-journée',
    features: [
      'Disponibilité complète',
      'Connaisseur des itinéraires',
      'Véhicule confortable',
      'Tarif horaire ou forfait',
      'Minimum 4 heures',
    ],
  },
];

export default function TarifsPage() {
  return (
    <div className="min-h-screen bg-background">
      <HomeHeader />

      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary/10 via-background to-background">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-on-surface mb-6">
            Tarifs Transparents et Justes
          </h1>
          <p className="text-lg text-on-surface-dim">
            Tous nos tarifs incluent les frais de prise en charge. Pas de frais cachés.
          </p>
        </div>
      </section>

      {/* Pricing Grid */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {rates.map((rate, index) => (
              <div
                key={index}
                className={`rounded-xl border transition-all ${
                  rate.highlight
                    ? 'border-primary bg-surface-light ring-2 ring-primary/50 scale-105'
                    : 'border-on-surface/10 bg-surface hover:border-primary/30'
                }`}
              >
                <div className="p-8">
                  {rate.highlight && (
                    <div className="inline-block bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-semibold mb-4">
                      Remboursé CPAM
                    </div>
                  )}
                  <h3 className="text-2xl font-bold text-on-surface mb-2">
                    {rate.title}
                  </h3>
                  <p className="text-on-surface-dim mb-6 text-sm">
                    {rate.description}
                  </p>
                  <div className="mb-8 pb-8 border-b border-on-surface/10">
                    <div className="text-4xl font-bold text-primary">
                      {rate.price}
                    </div>
                  </div>
                  <ul className="space-y-4">
                    {rate.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-on-surface-dim text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href="/reserver" className="block mt-8">
                    <Button variant={rate.highlight ? 'primary' : 'secondary'} className="w-full">
                      Réserver
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 bg-surface">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-serif font-bold text-on-surface mb-12">
            Questions sur les tarifs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold text-on-surface mb-3">Les tarifs incluent-ils la prise en charge ?</h3>
              <p className="text-on-surface-dim">Oui, tous nos tarifs incluent la prise en charge de 2,50€. Aucun frais supplémentaire n'est facturé.</p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-on-surface mb-3">Puis-je modifier mon trajet après la réservation ?</h3>
              <p className="text-on-surface-dim">Oui, vous pouvez modifier votre destination ou heure jusqu'à 2 heures avant le trajet sans frais supplémentaires.</p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-on-surface mb-3">Y a-t-il des frais de nuit ou week-end ?</h3>
              <p className="text-on-surface-dim">Non, nos tarifs sont identiques 24h/24, 7j/7. Aucune surcharge pour les trajets de nuit ou en week-end.</p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-on-surface mb-3">Comment sont calculés les tarifs CPAM ?</h3>
              <p className="text-on-surface-dim">La tarification CPAM suit les barèmes officiels de l'Assurance Maladie. Vous n'avez rien à payer directement.</p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-on-surface mb-3">Acceptez-vous les cartes bancaires ?</h3>
              <p className="text-on-surface-dim">Oui, nous acceptons toutes les cartes bancaires, espèces et virements bancaires pour les trajets réguliers.</p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-on-surface mb-3">Y a-t-il une réduction pour les trajets réguliers ?</h3>
              <p className="text-on-surface-dim">Oui, contactez-nous pour discuter des forfaits et tarifs préférentiels pour les trajets réguliers.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-serif font-bold text-on-surface mb-6">
            Prêt à réserver ?
          </h2>
          <p className="text-on-surface-dim text-lg mb-8">
            Obtenez un devis précis ou réservez votre trajet dès maintenant.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/reserver">
              <Button variant="primary" size="lg">Réserver</Button>
            </Link>
            <a href="tel:+33608550315">
              <Button variant="secondary" size="lg">Appeler</Button>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
