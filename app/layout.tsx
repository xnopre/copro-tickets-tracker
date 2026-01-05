import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/presentation/components/Providers';
import { Header } from '@/presentation/components/Header';

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
          <Header />
          <main className="min-h-screen bg-gray-50 p-8">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
