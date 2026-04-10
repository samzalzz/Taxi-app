'use client';

import { useState } from 'react';
import { AdminCalendarView } from '@/components/features/admin/AdminCalendarView';
import { BookingStatus } from '@/generated/prisma/client';

export default function AdminCalendarPage() {
  const [selectedStatus, setSelectedStatus] = useState<BookingStatus | undefined>();

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-on-surface mb-2">Calendrier des courses</h1>
        <p className="text-on-surface-dim">Vue d&apos;ensemble de toutes les courses de la plateforme</p>
      </div>

      <AdminCalendarView
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
      />
    </div>
  );
}
