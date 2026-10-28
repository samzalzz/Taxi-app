import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Suivi de course | Taxi Leblanc',
  description: 'Suivez votre course Taxi Leblanc en temps réel.',
  robots: { index: false, follow: false },
};

export default function SuiviLayout({ children }: { children: React.ReactNode }) {
  return children;
}
