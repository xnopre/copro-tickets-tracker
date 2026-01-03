import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/presentation/components/Providers';

export const metadata: Metadata = {
  title: 'CoTiTra',
  description: 'Copro Tickets Tracker - Gestion de tickets pour copropriété',
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="antialiased">
        <Providers>
          <main className="min-h-screen bg-gray-50 p-8">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
