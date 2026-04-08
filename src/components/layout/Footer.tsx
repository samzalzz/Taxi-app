import Link from 'next/link';
import { Mail, MapPin, Phone, Clock } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';

export function Footer() {
  return (
    <footer className="bg-surface border-t border-on-surface/10">
      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Top section: Brand + Navigation Columns + Contact */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-12">
          {/* Brand & Description */}
          <div className="md:col-span-1">
            <div className="mb-2">
              <Logo href="/" className="h-12 w-auto" />
            </div>
            <p className="text-sm text-on-surface-dim mb-4">
              Transport pour toutes les occasions
            </p>
            <p className="text-xs text-on-surface-dim leading-relaxed">
              Spécialisé dans le transport médical, personnel ou professionnel de personnes en Île-de-France.
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-on-surface mb-4">Services</h4>
            <nav className="space-y-2 text-sm">
              <div>
                <Link href="/services/transport-aeroportuaire" className="text-on-surface-dim hover:text-primary transition-colors">
                  Transport Aéroport
                </Link>
              </div>
              <div>
                <Link href="/services/transport-medical" className="text-on-surface-dim hover:text-primary transition-colors">
                  Transport Médical CPAM
                </Link>
              </div>
              <div>
                <Link href="/reserver" className="text-on-surface-dim hover:text-primary transition-colors">
                  Réserver un trajet
                </Link>
              </div>
            </nav>
          </div>

          {/* Guides & Resources */}
          <div>
            <h4 className="font-semibold text-on-surface mb-4">Guides & Ressources</h4>
            <nav className="space-y-2 text-sm">
              <div>
                <Link href="/guides/comment-reserver" className="text-on-surface-dim hover:text-primary transition-colors">
                  Comment réserver?
                </Link>
              </div>
              <div>
                <Link href="/guides/transport-cpam" className="text-on-surface-dim hover:text-primary transition-colors">
                  Remboursement CPAM
                </Link>
              </div>
              <div>
                <Link href="/estimation-tarif" className="text-on-surface-dim hover:text-primary transition-colors">
                  Estimateur Tarifs
                </Link>
              </div>
              <div>
                <Link href="/faq" className="text-on-surface-dim hover:text-primary transition-colors">
                  Questions Fréquentes
                </Link>
              </div>
            </nav>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-on-surface mb-4">Entreprise</h4>
            <nav className="space-y-2 text-sm">
              <div>
                <Link href="/" className="text-on-surface-dim hover:text-primary transition-colors">
                  Accueil
                </Link>
              </div>
              <div>
                <Link href="/connexion" className="text-on-surface-dim hover:text-primary transition-colors">
                  Connexion
                </Link>
              </div>
              <div>
                <Link href="/inscription" className="text-on-surface-dim hover:text-primary transition-colors">
                  S'inscrire
                </Link>
              </div>
            </nav>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-on-surface mb-4">Nous contacter</h4>
            <div className="space-y-3 text-sm">
              {/* Phone */}
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                <a href="tel:+33608550315" className="text-on-surface-dim hover:text-primary transition-colors">
                  +33 6 08 55 03 15
                </a>
              </div>

              {/* Email */}
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                <a href="mailto:TaxiLeblanc@gmail.com" className="text-on-surface-dim hover:text-primary transition-colors">
                  TaxiLeblanc@gmail.com
                </a>
              </div>

              {/* Hours */}
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-on-surface-dim">24h/24 - 7j/7</span>
              </div>

              {/* Address */}
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <div className="text-on-surface-dim text-xs">
                  30 Allée des bergeries<br />
                  Draveille, 91210
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-on-surface/10 pt-6" />

        {/* Bottom bar: Copyright + Tagline */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-on-surface-dim">
          <p>
            © 2026 Taxi Leblanc. Tous droits réservés.
          </p>
          <p>
            Service de transport médical, personnel et professionnel en Île-de-France.
          </p>
        </div>
      </div>
    </footer>
  );
}
