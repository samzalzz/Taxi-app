import type { Metadata } from 'next';
import { Footer } from '@/components/layout/Footer';
import { HomeHeader } from '@/components/layout/HomeHeader';
import { Button } from '@/components/ui/Button';
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'FAQ - Questions Fréquentes | Taxi Leblanc',
  description: 'Trouvez les réponses à toutes vos questions sur nos services de taxi, réservations, tarifs et transports spécialisés.',
  keywords: ['FAQ', 'questions', 'réservation', 'taxi', 'support'],
};

const faqs = [
  {
    question: 'Comment puis-je réserver un taxi ?',
    answer: 'Vous pouvez réserver un taxi en ligne sur notre site web en remplissant le formulaire de réservation, ou en nous appelant directement au +33 6 08 55 03 15.',
  },
  {
    question: 'Quel est le délai minimum pour une réservation ?',
    answer: 'Le délai minimum est de 2 heures avant votre prise en charge. Pour une prise en charge immédiate, veuillez nous appeler au +33 6 08 55 03 15.',
  },
  {
    question: 'Acceptez-vous les réservations pour plusieurs jours ?',
    answer: 'Oui, nous acceptons les réservations pour plusieurs jours ou trajets. Veuillez contacter notre équipe pour discuter de vos besoins spécifiques.',
  },
  {
    question: 'Comment fonctionne le remboursement CPAM ?',
    answer: 'Avec une ordonnance médicale valide, la CPAM rembourse directement le transport. Aucun frais initial ne vous est demandé. Vous devez simplement présenter votre ordonnance et votre carte Vitale.',
  },
  {
    question: 'Vos véhicules sont-ils adaptés aux personnes en fauteuil roulant ?',
    answer: 'Oui, plusieurs de nos véhicules sont équipés pour accueillir les personnes à mobilité réduite et les fauteuils roulants. Mentionnez-le lors de votre réservation.',
  },
  {
    question: 'Puis-je annuler ma réservation ?',
    answer: 'Vous pouvez annuler votre réservation jusqu\'à 2 heures avant l\'horaire convenu. Les annulations effectuées plus tard peuvent entraîner des frais.',
  },
  {
    question: 'Quels sont vos tarifs ?',
    answer: 'Nos tarifs varient selon la distance et le type de service. Pour un devis précis, utilisez notre formulaire de réservation ou appelez-nous au +33 6 08 55 03 15.',
  },
  {
    question: 'Pouvez-vous transporter des animaux de compagnie ?',
    answer: 'Oui, nous acceptons les animaux de compagnie à condition qu\'ils soient correctement maintenus. Mentionnez-le lors de votre réservation.',
  },
  {
    question: 'Offrez-vous un service de chauffeur pour la journée ?',
    answer: 'Oui, nous proposons des services de chauffeur pour la journée. Contactez-nous pour discuter de vos besoins et obtenir un tarif.',
  },
  {
    question: 'Vos chauffeurs sont-ils formés aux situations d\'urgence ?',
    answer: 'Oui, nos chauffeurs sont formés aux premiers secours et connaissent les protocoles de sécurité pour diverses situations.',
  },
];

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-background">
      <HomeHeader />

      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary/10 via-background to-background">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-on-surface mb-6">
            Questions Fréquentes
          </h1>
          <p className="text-lg text-on-surface-dim">
            Trouvez les réponses à vos questions sur nos services, réservations et tarifs.
          </p>
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
            Besoin d'aide ?
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

      <Footer />
    </div>
  );
}
