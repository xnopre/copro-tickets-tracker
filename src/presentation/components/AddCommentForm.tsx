'use client';

import { useState, useEffect } from 'react';
import { Comment } from '@/domain/entities/Comment';
import Button from '@/presentation/components/ui/Button';
import Textarea from '@/presentation/components/ui/Textarea';
import Alert from '@/presentation/components/ui/Alert';
import Card from '@/presentation/components/ui/Card';

interface AddCommentFormProps {
  ticketId: string;
  onCommentAdded: (comment: Comment) => void;
}

export default function AddCommentForm({ ticketId, onCommentAdded }: AddCommentFormProps) {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Nettoyer le message de succès après 2 secondes
  useEffect(() => {
    if (!success) return;

    const timeoutId = setTimeout(() => {
      setSuccess(false);
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [success]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!content.trim()) {
      setError('Le contenu du commentaire est requis');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/tickets/${ticketId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de l'ajout du commentaire");
      }

      // Convertir la date ISO string en Date
      const comment: Comment = {
        ...data,
        createdAt: new Date(data.createdAt),
      };

      setSuccess(true);
      setContent('');

      // Ajouter le commentaire immédiatement (pas de race condition)
      onCommentAdded(comment);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'ajout du commentaire");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card variant="bordered" shadow="sm">
      <h3 className="mb-4 text-lg font-semibold text-gray-900">Ajouter un commentaire</h3>
      <form onSubmit={handleSubmit} aria-label="Formulaire d'ajout de commentaire">
        <div className="mb-4">
          <Textarea
            id="content"
            label="Commentaire"
            value={content}
            onChange={e => setContent(e.target.value)}
            rows={3}
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

        {success && <Alert variant="success">Commentaire ajouté avec succès !</Alert>}

        <Button type="submit" disabled={isSubmitting} className="w-full" aria-busy={isSubmitting}>
          {isSubmitting ? 'Ajout en cours...' : 'Ajouter le commentaire'}
        </Button>
      </form>
    </Card>
  );
}
