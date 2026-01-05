'use client';

import { signOut } from 'next-auth/react';
import { useState } from 'react';

export function LogoutButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await signOut({ redirectTo: '/' });
    } catch {
      // Silently handle error - signOut typically handles redirects internally
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      aria-busy={isLoading}
      className="rounded-md bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-400"
    >
      {isLoading ? 'Déconnexion en cours...' : 'Déconnexion'}
    </button>
  );
}
