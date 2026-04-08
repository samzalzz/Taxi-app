import type { Metadata } from 'next';
import { Footer } from '@/components/layout/Footer';
import { HomeHeader } from '@/components/layout/HomeHeader';
import { Button } from '@/components/ui/Button';
import { CheckCircle, Info, AlertCircle, FileText, Clock, Users } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Guide Complet Transport Médical CPAM | Remboursement 100% | Taxi Leblanc',
  description: 'Guide complet: comment se faire rembourser un taxi par la CPAM? Ordonnance, documents, procédure, ALD, remboursement 55% ou 100%. Taxi agréé Île-de-France.',
  keywords: [
    'transport CPAM',
    'remboursement taxi CPAM',
    'taxi agréé CPAM',
    'transport médical remboursé',
    'ordonnance transport taxi',
    'CPAM remboursement 100%',
    'ALD transport',
    'taxi conventionné CPAM',
    'comment se faire rembourser taxi',
    'transport santé CPAM',
  ],
  openGraph: {
    title: 'Transport Médical CPAM - Guide Complet Remboursement | Taxi Leblanc',
    description: 'Comment obtenir 55% ou 100% de remboursement pour un taxi? Guide étape par étape.',
    type: 'website',
    url: 'https://taxileblanc.fr/guides/transport-cpam',
  },
};

