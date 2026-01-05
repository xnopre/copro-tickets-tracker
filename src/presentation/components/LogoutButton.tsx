'use client';

import { signOut } from 'next-auth/react';
import { useState } from 'react';
import Button from '@/presentation/components/ui/Button';

export function LogoutButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogout = async () => {
    setError(null);
    setIsLoading(true);
    try {
      await signOut({ redirect: true, callbackUrl: '/' });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la déconnexion';
      setError(errorMessage);
      console.error('Logout failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Button
        variant="danger"
        size="md"
        onClick={handleLogout}
        disabled={isLoading}
        aria-busy={isLoading}
      >
        {isLoading ? 'Déconnexion en cours...' : 'Déconnexion'}
      </Button>
      {error && (
        <div
          role="alert"
          aria-live="assertive"
          className="mt-2 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}
    </div>
  );
}
