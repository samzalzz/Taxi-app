import type { Metadata } from 'next';
import { Footer } from '@/components/layout/Footer';
import { HomeHeader } from '@/components/layout/HomeHeader';
import { Button } from '@/components/ui/Button';
import { Sparkles, Heart, Users, Zap, Trophy, Music } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Taxi pour Occasions Personnelles | Taxi Leblanc',
  description: 'Transport premium pour vos occasions spéciales : mariages, anniversaires, événements. Chauffeurs professionnels, véhicules confortables.',
  keywords: ['taxi mariage', 'événement', 'anniversaire', 'taxi occasion', 'transport événement'],
};

export default function OccasionsPersonnellesPage() {
  return (
    <div className="min-h-screen bg-background">
      <HomeHeader />

      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-purple-500/10 via-background to-background">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-purple-500" />
            </div>
            <span className="text-sm font-semibold text-purple-500 uppercase">Service Premium</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-on-surface mb-6">
            Vos Occasions <em className="text-purple-500 not-italic">Méritent du Luxe</em>
          </h1>
          <p className="text-lg text-on-surface-dim mb-8 leading-relaxed">
            Mariages, anniversaires, événements professionnels ou soirées inoubliables. Laissez-nous vous transporter avec élégance et style pour que vous profitiez pleinement de votre moment spécial.
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

      {/* Occasions Section */}
      <section className="py-20 px-4 bg-surface">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-serif font-bold text-on-surface mb-12">
            Tous les types d&apos;occasions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="rounded-lg border border-on-surface/10 p-6 bg-background">
              <Heart className="w-8 h-8 text-purple-500 mb-4" />
              <h3 className="text-2xl font-bold text-on-surface mb-3">Mariages</h3>
              <p className="text-on-surface-dim mb-4">Transport élégant pour les mariés et leurs invités. Service ponctuels, photographe friendly.</p>
              <p className="text-sm text-purple-500 font-semibold">Tarif sur devis</p>
            </div>

            <div className="rounded-lg border border-on-surface/10 p-6 bg-background">
              <Trophy className="w-8 h-8 text-purple-500 mb-4" />
              <h3 className="text-2xl font-bold text-on-surface mb-3">Anniversaires</h3>
              <p className="text-on-surface-dim mb-4">Rendez vos anniversaires inoubliables avec un transport haut de gamme pour vous et vos proches.</p>
              <p className="text-sm text-purple-500 font-semibold">À partir de 50€</p>
            </div>

            <div className="rounded-lg border border-on-surface/10 p-6 bg-background">
              <Music className="w-8 h-8 text-purple-500 mb-4" />
              <h3 className="text-2xl font-bold text-on-surface mb-3">Soirées Spéciales</h3>
              <p className="text-on-surface-dim mb-4">Événements corporatifs, galas, concerts. Transport sécurisé et discret pour vos événements.</p>
              <p className="text-sm text-purple-500 font-semibold">À partir de 55€</p>
            </div>

            <div className="rounded-lg border border-on-surface/10 p-6 bg-background">
              <Users className="w-8 h-8 text-purple-500 mb-4" />
              <h3 className="text-2xl font-bold text-on-surface mb-3">Groupes et Événements</h3>
              <p className="text-on-surface-dim mb-4">Déplacements collectifs pour associations, clubs ou comités. Coordination professionnelle.</p>
              <p className="text-sm text-purple-500 font-semibold">Tarif groupe</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-serif font-bold text-on-surface mb-12">
            Pourquoi Taxi Leblanc pour vos occasions ?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex gap-4">
              <Sparkles className="w-6 h-6 text-purple-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold text-on-surface mb-2">Élégance et style</h3>
                <p className="text-on-surface-dim">Véhicules bien entretenus, chauffeurs vêtus correctement, prestance garantie.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <Zap className="w-6 h-6 text-purple-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold text-on-surface mb-2">Ponctualité absolue</h3>
                <p className="text-on-surface-dim">Arrivals à l&apos;heure, pas de retards, coordination parfaite avec votre emploi du temps.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <Heart className="w-6 h-6 text-purple-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold text-on-surface mb-2">Service personnalisé</h3>
                <p className="text-on-surface-dim">Adaptés à vos besoins spécifiques, discrétion totale, attention aux détails.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <Trophy className="w-6 h-6 text-purple-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold text-on-surface mb-2">Expérience éprouvée</h3>
                <p className="text-on-surface-dim">Des centaines d&apos;événements réussis, chauffeurs expérimentés, références disponibles.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-surface">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-serif font-bold text-on-surface mb-6">
            Prêt pour votre occasion spéciale ?
          </h2>
          <p className="text-on-surface-dim text-lg mb-8">
            Contactez-nous dès aujourd&apos;hui pour discuter de vos besoins et obtenir un devis.
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
