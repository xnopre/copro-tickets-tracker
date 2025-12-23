'use client';

import { useState, useEffect } from 'react';
import { Ticket } from '@/domain/entities/Ticket';
import { TicketStatus } from '@/domain/value-objects/TicketStatus';
import { UserPublic } from '@/domain/entities/User';
import { statusLabels } from '@/presentation/constants/ticketDisplay';

interface EditTicketFormProps {
  ticketId: string;
  currentTitle: string;
  currentDescription: string;
  currentStatus: TicketStatus;
  currentAssignedTo: UserPublic | null;
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
  const [assignedTo, setAssignedTo] = useState(currentAssignedTo?.id || '');
  const [users, setUsers] = useState<UserPublic[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Charger la liste des utilisateurs
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users');
        if (!response.ok) {
          throw new Error('Erreur lors du chargement des utilisateurs');
        }
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Impossible de charger la liste des utilisateurs');
      } finally {
        setIsLoadingUsers(false);
      }
    };

    fetchUsers();
  }, []);

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
    <div className="rounded-lg bg-white p-6 shadow-md">
      <form onSubmit={handleSubmit} aria-label="Formulaire de modification de ticket">
        <div className="mb-4">
          <label htmlFor="edit-title" className="mb-2 block text-sm font-medium text-gray-700">
            Titre <span aria-label="requis">*</span>
          </label>
          <input
            type="text"
            id="edit-title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Description <span aria-label="requis">*</span>
          </label>
          <textarea
            id="edit-description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={4}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
            disabled={isSubmitting}
            aria-required="true"
            aria-invalid={hasError && !description.trim()}
            aria-describedby={hasError && !description.trim() ? 'form-error' : undefined}
            autoComplete="off"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="edit-status" className="mb-2 block text-sm font-medium text-gray-700">
            Statut <span aria-label="requis">*</span>
          </label>
          <select
            id="edit-status"
            value={status}
            onChange={e => setStatus(e.target.value as TicketStatus)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
          <label htmlFor="edit-assignedTo" className="mb-2 block text-sm font-medium text-gray-700">
            Personne assignée
          </label>
          <select
            id="edit-assignedTo"
            value={assignedTo}
            onChange={e => setAssignedTo(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
            disabled={isSubmitting || isLoadingUsers}
            aria-label="Sélectionner une personne assignée"
          >
            <option value="">Non assigné</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>
                {user.firstName} {user.lastName}
              </option>
            ))}
          </select>
          {isLoadingUsers && (
            <p className="mt-1 text-sm text-gray-500">Chargement des utilisateurs...</p>
          )}
        </div>

        {error && (
          <div
            id="form-error"
            className="mb-4 rounded-md border border-red-400 bg-red-100 p-3 text-sm text-red-700"
            role="alert"
            aria-live="assertive"
          >
            {error}
          </div>
        )}

        {success && (
          <div
            className="mb-4 rounded-md border border-green-400 bg-green-100 p-3 text-sm text-green-700"
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
            className="flex-1 rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            aria-busy={isSubmitting}
          >
            {isSubmitting ? 'Enregistrement en cours...' : 'Enregistrer'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="flex-1 rounded-md bg-gray-200 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-300 focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Annuler la modification"
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
}
