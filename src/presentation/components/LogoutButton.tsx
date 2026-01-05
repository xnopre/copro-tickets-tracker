'use client';

import { signOut } from 'next-auth/react';
import { useState } from 'react';
import Button from '@/presentation/components/ui/Button';

export function LogoutButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await signOut({ redirect: true, callbackUrl: '/' });
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="danger"
      size="md"
      onClick={handleLogout}
      disabled={isLoading}
      aria-busy={isLoading}
    >
      {isLoading ? 'Déconnexion en cours...' : 'Déconnexion'}
    </Button>
  );
}
