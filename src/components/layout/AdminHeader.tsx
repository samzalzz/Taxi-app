'use client';

import { DashboardHeader } from './DashboardHeader';

/**
 * Admin top navigation header with NotificationBell.
 * Re-exports DashboardHeader with admin-specific defaults.
 */
export function AdminHeader() {
  return (
    <DashboardHeader
      title="Taxi Leblanc — Admin"
      logoHref="/admin"
    />
  );
}
