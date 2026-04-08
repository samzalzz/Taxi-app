import type { Metadata } from 'next';
import { Footer } from '@/components/layout/Footer';
import { HomeHeader } from '@/components/layout/HomeHeader';
import { Button } from '@/components/ui/Button';
import { MapPin, Info, AlertCircle, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Estimateur de Tarif Taxi Aéroport | Forfaits CDG, Orly, Beauvais | Taxi Leblanc',
  description: 'Estimez le prix exact de votre taxi vers les aéroports parisiens. Forfaits légaux CDG, Orly, Beauvais. Tarifs transparents, pas de surprises. Calcul instantané.',
  keywords: [
    'estimateur tarif taxi aéroport',
    'prix taxi CDG',
    'tarif taxi Orly',
    'forfait aéroport Paris',
    'combien coûte taxi aéroport',
    'tarif taxi Beauvais',
    'calculer prix taxi',
  ],
  openGraph: {
    title: 'Estimateur de Tarif - Taxi Aéroport Paris | Taxi Leblanc',
    description: 'Calculez le prix exact de votre taxi vers CDG, Orly ou Beauvais. Forfaits légaux 2026.',
    type: 'website',
    url: 'https://taxileblanc.fr/estimation-tarif',
  },
};

export default function EstimationTarifPage() {
  return (
    <div className="min-h-screen bg-background">
      <HomeHeader />

      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary/10 via-background to-background">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-on-surface mb-6">
            Estimateur de Tarif <em className="text-primary not-italic">Transparents</em>
          </h1>
          <p className="text-lg text-on-surface-dim mb-4">
            Calculez le prix exact de votre taxi vers les aéroports parisiens. Forfaits légaux selon la loi française.
          </p>
          <p className="text-sm text-primary font-semibold">
            ✓ Pas de frais cachés • ✓ Tarifs fixes légaux • ✓ Calcul en temps réel
          </p>
        </div>
      </section>

      {/* Forfaits Table */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <AlertCircle className="w-6 h-6 text-primary" />
              <h2 className="text-4xl font-serif font-bold text-on-surface">
                Tarifs Aéroports 2026 — Forfaits Légaux
              </h2>
            </div>
            <p className="text-on-surface-dim text-lg mb-6 leading-relaxed">
              Les tarifs affichés ci-dessous sont des <strong>forfaits réglementaires</strong> établis par la Préfecture de Police de Paris
              en accord avec la loi française. Ces forfaits s'appliquent à tous les taxis parisiens autorisés et représentent le tarif maximum
              que vous devez payer pour ces trajets.
            </p>

            {/* Forfaits Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {/* CDG */}
              <div className="rounded-xl border-2 border-primary bg-surface-light p-8">
                <div className="flex items-center gap-3 mb-6">
                  <MapPin className="w-8 h-8 text-primary" />
                  <h3 className="text-3xl font-bold text-on-surface">CDG</h3>
                </div>
                <p className="text-on-surface-dim mb-4 text-sm">Charles de Gaulle (Roissy)</p>
                <div className="border-t border-primary/20 pt-6">
                  <p className="text-on-surface-dim text-xs uppercase mb-2">Tarif forfaitaire depuis Paris</p>
                  <p className="text-5xl font-bold text-primary mb-4">50€</p>
                  <p className="text-on-surface-dim text-sm mb-4">
                    ✓ Prise en charge incluse<br/>
                    ✓ Bagages inclus<br/>
                    ✓ Aller ou retour
                  </p>
                  <Link href="/reserver" className="block mt-6">
                    <Button variant="primary" className="w-full">Réserver pour CDG</Button>
                  </Link>
                </div>
              </div>

              {/* Orly */}
              <div className="rounded-xl border-2 border-primary bg-surface-light p-8">
                <div className="flex items-center gap-3 mb-6">
                  <MapPin className="w-8 h-8 text-primary" />
                  <h3 className="text-3xl font-bold text-on-surface">Orly</h3>
                </div>
                <p className="text-on-surface-dim mb-4 text-sm">Aéroport Paris-Orly</p>
                <div className="border-t border-primary/20 pt-6">
                  <p className="text-on-surface-dim text-xs uppercase mb-2">Tarif forfaitaire depuis Paris</p>
                  <p className="text-5xl font-bold text-primary mb-4">36€</p>
                  <p className="text-on-surface-dim text-sm mb-4">
                    ✓ Prise en charge incluse<br/>
                    ✓ Bagages inclus<br/>
                    ✓ Aller ou retour
                  </p>
                  <Link href="/reserver" className="block mt-6">
                    <Button variant="primary" className="w-full">Réserver pour Orly</Button>
                  </Link>
                </div>
              </div>

              {/* Beauvais */}
              <div className="rounded-xl border-2 border-primary bg-surface-light p-8">
                <div className="flex items-center gap-3 mb-6">
                  <MapPin className="w-8 h-8 text-primary" />
                  <h3 className="text-3xl font-bold text-on-surface">Beauvais</h3>
                </div>
                <p className="text-on-surface-dim mb-4 text-sm">Aéroport de Beauvais</p>
                <div className="border-t border-primary/20 pt-6">
                  <p className="text-on-surface-dim text-xs uppercase mb-2">Tarif forfaitaire depuis Paris</p>
                  <p className="text-5xl font-bold text-primary mb-4">65€</p>
                  <p className="text-on-surface-dim text-sm mb-4">
                    ✓ Prise en charge incluse<br/>
                    ✓ Bagages inclus<br/>
                    ✓ Aller ou retour
                  </p>
                  <Link href="/reserver" className="block mt-6">
                    <Button variant="primary" className="w-full">Réserver pour Beauvais</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Paris Map Visualization */}
          <div className="bg-surface rounded-xl border border-on-surface/10 p-8 mb-12">
            <h3 className="text-2xl font-bold text-on-surface mb-6">Zones de Couverture des Forfaits</h3>

            {/* ASCII Map-like visualization */}
            <div className="bg-background rounded-lg p-6 overflow-auto mb-6 text-xs md:text-sm font-mono text-on-surface-dim leading-relaxed">
              <pre className="text-on-surface-dim">{`
                                   ╔════════════════════════════════════════╗
                                   ║  AÉROPORTS DE PARIS - ZONES FORFAIT    ║
                                   ╚════════════════════════════════════════╝

                        ┌─────────────────────────────────────────┐
                        │                                         │
                        │        🛫 CHARLES DE GAULLE (CDG)       │
                        │           50€ depuis Paris             │
                        │           (~35-40 km Nord)             │
                        │                                         │
                        └──────────────┬──────────────────────────┘
                                      │
                                      │ 35-40 km
                                      │
                        ╔═════════════════════════════════════════╗
                        ║                                         ║
                        ║          ★ PARIS CENTRE ★              ║
                        ║                                         ║
                        ║  Point de départ des forfaits           ║
                        ║  (Rive Droite / Rive Gauche)           ║
                        ║                                         ║
                        ║  Taxis conventionnés présents 24h/24   ║
                        ║  Zones couvertes: Île-de-France        ║
                        ║                                         ║
                        ╚═════════════════════════════════════════╝
                                      │
                        ┌─────────────┴─────────────┐
                        │                           │
              ┌─────────▼──────────┐   ┌──────────▼──────────┐
              │  🛫 ORLY (ORY)     │   │ 🛫 BEAUVAIS (BVA)  │
              │  36€ depuis Paris  │   │ 65€ depuis Paris   │
              │  (~15 km Sud)      │   │ (~85 km Nord)      │
              └────────────────────┘   └────────────────────┘

              ═══════════════════════════════════════════════════════════════
              FORFAITS VALABLES: Aller ou Retour | Bagages Inclus
              BASE LÉGALE: Arrêté Préfecture de Police Paris 2026
              ═══════════════════════════════════════════════════════════════
              `}</pre>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-lg bg-blue-500/10 border border-blue-500/20 p-4">
                <p className="font-semibold text-blue-500 mb-2">🛫 CDG (50€)</p>
                <p className="text-sm text-on-surface-dim">Direction Nord de Paris, zone d'exploitation la plus importante</p>
              </div>
              <div className="rounded-lg bg-blue-500/10 border border-blue-500/20 p-4">
                <p className="font-semibold text-blue-500 mb-2">🛫 Orly (36€)</p>
                <p className="text-sm text-on-surface-dim">Direction Sud de Paris, accès rapide depuis Rive Gauche</p>
              </div>
              <div className="rounded-lg bg-blue-500/10 border border-blue-500/20 p-4">
                <p className="font-semibold text-blue-500 mb-2">🛫 Beauvais (65€)</p>
                <p className="text-sm text-on-surface-dim">Direction Nord-Est, distance plus importante, compagnies low-cost</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Explanation Section */}
      <section className="py-20 px-4 bg-surface">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-serif font-bold text-on-surface mb-12">
            Comprendre les Forfaits Aéroports
          </h2>

          <div className="space-y-8">
            <div>
              <div className="flex items-start gap-4 mb-4">
                <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-2xl font-bold text-on-surface mb-3">Qu'est-ce qu'un forfait?</h3>
                  <p className="text-on-surface-dim leading-relaxed">
                    Un forfait est un <strong>tarif fixe réglementé</strong> établi par la Préfecture de Police de Paris.
                    Il s'applique à <strong>tous les taxis parisiens conventionnés</strong> pour les trajets entre Paris et les aéroports.
                    Contrairement aux tarifs au compteur (basés sur la distance et le temps), le forfait garantit un prix
                    <strong>maximum connu à l'avance</strong>, sans surprise.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-start gap-4 mb-4">
                <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-2xl font-bold text-on-surface mb-3">Pourquoi des forfaits pour les aéroports?</h3>
                  <p className="text-on-surface-dim leading-relaxed">
                    Les forfaits aéroports sont <strong>légalement imposés</strong> pour protéger les passagers contre les surcharges.
                    Ils prennent en compte la distance élevée (35-85 km) et l'exploitation importante des routes aéroports.
                    Le tarif unifié garantit l'équité pour tous les clients, peu importe le moment du jour ou les conditions
                    de circulation.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-start gap-4 mb-4">
                <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-2xl font-bold text-on-surface mb-3">Qu'inclut le forfait?</h3>
                  <ul className="space-y-2 text-on-surface-dim">
                    <li>✓ <strong>Prise en charge:</strong> Les 2,50€ initiaux inclus dans le forfait</li>
                    <li>✓ <strong>Trajet complet:</strong> Du point de départ à l'aéroport (terminal)</li>
                    <li>✓ <strong>Bagages:</strong> Tous les bagages sont inclus, pas de frais supplémentaires</li>
                    <li>✓ <strong>Véhicule confortable:</strong> Voiture de tourisme standard (4-5 passagers)</li>
                    <li>✓ <strong>Trajet retour:</strong> Le forfait s'applique aussi au retour de l'aéroport</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-start gap-4 mb-4">
                <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-2xl font-bold text-on-surface mb-3">Y a-t-il des suppléments?</h3>
                  <p className="text-on-surface-dim mb-3 leading-relaxed">
                    <strong>Très rarement.</strong> Le forfait couvre le trajet standard. Les seuls suppléments possibles:
                  </p>
                  <ul className="space-y-2 text-on-surface-dim ml-4">
                    <li>• <strong>Passager supplémentaire:</strong> À partir du 5e passager (+5,50€)</li>
                    <li>• <strong>Attente:</strong> Si vous demandez attente à l'aéroport</li>
                    <li>• <strong>Trajet spécial:</strong> Départ après 22h ou avant 6h (petit supplément possible)</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-primary/20 bg-primary/5 p-6">
              <div className="flex items-start gap-4">
                <Info className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-on-surface mb-2">📋 Cadre légal</p>
                  <p className="text-sm text-on-surface-dim">
                    Arrêté de la Préfecture de Police de Paris, 2026.
                    Les tarifs affichés respectent la réglementation du code des transports français.
                    Tous les taxis conventionnés doivent afficher ces tarifs et les respecter strictement.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-serif font-bold text-on-surface mb-12">
            Questions Fréquentes sur les Tarifs Aéroports
          </h2>

          <div className="space-y-6">
            <details className="group border border-on-surface/10 rounded-lg overflow-hidden hover:border-primary/30 transition-colors">
              <summary className="flex items-center justify-between cursor-pointer p-6 bg-surface hover:bg-surface-light transition-colors">
                <h3 className="text-lg font-semibold text-on-surface pr-4">
                  Combien coûte exactement un taxi CDG depuis mon quartier?
                </h3>
              </summary>
              <div className="px-6 pb-6 bg-background text-on-surface-dim leading-relaxed">
                Le forfait est le même depuis n'importe quel point de Paris: <strong>50€ pour CDG</strong>.
                Que vous partiez de la Rive Gauche, Rive Droite, ou d'un arrondissement excentré, le tarif reste identique.
                C'est l'avantage du forfait!
              </div>
            </details>

            <details className="group border border-on-surface/10 rounded-lg overflow-hidden hover:border-primary/30 transition-colors">
              <summary className="flex items-center justify-between cursor-pointer p-6 bg-surface hover:bg-surface-light transition-colors">
                <h3 className="text-lg font-semibold text-on-surface pr-4">
                  Comment le taxi connaît le forfait correct?
                </h3>
              </summary>
              <div className="px-6 pb-6 bg-background text-on-surface-dim leading-relaxed">
                Les taxis parisiens sont équipés d'un <strong>taximètre homologué</strong> qui reconnaît automatiquement
                le forfait aéroport selon votre destination. Vous pouvez voir le tarif afficher sur le compteur avant de partir.
              </div>
            </details>

            <details className="group border border-on-surface/10 rounded-lg overflow-hidden hover:border-primary/30 transition-colors">
              <summary className="flex items-center justify-between cursor-pointer p-6 bg-surface hover:bg-surface-light transition-colors">
                <h3 className="text-lg font-semibold text-on-surface pr-4">
                  Puis-je payer moins avec un autre taxi ou VTC?
                </h3>
              </summary>
              <div className="px-6 pb-6 bg-background text-on-surface-dim leading-relaxed">
                <strong>Non, les forfaits s'appliquent à tous.</strong> Les VTC (services de transport avec chauffeur) ne sont
                <strong>pas soumis</strong> à ces forfaits et peuvent pratiquer des tarifs différents. Les taxis parisiens conventionnés
                sont obligés de respecter les forfaits. Avec Taxi Leblanc, vous obtenez le tarif légal maximum garanti.
              </div>
            </details>

            <details className="group border border-on-surface/10 rounded-lg overflow-hidden hover:border-primary/30 transition-colors">
              <summary className="flex items-center justify-between cursor-pointer p-6 bg-surface hover:bg-surface-light transition-colors">
                <h3 className="text-lg font-semibold text-on-surface pr-4">
                  Existe-t-il des réductions pour réservation en ligne?
                </h3>
              </summary>
              <div className="px-6 pb-6 bg-background text-on-surface-dim leading-relaxed">
                Les forfaits sont <strong>réglementés et identiques</strong> peu importe comment vous réservez (téléphone, en ligne, app).
                Cependant, certains services peuvent offrir des avantages comme la garantie de disponibilité ou une prise en charge fiable.
              </div>
            </details>

            <details className="group border border-on-surface/10 rounded-lg overflow-hidden hover:border-primary/30 transition-colors">
              <summary className="flex items-center justify-between cursor-pointer p-6 bg-surface hover:bg-surface-light transition-colors">
                <h3 className="text-lg font-semibold text-on-surface pr-4">
                  Que se passe-t-il si je vais à un autre terminal?
                </h3>
              </summary>
              <div className="px-6 pb-6 bg-background text-on-surface-dim leading-relaxed">
                Les forfaits aéroports couvrent <strong>tous les terminaux</strong> de CDG, Orly et Beauvais. Peu importe le terminal,
                le prix reste le même. Si le trajet intra-aéroport est demandé, des frais supplémentaires minimes peuvent s'ajouter.
              </div>
            </details>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-surface">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-serif font-bold text-on-surface mb-6">
            Prêt à Réserver?
          </h2>
          <p className="text-on-surface-dim text-lg mb-8">
            Réservez votre taxi aéroport maintenant avec tarif forfaitaire garanti.
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
