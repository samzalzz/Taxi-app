import { Footer } from '@/components/layout/Footer';
import { HeroEditorial } from '@/components/features/home/HeroEditorial';
import { ServicesEditorial } from '@/components/features/home/ServicesEditorial';
import { CharacteristicsEditorial } from '@/components/features/home/CharacteristicsEditorial';
import { StatsEditorial } from '@/components/features/home/StatsEditorial';
import { ContactEditorial } from '@/components/features/home/ContactEditorial';
import { HomeHeader } from '@/components/layout/HomeHeader';
import { CheckmarkIcon } from '@/components/ui/CheckmarkIcon';
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

      {/* Content wrapper with padding to account for fixed navbar */}
      <div className="pt-16">
        <HeroEditorial />

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
                  Que vous ayez besoin de vous rendre à l&apos;aéroport, de bénéficier d&apos;un transport médicalisé ou de voyager pour une occasion spéciale, Taxi Leblanc est la solution idéale. Un service personnalisé, sûr et confortable pour répondre à tous vos besoins de transport.
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
                    <p className="text-on-surface-dim text-sm">Taxi Leblanc s&apos;adapte à vos besoins spécifiques, quelles que soient les circonstances.</p>
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
                <p className="text-on-surface-dim">Prise en charge ponctuelle et transport direct vers votre terminal. Fini les soucis de stationnement ou d&apos;attente dans les transports en commun. Service porte-à-porte, bagages inclus.</p>
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

      <StatsEditorial />

      <ServicesEditorial />

      <CharacteristicsEditorial />

      <ContactEditorial />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
