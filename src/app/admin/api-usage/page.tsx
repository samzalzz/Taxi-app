import { ApiUsageManagement } from '@/components/features/admin/ApiUsageManagement';

export const metadata = {
  title: 'Utilisation des APIs — Admin',
};

export default function ApiUsagePage() {
  return (
    <main className="space-y-8">
      <ApiUsageManagement />
    </main>
  );
}
