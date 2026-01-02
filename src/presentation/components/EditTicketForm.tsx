'use client';

import { useState, useEffect } from 'react';
import { Ticket } from '@/domain/entities/Ticket';
import { TicketStatus } from '@/domain/value-objects/TicketStatus';
import { UserPublic } from '@/domain/entities/User';
import { statusLabels } from '@/presentation/constants/ticketDisplay';
import Button from '@/presentation/components/ui/Button';
import Input from '@/presentation/components/ui/Input';
import Textarea from '@/presentation/components/ui/Textarea';
import Select from '@/presentation/components/ui/Select';
import Alert from '@/presentation/components/ui/Alert';
import Card from '@/presentation/components/ui/Card';
import { logger } from '@/infrastructure/services/logger';

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
        logger.error('Error fetching users', err);
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

  return (
    <Card>
      <form onSubmit={handleSubmit} aria-label="Formulaire de modification de ticket">
        <div className="mb-4">
          <Input
            type="text"
            id="edit-title"
            label="Titre"
            value={title}
            onChange={e => setTitle(e.target.value)}
            disabled={isSubmitting}
            required
            autoComplete="off"
          />
        </div>

        <div className="mb-4">
          <Textarea
            id="edit-description"
            label="Description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={4}
            disabled={isSubmitting}
            required
            autoComplete="off"
          />
        </div>

        <div className="mb-4">
          <Select
            id="edit-status"
            label="Statut"
            value={status}
            onChange={e => setStatus(e.target.value as TicketStatus)}
            disabled={isSubmitting}
            required
          >
            {Object.values(TicketStatus).map(statusValue => (
              <option key={statusValue} value={statusValue}>
                {statusLabels[statusValue]}
              </option>
            ))}
          </Select>
        </div>

        <div className="mb-4">
          <Select
            id="edit-assignedTo"
            label="Personne assignée"
            value={assignedTo}
            onChange={e => setAssignedTo(e.target.value)}
            disabled={isSubmitting || isLoadingUsers}
            aria-label="Sélectionner une personne assignée"
            helperText={isLoadingUsers ? 'Chargement des utilisateurs...' : undefined}
          >
            <option value="">Non assigné</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>
                {user.firstName} {user.lastName}
              </option>
            ))}
          </Select>
        </div>

        {error && (
          <Alert variant="error" id="form-error">
            {error}
          </Alert>
        )}

        {success && <Alert variant="success">Ticket mis à jour avec succès !</Alert>}

        <div className="flex gap-3">
          <Button type="submit" disabled={isSubmitting} className="flex-1" aria-busy={isSubmitting}>
            {isSubmitting ? 'Enregistrement en cours...' : 'Enregistrer'}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isSubmitting}
            className="flex-1"
            aria-label="Annuler la modification"
          >
            Annuler
          </Button>
        </div>
      </form>
    </Card>
  );
}
