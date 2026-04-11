import { Footer } from '@/components/layout/Footer';
import { HeroEditorial } from '@/components/features/home/HeroEditorial';
import { PartenaireEditorial } from '@/components/features/home/PartenaireEditorial';
import { ServicesEditorial } from '@/components/features/home/ServicesEditorial';
import { CharacteristicsEditorial } from '@/components/features/home/CharacteristicsEditorial';
import { StatsEditorial } from '@/components/features/home/StatsEditorial';
import { AvisEditorial } from '@/components/features/home/AvisEditorial';
import { ContactEditorial } from '@/components/features/home/ContactEditorial';
import { HomeHeader } from '@/components/layout/HomeHeader';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Taxi Leblanc - Taxi en Île-de-France | Aéroport, CPAM, Occasions',
  description: 'Taxi en Île-de-France : transferts aéroport, trajets médicalisés CPAM agréés et occasions personnelles. Réservation en ligne 24h/24.',
  alternates: {
    canonical: 'https://taxileblanc.fr',
  },
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

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'TaxiService',
  name: 'Taxi Leblanc',
  description:
    'Service de taxi en Île-de-France : transferts aéroport, trajets médicalisés CPAM agréés et occasions personnelles.',
  url: 'https://taxileblanc.fr',
  image: 'https://taxileblanc.fr/og-image.jpg',
  telephone: '+33608550315',
  priceRange: '€€',
  areaServed: [
    { '@type': 'AdministrativeArea', name: 'Île-de-France' },
    { '@type': 'City', name: 'Paris' },
    { '@type': 'City', name: 'Draveil' },
  ],
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '5.0',
    reviewCount: '31',
    bestRating: '5',
    worstRating: '1',
  },
  availableService: [
    { '@type': 'Service', name: 'Transport aéroport' },
    { '@type': 'Service', name: 'Transport médical CPAM' },
    { '@type': 'Service', name: 'Occasions personnelles' },
  ],
  hoursAvailable: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    opens: '00:00',
    closes: '23:59',
  },
};

const jsonLdString = JSON.stringify(jsonLd).replace(/</g, '\\u003c');

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: jsonLdString }}
      />
      <HomeHeader />

      {/* Content wrapper with padding to account for fixed navbar */}
      <div className="pt-16">
        <HeroEditorial />

      <div id="partenaire" className="scroll-mt-24">
        <PartenaireEditorial />
      </div>

      <div id="chiffres" className="scroll-mt-24">
        <StatsEditorial />
      </div>

      <div id="services" className="scroll-mt-24">
        <ServicesEditorial />
      </div>

      <div id="maison" className="scroll-mt-24">
        <CharacteristicsEditorial />
      </div>

      <div id="avis" className="scroll-mt-24">
        <AvisEditorial />
      </div>

      <div id="contact" className="scroll-mt-24">
        <ContactEditorial />
      </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
