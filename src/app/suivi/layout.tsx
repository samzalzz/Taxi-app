import type { Metadata } from 'next';

// page.tsx is a client component, so its metadata lives here
export const metadata: Metadata = {
  title: 'Suivi de réservation | Taxi Leblanc',
  description: 'Suivez votre course Taxi Leblanc avec votre code de réservation.',
  robots: { index: false, follow: true },
};

export default function SuiviLayout({ children }: { children: React.ReactNode }) {
  return children;
}
