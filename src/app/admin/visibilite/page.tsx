'use client';

import { BookingsVisibilityManager } from '@/components/features/admin/BookingsVisibilityManager';

export default function VisibilityPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-on-surface mb-2">
          Visibilité des courses
        </h1>
        <p className="text-on-surface-dim">
          Gérez la visibilité publique ou privée de chaque course
        </p>
      </div>

      <BookingsVisibilityManager />
    </div>
  );
}
