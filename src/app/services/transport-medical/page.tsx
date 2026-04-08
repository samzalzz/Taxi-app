import type { Metadata } from 'next';
import { Footer } from '@/components/layout/Footer';
import { HomeHeader } from '@/components/layout/HomeHeader';
import { Button } from '@/components/ui/Button';
import { Heart, Shield, Users, Clock, Accessibility, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Transport Médical CPAM Agréé | Taxi Leblanc',
  description: 'Transport médical spécialisé avec prise en charge CPAM. Chauffeurs formés, véhicules adaptés aux personnes à mobilité réduite.',
  keywords: ['transport médical', 'CPAM', 'transport santé', 'PMR', 'personnes âgées'],
  openGraph: {
    title: 'Transport Médical CPAM | Taxi Leblanc',
    description: 'Transport médical agréé avec prise en charge CPAM remboursée.',
    type: 'website',
    url: 'https://taxileblanc.fr/services/transport-medical',
  },
};

export default function TransportMedicalPage() {
  return (
    <div className="min-h-screen bg-background">
      <HomeHeader />

      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-500/10 via-background to-background">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <Heart className="w-6 h-6 text-blue-500" />
            </div>
            <span className="text-sm font-semibold text-blue-500 uppercase">CPAM AGRÉÉ</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-on-surface mb-6">
            Transport Médical <em className="text-blue-500 not-italic">Remboursé par l'Assurance Maladie</em>
          </h1>
          <p className="text-lg text-on-surface-dim mb-8 leading-relaxed">
            Service spécialisé agréé CPAM pour tous vos trajets de santé. Chauffeurs formés, véhicules adaptés aux personnes à mobilité réduite, confort et sécurité garantis.
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

      {/* CPAM Information */}
      <section className="py-20 px-4 bg-blue-500/5">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-serif font-bold text-on-surface mb-8">
            Comment fonctionne le remboursement CPAM ?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="flex items-start gap-4 mb-6">
                <CheckCircle className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold text-on-surface mb-2">Ordonnance médicale requise</h3>
                  <p className="text-on-surface-dim">Votre médecin doit établir une ordonnance pour un transport de santé.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 mb-6">
                <CheckCircle className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold text-on-surface mb-2">Transport avec taxi agréé</h3>
                  <p className="text-on-surface-dim">Réservez avec Taxi Leblanc, agréé CPAM en Île-de-France.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <CheckCircle className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold text-on-surface mb-2">Remboursement automatique</h3>
                  <p className="text-on-surface-dim">La CPAM rembourse directement le transport sans frais pour vous.</p>
                </div>
              </div>
            </div>
            <div>
              <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-6">
                <h3 className="text-xl font-bold text-blue-500 mb-4">Trajets médicaux couverts :</h3>
                <ul className="space-y-2 text-on-surface-dim">
                  <li>✓ Consultations médicales et spécialisées</li>
                  <li>✓ Examens biologiques et radiologiques</li>
                  <li>✓ Hospitalisations et séjours de santé</li>
                  <li>✓ Dialyse et autres traitements réguliers</li>
                  <li>✓ Revalidation et rééducation</li>
                  <li>✓ Transports pour handicapés</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Link to Complete Guide */}
          <div className="mt-12 rounded-lg border-l-4 border-blue-500 bg-blue-500/5 p-8">
            <h3 className="text-2xl font-bold text-on-surface mb-3">📚 Guide Complet: Comment Obtenir un Remboursement CPAM?</h3>
            <p className="text-on-surface-dim mb-4">
              Vous souhaitez comprendre en détail comment fonctionne le remboursement CPAM? Notre guide complet explique:
              la procédure étape-par-étape, les documents requis, les conditions ALD, et les délais de remboursement.
            </p>
            <Link href="/guides/transport-cpam" className="inline-flex items-center gap-2 text-blue-500 hover:underline font-semibold">
              📖 Lire le guide complet du transport CPAM →
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-serif font-bold text-on-surface mb-12">
            Notre service médical spécialisé
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex gap-4">
              <Accessibility className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold text-on-surface mb-2">Véhicules adaptés</h3>
                <p className="text-on-surface-dim">Accès facile pour les personnes à mobilité réduite, fauteuils roulants acceptés.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <Users className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold text-on-surface mb-2">Chauffeurs formés</h3>
                <p className="text-on-surface-dim">Formation en gestion des personnes âgées et en premiers secours.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <Heart className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold text-on-surface mb-2">Confort maximum</h3>
                <p className="text-on-surface-dim">Trajets à faible vitesse, pas de braquages brusques, trajet en douceur.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <Shield className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold text-on-surface mb-2">Confidentiel et sûr</h3>
                <p className="text-on-surface-dim">Respect de la confidentialité médicale, assurance complète.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <Clock className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold text-on-surface mb-2">Disponibilité 24h/24</h3>
                <p className="text-on-surface-dim">Services disponibles jour et nuit, 7 jours sur 7.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <CheckCircle className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold text-on-surface mb-2">Assistance compagnon</h3>
                <p className="text-on-surface-dim">Accompagnement possible d'une personne de confiance sans frais.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-surface">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-serif font-bold text-on-surface mb-6">
            Besoin d'un transport médical agréé ?
          </h2>
          <p className="text-on-surface-dim text-lg mb-8">
            Nous sommes agréés CPAM. Préparez votre ordonnance médicale et réservez votre trajet en ligne.
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
