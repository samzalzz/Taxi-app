import type { Metadata } from 'next';
import { Footer } from '@/components/layout/Footer';
import { HomeHeader } from '@/components/layout/HomeHeader';
import { Button } from '@/components/ui/Button';
import { Plane, MapPin, Clock, Shield, Users, Briefcase } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Transport Aéroport Île-de-France | Taxi Leblanc',
  description: 'Service de transport vers les aéroports de Paris CDG, Orly et Beauvais. Prise en charge directe, bagages inclus, réservation 24h/24.',
  keywords: ['transport aéroport', 'CDG', 'Orly', 'Beauvais', 'taxi aéroport', 'Île-de-France'],
  openGraph: {
    title: 'Transport Aéroport Île-de-France | Taxi Leblanc',
    description: 'Service de transport vers les aéroports de Paris. Réservez dès maintenant.',
    type: 'website',
    url: 'https://taxileblanc.fr/services/transport-aeroportuaire',
    images: [{ url: 'https://taxileblanc.fr/og-aeroport.jpg', width: 1200, height: 630 }],
  },
};

export default function TransportAeroportPage() {
  return (
    <div className="min-h-screen bg-background">
      <HomeHeader />

      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary/10 via-background to-background">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
              <Plane className="w-6 h-6 text-primary" />
            </div>
            <span className="text-sm font-semibold text-primary uppercase">SERVICE SPÉCIALISÉ</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-on-surface mb-6">
            Transport vers les <em className="text-primary not-italic">Aéroports de Paris</em>
          </h1>
          <p className="text-lg text-on-surface-dim mb-8 leading-relaxed">
            Service de transport fiable et ponctuel vers Charles de Gaulle, Orly et Beauvais. Prise en charge directe de votre domicile, pas d'attente ni de stress.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/reserver" className="flex-1">
              <Button variant="primary" className="w-full">Réserver maintenant</Button>
            </Link>
            <a href="tel:+33608550315" className="flex-1">
              <Button variant="secondary" className="w-full">Appeler</Button>
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-serif font-bold text-on-surface mb-12">
            Pourquoi choisir Taxi Leblanc pour votre trajet aéroport ?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex gap-4">
              <Clock className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold text-on-surface mb-2">Ponctualité garantie</h3>
                <p className="text-on-surface-dim">Nos chauffeurs connaissent les meilleurs itinéraires pour éviter les embouteillages et vous arriver à l'heure.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <MapPin className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold text-on-surface mb-2">Prise en charge directe</h3>
                <p className="text-on-surface-dim">Du domicile à l'aéroport, service porte-à-porte. Pas de détours, pas de surcoûts.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <Briefcase className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold text-on-surface mb-2">Bagages inclus</h3>
                <p className="text-on-surface-dim">Nos véhicules spacieux accueillent tous vos bagages sans frais supplémentaires.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <Shield className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold text-on-surface mb-2">Sécurisé et assuré</h3>
                <p className="text-on-surface-dim">Assurance complète et chauffeurs professionnels formés pour la sécurité routière.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <Users className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold text-on-surface mb-2">Service client 24h/24</h3>
                <p className="text-on-surface-dim">Contactez-nous à tout moment pour modifier ou annuler votre réservation.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <Clock className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold text-on-surface mb-2">Réservation 2h minimum</h3>
                <p className="text-on-surface-dim">Réservez votre trajet au minimum 2 heures à l'avance pour plus de confort.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Airports Section */}
      <section className="py-20 px-4 bg-surface">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-serif font-bold text-on-surface mb-12">Aéroports desservis</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="rounded-lg border border-on-surface/10 p-6 bg-background">
              <h3 className="text-2xl font-bold text-primary mb-3">Charles de Gaulle</h3>
              <p className="text-on-surface-dim mb-4">L'aéroport international majeur de l'Île-de-France, accessible via 2-3 routes principales.</p>
              <p className="font-semibold text-on-surface mb-4">À partir de 55€</p>
              <Link href="/estimation-tarif" className="text-primary hover:underline text-sm font-semibold">
                → En savoir plus sur les tarifs
              </Link>
            </div>
            <div className="rounded-lg border border-on-surface/10 p-6 bg-background">
              <h3 className="text-2xl font-bold text-primary mb-3">Orly</h3>
              <p className="text-on-surface-dim mb-4">Deuxième aéroport parisien, plus proche de nombreux quartiers de la capitale.</p>
              <p className="font-semibold text-on-surface mb-4">À partir de 45€</p>
              <Link href="/estimation-tarif" className="text-primary hover:underline text-sm font-semibold">
                → En savoir plus sur les tarifs
              </Link>
            </div>
            <div className="rounded-lg border border-on-surface/10 p-6 bg-background">
              <h3 className="text-2xl font-bold text-primary mb-3">Beauvais</h3>
              <p className="text-on-surface-dim mb-4">Aéroport nord utilisé par de nombreuses compagnies low-cost.</p>
              <p className="font-semibold text-on-surface mb-4">À partir de 65€</p>
              <Link href="/estimation-tarif" className="text-primary hover:underline text-sm font-semibold">
                → En savoir plus sur les tarifs
              </Link>
            </div>
          </div>

          {/* Pricing Info Section */}
          <div className="rounded-lg border-l-4 border-primary bg-primary/5 p-8 mb-12">
            <h3 className="text-2xl font-bold text-on-surface mb-3">💰 Tarifs Forfaitaires Garantis</h3>
            <p className="text-on-surface-dim mb-4">
              Les tarifs affichés sont des <strong>forfaits réglementés</strong> établis par la Préfecture de Police de Paris.
              Ils s'appliquent à tous les taxis parisiens conventionnés — aucune surprise, aucun supplément caché.
            </p>
            <Link href="/estimation-tarif" className="inline-flex items-center gap-2 text-primary hover:underline font-semibold">
              📊 Voir l'estimateur de tarif détaillé →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-serif font-bold text-on-surface mb-6">
            Prêt pour votre transport aéroport ?
          </h2>
          <p className="text-on-surface-dim text-lg mb-8">
            Réservez en ligne en quelques secondes ou appelez-nous pour plus d'informations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/reserver">
              <Button variant="primary" size="lg">Réserver maintenant</Button>
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
