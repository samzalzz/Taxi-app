import type { Metadata } from 'next';
import { Footer } from '@/components/layout/Footer';
import { HomeHeader } from '@/components/layout/HomeHeader';
import { Button } from '@/components/ui/Button';
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'FAQ - Questions Fréquentes | Comment réserver? Tarifs? CPAM? | Taxi Leblanc',
  description: 'Questions fréquentes taxi: comment réserver, tarifs CDG Orly, remboursement CPAM, animaux, PMR. Réponses complètes et conseils.',
  keywords: [
    'FAQ taxi',
    'questions taxi',
    'comment réserver taxi',
    'combien coûte taxi',
    'tarif taxi aéroport',
    'remboursement CPAM taxi',
    'taxi PMR',
    'support taxi',
  ],
  openGraph: {
    title: 'Questions Fréquentes - Taxi Leblanc',
    description: 'Toutes vos questions sur la réservation, tarifs, CPAM et services spécialisés.',
    type: 'website',
    url: 'https://taxi-leblanc.fr/faq',
  },
};

const faqs = [
  {
    question: 'Comment réserver un taxi en ligne ?',
    answer: 'Visitez notre page de réservation, entrez votre adresse de départ et destination, sélectionnez l\'heure, et confirmez. Vous recevrez instantanément une confirmation par email et SMS avec tous les détails.',
  },
  {
    question: 'Comment appeler un taxi chez Taxi Leblanc ?',
    answer: 'Appelez-nous au +33 6 08 55 03 15 (disponible 24h/24, 7j/7). Notre équipe prendra votre réservation et vous confirmera les détails rapidement.',
  },
  {
    question: 'Quel est le délai minimum pour réserver ?',
    answer: 'Le délai minimum est de 2 heures avant votre prise en charge. Pour une demande urgente ou immédiate, appelez-nous directement au +33 6 08 55 03 15.',
  },
  {
    question: 'Combien coûte un taxi vers CDG ?',
    answer: 'Le tarif forfaitaire depuis n\'importe quel point de Paris vers CDG est de 50€ (tarif légal fixe, 2026). Ce forfait inclut la prise en charge et les bagages.',
  },
  {
    question: 'Quel est le prix d\'un taxi pour Orly ?',
    answer: 'Le tarif forfaitaire depuis Paris vers Orly est de 36€ (tarif légal fixe). C\'est le moins cher de nos trois aéroports. Bagages et prise en charge inclus.',
  },
  {
    question: 'Combien coûte un taxi aéroport Beauvais ?',
    answer: 'Le tarif forfaitaire depuis Paris vers Beauvais est de 65€ (tarif légal). Beauvais est plus éloigné (85 km Nord de Paris). Bagages inclus.',
  },
  {
    question: 'Quels sont les tarifs pour les trajets non-aéroport ?',
    answer: 'Pour les trajets hors aéroport, le tarif dépend de la distance et conditions de circulation. Utilisez notre estimateur de tarif en ligne ou appelez-nous pour un devis.',
  },
  {
    question: 'Comment fonctionne le remboursement CPAM ?',
    answer: 'Avec une ordonnance médicale, vous payez le taxi directement. Vous envoyez la facture + ordonnance à la CPAM qui vous rembourse 55% ou 100% selon votre situation.',
  },
  {
    question: 'Comment se faire rembourser un taxi par la CPAM ?',
    answer: 'Étapes: 1) Obtener ordonnance médicale 2) Réserver un taxi agréé CPAM 3) Conserver la facture 4) Envoyer à la CPAM avec carte Vitale. Voir notre guide complet CPAM.',
  },
  {
    question: 'Remboursement CPAM: 55% ou 100% ?',
    answer: 'Vous êtes remboursé 55% par défaut. Vous obtenez 100% si vous avez une ALD, un handicap >80%, accident du travail, ou autres situations spéciales (femme enceinte, CMU).',
  },
  {
    question: 'Acceptez-vous les réservations pour plusieurs jours ?',
    answer: 'Oui, nous acceptons les réservations pour trajets réguliers ou location avec chauffeur à la journée. Contactez-nous pour un devis personnalisé.',
  },
  {
    question: 'Vos véhicules sont-ils adaptés PMR (fauteuil roulant) ?',
    answer: 'Oui, plusieurs véhicules sont équipés pour les personnes à mobilité réduite et acceptent les fauteuils roulants. Mentionnez-le à la réservation.',
  },
  {
    question: 'Puis-je annuler ma réservation sans frais ?',
    answer: 'Oui, vous pouvez annuler gratuitement jusqu\'à 2 heures avant votre prise en charge. Les annulations plus tardives peuvent entraîner des frais.',
  },
  {
    question: 'Pouvez-vous transporter des animaux domestiques ?',
    answer: 'Oui, nous acceptons les animaux à condition qu\'ils soient correctement maintenus et sécurisés. Chiens, chats, etc. - mentionnez-le à la réservation.',
  },
  {
    question: 'Proposez-vous un service de chauffeur pour la journée ?',
    answer: 'Oui, nous proposons des locations avec chauffeur à l\'heure ou à la journée. Contactez-nous au +33 6 08 55 03 15 pour un tarif personnalisé.',
  },
  {
    question: 'Les tarifs aéroport sont-ils fixes ou négociables ?',
    answer: 'Les tarifs aéroports sont FIXES et légalement réglementés: CDG 50€, Orly 36€, Beauvais 65€. Aucune surprise, aucun supplément caché.',
  },
  {
    question: 'Comment puis-je modifier ma réservation ?',
    answer: 'Vous pouvez modifier destination ou heure jusqu\'à 2 heures avant le trajet. Contactez-nous via email ou téléphone +33 6 08 55 03 15.',
  },
  {
    question: 'Vos chauffeurs sont-ils formés et professionnels ?',
    answer: 'Oui, tous nos chauffeurs sont professionnels, expérimentés, courtois, et formés aux premiers secours et protocoles de sécurité.',
  },
];

