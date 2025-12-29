'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/presentation/components/ui/Button';

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
      <Button variant="danger" onClick={handleArchiveClick} aria-label="Archiver le ticket">
        Archiver
      </Button>

      {showConfirmation && (
        <div
          className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black"
          role="dialog"
          aria-modal="true"
          aria-labelledby="archive-confirmation-title"
        >
          <div className="mx-4 w-full max-w-md rounded-lg bg-white p-6">
            <h2 id="archive-confirmation-title" className="mb-4 text-xl font-bold">
              Confirmer l'archivage
            </h2>
            <p className="mb-6">
              Êtes-vous sûr de vouloir archiver ce ticket ? Le ticket ne sera plus visible dans la
              liste principale.
            </p>

            {error && (
              <div
                className="mb-4 rounded border border-red-400 bg-red-100 p-3 text-red-700"
                role="alert"
              >
                {error}
              </div>
            )}

            <div className="flex justify-end gap-4">
              <Button variant="secondary" onClick={handleCancelArchive} disabled={isArchiving}>
                Annuler
              </Button>
              <Button
                variant="danger"
                onClick={handleConfirmArchive}
                disabled={isArchiving}
                aria-busy={isArchiving}
              >
                {isArchiving ? 'Archivage en cours...' : 'Confirmer'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
