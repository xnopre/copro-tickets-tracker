'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TicketStatus } from '@/domain/value-objects/TicketStatus';
import { statusLabels } from '../constants/ticketDisplay';

interface UpdateTicketStatusFormProps {
  ticketId: string;
  currentStatus: TicketStatus;
  currentAssignedTo: string | null;
}

export default function UpdateTicketStatusForm({
  ticketId,
  currentStatus,
  currentAssignedTo,
}: UpdateTicketStatusFormProps) {
  const [status, setStatus] = useState<TicketStatus>(currentStatus);
  const [assignedTo, setAssignedTo] = useState(currentAssignedTo || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const trimmedAssignedTo = assignedTo.trim();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!trimmedAssignedTo) {
      setError('Le nom de la personne assignée est requis');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/tickets/${ticketId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status, assignedTo: trimmedAssignedTo }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la mise à jour du ticket');
      }

      setSuccess(true);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour du ticket');
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasError = error !== null;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-6">
      <h2 className="text-xl font-semibold mb-4">Mettre à jour le ticket</h2>
      <form onSubmit={handleSubmit} aria-label="Formulaire de mise à jour du statut">
        <div className="mb-4">
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
            Statut <span aria-label="requis">*</span>
          </label>
          <select
            id="status"
            value={status}
            onChange={e => setStatus(e.target.value as TicketStatus)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isSubmitting}
            aria-required="true"
          >
            {Object.values(TicketStatus).map(statusValue => (
              <option key={statusValue} value={statusValue}>
                {statusLabels[statusValue]}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="assignedTo" className="block text-sm font-medium text-gray-700 mb-2">
            Personne assignée <span aria-label="requis">*</span>
          </label>
          <input
            type="text"
            id="assignedTo"
            value={assignedTo}
            onChange={e => setAssignedTo(e.target.value)}
            placeholder="Nom de la personne en charge"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isSubmitting}
            aria-required="true"
            aria-invalid={hasError && !trimmedAssignedTo}
            aria-describedby={hasError && !trimmedAssignedTo ? 'form-error' : undefined}
            autoComplete="off"
          />
        </div>

        {error && (
          <div
            id="form-error"
            className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm"
            role="alert"
            aria-live="assertive"
          >
            {error}
          </div>
        )}

        {success && (
          <div
            className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-md text-sm"
            role="status"
            aria-live="polite"
          >
            Ticket mis à jour avec succès !
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-busy={isSubmitting}
        >
          {isSubmitting ? 'Mise à jour en cours...' : 'Mettre à jour'}
        </button>
      </form>
    </div>
  );
}
