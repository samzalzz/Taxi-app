import { Footer } from '@/components/layout/Footer';
import { StatCounter } from '@/components/features/stats/StatCounter';
import { BackgroundPathsDemo } from '@/components/features/home/BackgroundPathsDemo';
import { HomeHeader } from '@/components/layout/HomeHeader';
import { CheckmarkIcon } from '@/components/ui/CheckmarkIcon';
import { Car, Stethoscope, Users, Shield, Zap } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Taxi Leblanc - Service de Taxi Premium en Île-de-France | Aéroport, CPAM, Occasions',
  description: 'Taxi Leblanc : service premium de transport en Île-de-France. Transports aéroport, trajets médicalisés CPAM agréés, occasions personnelles. Réservez 24h/24.',
  keywords: ['taxi Île-de-France', 'taxi aéroport', 'transport CPAM', 'taxi médical', 'Draveil', 'taxi paris'],
  openGraph: {
    title: 'Taxi Leblanc - Service Premium de Transport en Île-de-France',
    description: 'Réservez votre taxi pour l\'aéroport, transports médicalisés CPAM ou occasions spéciales.',
    type: 'website',
    url: 'https://taxileblanc.fr',
    images: [
      {
        url: 'https://taxileblanc.fr/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Taxi Leblanc - Service Premium',
      },
    ],
  },
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <HomeHeader />

      {/* Hero Section with Background Paths */}
      <BackgroundPathsDemo />

      {/* Services Section */}
      <section className="py-20 px-4 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left Column */}
            <div>
              <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-4">VOTRE PARTENAIRE DE TRANSPORT</p>

              <h2 className="text-5xl md:text-6xl font-serif font-bold text-on-surface mb-6">
                Taxi Leblanc — <em className="text-primary not-italic">Transport pour toutes les occasions</em>
              </h2>

              <div className="border-t border-primary/30 mb-8 pt-8">
                <p className="text-on-surface-dim text-lg leading-relaxed mb-8">
                  Que vous ayez besoin de vous rendre à l'aéroport, de bénéficier d'un transport médicalisé ou de voyager pour une occasion spéciale, Taxi Leblanc est la solution idéale. Un service personnalisé, sûr et confortable pour répondre à tous vos besoins de transport.
                </p>
              </div>

              {/* Features */}
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <CheckmarkIcon />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-on-surface">Ponctualité et fiabilité</h3>
                    <p className="text-on-surface-dim text-sm">Nos chauffeurs connaissent parfaitement la région pour un trajet rapide et sans encombre.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <CheckmarkIcon />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-on-surface">Confort et sécurité</h3>
                    <p className="text-on-surface-dim text-sm">Véhicules modernes, bien entretenus et équipés pour toutes vos exigences.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <CheckmarkIcon />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-on-surface">Service personnalisé</h3>
                    <p className="text-on-surface-dim text-sm">Taxi Leblanc s'adapte à vos besoins spécifiques, quelles que soient les circonstances.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <CheckmarkIcon />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-on-surface">Chauffeurs professionnels</h3>
                    <p className="text-on-surface-dim text-sm">Courtois et formés pour répondre à toutes les situations avec la plus haute qualité.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Transport Aéroport */}
              <div className="border-l-4 border-primary pl-6">
                <h3 className="text-2xl font-serif font-bold text-on-surface mb-3">Transport aéroport</h3>
                <p className="text-on-surface-dim">Prise en charge ponctuelle et transport direct vers votre terminal. Fini les soucis de stationnement ou d'attente dans les transports en commun. Service porte-à-porte, bagages inclus.</p>
              </div>

              {/* Transport Médicalisé CPAM */}
              <div className="border-l-4 border-primary pl-6">
                <h3 className="text-2xl font-serif font-bold text-on-surface mb-3">Transport médicalisé CPAM</h3>
                <p className="text-on-surface-dim">Taxi agréé CPAM pour vos trajets de santé. Véhicules adaptés pour les personnes à mobilité réduite, personnes âgées ou nécessitant une assistance particulière. Chauffeurs formés aux situations médicales.</p>
              </div>

              {/* Occasions Personnelles */}
              <div className="border-l-4 border-primary pl-6">
                <h3 className="text-2xl font-serif font-bold text-on-surface mb-3">Occasions personnelles</h3>
                <p className="text-on-surface-dim">Mariages, anniversaires, soirées ou tout autre événement marquant. Un service haut de gamme avec chauffeurs ponctuels et véhicules confortables, pour que vous profitiez pleinement de votre journée.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 px-4 border-t border-b border-primary/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            {/* Years of Experience */}
            <div>
              <div className="text-7xl md:text-8xl font-serif font-bold text-primary mb-4 font-light">
                <StatCounter end={5} />
              </div>
              <p className="text-sm font-semibold text-on-surface-dim uppercase tracking-widest">Années d'expérience</p>
            </div>

            {/* Vehicles */}
            <div>
              <div className="text-7xl md:text-8xl font-serif font-bold text-primary mb-4 font-light">
                <StatCounter end={2} />
              </div>
              <p className="text-sm font-semibold text-on-surface-dim uppercase tracking-widest">Véhicules</p>
            </div>

            {/* Passengers */}
            <div>
              <div className="text-7xl md:text-8xl font-serif font-bold text-primary mb-4 font-light">
                <StatCounter end={40000} format="+" />
              </div>
              <p className="text-sm font-semibold text-on-surface-dim uppercase tracking-widest">Passagers transportés</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-4 bg-surface">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-serif font-bold text-center text-on-surface mb-12">
            Nos Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-background rounded-lg p-8 border border-on-surface/10">
              <Car className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold text-on-surface mb-2">Transferts Aéroport</h3>
              <p className="text-on-surface-dim">
                Transport fiable vers et depuis les aéroports d'Île-de-France
              </p>
            </div>
            <div className="bg-background rounded-lg p-8 border border-on-surface/10">
              <Stethoscope className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold text-on-surface mb-2">Transport Médical</h3>
              <p className="text-on-surface-dim">
                Service spécialisé avec prise en charge CPAM
              </p>
            </div>
            <div className="bg-background rounded-lg p-8 border border-on-surface/10">
              <Users className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold text-on-surface mb-2">Occasions Personnelles</h3>
              <p className="text-on-surface-dim">
                Événements, rendez-vous professionnels et trajets du quotidien
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Characteristics Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-serif font-bold text-center text-on-surface mb-12">
            Nos Caractéristiques
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <Users className="w-12 h-12 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-on-surface mb-2">Personnel</h3>
              <p className="text-on-surface-dim">
                Service attentif et courtois adapté à vos besoins
              </p>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <Shield className="w-12 h-12 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-on-surface mb-2">Professionnel</h3>
              <p className="text-on-surface-dim">
                Chauffeurs expérimentés et véhicules de qualité
              </p>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <Zap className="w-12 h-12 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-on-surface mb-2">Médical</h3>
              <p className="text-on-surface-dim">
                Formation spécialisée et protocoles de sécurité
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 px-4 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Column - Contact Info */}
            <div>
              <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-6">PRENDRE CONTACT</p>

              <h2 className="text-5xl md:text-6xl font-serif font-bold text-on-surface mb-6">
                Des questions ?<br />
                <em className="text-primary not-italic">Contactez-nous</em>
              </h2>

              <div className="border-t border-primary/30 my-8"></div>

              {/* Address */}
              <div className="flex gap-4 mb-8">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10 border border-primary/20">
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold text-primary uppercase">Notre adresse</p>
                  <p className="text-on-surface">30 Allée des Bergeries</p>
                  <p className="text-on-surface-dim">Draveil, 91210, France</p>
                </div>
              </div>

              {/* Hours */}
              <div className="flex gap-4 mb-8">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10 border border-primary/20">
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 2m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold text-primary uppercase">Horaires d'ouverture</p>
                  <p className="text-on-surface">Lundi — Dimanche</p>
                  <p className="text-on-surface-dim">00:00 — 00:00 (24h/24)</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10 border border-primary/20">
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 00.948.684l2.498 0a1 1 0 00.502-.135l2.5-1.25a1 1 0 00.502-.135L17.72 2.684a1 1 0 00.948-.684h3.28a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold text-primary uppercase">Téléphone</p>
                  <p className="text-on-surface">+33 6 08 55 03 15</p>
                  <p className="text-on-surface-dim">Disponible 24h/24 et 7j/7</p>
                </div>
              </div>
            </div>

            {/* Right Column - CTA */}
            <div className="rounded-2xl border border-primary/20 bg-surface/50 backdrop-blur p-8 lg:p-12 flex flex-col justify-center">
              <h3 className="text-3xl md:text-4xl font-serif font-bold text-on-surface mb-4">
                Réservez votre taxi dès maintenant
              </h3>
              <p className="text-on-surface-dim mb-8">
                Indiquez le lieu et l'heure de prise en charge, ainsi que votre destination. Nous vous répondrons dans les plus brefs délais.
              </p>

              <div className="flex flex-col gap-4">
                <a href="tel:+33608550315">
                  <button className="w-full px-6 py-4 bg-primary text-background rounded-lg font-semibold hover:bg-primary-dark transition-colors flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 00.948.684l2.498 0a1 1 0 00.502-.135l2.5-1.25a1 1 0 00.502-.135L17.72 2.684a1 1 0 00.948-.684h3.28a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5z" />
                    </svg>
                    Appeler le +33 6 08 55 03 15
                  </button>
                </a>

                <Link href="/reserver">
                  <Button className="w-full" variant="outline">
                    Réserver maintenant
                  </Button>
                </Link>

                <a href="mailto:TaxiLeblanc@gmail.com">
                  <button className="w-full px-6 py-4 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary hover:text-background transition-colors flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Écrire à TaxiLeblanc@gmail.com
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
