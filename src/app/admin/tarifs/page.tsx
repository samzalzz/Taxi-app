'use client';

import { PricingManagement } from '@/components/features/admin/PricingManagement';

export default function PricingPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-on-surface mb-2">
          Gestion des tarifs
        </h1>
        <p className="text-on-surface-dim">
          Configurez les tarifs de base pour les courses de la plateforme
        </p>
      </div>

      <PricingManagement />
    </div>
  );
}
