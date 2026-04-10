import type { Metadata } from 'next';
import { Footer } from '@/components/layout/Footer';
import { HomeHeader } from '@/components/layout/HomeHeader';
import { Button } from '@/components/ui/Button';
import { CheckCircle, MapPin, CreditCard, Smartphone } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Comment Réserver un Taxi en 2 Minutes | Guide Complet | Taxi Leblanc',
  description: 'Guide complet: comment réserver un taxi en ligne ou par téléphone? Étapes simples, tarifs transparents, réservation 24h/24.',
  keywords: [
    'comment réserver taxi',
    'réserver taxi en ligne',
    'appeler taxi',
    'réservation taxi',
    'réserver taxi 24h',
    'taxi réservation en ligne',
    'comment appeler un taxi',
    'réserver taxi par téléphone',
  ],
};

export default function CommentReserverPage() {
  return (
    <div className="min-h-screen bg-background">
      <HomeHeader />

      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary/10 via-background to-background">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-on-surface mb-6">
            Comment Réserver <em className="text-primary not-italic">en 2 Minutes</em>
          </h1>
          <p className="text-lg text-on-surface-dim mb-6">
            Réservez votre taxi avec Taxi Leblanc en quelques clics ou appels. Trois méthodes simples pour vous servir.
          </p>
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
            <p className="text-sm text-on-surface-dim">
              <strong>⏰ Délai minimum:</strong> 2 heures avant votre prise en charge • <strong>📞 Support:</strong> +33 6 08 55 03 15 (24h/24)
            </p>
          </div>
        </div>
      </section>

      {/* Booking Methods */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-serif font-bold text-on-surface mb-12">
            3 Façons de Réserver
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* Method 1: Online */}
            <div className="rounded-xl border-2 border-primary bg-surface-light p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Smartphone className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-on-surface">En ligne</h3>
              </div>
              <p className="text-on-surface-dim mb-6">
                La façon la plus simple et rapide. Remplissez le formulaire et réservez en quelques secondes.
              </p>
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-2 text-sm text-on-surface-dim">
                  <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>Pas de compte requis</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-on-surface-dim">
                  <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>Confirmation instantanée</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-on-surface-dim">
                  <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>Tarifs transparents</span>
                </div>
              </div>
              <Link href="/reserver" className="block">
                <Button variant="primary" className="w-full">
                  Réserver maintenant
                </Button>
              </Link>
            </div>

            {/* Method 2: Phone */}
            <div className="rounded-xl border-2 border-primary bg-surface-light p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-on-surface">Par téléphone</h3>
              </div>
              <p className="text-on-surface-dim mb-6">
                Appelez-nous directement pour une réservation garantie et personnalisée.
              </p>
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-2 text-sm text-on-surface-dim">
                  <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>Réservation sécurisée</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-on-surface-dim">
                  <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>Conseil personnalisé</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-on-surface-dim">
                  <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>Disponible 24h/24</span>
                </div>
              </div>
              <a href="tel:+33608550315" className="block">
                <Button variant="primary" className="w-full">
                  Appeler maintenant
                </Button>
              </a>
            </div>

            {/* Method 3: WhatsApp */}
            <div className="rounded-xl border-2 border-primary bg-surface-light p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-on-surface">SMS/Whatsapp</h3>
              </div>
              <p className="text-on-surface-dim mb-6">
                Réservez par message pour une confirmation rapide sans appel.
              </p>
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-2 text-sm text-on-surface-dim">
                  <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>Réponse en quelques minutes</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-on-surface-dim">
                  <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>Confirmation écrite</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-on-surface-dim">
                  <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>Sans prise d&apos;appel</span>
                </div>
              </div>
              <a href="tel:+33608550315" className="block">
                <Button variant="primary" className="w-full">
                  Envoyer SMS
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Step by Step - Online */}
      <section className="py-20 px-4 bg-surface">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-serif font-bold text-on-surface mb-12">
            Réservation En Ligne — Étape par Étape
          </h2>

          <div className="space-y-6">
            <div className="rounded-lg border border-on-surface/10 bg-background p-8">
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">1</div>
                <div className="flex-grow">
                  <h3 className="text-xl font-bold text-on-surface mb-2">Accédez au formulaire de réservation</h3>
                  <p className="text-on-surface-dim">
                    Cliquez sur &quot;Réserver maintenant&quot; ou visitez la page <Link href="/reserver" className="text-primary hover:underline">www.taxileblanc.fr/reserver</Link>
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-on-surface/10 bg-background p-8">
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">2</div>
                <div className="flex-grow">
                  <h3 className="text-xl font-bold text-on-surface mb-2">Remplissez vos informations</h3>
                  <p className="text-on-surface-dim mb-3">
                    Entrez votre adresse de départ et destination. Vous verrez instantanément l&apos;estimation de prix.
                  </p>
                  <div className="bg-surface rounded p-3 text-sm text-on-surface-dim border-l-4 border-primary">
                    <strong>Informations requises:</strong> Nom, Email, Téléphone, Adresse départ, Destination, Date/Heure
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-on-surface/10 bg-background p-8">
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">3</div>
                <div className="flex-grow">
                  <h3 className="text-xl font-bold text-on-surface mb-2">Sélectionnez vos options</h3>
                  <p className="text-on-surface-dim">
                    Indiquez le nombre de passagers, si vous avez des bagages, si vous avez besoin d&apos;un véhicule adapté, etc.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-on-surface/10 bg-background p-8">
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">4</div>
                <div className="flex-grow">
                  <h3 className="text-xl font-bold text-on-surface mb-2">Vérifiez le tarif</h3>
                  <p className="text-on-surface-dim">
                    Vérifiez le prix final estimé. Les forfaits aéroports sont fixes. Les autres trajets sont estimés
                    selon la distance et conditions de circulation.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-on-surface/10 bg-background p-8">
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">5</div>
                <div className="flex-grow">
                  <h3 className="text-xl font-bold text-on-surface mb-2">Confirmez votre réservation</h3>
                  <p className="text-on-surface-dim">
                    Cliquez sur &quot;Confirmer&quot; et vous recevrez instantanément un email et SMS avec tous les détails de votre réservation.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-on-surface/10 bg-background p-8">
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">6</div>
                <div className="flex-grow">
                  <h3 className="text-xl font-bold text-on-surface mb-2">Recevez votre confirmation</h3>
                  <p className="text-on-surface-dim">
                    Vous recevrez un code de réservation unique et les informations du chauffeur 30 minutes avant le trajet.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Important Information */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-serif font-bold text-on-surface mb-12">
            ⏰ Points Importants à Retenir
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-lg border-l-4 border-primary bg-surface p-6">
              <h3 className="text-lg font-bold text-on-surface mb-3">Délai minimum: 2 heures</h3>
              <p className="text-on-surface-dim text-sm">
                Vous devez réserver <strong>au minimum 2 heures avant</strong> votre prise en charge.
                Pour une urgence, appelez-nous directement au +33 6 08 55 03 15.
              </p>
            </div>

            <div className="rounded-lg border-l-4 border-primary bg-surface p-6">
              <h3 className="text-lg font-bold text-on-surface mb-3">Annulation gratuite</h3>
              <p className="text-on-surface-dim text-sm">
                Vous pouvez annuler <strong>jusqu&apos;à 2 heures avant</strong> sans frais.
                Les annulations tardives peuvent entraîner des frais.
              </p>
            </div>

            <div className="rounded-lg border-l-4 border-primary bg-surface p-6">
              <h3 className="text-lg font-bold text-on-surface mb-3">Tarifs fixes aux aéroports</h3>
              <p className="text-on-surface-dim text-sm">
                Les forfaits aéroports (CDG 50€, Orly 36€, Beauvais 65€) sont garantis.
                Aucune surprise, aucun supplément caché.
              </p>
            </div>

            <div className="rounded-lg border-l-4 border-primary bg-surface p-6">
              <h3 className="text-lg font-bold text-on-surface mb-3">Confirmation de réservation</h3>
              <p className="text-on-surface-dim text-sm">
                Après réservation, vous recevrez une confirmation avec tous les détails du trajet et les coordonnées du chauffeur.
                Aucun paiement en ligne n&apos;est requis — arrangez directement avec le chauffeur lors du trajet.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 bg-surface">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-serif font-bold text-on-surface mb-12">
            Questions Fréquentes sur la Réservation
          </h2>

          <div className="space-y-4">
            <details className="group border border-on-surface/10 rounded-lg overflow-hidden hover:border-primary/30 transition-colors">
              <summary className="flex items-center justify-between cursor-pointer p-6 bg-background hover:bg-background/80 transition-colors">
                <h4 className="font-semibold text-on-surface">Dois-je créer un compte pour réserver?</h4>
              </summary>
              <div className="px-6 pb-6 bg-background border-t border-on-surface/10 text-on-surface-dim text-sm">
                Non, aucun compte n&apos;est requis. Vous pouvez réserver sans inscription. Un email de confirmation vous sera envoyé.
              </div>
            </details>

            <details className="group border border-on-surface/10 rounded-lg overflow-hidden hover:border-primary/30 transition-colors">
              <summary className="flex items-center justify-between cursor-pointer p-6 bg-background hover:bg-background/80 transition-colors">
                <h4 className="font-semibold text-on-surface">Puis-je modifier ma réservation après la confirmation?</h4>
              </summary>
              <div className="px-6 pb-6 bg-background border-t border-on-surface/10 text-on-surface-dim text-sm">
                Oui, vous pouvez modifier la destination ou l&apos;heure jusqu&apos;à 2 heures avant le trajet.
                Contactez-nous au +33 6 08 55 03 15 ou via email.
              </div>
            </details>

            <details className="group border border-on-surface/10 rounded-lg overflow-hidden hover:border-primary/30 transition-colors">
              <summary className="flex items-center justify-between cursor-pointer p-6 bg-background hover:bg-background/80 transition-colors">
                <h4 className="font-semibold text-on-surface">Comment puis-je payer ma réservation?</h4>
              </summary>
              <div className="px-6 pb-6 bg-background border-t border-on-surface/10 text-on-surface-dim text-sm">
                Vous n&apos;avez rien à payer en ligne. Appelez le chauffeur ou arrangez-vous directement avec lui les modalités de paiement et les détails du trajet.
              </div>
            </details>

            <details className="group border border-on-surface/10 rounded-lg overflow-hidden hover:border-primary/30 transition-colors">
              <summary className="flex items-center justify-between cursor-pointer p-6 bg-background hover:bg-background/80 transition-colors">
                <h4 className="font-semibold text-on-surface">Que se passe-t-il si le chauffeur est en retard?</h4>
              </summary>
              <div className="px-6 pb-6 bg-background border-t border-on-surface/10 text-on-surface-dim text-sm">
                Nos chauffeurs sont très ponctuels. En cas de retard exceptionnels (embouteillage), nous vous contactons.
                Vous pouvez annuler sans frais si le retard dépasse 10 minutes.
              </div>
            </details>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-serif font-bold text-on-surface mb-6">
            Prêt à Réserver?
          </h2>
          <p className="text-on-surface-dim text-lg mb-8">
            Réservez maintenant et bénéficiez d&apos;un transport fiable et transparent.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/reserver">
              <Button variant="primary" size="lg">Réserver en ligne</Button>
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
