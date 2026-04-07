'use client';

import { SettingsManagement } from '@/components/features/admin/SettingsManagement';
import { EmailTemplatesManagement } from '@/components/features/admin/EmailTemplatesManagement';

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-on-surface mb-2">
          Paramètres
        </h1>
        <p className="text-on-surface-dim">
          Gérez les paramètres de l'application, les clés API et les emails
        </p>
      </div>

      <SettingsManagement />
      <EmailTemplatesManagement />
    </div>
  );
}
