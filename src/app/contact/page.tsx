import type { Metadata } from 'next';
import { Footer } from '@/components/layout/Footer';
import { HomeHeader } from '@/components/layout/HomeHeader';
import { Button } from '@/components/ui/Button';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact | Taxi Leblanc',
  description: 'Contactez Taxi Leblanc. Adresse, téléphone, email. Support 24h/24, 7j/7.',
  keywords: ['contact taxi', 'appeler taxi', 'email taxi', 'adresse taxi leblanc'],
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <HomeHeader />

      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary/10 via-background to-background">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-on-surface mb-6">
            Nous contacter
          </h1>
          <p className="text-lg text-on-surface-dim">
            Une question ? Besoin d'aide ? Contactez-nous 24h/24, 7j/7.
          </p>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h2 className="text-4xl font-serif font-bold text-on-surface mb-12">
                Informations de contact
              </h2>

              {/* Phone */}
              <div className="flex gap-6 mb-12">
                <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-on-surface mb-2">Téléphone</h3>
                  <p className="text-on-surface-dim mb-4">Disponible 24h/24, 7j/7</p>
                  <a href="tel:+33608550315" className="font-semibold text-primary hover:underline">
                    +33 6 08 55 03 15
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex gap-6 mb-12">
                <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-on-surface mb-2">Email</h3>
                  <p className="text-on-surface-dim mb-4">Nous répondrons dans les 24h</p>
                  <a href="mailto:TaxiLeblanc@gmail.com" className="font-semibold text-primary hover:underline">
                    TaxiLeblanc@gmail.com
                  </a>
                </div>
              </div>

              {/* Address */}
              <div className="flex gap-6 mb-12">
                <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-on-surface mb-2">Adresse</h3>
                  <p className="text-on-surface-dim">30 Allée des Bergeries</p>
                  <p className="text-on-surface-dim">91210 Draveil, France</p>
                </div>
              </div>

              {/* Hours */}
              <div className="flex gap-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-on-surface mb-2">Horaires</h3>
                  <p className="text-on-surface-dim">Lundi — Dimanche</p>
                  <p className="text-on-surface-dim">24h/24 (disponible en permanence)</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <h2 className="text-4xl font-serif font-bold text-on-surface mb-8">
                Contactez-nous rapidement
              </h2>
              <div className="space-y-4">
                <a href="tel:+33608550315" className="block">
                  <Button variant="primary" className="w-full text-lg py-6">
                    Appeler maintenant
                  </Button>
                </a>
                <a href="mailto:TaxiLeblanc@gmail.com" className="block">
                  <Button variant="secondary" className="w-full text-lg py-6">
                    Envoyer un email
                  </Button>
                </a>
              </div>

              <div className="mt-12 rounded-lg border border-primary/20 bg-primary/5 p-8">
                <h3 className="text-xl font-bold text-on-surface mb-4">
                  Horaires de support
                </h3>
                <div className="space-y-3 text-on-surface-dim">
                  <div className="flex justify-between">
                    <span>Lundi - Vendredi:</span>
                    <span className="font-semibold">00:00 - 23:59</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Samedi - Dimanche:</span>
                    <span className="font-semibold">00:00 - 23:59</span>
                  </div>
                  <p className="pt-3 border-t border-on-surface/10 text-sm">
                    Disponible 24h/24, 7j/7 pour les appels d'urgence
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