export default function TransportCPAMGuidePage() {
  return (
    <div className="min-h-screen bg-background">
      <HomeHeader />

      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-500/10 via-background to-background">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-on-surface mb-6">
            Transport Médical CPAM <em className="text-blue-500 not-italic">Guide Complet</em>
          </h1>
          <p className="text-lg text-on-surface-dim mb-6 leading-relaxed">
            Comment vous faire rembourser vos trajets de santé par la CPAM? Ce guide explique tout: ordonnance, documents requis,
            taux de remboursement, et procédure étape par étape.
          </p>
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6">
            <p className="text-sm text-on-surface-dim">
              <strong>✓ Taxi agréé CPAM</strong> • <strong>✓ Remboursement 55% ou 100%</strong> • <strong>✓ Véhicules adaptés</strong>
            </p>
          </div>
        </div>
      </section>

      {/* Table of Contents */}
      <section className="py-12 px-4 bg-surface sticky top-20 z-40">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-sm font-bold text-primary uppercase mb-4">Sur cette page</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <a href="#eligibilite" className="text-on-surface hover:text-primary transition">Éligibilité</a>
            <a href="#ordonnance" className="text-on-surface hover:text-primary transition">Ordonnance</a>
            <a href="#remboursement" className="text-on-surface hover:text-primary transition">Remboursement</a>
            <a href="#procedure" className="text-on-surface hover:text-primary transition">Procédure</a>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto space-y-16">

          {/* Section 1: Eligibilité */}
          <div id="eligibilite">
            <div className="flex items-center gap-3 mb-6">
              <Users className="w-8 h-8 text-blue-500" />
              <h2 className="text-4xl font-serif font-bold text-on-surface">1. Qui peut bénéficier?</h2>
            </div>

            <div className="space-y-4">
              <p className="text-on-surface-dim leading-relaxed">
                La CPAM rembourse les transports sanitaires pour les trajets médicaux <strong>préalablement prescrits par un médecin</strong>.
                Mais selon votre situation, le taux de remboursement varie.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                {/* 55% Remboursement */}
                <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-6">
                  <h3 className="text-xl font-bold text-blue-500 mb-4">55% de remboursement</h3>
                  <p className="text-on-surface-dim text-sm mb-4">Vous êtes remboursé à 55% si:</p>
                  <ul className="space-y-2 text-on-surface-dim text-sm">
                    <li>✓ Consultation médicale nécessaire</li>
                    <li>✓ Traitement spécialisé</li>
                    <li>✓ Hospitalisation</li>
                    <li>✓ Dialyse régulière</li>
                    <li>✓ Rééducation kinésithérapie</li>
                    <li>✓ Vous n'avez pas d'ALD</li>
                  </ul>
                  <p className="text-xs text-on-surface-dim mt-4 font-semibold">
                    Base: tarif conventionnel CPAM
                  </p>
                </div>

                {/* 100% Remboursement */}
                <div className="rounded-lg border border-green-500/20 bg-green-500/5 p-6">
                  <h3 className="text-xl font-bold text-green-500 mb-4">100% de remboursement</h3>
                  <p className="text-on-surface-dim text-sm mb-4">Vous êtes remboursé à 100% si:</p>
                  <ul className="space-y-2 text-on-surface-dim text-sm">
                    <li>✓ Vous avez une <strong>ALD</strong> (Affection Longue Durée)</li>
                    <li>✓ Personne âgée (>65 ans) en situation de dépendance</li>
                    <li>✓ Handicap reconnu (>80% d'incapacité)</li>
                    <li>✓ Accident du travail (AT)</li>
                    <li>✓ Maladie professionnelle (MP)</li>
                    <li>✓ Femme enceinte (6e au 12e mois)</li>
                    <li>✓ Bénéficiaire CMU ou AME</li>
                  </ul>
                  <p className="text-xs text-on-surface-dim mt-4 font-semibold">
                    Remboursement intégral des tarifs conventionnels
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: ALD */}
          <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-8">
            <div className="flex items-start gap-4">
              <Info className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-2xl font-bold text-on-surface mb-4">Qu'est-ce qu'une ALD?</h3>
                <p className="text-on-surface-dim mb-4">
                  <strong>ALD = Affection Longue Durée.</strong> Ce sont des maladies chroniques nécessitant un traitement prolongé
                  et des dépenses coûteuses. Si vous avez une ALD reconnue par la CPAM, vous bénéficiez du remboursement
                  à 100% pour les transports sanitaires liés à votre traitement.
                </p>
                <p className="text-on-surface-dim text-sm font-semibold">
                  Exemples d'ALD: diabète, cancer, maladies cardiaques, asthme sévère, sclérose en plaques, VIH, etc.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Ordonnance */}
          <div id="ordonnance">
            <div className="flex items-center gap-3 mb-6">
              <FileText className="w-8 h-8 text-blue-500" />
              <h2 className="text-4xl font-serif font-bold text-on-surface">2. L'Ordonnance de Transport</h2>
            </div>

            <div className="space-y-4">
              <p className="text-on-surface-dim leading-relaxed">
                <strong>ESSENTIEL:</strong> Vous devez disposer d'une <strong>ordonnance médicale de transport</strong>
                pour que la CPAM rembourse votre trajet en taxi.
              </p>

              <div className="rounded-lg border border-on-surface/10 bg-surface p-6 space-y-4">
                <h3 className="font-bold text-on-surface">Qui établit l'ordonnance?</h3>
                <p className="text-on-surface-dim">
                  Votre <strong>médecin traitant ou médecin spécialiste</strong> peut établir une ordonnance de transport
                  si le trajet est justifié médicalement. Le médecin décide du mode de transport (taxi, ambulance, VSL).
                </p>

                <h3 className="font-bold text-on-surface mt-6">Quand demander une ordonnance?</h3>
                <p className="text-on-surface-dim">
                  Mentionnez à votre médecin que vous avez besoin de transports sanitaires:
                </p>
                <ul className="list-disc list-inside text-on-surface-dim space-y-2">
                  <li>Avant une intervention chirurgicale</li>
                  <li>Pour des séances régulières (chimio, dialyse)</li>
                  <li>Pour vous rendre à un RDV spécialisé</li>
                  <li>Pour un suivi de rééducation</li>
                </ul>

                <h3 className="font-bold text-on-surface mt-6">Durée de validité</h3>
                <p className="text-on-surface-dim">
                  Une ordonnance de transport peut couvrir <strong>une année complète</strong> de trajets réguliers
                  ou un nombre de trajets spécifique défini par le médecin.
                </p>
              </div>
            </div>
          </div>

          {/* Section 4: Documents Requis */}
          <div id="remboursement">
            <div className="flex items-center gap-3 mb-6">
              <CheckCircle className="w-8 h-8 text-blue-500" />
              <h2 className="text-4xl font-serif font-bold text-on-surface">3. Documents à Préparer</h2>
            </div>

            <div className="space-y-6">
              <p className="text-on-surface-dim leading-relaxed">
                Pour obtenir votre remboursement, rassemblez ces documents:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="rounded-lg border border-on-surface/10 p-6 bg-surface">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">1</div>
                    <h4 className="font-bold text-on-surface">Ordonnance de transport</h4>
                  </div>
                  <p className="text-on-surface-dim text-sm">
                    Établie par votre médecin, originale ou copie lisible
                  </p>
                </div>

                <div className="rounded-lg border border-on-surface/10 p-6 bg-surface">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">2</div>
                    <h4 className="font-bold text-on-surface">Carte Vitale</h4>
                  </div>
                  <p className="text-on-surface-dim text-sm">
                    À jour et valide au moment du trajet
                  </p>
                </div>

                <div className="rounded-lg border border-on-surface/10 p-6 bg-surface">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">3</div>
                    <h4 className="font-bold text-on-surface">Justificatif de paiement</h4>
                  </div>
                  <p className="text-on-surface-dim text-sm">
                    Facture ou reçu du taxi avec date, montant, trajet
                  </p>
                </div>

                <div className="rounded-lg border border-on-surface/10 p-6 bg-surface">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">4</div>
                    <h4 className="font-bold text-on-surface">Certificat ALD (si applicable)</h4>
                  </div>
                  <p className="text-on-surface-dim text-sm">
                    Si vous avez une ALD reconnue par la CPAM
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 5: Procédure */}
          <div id="procedure">
            <div className="flex items-center gap-3 mb-6">
              <Clock className="w-8 h-8 text-blue-500" />
              <h2 className="text-4xl font-serif font-bold text-on-surface">4. Procédure de Remboursement — Étape par Étape</h2>
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                <div className="rounded-lg border-l-4 border-primary bg-surface p-6">
                  <h4 className="text-lg font-bold text-on-surface mb-2">📋 Étape 1 : Obtenez l'ordonnance</h4>
                  <p className="text-on-surface-dim text-sm">
                    Rendez-vous chez votre médecin et demandez explicitement une <strong>ordonnance de transport sanitaire</strong>.
                    Le médecin doit justifier médicalement le trajet.
                  </p>
                </div>

                <div className="rounded-lg border-l-4 border-primary bg-surface p-6">
                  <h4 className="text-lg font-bold text-on-surface mb-2">🚕 Étape 2 : Réservez le taxi</h4>
                  <p className="text-on-surface-dim text-sm">
                    Contactez Taxi Leblanc au <strong>+33 6 08 55 03 15</strong> ou réservez en ligne. Mentionnez que vous avez
                    une ordonnance CPAM. Nous vous confirmerons que nous sommes agréés CPAM.
                  </p>
                </div>

                <div className="rounded-lg border-l-4 border-primary bg-surface p-6">
                  <h4 className="text-lg font-bold text-on-surface mb-2">💳 Étape 3 : Payez le trajet</h4>
                  <p className="text-on-surface-dim text-sm">
                    <strong>Vous payez directement</strong> le chauffeur le tarif conventionnel CPAM au moment du trajet.
                    Demandez une <strong>facture ou reçu détaillé</strong> indiquant le trajet, la date et l'heure.
                  </p>
                </div>

                <div className="rounded-lg border-l-4 border-primary bg-surface p-6">
                  <h4 className="text-lg font-bold text-on-surface mb-2">📮 Étape 4 : Constituez le dossier</h4>
                  <p className="text-on-surface-dim text-sm">
                    Rassemblez: ordonnance originale + facture du taxi + carte Vitale + certificat ALD (si applicable).
                    Conservez un double de tous les documents.
                  </p>
                </div>

                <div className="rounded-lg border-l-4 border-primary bg-surface p-6">
                  <h4 className="text-lg font-bold text-on-surface mb-2">✉️ Étape 5 : Envoyez à la CPAM</h4>
                  <p className="text-on-surface-dim text-sm">
                    Adressez votre dossier complet à votre <strong>centre local CPAM</strong> (celui inscrit sur votre Carte Vitale).
                    Envoyez par courrier avec accusé de réception ou utilisez le service en ligne ameli.fr.
                  </p>
                </div>

                <div className="rounded-lg border-l-4 border-primary bg-surface p-6">
                  <h4 className="text-lg font-bold text-on-surface mb-2">⏳ Étape 6 : Attente du remboursement</h4>
                  <p className="text-on-surface-dim text-sm">
                    La CPAM traite votre demande en <strong>2-4 semaines</strong> en général.
                    Vous recevrez un virement sur votre compte bancaire avec un détail du remboursement.
                  </p>
                </div>
              </div>

              <div className="rounded-lg border border-green-500/20 bg-green-500/5 p-6 mt-8">
                <p className="text-on-surface-dim text-sm">
                  <strong>💡 Conseil:</strong> Gardez précieusement tous les justificatifs (ordonnances, factures, preuves de paiement)
                  pendant <strong>minimum 3 ans</strong>. La CPAM peut demander des justificatifs en cas de contrôle.
                </p>
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div>
            <h2 className="text-4xl font-serif font-bold text-on-surface mb-8">Questions Fréquentes sur CPAM</h2>

            <div className="space-y-4">
              <details className="group border border-on-surface/10 rounded-lg overflow-hidden hover:border-blue-500/30 transition-colors">
                <summary className="flex items-center justify-between cursor-pointer p-6 bg-surface hover:bg-surface-light transition-colors">
                  <h4 className="font-semibold text-on-surface">Quel est le tarif conventionnel CPAM pour un taxi?</h4>
                </summary>
                <div className="px-6 pb-6 bg-background text-on-surface-dim text-sm leading-relaxed">
                  Le tarif conventionnel est celui appliqué par les taxis conventionnés parisiens. Il est inférieur ou égal aux tarifs
                  normaux et suit la réglementation CPAM. Avec Taxi Leblanc, nous appliquons le tarif conventionnel officiel.
                </div>
              </details>

              <details className="group border border-on-surface/10 rounded-lg overflow-hidden hover:border-blue-500/30 transition-colors">
                <summary className="flex items-center justify-between cursor-pointer p-6 bg-surface hover:bg-surface-light transition-colors">
                  <h4 className="font-semibold text-on-surface">Puis-je me faire rembourser a posteriori?</h4>
                </summary>
                <div className="px-6 pb-6 bg-background text-on-surface-dim text-sm leading-relaxed">
                  <strong>Oui</strong>, mais vous devez avoir l'ordonnance AVANT le trajet. Si vous n'avez pas d'ordonnance au moment du
                  trajet, vous ne pourrez pas vous faire rembourser rétroactivement. Demandez toujours à votre médecin AVANT votre
                  déplacement médical.
                </div>
              </details>

              <details className="group border border-on-surface/10 rounded-lg overflow-hidden hover:border-blue-500/30 transition-colors">
                <summary className="flex items-center justify-between cursor-pointer p-6 bg-surface hover:bg-surface-light transition-colors">
                  <h4 className="font-semibold text-on-surface">Mon taxi n'est pas agréé CPAM, puis-je être remboursé?</h4>
                </summary>
                <div className="px-6 pb-6 bg-background text-on-surface-dim text-sm leading-relaxed">
                  <strong>Oui, mais partiellement.</strong> Vous devez utiliser un taxi agréé CPAM pour bénéficier du tarif conventionnel
                  et du remboursement maximum. Taxi Leblanc est agréé CPAM en Île-de-France. Vérifiez toujours que le taxi est conventionné.
                </div>
              </details>

              <details className="group border border-on-surface/10 rounded-lg overflow-hidden hover:border-blue-500/30 transition-colors">
                <summary className="flex items-center justify-between cursor-pointer p-6 bg-surface hover:bg-surface-light transition-colors">
                  <h4 className="font-semibold text-on-surface">Combien de temps pour obtenir le remboursement?</h4>
                </summary>
                <div className="px-6 pb-6 bg-background text-on-surface-dim text-sm leading-relaxed">
                  Généralement <strong>2 à 4 semaines</strong> après réception de votre dossier complet par la CPAM.
                  Vous pouvez suivre votre demande sur ameli.fr avec votre numéro de dossier.
                </div>
              </details>

              <details className="group border border-on-surface/10 rounded-lg overflow-hidden hover:border-blue-500/30 transition-colors">
                <summary className="flex items-center justify-between cursor-pointer p-6 bg-surface hover:bg-surface-light transition-colors">
                  <h4 className="font-semibold text-on-surface">Dois-je avancer les frais ou la CPAM paie directement?</h4>
                </summary>
                <div className="px-6 pb-6 bg-background text-on-surface-dim text-sm leading-relaxed">
                  <strong>Vous avancez les frais.</strong> Vous payez le taxi directement, puis la CPAM vous rembourse par virement.
                  Les taxis agréés CPAM ne peuvent pas facturer directement à la CPAM. C'est pourquoi conserver votre facture est capital.
                </div>
              </details>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-surface">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-serif font-bold text-on-surface mb-6">
            Besoin d'un Taxi Agréé CPAM?
          </h2>
          <p className="text-on-surface-dim text-lg mb-8">
            Taxi Leblanc est agréé CPAM en Île-de-France. Réservez votre trajet dès maintenant avec garantie de remboursement.
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
