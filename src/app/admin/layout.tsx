import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth/session';
import { AdminHeader } from '@/components/layout/AdminHeader';
import { AdminSidebar } from '@/components/layout/AdminSidebar';

export const metadata = {
  title: 'Admin Panel — Taxi Leblanc',
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  // If no session, redirect to login
  if (!session) {
    redirect('/connexion');
  }

  // If not admin, redirect to appropriate dashboard
  if (session.role !== 'ADMIN') {
    redirect(session.role === 'DRIVER' ? '/dashboard/chauffeur' : '/dashboard');
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <AdminHeader />

      {/* Content with padding to account for fixed navbar */}
      <div className="flex relative pt-16">
        {/* Sidebar with Toggle */}
        <AdminSidebar />

        {/* Main Content */}
        <main className="flex-1 p-8 w-full lg:w-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
