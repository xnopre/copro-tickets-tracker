'use client';

import { useState } from 'react';
import { Ticket } from '@/domain/entities/Ticket';
import { TicketStatus } from '@/domain/value-objects/TicketStatus';
import { statusLabels } from '@/presentation/constants/ticketDisplay';

interface EditTicketFormProps {
  ticketId: string;
  currentTitle: string;
  currentDescription: string;
  currentStatus: TicketStatus;
  currentAssignedTo: string | null;
  onTicketUpdated: (ticket: Ticket) => void;
  onCancel: () => void;
}

export default function EditTicketForm({
  ticketId,
  currentTitle,
  currentDescription,
  currentStatus,
  currentAssignedTo,
  onTicketUpdated,
  onCancel,
}: EditTicketFormProps) {
  const [title, setTitle] = useState(currentTitle);
  const [description, setDescription] = useState(currentDescription);
  const [status, setStatus] = useState<TicketStatus>(currentStatus);
  const [assignedTo, setAssignedTo] = useState(currentAssignedTo || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!title.trim()) {
      setError('Le titre est requis');
      return;
    }

    if (title.trim().length > 200) {
      setError('Le titre ne doit pas dépasser 200 caractères');
      return;
    }

    if (!description.trim()) {
      setError('La description est requise');
      return;
    }

    if (description.trim().length > 5000) {
      setError('La description ne doit pas dépasser 5000 caractères');
      return;
    }

    const trimmedAssignedTo = assignedTo.trim() || null;

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/tickets/${ticketId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          status,
          assignedTo: trimmedAssignedTo,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la mise à jour du ticket');
      }

      // Convert date strings to Date objects
      const updatedTicket: Ticket = {
        ...data,
        createdAt: new Date(data.createdAt),
        updatedAt: new Date(data.updatedAt),
      };

      setSuccess(true);
      onTicketUpdated(updatedTicket);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour du ticket');
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasError = error !== null;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <form onSubmit={handleSubmit} aria-label="Formulaire de modification de ticket">
        <div className="mb-4">
          <label htmlFor="edit-title" className="block text-sm font-medium text-gray-700 mb-2">
            Titre <span aria-label="requis">*</span>
          </label>
          <input
            type="text"
            id="edit-title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isSubmitting}
            aria-required="true"
            aria-invalid={hasError && !title.trim()}
            aria-describedby={hasError && !title.trim() ? 'form-error' : undefined}
            autoComplete="off"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="edit-description"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Description <span aria-label="requis">*</span>
          </label>
          <textarea
            id="edit-description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isSubmitting}
            aria-required="true"
            aria-invalid={hasError && !description.trim()}
            aria-describedby={hasError && !description.trim() ? 'form-error' : undefined}
            autoComplete="off"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="edit-status" className="block text-sm font-medium text-gray-700 mb-2">
            Statut <span aria-label="requis">*</span>
          </label>
          <select
            id="edit-status"
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
          <label htmlFor="edit-assignedTo" className="block text-sm font-medium text-gray-700 mb-2">
            Personne assignée
          </label>
          <input
            type="text"
            id="edit-assignedTo"
            value={assignedTo}
            onChange={e => setAssignedTo(e.target.value)}
            placeholder="Nom de la personne en charge"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isSubmitting}
            aria-invalid={hasError && !assignedTo.trim()}
            aria-describedby={hasError && !assignedTo.trim() ? 'form-error' : undefined}
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

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-busy={isSubmitting}
          >
            {isSubmitting ? 'Enregistrement en cours...' : 'Enregistrer'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Annuler la modification"
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
}
