import type { Metadata, Viewport } from 'next';
import { Noto_Serif, Manrope } from 'next/font/google';
import './globals.css';
import { ClientProviders } from '@/components/providers/ClientProviders';

const notoSerif = Noto_Serif({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
});

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Taxi Leblanc - Votre Taxi de Route',
  description: 'Service de taxi premium en Île-de-France',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${notoSerif.variable} ${manrope.variable}`} suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#d4af37" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='75' font-size='75' fill='%23f5c518'>🚕</text></svg>" />
      </head>
      <body className="bg-background text-on-surface antialiased">
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
