'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface ArchiveTicketButtonProps {
  ticketId: string;
}

export default function ArchiveTicketButton({ ticketId }: ArchiveTicketButtonProps) {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleArchiveClick = () => {
    setShowConfirmation(true);
  };

  const handleCancelArchive = () => {
    setShowConfirmation(false);
  };

  const handleConfirmArchive = async () => {
    setIsArchiving(true);
    setError(null);

    try {
      const response = await fetch(`/api/tickets/${ticketId}/archive`, {
        method: 'PATCH',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Erreur lors de l'archivage");
      }

      router.push('/');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'archivage");
      setIsArchiving(false);
    }
  };

  return (
    <>
      <button
        onClick={handleArchiveClick}
        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        aria-label="Archiver le ticket"
      >
        Archiver
      </button>

      {showConfirmation && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="archive-confirmation-title"
        >
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 id="archive-confirmation-title" className="text-xl font-bold mb-4">
              Confirmer l'archivage
            </h2>
            <p className="mb-6">
              Êtes-vous sûr de vouloir archiver ce ticket ? Le ticket ne sera plus visible dans la
              liste principale.
            </p>

            {error && (
              <div
                className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded"
                role="alert"
              >
                {error}
              </div>
            )}

            <div className="flex gap-4 justify-end">
              <button
                onClick={handleCancelArchive}
                disabled={isArchiving}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Annuler
              </button>
              <button
                onClick={handleConfirmArchive}
                disabled={isArchiving}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-busy={isArchiving}
              >
                {isArchiving ? 'Archivage en cours...' : 'Confirmer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
