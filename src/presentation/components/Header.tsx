'use client';

import { useSession } from 'next-auth/react';
import Container from '@/presentation/components/ui/Container';
import { LogoutButton } from './LogoutButton';

export function Header() {
  const { data: session } = useSession();

  if (!session) return null;

  return (
    <header className="border-b border-gray-200 bg-white shadow-sm">
      <Container size="lg" className="flex items-center justify-between py-4">
        <h1 className="text-2xl font-bold text-gray-900">CoTiTra</h1>
        <div className="flex items-center gap-6">
          <div className="text-gray-700">
            Connecté en tant que :{' '}
            <span className="font-semibold">
              {session.user.firstName} {session.user.lastName}
            </span>
          </div>
          <LogoutButton />
        </div>
      </Container>
    </header>
  );
}