// FAQPage structured data for search engines and AI citation
// Content is hardcoded above (not user input), so XSS risk is zero
const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
};

const faqJsonLdString = JSON.stringify(faqJsonLd).replace(/</g, '\\u003c');

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: faqJsonLdString }}
      />
      <HomeHeader />

      <div className="pt-16">
        {/* Hero Section */}
        <section className="py-20 px-4 bg-gradient-to-br from-primary/10 via-background to-background">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-on-surface mb-6">
            Questions Fréquentes
          </h1>
          <p className="text-lg text-on-surface-dim mb-8">
            Trouvez les réponses à vos questions sur nos services, réservations et tarifs.
          </p>

          {/* Quick Links to Guides */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/guides/comment-reserver" className="p-4 rounded-lg bg-surface hover:bg-surface-light transition border border-primary/20">
              <p className="font-semibold text-on-surface mb-1">📖 Comment Réserver?</p>
              <p className="text-sm text-on-surface-dim">Guide complet en 6 étapes</p>
            </Link>
            <Link href="/guides/transport-cpam" className="p-4 rounded-lg bg-surface hover:bg-surface-light transition border border-primary/20">
              <p className="font-semibold text-on-surface mb-1">💰 CPAM & Remboursement</p>
              <p className="text-sm text-on-surface-dim">Procédure détaillée + FAQ</p>
            </Link>
            <Link href="/estimation-tarif" className="p-4 rounded-lg bg-surface hover:bg-surface-light transition border border-primary/20">
              <p className="font-semibold text-on-surface mb-1">💵 Estimateur Tarifs</p>
              <p className="text-sm text-on-surface-dim">Prix aéroports 2026</p>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <details key={index} className="group border border-on-surface/10 rounded-lg overflow-hidden hover:border-primary/30 transition-colors">
                <summary className="flex items-center justify-between cursor-pointer p-6 bg-surface hover:bg-surface-light transition-colors">
                  <h3 className="text-lg font-semibold text-on-surface pr-4">
                    {faq.question}
                  </h3>
                  <ChevronDown className="w-5 h-5 text-on-surface-dim flex-shrink-0 group-open:rotate-180 transition-transform" />
                </summary>
                <div className="px-6 pb-6 bg-background text-on-surface-dim leading-relaxed">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-surface">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-serif font-bold text-on-surface mb-6">
            Besoin d&apos;aide ?
          </h2>
          <p className="text-on-surface-dim text-lg mb-8">
            Si vous ne trouvez pas votre réponse, contactez-nous directement.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="tel:+33608550315">
              <Button variant="primary" size="lg">Appeler</Button>
            </a>
            <a href="mailto:TaxiLeblanc@gmail.com">
              <Button variant="secondary" size="lg">Email</Button>
            </a>
          </div>
        </div>
      </section>
      </div>

      <Footer />
    </div>
  );
}
