import type { Metadata } from 'next';
import { Footer } from '@/components/layout/Footer';
import { HomeHeader } from '@/components/layout/HomeHeader';

export const metadata: Metadata = {
  title: 'Politique de Confidentialité | Taxi Leblanc',
  description: 'Politique de confidentialité et protection des données personnelles chez Taxi Leblanc',
  robots: 'noindex',
};

export default function ConfidentialitePage() {
  return (
    <div className="min-h-screen bg-background">
      <HomeHeader />

      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-5xl font-serif font-bold text-on-surface mb-12">
            Politique de Confidentialité
          </h1>

          <div className="space-y-8">
            <section>
              <h2 className="text-3xl font-bold text-on-surface mt-8 mb-4">1. Introduction</h2>
              <p className="text-on-surface-dim leading-relaxed">
                Taxi Leblanc respecte votre vie privée et s&apos;engage à protéger vos données personnelles.
                Cette politique explique comment nous collectons, utilisons et protégeons vos informations.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-on-surface mt-8 mb-4">2. Données Collectées</h2>
              <p className="text-on-surface-dim leading-relaxed mb-4">Nous collectons les informations suivantes:</p>
              <ul className="list-disc list-inside text-on-surface-dim space-y-2 ml-4">
                <li>Nom, prénom et numéro de téléphone</li>
                <li>Adresse email</li>
                <li>Adresses de départ et destination</li>
                <li>Numéro de carte bancaire (chiffré)</li>
                <li>Adresses IP et données de navigation</li>
              </ul>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-on-surface mt-8 mb-4">3. Utilisation des Données</h2>
              <p className="text-on-surface-dim leading-relaxed mb-4">
                Nous utilisons vos données pour:
              </p>
              <ul className="list-disc list-inside text-on-surface-dim space-y-2 ml-4">
                <li>Traiter votre réservation et paiement</li>
                <li>Communiquer les détails de votre course</li>
                <li>Améliorer notre service</li>
                <li>Respecter les obligations légales</li>
                <li>Vous envoyer des promotions (si accepté)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-on-surface mt-8 mb-4">4. Partage des Données</h2>
              <p className="text-on-surface-dim leading-relaxed">
                Vos données ne sont jamais vendues à des tiers. Nous partageons uniquement avec:
              </p>
              <ul className="list-disc list-inside text-on-surface-dim space-y-2 ml-4">
                <li>Nos chauffeurs (adresse de pickup/dropoff)</li>
                <li>Processeurs de paiement (pour les transactions)</li>
                <li>Autorités légales (si obligatoire par la loi)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-on-surface mt-8 mb-4">5. Sécurité des Données</h2>
              <p className="text-on-surface-dim leading-relaxed">
                Nous utilisons le chiffrement SSL/TLS et d&apos;autres mesures de sécurité pour protéger vos données.
                Cependant, aucune transmission internet n&apos;est 100% sûre.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-on-surface mt-8 mb-4">6. Cookies</h2>
              <p className="text-on-surface-dim leading-relaxed">
                Nous utilisons des cookies pour améliorer votre expérience et analyser l&apos;usage du site.
                Vous pouvez désactiver les cookies dans les paramètres de votre navigateur.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-on-surface mt-8 mb-4">7. Vos Droits</h2>
              <p className="text-on-surface-dim leading-relaxed mb-4">
                Conformément au RGPD, vous avez le droit de:
              </p>
              <ul className="list-disc list-inside text-on-surface-dim space-y-2 ml-4">
                <li>Accéder à vos données personnelles</li>
                <li>Corriger vos données</li>
                <li>Supprimer vos données</li>
                <li>Obtenir une copie de vos données</li>
                <li>Vous opposer au traitement</li>
              </ul>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-on-surface mt-8 mb-4">8. Rétention des Données</h2>
              <p className="text-on-surface-dim leading-relaxed">
                Nous conservons vos données personnelles pour la durée nécessaire à la prestation de service,
                puis les supprimons sauf obligation légale de les conserver.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-on-surface mt-8 mb-4">9. Modifications</h2>
              <p className="text-on-surface-dim leading-relaxed">
                Nous pouvons modifier cette politique à tout moment.
                Les modifications seront publiées sur ce site.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-on-surface mt-8 mb-4">10. Contact</h2>
              <p className="text-on-surface-dim leading-relaxed">
                Pour toute question sur la protection de vos données:
              </p>
              <div className="space-y-2 text-on-surface-dim">
                <p><strong className="text-on-surface">Email:</strong> TaxiLeblanc@gmail.com</p>
                <p><strong className="text-on-surface">Téléphone:</strong> +33 6 08 55 03 15</p>
              </div>
            </section>

            <section>
              <p className="text-on-surface-dim text-sm mt-12">
                Dernière mise à jour: April 2026
              </p>
            </section>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
