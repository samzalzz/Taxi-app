import { Footer } from '@/components/layout/Footer';
import { HeroEditorial } from '@/components/features/home/HeroEditorial';
import { PartenaireEditorial } from '@/components/features/home/PartenaireEditorial';
import { ServicesEditorial } from '@/components/features/home/ServicesEditorial';
import { CharacteristicsEditorial } from '@/components/features/home/CharacteristicsEditorial';
import { StatsEditorial } from '@/components/features/home/StatsEditorial';
import { ContactEditorial } from '@/components/features/home/ContactEditorial';
import { HomeHeader } from '@/components/layout/HomeHeader';
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

      <div id="contact" className="scroll-mt-24">
        <ContactEditorial />
      </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
