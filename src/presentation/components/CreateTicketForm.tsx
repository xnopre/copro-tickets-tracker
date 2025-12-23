'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

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

  const hasError = error !== null;

  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <form onSubmit={handleSubmit} aria-label="Formulaire de création de ticket">
        <div className="mb-4">
          <label htmlFor="title" className="mb-2 block text-sm font-medium text-gray-700">
            Titre <span aria-label="requis">*</span>
          </label>
          <input
            type="text"
            id="title"
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
          <label htmlFor="description" className="mb-2 block text-sm font-medium text-gray-700">
            Description <span aria-label="requis">*</span>
          </label>
          <textarea
            id="description"
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
            Ticket créé avec succès !
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          aria-busy={isSubmitting}
        >
          {isSubmitting ? 'Création en cours...' : 'Créer le ticket'}
        </button>
      </form>
    </div>
  );
}
