'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/presentation/components/ui/Button';
import Input from '@/presentation/components/ui/Input';
import Textarea from '@/presentation/components/ui/Textarea';
import Alert from '@/presentation/components/ui/Alert';
import Card from '@/presentation/components/ui/Card';

export default function CreateTicketForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!title.trim()) {
      setError('Le titre est requis');
      return;
    }

    if (!description.trim()) {
      setError('La description est requise');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la création du ticket');
      }

      // Rediriger vers la page de détail du ticket créé (pas de race condition)
      setSuccess(true);
      setTimeout(() => {
        router.push(`/tickets/${data.id}`);
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la création du ticket');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit} aria-label="Formulaire de création de ticket">
        <div className="mb-4">
          <Input
            type="text"
            id="title"
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
            id="description"
            label="Description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={4}
            disabled={isSubmitting}
            required
            autoComplete="off"
          />
        </div>

        {error && (
          <Alert variant="error" id="form-error">
            {error}
          </Alert>
        )}

        {success && <Alert variant="success">Ticket créé avec succès !</Alert>}

        <Button type="submit" disabled={isSubmitting} className="w-full" aria-busy={isSubmitting}>
          {isSubmitting ? 'Création en cours...' : 'Créer le ticket'}
        </Button>
      </form>
    </Card>
  );
}
