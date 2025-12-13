import type { Metadata } from 'next';
import './globals.css';

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
      <body className="antialiased">{children}</body>
    </html>
  );
}
