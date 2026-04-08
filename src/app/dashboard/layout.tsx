import { getSession } from '@/lib/auth/session';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { DashboardSidebar } from '@/components/layout/DashboardSidebar';
import { PageTransition } from '@/components/ui/PageTransition';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <DashboardHeader />

      <div className="flex relative">
        {/* Sidebar with Toggle */}
        <DashboardSidebar session={session} />

        {/* Main Content */}
        <main className="flex-1 p-8 w-full lg:w-auto">
          <PageTransition>
            {children}
          </PageTransition>
        </main>
      </div>
    </div>
  );
}
